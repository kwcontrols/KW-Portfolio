import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  authenticateStatisticsCode,
  createStatisticsSession,
  safeStatisticsReturnPath,
  STATISTICS_SESSION_COOKIE,
} from "../../../lib/statistics-auth";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const submittedCode = String(formData.get("access_code") ?? "");
  const returnTo = safeStatisticsReturnPath(
    String(formData.get("return_to") ?? "/statistics"),
  );

  const entry = await authenticateStatisticsCode(submittedCode);
  if (!entry) {
    const url = new URL("/statistics-login", request.url);
    url.searchParams.set("error", "invalid");
    url.searchParams.set("return_to", returnTo);
    return NextResponse.redirect(url, 303);
  }

  const session = await createStatisticsSession(entry);
  if (!session) {
    const url = new URL("/statistics-login", request.url);
    url.searchParams.set("error", "config");
    url.searchParams.set("return_to", returnTo);
    return NextResponse.redirect(url, 303);
  }

  const response = NextResponse.redirect(new URL(returnTo, request.url), 303);
  response.cookies.set(STATISTICS_SESSION_COOKIE, session.token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: session.maxAge,
  });
  return response;
}
