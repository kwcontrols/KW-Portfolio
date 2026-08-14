import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import analytics from "../../../data/analytics.json";
import {
  STATISTICS_SESSION_COOKIE,
  verifyStatisticsSession,
} from "../../../lib/statistics-auth";

export async function GET(request: NextRequest) {
  const session = await verifyStatisticsSession(
    request.cookies.get(STATISTICS_SESSION_COOKIE)?.value,
  );

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(analytics, {
    headers: {
      "Cache-Control": "private, no-store",
    },
  });
}
