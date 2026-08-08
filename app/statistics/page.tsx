"use client";

import { useEffect, useState } from "react";
import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";
import StatisticsDashboard, { type AnalyticsData } from "./StatisticsDashboard";

function finiteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : null;
}

function textValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function parseAnalytics(value: unknown): AnalyticsData {
  const data = value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};

  const countries = Array.isArray(data.countries)
    ? data.countries.flatMap((entry) => {
        if (!entry || typeof entry !== "object") return [];
        const item = entry as Record<string, unknown>;
        const name = textValue(item.name);
        const users = finiteNumber(item.users);
        const percentage = finiteNumber(item.percentage);
        return name && users !== null && percentage !== null
          ? [{ name, users, percentage }]
          : [];
      })
    : [];

  const visitorTrends = Array.isArray(data.visitorTrends)
    ? data.visitorTrends.flatMap((entry) => {
        if (!entry || typeof entry !== "object") return [];
        const item = entry as Record<string, unknown>;
        const date = textValue(item.date);
        const users = finiteNumber(item.users);
        const pageViews = finiteNumber(item.pageViews);
        return date && users !== null && pageViews !== null
          ? [{ date, users, pageViews }]
          : [];
      })
    : [];

  const topPages = Array.isArray(data.topPages)
    ? data.topPages.flatMap((entry) => {
        if (!entry || typeof entry !== "object") return [];
        const item = entry as Record<string, unknown>;
        const title = textValue(item.title);
        const path = textValue(item.path);
        const views = finiteNumber(item.views);
        return path && views !== null
          ? [{ title: title || path, path, views }]
          : [];
      })
    : [];

  const trafficSources = Array.isArray(data.trafficSources)
    ? data.trafficSources.flatMap((entry) => {
        if (!entry || typeof entry !== "object") return [];
        const item = entry as Record<string, unknown>;
        const source = textValue(item.source);
        const users = finiteNumber(item.users);
        const percentage = finiteNumber(item.percentage);
        return source && users !== null && percentage !== null
          ? [{ source, users, percentage }]
          : [];
      })
    : [];

  return {
    updatedAt: textValue(data.updatedAt),
    period: textValue(data.period),
    pageViews: finiteNumber(data.pageViews),
    totalVisitors: finiteNumber(data.totalVisitors),
    countriesReached: finiteNumber(data.countriesReached),
    averageEngagementTime: finiteNumber(data.averageEngagementTime),
    countries,
    visitorTrends,
    topPages,
    trafficSources,
  };
}

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
        setAnalytics(parseAnalytics(await response.json()));
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
      </main>
      <SiteFooter />
    </div>
  );
}
