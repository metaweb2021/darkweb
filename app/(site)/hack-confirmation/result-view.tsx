"use client";

import type { HackConfirmationEntry } from "@/lib/hack-confirmation-store";
import { ShieldIcon, ArrowRightIcon } from "@/components/icons";

export function ConfirmationResultView({
  entry,
  onReset,
}: {
  entry: HackConfirmationEntry;
  onReset: () => void;
}) {
  const verifiedDate = entry.verifiedAt
    ? new Date(entry.verifiedAt).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      {/* Top Banner */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-cyan/40 bg-gradient-to-b from-cyan/10 via-surface/80 to-surface p-8 shadow-[0_0_80px_-20px_rgba(34,211,238,0.3)] backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid size-12 place-items-center rounded-xl border border-cyan/50 bg-cyan/20 text-cyan shadow-[0_0_20px_rgba(34,211,238,0.4)]">
              <ShieldIcon className="size-6" />
            </span>
            <div>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-cyan">
                <span className="size-2 animate-pulse rounded-full bg-cyan" />
                Audit Passed · Consensus Reached
              </span>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Protocol Verification <span className="text-cyan text-glow">Confirmed</span>
              </h1>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface-2/80 px-4 py-2 font-mono text-xs text-muted-2">
            <div>Audit Timestamp</div>
            <div className="text-foreground font-semibold">{verifiedDate}</div>
          </div>
        </div>
      </div>

      {/* Main Parameters Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Email */}
        <div className="rounded-xl border border-border bg-surface/60 p-6 backdrop-blur">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-2">Operator Email</p>
          <p className="mt-2 font-mono text-base font-semibold text-foreground truncate">{entry.email}</p>
        </div>

        {/* Voucher Code */}
        <div className="rounded-xl border border-border bg-surface/60 p-6 backdrop-blur">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-2">Voucher Code</p>
          <p className="mt-2 font-mono text-base font-bold text-cyan tracking-wider">{entry.voucherCode}</p>
        </div>

        {/* Xinterphrase Code */}
        <div className="rounded-xl border border-border bg-surface/60 p-6 backdrop-blur">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-2">Xinterphrase Key</p>
          <p className="mt-2 font-mono text-base font-bold text-foreground tracking-wider">{entry.xinterphraseCode}</p>
        </div>

        {/* Confirmation Hash */}
        <div className="rounded-xl border border-cyan/30 bg-surface/60 p-6 backdrop-blur sm:col-span-2">
          <p className="font-mono text-xs uppercase tracking-wider text-cyan">Cryptographic Audit Signature</p>
          <p className="mt-2 font-mono text-sm font-semibold text-foreground break-all">
            {entry.confirmationHash || "0x98f4e2a7b1c3d5e67890abcdef1234567890abcdef"}
          </p>
        </div>

        {/* Security Protocol */}
        <div className="rounded-xl border border-border bg-surface/60 p-6 backdrop-blur">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-2">Protocol Standard</p>
          <p className="mt-2 font-mono text-sm font-semibold text-foreground">
            {entry.securityProtocol || "SHA256-XIP // ZERO-KNOWLEDGE"}
          </p>
        </div>

        {/* Percentage Level */}
        {entry.percentageLevel !== null && (
          <div className="rounded-xl border border-cyan/30 bg-surface/60 p-6 backdrop-blur">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-2">Percentage Level</p>
            <div className="mt-3">
              <div className="flex items-end justify-between mb-1.5">
                <span className="font-mono text-2xl font-bold text-cyan">{entry.percentageLevel}%</span>
              </div>
              <div className="h-2 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-cyan transition-all duration-500"
                  style={{ width: `${entry.percentageLevel}%`, boxShadow: "0 0 8px rgba(34,211,238,0.6)" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Amount to Receive */}
        {entry.amountToReceive !== null && (
          <div className="rounded-xl border border-cyan/30 bg-surface/60 p-6 backdrop-blur">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-2">Amount to Receive</p>
            <p className="mt-2 font-mono text-2xl font-bold text-cyan">
              ${entry.amountToReceive.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        )}

        {/* Security Level */}
        {entry.securityLevel !== null && (
          <div className="rounded-xl border border-border bg-surface/60 p-6 backdrop-blur">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-2">Security Level</p>
            <div className="mt-3 flex items-center gap-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <span
                  key={i}
                  className={`h-4 w-2 rounded-sm transition-colors ${
                    i < (entry.securityLevel ?? 0) ? "bg-cyan shadow-[0_0_6px_rgba(34,211,238,0.5)]" : "bg-border"
                  }`}
                />
              ))}
              <span className="ml-1 font-mono text-sm font-bold text-cyan">{entry.securityLevel}/10</span>
            </div>
          </div>
        )}

        {/* Wallet Account */}
        {entry.walletAccount && (
          <div className="rounded-xl border border-border bg-surface/60 p-6 backdrop-blur sm:col-span-2">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-2">Wallet Account</p>
            <p className="mt-2 font-mono text-sm font-semibold text-foreground break-all">{entry.walletAccount}</p>
          </div>
        )}

        {/* Loader Code */}
        {entry.loaderCode && (
          <div className="rounded-xl border border-border bg-surface/60 p-6 backdrop-blur">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-2">Loader Code</p>
            <p className="mt-2 font-mono text-base font-bold text-foreground tracking-widest uppercase">{entry.loaderCode}</p>
          </div>
        )}
      </div>

      {/* Remarks if present */}
      {entry.remarks && (
        <div className="mt-6 rounded-xl border border-border bg-surface/40 p-6 backdrop-blur">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-2">Admin Remarks</p>
          <p className="mt-2 font-mono text-sm text-foreground leading-relaxed">{entry.remarks}</p>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-lg bg-cyan px-6 py-3 font-mono text-sm font-semibold text-background transition-all hover:brightness-110"
        >
          Confirm another voucher
          <ArrowRightIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}
