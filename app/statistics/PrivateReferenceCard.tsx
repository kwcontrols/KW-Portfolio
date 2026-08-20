"use client";

import { useEffect, useState } from "react";

type ReferencePayload = {
  document?: { title: string; revision: number; updatedAt: string; body: string };
};

export function PrivateReferenceCard() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let active = true;
    async function checkOwnerReference() {
      try {
        const response = await fetch("/api/private-reference", {
          cache: "no-store",
          credentials: "same-origin",
        });
        if (!active || !response.ok) return;
        const payload = (await response.json()) as ReferencePayload;
        if (payload.document) setVisible(true);
      } catch {}
    }
    void checkOwnerReference();
    return () => { active = false; };
  }, []);

  if (!visible) return null;

  return (
    <section
      style={{
        marginTop: "20px",
        padding: "22px",
        border: "1px solid #d5dfeb",
        background: "#fff",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: "0.72rem", letterSpacing: "0.12em", color: "#52647a" }}>
            PRIVATE REFERENCE
          </div>
          <h2 style={{ margin: "5px 0 7px", fontSize: "1.35rem" }}>Operations Reference</h2>
        </div>
        <span style={{ color: "#52647a", fontSize: "0.78rem" }}>Owner only</span>
      </div>
      <p style={{ margin: "10px 0 18px", color: "#52647a", lineHeight: 1.55 }}>
        Private implementation notes, maintenance procedures, development decisions,
        revision history, troubleshooting reference, and supporting documents stored in Cloudflare KV.
      </p>
      <a
        href="/statistics/reference"
        style={{
          display: "inline-block",
          padding: "11px 16px",
          background: "#2563eb",
          color: "#fff",
          textDecoration: "none",
          fontWeight: 800,
        }}
      >
        Open private reference →
      </a>
    </section>
  );
}
