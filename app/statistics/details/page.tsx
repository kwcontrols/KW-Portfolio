"use client";

import { useEffect, useState } from "react";
import { SiteFooter } from "../../SiteFooter";
import { SiteHeader } from "../../SiteHeader";
import { ProcessedActivityDetail } from "../ProcessedActivityDetail";
import type { AnalyticsData } from "../StatisticsDashboard";

function isAnalyticsData(value: unknown): value is AnalyticsData {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  return typeof data.updatedAt === "string" && Array.isArray(data.activityLog);
}

export default function StatisticsDetailsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAnalytics() {
      try {
        const response = await fetch("/api/statistics-data", {
          cache: "no-store",
          credentials: "same-origin",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Analytics data could not be loaded");
        const payload: unknown = await response.json();
        if (!isAnalyticsData(payload)) throw new Error("Analytics data payload is incomplete");
        setAnalytics(payload);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) setAnalytics(null);
      }
    }

    void loadAnalytics();
    return () => controller.abort();
  }, []);

  return (
    <div className="site-shell" id="page-start">
      <SiteHeader />
      <main className="statistics-page statistics-details-page">
        <a className="statistics-back-link" href="/statistics">← Back to portal</a>
        <header className="statistics-detail-intro">
          <p className="section-index">Analytics</p>
          <h1>Active Users & Details</h1>
          <p>
            Processed GA4 visitor activity for the last 30 days, including approximate location,
            device, browser, landing page, sessions and views.
          </p>
        </header>

        <ProcessedActivityDetail activityLog={analytics?.activityLog ?? []} />

        <p className="statistics-location-note">
          Location note: city and country are GA4-estimated from network/IP information and should
          be treated as approximate rather than precise physical location.
        </p>

        <style>{`
          .statistics-back-link{display:inline-block;margin:0 0 2rem;color:var(--blue);font-size:.9rem;font-weight:700;text-decoration:none}
          .statistics-back-link:hover,.statistics-back-link:focus-visible{text-decoration:underline;text-underline-offset:.25rem}
          .statistics-detail-intro{max-width:760px}
          .statistics-detail-intro h1{max-width:none;font-size:clamp(1rem,1.5vw,1.25rem);line-height:1.25}
          .statistics-detail-intro>p:not(.section-index){max-width:66ch;margin:1rem 0 0}
          .statistics-details-page .processed-activity-panel{margin-top:2.25rem}
          .statistics-location-note{margin:18px 0 0;color:#526b89;font-size:.8rem;line-height:1.55}
        `}</style>
      </main>
      <SiteFooter />
    </div>
  );
}
