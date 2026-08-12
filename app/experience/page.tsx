import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";
import { ImageSlideshow, type SlideshowImage } from "../ImageSlideshow";

type Project = {
  number: string;
  title: string;
  category: string;
  images?: SlideshowImage[];
  overview: string;
};

const ROCKWELL_PROJECT_IMAGES: SlideshowImage[] = [
  { src: "/projects/rockwell-1.jpg", alt: "Rockwell Automation control-system design" },
  { src: "/projects/rockwell-2.jpg", alt: "PlantPAx configuration and development" },
  { src: "/projects/rockwell-3.jpg", alt: "PLC and HMI integration testing", displayMode: "contain" },
  { src: "/projects/rockwell/rockwell-4.jpg", alt: "On-site automation commissioning" },
  { src: "/projects/rockwell-5.jpg", alt: "Industrial machinery automation", displayMode: "contain" },
];

const SIEMENS_PROJECT_IMAGES: SlideshowImage[] = [
  { src: "/projects/siemens-1.jpg", alt: "Siemens HVAC-R automation project", displayMode: "contain" },
];

const PROCESS_CONTROL_IMAGES: SlideshowImage[] = [
  { src: "/projects/iFix-1.JPG", alt: "Pilot-plant SCADA and process-control system" },
  { src: "/projects/iFix-2.jpg", alt: "Process-control HMI and system integration", displayMode: "contain" },
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
    title: "Process Automation & Rockwell Systems",
    category: "PlantPAx / Pharma / Water / Material Handling / Machinery",
    images: ROCKWELL_PROJECT_IMAGES,
    overview:
      "Delivered Rockwell-based automation across pharmaceutical clean utilities, industrial water treatment, conveyor and material-handling systems, tank-farm operations, and automated machinery. Work has included control philosophy and sequence development, ControlLogix PLC programming, FactoryTalk HMI/SCADA, PlantPAx, recipe and batch-oriented control, system migration, testing, troubleshooting, and commissioning.",
  },
  {
    number: "02",
    title: "Naval HVAC-R Control Systems",
    category: "Siemens TIA Portal / S7-1200 & S7-1500 / SINAMICS",
    images: SIEMENS_PROJECT_IMAGES,
    overview:
      "Designed and developed naval HVAC-R automation using Siemens TIA Portal, S7-1200/S7-1500 PLCs, and SINAMICS G120 drives. The work combined control-system design, PLC development, drive integration, functional testing, and troubleshooting for reliable marine HVAC and refrigeration operation.",
  },
  {
    number: "03",
    title: "Pilot-Plant Process Control",
    category: "PlantPAx / Honeywell HC900 / GE iFIX / Emerson DeltaV",
    images: PROCESS_CONTROL_IMAGES,
    overview:
      "Delivered pilot-plant process-control systems across multiple control platforms, including Rockwell PlantPAx, Honeywell HC900, GE iFIX, and Emerson DeltaV. Responsibilities included control-strategy development, PLC/DCS and HMI/SCADA configuration, communications integration, testing, troubleshooting, startup, and commissioning.",
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
        <section className="projects-intro" aria-label="Projects introduction">
          <p>
            Every automation project presents a unique set of challenges. In
            real-world systems, engineering and technical documentation may be
            incomplete or out of sync with the actual control programs. Over
            time, programs may also be modified by multiple people without
            consistent revision control, creating discrepancies,
            inconsistencies, and systems that become increasingly difficult to
            understand, troubleshoot, and maintain.
          </p>
          <p>
            Over the past 20+ years, I have developed not only technical skills
            and experience, but also a practical engineering approach to solving
            these challenges. By listening, questioning, analyzing, and
            assessing the system as a whole, I work collaboratively with project
            teams and clients to clearly define functional requirements,
            establish sound engineering documentation, and develop practical,
            maintainable solutions.
          </p>
          <p>
            The selected work below highlights the types of systems and
            engineering challenges I have worked on.
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
                <p className="project-overview">{project.overview}</p>
              </div>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
