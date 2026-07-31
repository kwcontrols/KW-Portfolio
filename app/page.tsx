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
              <img src="/kui-wu-headshot.png" alt="Portrait of Kui Wu" />
            </div>
            <div className="about-copy">
              <p>
                <strong>Kui Wu</strong> is a process automation and system
                integration specialist with over a decade of experience
                delivering industrial automation solutions across
                pharmaceutical, water treatment, manufacturing, and other
                industrial sectors.
              </p>
              <p>
                Programming is more than my profession—it&apos;s my passion. I
                find great satisfaction in solving complex problems, turning
                ideas into working systems, and seeing them perform exactly as I
                envisioned.
              </p>
              <p>
                I grew up in China, where I earned degrees in electronics.
                Before moving to Canada, I spent several years developing
                embedded systems in C and assembly language. That experience
                continues to shape my approach to industrial automation today.
              </p>
              <p>
              Outside of engineering, I have a wide range of interests. I enjoy
              reading history, hiking, and playing hockey. There&apos;s nothing
              quite like the feeling after a good game or practice: physically
              exhausted and mentally refreshed.
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
