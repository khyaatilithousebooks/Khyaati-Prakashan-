import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "@/lib/auth/session";

export const runtime = "nodejs";

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

  const gasUrl =
    process.env.PAYOUT_WEBAPP_URL ||
    "https://script.google.com/macros/s/AKfycbzBgtiv3euyNsKRz0btyLB0dQ59oxUoCgzQrbG38NI9tSKak_vOoHnl_D4ZAmalAFSSYw/exec";
  const adminEmail = process.env.ADMIN_EMAIL;

  let body: { user?: string; email?: string; amount?: number } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    // ignore and fall back to defaults
  }

  const payloadToSend = {
    user: body.user || payload.username || "Unknown user",
    email: body.email || payload.email || "Unknown email",
    amount: body.amount ?? "",
    adminEmail: adminEmail || "",
  };

  try {
    const res = await fetch(gasUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payloadToSend),
    });

    const text = await res.text();

    if (!res.ok) {
      throw new Error(`GAS responded with ${res.status}: ${text}`);
    }

    console.log("Payout request sent to GAS", {
      status: res.status,
      response: text,
      payload: payloadToSend,
    });
  } catch (error) {
    console.error("Failed to send payout via GAS", error);
    return NextResponse.json(
      { error: "Failed to submit payout request." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
