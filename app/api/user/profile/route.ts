import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import path from "path";
import fs from "fs/promises";
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "@/lib/auth/session";
import { userWorkbooks } from "@/lib/mock/data";

export const runtime = "nodejs";

type Profile = {
  username: string;
  email: string;
  bio?: string;
};

const DATA_PATH = path.join(process.cwd(), "data", "profile-overrides.json");

async function readOverrides(): Promise<Record<string, Profile>> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    return JSON.parse(raw) as Record<string, Profile>;
  } catch {
    return {};
  }
}

async function writeOverrides(overrides: Record<string, Profile>) {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(overrides, null, 2), "utf8");
}

function getUserByEmail(email: string) {
  return userWorkbooks.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
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

  const overrides = await readOverrides();
  const fromOverrides = overrides[payload.email];
  const user = getUserByEmail(payload.email);

  return NextResponse.json({
    username: fromOverrides?.username ?? payload.username ?? "",
    email: payload.email ?? "",
    bio: fromOverrides?.bio ?? "",
    books: user?.books ?? [],
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

  const { username, email, bio } = (body as Record<string, unknown>) ?? {};

  if (typeof username !== "string" || typeof email !== "string") {
    return NextResponse.json(
      { error: "Username and email are required." },
      { status: 400 }
    );
  }

  const overrides = await readOverrides();
  overrides[payload.email] = {
    username,
    email,
    bio: typeof bio === "string" ? bio : "",
  };

  await writeOverrides(overrides);

  return NextResponse.json({ ok: true });
}
