import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const propertyId = process.env.GA4_PROPERTY_ID;

if (!propertyId) {
  throw new Error("GA4_PROPERTY_ID is missing");
}

const analyticsDataClient = new BetaAnalyticsDataClient();

async function main() {
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

  const pageViews = Number(response.rows?.[0]?.metricValues?.[0]?.value ?? 0);

  const analytics = {
    updatedAt: new Date().toISOString(),
    period: "last30days",
    pageViews,
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
