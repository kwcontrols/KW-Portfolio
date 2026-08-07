import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";
import StatisticsDashboard from "./StatisticsDashboard";

export default function StatisticsPage() {
  return (
    <div className="site-shell" id="page-start">
      <SiteHeader />
      <main className="statistics-page">
        <StatisticsDashboard />
      </main>
      <SiteFooter />
    </div>
  );
}
