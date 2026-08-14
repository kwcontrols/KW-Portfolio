import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  STATISTICS_SESSION_COOKIE,
  verifyStatisticsSession,
} from "./lib/statistics-auth";

export async function proxy(request: NextRequest) {
  const session = await verifyStatisticsSession(
    request.cookies.get(STATISTICS_SESSION_COOKIE)?.value,
  );

  if (session) return NextResponse.next();

  if (request.nextUrl.pathname.startsWith("/api/statistics-data")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/statistics-login", request.url);
  loginUrl.searchParams.set(
    "return_to",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/statistics/:path*", "/api/statistics-data/:path*"],
};
