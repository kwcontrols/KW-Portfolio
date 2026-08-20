"use client";

import { useEffect, useState } from "react";

type DocumentRecord = {
  title: string;
  revision: number;
  updatedAt: string;
  body: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-CA", {
    timeZone: "America/Vancouver",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const secondary: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#fff",
  color: "#175dcc",
  border: "1px solid #a9c5ef",
  fontWeight: 800,
  padding: "10px 16px",
  textDecoration: "none",
};

export function ReferenceViewer() {
  const [document, setDocument] = useState<DocumentRecord | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch("/api/private-reference", {
          cache: "no-store",
          credentials: "same-origin",
          signal: controller.signal,
        });
        if (response.status === 403) {
          window.location.assign("/statistics");
          return;
        }
        if (!response.ok) throw new Error("load failed");
        const payload = (await response.json()) as { document: DocumentRecord };
        setDocument(payload.document);
      } catch (reason) {
        if (!(reason instanceof DOMException && reason.name === "AbortError")) {
          setError("Private reference could not be loaded.");
        }
      }
    }
    void load();
    return () => controller.abort();
  }, []);

  if (!document && !error) {
    return <main style={{ maxWidth: "1050px", margin: "0 auto", padding: "38px 22px 64px" }}>Loading private reference…</main>;
  }

  return (
    <main style={{ maxWidth: "1050px", margin: "0 auto", padding: "38px 22px 64px" }}>
      <a href="/statistics/reference" style={{ color: "#175dcc", fontSize: "0.82rem", fontWeight: 700, textDecoration: "none" }}>
        ← Back to Operations Reference
      </a>

      <div style={{ marginTop: "16px", color: "#175dcc", fontSize: "0.76rem", letterSpacing: "0.13em", fontWeight: 800 }}>
        OWNER-ONLY DOCUMENT
      </div>

      {document ? (
        <>
          <h1 style={{ margin: "8px 0", color: "#0c2742", fontSize: "2.2rem", lineHeight: 1.1 }}>
            {document.title}
          </h1>
          <div style={{ color: "#64748b", fontSize: "0.82rem", marginBottom: "18px" }}>
            Revision: R{document.revision} · Updated: {formatDate(document.updatedAt)} PT
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "18px" }}>
            <a href="/api/private-reference/pdf" style={secondary}>Download PDF</a>
            <a href="/statistics/reference?edit=1" style={secondary}>✎ Edit</a>
          </div>
          <section style={{ background: "#fff", border: "1px solid #d5dfeb", padding: "24px" }}>
            <div style={{ whiteSpace: "pre-wrap", color: "#20364e", fontSize: "0.9rem", lineHeight: 1.65 }}>
              {document.body || "No reference content has been saved yet."}
            </div>
          </section>
        </>
      ) : (
        <div style={{ marginTop: "20px", padding: "12px 14px", background: "#fff1f2", border: "1px solid #fecaca", color: "#991b1b" }}>
          {error}
        </div>
      )}
    </main>
  );
}
