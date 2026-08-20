import { SiteFooter } from "../../SiteFooter";
import { SiteHeader } from "../../SiteHeader";
import { ReferenceManager } from "./ReferenceManager";

export default function PrivateReferencePage() {
  return (
    <div className="site-shell" id="page-start">
      <SiteHeader />
      <ReferenceManager />
      <SiteFooter />
    </div>
  );
}
