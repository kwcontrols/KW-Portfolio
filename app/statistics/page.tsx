"use client";

import { useEffect, useState } from "react";
import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";
import { GuestAccessManager } from "./GuestAccessManager";
import StatisticsDashboard, { type AnalyticsData } from "./StatisticsDashboard";

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

export default function StatisticsPage() {
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
        if (!isAnalyticsData(payload)) {
          throw new Error("Analytics data payload is incomplete");
        }

        // This API is our own authenticated endpoint and already returns the
        // generated analytics shape. Pass it through intact so newly added
        // fields such as deviceSummary and realtimeVisitors cannot be silently
        // dropped by a second client-side normalization layer.
        setAnalytics(payload);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setAnalytics(null);
        }
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
        <GuestAccessManager />
      </main>
      <SiteFooter />
    </div>
  );
}
