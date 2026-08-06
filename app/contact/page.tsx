import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";

const CONTACT_EMAIL = "teck3618@gmail.com";
const VANCOUVER_MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=Vancouver,+British+Columbia,+Canada";

export default function ContactPage() {
  return (
    <div className="site-shell" id="page-start">
      <SiteHeader />
      <main className="contact-page" id="contact">
        <section className="contact-column" aria-labelledby="contact-heading">
          <h1 id="contact-heading">Get in Touch</h1>

          <dl className="contact-details">
            <div>
              <dt>Email</dt>
              <dd>
                <a
                  className="project-title-link contact-link"
                  href={`mailto:${CONTACT_EMAIL}`}
                >
                  {CONTACT_EMAIL} <span aria-hidden="true">↗</span>
                </a>
              </dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>
                Vancouver, British Columbia, Canada
                <br />
                <a
                  className="project-title-link contact-link"
                  href={VANCOUVER_MAP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Map <span aria-hidden="true">↗</span>
                </a>
              </dd>
            </div>
            <div>
              <dt>Time Zone</dt>
              <dd>
                Pacific Time (PT)
                <br />
                UTC-7 Year-round
              </dd>
            </div>
          </dl>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
