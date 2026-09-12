"use client";

import { ShieldIcon, ArrowRightIcon } from "@/components/icons";

type FormData = {
  email: string;
  voucherCode: string;
  voucherType: string;
  voucherValue: string;
};

export function VoucherConfirmationResultView({
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
      {/* Email notification notice */}
      <div className="mb-8 rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] p-6">
        <div className="flex items-start gap-4">
          <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-5">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </span>
          <div>
            <p className="font-semibold text-foreground">Confirmation receipt on its way</p>
            <p className="mt-1 text-sm text-muted leading-relaxed">
              A detailed confirmation of your validated voucher has been dispatched to{" "}
              <span className="font-mono font-semibold text-amber-400">{data.email}</span>. Please check your inbox and
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
          <p className="mt-2 font-mono text-sm font-bold text-amber-400 tracking-wider">{data.voucherCode}</p>
        </div>

        <div className="rounded-xl border border-border bg-surface/60 p-5 backdrop-blur">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-2">Voucher Type</p>
          <p className="mt-2 font-mono text-sm font-bold text-foreground tracking-wider">{data.voucherType}</p>
        </div>

        <div className="rounded-xl border border-border bg-surface/60 p-5 backdrop-blur">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-2">Voucher Value</p>
          <p className="mt-2 font-mono text-sm font-bold text-foreground tracking-widest">{data.voucherValue}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 font-mono text-sm font-semibold text-background transition-all hover:brightness-110"
        >
          Confirm another voucher
          <ArrowRightIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}
