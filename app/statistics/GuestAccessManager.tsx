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

function vancouverDateTimeLocal(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Vancouver",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(
    formatter
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

function defaultExpiryLocal() {
  return vancouverDateTimeLocal(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
}

function formatPacific(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-CA", {
    timeZone: "America/Vancouver",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function GuestAccessManager() {
  const [guests, setGuests] = useState<Guest[] | null>(null);
  const [available, setAvailable] = useState(false);
  const [name, setName] = useState("");
  const [expiresAt, setExpiresAt] = useState(defaultExpiryLocal);
  const [sessionHours, setSessionHours] = useState(8);
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
        body: JSON.stringify({ name, expiresAt, sessionHours }),
      });
      const data = (await response.json()) as CreatedGuest & { error?: string };
      if (!response.ok) {
        setMessage(data.error ?? "Guest could not be created.");
        return;
      }
      setCreated(data);
      setGuests((current) => {
        const existing = current ?? [];
        return [data.guest, ...existing.filter((guest) => guest.id !== data.guest.id)];
      });
      setName("");
      setExpiresAt(defaultExpiryLocal());
      setSessionHours(8);
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
      setGuests((current) => current?.filter((guest) => guest.id !== id) ?? []);
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
      <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "flex-start", marginBottom: "20px" }}>
        <div>
          <div style={{ fontSize: "0.72rem", letterSpacing: "0.12em", color: "#52647a", fontWeight: 800 }}>
            GUEST MANAGEMENT
          </div>
          <h2 style={{ margin: "5px 0 7px", fontSize: "1.35rem" }}>Private portal guests</h2>
          <p style={{ margin: 0, color: "#52647a", lineHeight: 1.55 }}>
            Create a unique temporary code for each person. Expiry is interpreted in Pacific Time. Revoking a guest invalidates both the code and any active session on their next request.
          </p>
        </div>
        <span style={{ color: "#52647a", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
          {guests?.length ?? 0} guest{guests?.length === 1 ? "" : "s"}
        </span>
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
          <strong>Guest created: {created.guest.name}</strong>
          <div style={{ marginTop: "4px", color: "#52647a", fontSize: "0.86rem" }}>
            This access code is shown once. Copy it now and send it securely.
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "9px", alignItems: "center" }}>
            <code style={{ wordBreak: "break-all", flex: 1, padding: "9px", background: "#fff", border: "1px solid #d5dfeb" }}>{created.code}</code>
            <button type="button" onClick={copyCode} style={{ padding: "9px 13px" }}>Copy</button>
          </div>
        </div>
      ) : null}

      <form onSubmit={createGuest} style={{ marginBottom: "22px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr 0.8fr auto", gap: "10px", alignItems: "end" }}>
          <label>
            <span style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "5px" }}>Guest name</span>
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Guest name"
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #bccadd" }}
            />
          </label>
          <label>
            <span style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "5px" }}>Expires</span>
            <input
              required
              type="datetime-local"
              value={expiresAt}
              onChange={(event) => setExpiresAt(event.target.value)}
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #bccadd" }}
            />
          </label>
          <label>
            <span style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "5px" }}>Session</span>
            <select
              value={sessionHours}
              onChange={(event) => setSessionHours(Number(event.target.value))}
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #bccadd", background: "#fff" }}
            >
              <option value={2}>2 hours</option>
              <option value={8}>8 hours</option>
              <option value={12}>12 hours</option>
              <option value={24}>24 hours</option>
              <option value={72}>3 days</option>
              <option value={168}>7 days</option>
            </select>
          </label>
          <button
            type="submit"
            disabled={busy}
            style={{ padding: "11px 16px", border: 0, background: "#2563eb", color: "#fff", fontWeight: 800, cursor: busy ? "default" : "pointer" }}
          >
            + Add Guest
          </button>
        </div>
      </form>

      {message ? <p style={{ color: message.includes("copied") ? "#52647a" : "#9b1c1c", margin: "0 0 14px" }}>{message}</p> : null}

      {guests?.length ? (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #d5dfeb", color: "#425b7a" }}>
                <th style={{ padding: "9px 8px" }}>Guest name</th>
                <th style={{ padding: "9px 8px" }}>Created</th>
                <th style={{ padding: "9px 8px" }}>Expires</th>
                <th style={{ padding: "9px 8px" }}>Last login</th>
                <th style={{ padding: "9px 8px" }}>Status</th>
                <th style={{ padding: "9px 8px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest) => (
                <tr key={guest.id} style={{ borderBottom: "1px solid #edf1f6" }}>
                  <td style={{ padding: "11px 8px", fontWeight: 700 }}>{guest.name}</td>
                  <td style={{ padding: "11px 8px" }}>{formatPacific(guest.createdAt)}</td>
                  <td style={{ padding: "11px 8px" }}>{formatPacific(guest.expiresAt)}</td>
                  <td style={{ padding: "11px 8px" }}>—</td>
                  <td style={{ padding: "11px 8px" }}><span style={{ display: "inline-block", padding: "3px 9px", borderRadius: "999px", background: "#e8f8ee", color: "#08783d", fontWeight: 800, fontSize: "0.75rem" }}>Active</span></td>
                  <td style={{ padding: "11px 8px" }}>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => revokeGuest(guest.id, guest.name)}
                      style={{ padding: "7px 10px", background: "#fff", border: "1px solid #fecaca", color: "#b42318", fontWeight: 700 }}
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
        <p style={{ color: "#52647a", marginBottom: 0 }}>No guests have been created yet.</p>
      ) : null}
    </section>
  );
}
