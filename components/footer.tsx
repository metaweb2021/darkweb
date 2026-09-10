import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <span className="font-mono text-sm font-semibold">
              <span className="text-foreground">DARK</span>
              <span className="text-primary">HACK</span>
            </span>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              A safe, legal training range for offensive security. Every target
              is a disposable sandbox we own. No real systems, ever.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <FooterCol
              title="Platform"
              items={[
                { href: "/challenges", label: "Challenges" },
                { href: "/scoreboard", label: "Scoreboard" },
                { href: "/docs", label: "Field Manual" },
              ]}
            />
            <FooterCol
              title="Learn"
              items={[
                { href: "/docs", label: "Getting started" },
                { href: "/docs", label: "Rules of engagement" },
                { href: "/docs", label: "Categories" },
              ]}
            />
            <FooterCol
              title="Community"
              items={[
                { href: "/scoreboard", label: "Leaderboard" },
                { href: "/challenges", label: "New drops" },
                { href: "/docs", label: "Code of conduct" },
              ]}
            />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 font-mono text-xs text-muted-2 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} DARKHACK — training use only.</span>
          <span className="flex items-center gap-2">
            <span className="size-2 animate-pulse rounded-full bg-primary" />
            all systems operational
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-2">
        {title}
      </p>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i}>
            <Link
              href={it.href}
              className="text-sm text-muted transition-colors hover:text-primary"
            >
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
