"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { submitHackCheck, type SubmitResult } from "./actions";
import { TerminalIcon } from "@/components/icons";

import type { HackCheckEntry } from "@/lib/hack-check-store";

const WALLETS = [
  "MetaMask",
  "Blockchain",
  "Binance",
  "BitPay",
  "Coinbase",
  "Bybit",
  "Luno",
  "Phantom",
  "Coinbase Wallet",
  "Trust Wallet",
  "Ledger Live",
  "Trezor Suite",
  "Exodus",
  "Atomic Wallet",
  "Electrum",
  "Mycelium",
];

const initialState: SubmitResult | null = null;

export function HackCheckForm({
  onSuccess,
}: {
  onSuccess?: (entry: HackCheckEntry, isNew: boolean) => void;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    submitHackCheck,
    initialState
  );

  // Once we get a successful result, pass data directly to next step
  useEffect(() => {
    if (state?.success) {
      if (onSuccess) {
        onSuccess(state.entry, state.isNew);
      } else {
        router.push("/hack-check/processing");
      }
    }
  }, [state, onSuccess, router]);

  return (
    <form
      action={formAction}
      id="hack-check-form"
      className="mx-auto mt-10 w-full max-w-lg"
    >
      {/* Glass panel */}
      <div className="relative rounded-2xl border border-border bg-surface/70 p-8 backdrop-blur-md shadow-[0_0_60px_-20px_rgba(53,255,158,0.18)]">
        {/* Top accent bar */}
        <span className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-lg border border-primary/40 bg-primary/10 text-primary">
            <TerminalIcon className="size-5" />
          </span>
          <div>
            <p className="font-mono text-xs text-muted">$ darkhack check --range</p>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Wallet Threat Analysis
            </h2>
          </div>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label
            htmlFor="hc-email"
            className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-muted"
          >
            Email Address
          </label>
          <input
            id="hc-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="operator@darkhack.io"
            className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-2 transition-colors focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Wallet */}
        <div className="mb-8">
          <label
            htmlFor="hc-wallet"
            className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-muted"
          >
            Crypto Wallet
          </label>
          <div className="relative">
            <select
              id="hc-wallet"
              name="wallet"
              required
              defaultValue=""
              className="w-full appearance-none rounded-lg border border-border bg-surface-2 px-4 py-3 font-mono text-sm text-foreground transition-colors focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="" disabled className="text-muted-2">
                — select your wallet —
              </option>
              {WALLETS.map((w) => (
                <option key={w} value={w} className="bg-surface-2 text-foreground">
                  {w}
                </option>
              ))}
            </select>
            {/* Custom chevron */}
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted-2">
              <svg viewBox="0 0 16 16" fill="currentColor" className="size-4">
                <path d="M4.5 6l3.5 3.5L11.5 6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>

        {/* Error */}
        {state && !state.success && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 font-mono text-sm text-danger"
          >
            <span className="mr-2 text-danger/70">[ERR]</span>
            {state.error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          id="hc-submit"
          disabled={pending}
          className="group relative w-full overflow-hidden rounded-lg bg-primary px-5 py-3.5 font-mono text-sm font-semibold text-background transition-all duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {/* shimmer */}
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <span className="relative">
            {pending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeOpacity=".25" />
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
                Initiating scan…
              </span>
            ) : (
              "Run Hack Check →"
            )}
          </span>
        </button>

        {/* Footer note */}
        <p className="mt-5 text-center font-mono text-[11px] text-muted-2">
          Analysis is sandboxed · no funds are at risk · results in ~60s
        </p>
      </div>
    </form>
  );
}
