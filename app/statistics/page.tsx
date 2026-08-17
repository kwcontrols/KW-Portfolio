"use client";

import { useEffect, useState } from "react";
import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";
import { GuestAccessManager } from "./GuestAccessManager";
import { FiveMinuteRealtime } from "./FiveMinuteRealtime";
import { ProcessedActivityDetail } from "./ProcessedActivityDetail";
import StatisticsDashboard, { type AnalyticsData } from "./StatisticsDashboard";

type RealtimeVisitor = { city: string; country: string; device: string; activeUsers: number };
type ExtendedAnalyticsData = AnalyticsData & {
  realtimeFiveMinuteActiveUsers?: number;
  realtimeFiveMinuteVisitors?: RealtimeVisitor[];
};

function isAnalyticsData(value: unknown): value is AnalyticsData {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  return (
    typeof data.updatedAt === "string" &&
    Array.isArray(data.countries) && Array.isArray(data.cities) && Array.isArray(data.devices) &&
    Array.isArray(data.deviceSummary) && Array.isArray(data.visitorTypes) && Array.isArray(data.visitorTrends) &&
    Array.isArray(data.topPages) && Array.isArray(data.trafficSources) && Array.isArray(data.activityLog) &&
    Array.isArray(data.realtimeVisitors)
  );
}

function nonNegativeNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;
}

export default function StatisticsPage() {
  const [analytics, setAnalytics] = useState<ExtendedAnalyticsData | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function loadAnalytics() {
      try {
        const response = await fetch("/api/statistics-data", { cache: "no-store", credentials: "same-origin", signal: controller.signal });
        if (!response.ok) throw new Error("Analytics data could not be loaded");
        const payload: unknown = await response.json();
        if (!isAnalyticsData(payload)) throw new Error("Analytics data payload is incomplete");
        const raw = payload as ExtendedAnalyticsData & Record<string, unknown>;
        const desktopUsers = nonNegativeNumber(raw.desktopUsers);
        const desktopSessions = nonNegativeNumber(raw.desktopSessions);
        const mobileUsers = nonNegativeNumber(raw.mobileUsers);
        const mobileSessions = nonNegativeNumber(raw.mobileSessions);
        const deviceSummary = desktopUsers !== null && desktopSessions !== null && mobileUsers !== null && mobileSessions !== null
          ? [{ category: "desktop", users: desktopUsers, sessions: desktopSessions }, { category: "mobile", users: mobileUsers, sessions: mobileSessions }]
          : payload.deviceSummary;
        setAnalytics({ ...payload, deviceSummary });
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
      <main className="statistics-page">
        <StatisticsDashboard analytics={analytics} />

        <FiveMinuteRealtime activeUsers={analytics?.realtimeFiveMinuteActiveUsers ?? 0} visitors={analytics?.realtimeFiveMinuteVisitors ?? []} />
        <ProcessedActivityDetail activityLog={analytics?.activityLog ?? []} />

        <p style={{ margin: "18px 0 0", color: "#526b89", fontSize: ".8rem", lineHeight: 1.55 }}>
          Location note: city and country throughout this dashboard are GA4-estimated from network/IP information. They should be treated as approximate, not as precise physical location.
        </p>

        <GuestAccessManager />
        <style>{`.statistics-page > .dashboard-section{display:none}`}</style>
      </main>
      <SiteFooter />
    </div>
  );
}
