"use client";

import { FormEvent, useEffect, useState } from "react";

type DocumentRecord = {
  title: string;
  revision: number;
  updatedAt: string;
  body: string;
};

type Attachment = {
  filename: string;
  contentType: string;
  size: number;
  uploadedAt: string;
};

type Payload = {
  document: DocumentRecord;
  attachment: Attachment | null;
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

function formatBytes(value: number) {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

const panel: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #d5dfeb",
  padding: "24px",
  marginTop: "20px",
};

const button: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: 0,
  background: "#2563eb",
  color: "#fff",
  fontWeight: 800,
  padding: "10px 16px",
  cursor: "pointer",
  textDecoration: "none",
};

const secondary: React.CSSProperties = {
  ...button,
  background: "#fff",
  color: "#175dcc",
  border: "1px solid #a9c5ef",
};

export function ReferenceManager() {
  const [data, setData] = useState<Payload | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const response = await fetch("/api/private-reference", {
      cache: "no-store",
      credentials: "same-origin",
    });
    if (response.status === 403) {
      window.location.assign("/statistics");
      return;
    }
    if (!response.ok) {
      setError("Private reference storage could not be loaded.");
      return;
    }
    setData((await response.json()) as Payload);
  }

  useEffect(() => {
    void load();
  }, []);

  function beginEdit() {
    if (!data) return;
    setTitle(data.document.title);
    setBody(data.document.body);
    setEditing(true);
    setMessage("");
    setError("");
    setTimeout(() => document.getElementById("reference-editor")?.scrollIntoView({ behavior: "smooth" }), 0);
  }

  function cancelEdit() {
    setEditing(false);
    setTitle("");
    setBody("");
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/private-reference", {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title, body }),
      });
      const payload = (await response.json()) as { document?: DocumentRecord; error?: string };
      if (!response.ok || !payload.document) {
        setError(payload.error ?? "Reference could not be saved.");
        return;
      }
      setData((current) => current ? { ...current, document: payload.document! } : current);
      cancelEdit();
      setMessage(`Saved revision R${payload.document.revision}.`);
    } catch {
      setError("Reference could not be saved.");
    } finally {
      setBusy(false);
    }
  }

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem("file") as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) return;
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const formData = new FormData();
      formData.set("file", file);
      const response = await fetch("/api/private-reference/attachment", {
        method: "POST",
        credentials: "same-origin",
        body: formData,
      });
      const payload = (await response.json()) as { attachment?: Attachment; error?: string };
      if (!response.ok || !payload.attachment) {
        setError(payload.error ?? "Supporting document could not be uploaded.");
        return;
      }
      setData((current) => current ? { ...current, attachment: payload.attachment! } : current);
      form.reset();
      setMessage("Supporting document uploaded.");
    } catch {
      setError("Supporting document could not be uploaded.");
    } finally {
      setBusy(false);
    }
  }

  async function removeAttachment() {
    if (!data?.attachment || !window.confirm(`Remove ${data.attachment.filename}?`)) return;
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/private-reference/attachment", {
        method: "DELETE",
        credentials: "same-origin",
      });
      if (!response.ok) {
        setError("Supporting document could not be removed.");
        return;
      }
      setData((current) => current ? { ...current, attachment: null } : current);
      setMessage("Supporting document removed.");
    } finally {
      setBusy(false);
    }
  }

  if (!data && !error) {
    return <main style={{ maxWidth: "1050px", margin: "0 auto", padding: "38px 22px 64px" }}>Loading private reference…</main>;
  }

  return (
    <main style={{ maxWidth: "1050px", margin: "0 auto", padding: "38px 22px 64px" }}>
      <a href="/statistics" style={{ color: "#175dcc", fontSize: "0.82rem", fontWeight: 700, textDecoration: "none" }}>
        ← Back to Administration
      </a>

      <div style={{ marginTop: "16px", color: "#175dcc", fontSize: "0.76rem", letterSpacing: "0.13em", fontWeight: 800 }}>
        OWNER-ONLY REFERENCE
      </div>
      <h1 style={{ margin: "8px 0", color: "#0c2742", fontSize: "2.2rem", lineHeight: 1.1 }}>
        {data?.document.title ?? "KW Portfolio Private Portal — Operations Reference"}
      </h1>
      {data ? (
        <div style={{ color: "#64748b", fontSize: "0.82rem", marginBottom: "22px" }}>
          Revision: R{data.document.revision} · Updated: {formatDate(data.document.updatedAt)} PT
        </div>
      ) : null}

      {message ? <div style={{ padding: "12px 14px", background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#065f46" }}>{message}</div> : null}
      {error ? <div style={{ padding: "12px 14px", background: "#fff1f2", border: "1px solid #fecaca", color: "#991b1b" }}>{error}</div> : null}

      {data ? (
        <>
          <section style={{ ...panel, display: "flex", justifyContent: "space-between", gap: "18px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0c2742" }}>{data.document.title}</div>
              <div style={{ color: "#64748b", fontSize: "0.78rem", marginTop: "4px" }}>
                R{data.document.revision} · Updated {formatDate(data.document.updatedAt)} PT
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button type="button" onClick={() => document.getElementById("reference-content")?.scrollIntoView({ behavior: "smooth" })} style={secondary}>↗ Review</button>
              <button type="button" onClick={beginEdit} style={secondary}>✎ Edit</button>
              <a href="/api/private-reference/pdf" style={secondary}>Download PDF</a>
            </div>
          </section>

          {data.attachment ? (
            <section style={{ ...panel, display: "flex", justifyContent: "space-between", gap: "18px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0c2742" }}>{data.attachment.filename}</div>
                <div style={{ color: "#64748b", fontSize: "0.78rem", marginTop: "4px" }}>
                  Supporting document · {formatBytes(data.attachment.size)} · Uploaded {formatDate(data.attachment.uploadedAt)} PT
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <a href="/api/private-reference/attachment" target="_blank" rel="noreferrer" style={secondary}>↗ Open</a>
                <a href="/api/private-reference/attachment?download=1" style={secondary}>Download</a>
                <button type="button" disabled={busy} onClick={removeAttachment} style={{ ...secondary, color: "#b42318", borderColor: "#fecaca" }}>Remove</button>
              </div>
            </section>
          ) : null}

          <section id="reference-content" style={panel}>
            <h2 style={{ margin: "0 0 12px", color: "#0c2742" }}>Current operations reference</h2>
            <div style={{ whiteSpace: "pre-wrap", color: "#20364e", fontSize: "0.9rem", lineHeight: 1.6 }}>{data.document.body}</div>
          </section>

          <section id="reference-editor" style={panel}>
            <h2 style={{ margin: "0 0 6px", color: "#0c2742" }}>Edit private reference</h2>
            <p style={{ color: "#64748b", fontSize: "0.8rem", margin: "0 0 16px" }}>
              Click Edit above to load the current revision. Saving creates the next revision and records Pacific Time.
            </p>
            <form onSubmit={save}>
              <label style={{ display: "block", color: "#0c2742", fontSize: "0.78rem", fontWeight: 800 }}>
                Document title
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  disabled={!editing || busy}
                  placeholder={data.document.title}
                  style={{ width: "100%", marginTop: "6px", padding: "10px 12px", border: "1px solid #bccadd", font: "inherit" }}
                />
              </label>
              <label style={{ display: "block", marginTop: "14px", color: "#0c2742", fontSize: "0.78rem", fontWeight: 800 }}>
                Reference content
                <textarea
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  disabled={!editing || busy}
                  placeholder="Click Edit above to load the current reference."
                  style={{ width: "100%", minHeight: "360px", marginTop: "6px", padding: "10px 12px", border: "1px solid #bccadd", font: "inherit", resize: "vertical" }}
                />
              </label>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "12px" }}>
                <button type="submit" disabled={!editing || busy} style={{ ...button, opacity: !editing || busy ? 0.55 : 1 }}>Save next revision</button>
                <button type="button" disabled={!editing || busy} onClick={cancelEdit} style={{ ...secondary, opacity: !editing || busy ? 0.55 : 1 }}>Cancel</button>
              </div>
            </form>
          </section>

          <section style={panel}>
            <h2 style={{ margin: "0 0 6px", color: "#0c2742" }}>Supporting document</h2>
            <p style={{ color: "#64748b", fontSize: "0.8rem", margin: "0 0 16px" }}>
              Upload or replace a private PNG, JPG, or PDF. Files are stored in Cloudflare KV, not the public GitHub repository. Maximum size: 10 MB.
            </p>
            <form onSubmit={upload}>
              <input name="file" type="file" accept="image/png,image/jpeg,application/pdf" required disabled={busy} />
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "12px" }}>
                <button type="submit" disabled={busy} style={button}>{data.attachment ? "Replace supporting document" : "Upload supporting document"}</button>
                <button type="reset" disabled={busy} style={secondary}>Cancel</button>
              </div>
            </form>
          </section>
        </>
      ) : null}
    </main>
  );
}
