"use client";

import { FormEvent, useEffect, useState } from "react";

type Guest = {
  id: string;
  name: string;
  expiresAt: string;
  sessionHours: number;
  createdAt: string;
};

type CreatedGuest = {
  guest: Guest;
  code: string;
};

function defaultExpiryLocal() {
  const date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

export function GuestAccessManager() {
  const [guests, setGuests] = useState<Guest[] | null>(null);
  const [available, setAvailable] = useState(false);
  const [name, setName] = useState("");
  const [expiresAt, setExpiresAt] = useState(defaultExpiryLocal);
  const [sessionHours, setSessionHours] = useState(2);
  const [created, setCreated] = useState<CreatedGuest | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadGuests() {
    const response = await fetch("/api/statistics-guests", {
      cache: "no-store",
      credentials: "same-origin",
    });
    if (response.status === 403) {
      setAvailable(false);
      setGuests(null);
      setCreated(null);
      setMessage("");
      return;
    }
    if (response.status === 503) {
      setAvailable(true);
      setGuests(null);
      setMessage("Guest management storage is not connected yet.");
      return;
    }
    if (!response.ok) {
      setAvailable(false);
      setMessage("");
      return;
    }
    const data = (await response.json()) as { guests?: Guest[] };
    setAvailable(true);
    setGuests(data.guests ?? []);
  }

  useEffect(() => {
    void loadGuests();
  }, []);

  if (!available) return null;

  async function createGuest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setCreated(null);
    try {
      const response = await fetch("/api/statistics-guests", {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          expiresAt: new Date(expiresAt).toISOString(),
          sessionHours,
        }),
      });
      const data = (await response.json()) as CreatedGuest & { error?: string };
      if (!response.ok) {
        setMessage(data.error ?? "Guest could not be created.");
        return;
      }
      setCreated(data);
      setName("");
      await loadGuests();
    } catch {
      setMessage("Guest could not be created.");
    } finally {
      setBusy(false);
    }
  }

  async function revokeGuest(id: string, guestName: string) {
    if (!window.confirm(`Revoke access for ${guestName}?`)) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/statistics-guests/${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      if (response.status === 403) {
        setAvailable(false);
        setGuests(null);
        setCreated(null);
        return;
      }
      if (!response.ok) {
        setMessage("Guest could not be revoked.");
        return;
      }
      setCreated(null);
      await loadGuests();
    } finally {
      setBusy(false);
    }
  }

  async function copyCode() {
    if (!created?.code) return;
    await navigator.clipboard.writeText(created.code);
    setMessage("Guest code copied.");
  }

  return (
    <section
      style={{
        marginTop: "32px",
        padding: "22px",
        border: "1px solid #d5dfeb",
        background: "#fff",
      }}
    >
      <div style={{ marginBottom: "18px" }}>
        <div style={{ fontSize: "0.72rem", letterSpacing: "0.12em", color: "#52647a" }}>
          OWNER ONLY
        </div>
        <h2 style={{ margin: "5px 0 7px", fontSize: "1.35rem" }}>Guest Management</h2>
        <p style={{ margin: 0, color: "#52647a", lineHeight: 1.55 }}>
          Create a unique temporary code for each person. Revoking a guest invalidates
          both the code and any active session on their next request.
        </p>
      </div>

      {created ? (
        <div
          style={{
            marginBottom: "20px",
            padding: "14px",
            border: "1px solid #c8d8ea",
            background: "#f7faff",
          }}
        >
          <strong>{created.guest.name}</strong> was created. Share this code once:
          <div style={{ display: "flex", gap: "8px", marginTop: "9px", alignItems: "center" }}>
            <code style={{ wordBreak: "break-all", flex: 1 }}>{created.code}</code>
            <button type="button" onClick={copyCode}>Copy</button>
          </div>
          <div style={{ marginTop: "7px", fontSize: "0.82rem", color: "#52647a" }}>
            For security, the code is not shown again after this message is dismissed.
          </div>
        </div>
      ) : null}

      <form onSubmit={createGuest} style={{ display: "grid", gap: "12px", marginBottom: "22px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 0.6fr auto", gap: "10px" }}>
          <label>
            <span style={{ display: "block", fontSize: "0.78rem", marginBottom: "5px" }}>Guest name</span>
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Jane Recruiter"
              style={{ width: "100%", padding: "9px" }}
            />
          </label>
          <label>
            <span style={{ display: "block", fontSize: "0.78rem", marginBottom: "5px" }}>Expires</span>
            <input
              required
              type="datetime-local"
              value={expiresAt}
              onChange={(event) => setExpiresAt(event.target.value)}
              style={{ width: "100%", padding: "9px" }}
            />
          </label>
          <label>
            <span style={{ display: "block", fontSize: "0.78rem", marginBottom: "5px" }}>Session hours</span>
            <input
              required
              min="0.25"
              max="168"
              step="0.25"
              type="number"
              value={sessionHours}
              onChange={(event) => setSessionHours(Number(event.target.value))}
              style={{ width: "100%", padding: "9px" }}
            />
          </label>
          <button type="submit" disabled={busy} style={{ alignSelf: "end", padding: "10px 15px" }}>
            Add Guest
          </button>
        </div>
      </form>

      {message ? <p style={{ color: "#52647a" }}>{message}</p> : null}

      {guests?.length ? (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #d5dfeb" }}>
                <th style={{ padding: "9px 6px" }}>Guest</th>
                <th style={{ padding: "9px 6px" }}>Expires</th>
                <th style={{ padding: "9px 6px" }}>Session</th>
                <th style={{ padding: "9px 6px" }} />
              </tr>
            </thead>
            <tbody>
              {guests.map((guest) => (
                <tr key={guest.id} style={{ borderBottom: "1px solid #edf1f6" }}>
                  <td style={{ padding: "10px 6px" }}>{guest.name}</td>
                  <td style={{ padding: "10px 6px" }}>{new Date(guest.expiresAt).toLocaleString()}</td>
                  <td style={{ padding: "10px 6px" }}>{guest.sessionHours} hr</td>
                  <td style={{ padding: "10px 6px", textAlign: "right" }}>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => revokeGuest(guest.id, guest.name)}
                    >
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : guests ? (
        <p style={{ color: "#52647a", marginBottom: 0 }}>No managed guests yet.</p>
      ) : null}
    </section>
  );
}
