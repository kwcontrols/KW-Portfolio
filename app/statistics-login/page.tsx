import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";
import {
  safeStatisticsReturnPath,
  STATISTICS_SESSION_COOKIE,
  verifyStatisticsSession,
} from "../../lib/statistics-auth";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function StatisticsLoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const rawReturnTo = Array.isArray(params.return_to)
    ? params.return_to[0]
    : params.return_to;
  const returnTo = safeStatisticsReturnPath(rawReturnTo ?? null);

  const cookieStore = await cookies();
  const existingSession = await verifyStatisticsSession(
    cookieStore.get(STATISTICS_SESSION_COOKIE)?.value,
  );
  if (existingSession) {
    redirect(returnTo);
  }

  const hasError = params.error === "invalid";
  const hasConfigError = params.error === "config";

  return (
    <div className="site-shell" id="page-start">
      <SiteHeader />
      <main
        style={{
          minHeight: "68vh",
          display: "grid",
          placeItems: "center",
          padding: "64px 24px",
        }}
      >
        <section
          aria-labelledby="statistics-login-title"
          style={{
            width: "min(100%, 460px)",
            border: "1px solid #d7e0ea",
            background: "#fff",
            padding: "36px",
            boxShadow: "0 16px 44px rgba(16, 35, 63, 0.08)",
          }}
        >
          <p
            style={{
              margin: "0 0 8px",
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#52647a",
            }}
          >
            Private Portal
          </p>
          <h1 id="statistics-login-title" style={{ margin: "0 0 12px" }}>
            Administrator Access
          </h1>
          <p style={{ margin: "0 0 26px", color: "#52647a", lineHeight: 1.65 }}>
            Sign in to access the private portal. Authorized users can access the
            tools available to their account.
          </p>

          {hasError ? (
            <p role="alert" style={{ color: "#9a3412", marginBottom: "18px" }}>
              That access code is invalid or has expired. Please try again.
            </p>
          ) : null}
          {hasConfigError ? (
            <p role="alert" style={{ color: "#9a3412", marginBottom: "18px" }}>
              Secure access is not configured yet. Please contact the site owner.
            </p>
          ) : null}

          <form action="/api/statistics-login" method="post">
            <input type="hidden" name="return_to" value={returnTo} />
            <label
              htmlFor="access-code"
              style={{ display: "block", fontWeight: 600, marginBottom: "8px" }}
            >
              Access code
            </label>
            <input
              id="access-code"
              name="access_code"
              type="password"
              autoComplete="one-time-code"
              required
              autoFocus
              style={{
                width: "100%",
                boxSizing: "border-box",
                minHeight: "46px",
                border: "1px solid #aebdcd",
                padding: "10px 12px",
                font: "inherit",
                marginBottom: "16px",
              }}
            />
            <button
              type="submit"
              style={{
                width: "100%",
                minHeight: "46px",
                border: 0,
                background: "#10233f",
                color: "#fff",
                font: "inherit",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Continue
            </button>
          </form>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
