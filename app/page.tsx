import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { PhotoSlideshow } from "./PhotoSlideshow";

export default function Home() {
  return (
    <div className="site-shell" id="page-start">
      <SiteHeader />

      <main>
        <section className="section" id="about">
          <div className="about-feature">
            <div className="about-portrait">
              <img src="/kui-wu-headshot-3.png" alt="Portrait of Kui Wu" />
            </div>
            <div className="about-copy">
              <p>
                <strong>Kui Wu</strong> is a process automation and system
                integration specialist with over two decades of experience
                designing, integrating, troubleshooting, and commissioning
                industrial automation systems—from targeted system upgrades to
                large-scale distributed control systems. His experience spans
                multiple industries, technologies, and project environments,
                with hands-on commissioning assignments across North America,
                Asia, and Europe.
              </p>
              <p>
                Building automation solutions is more than my
                profession—it&apos;s my passion. I find great satisfaction in
                solving complex problems, turning ideas into working systems,
                and seeing them perform exactly as I envisioned.
              </p>
              <p>
                I grew up in China, where I earned degrees in electronics.
                Before moving to Canada, I spent 10 years developing a wide
                variety of embedded systems. That hands-on, board-level
                experience laid the foundation for my engineering approach to
                designing flexible, reliable, and scalable industrial automation
                systems.
              </p>
              <p>
                Outside of work, I enjoy staying active through hiking, playing
                hockey and badminton, and exploring the outdoors. There&apos;s
                nothing quite like the feeling after a good game or practice:
                physically exhausted and mentally refreshed.
              </p>
            </div>
            <PhotoSlideshow />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
