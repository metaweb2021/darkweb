import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Panel } from "@/components/panel";
import { CATEGORY_LABELS, type Category } from "@/lib/data";

export const metadata: Metadata = {
  title: "Field Manual",
  description:
    "Rules of engagement, category primers and tooling setup for the DARKHACK range.",
};

const sections = [
  { id: "getting-started", label: "Getting started" },
  { id: "rules", label: "Rules of engagement" },
  { id: "categories", label: "Categories" },
  { id: "scoring", label: "Scoring" },
];

const categoryPrimers: { cat: Category; text: string }[] = [
  { cat: "web", text: "Injection, auth bypass, SSRF, deserialization. Burp is your friend." },
  { cat: "pwn", text: "Memory corruption on Linux binaries. Learn to love GDB + pwntools." },
  { cat: "crypto", text: "Broken primitives and protocol misuse. Bring SageMath." },
  { cat: "cloud", text: "Misconfig, metadata, over-scoped roles. Assume, escalate, exfil." },
  { cat: "forensics", text: "Disk, memory and packet carving. Volatility + Wireshark." },
];

export default function DocsPage() {
  return (
    <>
      <PageHeader
        breadcrumb="~/ field-manual"
        title={
          <>
            The <span className="text-violet text-glow">manual</span>
          </>
        }
        description="Everything you need to go from first login to first flag. Read the rules — they're short, and we enforce them."
      />

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[220px_1fr]">
        {/* Sticky TOC */}
        <aside className="hidden lg:block">
          <nav className="sticky top-24 space-y-1">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-2">
              contents
            </p>
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block rounded px-3 py-1.5 font-mono text-sm text-muted transition-colors hover:bg-surface-2 hover:text-primary"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="max-w-2xl space-y-12">
          <Doc id="getting-started" title="Getting started">
            <p>
              Create a handle, then open any challenge to provision a private
              sandbox. Each box is isolated, disposable, and yours for the
              session — there is nothing real behind it.
            </p>
            <CodeBlock>
              {`# provision & connect
darkhack start sqli-warmup
# → sandbox ready at 10.10.14.7 (ttl 4h)
darkhack submit sqli-warmup DHW{...}`}
            </CodeBlock>
          </Doc>

          <Doc id="rules" title="Rules of engagement">
            <ul className="space-y-2">
              {[
                "Attack only the sandbox assigned to you. Never the platform, other players, or anything off-range.",
                "No flag sharing, no write-up leaks until a challenge retires.",
                "Automated scanning is fine inside your box, banned against shared infra.",
                "Found a platform bug? Report it — there's a bounty, not a ban.",
              ].map((r, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 font-mono text-primary">›</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </Doc>

          <Doc id="categories" title="Categories">
            <div className="space-y-2.5">
              {categoryPrimers.map((c) => (
                <div
                  key={c.cat}
                  className="flex flex-col gap-1 rounded-lg border border-border bg-surface/50 p-4 sm:flex-row sm:items-center sm:gap-4"
                >
                  <span className="w-32 shrink-0 font-mono text-sm text-primary">
                    {CATEGORY_LABELS[c.cat]}
                  </span>
                  <span className="text-sm text-muted">{c.text}</span>
                </div>
              ))}
            </div>
          </Doc>

          <Doc id="scoring" title="Scoring">
            <p>
              Every challenge starts at its listed value and{" "}
              <span className="text-foreground">decays</span> as more players
              solve it — so the board rewards depth and speed, not just volume.
              First blood on a box carries a permanent bonus.
            </p>
            <CodeBlock>
              {`points(solves) = floor(base * (0.6 + 0.4 * min_solves / solves))
first_blood_bonus = +10%`}
            </CodeBlock>
          </Doc>
        </div>
      </section>
    </>
  );
}

function Doc({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted [&_ul]:text-muted">
        {children}
      </div>
    </section>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <Panel className="hair-border">
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-6 text-primary/90">
        <code>{children}</code>
      </pre>
    </Panel>
  );
}
