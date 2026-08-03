"use client";

import { KeyboardEvent, useState } from "react";

type TimelineEntry = {
  marker: string;
  title: string;
  details: string[];
  bullets?: string[];
};

// Resume timeline content is stored here for straightforward future updates.
const CAREER_JOURNEY: TimelineEntry[] = [
  {
    marker: "Present",
    title: "System Integrator",
    details: ["2011 – Present"],
    bullets: [
      "Lead industrial automation projects from design through commissioning.",
      "Develop PLC, HMI, and SCADA applications.",
      "Deliver reliable automation solutions across multiple industrial sectors.",
    ],
  },
  {
    marker: "2011",
    title: "Electrical Designer",
    details: ["2007 – 2011"],
    bullets: [
      "Designed electrical control systems, panel layouts, and instrumentation.",
      "Supported system startup and commissioning.",
    ],
  },
  {
    marker: "2009",
    title: "Certified Engineering Technologist",
    details: ["CET, OACETT", "2009 – 2025"],
  },
  {
    marker: "2002",
    title: "Embedded Systems Engineer",
    details: ["Dalian Electronic Research Institute", "1990 – 2002"],
    bullets: [
      "Developed embedded systems using RTOS, C, and assembly language.",
      "Designed and tested board-level hardware and firmware.",
      "Participated in product development from concept through production.",
    ],
  },
];

const EDUCATION: TimelineEntry[] = [
  {
    marker: "2004 – 2006",
    title: "Electrical Engineering Technology – Control",
    details: ["Mohawk College of Applied Arts & Technology", "Honours Graduate"],
  },
  {
    marker: "2000 – 2002",
    title: "Master of Engineering (M.Eng.)",
    details: ["Electronic Engineering", "Dalian University of Technology"],
  },
  {
    marker: "1986 – 1990",
    title: "Bachelor of Engineering (B.Eng.)",
    details: ["Electronic Engineering", "Tianjin University"],
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

  const toggleEntry = (index: number) => {
    setActiveEntry((current) => (current === index ? null : index));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>, index: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleEntry(index);
    }
  };

  return (
    <section className="resume-section" aria-labelledby={sectionId}>
      <h1 id={sectionId}>{title}</h1>
      <div className="resume-timeline">
        {entries.map((entry, index) => (
          <article
            className={`timeline-row${activeEntry === index ? " is-active" : ""}`}
            key={`${entry.marker}-${entry.title}`}
            role="button"
            tabIndex={0}
            aria-pressed={activeEntry === index}
            onClick={() => toggleEntry(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            <div className="timeline-marker" aria-hidden="true">
              <span />
            </div>
            <p className="timeline-year">{entry.marker}</p>
            <div className="timeline-content">
              <h2>{entry.title}</h2>
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
