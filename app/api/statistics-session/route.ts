import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  STATISTICS_SESSION_COOKIE,
  verifyStatisticsSession,
} from "../../../lib/statistics-auth";

export async function GET(request: NextRequest) {
  const session = await verifyStatisticsSession(
    request.cookies.get(STATISTICS_SESSION_COOKIE)?.value,
  );

  return NextResponse.json(
    { authenticated: Boolean(session) },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
