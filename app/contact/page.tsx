import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";

export default function ContactPage() {
  return (
    <div className="site-shell" id="page-start">
      <SiteHeader />
      <main className="standalone-page">
        <section className="contact-section" id="contact">
          <p className="section-index">Contact</p>
          <div>
            <h2>Let’s make a complex process feel simpler.</h2>
            <p>
              If you’re exploring automation, system integration, or practical
              AI, I’d be glad to connect and compare notes.
            </p>
          </div>
          <a className="button button-light" href="mailto:?subject=Let%27s%20connect%20about%20automation%20and%20AI">
            Start a conversation <span aria-hidden="true">↗</span>
          </a>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
