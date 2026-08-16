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
                designing and integrating industrial automation systems, ranging
                from small system upgrades to large-scale distributed control
                systems across multiple industries. His work has also taken him
                throughout North America, Asia, and Europe for on-site
                commissioning.
              </p>
              <p>
                Building automation solutions is more than my profession -
                it&apos;s my passion. I enjoy solving complex problems, turning
                ideas into working systems, and seeing them perform as intended.
              </p>
              <p>
                I grew up in China, where I earned degrees in electronics.
                Before moving to Canada, I spent 10 years developing a wide
                variety of embedded systems. That hands-on, board-level
                experience continues to shape my practical approach to
                industrial automation today.
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
