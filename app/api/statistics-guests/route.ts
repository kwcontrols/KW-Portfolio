import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  createManagedGuest,
  listManagedGuests,
  STATISTICS_SESSION_COOKIE,
  verifyStatisticsSession,
} from "../../../lib/statistics-auth";

async function requireOwner(request: NextRequest) {
  const session = await verifyStatisticsSession(
    request.cookies.get(STATISTICS_SESSION_COOKIE)?.value,
  );
  return session?.role === "owner" ? session : null;
}

function parseVancouverLocalDateTime(value: string) {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) return NaN;

  const [, year, month, day, hour, minute, second = "0"] = match;
  const target = Date.UTC(+year, +month - 1, +day, +hour, +minute, +second);
  let candidate = target;
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Vancouver",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  for (let pass = 0; pass < 2; pass += 1) {
    const parts = Object.fromEntries(
      formatter
        .formatToParts(new Date(candidate))
        .filter((part) => part.type !== "literal")
        .map((part) => [part.type, part.value]),
    );
    const shownAsUtc = Date.UTC(
      +parts.year,
      +parts.month - 1,
      +parts.day,
      +parts.hour,
      +parts.minute,
      +parts.second,
    );
    candidate += target - shownAsUtc;
  }

  return candidate;
}

export async function GET(request: NextRequest) {
  if (!(await requireOwner(request))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const guests = await listManagedGuests();
  if (!guests) {
    return NextResponse.json(
      { error: "Guest management storage is not configured" },
      { status: 503 },
    );
  }
  return NextResponse.json({ guests });
}

export async function POST(request: NextRequest) {
  if (!(await requireOwner(request))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const expiresAtLocal = typeof body.expiresAt === "string" ? body.expiresAt : "";
  const sessionHours = Number(body.sessionHours ?? 8);
  const expires = parseVancouverLocalDateTime(expiresAtLocal);

  if (!name) {
    return NextResponse.json({ error: "Enter a guest name." }, { status: 400 });
  }
  if (!Number.isFinite(expires)) {
    return NextResponse.json({ error: "Choose a valid expiry date and time." }, { status: 400 });
  }
  if (expires <= Date.now()) {
    return NextResponse.json({ error: "Guest expiry must be in the future (Pacific Time)." }, { status: 400 });
  }
  if (!Number.isFinite(sessionHours) || sessionHours < 0.25 || sessionHours > 168) {
    return NextResponse.json({ error: "Choose a valid session duration." }, { status: 400 });
  }

  const result = await createManagedGuest({
    name,
    expiresAt: new Date(expires).toISOString(),
    sessionHours,
  });

  if (!result) {
    return NextResponse.json(
      { error: "Guest could not be created. Please confirm the expiry is in the future and try again." },
      { status: 400 },
    );
  }
  return NextResponse.json(result, { status: 201 });
}
