/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const crypto = require("crypto");

const INPUT_PATH = path.join(process.cwd(), "data", "users.xlsx");
const OUTPUT_PATH = path.join(process.cwd(), "lib", "mock", "generated-users.ts");

function normalizeKey(key) {
  return String(key).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getField(row, candidates, fallbackValue = "") {
  const normalized = Object.entries(row).reduce((acc, [key, value]) => {
    acc[normalizeKey(key)] = value;
    return acc;
  }, {});

  for (const candidate of candidates) {
    if (normalized[candidate] !== undefined) {
      return normalized[candidate];
    }
  }

  return fallbackValue;
}

function toNumber(value, defaultValue = 0) {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === "number") return Number.isFinite(value) ? value : defaultValue;

  const cleaned = String(value)
    .replace(/,/g, "")
    .replace(/%/g, "")
    .trim();

  const n = Number(cleaned);
  return Number.isFinite(n) ? n : defaultValue;
}

function hashPassword(password) {
  return crypto.createHash("sha256").update(String(password)).digest("hex");
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildStockRow(row, idx) {
  const stockNumber =
    getField(row, ["edition", "stocknumber", "editionnumber"]) ||
    `ED-${idx + 1}`;

  let royalty = toNumber(getField(row, ["royalty", "royaltypercent"]));
  // If Excel stores 10% as 0.1, normalize it back to 10
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

function buildBook(row, username, idx) {
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

function readWorkbook() {
  if (!fs.existsSync(INPUT_PATH)) {
    throw new Error(
      `Input Excel not found at ${INPUT_PATH}. Place your workbook there.`
    );
  }

  const workbook = XLSX.readFile(INPUT_PATH);
  const users = [];

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    if (!rows.length) return;

    const booksByTitle = new Map();

    const email =
      getField(rows[0], ["email", "mail"]) ||
      `${slugify(sheetName) || "user"}@example.com`;
    const password = String(
      getField(rows[0], ["password", "pass"], "changeme")
    );

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
      email,
      passwordHash: hashPassword(password),
      books,
    });
  });

  return users;
}

function writeGeneratedFile(users) {
  const header = `/* AUTO-GENERATED FILE. DO NOT EDIT BY HAND.
 * Run: npm run sync:data
 */\n`;

  const body = `export type GeneratedStockRow = {
  stockNumber: string;
  price: number;
  royaltyPercent: number;
  totalStock: number;
  soldStock: number;
  earnings: number;
  settledAmount: number;
  leftRoyalty: number;
};

export type GeneratedBook = {
  id: string;
  title: string;
  isbn: string;
  description: string;
  images: string[];
  stock: GeneratedStockRow[];
};

export type GeneratedUser = {
  username: string;
  email: string;
  passwordHash: string;
  books: GeneratedBook[];
};

export const generatedUsers: GeneratedUser[] = ${JSON.stringify(users, null, 2)};
`;

  fs.writeFileSync(OUTPUT_PATH, header + body, "utf8");
  console.log(`Wrote ${users.length} users to ${OUTPUT_PATH}`);
}

function main() {
  const users = readWorkbook();
  writeGeneratedFile(users);
}

main();
