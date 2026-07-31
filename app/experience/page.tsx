import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";

const projects = [
  {
    number: "01",
    title: "Workflow orchestration",
    description:
      "Designing dependable automated workflows that reduce manual handoffs, surface exceptions, and keep teams focused on higher-value work.",
    tags: ["Process mapping", "Automation", "Governance"],
  },
  {
    number: "02",
    title: "Connected business systems",
    description:
      "Bringing applications and data together through thoughtful integrations that make information more consistent, timely, and useful.",
    tags: ["System integration", "APIs", "Data flow"],
  },
  {
    number: "03",
    title: "AI-assisted operations",
    description:
      "Exploring practical ways to pair automation with AI for knowledge work, decision support, and more adaptive operational experiences.",
    tags: ["Applied AI", "Prototyping", "Continuous learning"],
  },
];

export default function ExperiencePage() {
  return (
    <div className="site-shell" id="page-start">
      <SiteHeader />
      <main>
        <section className="section" id="automation">
          <div className="section-heading">
            <p className="section-index">Automation experience</p>
            <div>
              <h2>From repetitive work to resilient, connected operations.</h2>
              <p>
                My experience spans the full automation lifecycle—from discovery
                and process mapping through integration, implementation, and
                continuous improvement.
              </p>
            </div>
          </div>
          <div className="experience-grid">
            <article><span>01</span><h3>Discover</h3><p>Map the current process, uncover friction, and identify the right opportunities to automate.</p></article>
            <article><span>02</span><h3>Connect</h3><p>Design integrations that move information cleanly across tools, teams, and systems.</p></article>
            <article><span>03</span><h3>Improve</h3><p>Build for reliability, monitor what matters, and refine the solution as needs evolve.</p></article>
          </div>
          <div className="timeline" aria-label="Automation experience progression">
            <div><strong>Understand</strong><p>Start with the people, business rules, and exceptions behind the workflow.</p></div>
            <div><strong>Architect</strong><p>Translate requirements into a maintainable automation and integration approach.</p></div>
            <div><strong>Deliver</strong><p>Implement thoughtfully, document clearly, and support adoption across the team.</p></div>
          </div>
        </section>

        <section className="section" id="projects">
          <div className="section-heading">
            <p className="section-index">Featured projects</p>
            <div>
              <h2>Representative work across automation, integration, and electrical design.</h2>
              <p>A view into the kinds of problems I solve and the principles I bring to each engagement.</p>
            </div>
          </div>
          <div className="project-list">
            {projects.map((project) => (
              <article className="project" key={project.title}>
                <div className="project-visual" aria-hidden="true"><span>{project.number}</span></div>
                <div className="project-copy">
                  <p className="eyebrow">Selected capability / {project.number}</p>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <ul aria-label={`${project.title} skills`}>
                    {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section ai-section" id="ai-journey">
          <div className="section-heading">
            <p className="section-index">AI journey</p>
            <div>
              <h2>Exploring AI with curiosity, discipline, and a builder’s mindset.</h2>
              <p>I’m learning how AI changes the way we design workflows, connect knowledge, and solve operational problems.</p>
            </div>
          </div>
          <div className="journey-path">
            <article><span>Learning</span><h3>Build the foundation</h3><p>Study the tools, concepts, risks, and patterns shaping practical AI systems.</p></article>
            <article><span>Experimenting</span><h3>Test real workflows</h3><p>Prototype focused use cases and evaluate where AI adds meaningful value.</p></article>
            <article><span>Sharing</span><h3>Make the journey useful</h3><p>Document lessons, exchange ideas, and help others learn from the process.</p></article>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
