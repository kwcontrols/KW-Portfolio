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
    marker: "Present",
    title: "Process Automation Consultant",
    details: ["Self-Employed", "2026 – Present"],
    bullets: [
      "Provide process automation and system integration services, including PLC/HMI/SCADA solutions, control-system development, troubleshooting, and technical support.",
    ],
  },
  {
    marker: "2025",
    title: "System Integration & Industrial Automation",
    details: ["2022 – 2026"],
    bullets: [
      "Upgraded PLC and SCADA applications for BC Hydro tank-farm operations and developed recipe-based lubricant slurry and automated pigging sequences.",
      "Delivered port-terminal material-handling automation using ControlLogix and FactoryTalk View SE.",
      "Designed naval HVAC-R controls with Siemens TIA Portal, S7-1200/S7-1500 PLCs, and SINAMICS drives.",
      "Delivered industrial water-treatment automation including E&I design, control philosophy, complex sequence programming, and testing.",
    ],
  },
  {
    marker: "2018",
    title: "Process & Machinery Automation",
    details: ["2018 – 2022"],
    bullets: [
      "Developed pharmaceutical clean-utility PLC/SCADA applications using Rockwell Automation platforms.",
      "Delivered conveyor modernization and PlantPAx migration work from site survey and electrical design through commissioning.",
      "Designed industrial strapping-machine automation using Rockwell and Siemens PLC/HMI platforms, motion, drives, pneumatics, hydraulics, and machine safety.",
    ],
  },
  {
    marker: "2014",
    title: "Control System Integration",
    details: ["2014 – 2017"],
    bullets: [
      "Delivered pilot-plant process-control systems using Rockwell PlantPAx, Honeywell HC900, GE iFIX, and Emerson DeltaV.",
    ],
  },
  {
    marker: "2007",
    title: "Electrical & Control Systems Engineering",
    details: ["2007 – 2013"],
    bullets: [
      "Supported CANDU nuclear electrical-system design, pharmaceutical control-system documentation and validation, and industrial automation technical support.",
    ],
  },
  {
    marker: "1990",
    title: "Embedded Systems Engineering",
    details: ["Dalian Electronics Research Institute", "1990 – 2002"],
    bullets: [
      "Developed embedded systems using C and assembly language, microcontrollers, real-time kernels/operating systems, PLDs, serial communications, ADCs/DACs, DSP, and PCB design.",
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
