"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GlowButton } from "./glow-button";

const links = [
  { href: "/challenges", label: "Challenges" },
  { href: "/scoreboard", label: "Scoreboard" },
  { href: "/docs", label: "Field Manual" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded border border-primary/40 bg-primary/10 font-mono text-primary transition-colors group-hover:box-glow">
            &gt;_
          </span>
          <span className="font-mono text-sm font-semibold tracking-tight">
            <span className="text-foreground">DARK</span>
            <span className="text-primary text-glow">HACK</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded px-3 py-2 font-mono text-sm transition-colors ${
                  active
                    ? "text-primary"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:block">
          <GlowButton href="/challenges" variant="outline" className="!py-2">
            Launch console
          </GlowButton>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="grid size-9 place-items-center rounded border border-border text-muted md:hidden"
        >
          <span className="font-mono text-lg leading-none">
            {open ? "×" : "≡"}
          </span>
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-surface/95 px-4 py-3 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded px-3 py-2.5 font-mono text-sm text-muted hover:bg-surface-2 hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
