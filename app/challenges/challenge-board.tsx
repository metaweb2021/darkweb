"use client";

import { useMemo, useState } from "react";
import {
  CHALLENGES,
  CATEGORY_LABELS,
  type Category,
} from "@/lib/data";
import { CategoryBadge, DifficultyBadge } from "@/components/badge";
import { FlagIcon } from "@/components/icons";

type Filter = "all" | Category;

const filters: Filter[] = ["all", "web", "pwn", "crypto", "cloud", "forensics"];

export function ChallengeBoard() {
  const [active, setActive] = useState<Filter>("all");

  const shown = useMemo(
    () =>
      active === "all"
        ? CHALLENGES
        : CHALLENGES.filter((c) => c.category === active),
    [active],
  );

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const on = f === active;
          return (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`rounded-md border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                on
                  ? "border-primary/60 bg-primary/10 text-primary"
                  : "border-border bg-surface/50 text-muted hover:border-border-bright hover:text-foreground"
              }`}
            >
              {f === "all" ? "all" : CATEGORY_LABELS[f]}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((c) => (
          <article
            key={c.slug}
            className="group flex flex-col rounded-xl border border-border bg-surface/60 p-5 transition-all hover:-translate-y-0.5 hover:border-border-bright"
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <CategoryBadge value={c.category} />
                <DifficultyBadge value={c.difficulty} />
              </div>
              <span className="font-mono text-sm font-semibold text-primary">
                {c.points}
              </span>
            </div>

            <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
              {c.title}
            </h3>
            <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">
              {c.blurb}
            </p>

            <div className="mt-5 flex items-center justify-between border-t border-border pt-4 font-mono text-xs text-muted-2">
              <span className="flex items-center gap-1.5">
                <FlagIcon className="size-3.5 text-primary/70" />
                {c.solves} solves
              </span>
              <span>
                first blood{" "}
                <span className="text-cyan">@{c.firstBlood}</span>
              </span>
            </div>
          </article>
        ))}
      </div>

      {shown.length === 0 && (
        <p className="mt-10 text-center font-mono text-sm text-muted">
          no challenges in this category yet — check back after the next drop.
        </p>
      )}
    </div>
  );
}
