import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";
import { ImageSlideshow, type SlideshowImage } from "../ImageSlideshow";

type Project = {
  number: string;
  title: string;
  category: string;
  image?: string;
  images?: SlideshowImage[];
  imageAlt?: string;
  link?: string;
  overview: string;
  challenge?: string;
  approach?: string;
  result?: string;
};

// Replace these four local paths and alt descriptions with final Rockwell project photos.
const ROCKWELL_PROJECT_IMAGES: SlideshowImage[] = [
  {
    src: "/projects/rockwell-1.svg",
    alt: "Placeholder for a Rockwell Automation control-system design",
  },
  {
    src: "/projects/rockwell-2.svg",
    alt: "Placeholder for PlantPAx configuration and development",
  },
  {
    src: "/projects/rockwell-3.svg",
    alt: "Placeholder for PLC and HMI integration testing",
  },
  {
    src: "/projects/rockwell/rockwell-4.jpg",
    alt: "Placeholder for on-site automation commissioning",
  },
];

// Add future Siemens photos here; controls and autoplay enable automatically at two images.
const SIEMENS_PROJECT_IMAGES: SlideshowImage[] = [
  {
    src: "/projects/project-placeholder-02.svg",
    alt: "Siemens HVAC-R automation project",
  },
];

// Add future GE iFIX / Honeywell HC900 photos here; no slideshow code changes are needed.
const GEFIX_HC900_PROJECT_IMAGES: SlideshowImage[] = [
  {
    src: "/projects/iFix-1.JPG",
    alt: "GE iFIX and Honeywell HC900 project image 1",
  },
  {
    src: "/projects/iFix-2.jpg",
    alt: "GE iFIX and Honeywell HC900 project image 2",
  },
];

// Add or replace Project 04 electrical images here; no slideshow code changes are needed.
const ELECTRICAL_ENGINEERING_PROJECT_IMAGES: SlideshowImage[] = [
  {
    src: "/projects/Electrical-1.JPG",
    alt: "Electrical engineering project image 1 showing industrial design work",
  },
  {
    src: "/projects/Electrical-2.png",
    alt: "Electrical engineering project image 2 showing a CADD design",
  },
  {
    src: "/projects/electrical-3.jpg",
    alt: "Electrical engineering project image 3 showing project documentation",
  },
  {
    src: "/projects/electrical-4.jpg",
    alt: "Electrical engineering project image 4 showing coordinated electrical design",
  },
];

// Replace project titles, categories, descriptions, detail text, and local image paths here.
const PROJECTS: Project[] = [
  {
    number: "01",
    title: "Rockwell Automation",
    category: "PlantPAx / Pharma / Water / Conveyor / Bander",
    images: ROCKWELL_PROJECT_IMAGES,
    link: "https://www.rockwellautomation.com/en-us.html",
    overview:
      "Delivered Rockwell Automation control-system solutions for pharmaceutical, water-treatment, and conveyor applications. The work included system design, PlantPAx configuration, PLC and HMI development, testing, integration, and on-site commissioning, with an emphasis on reliability, maintainability, and clear operator interaction.",
  },
  {
    number: "02",
    title: "Siemens",
    category: "HVAC-R / System Integration",
    images: SIEMENS_PROJECT_IMAGES,
    link: "https://www.siemens.com/en-us/products/simatic/",
    overview:
      "Delivered Siemens automation solutions for HVAC-R and building-system applications. The work included control-strategy development, PLC and HMI programming, network and field-device integration, functional testing, and on-site commissioning, with a focus on energy efficiency, reliability, and ease of operation.",
  },
  {
    number: "03",
    title: "GE iFIX + Honeywell HC900",
    category: "SCADA / Process Control",
    images: GEFIX_HC900_PROJECT_IMAGES,
    link: "https://www.gevernova.com/software/products/hmi-scada/ifix",
    overview:
      "Delivered GE iFIX SCADA and Honeywell HC900 process-control solutions for industrial applications. The work included control-strategy development, HMI and SCADA configuration, communication integration, testing, troubleshooting, and on-site commissioning, with a focus on reliable operation, clear process visibility, and maintainable system design.",
  },
  {
    number: "04",
    title: "Electrical Engineering",
    category: "Low Voltage Design / 2D & 3D CADD",
    images: ELECTRICAL_ENGINEERING_PROJECT_IMAGES,
    overview:
      "Provided low-voltage electrical design and 2D/3D CADD support for industrial projects. The work included control-panel layouts, electrical schematics, equipment and cable coordination, drawing updates, and multidisciplinary design reviews, with a focus on accuracy, constructability, and clear project documentation.",
  },
];

export default function ProjectsPage() {
  return (
    <div className="site-shell" id="page-start">
      <SiteHeader />
      <main className="projects-page" id="projects">
        <section className="projects-intro" aria-label="Projects introduction">
          <p>
            Every automation project presents a unique set of challenges. Over
            the past 20+ years, I have delivered projects ranging from small
            system upgrades to large-scale distributed control systems across
            multiple industries. Along the way, I have worked closely with
            project teams and customers, and traveled throughout North America,
            Asia, and Europe to commission systems on site.
          </p>
        </section>

        <section
          className="projects-list"
          aria-label="Selected project placeholders"
        >
          {PROJECTS.map((project) => (
            <article className="project-entry" key={project.number}>
              <div className="project-media">
                {project.images ? (
                  <ImageSlideshow
                    images={project.images}
                    label={`${project.title} project photos`}
                  />
                ) : (
                  <img src={project.image} alt={project.imageAlt} />
                )}
              </div>
              <div className="project-details">
                <p className="project-number">{project.number}</p>
                <h2>
                  {project.link ? (
                    <a
                      className="project-title-link"
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {project.title}
                      <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    project.title
                  )}
                </h2>
                <p className="project-category">{project.category}</p>
                <p className="project-overview">{project.overview}</p>
                {project.challenge && project.approach && project.result && (
                  <dl>
                    <div>
                      <dt>Challenge</dt>
                      <dd>{project.challenge}</dd>
                    </div>
                    <div>
                      <dt>Approach</dt>
                      <dd>{project.approach}</dd>
                    </div>
                    <div>
                      <dt>Result</dt>
                      <dd>{project.result}</dd>
                    </div>
                  </dl>
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
