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

const skills = [
  "Process automation",
  "System integration",
  "Workflow design",
  "API integration",
  "Requirements analysis",
  "Solution architecture",
  "Operational improvement",
  "Applied AI",
];

export default function Home() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#home" aria-label="KW Portfolio home">
          KW <span>/ Portfolio</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#automation">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#ai-journey">AI journey</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <p className="eyebrow">Process automation · System integration · Applied AI</p>
            <h1>Building smarter systems. Learning what comes next.</h1>
            <p className="hero-lede">
              I&apos;m Kui Wu, a Process Automation and System Integration Specialist
              with over a decade of experience delivering industrial automation
              solutions across pharmaceutical, biotech, water treatment and
              manufacturing. Today, I&apos;m exploring how AI can enhance engineering
              workflows.
            </p>
            <p className="eyebrow hero-tools">
              Rockwell Automation · PLC · HMI · SCADA · PlantPAx · FactoryTalk
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#projects">View Projects</a>
              <a className="button button-secondary" href="#contact">Contact Me</a>
            </div>
          </div>
          <aside className="hero-aside">
            <p className="eyebrow">My Mission</p>
            <p>
              Build reliable, scalable automation systems that solve real operational
              challenges—while continuously learning and applying better ways to
              engineer what comes next.
            </p>
            <div className="availability"><span aria-hidden="true" /> Always learning. Always improving.</div>
          </aside>
        </section>

        <section className="section" id="about">
          <div className="section-heading">
            <p className="section-index">01 / About me</p>
            <div>
              <h2>Practical systems thinking, grounded in how work really happens.</h2>
              <p>
                I work at the intersection of people, process, and technology. My
                approach begins with understanding the real workflow—its friction,
                decisions, dependencies, and exceptions—before shaping an automation
                or integration that can last.
              </p>
            </div>
          </div>
          <div className="two-column">
            <p>
              I value solutions that are clear enough to explain, dependable enough
              to trust, and flexible enough to evolve with the business.
            </p>
            <p>
              Today, I’m expanding that foundation with AI: learning openly,
              experimenting responsibly, and sharing what proves useful along the way.
            </p>
          </div>
        </section>

        <section className="section" id="automation">
          <div className="section-heading">
            <p className="section-index">02 / Automation experience</p>
            <div>
              <h2>From repetitive work to resilient, connected operations.</h2>
              <p>
                My experience spans the full automation lifecycle—from discovery and
                process mapping through integration, implementation, and continuous
                improvement.
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
            <p className="section-index">03 / Featured projects</p>
            <div>
              <h2>Representative work across automation, integration, and AI.</h2>
              <p>
                A view into the kinds of problems I solve and the principles I bring
                to each engagement. Detailed case studies can be added as project
                material becomes available.
              </p>
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
            <p className="section-index">04 / AI journey</p>
            <div>
              <h2>Exploring AI with curiosity, discipline, and a builder’s mindset.</h2>
              <p>
                I’m learning how AI changes the way we design workflows, connect
                knowledge, and solve operational problems. The goal is not novelty—it
                is finding responsible, genuinely useful applications.
              </p>
            </div>
          </div>
          <div className="journey-path">
            <article><span>Learning</span><h3>Build the foundation</h3><p>Study the tools, concepts, risks, and patterns shaping practical AI systems.</p></article>
            <article><span>Experimenting</span><h3>Test real workflows</h3><p>Prototype focused use cases and evaluate where AI adds meaningful value.</p></article>
            <article><span>Sharing</span><h3>Make the journey useful</h3><p>Document lessons, exchange ideas, and help others learn from the process.</p></article>
          </div>
        </section>

        <section className="section" id="beyond-work">
          <div className="section-heading">
            <p className="section-index">05 / Beyond work</p>
            <div>
              <h2>Curiosity doesn’t stop when the workday does.</h2>
              <p>
                Beyond delivery, I make space for learning, reflection, and the
                interests that keep my perspective fresh. This is where future notes,
                experiments, and personal stories can live as the portfolio grows.
              </p>
            </div>
          </div>
          <div className="beyond-grid">
            <article><span>01</span><h3>Continuous learning</h3><p>Following new ideas in automation, integration, and responsible AI.</p></article>
            <article><span>02</span><h3>Building &amp; experimenting</h3><p>Turning curiosity into small prototypes, useful systems, and better questions.</p></article>
            <article><span>03</span><h3>Sharing the journey</h3><p>Making complex topics more approachable through honest, practical reflection.</p></article>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <p className="section-index">06 / Contact</p>
          <div>
            <h2>Let’s make a complex process feel simpler.</h2>
            <p>
              If you’re exploring automation, system integration, or practical AI,
              I’d be glad to connect and compare notes.
            </p>
          </div>
          <a className="button button-light" href="mailto:?subject=Let%27s%20connect%20about%20automation%20and%20AI">
            Start a conversation <span aria-hidden="true">↗</span>
          </a>
        </section>
      </main>

      <footer>
        <span>© 2026 KW Portfolio</span>
        <a href="#home">Back to top ↑</a>
      </footer>
    </div>
  );
}
