import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const propertyId = process.env.GA4_PROPERTY_ID;

if (!propertyId) {
  throw new Error("GA4_PROPERTY_ID is missing");
}

const analyticsDataClient = new BetaAnalyticsDataClient();

function metricValue(
  row: { metricValues?: Array<{ value?: string | null }> | null } | null | undefined,
  index: number,
) {
  const value = Number(row?.metricValues?.[index]?.value ?? 0);
  return Number.isFinite(value) ? value : 0;
}

function dimensionValue(
  row: { dimensionValues?: Array<{ value?: string | null }> | null } | null | undefined,
  index: number,
) {
  return row?.dimensionValues?.[index]?.value?.trim() ?? "";
}

function percentage(value: number, total: number) {
  return total > 0 ? Number(((value / total) * 100).toFixed(1)) : 0;
}

function formatGaDate(value: string) {
  return value.length === 8
    ? `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`
    : value;
}

function recentUtcDates(days: number) {
  const dates: string[] = [];
  const today = new Date();
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(
      Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate() - offset,
      ),
    );
    dates.push(date.toISOString().slice(0, 10));
  }
  return dates;
}

async function main() {
  const [batch] = await analyticsDataClient.batchRunReports({
    property: `properties/${propertyId}`,
    requests: [
      {
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        metrics: [
          { name: "screenPageViews" },
          { name: "totalUsers" },
          { name: "userEngagementDuration" },
        ],
      },
      {
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "country" }],
        metrics: [{ name: "totalUsers" }],
        orderBys: [{ metric: { metricName: "totalUsers" }, desc: true }],
        limit: 250,
      },
      {
        dateRanges: [{ startDate: "6daysAgo", endDate: "today" }],
        dimensions: [{ name: "date" }],
        metrics: [{ name: "totalUsers" }, { name: "screenPageViews" }],
        orderBys: [{ dimension: { dimensionName: "date" } }],
      },
      {
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "pageTitle" }, { name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 5,
      },
      {
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "totalUsers" }],
        orderBys: [{ metric: { metricName: "totalUsers" }, desc: true }],
        limit: 6,
      },
    ],
  });

  const [summaryReport, countryReport, trendsReport, pagesReport, sourcesReport] =
    batch.reports ?? [];
  const summaryRow = summaryReport?.rows?.[0];
  const pageViews = metricValue(summaryRow, 0);
  const totalVisitors = metricValue(summaryRow, 1);
  const engagementDuration = metricValue(summaryRow, 2);
  const averageEngagementTime =
    totalVisitors > 0
      ? Number((engagementDuration / totalVisitors).toFixed(1))
      : 0;

  const countryRows = (countryReport?.rows ?? [])
    .map((row) => ({
      name: dimensionValue(row, 0),
      users: metricValue(row, 0),
    }))
    .filter(
      (country) =>
        country.name && country.name !== "(not set)" && country.users > 0,
    );
  const countryUserTotal = countryRows.reduce(
    (sum, country) => sum + country.users,
    0,
  );
  const countries = countryRows.slice(0, 6).map((country) => ({
    ...country,
    percentage: percentage(country.users, countryUserTotal),
  }));

  const trendRows = new Map(
    (trendsReport?.rows ?? []).map((row) => [
      formatGaDate(dimensionValue(row, 0)),
      { users: metricValue(row, 0), pageViews: metricValue(row, 1) },
    ]),
  );
  const visitorTrends = recentUtcDates(7).map((date) => ({
    date,
    users: trendRows.get(date)?.users ?? 0,
    pageViews: trendRows.get(date)?.pageViews ?? 0,
  }));

  const topPages = (pagesReport?.rows ?? []).map((row) => {
    const pathValue = dimensionValue(row, 1) || "/";
    const titleValue = dimensionValue(row, 0);
    return {
      title:
        titleValue && titleValue !== "(not set)" ? titleValue : pathValue,
      path: pathValue,
      views: metricValue(row, 0),
    };
  });

  const rawSources = (sourcesReport?.rows ?? [])
    .map((row) => ({
      source: dimensionValue(row, 0) || "Unassigned",
      users: metricValue(row, 0),
    }))
    .filter((source) => source.users > 0);
  const sourceUserTotal = rawSources.reduce(
    (sum, source) => sum + source.users,
    0,
  );
  const trafficSources = rawSources.map((source) => ({
    ...source,
    percentage: percentage(source.users, sourceUserTotal),
  }));

  const analytics = {
    updatedAt: new Date().toISOString(),
    period: "last30days",
    pageViews,
    totalVisitors,
    averageEngagementTime,
    countriesReached: countryRows.length,
    countries,
    visitorTrends,
    topPages,
    trafficSources,
  };

  const outputPath = path.join(process.cwd(), "public", "analytics.json");
  await writeFile(outputPath, JSON.stringify(analytics, null, 2), "utf8");

  console.log(`Analytics written to ${outputPath}`);
  console.log(analytics);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
