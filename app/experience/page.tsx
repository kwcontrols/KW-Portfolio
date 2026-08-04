import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";

// Replace project titles, categories, descriptions, detail text, and local image paths here.
const PROJECTS = [
  {
    number: "01",
    title: "Process Control System Modernization",
    category: "Pharmaceutical / Control System Upgrade",
    image: "/projects/project-placeholder-01.svg",
    imageAlt: "Placeholder for a pharmaceutical process control project",
    overview:
      "A representative modernization project focused on improving reliability, operator visibility, and long-term system supportability.",
    challenge:
      "An aging control platform required careful replacement without disrupting critical production activities.",
    approach:
      "The work was phased around operations, with clear design reviews, structured testing, and coordinated commissioning.",
    result:
      "The upgraded system provided a maintainable foundation with clearer diagnostics and more consistent operation.",
  },
  {
    number: "02",
    title: "Water Treatment Automation Expansion",
    category: "Water Treatment / System Integration",
    image: "/projects/project-placeholder-02.svg",
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
    image: "/projects/project-placeholder-03.svg",
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
    image: "/projects/project-placeholder-04.svg",
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
            the past 20+ years, I have worked on projects ranging from small
            system upgrades to large-scale systems, collaborating closely with
            PMs, engineering, operations, and customers across multiple
            industries.
          </p>
        </section>

        <section className="projects-list" aria-label="Selected project placeholders">
          {PROJECTS.map((project) => (
            <article className="project-entry" key={project.number}>
              <div className="project-media">
                <img src={project.image} alt={project.imageAlt} />
              </div>
              <div className="project-details">
                <p className="project-number">{project.number}</p>
                <h2>{project.title}</h2>
                <p className="project-category">{project.category}</p>
                <p className="project-overview">{project.overview}</p>
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
              </div>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
