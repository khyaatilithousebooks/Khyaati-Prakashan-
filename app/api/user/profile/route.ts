import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "@/lib/auth/session";
import { getFirebaseAdminDb } from "@/lib/firebase-admin";
import type { Book, UserRecord } from "@/lib/types";

export const runtime = "nodejs";

type UserDoc = {
  data: UserRecord;
  ref: FirebaseFirestore.DocumentReference;
};

async function getUserDocByEmail(email: string): Promise<UserDoc | null> {
  const db = getFirebaseAdminDb();
  const candidates = Array.from(
    new Set([email.trim(), email.trim().toLowerCase()])
  ).filter(Boolean);

  for (const candidate of candidates) {
    const snap = await db
      .collection("users")
      .where("email", "==", candidate)
      .limit(1)
      .get();

    if (!snap.empty) {
      const doc = snap.docs[0];
      return { data: doc.data() as UserRecord, ref: doc.ref };
    }
  }

  return null;
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await verifySessionToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userDoc = await getUserDocByEmail(payload.email);
  const user = userDoc?.data;

  return NextResponse.json({
    username: user?.username ?? payload.username ?? "",
    email: payload.email ?? "",
    bio: user?.bio ?? "",
    books: (user?.books ?? []) as Book[],
  });
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { username, bio } = (body as Record<string, unknown>) ?? {};

  if (typeof username !== "string") {
    return NextResponse.json(
      { error: "Username is required." },
      { status: 400 }
    );
  }

  const userDoc = await getUserDocByEmail(payload.email);
  if (!userDoc) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const update: Partial<UserRecord> = {
    username,
    email: payload.email,
    bio: typeof bio === "string" ? bio : "",
  };

  await userDoc.ref.set(update, { merge: true });

  return NextResponse.json({ ok: true, user: update });
}
