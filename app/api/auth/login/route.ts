import { NextResponse } from "next/server";
import { mockUsers } from "@/lib/mock/users";
import { verifyPassword } from "@/lib/auth/password";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
} from "@/lib/auth/session";
import {
  getAdminUser,
  isAdminEmail,
  verifyAdminCredentials,
} from "@/lib/auth/admin";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const { email, password } = (body as Record<string, unknown>) ?? {};

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  const trimmedEmail = email.trim();
  if (!trimmedEmail || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  if (isAdminEmail(trimmedEmail)) {
    if (!verifyAdminCredentials(trimmedEmail, password)) {
      return NextResponse.json(
        { error: "Wrong password." },
        { status: 401 }
      );
    }

    const adminUser = getAdminUser();
    if (!adminUser) {
      return NextResponse.json(
        { error: "Admin user is misconfigured." },
        { status: 500 }
      );
    }

    const sessionToken = await createSessionToken(adminUser);

    const response = NextResponse.json({
      user: adminUser,
      isAdmin: true,
    });

    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });

    return response;
  }

  const user = mockUsers.find(
    (u) => u.email.toLowerCase() === trimmedEmail.toLowerCase()
  );

  if (!user) {
    return NextResponse.json(
      { error: "User is not registered." },
      { status: 404 }
    );
  }

  if (!verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }

  const sessionToken = await createSessionToken({
    username: user.username,
    email: user.email,
  });

  const response = NextResponse.json({
    user: { username: user.username, email: user.email },
    isAdmin: isAdminEmail(user.email),
  });

  response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });

  return response;
}
