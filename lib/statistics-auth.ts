import { env } from "cloudflare:workers";

export const STATISTICS_SESSION_COOKIE = "kw_statistics_session";

export type AccessEntry = {
  id: string;
  name: string;
  code?: string;
  expiresAt?: string;
  sessionHours?: number;
  role?: "owner" | "guest";
};

export type StatisticsSession = {
  id: string;
  name: string;
  role: "owner" | "guest";
  exp: number;
};

export type ManagedGuest = {
  id: string;
  name: string;
  expiresAt: string;
  sessionHours: number;
  createdAt: string;
};

type StatisticsGuestKv = {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: { prefix?: string }): Promise<{ keys: Array<{ name: string }> }>;
};

const encoder = new TextEncoder();
const GUEST_KEY_PREFIX = "guest:";
const CODE_KEY_PREFIX = "code:";

function getConfiguredAccessEntries(): AccessEntry[] {
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
      const role: "owner" | "guest" = id === "owner" ? "owner" : "guest";

      return id && name && code
        ? [{ id, name, code, expiresAt, sessionHours, role }]
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

function guestStore(): StatisticsGuestKv | null {
  const binding = (env as unknown as { KW_STATISTICS_GUESTS?: StatisticsGuestKv })
    .KW_STATISTICS_GUESTS;
  return binding ?? null;
}

function accessEntryIsActive(entry: Pick<AccessEntry, "expiresAt">, now = Date.now()): boolean {
  if (!entry.expiresAt) return true;
  const expires = Date.parse(entry.expiresAt);
  return Number.isFinite(expires) && expires > now;
}

async function sha256(value: string): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return new Uint8Array(digest);
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await sha256(value);
  return Array.from(digest, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function equalBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) {
    difference |= a[index] ^ b[index];
  }
  return difference === 0;
}

async function managedGuestById(id: string): Promise<ManagedGuest | null> {
  const store = guestStore();
  if (!store) return null;
  const raw = await store.get(`${GUEST_KEY_PREFIX}${id}`);
  if (!raw) return null;
  try {
    const guest = JSON.parse(raw) as ManagedGuest;
    return guest?.id === id && accessEntryIsActive(guest) ? guest : null;
  } catch {
    return null;
  }
}

export async function authenticateStatisticsCode(
  submittedCode: string,
): Promise<AccessEntry | null> {
  if (!submittedCode) return null;
  const submittedHash = await sha256(submittedCode);

  for (const entry of getConfiguredAccessEntries()) {
    if (!accessEntryIsActive(entry) || !entry.code) continue;
    const expectedHash = await sha256(entry.code);
    if (equalBytes(submittedHash, expectedHash)) return entry;
  }

  const store = guestStore();
  if (!store) return null;
  const id = await store.get(`${CODE_KEY_PREFIX}${await sha256Hex(submittedCode)}`);
  if (!id) return null;
  const guest = await managedGuestById(id);
  return guest
    ? {
        id: guest.id,
        name: guest.name,
        expiresAt: guest.expiresAt,
        sessionHours: guest.sessionHours,
        role: "guest",
      }
    : null;
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
  if (expiresAt <= now) return null;

  const payload: StatisticsSession = {
    id: entry.id,
    name: entry.name,
    role: entry.role ?? (entry.id === "owner" ? "owner" : "guest"),
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
): Promise<StatisticsSession | null> {
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

  let payload: StatisticsSession;
  try {
    payload = JSON.parse(new TextDecoder().decode(payloadBytes)) as StatisticsSession;
  } catch {
    return null;
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  if (
    !payload ||
    typeof payload.id !== "string" ||
    typeof payload.name !== "string" ||
    (payload.role !== "owner" && payload.role !== "guest") ||
    typeof payload.exp !== "number" ||
    payload.exp <= nowSeconds
  ) {
    return null;
  }

  const configuredEntry = getConfiguredAccessEntries().find(
    (candidate) => candidate.id === payload.id,
  );
  if (configuredEntry) {
    return accessEntryIsActive(configuredEntry) ? payload : null;
  }

  if (payload.role === "guest") {
    return (await managedGuestById(payload.id)) ? payload : null;
  }

  return null;
}

export async function listManagedGuests(): Promise<ManagedGuest[] | null> {
  const store = guestStore();
  if (!store) return null;
  const result = await store.list({ prefix: GUEST_KEY_PREFIX });
  const guests = await Promise.all(
    result.keys.map(async ({ name }) => {
      const raw = await store.get(name);
      if (!raw) return null;
      try {
        return JSON.parse(raw) as ManagedGuest;
      } catch {
        return null;
      }
    }),
  );
  return guests
    .filter((guest): guest is ManagedGuest => Boolean(guest))
    .sort((a, b) => a.expiresAt.localeCompare(b.expiresAt));
}

function randomAccessCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  return toBase64Url(bytes);
}

export async function createManagedGuest(input: {
  name: string;
  expiresAt: string;
  sessionHours: number;
}): Promise<{ guest: ManagedGuest; code: string } | null> {
  const store = guestStore();
  if (!store) return null;
  const name = input.name.trim().slice(0, 80);
  const expires = Date.parse(input.expiresAt);
  const sessionHours = Math.min(Math.max(input.sessionHours, 0.25), 168);
  if (!name || !Number.isFinite(expires) || expires <= Date.now()) return null;

  const id = crypto.randomUUID();
  const code = randomAccessCode();
  const guest: ManagedGuest = {
    id,
    name,
    expiresAt: new Date(expires).toISOString(),
    sessionHours,
    createdAt: new Date().toISOString(),
  };
  await store.put(`${GUEST_KEY_PREFIX}${id}`, JSON.stringify(guest));
  await store.put(`${CODE_KEY_PREFIX}${await sha256Hex(code)}`, id);
  return { guest, code };
}

export async function revokeManagedGuest(id: string): Promise<boolean> {
  const store = guestStore();
  if (!store) return false;
  const guest = await managedGuestById(id);
  if (!guest) return false;

  const list = await store.list({ prefix: CODE_KEY_PREFIX });
  for (const key of list.keys) {
    const linkedId = await store.get(key.name);
    if (linkedId === id) await store.delete(key.name);
  }
  await store.delete(`${GUEST_KEY_PREFIX}${id}`);
  return true;
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
