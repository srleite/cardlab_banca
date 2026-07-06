"use client";

import { useEffect, useState } from "react";
import { timeUntil } from "@/lib/format";

export function Countdown({
  endsAt,
  className,
}: {
  endsAt: string;
  className?: string;
}) {
  const [info, setInfo] = useState(() => timeUntil(endsAt));

  useEffect(() => {
    const interval = setInterval(() => setInfo(timeUntil(endsAt)), 60_000);
    return () => clearInterval(interval);
  }, [endsAt]);

  return (
    <span
      className={className ? `tabular-nums ${className}` : "tabular-nums"}
      style={{
        color: info.isEnded
          ? "var(--text-dim)"
          : info.isUrgent
            ? "#fca5a5"
            : "var(--text-muted)",
        fontWeight: info.isUrgent ? 500 : 400,
      }}
      aria-label={`Encerra em ${info.text}`}
    >
      {info.isEnded ? "encerrado" : `⏱ ${info.text}`}
    </span>
  );
}
