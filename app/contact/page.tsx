import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";
import { VancouverTime } from "./VancouverTime";

const CONTACT_EMAIL = "teck3618@gmail.com";
const VANCOUVER_MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=Vancouver,+British+Columbia,+Canada";
const PORTFOLIO_URL = "https://site-creator-vinext-starter.teck3618.workers.dev/";
const PORTFOLIO_QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&format=svg&data=${encodeURIComponent(PORTFOLIO_URL)}`;

export default function ContactPage() {
  return (
    <div className="site-shell" id="page-start">
      <SiteHeader />
      <main className="contact-page" id="contact">
        <section className="contact-column" aria-labelledby="contact-heading">
          <h1 id="contact-heading">Get in Touch</h1>
          <p className="contact-intro">
            I&apos;m always happy to connect about automation or opportunities.
          </p>

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
                <br />
                <VancouverTime />
              </dd>
            </div>
            <div>
              <dt>Portfolio QR Code</dt>
              <dd>
                <a href={PORTFOLIO_URL} aria-label="Open portfolio homepage">
                  <img
                    className="contact-qr-code"
                    src={PORTFOLIO_QR_URL}
                    alt="QR code for the portfolio homepage"
                    width="120"
                    height="120"
                  />
                </a>
                <span className="contact-qr-caption">Scan to open on mobile.</span>
              </dd>
            </div>
          </dl>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
