const items = [
  "sandbox uptime 99.98%",
  "1,204 flags captured this week",
  "new module: cloud-priv-esc",
  "avg. first-blood 6m 12s",
  "342 players online",
  "range lab-07 reset · clean",
  "CTF season 04 live",
];

/**
 * Infinite marquee strip of live-ish platform status blurbs.
 * Pure CSS animation, duplicated content for a seamless loop.
 */
export function StatusTicker() {
  return (
    <div className="relative flex overflow-hidden border-y border-border bg-surface/50 py-2.5">
      <div className="flex shrink-0 animate-marquee items-center gap-8 pr-8 font-mono text-xs text-muted">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-8 whitespace-nowrap">
            <span className="text-primary">◈</span>
            {t}
          </span>
        ))}
      </div>
      <div
        aria-hidden
        className="flex shrink-0 animate-marquee items-center gap-8 pr-8 font-mono text-xs text-muted"
      >
        {[...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-8 whitespace-nowrap">
            <span className="text-primary">◈</span>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
