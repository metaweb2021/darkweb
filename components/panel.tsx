import type { ReactNode } from "react";

type PanelProps = {
  children: ReactNode;
  className?: string;
  /** Small mono label rendered in the top chrome bar. */
  title?: string;
  /** Show the three "traffic light" dots in the chrome bar. */
  chrome?: boolean;
};

/**
 * A dark glass console panel with an optional terminal-style chrome bar.
 * The workhorse container used across the site.
 */
export function Panel({
  children,
  className = "",
  title,
  chrome = false,
}: PanelProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-border bg-surface/70 backdrop-blur-sm ${className}`}
    >
      {(chrome || title) && (
        <div className="flex items-center gap-2 border-b border-border bg-surface-2/80 px-4 py-2.5">
          {chrome && (
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-danger/70" />
              <span className="size-2.5 rounded-full bg-amber/70" />
              <span className="size-2.5 rounded-full bg-primary/70" />
            </div>
          )}
          {title && (
            <span className="ml-1 font-mono text-xs text-muted">{title}</span>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
