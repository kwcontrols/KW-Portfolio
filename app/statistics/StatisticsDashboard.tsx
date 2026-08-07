"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Page Views is supplied by public/analytics.json; remaining metrics stay as samples for now.
const SUMMARY_METRICS = [
  {
    label: "Total Visitors",
    value: 2847,
    display: (value: number) => Math.round(value).toLocaleString(),
    detail: "+12.4% this month",
    icon: "◎",
    tone: "blue",
  },
  {
    label: "Page Views",
    value: 6219,
    display: (value: number) => Math.round(value).toLocaleString(),
    detail: "+8.7% this month",
    icon: "↗",
    tone: "navy",
  },
  {
    label: "Countries Reached",
    value: 24,
    display: (value: number) => Math.round(value).toString(),
    detail: "Across five regions",
    icon: "◉",
    tone: "teal",
  },
  {
    label: "Avg. Engagement Time",
    value: 138,
    display: (value: number) =>
      `${Math.floor(value / 60)}m ${Math.round(value % 60)}s`,
    detail: "+14 seconds",
    icon: "◷",
    tone: "gold",
  },
];

const VISITOR_TRENDS = [
  { day: "Mon", visitors: 58, views: 116 },
  { day: "Tue", visitors: 72, views: 148 },
  { day: "Wed", visitors: 66, views: 139 },
  { day: "Thu", visitors: 84, views: 176 },
  { day: "Fri", visitors: 76, views: 162 },
  { day: "Sat", visitors: 48, views: 96 },
  { day: "Sun", visitors: 62, views: 128 },
];

const TOP_PAGES = [
  { page: "About", path: "/", views: "2,184", change: "+14%" },
  { page: "Projects", path: "/experience", views: "1,742", change: "+11%" },
  { page: "Resume", path: "/resume", views: "1,396", change: "+7%" },
  { page: "Contact", path: "/contact", views: "897", change: "+5%" },
];

const TRAFFIC_SOURCES = [
  { source: "Direct", percentage: 42, fill: "#175dcc" },
  { source: "Search", percentage: 31, fill: "#0b387d" },
  { source: "LinkedIn", percentage: 18, fill: "#2c8c91" },
  { source: "Referrals", percentage: 9, fill: "#c58a31" },
];

const AUDIENCE = [
  { label: "Canada", value: "46%", tone: "blue" },
  { label: "United States", value: "28%", tone: "navy" },
  { label: "Europe", value: "16%", tone: "teal" },
  { label: "Other regions", value: "10%", tone: "gold" },
];

const RECENT_ACTIVITY = [
  {
    event: "Project page viewed",
    context: "Vancouver, Canada",
    time: "4 min ago",
  },
  {
    event: "Resume downloaded",
    context: "Toronto, Canada",
    time: "18 min ago",
  },
  {
    event: "Contact page visited",
    context: "Seattle, United States",
    time: "42 min ago",
  },
  {
    event: "Returning visitor",
    context: "London, United Kingdom",
    time: "1 hr ago",
  },
];

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
  pageViews,
  analyticsUpdatedAt,
}: {
  pageViews: number | null;
  analyticsUpdatedAt: string | null;
}) {
  const reducedMotion = useReducedMotion();
  const chartDuration = reducedMotion ? 0 : 700;
  const updatedDate = analyticsUpdatedAt ? new Date(analyticsUpdatedAt) : null;
  const updatedLabel =
    updatedDate && !Number.isNaN(updatedDate.getTime())
      ? new Intl.DateTimeFormat("en-CA", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }).format(updatedDate)
      : null;

  return (
    <>
      <motion.header
        className="statistics-hero"
        initial={reducedMotion ? false : { opacity: 0, y: 12 }}
        animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <p className="section-index">Portfolio Analytics</p>
        <h1>Portfolio Analytics</h1>
        <p>
          A concise view of portfolio reach, engagement, and professional
          growth—combining live GA4 page-view data with sample metrics for the
          remaining dashboard.
        </p>
        <span>
          Sample data except Page Views
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
              {metric.label === "Page Views" && pageViews === null ? (
                <span>—</span>
              ) : (
                <AnimatedValue
                  value={
                    metric.label === "Page Views"
                      ? (pageViews ?? 0)
                      : metric.value
                  }
                  display={metric.display}
                />
              )}
            </strong>
            <small>
              {metric.label === "Page Views" ? "Last 30 days" : metric.detail}
            </small>
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
            <span>Sample data</span>
          </div>
          <div
            className="recharts-frame"
            aria-label="Daily visitors and page views over the last seven days"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={VISITOR_TRENDS}
                margin={{ top: 12, right: 8, left: -22, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="visitorFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#175dcc" stopOpacity={0.28} />
                    <stop
                      offset="100%"
                      stopColor="#175dcc"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="#dce6f1"
                  strokeDasharray="3 5"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#52647a", fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#52647a", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ stroke: "#c8d8ea" }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  name="Page views"
                  stroke="#8ba7c7"
                  fill="transparent"
                  strokeWidth={1.5}
                  animationDuration={chartDuration}
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  name="Visitors"
                  stroke="#175dcc"
                  fill="url(#visitorFill)"
                  strokeWidth={2}
                  animationDuration={chartDuration}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </FadeSection>

        <FadeSection className="analytics-card">
          <div className="analytics-card-heading">
            <div>
              <p className="analytics-label">Most visited</p>
              <h2>Top Pages</h2>
            </div>
          </div>
          <ol className="top-pages-list">
            {TOP_PAGES.map((item) => (
              <li key={item.path}>
                <div>
                  <strong>{item.page}</strong>
                  <span>{item.path}</span>
                </div>
                <div className="page-result">
                  <strong>{item.views}</strong>
                  <small>{item.change}</small>
                </div>
              </li>
            ))}
          </ol>
        </FadeSection>

        <FadeSection className="analytics-card">
          <div className="analytics-card-heading">
            <div>
              <p className="analytics-label">Acquisition</p>
              <h2>Traffic Sources</h2>
            </div>
          </div>
          <div
            className="recharts-frame recharts-frame-compact"
            aria-label="Traffic source percentages"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={TRAFFIC_SOURCES}
                layout="vertical"
                margin={{ top: 4, right: 18, left: 10, bottom: 0 }}
              >
                <CartesianGrid stroke="#edf2f7" horizontal={false} />
                <XAxis type="number" domain={[0, 50]} hide />
                <YAxis
                  type="category"
                  dataKey="source"
                  width={70}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#52647a", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ fill: "#f6f7f9" }}
                  formatter={(value) => [`${value}%`, "Share"]}
                />
                <Bar
                  dataKey="percentage"
                  fill="#175dcc"
                  radius={[0, 2, 2, 0]}
                  animationDuration={chartDuration}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="source-legend">
            {TRAFFIC_SOURCES.map((item) => (
              <span key={item.source}>
                <i style={{ background: item.fill }} />
                {item.source}
              </span>
            ))}
          </div>
        </FadeSection>

        <FadeSection className="analytics-card">
          <div className="analytics-card-heading">
            <div>
              <p className="analytics-label">Visitor location</p>
              <h2>Audience Overview</h2>
            </div>
          </div>
          <dl className="audience-list">
            {AUDIENCE.map((item) => (
              <div key={item.label}>
                <dt>
                  <i className={`tone-dot tone-${item.tone}`} />
                  {item.label}
                </dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </FadeSection>

        <FadeSection className="analytics-card">
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
                <div>
                  <strong>{item.event}</strong>
                  <small>{item.context}</small>
                </div>
                <time>{item.time}</time>
              </li>
            ))}
          </ol>
        </FadeSection>
      </div>

      <FadeSection className="dashboard-section global-audience-section">
        <div className="dashboard-section-heading">
          <p className="analytics-label">Geographic reach</p>
          <h2>Global Audience</h2>
          <p>
            Reserved for an interactive world map when live GA4 geographic data
            is connected.
          </p>
        </div>
        <div
          className="world-map-placeholder"
          role="img"
          aria-label="Placeholder for a future interactive world audience map"
        >
          <div className="map-grid" aria-hidden="true" />
          <span className="map-point map-point-canada">
            Canada<strong>46%</strong>
          </span>
          <span className="map-point map-point-us">
            United States<strong>28%</strong>
          </span>
          <span className="map-point map-point-europe">
            Europe<strong>16%</strong>
          </span>
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
