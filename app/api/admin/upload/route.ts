import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import * as XLSX from "xlsx";
import { FieldValue } from "firebase-admin/firestore";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { assertAdmin } from "@/lib/auth/admin";
import { getFirebaseAdminDb } from "@/lib/firebase-admin";
import type { Book, StockRow, UserRecord } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeKey(key: string) {
  return String(key).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getField(
  row: Record<string, unknown>,
  candidates: string[],
  fallbackValue = ""
) {
  const normalized = Object.entries(row).reduce<Record<string, unknown>>(
    (acc, [fieldKey, value]) => {
      acc[normalizeKey(fieldKey)] = value;
      return acc;
    },
    {}
  );

  for (const candidate of candidates) {
    if (normalized[candidate] !== undefined) {
      return normalized[candidate];
    }
  }

  return fallbackValue;
}

function toNumber(value: unknown, defaultValue = 0) {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : defaultValue;
  }

  const cleaned = String(value).replace(/,/g, "").replace(/%/g, "").trim();
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : defaultValue;
}

function hashPassword(password: unknown) {
  return crypto
    .createHash("sha256")
    .update(String(password ?? ""))
    .digest("hex");
}

function slugify(value: unknown) {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildStockRow(
  row: Record<string, unknown>,
  idx: number
): StockRow {
  const stockNumber =
    getField(row, ["edition", "stocknumber", "editionnumber"]) ||
    `ED-${idx + 1}`;

  let royalty = toNumber(getField(row, ["royalty", "royaltypercent"]));
  if (royalty > 0 && royalty <= 1) {
    royalty = royalty * 100;
  }

  return {
    stockNumber: String(stockNumber || `ED-${idx + 1}`),
    price: toNumber(getField(row, ["price", "mrp", "cost"])),
    royaltyPercent: royalty,
    totalStock: toNumber(getField(row, ["print", "totalstock", "printqty"])),
    soldStock: toNumber(getField(row, ["sold", "stock", "soldstock"])),
    earnings: toNumber(getField(row, ["royaltyamount", "earnings", "amount"])),
    settledAmount: 0,
    leftRoyalty: toNumber(
      getField(row, ["leftroyalty", "balance", "leftbalance", "left"])
    ),
  };
}

function buildBook(
  row: Record<string, unknown>,
  username: string,
  idx: number
): Book {
  const title = String(
    getField(row, ["title"]) || `Untitled-${idx + 1}`
  ).trim();
  const isbn = String(getField(row, ["isbn"])) || "";
  const description = String(getField(row, ["description"])) || "";
  const id = `${slugify(username)}-${slugify(title) || `book-${idx + 1}`}`;

  return {
    id,
    title,
    isbn,
    description,
    images: ["/book-cover-1.svg", "/book-cover-2.svg"],
    stock: [],
  };
}

function parseWorkbook(buffer: Buffer): UserRecord[] {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const users: UserRecord[] = [];

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: "",
    });
    if (!rows.length) return;

    const booksByTitle = new Map<string, Book>();

    const emailRaw =
      getField(rows[0], ["email", "mail"]) ||
      `${slugify(sheetName) || "user"}@example.com`;
    const email = String(emailRaw).trim().toLowerCase();
    const password = getField(rows[0], ["password", "pass"], "changeme");

    rows.forEach((row, idx) => {
      const titleKey = String(getField(row, ["title"]) || "").trim();
      if (!titleKey) return;

      const existing = booksByTitle.get(titleKey);
      const stockRow = buildStockRow(row, idx);

      if (existing) {
        existing.stock.push(stockRow);
        return;
      }

      const book = buildBook(row, sheetName, idx);
      book.stock.push(stockRow);
      booksByTitle.set(titleKey, book);
    });

    const books = Array.from(booksByTitle.values());

    users.push({
      username: sheetName,
      email: String(email),
      passwordHash: hashPassword(password),
      books,
    });
  });

  return users;
}

async function syncUsers(users: UserRecord[]) {
  const db = getFirebaseAdminDb();
  const collection = db.collection("users");
  const now = FieldValue.serverTimestamp();

  // Load existing users to match by normalized email
  const existingSnap = await collection.get();
  const existingByEmail = new Map<string, FirebaseFirestore.QueryDocumentSnapshot>();
  existingSnap.docs.forEach((doc) => {
    const email = String((doc.data()?.email ?? "")).trim().toLowerCase();
    if (email) existingByEmail.set(email, doc);
  });

  const seenDocIds = new Set<string>();

  // Upsert incoming users, matching on email when possible
  for (let i = 0; i < users.length; i += 400) {
    const batch = db.batch();
    users.slice(i, i + 400).forEach((user, idx) => {
      const normalizedEmail = String(user.email ?? "")
        .trim()
        .toLowerCase();
      const existingDoc = normalizedEmail
        ? existingByEmail.get(normalizedEmail)
        : undefined;

      const docRef = existingDoc
        ? existingDoc.ref
        : collection.doc(
            slugify(user.username) ||
              slugify(user.email) ||
              `user-${i + idx + 1}`
          );

      seenDocIds.add(docRef.id);

      batch.set(docRef, {
        ...user,
        email: normalizedEmail || user.email,
        updatedAt: now,
      });
    });
    await batch.commit();
  }

  // Delete any docs not present in the uploaded set
  const toDelete = existingSnap.docs.filter((doc) => !seenDocIds.has(doc.id));
  for (let i = 0; i < toDelete.length; i += 450) {
    const batch = db.batch();
    toDelete.slice(i, i + 450).forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await verifySessionToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    assertAdmin(payload);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const users = parseWorkbook(buffer);

    if (!users.length) {
      return NextResponse.json(
        { error: "No data found in workbook" },
        { status: 400 }
      );
    }

    await syncUsers(users);
  } catch (error) {
    console.error("Failed to sync workbook to Firestore", error);
    return NextResponse.json(
      { error: "Sync failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
