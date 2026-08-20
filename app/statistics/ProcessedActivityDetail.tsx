"use client";

import type { AnalyticsData } from "./StatisticsDashboard";

function formatDuration(value: number) {
  const seconds = Math.max(0, Math.round(value));
  return seconds >= 60 ? `${Math.floor(seconds / 60)}m ${seconds % 60}s` : `${seconds}s`;
}

const CANADA_REGION_CODES: Record<string, string> = {
  Alberta: "AB",
  "British Columbia": "BC",
  Manitoba: "MB",
  "New Brunswick": "NB",
  "Newfoundland and Labrador": "NL",
  "Northwest Territories": "NT",
  "Nova Scotia": "NS",
  Nunavut: "NU",
  Ontario: "ON",
  "Prince Edward Island": "PE",
  Quebec: "QC",
  Saskatchewan: "SK",
  Yukon: "YT",
};

function locationArea(region = "", country = "") {
  if (country === "Canada") return CANADA_REGION_CODES[region] || region || "Canada";
  if (country === "United States" || country === "United States of America") return "USA";
  return country || region || "Unknown";
}

function csvValue(value: unknown) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export function ProcessedActivityDetail({ activityLog }: { activityLog: AnalyticsData["activityLog"] }) {
  function exportCsv() {
    const header = [
      "Date",
      "Time",
      "City",
      "Province or Country",
      "Device",
      "OS",
      "Browser",
      "Landing page",
      "Users",
      "Sessions",
      "Views",
      "Avg. session seconds",
    ];
    const lines = activityLog.map((item) =>
      [
        item.date,
        item.time,
        item.city,
        locationArea(item.region, item.country),
        item.device,
        item.operatingSystem,
        item.browser,
        item.landingPage,
        item.activeUsers,
        item.sessions,
        item.pageViews,
        item.averageSessionDuration,
      ]
        .map(csvValue)
        .join(","),
    );
    const csv = [header.map(csvValue).join(","), ...lines].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "portfolio-active-user-details.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="processed-activity-panel">
      <div className="processed-heading-row">
        <div className="dashboard-section-heading">
          <p className="analytics-label">Last 30 days</p>
          <h2>Processed Visitor Activity Detail</h2>
          <p>
            Aggregated GA4 activity by date, time, approximate location, technology and landing page. Times shown in Pacific Time (PT). Recent activity may take several hours to appear. Rows may combine multiple sessions or users; this is not an IP or personally identifiable visitor log.
          </p>
        </div>
        <button className="processed-export" type="button" onClick={exportCsv} disabled={!activityLog.length}>
          ↓ Export CSV
        </button>
      </div>
      {activityLog.length ? (
        <div className="processed-table-wrap">
          <table className="processed-table">
            <thead><tr>{["Date","Time","City / Province or Country","Device","OS","Browser","Landing page","Users","Sessions","Views","Avg. session"].map((heading)=><th key={heading}>{heading}</th>)}</tr></thead>
            <tbody>
              {activityLog.map((item,index)=>(
                <tr key={`${item.date}-${item.time}-${item.city}-${item.device}-${index}`}>
                  <td>{item.date}</td><td>{item.time || "—"}</td><td>{item.city}, {locationArea(item.region, item.country)}</td><td>{item.device}</td><td>{item.operatingSystem}</td><td>{item.browser}</td><td>{item.landingPage}</td><td>{item.activeUsers}</td><td>{item.sessions}</td><td>{item.pageViews}</td><td>{formatDuration(item.averageSessionDuration)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="analytics-empty">No detailed activity data yet. Run the analytics update to populate this section.</p>}
      <style>{`
        .processed-activity-panel{margin-top:var(--statistics-section-gap);padding-top:2.5rem;border-top:1px solid var(--line)}
        .processed-heading-row{display:flex;align-items:flex-start;justify-content:space-between;gap:1.5rem}
        .processed-heading-row .dashboard-section-heading{flex:1}
        .processed-activity-panel h2{max-width:none;font-size:clamp(1rem,1.5vw,1.25rem);line-height:1.25}
        .processed-export{flex:0 0 auto;margin-top:.15rem;padding:.65rem .9rem;border:1px solid #7ea7ef;background:#fff;color:#175dcc;font:inherit;font-size:.76rem;font-weight:800;cursor:pointer}
        .processed-export:hover:not(:disabled),.processed-export:focus-visible:not(:disabled){background:#eef4fb}
        .processed-export:disabled{opacity:.45;cursor:not-allowed}
        .processed-table-wrap{overflow-x:auto;margin-top:1.25rem;border:1px solid #c8d8ea;background:#fff}
        .processed-table{width:100%;min-width:1120px;border-collapse:collapse;font-size:.78rem}
        .processed-table th{text-align:left;padding:12px;border-bottom:1px solid #c8d8ea}
        .processed-table td{padding:10px 12px;border-bottom:1px solid #edf2f7}
        .processed-table td:nth-child(2){white-space:nowrap}
        @media(max-width:700px){.processed-heading-row{display:block}.processed-export{margin-top:1rem}}
      `}</style>
    </section>
  );
}
