"use client";

import { FlagIcon, ArrowRightIcon } from "@/components/icons";

type FormData = {
  email: string;
  voucherCode: string;
  generatedCode: string;
  loaderCode: string;
};

export function HackDoneResultView({
  data,
  onReset,
}: {
  data: FormData;
  onReset: () => void;
}) {
  const timestamp = new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      {/* Top Banner */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-violet-500/40 bg-gradient-to-b from-violet-500/10 via-surface/80 to-surface p-8 shadow-[0_0_80px_-20px_rgba(139,92,246,0.3)] backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid size-12 place-items-center rounded-xl border border-violet-500/50 bg-violet-500/20 text-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.4)]">
              <FlagIcon className="size-6" />
            </span>
            <div>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-violet-400">
                <span className="size-2 animate-pulse rounded-full bg-violet-400" />
                Session Finalized · Confirmation Queued
              </span>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Hack Session{" "}
                <span className="text-violet-400" style={{ textShadow: "0 0 20px rgba(139,92,246,0.5)" }}>
                  Completed
                </span>
              </h1>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface-2/80 px-4 py-2 font-mono text-xs text-muted-2">
            <div>Timestamp</div>
            <div className="text-foreground font-semibold">{timestamp}</div>
          </div>
        </div>
      </div>

      {/* Email notification notice */}
      <div className="mb-8 rounded-2xl border border-violet-500/30 bg-violet-500/[0.06] p-6">
        <div className="flex items-start gap-4">
          <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg border border-violet-500/30 bg-violet-500/10 text-violet-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-5">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </span>
          <div>
            <p className="font-semibold text-foreground">Confirmation email on its way</p>
            <p className="mt-1 text-sm text-muted leading-relaxed">
              A confirmation of your finalized hack session has been dispatched to{" "}
              <span className="font-mono font-semibold text-violet-400">{data.email}</span>. Please check your inbox and
              spam folder — it should arrive within a few minutes.
            </p>
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface/60 p-5 backdrop-blur">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-2">Email Address</p>
          <p className="mt-2 font-mono text-sm font-semibold text-foreground truncate">{data.email}</p>
        </div>

        <div className="rounded-xl border border-border bg-surface/60 p-5 backdrop-blur">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-2">Voucher Code</p>
          <p className="mt-2 font-mono text-sm font-bold text-violet-400 tracking-wider">{data.voucherCode}</p>
        </div>

        <div className="rounded-xl border border-border bg-surface/60 p-5 backdrop-blur">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-2">Generated Code</p>
          <p className="mt-2 font-mono text-sm font-bold text-foreground tracking-wider">{data.generatedCode}</p>
        </div>

        <div className="rounded-xl border border-border bg-surface/60 p-5 backdrop-blur">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-2">Loader Code</p>
          <p className="mt-2 font-mono text-sm font-bold text-foreground tracking-widest uppercase">{data.loaderCode}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-3 font-mono text-sm font-semibold text-white transition-all hover:brightness-110"
        >
          Submit another session
          <ArrowRightIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}
