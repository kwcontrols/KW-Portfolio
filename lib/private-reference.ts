import { env } from "cloudflare:workers";

export type PrivateReferenceDocument = {
  title: string;
  revision: number;
  updatedAt: string;
  body: string;
};

export type PrivateReferenceAttachment = {
  filename: string;
  contentType: string;
  size: number;
  uploadedAt: string;
};

type ReferenceKv = {
  get(key: string): Promise<string | null>;
  get(key: string, options: { type: "arrayBuffer" }): Promise<ArrayBuffer | null>;
  put(key: string, value: string | ArrayBuffer): Promise<void>;
  delete(key: string): Promise<void>;
};

const DOC_KEY = "portfolio-admin-doc:operations-reference";
const ATTACHMENT_META_KEY = "portfolio-admin-doc:operations-reference:attachment-meta";
const ATTACHMENT_DATA_KEY = "portfolio-admin-doc:operations-reference:attachment-data";
const DEFAULT_TITLE = "KW Portfolio Private Portal — Operations Reference";
export const MAX_REFERENCE_ATTACHMENT_BYTES = 10 * 1024 * 1024;

export const DEFAULT_PORTFOLIO_REFERENCE = `KW PORTFOLIO — OPERATIONS REFERENCE

Purpose
This private document is the working memory for maintaining and extending the KW Portfolio website. Review it before major changes so important architecture, security, deployment, analytics, and content decisions are not forgotten.

1. Repository and source control
- GitHub repository: kwcontrols/KW-Portfolio.
- Main is the production baseline. Before substantial work, fetch remote changes and confirm local status and active branch.
- Prefer a feature branch for non-trivial changes. Keep commits focused and verify the diff before merging.
- Before changing a stable page or security feature, create a clear restore point/commit.
- Never commit passwords, access codes, session secrets, API credentials, service-account keys, or other private values.
- After remote changes are merged, sync the local checkout with git fetch and a fast-forward pull only when the worktree is clean.

2. Application stack
- Next.js 16 / React 19 application built and deployed through vinext to Cloudflare Workers.
- Main development commands are defined in package.json: npm run dev, npm run build, npm run lint, npm test, and the Cloudflare deploy/release scripts.
- Local development uses .env.local for private values. Keep .env.local out of Git.
- Generated .wrangler and build output are local/deployment artifacts and should not be treated as source files.

3. Site structure and purpose
- The portfolio is a personal professional site for recruiters, hiring managers, clients, colleagues, and professional contacts.
- Core sections include Home, About Me, Automation Experience, Featured Projects, AI Journey, Beyond Work, Contact, Resume, and the private Administration/Statistics portal.
- Preserve the established visual language: clean professional layout, dark navy/blue accents, strong typography, restrained animation, and responsive behavior.
- Avoid adding public navigation to private administration features.

4. Private portal access
- The Administration/Statistics area is intentionally hidden from the normal top navigation and accessed through the designated private entry flow.
- Authentication uses the statistics session cookie and signed session logic in lib/statistics-auth.ts.
- Owner credentials come from protected environment configuration. Guest access can be generated and revoked from Guest Management.
- Owner-only features must always verify session.role === \"owner\" on the server/API side. Hiding a button in the UI is not sufficient security.
- Revoking a managed guest must invalidate both the guest code and active guest access on the next validated request.
- Do not expose owner-only data in public source, static JSON, client bundles, analytics, or GitHub history.

5. Cloudflare KV
- The existing KW_STATISTICS_GUESTS KV binding stores managed guest records and owner-only operational reference data.
- Private reference text and uploaded supporting documents live in KV, not in the public repository.
- Uploaded private reference files are limited to 10 MB and should be limited to expected safe types such as PNG, JPEG, and PDF.
- If KV is unavailable, fail safely and show a clear owner-facing error; do not silently fall back to public storage.

6. Analytics and Administration
- GA4 data powers the private analytics dashboard. Treat network/IP-derived city, province/region, and country as approximate.
- Preserve the realtime and processed-activity distinction in the dashboard.
- Analytics data should remain private and should not be indexed or exposed through public navigation.
- Guest Management and Operations Reference are owner-only administration functions.

7. Operations Reference feature
- The Operations Reference page is owner-only and should provide: revision history metadata, document review, edit/save-next-revision, PDF download, private supporting-file upload/replace, review/download, and removal.
- Saving text creates the next revision and records a timestamp.
- Keep form fields and actions clear enough that future maintenance can be performed without opening the source code.
- This reference should be updated whenever architecture, deployment, authentication, analytics, hosting, or major content conventions change.

8. Local development workflow
- Start from a clean synchronized main branch.
- Run npm install when dependencies change.
- Run npm run dev for local review.
- After environment changes, restart the dev server so .env.local is reloaded.
- Validate desktop and mobile layouts after UI changes.
- Before committing, run git status and inspect exactly what changed.
- Run lint/build/tests where practical before publishing.

9. Cloudflare deployment
- Production deployment is handled through the Cloudflare/vinext workflow defined by the repository scripts and generated dist/server/wrangler.json configuration.
- Cloudflare secrets and bindings are deployment configuration, not repository content.
- When changing Worker/KV behavior, verify both local behavior and the deployed private portal after release.
- Confirm that owner login, guest login, logout, guest revocation, analytics, and private reference access still work after deployment-related changes.

10. Content and portfolio conventions
- The professional positioning centers on process automation and system integration, with strong Rockwell Automation / Allen-Bradley experience and supporting Siemens knowledge.
- Preserve accurate experience wording and avoid overstating technologies or responsibilities.
- Portfolio project imagery may contain client or employer material; blur/remove confidential or identifying information before public use when appropriate.
- Keep About Me, Experience, Projects, Resume, LinkedIn positioning, and contact information consistent when one of them is updated.

11. Images and assets
- Keep source-quality images where practical and avoid unnecessary rescaling that degrades quality.
- Check cropping at desktop and mobile breakpoints after replacing images.
- Use descriptive alt text for meaningful public images.
- Keep confidential/private reference attachments in KV rather than public/assets folders.

12. Security checklist before release
- No secrets or access codes committed.
- Owner-only API routes verify the signed owner session server-side.
- Guest-only sessions cannot call owner-only guest-management or private-reference APIs.
- Private responses use no-store behavior where appropriate.
- Private pages are not linked from public navigation and should not be indexed.
- File uploads enforce size and content-type restrictions.

13. Change-management checklist
- Fetch remote first.
- Confirm active branch and clean worktree.
- Make one logical change at a time.
- Test locally.
- Review git diff/status.
- Commit with a descriptive message.
- Push/merge only after verification.
- Fast-forward local main after remote main changes.
- Re-test the live site after deployment.

14. Items worth documenting here when they change
- Domain/hosting configuration.
- Cloudflare Worker name, routes, KV bindings, or deployment method.
- GA4 property/data pipeline changes.
- Authentication/session design.
- New private administration tools.
- Major navigation or page-structure changes.
- New external integrations.
- Any troubleshooting procedure that took meaningful time to discover.
`;

function store(): ReferenceKv | null {
  return ((env as unknown as { KW_STATISTICS_GUESTS?: ReferenceKv }).KW_STATISTICS_GUESTS) ?? null;
}

export async function ensurePrivateReference(): Promise<PrivateReferenceDocument | null> {
  const kv = store();
  if (!kv) return null;
  const raw = await kv.get(DOC_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as PrivateReferenceDocument;
      if (parsed?.title && parsed?.body && Number.isFinite(parsed.revision)) return parsed;
    } catch {}
  }
  const initial: PrivateReferenceDocument = {
    title: DEFAULT_TITLE,
    revision: 1,
    updatedAt: new Date().toISOString(),
    body: DEFAULT_PORTFOLIO_REFERENCE,
  };
  await kv.put(DOC_KEY, JSON.stringify(initial));
  return initial;
}

export async function savePrivateReference(title: string, body: string): Promise<PrivateReferenceDocument | null> {
  const kv = store();
  if (!kv) return null;
  const current = await ensurePrivateReference();
  if (!current) return null;
  const next: PrivateReferenceDocument = {
    title: title.trim().slice(0, 140) || DEFAULT_TITLE,
    body: body.trim().slice(0, 60000),
    revision: current.revision + 1,
    updatedAt: new Date().toISOString(),
  };
  if (!next.body) return null;
  await kv.put(DOC_KEY, JSON.stringify(next));
  return next;
}

export async function getReferenceAttachmentMeta(): Promise<PrivateReferenceAttachment | null> {
  const kv = store();
  if (!kv) return null;
  const raw = await kv.get(ATTACHMENT_META_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PrivateReferenceAttachment;
  } catch {
    return null;
  }
}

export async function saveReferenceAttachment(file: File): Promise<PrivateReferenceAttachment | null> {
  const kv = store();
  if (!kv || file.size <= 0 || file.size > MAX_REFERENCE_ATTACHMENT_BYTES) return null;
  const allowed = new Set(["image/png", "image/jpeg", "application/pdf"]);
  if (!allowed.has(file.type)) return null;
  const meta: PrivateReferenceAttachment = {
    filename: file.name.slice(0, 180) || "supporting-document",
    contentType: file.type,
    size: file.size,
    uploadedAt: new Date().toISOString(),
  };
  await kv.put(ATTACHMENT_DATA_KEY, await file.arrayBuffer());
  await kv.put(ATTACHMENT_META_KEY, JSON.stringify(meta));
  return meta;
}

export async function getReferenceAttachment(): Promise<{ meta: PrivateReferenceAttachment; data: ArrayBuffer } | null> {
  const kv = store();
  if (!kv) return null;
  const [meta, data] = await Promise.all([
    getReferenceAttachmentMeta(),
    kv.get(ATTACHMENT_DATA_KEY, { type: "arrayBuffer" }),
  ]);
  return meta && data ? { meta, data } : null;
}

export async function deleteReferenceAttachment(): Promise<boolean> {
  const kv = store();
  if (!kv) return false;
  await Promise.all([kv.delete(ATTACHMENT_META_KEY), kv.delete(ATTACHMENT_DATA_KEY)]);
  return true;
}

function pdfEscape(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function ascii(value: string) {
  return value.replace(/—|–/g, "-").replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "?");
}

function wrapLines(text: string, max = 92) {
  const out: string[] = [];
  for (const raw of ascii(text).replace(/\r/g, "").split("\n")) {
    if (!raw.trim()) { out.push(""); continue; }
    const words = raw.trim().split(/\s+/);
    let line = "";
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (candidate.length > max && line) { out.push(line); line = word; } else line = candidate;
    }
    out.push(line);
  }
  return out;
}

export function buildReferencePdf(doc: PrivateReferenceDocument): Uint8Array {
  const lines = wrapLines(`${doc.title}\nRevision: R${doc.revision}\nUpdated: ${doc.updatedAt}\n\n${doc.body}`);
  const pages: string[][] = [];
  for (let i = 0; i < lines.length; i += 48) pages.push(lines.slice(i, i + 48));
  if (!pages.length) pages.push(["No content."]);

  const objects: string[] = [];
  const add = (body: string) => { objects.push(body); return objects.length; };
  const catalog = add("");
  const pagesObj = add("");
  const font = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const pageIds: number[] = [];

  for (const page of pages) {
    const commands = ["BT", "/F1 10 Tf", "50 760 Td", "12 TL"];
    page.forEach((line, index) => {
      if (index) commands.push("T*");
      commands.push(`(${pdfEscape(line)}) Tj`);
    });
    commands.push("ET");
    const stream = commands.join("\n");
    const content = add(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
    pageIds.push(add(`<< /Type /Page /Parent ${pagesObj} 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${font} 0 R >> >> /Contents ${content} 0 R >>`));
  }

  objects[catalog - 1] = `<< /Type /Catalog /Pages ${pagesObj} 0 R >>`;
  objects[pagesObj - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((body, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i < offsets.length; i++) pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalog} 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new TextEncoder().encode(pdf);
}
