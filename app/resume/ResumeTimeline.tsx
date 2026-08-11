"use client";

import { KeyboardEvent, useState } from "react";

type TimelineEntry = {
  marker: string;
  title: string;
  details: string[];
  bullets?: string[];
};

const CAREER_JOURNEY: TimelineEntry[] = [
  {
    marker: "2026 – Present",
    title: "Process Automation Consultant",
    details: ["KW Controls"],
    bullets: [
      "Providing process automation and system integration solutions, with a focus on PLC/HMI/SCADA development, troubleshooting, and technical support.",
    ],
  },
  {
    marker: "2022 – 2026",
    title: "System Integration & Process Automation",
    details: [],
    bullets: [
      "Delivered PLC/SCADA modernization, material-handling automation, naval HVAC-R controls, and industrial water-treatment systems across Rockwell and Siemens platforms.",
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
      "Delivered pilot-plant process-control systems using Rockwell PlantPAx, Honeywell HC900, GE iFIX, and Emerson DeltaV.",
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
    details: ["Electronic Engineering", "Dalian University of Technology, China"],
  },
  {
    marker: "1990",
    title: "Bachelor of Engineering (B.Eng.)",
    details: ["Electronic Engineering", "Tianjin University, China"],
  },
];

function TimelineSection({ title, entries, sectionId }: { title: string; entries: TimelineEntry[]; sectionId: string }) {
  const [activeEntry, setActiveEntry] = useState<number | null>(null);
  const toggleEntry = (index: number) => setActiveEntry((current) => (current === index ? null : index));
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
          <article className={`timeline-row${activeEntry === index ? " is-active" : ""}`} key={`${entry.marker}-${entry.title}`} role="button" tabIndex={0} aria-pressed={activeEntry === index} onClick={() => toggleEntry(index)} onKeyDown={(event) => handleKeyDown(event, index)}>
            <div className="timeline-marker" aria-hidden="true"><span /></div>
            <p className="timeline-year">{entry.marker}</p>
            <div className="timeline-content">
              <h2>{entry.title}</h2>
              {entry.details.map((detail) => <p key={detail}>{detail}</p>)}
              {entry.bullets && <ul>{entry.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
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
      <TimelineSection title="CAREER JOURNEY" entries={CAREER_JOURNEY} sectionId="career-journey" />
      <TimelineSection title="EDUCATION" entries={EDUCATION} sectionId="education" />
    </>
  );
}
