"use client";

import { useEffect, useState } from "react";
import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";
import StatisticsDashboard from "./StatisticsDashboard";

type AnalyticsData = {
  updatedAt: string;
  period: string;
  pageViews: number;
  totalVisitors: number;
};

export default function StatisticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAnalytics() {
      try {
        const response = await fetch("/analytics.json", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Analytics file could not be loaded");

        const data = (await response.json()) as Partial<AnalyticsData>;
        if (
          typeof data.pageViews !== "number" ||
          !Number.isFinite(data.pageViews)
        ) {
          throw new Error(
            "Analytics file contains an invalid Page Views value",
          );
        }
        if (
          typeof data.totalVisitors !== "number" ||
          !Number.isFinite(data.totalVisitors)
        ) {
          throw new Error(
            "Analytics file contains an invalid Total Visitors value",
          );
        }

        setAnalytics({
          updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : "",
          period: typeof data.period === "string" ? data.period : "",
          pageViews: data.pageViews,
          totalVisitors: data.totalVisitors,
        });
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
        <StatisticsDashboard
          pageViews={analytics?.pageViews ?? null}
          totalVisitors={analytics?.totalVisitors ?? null}
          analyticsUpdatedAt={analytics?.updatedAt || null}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
