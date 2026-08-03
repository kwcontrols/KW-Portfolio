import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";

export default function ResumePage() {
  return (
    <div className="site-shell" id="page-start">
      <SiteHeader />
      <main className="resume-page">
        <section className="resume-section">
          <h1>Professional Experience</h1>

          <article className="resume-entry">
            <header>
              <div>
                <h2>Placeholder Job Title</h2>
                <p>Placeholder Company · Placeholder Location</p>
              </div>
              <p>20XX–Present</p>
            </header>
            <ul>
              <li>Placeholder responsibility describing the scope and focus of this role.</li>
              <li>Placeholder achievement highlighting a measurable or meaningful result.</li>
              <li>Placeholder contribution involving collaboration, delivery, or improvement.</li>
            </ul>
          </article>

          <article className="resume-entry">
            <header>
              <div>
                <h2>Placeholder Previous Job Title</h2>
                <p>Placeholder Company · Placeholder Location</p>
              </div>
              <p>20XX–20XX</p>
            </header>
            <ul>
              <li>Placeholder responsibility describing the primary work completed in this position.</li>
              <li>Placeholder achievement showing the value or impact of that work.</li>
            </ul>
          </article>
        </section>

        <section className="resume-section">
          <h1>Education</h1>

          <article className="resume-entry resume-entry-compact">
            <header>
              <div>
                <h2>Placeholder Degree</h2>
                <p>Placeholder School · Placeholder Location</p>
              </div>
              <p>20XX</p>
            </header>
          </article>

          <article className="resume-entry resume-entry-compact">
            <header>
              <div>
                <h2>Placeholder Additional Degree</h2>
                <p>Placeholder School · Placeholder Location</p>
              </div>
              <p>20XX</p>
            </header>
          </article>
        </section>

        <section className="resume-section">
          <h1>Professional Memberships</h1>

          <article className="resume-entry resume-entry-compact">
            <h2>Placeholder Technical Organization</h2>
            <p>Placeholder membership level or professional designation</p>
          </article>

          <article className="resume-entry resume-entry-compact">
            <h2>Placeholder Professional Association</h2>
            <p>Placeholder membership level or area of participation</p>
          </article>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
