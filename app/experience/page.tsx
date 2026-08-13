import type { ReactNode } from "react";
import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";
import { ImageSlideshow, type SlideshowImage } from "../ImageSlideshow";

type Project = {
  number: string;
  title: string;
  category: string;
  images?: SlideshowImage[];
  overview: ReactNode;
};

const ROCKWELL_PROJECT_IMAGES: SlideshowImage[] = [
  { src: "/projects/rockwell/rockwell-4.jpg", alt: "On-site automation commissioning" },
];

const SIEMENS_PROJECT_IMAGES: SlideshowImage[] = [
  { src: "/projects/siemens-2.JPG", alt: "On-site Siemens automation commissioning", displayMode: "contain" },
];

const PROCESS_CONTROL_IMAGES: SlideshowImage[] = [
  { src: "/projects/PlantPax-1.jpg", alt: "On-site pilot-plant process-control commissioning" },
];

const ELECTRICAL_ENGINEERING_PROJECT_IMAGES: SlideshowImage[] = [
  { src: "/projects/Electrical-1.JPG", alt: "Industrial electrical design work" },
  { src: "/projects/Electrical-2.png", alt: "Electrical CADD design", displayMode: "contain" },
  { src: "/projects/electrical-3.jpg", alt: "Electrical project documentation", displayMode: "contain" },
  { src: "/projects/electrical-4.jpg", alt: "Coordinated electrical design", displayMode: "contain" },
];

const PROJECTS: Project[] = [
  {
    number: "01",
    title: "Process Automation & Rockwell Automation Platforms",
    category: "PlantPAx / Pharma / Water / Material Handling / Machinery",
    images: ROCKWELL_PROJECT_IMAGES,
    overview: (
      <div className="project-overview">
        <ul>
          <li><strong>PlantPAx</strong> — process and pilot-plant automation, pharmaceutical systems, and system modernization</li>
          <li><strong>FactoryTalk View SE</strong> — Network Station and Network Distributed architectures</li>
          <li><strong>FactoryTalk View ME</strong> — PanelView Plus and PanelView 5000/5510 applications</li>
          <li><strong>PLC/PAC Platforms</strong> — PLC-5, SLC 500, MicroLogix, CompactLogix, and ControlLogix; RSLogix 5/500/5000 and Studio 5000</li>
          <li><strong>Drives & Motion</strong> — PowerFlex variable-frequency drives and encoders</li>
          <li><strong>Industrial Networks</strong> — Stratix managed switches, EtherNet/IP, Modbus TCP/RTU, and TCP/IP socket communications</li>
          <li><strong>Data & Reporting</strong> — FactoryTalk Historian, SQL databases, and XLReporter</li>
          <li><strong>Virtualization & Thin Clients</strong> — virtualized automation infrastructure and ThinManager</li>
        </ul>
      </div>
    ),
  },
  {
    number: "02",
    title: "Process Automation & Siemens Platforms",
    category: "Naval HVAC-R / Machinery",
    images: SIEMENS_PROJECT_IMAGES,
    overview: (
      <div className="project-overview">
        <ul>
          <li><strong>TIA Portal</strong> — engineering, programming, commissioning, and diagnostics</li>
          <li><strong>PLC Platforms</strong> — SIMATIC S7-1200 and S7-1500</li>
          <li><strong>HMI Platforms</strong> — SIMATIC TP700 and TP1200 Comfort Panels</li>
          <li><strong>Drives & Motion</strong> — SINAMICS G120 drives with CU250S-2 PN Control Units</li>
          <li><strong>Industrial Networks</strong> — PROFINET, PROFIBUS, Modbus TCP/RTU</li>
        </ul>
      </div>
    ),
  },
  {
    number: "03",
    title: "Pilot-Plant Process Control",
    category: "PlantPAx / Honeywell HC900 / GE iFIX/IGS / Emerson DeltaV",
    images: PROCESS_CONTROL_IMAGES,
    overview:
      "Delivered pilot-plant process-control systems across multiple control platforms, including Rockwell PlantPAx, Honeywell HC900, GE iFIX/IGS, and Emerson DeltaV. Responsibilities included control-strategy development based on Cause and Effect Matrix, PLC/DCS and HMI/SCADA configuration, communications integration, testing, troubleshooting, startup, and commissioning.",
  },
  {
    number: "04",
    title: "Electrical & Control System Design",
    category: "E&I Design / AutoCAD Electrical / EPLAN / 2D & 3D CADD",
    images: ELECTRICAL_ENGINEERING_PROJECT_IMAGES,
    overview:
      "Provided electrical and instrumentation design for industrial automation projects, including control schematics, panel and equipment layouts, cable and instrumentation coordination, design documentation, and multidisciplinary reviews. Earlier work also included CANDU nuclear electrical-system design and 2D/3D engineering models.",
  },
];

export default function ProjectsPage() {
  return (
    <div className="site-shell" id="page-start">
      <SiteHeader />
      <main className="projects-page" id="projects">
        <section
          className="projects-intro"
          aria-label="Projects introduction"
          style={{ maxWidth: "840px" }}
        >
          <p style={{ maxWidth: "none" }}>
            My project experience spans process and industrial automation, system
            integration, electrical and instrumentation design, PLC/HMI/SCADA and
            industrial network development, system migration, troubleshooting,
            and commissioning. Beyond hands-on engineering, I have supported
            project planning, scheduling, estimating, and procurement; contributed
            technical input to proposals, scopes of work, and functional
            specifications; and participated in design reviews and engineering
            changes with consideration for project requirements, company standards,
            industry practices, and applicable regulations.
          </p>
          <p style={{ maxWidth: "none", marginTop: "20px" }}>
            I have also had opportunities to contribute beyond individual
            projects—working closely with engineering teams, sharing knowledge and
            lessons learned, and helping develop reusable programming standards,
            templates, libraries, implementation guidelines, and engineering tools.
            These experiences have taught me that successful automation projects
            depend as much on communication, collaboration, planning, and sound
            engineering practices as they do on technical knowledge.
          </p>
          <p style={{ maxWidth: "none", marginTop: "20px" }}>
            Every automation project brings its own challenges at different stages
            of execution. Documentation may be incomplete or no longer match the
            installed system. Programs may have evolved through years of
            modification and become difficult to understand or maintain. Project
            teams may also face changing requirements, tight schedules, budget
            constraints, and unexpected technical issues.
          </p>
          <p style={{ maxWidth: "none", marginTop: "20px" }}>
            Over the years, I have encountered many of these situations. Some were
            difficult at the time, but working through them with project teams and
            clients has been an important part of my professional development. Each
            challenge has added to my experience and reinforced a practical
            approach: understand the problem, ask the right questions, work
            collaboratively, and find a solution that can be implemented and
            maintained.
          </p>
          <p style={{ maxWidth: "none", marginTop: "20px" }}>
            The selected work below highlights some of the technologies, systems,
            and engineering challenges I have encountered along the way.
          </p>
        </section>

        <section className="projects-list" aria-label="Selected automation projects">
          {PROJECTS.map((project) => (
            <article className="project-entry" key={project.number}>
              <div className="project-media">
                {project.images && (
                  <ImageSlideshow images={project.images} label={`${project.title} project photos`} />
                )}
              </div>
              <div className="project-details">
                <p className="project-number">{project.number}</p>
                <h2>{project.title}</h2>
                <p className="project-category">{project.category}</p>
                {typeof project.overview === "string" ? (
                  <p className="project-overview">{project.overview}</p>
                ) : (
                  project.overview
                )}
              </div>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
