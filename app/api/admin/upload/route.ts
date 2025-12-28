import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import path from "path";
import fs from "fs/promises";
import { promisify } from "util";
import { execFile } from "child_process";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { assertAdmin } from "@/lib/auth/admin";

const execFileAsync = promisify(execFile);

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const XLSX_PATH = path.join(process.cwd(), "data", "users.xlsx");
const SYNC_SCRIPT = path.join(
  process.cwd(),
  "scripts",
  "sync-users-from-excel.js"
);

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

  await fs.mkdir(path.dirname(XLSX_PATH), { recursive: true });
  await fs.writeFile(XLSX_PATH, buffer);

  try {
    await execFileAsync("node", [SYNC_SCRIPT], { cwd: process.cwd() });
  } catch (error) {
    console.error("Sync script failed", error);
    return NextResponse.json(
      { error: "Sync failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
