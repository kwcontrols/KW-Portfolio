"use client";

import { useEffect, useState } from "react";
import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";
import { GuestAccessManager } from "./GuestAccessManager";
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

  const cities = Array.isArray(data.cities)
    ? data.cities.flatMap((entry) => {
        if (!entry || typeof entry !== "object") return [];
        const item = entry as Record<string, unknown>;
        const city = textValue(item.city);
        const country = textValue(item.country);
        const users = finiteNumber(item.users);
        const sessions = finiteNumber(item.sessions);
        return city && users !== null && sessions !== null
          ? [{ city, country, users, sessions }]
          : [];
      })
    : [];

  const devices = Array.isArray(data.devices)
    ? data.devices.flatMap((entry) => {
        if (!entry || typeof entry !== "object") return [];
        const item = entry as Record<string, unknown>;
        const category = textValue(item.category);
        const browser = textValue(item.browser);
        const operatingSystem = textValue(item.operatingSystem);
        const users = finiteNumber(item.users);
        const sessions = finiteNumber(item.sessions);
        return category && users !== null && sessions !== null
          ? [{ category, browser, operatingSystem, users, sessions }]
          : [];
      })
    : [];

  const visitorTypes = Array.isArray(data.visitorTypes)
    ? data.visitorTypes.flatMap((entry) => {
        if (!entry || typeof entry !== "object") return [];
        const item = entry as Record<string, unknown>;
        const type = textValue(item.type);
        const users = finiteNumber(item.users);
        const percentage = finiteNumber(item.percentage);
        return type && users !== null && percentage !== null
          ? [{ type, users, percentage }]
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
        const sessions = finiteNumber(item.sessions);
        return date && users !== null && pageViews !== null && sessions !== null
          ? [{ date, users, pageViews, sessions }]
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
    activeVisitors: finiteNumber(data.activeVisitors),
    sessions: finiteNumber(data.sessions),
    countriesReached: finiteNumber(data.countriesReached),
    averageEngagementTime: finiteNumber(data.averageEngagementTime),
    countries,
    cities,
    devices,
    visitorTypes,
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
        const response = await fetch("/api/statistics-data", {
          cache: "no-store",
          credentials: "same-origin",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Analytics data could not be loaded");
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
        <GuestAccessManager />
      </main>
      <SiteFooter />
    </div>
  );
}
