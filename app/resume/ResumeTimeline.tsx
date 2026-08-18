"use client";

import { KeyboardEvent, MouseEvent, useState } from "react";

type TimelineEntry = {
  marker: string;
  title: string;
  details: string[];
  bullets?: string[];
  link?: {
    label: string;
    href: string;
  };
};

const CAREER_JOURNEY: TimelineEntry[] = [
  {
    marker: "2026 – Present",
    title: "Process Automation Consultant",
    details: [],
    link: {
      label: "KW Controls",
      href: "https://kwcontrols.github.io/index.html",
    },
    bullets: [
      "Providing process automation and system integration solutions, with a focus on PLC/HMI/SCADA development, troubleshooting, and technical support.",
    ],
  },
  {
    marker: "2022 – 2026",
    title: "System Integration & Process Automation",
    details: [],
    bullets: [
      "Delivered PLC/SCADA modernization, material handling automation, naval HVAC-R controls, and industrial water treatment systems across Rockwell and Siemens platforms.",
    ],
  },
  {
    marker: "2018 – 2022",
    title: "Process & Industrial Automation",
    details: [],
    bullets: [
      "Developed automation solutions for pharmaceutical clean utilities and industrial machinery using Rockwell and Siemens PLC/HMI platforms.",
    ],
  },
  {
    marker: "2014 – 2017",
    title: "Control System Integration",
    details: [],
    bullets: [
      "Delivered pilot plant process control systems using Rockwell PlantPAx, Honeywell HC900, GE iFIX, and Emerson DeltaV.",
    ],
  },
  {
    marker: "2007 – 2013",
    title: "Electrical & Control Systems Engineering",
    details: [],
    bullets: [
      "Worked across nuclear electrical design, pharmaceutical control-system validation, and industrial automation technical support.",
    ],
  },
  {
    marker: "2003 – 2006",
    title: "Transition to Canada & Engineering Technology",
    details: [],
    bullets: [
      "Moved to Canada and studied Electrical Engineering Technology – Control at Mohawk College of Applied Arts & Technology.",
    ],
  },
  {
    marker: "1990 – 2002",
    title: "Embedded Systems Engineering",
    details: ["Dalian Electronics Research Institute, China"],
    bullets: [
      "Developed embedded systems using C and assembly language, microcontrollers, real-time operating systems, digital/analog interfaces, and PCB design.",
    ],
  },
];

const EDUCATION: TimelineEntry[] = [
  {
    marker: "2007",
    title: "Electrical Engineering Technology – Control (Honours Graduate)",
    details: ["Mohawk College of Applied Arts & Technology, Hamilton, Ontario"],
  },
  {
    marker: "2002",
    title: "Master of Engineering (M.Eng.)",
    details: [
      "Electronic Engineering",
      "Dalian University of Technology, China",
    ],
  },
  {
    marker: "1990",
    title: "Bachelor of Engineering (B.Eng.)",
    details: ["Electronic Engineering", "Tianjin University, China"],
  },
];

function TimelineSection({
  title,
  entries,
  sectionId,
}: {
  title: string;
  entries: TimelineEntry[];
  sectionId: string;
}) {
  const [activeEntry, setActiveEntry] = useState<number | null>(null);

  const activateEntry = (index: number, entry: TimelineEntry) => {
    if (entry.link) {
      window.open(entry.link.href, "_blank", "noopener,noreferrer");
      return;
    }
    setActiveEntry((current) => (current === index ? null : index));
  };

  const handleClick = (
    event: MouseEvent<HTMLElement>,
    index: number,
    entry: TimelineEntry,
  ) => {
    if ((event.target as HTMLElement).closest("a")) return;
    activateEntry(index, entry);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLElement>,
    index: number,
    entry: TimelineEntry,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activateEntry(index, entry);
    }
  };

  return (
    <section className="resume-section" aria-labelledby={sectionId}>
      <h1 className="resume-section-heading" id={sectionId}>{title}</h1>
      <div className="resume-timeline">
        {entries.map((entry, index) => (
          <article
            className={`timeline-row${activeEntry === index ? " is-active" : ""}`}
            key={`${entry.marker}-${entry.title}`}
            role={entry.link ? "link" : "button"}
            tabIndex={0}
            aria-pressed={entry.link ? undefined : activeEntry === index}
            aria-label={
              entry.link
                ? `${entry.title}, ${entry.marker}. Open ${entry.link.label} website`
                : undefined
            }
            onClick={(event) => handleClick(event, index, entry)}
            onKeyDown={(event) => handleKeyDown(event, index, entry)}
          >
            <div className="timeline-marker" aria-hidden="true">
              <span />
            </div>
            <p className="timeline-year">{entry.marker}</p>
            <div className="timeline-content">
              <h2>{entry.title}</h2>
              {entry.link && (
                <p>
                  <a
                    href={entry.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "var(--blue)",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                    aria-label={`${entry.link.label} website (opens in a new tab)`}
                  >
                    {entry.link.label}{" "}
                    <span
                      aria-hidden="true"
                      style={{ fontSize: "0.82em", marginLeft: "0.2rem" }}
                    >
                      ↗
                    </span>
                  </a>
                </p>
              )}
              {entry.details.map((detail) => (
                <p key={detail}>{detail}</p>
              ))}
              {entry.bullets && (
                <ul>
                  {entry.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        ))}
      </div>
      <style jsx>{`
        .resume-section-heading {
          margin-left: calc(clamp(var(--space-sm), 2vw, var(--space-md)) + 14px);
          color: var(--blue);
          font-family: Arial, Helvetica, sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          line-height: 1.4;
          text-transform: uppercase;
        }
        @media (max-width: 680px) {
          .resume-section-heading {
            margin-left: calc(0.35rem + 12px);
          }
        }
      `}</style>
    </section>
  );
}

export function ResumeTimeline() {
  return (
    <>
      <TimelineSection
        title="CAREER JOURNEY"
        entries={CAREER_JOURNEY}
        sectionId="career-journey"
      />
      <TimelineSection
        title="EDUCATION"
        entries={EDUCATION}
        sectionId="education"
      />
    </>
  );
}
