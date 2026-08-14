export const STATISTICS_SESSION_COOKIE = "kw_statistics_session";

type AccessEntry = {
  id: string;
  name: string;
  code: string;
  expiresAt?: string;
  sessionHours?: number;
};

type SessionPayload = {
  id: string;
  name: string;
  exp: number;
};

const encoder = new TextEncoder();

function getAccessEntries(): AccessEntry[] {
  const raw = process.env.STATISTICS_ACCESS_CODES;
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.flatMap((entry) => {
      if (!entry || typeof entry !== "object") return [];
      const item = entry as Record<string, unknown>;
      const id = typeof item.id === "string" ? item.id.trim() : "";
      const name = typeof item.name === "string" ? item.name.trim() : "";
      const code = typeof item.code === "string" ? item.code : "";
      const expiresAt =
        typeof item.expiresAt === "string" && item.expiresAt.trim()
          ? item.expiresAt.trim()
          : undefined;
      const sessionHours =
        typeof item.sessionHours === "number" && Number.isFinite(item.sessionHours)
          ? Math.min(Math.max(item.sessionHours, 0.25), 168)
          : undefined;

      return id && name && code
        ? [{ id, name, code, expiresAt, sessionHours }]
        : [];
    });
  } catch {
    return [];
  }
}

function configuredSecret(): string | null {
  const value = process.env.STATISTICS_SESSION_SECRET?.trim();
  return value || null;
}

function accessEntryIsActive(entry: AccessEntry, now = Date.now()): boolean {
  if (!entry.expiresAt) return true;
  const expires = Date.parse(entry.expiresAt);
  return Number.isFinite(expires) && expires > now;
}

async function sha256(value: string): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return new Uint8Array(digest);
}

function equalBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) {
    difference |= a[index] ^ b[index];
  }
  return difference === 0;
}

export async function authenticateStatisticsCode(
  submittedCode: string,
): Promise<AccessEntry | null> {
  if (!submittedCode) return null;
  const submittedHash = await sha256(submittedCode);

  for (const entry of getAccessEntries()) {
    if (!accessEntryIsActive(entry)) continue;
    const expectedHash = await sha256(entry.code);
    if (equalBytes(submittedHash, expectedHash)) return entry;
  }

  return null;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(value: string): Uint8Array | null {
  try {
    const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const binary = atob(padded);
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
  } catch {
    return null;
  }
}

async function hmac(value: string, secret: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return new Uint8Array(signature);
}

export async function createStatisticsSession(entry: AccessEntry): Promise<{
  token: string;
  maxAge: number;
} | null> {
  const secret = configuredSecret();
  if (!secret) return null;

  const now = Date.now();
  const requestedMs = (entry.sessionHours ?? 12) * 60 * 60 * 1000;
  const accessExpiry = entry.expiresAt ? Date.parse(entry.expiresAt) : Infinity;
  const expiresAt = Math.min(now + requestedMs, accessExpiry);
  if (!Number.isFinite(expiresAt) || expiresAt <= now) return null;

  const payload: SessionPayload = {
    id: entry.id,
    name: entry.name,
    exp: Math.floor(expiresAt / 1000),
  };
  const payloadPart = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const signaturePart = toBase64Url(await hmac(payloadPart, secret));

  return {
    token: `${payloadPart}.${signaturePart}`,
    maxAge: Math.max(1, Math.floor((expiresAt - now) / 1000)),
  };
}

export async function verifyStatisticsSession(
  token: string | undefined,
): Promise<SessionPayload | null> {
  const secret = configuredSecret();
  if (!secret || !token) return null;

  const [payloadPart, signaturePart, extra] = token.split(".");
  if (!payloadPart || !signaturePart || extra) return null;

  const providedSignature = fromBase64Url(signaturePart);
  if (!providedSignature) return null;
  const expectedSignature = await hmac(payloadPart, secret);
  if (!equalBytes(providedSignature, expectedSignature)) return null;

  const payloadBytes = fromBase64Url(payloadPart);
  if (!payloadBytes) return null;

  let payload: SessionPayload;
  try {
    payload = JSON.parse(new TextDecoder().decode(payloadBytes)) as SessionPayload;
  } catch {
    return null;
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  if (
    !payload ||
    typeof payload.id !== "string" ||
    typeof payload.name !== "string" ||
    typeof payload.exp !== "number" ||
    payload.exp <= nowSeconds
  ) {
    return null;
  }

  const entry = getAccessEntries().find((candidate) => candidate.id === payload.id);
  if (!entry || !accessEntryIsActive(entry)) return null;

  return payload;
}

export function safeStatisticsReturnPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/statistics";
  }

  try {
    const url = new URL(value, "https://portfolio.local");
    return url.origin === "https://portfolio.local"
      ? `${url.pathname}${url.search}${url.hash}`
      : "/statistics";
  } catch {
    return "/statistics";
  }
}
