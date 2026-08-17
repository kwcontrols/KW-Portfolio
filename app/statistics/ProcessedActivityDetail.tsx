"use client";

import type { AnalyticsData } from "./StatisticsDashboard";

function formatDuration(value: number) {
  const seconds = Math.max(0, Math.round(value));
  return seconds >= 60 ? `${Math.floor(seconds / 60)}m ${seconds % 60}s` : `${seconds}s`;
}

export function ProcessedActivityDetail({ activityLog }: { activityLog: AnalyticsData["activityLog"] }) {
  return (
    <section className="processed-activity-panel">
      <div className="dashboard-section-heading">
        <p className="analytics-label">Last 30 days</p>
        <h2>Processed Visitor Activity Detail</h2>
        <p>
          Aggregated GA4 activity by date, time, approximate location, technology and landing page. Times shown in Pacific Time (PT). Recent activity may take several hours to appear. Rows may combine multiple sessions or users; this is not an IP or personally identifiable visitor log.
        </p>
      </div>
      {activityLog.length ? (
        <div className="processed-table-wrap">
          <table className="processed-table">
            <thead><tr>{["Date","Time","City / Country","Device","OS","Browser","Landing page","Users","Sessions","Views","Avg. session"].map((heading)=><th key={heading}>{heading}</th>)}</tr></thead>
            <tbody>
              {activityLog.map((item,index)=>(
                <tr key={`${item.date}-${item.time}-${item.city}-${item.device}-${index}`}>
                  <td>{item.date}</td><td>{item.time || "—"}</td><td>{item.city}, {item.country}</td><td>{item.device}</td><td>{item.operatingSystem}</td><td>{item.browser}</td><td>{item.landingPage}</td><td>{item.activeUsers}</td><td>{item.sessions}</td><td>{item.pageViews}</td><td>{formatDuration(item.averageSessionDuration)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="analytics-empty">No detailed activity data yet. Run the analytics update to populate this section.</p>}
      <style>{`
        .processed-activity-panel{margin-top:var(--statistics-section-gap);padding-top:2.5rem;border-top:1px solid var(--line)}
        .processed-activity-panel h2{max-width:none;font-size:clamp(1rem,1.5vw,1.25rem);line-height:1.25}
        .processed-table-wrap{overflow-x:auto;margin-top:1.25rem;border:1px solid #c8d8ea;background:#fff}
        .processed-table{width:100%;min-width:1120px;border-collapse:collapse;font-size:.78rem}
        .processed-table th{text-align:left;padding:12px;border-bottom:1px solid #c8d8ea}
        .processed-table td{padding:10px 12px;border-bottom:1px solid #edf2f7}
        .processed-table td:nth-child(2){white-space:nowrap}
      `}</style>
    </section>
  );
}
