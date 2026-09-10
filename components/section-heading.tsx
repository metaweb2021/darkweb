import type { ReactNode } from "react";

type SectionHeadingProps = {
  /** Small kicker above the title, e.g. "// 02 — modules". */
  kicker?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
};

export function SectionHeading({
  kicker,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-2xl text-center"
          : "max-w-2xl text-left"
      }
    >
      {kicker && (
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-primary">
          {kicker}
        </p>
      )}
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted">
          {description}
        </p>
      )}
    </div>
  );
}
