"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type FiveMinuteVisitor = {
  city: string;
  country: string;
  device: string;
  activeUsers: number;
};

export function FiveMinuteRealtime({
  activeUsers,
  visitors,
}: {
  activeUsers: number;
  visitors: FiveMinuteVisitor[];
}) {
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const analyticsGrid = document.querySelector<HTMLElement>(".analytics-grid");
    const thirtyMinuteCard = analyticsGrid?.querySelector<HTMLElement>(".analytics-card-wide");
    if (!analyticsGrid || !thirtyMinuteCard) return;

    let mount = analyticsGrid.querySelector<HTMLElement>("#five-minute-realtime-slot");
    if (!mount) {
      mount = document.createElement("div");
      mount.id = "five-minute-realtime-slot";
      mount.className = "five-minute-realtime-slot";
      thirtyMinuteCard.insertAdjacentElement("afterend", mount);
    }
    setTarget(mount);

    return () => {
      setTarget(null);
      mount?.remove();
    };
  }, []);

  const card = (
    <section className="analytics-card analytics-card-wide five-minute-realtime">
      <div className="analytics-card-heading">
        <div>
          <p className="analytics-label">Last 5 minutes</p>
          <h2>Immediate Realtime Activity</h2>
        </div>
        <span>{activeUsers} active</span>
      </div>
      <p className="realtime-note">
        Fast confirmation of very recent GA4 activity. City and country are approximate network/IP-derived locations and may differ from the visitor&apos;s physical location.
      </p>
      {visitors.length ? (
        <ol className="top-pages-list">
          {visitors.map((visitor, index) => (
            <li key={`${visitor.city}-${visitor.country}-${visitor.device}-${index}`}>
              <div>
                <strong>{visitor.city}, {visitor.country}</strong>
                <span>{visitor.device}</span>
              </div>
              <div className="page-result">
                <strong>{visitor.activeUsers}</strong>
                <small>active</small>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="analytics-empty">No active users reported in the last 5 minutes when this snapshot was generated.</p>
      )}
      <style>{`
        .five-minute-realtime-slot{grid-column:1/-1}
        .five-minute-realtime{margin-top:0;border-top:3px solid var(--blue)}
        .five-minute-realtime h2{max-width:none;font-size:clamp(1rem,1.5vw,1.25rem);line-height:1.25}
        .realtime-note{margin:.75rem 0 0;color:#526b89;font-size:.85rem;line-height:1.65}
      `}</style>
    </section>
  );

  return target ? createPortal(card, target) : null;
}
