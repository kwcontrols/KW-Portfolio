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
    src: "/projects/rockwell-4.svg",
    alt: "Placeholder for on-site automation commissioning",
  },
];

// Replace project titles, categories, descriptions, detail text, and local image paths here.
const PROJECTS: Project[] = [
  {
    number: "01",
    title: "Rockwell Automation",
    category: "PlantPAx / Pharma / Water / Conveyor",
    images: ROCKWELL_PROJECT_IMAGES,
    link: "https://www.rockwellautomation.com/en-us.html",
    overview:
      "Delivered Rockwell Automation control-system solutions for pharmaceutical, water-treatment, and conveyor applications. The work included system design, PlantPAx configuration, PLC and HMI development, testing, integration, and on-site commissioning, with an emphasis on reliability, maintainability, and clear operator interaction.",
  },
  {
    number: "02",
    title: "Water Treatment Automation Expansion",
    category: "Water Treatment / System Integration",
    image: "/projects/project-02.jpg",
    imageAlt: "Placeholder for a water treatment automation project",
    overview:
      "A representative expansion project connecting new treatment equipment with an existing plant-wide automation system.",
    challenge:
      "New process equipment needed to integrate cleanly with established controls, standards, and operating procedures.",
    approach:
      "Interfaces, control narratives, alarms, and commissioning activities were coordinated across multiple project teams.",
    result:
      "The new equipment was incorporated into daily operations with consistent controls and centralized visibility.",
  },
  {
    number: "03",
    title: "Manufacturing Line Integration",
    category: "Manufacturing / PLC, HMI, and Data Integration",
    image: "/projects/project-03.jpg",
    imageAlt: "Placeholder for a manufacturing line integration project",
    overview:
      "A representative production-line project combining machine controls, operator interfaces, and production data exchange.",
    challenge:
      "Independent equipment packages needed to operate as one coordinated line while maintaining clear fault isolation.",
    approach:
      "Common interface standards and sequenced handshakes were developed, tested, and documented with the equipment teams.",
    result:
      "The integrated line delivered more predictable operation and faster troubleshooting during production support.",
  },
  {
    number: "04",
    title: "Utility Monitoring and Reporting",
    category: "Industrial Utilities / SCADA and Reporting",
    image: "/projects/project-04.jpg",
    imageAlt: "Placeholder for an industrial utility monitoring project",
    overview:
      "A representative monitoring project designed to make utility performance and operating conditions easier to understand.",
    challenge:
      "Important utility information was distributed across systems and difficult for operators and engineering teams to review.",
    approach:
      "Key signals were standardized, integrated into SCADA, and organized into focused displays and practical reports.",
    result:
      "Teams gained a clearer operational view and a more consistent basis for analysis and continuous improvement.",
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
