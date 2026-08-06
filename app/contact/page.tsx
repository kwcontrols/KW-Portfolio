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

    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const subjectEntry = String(formData.get("subject") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const subject = subjectEntry || `Website Contact from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

    // This mailto flow can later be replaced with Formspree, EmailJS, or a server-side API for direct submission.
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="site-shell" id="page-start">
      <SiteHeader />
      <main className="contact-page" id="contact">
        <section className="contact-column" aria-labelledby="contact-heading">
          <h1 id="contact-heading">Contact</h1>

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
                Vancouver, British Columbia, Canada{" "}
                <a
                  className="project-title-link contact-link contact-map-link"
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
          <h2 id="get-in-touch-heading">Get in Touch</h2>
          <p className="contact-intro">
            Whether you have a project in mind or simply want to connect, feel
            free to send me a message.
          </p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-field">
              <label htmlFor="contact-name">
                Name <span className="required-marker" aria-hidden="true">*</span>
                <span className="visually-hidden"> required</span>
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                required
              />
            </div>
            <div className="contact-field">
              <label htmlFor="contact-email">
                Email <span className="required-marker" aria-hidden="true">*</span>
                <span className="visually-hidden"> required</span>
              </label>
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
              <label htmlFor="contact-message">
                Message <span className="required-marker" aria-hidden="true">*</span>
                <span className="visually-hidden"> required</span>
              </label>
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
          </form>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
