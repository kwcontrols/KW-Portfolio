import { NextResponse } from "next/server";

export async function GET() {
  const rawAccessCodes = process.env.STATISTICS_ACCESS_CODES;
  const sessionSecret = process.env.STATISTICS_SESSION_SECRET;

  let parses = false;
  let entryCount = 0;
  let ownerEntries: Array<{
    id: string;
    name: string;
    role: string | null;
    codeLength: number;
    expiresAtPresent: boolean;
  }> = [];
  let parseError: string | null = null;

  if (rawAccessCodes) {
    try {
      const parsed = JSON.parse(rawAccessCodes) as unknown;
      if (Array.isArray(parsed)) {
        parses = true;
        entryCount = parsed.length;
        ownerEntries = parsed.flatMap((entry) => {
          if (!entry || typeof entry !== "object") return [];
          const item = entry as Record<string, unknown>;
          const id = typeof item.id === "string" ? item.id : "";
          if (id !== "owner") return [];
          return [
            {
              id,
              name: typeof item.name === "string" ? item.name : "",
              role: typeof item.role === "string" ? item.role : null,
              codeLength: typeof item.code === "string" ? item.code.length : 0,
              expiresAtPresent:
                typeof item.expiresAt === "string" && item.expiresAt.length > 0,
            },
          ];
        });
      }
    } catch (error) {
      parseError = error instanceof Error ? error.message : "Unknown parse error";
    }
  }

  return NextResponse.json(
    {
      accessCodesSecretPresent: Boolean(rawAccessCodes),
      accessCodesRawLength: rawAccessCodes?.length ?? 0,
      accessCodesParsesAsJsonArray: parses,
      accessEntryCount: entryCount,
      ownerEntries,
      sessionSecretPresent: Boolean(sessionSecret),
      sessionSecretLength: sessionSecret?.length ?? 0,
      parseError,
      note: "Temporary diagnostic endpoint. No access-code or secret values are returned.",
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
