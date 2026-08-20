import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  STATISTICS_SESSION_COOKIE,
  verifyStatisticsSession,
} from "../../../../lib/statistics-auth";
import {
  deleteReferenceAttachment,
  getReferenceAttachment,
  MAX_REFERENCE_ATTACHMENT_BYTES,
  saveReferenceAttachment,
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
  const attachment = await getReferenceAttachment();
  if (!attachment) {
    return NextResponse.json({ error: "No supporting document" }, { status: 404 });
  }
  const download = new URL(request.url).searchParams.get("download") === "1";
  return new Response(attachment.data, {
    headers: {
      "Content-Type": attachment.meta.contentType,
      "Content-Length": String(attachment.meta.size),
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename*=UTF-8''${encodeURIComponent(attachment.meta.filename)}`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function POST(request: NextRequest) {
  if (!(await owner(request))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose a file to upload" }, { status: 400 });
  }
  if (file.size > MAX_REFERENCE_ATTACHMENT_BYTES) {
    return NextResponse.json({ error: "File exceeds the 10 MB limit" }, { status: 413 });
  }
  const attachment = await saveReferenceAttachment(file);
  if (!attachment) {
    return NextResponse.json({ error: "Only PNG, JPG, and PDF files up to 10 MB are allowed" }, { status: 400 });
  }
  return NextResponse.json(
    { attachment },
    { status: 201, headers: { "Cache-Control": "private, no-store" } },
  );
}

export async function DELETE(request: NextRequest) {
  if (!(await owner(request))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const deleted = await deleteReferenceAttachment();
  return NextResponse.json({ deleted }, { headers: { "Cache-Control": "private, no-store" } });
}
