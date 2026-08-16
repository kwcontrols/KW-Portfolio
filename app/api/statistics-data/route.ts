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

  const desktop = analytics.deviceSummary?.find(
    (item) => item.category.toLowerCase() === "desktop",
  );
  const mobile = analytics.deviceSummary?.find(
    (item) => item.category.toLowerCase() === "mobile",
  );

  return NextResponse.json(
    {
      ...analytics,
      desktopUsers: desktop?.users ?? 0,
      desktopSessions: desktop?.sessions ?? 0,
      mobileUsers: mobile?.users ?? 0,
      mobileSessions: mobile?.sessions ?? 0,
    },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    },
  );
}
