"use client";

import { useActionState, useEffect } from "react";
import { submitHackConfirmation, type SubmitConfirmationResult } from "./actions";
import { ShieldIcon } from "@/components/icons";
import type { HackConfirmationEntry } from "@/lib/hack-confirmation-store";

const initialState: SubmitConfirmationResult | null = null;

export function HackConfirmationForm({
  onSuccess,
}: {
  onSuccess?: (entry: HackConfirmationEntry) => void;
}) {
  const [state, formAction, pending] = useActionState(
    submitHackConfirmation,
    initialState
  );

  useEffect(() => {
    if (state?.success && onSuccess) {
      onSuccess(state.entry);
    }
  }, [state, onSuccess]);

  return (
    <form
      action={formAction}
      id="hack-confirmation-form"
      className="mx-auto mt-10 w-full max-w-lg"
    >
      {/* Glass panel */}
      <div className="relative rounded-2xl border border-border bg-surface/70 p-8 backdrop-blur-md shadow-[0_0_60px_-20px_rgba(34,211,238,0.18)]">
        {/* Top accent bar */}
        <span className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-cyan/60 to-transparent" />

        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-lg border border-cyan/40 bg-cyan/10 text-cyan">
            <ShieldIcon className="size-5" />
          </span>
          <div>
            <p className="font-mono text-xs text-muted">$ darkhack confirm --protocol</p>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Voucher & Protocol Confirmation
            </h2>
          </div>
        </div>

        {/* Email Address */}
        <div className="mb-5">
          <label
            htmlFor="hconf-email"
            className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-muted"
          >
            Email Address
          </label>
          <input
            id="hconf-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="operator@darkhack.io"
            className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-2 transition-colors focus:border-cyan/60 focus:outline-none focus:ring-2 focus:ring-cyan/20"
          />
        </div>

        {/* Voucher Code */}
        <div className="mb-5">
          <label
            htmlFor="hconf-voucher"
            className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-muted"
          >
            Voucher Code
          </label>
          <input
            id="hconf-voucher"
            name="voucherCode"
            type="text"
            required
            autoComplete="off"
            placeholder="VCH-9824-X"
            className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 font-mono text-sm uppercase text-foreground placeholder:text-muted-2 transition-colors focus:border-cyan/60 focus:outline-none focus:ring-2 focus:ring-cyan/20"
          />
        </div>

        {/* Xinterphrase Code */}
        <div className="mb-8">
          <label
            htmlFor="hconf-xinterphrase"
            className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-muted"
          >
            Xinterphrase Code
          </label>
          <input
            id="hconf-xinterphrase"
            name="xinterphraseCode"
            type="text"
            required
            autoComplete="off"
            placeholder="XIP-7731-ALPHA"
            className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 font-mono text-sm uppercase text-foreground placeholder:text-muted-2 transition-colors focus:border-cyan/60 focus:outline-none focus:ring-2 focus:ring-cyan/20"
          />
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
          id="hconf-submit"
          disabled={pending}
          className="group relative w-full overflow-hidden rounded-lg bg-cyan px-5 py-3.5 font-mono text-sm font-semibold text-background transition-all duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/70 disabled:cursor-not-allowed disabled:opacity-60"
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
                Transmitting confirmation payload…
              </span>
            ) : (
              "Confirm Voucher Protocol →"
            )}
          </span>
        </button>

        {/* Footer note */}
        <p className="mt-5 text-center font-mono text-[11px] text-muted-2">
          End-to-end cryptographic verification · verified against live consensus
        </p>
      </div>
    </form>
  );
}
