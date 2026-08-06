"use client";

import type { FormEvent } from "react";
import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";

const CONTACT_EMAIL = "teck3618@gmail.com";
const VANCOUVER_MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=Vancouver,+British+Columbia,+Canada";

export default function ContactPage() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Connect the contact-form backend or form service here in a future update.
  };

  return (
    <div className="site-shell" id="page-start">
      <SiteHeader />
      <main className="contact-page" id="contact">
        <section className="contact-column" aria-labelledby="contact-heading">
          <p className="section-index">Contact</p>
          <h1 id="contact-heading">Contact</h1>

          <dl className="contact-details">
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>
                Vancouver, British Columbia, Canada{" "}
                <a
                  className="project-title-link contact-map-link"
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

        <section className="contact-column" aria-labelledby="get-in-touch-heading">
          <p className="section-index">Get in Touch</p>
          <h2 id="get-in-touch-heading">Get in Touch</h2>
          <p className="contact-intro">
            Whether you have a project in mind, a technical question, or simply
            want to connect, feel free to send me a message. I&apos;d be happy
            to hear from you.
          </p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-field">
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                required
              />
            </div>
            <div className="contact-field">
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
            </div>
            <div className="contact-field">
              <label htmlFor="contact-subject">Subject</label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                autoComplete="off"
              />
            </div>
            <div className="contact-field">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                rows={7}
                required
              />
            </div>
            <button className="contact-submit" type="submit">
              Send Message
            </button>
            <p className="contact-form-note">
              Form submission will be connected in a future update.
            </p>
          </form>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
