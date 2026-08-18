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
  {
    src: "/projects/PlantPax-1.jpg",
    alt: "PlantPAx pilot-plant process-control commissioning",
  },
  {
    src: "/projects/Pharma.PNG",
    alt: "Pharmaceutical process automation commissioning",
  },
  {
    src: "/projects/Conveyor Automation Upgrade.png",
    alt: "Conveyor automation upgrade commissioning",
  },
];

const SIEMENS_PROJECT_IMAGES: SlideshowImage[] = [
  {
    src: "/projects/siemens-3.png",
    alt: "Siemens automation platform and HMI",
  },
];

const ELECTRICAL_ENGINEERING_PROJECT_IMAGES: SlideshowImage[] = [
  {
    src: "/projects/Electrical-2.png",
    alt: "Electrical and instrumentation system design",
    displayMode: "contain",
  },
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
          <li>
            <strong>PlantPAx</strong> - process and pilot-plant automation,
            pharmaceutical systems, and system modernization
          </li>
          <li>
            <strong>FactoryTalk View SE</strong> - Network Station and Network
            Distributed architectures
          </li>
          <li>
            <strong>FactoryTalk View ME</strong> - PanelView Plus and PanelView
            5000/5510 applications
          </li>
          <li>
            <strong>PLC/PAC Platforms</strong> - PLC-5, SLC 500, MicroLogix,
            CompactLogix, and ControlLogix; RSLogix 5/500/5000 and Studio 5000
          </li>
          <li>
            <strong>Drives & Motion</strong> - PowerFlex variable frequency
            drives and encoders
          </li>
          <li>
            <strong>Industrial Networks</strong> - Stratix managed switches,
            EtherNet/IP, Modbus TCP/RTU
          </li>
          <li>
            <strong>Data & Reporting</strong> - FactoryTalk Historian, SQL
            databases, and XLReporter
          </li>
          <li>
            <strong>Virtualization & Thin Clients</strong> - virtualized
            automation infrastructure and ThinManager
          </li>
        </ul>
      </div>
    ),
  },
  {
    number: "02",
    title: "Naval HVAC Control Systems",
    category: "Siemens Platforms",
    images: SIEMENS_PROJECT_IMAGES,
    overview: (
      <div className="project-overview">
        <ul>
          <li>
            <strong>TIA Portal</strong> - engineering, programming,
            commissioning, and diagnostics
          </li>
          <li>
            <strong>PLC Platforms</strong> - SIMATIC S7-1200 and S7-1500
          </li>
          <li>
            <strong>HMI Platforms</strong> - SIMATIC TP700 and TP1200 Comfort
            Panels
          </li>
          <li>
            <strong>Drives</strong> - SINAMICS G120 drives
          </li>
          <li>
            <strong>Industrial Networks</strong> - PROFINET, PROFIBUS, Modbus
            TCP/RTU
          </li>
        </ul>
      </div>
    ),
  },
  {
    number: "03",
    title: "Electrical & Control System Design",
    category: "E&I Design / AutoCAD Electrical / EPLAN / 2D & 3D CADD",
    images: ELECTRICAL_ENGINEERING_PROJECT_IMAGES,
    overview:
      "Provided electrical and instrumentation design for industrial projects, including single line diagrams, electrical overhead and underground drawings, and 3D models of E&I equipment and cable tray systems. Prepared technical specifications, bill of materials, MCC, distribution and control panel layouts, hazardous area classification drawings and details, electrical equipment lists, and instrument lists.",
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
            My project experience spans process and industrial automation,
            system integration, electrical and instrumentation design,
            PLC/HMI/SCADA development, industrial networks, system migration,
            troubleshooting, and commissioning. Along the way, I have also
            contributed to project planning, technical documentation, design
            reviews, and the development of reusable engineering standards and
            tools.
          </p>
          <p style={{ maxWidth: "none", marginTop: "20px" }}>
            Each project has brought different technical and practical
            challenges, and each has added to my experience. The selected work
            below highlights some of the systems, technologies, and engineering
            work I have been involved with.
          </p>
        </section>

        <section
          className="projects-list"
          aria-label="Selected automation projects"
        >
          {PROJECTS.map((project) => (
            <article className="project-entry" key={project.number}>
              <div className="project-media">
                {project.images && (
                  <ImageSlideshow
                    images={project.images}
                    label={`${project.title} project photos`}
                  />
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
      <style>{`
        @media (max-width: 680px) {
          .project-entry .project-details h2 {
            font-size: 1.25rem;
            line-height: 1.25;
          }
        }
      `}</style>
    </div>
  );
}
