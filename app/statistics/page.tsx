"use client";

import { useEffect, useState } from "react";
import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";
import { GuestAccessManager } from "./GuestAccessManager";
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
    Array.isArray(data.countries) &&
    Array.isArray(data.cities) &&
    Array.isArray(data.devices) &&
    Array.isArray(data.deviceSummary) &&
    Array.isArray(data.visitorTypes) &&
    Array.isArray(data.visitorTrends) &&
    Array.isArray(data.topPages) &&
    Array.isArray(data.trafficSources) &&
    Array.isArray(data.activityLog) &&
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
        const response = await fetch("/api/statistics-data", {
          cache: "no-store",
          credentials: "same-origin",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Analytics data could not be loaded");
        const payload: unknown = await response.json();
        if (!isAnalyticsData(payload)) throw new Error("Analytics data payload is incomplete");

        const raw = payload as ExtendedAnalyticsData & Record<string, unknown>;
        const desktopUsers = nonNegativeNumber(raw.desktopUsers);
        const desktopSessions = nonNegativeNumber(raw.desktopSessions);
        const mobileUsers = nonNegativeNumber(raw.mobileUsers);
        const mobileSessions = nonNegativeNumber(raw.mobileSessions);
        const deviceSummary = desktopUsers !== null && desktopSessions !== null && mobileUsers !== null && mobileSessions !== null
          ? [
              { category: "desktop", users: desktopUsers, sessions: desktopSessions },
              { category: "mobile", users: mobileUsers, sessions: mobileSessions },
            ]
          : payload.deviceSummary;
        setAnalytics({ ...payload, deviceSummary });
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) setAnalytics(null);
      }
    }

    void loadAnalytics();
    return () => controller.abort();
  }, []);

  const fiveMinuteVisitors = analytics?.realtimeFiveMinuteVisitors ?? [];
  const fiveMinuteActive = analytics?.realtimeFiveMinuteActiveUsers ?? 0;

  return (
    <div className="site-shell" id="page-start">
      <SiteHeader />
      <main className="statistics-page">
        <StatisticsDashboard analytics={analytics} />

        <section className="analytics-card analytics-card-wide" style={{ marginTop: "24px" }}>
          <div className="analytics-card-heading">
            <div>
              <p className="analytics-label">Last 5 minutes</p>
              <h2>Immediate Realtime Activity</h2>
            </div>
            <span>{fiveMinuteActive} active</span>
          </div>
          <p style={{ marginTop: 0, color: "#526b89", fontSize: ".85rem" }}>
            A tighter realtime window for quick testing. GA4 city values are network/IP-based estimates and may differ from a visitor&apos;s physical location.
          </p>
          {fiveMinuteVisitors.length ? (
            <ol className="top-pages-list">
              {fiveMinuteVisitors.map((visitor, index) => (
                <li key={`${visitor.city}-${visitor.country}-${visitor.device}-${index}`}>
                  <div>
                    <strong>{visitor.city}, {visitor.country}</strong>
                    <span>{visitor.device} · GA4-estimated location</span>
                  </div>
                  <div className="page-result">
                    <strong>{visitor.activeUsers}</strong>
                    <small>active</small>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="analytics-empty">No active users reported in the last 5 minutes when this snapshot was generated.</p>
          )}
        </section>

        <p style={{ margin: "18px 0 0", color: "#526b89", fontSize: ".8rem", lineHeight: 1.55 }}>
          Location note: city and country throughout this dashboard are GA4-estimated from network/IP information. They should be treated as approximate, not as precise physical location.
        </p>

        <GuestAccessManager />
      </main>
      <SiteFooter />
    </div>
  );
}
