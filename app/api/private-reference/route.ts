import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  STATISTICS_SESSION_COOKIE,
  verifyStatisticsSession,
} from "../../../lib/statistics-auth";
import {
  ensurePrivateReference,
  getReferenceAttachmentMeta,
  savePrivateReference,
} from "../../../lib/private-reference";

async function owner(request: NextRequest) {
  const session = await verifyStatisticsSession(
    request.cookies.get(STATISTICS_SESSION_COOKIE)?.value,
  );
  return session?.role === "owner" ? session : null;
}

export async function GET(request: NextRequest) {
  if (!(await owner(request))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const [document, attachment] = await Promise.all([
    ensurePrivateReference(),
    getReferenceAttachmentMeta(),
  ]);
  if (!document) {
    return NextResponse.json({ error: "Private storage is not configured" }, { status: 503 });
  }
  return NextResponse.json(
    { document, attachment },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}

export async function POST(request: NextRequest) {
  if (!(await owner(request))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const title = typeof payload.title === "string" ? payload.title : "";
  const body = typeof payload.body === "string" ? payload.body : "";
  if (!body.trim()) {
    return NextResponse.json({ error: "Reference content is required" }, { status: 400 });
  }
  const document = await savePrivateReference(title, body);
  if (!document) {
    return NextResponse.json({ error: "Reference could not be saved" }, { status: 503 });
  }
  return NextResponse.json(
    { document },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
