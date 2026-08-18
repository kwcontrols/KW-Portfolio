import type { Metadata } from "next";
import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";

export const metadata: Metadata = {
  title: "Blogs | Kui Wu",
  description: "Learning through engineering, software, cloud technologies, and AI.",
};

const workflow = [
  ["01", "Engineering mindset", "Systems thinking"],
  ["02", "VS Code", "Build and iterate"],
  ["03", "Git + GitHub", "Version and deploy"],
  ["04", "React + Next.js", "Modern web application"],
  ["05", "Cloudflare", "Edge, security, access"],
  ["06", "APIs + Analytics", "Connect and measure"],
  ["07", "AI", "Learn and collaborate"],
  ["08", "Automation design", "Improve engineering efficiency"],
];

export default function BlogPage() {
  return (
    <div className="site-shell" id="page-start">
      <SiteHeader />
      <main>
        <section className="blog-page">
          <header className="blog-intro">
            <p className="section-index">All Posts</p>
          </header>

          <article className="blog-feature">
            <aside className="workflow-panel" aria-label="Technology learning workflow">
              <p className="workflow-kicker">Learning workflow</p>
              <div className="workflow-list">
                {workflow.map(([number, title, detail], index) => (
                  <div className="workflow-step" key={title}>
                    <div className="workflow-node"><span>{number}</span></div>
                    <div>
                      <strong>{title}</strong>
                      <small>{detail}</small>
                    </div>
                    {index < workflow.length - 1 ? <span className="workflow-line" aria-hidden="true" /> : null}
                  </div>
                ))}
              </div>
            </aside>

            <div className="blog-article-copy">
              <p className="blog-meta">Learning Journey · 2026</p>
              <h2>From Process Automation to a Living Web Platform</h2>

              <p>My background is process automation and system integration - making different technologies work together reliably. Building my personal website became an opportunity to apply that same engineering mindset to a completely different technology stack.</p>

              <p>What started as a simple portfolio gradually became a hands-on learning platform involving modern web development, Git and GitHub workflows, React/Next.js, TypeScript, Cloudflare, APIs, authentication, Google Analytics, and cloud services.</p>

              <p>AI became an important part of this journey - not as a replacement for engineering judgment, but as a powerful tool. The technologies may be different, but the engineering principles are remarkably familiar: understand the interfaces, trace the data, test assumptions, secure the boundaries, and solve problems systematically.</p>

              <p>This website now represents more than a portfolio. It is an ongoing experiment in learning AI, learning how to work effectively with AI, and exploring how to leverage it as a powerful engineering tool to improve the efficiency and quality of my process automation design work.</p>
            </div>
          </article>
        </section>
      </main>
      <SiteFooter />

      <style>{`
        .blog-page{max-width:1180px;margin:0 auto;padding:clamp(2.5rem,6vw,5rem) 0 clamp(4rem,8vw,7rem)}
        .blog-intro{max-width:720px;margin-bottom:clamp(2.5rem,5vw,4.5rem)}
        .blog-feature{display:grid;grid-template-columns:minmax(250px,.72fr) minmax(0,1.35fr);gap:clamp(2.5rem,7vw,6.5rem);align-items:start;padding-top:2rem;border-top:1px solid var(--line)}
        .workflow-panel{position:sticky;top:7rem;padding:1.5rem;background:#fff;border:1px solid var(--line)}
        .workflow-kicker,.blog-meta{margin:0 0 1.4rem;color:var(--blue);font-size:.72rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase}
        .workflow-list{display:grid;gap:0}
        .workflow-step{position:relative;display:grid;grid-template-columns:2.35rem 1fr;gap:.85rem;min-height:4.35rem}
        .workflow-node{position:relative;z-index:2;display:grid;place-items:center;width:2.1rem;height:2.1rem;border:1px solid var(--blue);border-radius:50%;background:#fff;color:var(--blue);font-size:.68rem;font-weight:700}
        .workflow-line{position:absolute;left:1.02rem;top:2.05rem;bottom:-.05rem;width:1px;background:linear-gradient(var(--blue),var(--line))}
        .workflow-step strong,.workflow-step small{display:block}
        .workflow-step strong{padding-top:.18rem;color:var(--ink);font-size:.88rem}
        .workflow-step small{margin-top:.18rem;color:var(--ink-soft);font-size:.72rem;line-height:1.35}
        .blog-article-copy{max-width:720px}
        .blog-article-copy h2{max-width:none;margin-bottom:2rem;font-size:1.875rem;line-height:1.25}
        .blog-article-copy>p:not(.blog-meta){max-width:66ch;margin:0;font-size:1.03rem;line-height:1.82}
        .blog-article-copy>p+p{margin-top:1.5rem!important}
        @media(max-width:780px){.blog-feature{grid-template-columns:1fr}.workflow-panel{position:static}.workflow-list{grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}.workflow-step{min-height:auto}.workflow-line{display:none}}
        @media(max-width:520px){.workflow-list{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
}
