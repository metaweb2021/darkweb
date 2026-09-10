import { GlowButton } from "@/components/glow-button";
import { MatrixRain } from "@/components/matrix-rain";
import { TerminalWindow } from "@/components/terminal-window";
import { CtaCard } from "@/components/cta-card";
import { SectionHeading } from "@/components/section-heading";
import { StatusTicker } from "@/components/status-ticker";
import { CTAS } from "@/lib/ctas";
import {
  ShieldIcon,
  ZapIcon,
  CpuIcon,
  LockIcon,
  ArrowRightIcon,
  TerminalIcon,
} from "@/components/icons";

const stats = [
  { value: "240+", label: "live challenges" },
  { value: "18k", label: "flags captured" },
  { value: "4", label: "attack categories" },
  { value: "99.9%", label: "sandbox uptime" },
];

const features = [
  {
    Icon: LockIcon,
    title: "100% legal & isolated",
    body: "Every target runs in a throwaway container we own. Nothing you do touches a real system — break things guilt-free.",
  },
  {
    Icon: CpuIcon,
    title: "Real tooling, real tradecraft",
    body: "A pre-loaded attacker box with the standard kit. Practice the same recon-to-exploit workflow you'd use on an engagement.",
  },
  {
    Icon: ShieldIcon,
    title: "Guided, then unguided",
    body: "Ramp from hinted warm-ups to blind boxes. Write-ups unlock after each solve so you actually learn the why.",
  },
  {
    Icon: ZapIcon,
    title: "Decaying points",
    body: "Scores fall as more players solve a box, so first-bloods are worth chasing and the board never goes stale.",
  },
];

export default function Home() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-fade opacity-40">
          <MatrixRain />
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 font-mono text-xs text-muted backdrop-blur">
                <span className="size-1.5 animate-pulse rounded-full bg-primary" />
                CTF season 04 · now live
              </span>

              <h1 className="mt-6 text-balance text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
                Break in.
                <br />
                <span className="text-primary text-glow">Legally.</span>{" "}
                <span className="text-muted-2">Endlessly.</span>
              </h1>

              <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted">
                DARKHACK is a hands-on offensive-security range. Spin up
                disposable targets, run real recon-to-exploit chains, capture
                flags, and climb a live board — all inside sandboxes you own.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <GlowButton href="/challenges">
                  <TerminalIcon className="size-4" />
                  Enter the arena
                </GlowButton>
                <GlowButton href="/docs" variant="outline">
                  Read the field manual
                  <ArrowRightIcon className="size-4" />
                </GlowButton>
              </div>

              <dl className="mt-12 grid max-w-lg grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.label} className="bg-surface/80 px-4 py-3">
                    <dt className="font-mono text-xl font-semibold text-foreground">
                      {s.value}
                    </dt>
                    <dd className="mt-0.5 text-[11px] uppercase tracking-wider text-muted-2">
                      {s.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="animate-float">
              <TerminalWindow />
            </div>
          </div>
        </div>

        <StatusTicker />
      </section>

      {/* ── THE THREE CTAs ───────────────────────────────── */}
      <section className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionHeading
          kicker="// choose your entry point"
          title="Three ways in"
          description="Whether you want to start popping boxes, see where you stand, or read the playbook first — pick a lane and go."
          align="center"
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {CTAS.map((cta) => (
            <CtaCard key={cta.index} {...cta} />
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section className="relative border-t border-border bg-surface/30">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <SectionHeading
            kicker="// 04 — why the range"
            title="A training ground that behaves like the real thing"
            description="Same tools, same workflow, zero blast radius. Learn the craft without ever touching a system you don't own."
          />

          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-xl border border-border bg-surface/50 p-6 transition-colors hover:border-border-bright"
              >
                <div className="flex items-start gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-lg border border-border-bright bg-surface-2 text-primary transition-transform group-hover:scale-110">
                    <f.Icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold tracking-tight text-foreground">
                      {f.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      {f.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ──────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-border">
        <div className="absolute inset-0 opacity-30">
          <MatrixRain />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            // ready when you are
          </p>
          <h2 className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Your first flag is one command away.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-muted">
            Create a handle, drop into a sandbox, and start hunting. No install,
            no risk, no permission needed — the range is yours.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <GlowButton href="/challenges">
              <TerminalIcon className="size-4" />
              Start hacking
            </GlowButton>
            <GlowButton href="/scoreboard" variant="outline">
              See the leaderboard
            </GlowButton>
          </div>
        </div>
      </section>
    </>
  );
}
