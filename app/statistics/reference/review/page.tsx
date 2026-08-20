import { SiteFooter } from "../../../SiteFooter";
import { SiteHeader } from "../../../SiteHeader";
import { ReferenceViewer } from "../ReferenceViewer";

export default function PrivateReferenceReviewPage() {
  return (
    <div className="site-shell" id="page-start">
      <SiteHeader />
      <ReferenceViewer />
      <SiteFooter />
    </div>
  );
}
