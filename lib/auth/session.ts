const encoder = new TextEncoder();
const decoder = new TextDecoder();

export type SessionUser = {
  username: string;
  email: string;
};

export type SessionPayload = SessionUser & {
  iat: number;
};

export const SESSION_COOKIE_NAME = "session";

function base64Encode(bytes: Uint8Array) {
  if (typeof btoa === "function") {
    let binary = "";
    for (const b of bytes) {
      binary += String.fromCharCode(b);
    }
    return btoa(binary);
  }

  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64");
  }

  throw new Error("Base64 encoding not supported in this runtime.");
}

function base64Decode(base64: string) {
  if (typeof atob === "function") {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(base64, "base64"));
  }

  throw new Error("Base64 decoding not supported in this runtime.");
}

function toBase64Url(bytes: Uint8Array) {
  return base64Encode(bytes)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64Url(input: string) {
  const base = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base + "=".repeat((4 - (base.length % 4 || 4)) % 4);
  return base64Decode(padded);
}

async function signHmac(message: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(message)
  );

  return toBase64Url(new Uint8Array(signature));
}

async function verifyHmac(message: string, signature: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  const sigBytes = fromBase64Url(signature);

  return crypto.subtle.verify(
    "HMAC",
    key,
    sigBytes,
    encoder.encode(message)
  );
}

function getSecret() {
  return process.env.AUTH_SECRET ?? "dev-secret-change-me";
}

export async function createSessionToken(user: SessionUser) {
  const secret = getSecret();
  const payload: SessionPayload = {
    ...user,
    iat: Date.now(),
  };

  const encodedPayload = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = await signHmac(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  if (!token.includes(".")) return null;
  const [encodedPayload, signature] = token.split(".");
  const secret = getSecret();

  const valid = await verifyHmac(encodedPayload, signature, secret);
  if (!valid) return null;

  try {
    const payloadJson = decoder.decode(fromBase64Url(encodedPayload));
    const payload = JSON.parse(payloadJson) as SessionPayload;
    if (!payload.username || !payload.email) return null;
    return payload;
  } catch {
    return null;
  }
}
