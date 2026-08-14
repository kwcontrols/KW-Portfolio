"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type AnalyticsData = {
  updatedAt: string;
  period: string;
  pageViews: number | null;
  totalVisitors: number | null;
  countriesReached: number | null;
  averageEngagementTime: number | null;
  countries: Array<{ name: string; users: number; percentage: number }>;
  visitorTrends: Array<{ date: string; users: number; pageViews: number }>;
  topPages: Array<{ title: string; path: string; views: number }>;
  trafficSources: Array<{ source: string; users: number; percentage: number }>;
};

type SummaryKey =
  | "totalVisitors"
  | "pageViews"
  | "countriesReached"
  | "averageEngagementTime";

const SUMMARY_METRICS = [
  {
    key: "totalVisitors" as SummaryKey,
    label: "Total Visitors",
    display: (value: number) => Math.round(value).toLocaleString(),
    icon: "◎",
    tone: "blue",
  },
  {
    key: "pageViews" as SummaryKey,
    label: "Page Views",
    display: (value: number) => Math.round(value).toLocaleString(),
    icon: "↗",
    tone: "navy",
  },
  {
    key: "countriesReached" as SummaryKey,
    label: "Countries Reached",
    display: (value: number) => Math.round(value).toString(),
    icon: "◉",
    tone: "teal",
  },
  {
    key: "averageEngagementTime" as SummaryKey,
    label: "Avg. Engagement Time",
    display: (value: number) =>
      `${Math.floor(value / 60)}m ${Math.round(value % 60)}s`,
    icon: "◷",
    tone: "gold",
  },
];

const CHART_COLORS = ["#175dcc", "#0b387d", "#2c8c91", "#a66f20", "#6f7f92", "#87a6c8"];

const PROFESSIONAL_HIGHLIGHTS = [
  {
    value: "20+",
    label: "Years in automation",
    detail: "Industrial systems from design through commissioning",
  },
  {
    value: "4",
    label: "Core engineering disciplines",
    detail: "PLC, HMI, SCADA, and electrical design",
  },
  {
    value: "Multi-sector",
    label: "Industry experience",
    detail: "Pharma, water, manufacturing, and building systems",
  },
  {
    value: "AI",
    label: "Current learning focus",
    detail: "Exploring practical AI-assisted engineering workflows",
  },
];

const GROWTH_MILESTONES = [
  {
    year: "1990",
    title: "Embedded systems",
    detail: "Began developing real-time firmware and board-level systems.",
  },
  {
    year: "2004",
    title: "Industrial automation",
    detail: "Expanded into control engineering and system integration.",
  },
  {
    year: "2011",
    title: "System integrator",
    detail: "Led multidisciplinary automation projects across industries.",
  },
  {
    year: "Present",
    title: "Applied AI journey",
    detail: "Combining engineering experience with emerging AI capabilities.",
  },
];

function FadeSection({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.section
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.48, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}

function AnimatedValue({
  value,
  display,
}: {
  value: number;
  display: (value: number) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.7 });
  const reducedMotion = useReducedMotion();
  const [current, setCurrent] = useState(reducedMotion ? value : 0);

  useEffect(() => {
    if (!isInView || reducedMotion) return;
    const duration = 900;
    const start = performance.now();
    let frame = 0;
    const update = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCurrent(value * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [isInView, reducedMotion, value]);

  return <span ref={ref}>{display(current)}</span>;
}

const tooltipStyle = {
  border: "1px solid #c8d8ea",
  borderRadius: 0,
  background: "#ffffff",
  color: "#10233f",
  fontSize: "0.75rem",
  boxShadow: "0 8px 24px rgba(16, 35, 63, 0.08)",
};

export default function StatisticsDashboard({
  analytics,
}: {
  analytics: AnalyticsData | null;
}) {
  const reducedMotion = useReducedMotion();
  const chartDuration = reducedMotion ? 0 : 700;
  const updatedDate = analytics?.updatedAt ? new Date(analytics.updatedAt) : null;
  const updatedLabel =
    updatedDate && !Number.isNaN(updatedDate.getTime())
      ? new Intl.DateTimeFormat("en-CA", {
          month: "short",
          day: "numeric",
          year: "numeric",
      }).format(updatedDate)
    : null;
  const visitorTrends = (analytics?.visitorTrends ?? []).map((item) => ({
    day: new Intl.DateTimeFormat("en-CA", {
      weekday: "short",
      timeZone: "UTC",
    }).format(new Date(`${item.date}T00:00:00Z`)),
    visitors: item.users,
    views: item.pageViews,
  }));
  const trafficSources = (analytics?.trafficSources ?? []).map(
    (source, index) => ({
      ...source,
      fill: CHART_COLORS[index % CHART_COLORS.length],
    }),
  );
  const pageViewsLast7Days = (analytics?.visitorTrends ?? []).reduce(
    (sum, item) => sum + item.pageViews,
    0,
  );
  const recentAnalytics = [
    analytics?.topPages[0]
      ? {
          label: "Most viewed page",
          context: analytics.topPages[0].path,
          value: analytics.topPages[0].views.toLocaleString(),
        }
      : null,
    analytics?.trafficSources[0]
      ? {
          label: "Leading traffic source",
          context: `${analytics.trafficSources[0].percentage}% of reported users`,
          value: analytics.trafficSources[0].source,
        }
      : null,
    analytics?.countries[0]
      ? {
          label: "Top visitor country",
          context: `${analytics.countries[0].percentage}% of reported users`,
          value: analytics.countries[0].name,
        }
      : null,
    analytics?.visitorTrends.length
      ? {
          label: "Page views",
          context: "Most recent seven days",
          value: pageViewsLast7Days.toLocaleString(),
        }
      : null,
  ].filter(
    (item): item is { label: string; context: string; value: string } =>
      item !== null,
  );

  return (
    <>
      <motion.header
        className="statistics-hero"
        initial={reducedMotion ? false : { opacity: 0, y: 12 }}
        animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <p className="section-index">Analytics</p>
        <h1>Private Portal</h1>
        <p>
          A concise view of portfolio reach and engagement powered by live
          Google Analytics data, alongside selected professional highlights.
        </p>
        <span>
          Live GA4 analytics
          {updatedLabel ? ` · Updated ${updatedLabel}` : ""}
        </span>
      </motion.header>

      <FadeSection className="statistics-grid">
        {SUMMARY_METRICS.map((metric) => (
          <motion.article
            className={`statistic-card tone-${metric.tone}`}
            key={metric.label}
            whileHover={reducedMotion ? undefined : { y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <div className="statistic-card-top">
              <p>{metric.label}</p>
              <span aria-hidden="true">{metric.icon}</span>
            </div>
            <strong>
              {analytics?.[metric.key] === null || analytics?.[metric.key] === undefined ? (
                <span>—</span>
              ) : (
                <AnimatedValue
                  value={analytics[metric.key] ?? 0}
                  display={metric.display}
                />
              )}
            </strong>
            <small>Last 30 days</small>
          </motion.article>
        ))}
      </FadeSection>

      <div className="analytics-grid">
        <FadeSection className="analytics-card analytics-card-wide">
          <div className="analytics-card-heading">
            <div>
              <p className="analytics-label">Last seven days</p>
              <h2>Visitor Trends</h2>
            </div>
            <span>Live data</span>
          </div>
          {visitorTrends.length ? (
            <div
              className="recharts-frame"
              aria-label="Daily visitors and page views over the last seven days"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={visitorTrends}
                  margin={{ top: 12, right: 8, left: -22, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="visitorFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#175dcc" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="#175dcc" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#dce6f1" strokeDasharray="3 5" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#52647a", fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} allowDecimals={false} tick={{ fill: "#52647a", fontSize: 11 }} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "#c8d8ea" }} />
                  <Area type="monotone" dataKey="views" name="Page views" stroke="#8ba7c7" fill="transparent" strokeWidth={1.5} animationDuration={chartDuration} />
                  <Area type="monotone" dataKey="visitors" name="Visitors" stroke="#175dcc" fill="url(#visitorFill)" strokeWidth={2} animationDuration={chartDuration} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="analytics-empty">No data yet</p>
          )}
        </FadeSection>

        <FadeSection className="analytics-card">
          <div className="analytics-card-heading">
            <div>
              <p className="analytics-label">Most visited</p>
              <h2>Top Pages</h2>
            </div>
          </div>
          {analytics?.topPages.length ? (
            <ol className="top-pages-list">
              {analytics.topPages.map((item) => (
                <li key={`${item.path}-${item.title}`}>
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.path}</span>
                  </div>
                  <div className="page-result">
                    <strong>{item.views.toLocaleString()}</strong>
                    <small>views</small>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="analytics-empty">No data yet</p>
          )}
        </FadeSection>

        <FadeSection className="analytics-card">
          <div className="analytics-card-heading">
            <div>
              <p className="analytics-label">Acquisition</p>
              <h2>Traffic Sources</h2>
            </div>
          </div>
          {trafficSources.length ? (
            <>
              <div className="recharts-frame recharts-frame-compact" aria-label="Traffic source percentages">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trafficSources} layout="vertical" margin={{ top: 4, right: 18, left: 10, bottom: 0 }}>
                    <CartesianGrid stroke="#edf2f7" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis type="category" dataKey="source" width={76} axisLine={false} tickLine={false} tick={{ fill: "#52647a", fontSize: 11 }} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f6f7f9" }} formatter={(value) => [`${value}%`, "Share"]} />
                    <Bar dataKey="percentage" radius={[0, 2, 2, 0]} animationDuration={chartDuration}>
                      {trafficSources.map((item) => <Cell key={item.source} fill={item.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="source-legend">
                {trafficSources.map((item) => (
                  <span key={item.source}><i style={{ background: item.fill }} />{item.source}</span>
                ))}
              </div>
            </>
          ) : (
            <p className="analytics-empty">No data yet</p>
          )}
        </FadeSection>

        <FadeSection className="analytics-card">
          <div className="analytics-card-heading">
            <div>
              <p className="analytics-label">Visitor location</p>
              <h2>Audience Overview</h2>
            </div>
          </div>
          {analytics?.countries.length ? (
            <dl className="audience-list">
              {analytics.countries.map((item, index) => (
                <div key={item.name}>
                  <dt>
                    <i className="tone-dot" style={{ background: CHART_COLORS[index % CHART_COLORS.length] }} />
                    {item.name}
                  </dt>
                  <dd>{item.percentage}%</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="analytics-empty">No data yet</p>
          )}
        </FadeSection>

        <FadeSection className="analytics-card">
          <div className="analytics-card-heading">
            <div>
              <p className="analytics-label">Aggregate insights</p>
              <h2>Recent Analytics</h2>
            </div>
          </div>
          {recentAnalytics.length ? (
            <ol className="activity-list">
              {recentAnalytics.map((item) => (
                <li key={item.label}>
                  <span aria-hidden="true" />
                  <div><strong>{item.label}</strong><small>{item.context}</small></div>
                  <strong className="activity-value">{item.value}</strong>
                </li>
              ))}
            </ol>
          ) : (
            <p className="analytics-empty">No data yet</p>
          )}
        </FadeSection>
      </div>

      <FadeSection className="dashboard-section global-audience-section">
        <div className="dashboard-section-heading">
          <p className="analytics-label">Geographic reach</p>
          <h2>Global Audience</h2>
          <p>
            Live geographic reach for the last 30 days, with space reserved for
            a future interactive world map.
          </p>
        </div>
        <div
          className="world-map-placeholder"
          role="img"
          aria-label="Placeholder for a future interactive world audience map"
        >
          <div className="map-grid" aria-hidden="true" />
          {analytics?.countries.length ? (
            <div className="map-country-summary">
              {analytics.countries.slice(0, 4).map((country) => (
                <span key={country.name}>
                  {country.name}<strong>{country.percentage}%</strong>
                </span>
              ))}
            </div>
          ) : (
            <div className="analytics-empty map-empty">No geographic data yet</div>
          )}
          <p>Interactive map coming with GA4 integration</p>
        </div>
      </FadeSection>

      <FadeSection className="dashboard-section">
        <div className="dashboard-section-heading">
          <p className="analytics-label">Experience at a glance</p>
          <h2>Professional Highlights</h2>
        </div>
        <div className="highlights-grid">
          {PROFESSIONAL_HIGHLIGHTS.map((item) => (
            <article key={item.label}>
              <strong>{item.value}</strong>
              <h3>{item.label}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </FadeSection>

      <FadeSection className="dashboard-section">
        <div className="dashboard-section-heading">
          <p className="analytics-label">Continuous development</p>
          <h2>Portfolio Growth Timeline</h2>
        </div>
        <ol className="growth-timeline">
          {GROWTH_MILESTONES.map((item) => (
            <li key={item.year}>
              <span>{item.year}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </FadeSection>
    </>
  );
}
