import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";
import { ResumeTimeline } from "./ResumeTimeline";

export default function ResumePage() {
  return (
    <div className="site-shell" id="page-start">
      <SiteHeader />
      <main className="resume-page">
        <ResumeTimeline />
      </main>
      <SiteFooter />
    </div>
  );
}
