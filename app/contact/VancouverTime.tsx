"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Vancouver",
  dateStyle: "full",
  timeStyle: "medium",
});

export function VancouverTime() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const initial = window.setTimeout(() => setNow(new Date()), 0);
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <time dateTime={now?.toISOString()} aria-live="off">
      {now ? formatter.format(now) : "Loading local time…"}
    </time>
  );
}
