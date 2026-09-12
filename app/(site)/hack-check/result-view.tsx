"use client";

import Link from "next/link";
import type { HackCheckEntry } from "@/lib/hack-check-store";
import { ArrowRightIcon, ShieldIcon, TerminalIcon } from "@/components/icons";

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-background/40 px-4 py-2.5">
      <span className="shrink-0 font-mono text-xs uppercase tracking-wider text-muted">
        {label}
      </span>
      <span className="break-all text-right font-mono text-xs text-foreground">
        {value}
      </span>
    </div>
  );
}

export function ResultView({
  entry,
  onReset,
}: {
  entry: HackCheckEntry;
  onReset: () => void;
}) {
  const date = new Date(entry.submittedAt);
  const formatted = date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const verifiedDate = entry.verifiedAt
    ? new Date(entry.verifiedAt).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  const caseRef = `DH-${entry.id.slice(0, 8).toUpperCase()}`;

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 py-16">
      <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-surface/70 p-8 backdrop-blur-md shadow-[0_0_80px_-20px_rgba(53,255,158,0.25)]">
        <span className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        {/* Status badge */}
        <div className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 font-mono text-xs font-semibold tracking-widest uppercase text-primary">
            <ShieldIcon className="size-3.5" />
            Verified — Analysis Complete
          </span>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Scan{" "}
            <span className="text-primary" style={{ textShadow: "0 0 12px rgba(53,255,158,0.6)" }}>
              Complete
            </span>
          </h1>
          <p className="mt-2 font-mono text-sm text-muted">
            Verified · {verifiedDate}
          </p>
        </div>

        {/* Success rate ring */}
        <div className="mb-8 flex justify-center">
          <div className="relative size-28">
            <svg className="-rotate-90 size-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="5" />
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - (entry.successfulRate ?? 0) / 100)}`}
                style={{ filter: "drop-shadow(0 0 5px rgba(53,255,158,0.6))" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-2xl font-bold tabular-nums text-primary">
                {entry.successfulRate ?? 0}%
              </span>
              <span className="font-mono text-[10px] text-muted">success rate</span>
            </div>
          </div>
        </div>

        {/* Core entry details */}
        <div className="mb-4 space-y-2">
          <DataRow label="Case Ref" value={caseRef} />
          <DataRow label="Email" value={entry.email} />
          <DataRow label="Wallet" value={entry.wallet} />
          <DataRow label="Submitted" value={formatted} />
        </div>

        {/* Admin-filled report fields */}
        <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary/70 mb-2">
            <TerminalIcon className="mr-1.5 inline size-3" />
            verification report
          </p>

          <div className="grid grid-cols-2 gap-3">
            {/* Voucher value */}
            <div className="rounded-lg border border-border bg-background/50 px-3 py-2.5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted mb-0.5">Voucher Value</p>
              <p className="font-mono text-sm font-semibold text-primary">{entry.voucherValue ?? "—"}</p>
            </div>

            {/* Processing time */}
            <div className="rounded-lg border border-border bg-background/50 px-3 py-2.5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted mb-0.5">Processing Time</p>
              <p className="font-mono text-sm font-semibold text-foreground">{entry.processingTime ?? "—"}</p>
            </div>

            {/* Expected amount range */}
            <div className="col-span-2 rounded-lg border border-border bg-background/50 px-3 py-2.5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted mb-0.5">Expected Amount Range</p>
              <p className="font-mono text-sm font-semibold text-foreground">
                {entry.amountMin !== null && entry.amountMax !== null
                  ? `$${entry.amountMin.toLocaleString()} – $${entry.amountMax.toLocaleString()}`
                  : "—"}
              </p>
            </div>
          </div>

          {/* Security code */}
          <div className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-primary/70 mb-1">Security Node / Code</p>
            <p className="font-mono text-base font-bold tracking-[0.2em] text-primary" style={{ textShadow: "var(--glow-primary)" }}>
              {entry.securityCode ?? "—"}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onReset}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-surface/50 px-4 py-3 font-mono text-sm text-muted transition-colors hover:border-border-bright hover:text-foreground"
          >
            ← Run another check
          </button>
          <Link
            href="/"
            className="group flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-mono text-sm font-semibold text-background transition-all hover:brightness-110"
          >
            Back to home
            <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
