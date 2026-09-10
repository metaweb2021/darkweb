import type { Difficulty, Category } from "@/lib/data";

const difficultyStyle: Record<Difficulty, string> = {
  easy: "border-primary/40 bg-primary/10 text-primary",
  medium: "border-cyan/40 bg-cyan/10 text-cyan",
  hard: "border-amber/40 bg-amber/10 text-amber",
  insane: "border-danger/40 bg-danger/10 text-danger",
};

const categoryStyle: Record<Category, string> = {
  web: "border-cyan/30 bg-cyan/5 text-cyan",
  pwn: "border-danger/30 bg-danger/5 text-danger",
  crypto: "border-violet/30 bg-violet/5 text-violet",
  cloud: "border-primary/30 bg-primary/5 text-primary",
  forensics: "border-amber/30 bg-amber/5 text-amber",
};

const chip =
  "inline-flex items-center rounded border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider";

export function DifficultyBadge({ value }: { value: Difficulty }) {
  return <span className={`${chip} ${difficultyStyle[value]}`}>{value}</span>;
}

export function CategoryBadge({ value }: { value: Category }) {
  return <span className={`${chip} ${categoryStyle[value]}`}>{value}</span>;
}
