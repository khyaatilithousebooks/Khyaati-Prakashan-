import fs from "fs";
import path from "path";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function parseServiceAccount() {
  const filePath =
    process.env.FIREBASE_SERVICE_ACCOUNT_FILE ||
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  const rawBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

  let parsed: Record<string, unknown> | null = null;

  const candidateFiles = [
    filePath,
    "service-account.json",
    "firebase-service-account.json",
    "book-royalty-firebase-adminsdk-fbsvc-3893020062.json",
  ].filter(Boolean) as string[];

  for (const candidate of candidateFiles) {
    const resolved = path.isAbsolute(candidate)
      ? candidate
      : path.join(process.cwd(), candidate);
    if (!fs.existsSync(resolved)) continue;

    try {
      const fileContents = fs.readFileSync(resolved, "utf8");
      parsed = JSON.parse(fileContents);
      break;
    } catch {
      // ignore and continue to other sources
    }
  }

  if (rawBase64) {
    try {
      const decoded = Buffer.from(rawBase64, "base64").toString("utf8");
      parsed = JSON.parse(decoded);
    } catch {
      // ignore and fall through
    }
  }

  if (!parsed && rawJson) {
    try {
      parsed = JSON.parse(rawJson);
    } catch {
      // ignore and fall through
    }
  }

  return parsed;
}

function formatPrivateKey(value?: string) {
  if (!value) return "";

  const trimmed = value.trim();
  const unwrapped =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
      ? trimmed.slice(1, -1)
      : trimmed;

  const withNewlines = unwrapped
    .replace(/\\\\n/g, "\n") // handle double-escaped newlines
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\r/g, "");

  if (withNewlines.includes("BEGIN PRIVATE KEY")) {
    return withNewlines;
  }

  try {
    const decoded = Buffer.from(unwrapped, "base64").toString("utf8").trim();
    if (decoded.includes("BEGIN PRIVATE KEY")) {
      return decoded.replace(/\r/g, "");
    }
  } catch {
    // fall through to return the best-effort string
  }

  return withNewlines;
}

function getFirebaseCredentials() {
  const serviceAccount = parseServiceAccount();

  const projectId =
    (serviceAccount?.project_id as string | undefined) ||
    process.env.FIREBASE_PROJECT_ID;
  const clientEmail =
    (serviceAccount?.client_email as string | undefined) ||
    process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey =
    (serviceAccount?.private_key as string | undefined) ||
    process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase credentials are not fully configured.");
  }

  const normalizedKey = formatPrivateKey(privateKey);
  const looksLikePem = /-----BEGIN PRIVATE KEY-----[\s\S]+-----END PRIVATE KEY-----/;

  if (!looksLikePem.test(normalizedKey)) {
    const preview = normalizedKey.slice(0, 40).replace(/\n/g, "\\n");
    throw new Error(
      `Firebase private key is not a valid PEM after normalization. Preview: ${preview}...`
    );
  }

  return {
    projectId,
    clientEmail,
    privateKey: normalizedKey,
  };
}

export function getFirebaseAdminDb() {
  try {
    const app =
      getApps()[0] ??
      initializeApp({
        credential: cert(getFirebaseCredentials()),
      });

    return getFirestore(app);
  } catch (error) {
    console.error("Failed to initialize Firebase Admin", {
      message: (error as Error)?.message,
      name: (error as Error)?.name,
      stack: (error as Error)?.stack,
    });
    throw error;
  }
}
