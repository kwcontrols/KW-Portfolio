import { BetaAnalyticsDataClient } from "@google-analytics/data";

const analyticsDataClient = new BetaAnalyticsDataClient();

const propertyId = process.env.GA4_PROPERTY_ID;

if (!propertyId) {
  throw new Error("GA4_PROPERTY_ID is missing from .env.local");
}

export async function getPageViews() {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate: "30daysAgo",
        endDate: "today",
      },
    ],
    metrics: [
      {
        name: "screenPageViews",
      },
    ],
  });

  return Number(response.rows?.[0]?.metricValues?.[0]?.value ?? 0);
}
