"use client";

import { useEffect, useState } from "react";
import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";
import { GuestAccessManager } from "./GuestAccessManager";
import { PrivateReferenceCard } from "./PrivateReferenceCard";
import { FiveMinuteRealtime } from "./FiveMinuteRealtime";
import StatisticsDashboard, { type AnalyticsData } from "./StatisticsDashboard";

type RealtimeVisitor = { city: string; country: string; device: string; activeUsers: number; region?: string };
type ExtendedAnalyticsData = AnalyticsData & {
  realtimeFiveMinuteActiveUsers?: number;
  realtimeFiveMinuteVisitors?: RealtimeVisitor[];
};

const CANADA_REGION_CODES: Record<string, string> = {
  Alberta: "AB", "British Columbia": "BC", Manitoba: "MB", "New Brunswick": "NB",
  "Newfoundland and Labrador": "NL", "Northwest Territories": "NT", "Nova Scotia": "NS",
  Nunavut: "NU", Ontario: "ON", "Prince Edward Island": "PE", Quebec: "QC",
  Saskatchewan: "SK", Yukon: "YT",
};

function locationArea(item: { country?: string; region?: string }) {
  const country = String(item.country || "");
  const region = String(item.region || "");
  if (country === "Canada") return CANADA_REGION_CODES[region] || region || "Canada";
  if (country === "United States" || country === "United States of America") return "USA";
  return country || region || "Unknown";
}

function withDisplayCountry<T extends { country: string }>(item: T): T {
  const region = String((item as T & { region?: string }).region || "");
  return { ...item, country: locationArea({ country: item.country, region }) };
}

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
        setAnalytics({
          ...payload,
          deviceSummary,
          cities: payload.cities.map((item) => withDisplayCountry(item as typeof item & { region?: string })),
          realtimeVisitors: payload.realtimeVisitors.map((item) => withDisplayCountry(item as typeof item & { region?: string })),
          realtimeFiveMinuteVisitors: (raw.realtimeFiveMinuteVisitors ?? []).map((item) => withDisplayCountry(item)),
        });
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) setAnalytics(null);
      }
    }
    void loadAnalytics();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const card = document.querySelector<HTMLElement>(".statistics-grid .statistic-card:nth-child(2)");
    if (!card) return;

    const label = card.querySelector<HTMLElement>(".statistic-card-top p");
    if (label) label.textContent = "Active Users & Details";
    card.setAttribute("role", "link");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", "Open active users and processed visitor activity details");
    card.classList.add("statistic-card-link");

    let detailsLink = card.querySelector<HTMLElement>(".statistic-card-details-link");
    if (!detailsLink) {
      detailsLink = document.createElement("span");
      detailsLink.className = "statistic-card-details-link";
      detailsLink.textContent = "View all details →";
      card.appendChild(detailsLink);
    }

    const openDetails = () => window.location.assign("/statistics/details");
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openDetails();
      }
    };

    card.addEventListener("click", openDetails);
    card.addEventListener("keydown", onKeyDown);
    return () => {
      card.removeEventListener("click", openDetails);
      card.removeEventListener("keydown", onKeyDown);
    };
  }, [analytics]);

  return (
    <div className="site-shell" id="page-start">
      <SiteHeader />
      <main className="statistics-page">
        <StatisticsDashboard analytics={analytics} />
        <FiveMinuteRealtime activeUsers={analytics?.realtimeFiveMinuteActiveUsers ?? 0} visitors={analytics?.realtimeFiveMinuteVisitors ?? []} />

        <p style={{ margin: "18px 0 0", color: "#526b89", fontSize: ".8rem", lineHeight: 1.55 }}>
          Location note: city, province/region and country throughout this dashboard are GA4-estimated from network/IP information. They should be treated as approximate, not as precise physical location.
        </p>

        <GuestAccessManager />
        <PrivateReferenceCard />
        <style>{`
          .statistics-page > .dashboard-section{display:none}
          .statistic-card-link{cursor:pointer}
          .statistic-card-link:focus-visible{outline:2px solid var(--blue);outline-offset:3px}
          .statistic-card-details-link{display:block;margin-top:.65rem;color:#175dcc;font-size:.72rem;font-weight:800}
        `}</style>
      </main>
      <SiteFooter />
    </div>
  );
}
