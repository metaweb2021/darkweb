import { MatrixRain } from "@/components/matrix-rain";
import { CtaCard } from "@/components/cta-card";
import { CTAS } from "@/lib/ctas";

export default function Home() {
  return (
    <section className="relative flex min-h-[calc(100vh-20rem)] items-center overflow-hidden">
      <div className="absolute inset-0 grid-fade opacity-40">
        <MatrixRain />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 font-mono text-xs text-muted backdrop-blur">
            <span className="size-1.5 animate-pulse rounded-full bg-primary" />
            Threat intelligence feed · live
          </span>
          <h1 className="mt-6 text-balance text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            Scan. Confirm.{" "}
            <span className="text-primary text-glow">Secure.</span>
          </h1>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted">
            Real-time dark web recon, threat verification, and asset protection.
          </p>
        </div>

        {/* The three — and only three — CTAs */}
        <div className="mx-auto mt-14 grid max-w-6xl gap-4 md:grid-cols-4">
          {CTAS.map((cta) => (
            <CtaCard key={cta.index} {...cta} />
          ))}
        </div>
      </div>
    </section>
  );
}
