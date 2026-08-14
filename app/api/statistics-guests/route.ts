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

  const name = typeof body.name === "string" ? body.name : "";
  const expiresAt = typeof body.expiresAt === "string" ? body.expiresAt : "";
  const sessionHours = Number(body.sessionHours ?? 2);
  if (!Number.isFinite(sessionHours)) {
    return NextResponse.json({ error: "Invalid session duration" }, { status: 400 });
  }

  const result = await createManagedGuest({ name, expiresAt, sessionHours });
  if (!result) {
    return NextResponse.json(
      { error: "Could not create guest. Check the name, expiry, and storage binding." },
      { status: 400 },
    );
  }
  return NextResponse.json(result, { status: 201 });
}
