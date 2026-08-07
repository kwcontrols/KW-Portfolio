import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";

const STATISTICS = [
  { label: "Total Visitors", value: "—" },
  { label: "Page Views", value: "—" },
  { label: "Countries Reached", value: "—" },
  { label: "Avg. Engagement Time", value: "—" },
];

const CHART_SECTIONS = [
  "Visitor Trends",
  "Page Performance",
  "Audience Geography",
];

export default function StatisticsPage() {
  return (
    <div className="site-shell" id="page-start">
      <SiteHeader />
      <main className="statistics-page">
        <section aria-labelledby="statistics-heading">
          <p className="section-index">Portfolio Analytics</p>
          <h1 id="statistics-heading">Statistics</h1>

          <div className="statistics-grid" aria-label="Portfolio statistics">
            {STATISTICS.map((statistic) => (
              <article className="statistic-card" key={statistic.label}>
                <p>{statistic.label}</p>
                <strong>{statistic.value}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="statistics-charts" aria-label="Future analytics charts">
          {CHART_SECTIONS.map((title) => (
            <section className="chart-placeholder" key={title}>
              <h2>{title}</h2>
              <div aria-hidden="true" />
            </section>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
