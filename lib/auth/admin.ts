import { verifyPassword } from "./password";
import type { SessionPayload, SessionUser } from "./session";

function getAdminEmail(): string | null {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return email || null;
}

function getAdminUsername(): string {
  return process.env.ADMIN_USERNAME?.trim() || "Admin";
}

export function isAdminEmail(email: string) {
  const adminEmail = getAdminEmail();
  return !!adminEmail && email.trim().toLowerCase() === adminEmail;
}

function verifyAdminPassword(password: string) {
  const hashed = process.env.ADMIN_PASSWORD_HASH?.trim();
  if (hashed) {
    return verifyPassword(password, hashed);
  }

  const plain = process.env.ADMIN_PASSWORD;
  return !!plain && plain === password;
}

export function verifyAdminCredentials(email: string, password: string) {
  return isAdminEmail(email) && verifyAdminPassword(password);
}

export function getAdminUser(): SessionUser | null {
  const email = getAdminEmail();
  if (!email) return null;

  return {
    email,
    username: getAdminUsername(),
  };
}

export function assertAdmin(payload: SessionPayload) {
  if (!isAdminEmail(payload.email)) {
    throw new Error("Forbidden");
  }
}
