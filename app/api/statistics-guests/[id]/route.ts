import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  revokeManagedGuest,
  STATISTICS_SESSION_COOKIE,
  verifyStatisticsSession,
} from "../../../../lib/statistics-auth";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = await verifyStatisticsSession(
    request.cookies.get(STATISTICS_SESSION_COOKIE)?.value,
  );
  if (session?.role !== "owner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;
  const revoked = await revokeManagedGuest(id);
  if (!revoked) {
    return NextResponse.json({ error: "Guest not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
