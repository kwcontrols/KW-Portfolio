import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  STATISTICS_SESSION_COOKIE,
  verifyStatisticsSession,
} from "../../../../lib/statistics-auth";
import {
  buildReferencePdf,
  ensurePrivateReference,
} from "../../../../lib/private-reference";

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
  const document = await ensurePrivateReference();
  if (!document) {
    return NextResponse.json({ error: "Private storage is not configured" }, { status: 503 });
  }
  const pdf = buildReferencePdf(document);
  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="KW-Portfolio-Operations-Reference.pdf"',
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
