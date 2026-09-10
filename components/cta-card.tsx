import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { ArrowRightIcon } from "./icons";

type Accent = "primary" | "cyan" | "violet";

export type Cta = {
  index: string;
  title: string;
  command: string;
  description: string;
  href: string;
  cta: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  accent: Accent;
};

const accentMap: Record<
  Accent,
  { text: string; ring: string; glow: string; chip: string; bar: string }
> = {
  primary: {
    text: "text-primary",
    ring: "group-hover:border-primary/70",
    glow: "group-hover:shadow-[0_0_40px_-12px_rgba(53,255,158,0.55)]",
    chip: "border-primary/40 bg-primary/10 text-primary",
    bar: "bg-primary",
  },
  cyan: {
    text: "text-cyan",
    ring: "group-hover:border-cyan/70",
    glow: "group-hover:shadow-[0_0_40px_-12px_rgba(34,211,238,0.55)]",
    chip: "border-cyan/40 bg-cyan/10 text-cyan",
    bar: "bg-cyan",
  },
  violet: {
    text: "text-violet",
    ring: "group-hover:border-violet/70",
    glow: "group-hover:shadow-[0_0_40px_-12px_rgba(167,139,250,0.55)]",
    chip: "border-violet/40 bg-violet/10 text-violet",
    bar: "bg-violet",
  },
};

export function CtaCard({
  index,
  title,
  command,
  description,
  href,
  cta,
  Icon,
  accent,
}: Cta) {
  const a = accentMap[accent];
  return (
    <Link
      href={href}
      className={`group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface/60 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${a.ring} ${a.glow} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70`}
    >
      {/* top accent bar */}
      <span
        className={`absolute inset-x-0 top-0 h-px w-full scale-x-0 opacity-0 transition-all duration-300 group-hover:scale-x-100 group-hover:opacity-100 ${a.bar}`}
      />

      <div className="mb-6 flex items-start justify-between">
        <span
          className={`grid size-12 place-items-center rounded-lg border ${a.chip} transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon className="size-6" />
        </span>
        <span className="font-mono text-xs text-muted-2">{index}</span>
      </div>

      <h3 className="text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h3>

      <p
        className={`mt-1.5 font-mono text-xs ${a.text}`}
        aria-hidden="true"
      >
        <span className="text-muted-2">$</span> {command}
      </p>

      <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
        {description}
      </p>

      <span
        className={`mt-6 inline-flex items-center gap-1.5 font-mono text-sm font-medium ${a.text}`}
      >
        {cta}
        <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
