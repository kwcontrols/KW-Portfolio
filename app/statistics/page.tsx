import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";

const STATISTICS = [
  { label: "Total Visitors", value: "2,847", detail: "+12.4% this month" },
  { label: "Page Views", value: "6,219", detail: "+8.7% this month" },
  { label: "Countries Reached", value: "24", detail: "Across five regions" },
  { label: "Avg. Engagement Time", value: "2m 18s", detail: "+14 seconds" },
];

const VISITOR_TRENDS = [
  { day: "Mon", visitors: 58 },
  { day: "Tue", visitors: 72 },
  { day: "Wed", visitors: 66 },
  { day: "Thu", visitors: 84 },
  { day: "Fri", visitors: 76 },
  { day: "Sat", visitors: 48 },
  { day: "Sun", visitors: 62 },
];

const TOP_PAGES = [
  { page: "About", path: "/", views: "2,184" },
  { page: "Projects", path: "/experience", views: "1,742" },
  { page: "Resume", path: "/resume", views: "1,396" },
  { page: "Contact", path: "/contact", views: "897" },
];

const TRAFFIC_SOURCES = [
  { source: "Direct", percentage: 42 },
  { source: "Search", percentage: 31 },
  { source: "LinkedIn", percentage: 18 },
  { source: "Referrals", percentage: 9 },
];

const AUDIENCE = [
  { label: "Canada", value: "46%" },
  { label: "United States", value: "28%" },
  { label: "Europe", value: "16%" },
  { label: "Other regions", value: "10%" },
];

const RECENT_ACTIVITY = [
  { event: "Project page viewed", context: "Vancouver, Canada", time: "4 min ago" },
  { event: "Resume downloaded", context: "Toronto, Canada", time: "18 min ago" },
  { event: "Contact page visited", context: "Seattle, United States", time: "42 min ago" },
  { event: "Returning visitor", context: "London, United Kingdom", time: "1 hr ago" },
];

export default function StatisticsPage() {
  return (
    <div className="site-shell" id="page-start">
      <SiteHeader />
      <main className="statistics-page">
        <header className="statistics-intro">
          <p className="section-index">Portfolio Analytics</p>
          <h1>Statistics</h1>
          <p>Sample data illustrating how portfolio engagement will be presented.</p>
        </header>

        <section className="statistics-grid" aria-label="Portfolio statistics">
          {STATISTICS.map((statistic) => (
            <article className="statistic-card" key={statistic.label}>
              <p>{statistic.label}</p>
              <strong>{statistic.value}</strong>
              <span>{statistic.detail}</span>
            </article>
          ))}
        </section>

        <section className="analytics-grid" aria-label="Portfolio analytics details">
          <article className="analytics-card analytics-card-wide">
            <div className="analytics-card-heading">
              <div>
                <p className="analytics-label">Last seven days</p>
                <h2>Visitor Trends</h2>
              </div>
              <span>Sample data</span>
            </div>
            <div className="visitor-chart" aria-label="Daily visitors over the last seven days">
              {VISITOR_TRENDS.map((item) => (
                <div className="visitor-bar" key={item.day}>
                  <div className="visitor-bar-track">
                    <span style={{ height: `${item.visitors}%` }} />
                  </div>
                  <strong>{item.visitors}</strong>
                  <span>{item.day}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="analytics-card">
            <div className="analytics-card-heading">
              <div>
                <p className="analytics-label">Most visited</p>
                <h2>Top Pages</h2>
              </div>
            </div>
            <ol className="top-pages-list">
              {TOP_PAGES.map((item) => (
                <li key={item.path}>
                  <div><strong>{item.page}</strong><span>{item.path}</span></div>
                  <span>{item.views}</span>
                </li>
              ))}
            </ol>
          </article>

          <article className="analytics-card">
            <div className="analytics-card-heading">
              <div>
                <p className="analytics-label">Acquisition</p>
                <h2>Traffic Sources</h2>
              </div>
            </div>
            <div className="source-chart">
              {TRAFFIC_SOURCES.map((item) => (
                <div className="source-row" key={item.source}>
                  <div><span>{item.source}</span><strong>{item.percentage}%</strong></div>
                  <div className="source-track"><span style={{ width: `${item.percentage}%` }} /></div>
                </div>
              ))}
            </div>
          </article>

          <article className="analytics-card">
            <div className="analytics-card-heading">
              <div>
                <p className="analytics-label">Visitor location</p>
                <h2>Audience Overview</h2>
              </div>
            </div>
            <dl className="audience-list">
              {AUDIENCE.map((item) => (
                <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>
              ))}
            </dl>
          </article>

          <article className="analytics-card">
            <div className="analytics-card-heading">
              <div>
                <p className="analytics-label">Latest interactions</p>
                <h2>Recent Activity</h2>
              </div>
            </div>
            <ol className="activity-list">
              {RECENT_ACTIVITY.map((item) => (
                <li key={`${item.event}-${item.time}`}>
                  <span aria-hidden="true" />
                  <div><strong>{item.event}</strong><small>{item.context}</small></div>
                  <time>{item.time}</time>
                </li>
              ))}
            </ol>
          </article>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
