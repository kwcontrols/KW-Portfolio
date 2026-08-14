import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { STATISTICS_SESSION_COOKIE } from "../../../lib/statistics-auth";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/", request.url), 303);
  response.cookies.set(STATISTICS_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
