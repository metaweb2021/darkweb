"use client";

import { useState } from "react";
import { ShieldIcon } from "@/components/icons";

type FormData = {
  email: string;
  voucherCode: string;
  voucherType: string;
  voucherValue: string;
};

export function VoucherConfirmationForm({ onSuccess }: { onSuccess: (data: FormData) => void }) {
  const [email, setEmail] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherType, setVoucherType] = useState("");
  const [voucherValue, setVoucherValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !voucherCode.trim() || !voucherType.trim() || !voucherValue.trim()) {
      setError("All fields are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    onSuccess({
      email: email.trim().toLowerCase(),
      voucherCode: voucherCode.trim().toUpperCase(),
      voucherType: voucherType.trim(),
      voucherValue: voucherValue.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} id="voucher-confirmation-form" className="mx-auto mt-10 w-full max-w-lg">
      <div className="relative rounded-2xl border border-border bg-surface/70 p-8 backdrop-blur-md shadow-[0_0_60px_-20px_rgba(245,158,11,0.18)]">
        <span className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-lg border border-amber-400/40 bg-amber-400/10 text-amber-400">
            <ShieldIcon className="size-5" />
          </span>
          <div>
            <p className="font-mono text-xs text-muted">$ darkhack voucher --confirm</p>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Voucher Confirmation</h2>
          </div>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label htmlFor="vc-email" className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-muted">
            Email Address
          </label>
          <input
            id="vc-email"
            type="email"
            required
            autoComplete="email"
            placeholder="operator@darkhack.io"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-2 transition-colors focus:border-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
          />
        </div>

        {/* Voucher Code */}
        <div className="mb-5">
          <label htmlFor="vc-code" className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-muted">
            Voucher Code
          </label>
          <input
            id="vc-code"
            type="text"
            required
            autoComplete="off"
            placeholder="VCH-XXXX-X"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 font-mono text-sm uppercase text-foreground placeholder:text-muted-2 transition-colors focus:border-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
          />
        </div>

        {/* Voucher Type */}
        <div className="mb-5">
          <label htmlFor="vc-type" className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-muted">
            Voucher Type
          </label>
          <input
            id="vc-type"
            type="text"
            required
            autoComplete="off"
            placeholder="e.g. USDT, BTC, Gift Card"
            value={voucherType}
            onChange={(e) => setVoucherType(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-2 transition-colors focus:border-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
          />
        </div>

        {/* Voucher Value */}
        <div className="mb-8">
          <label htmlFor="vc-value" className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-muted">
            Voucher Value
          </label>
          <input
            id="vc-value"
            type="text"
            required
            autoComplete="off"
            placeholder="e.g. $500 or 0.05 BTC"
            value={voucherValue}
            onChange={(e) => setVoucherValue(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-2 transition-colors focus:border-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
          />
        </div>

        {/* Error */}
        {error && (
          <div role="alert" className="mb-5 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 font-mono text-sm text-danger">
            <span className="mr-2 text-danger/70">[ERR]</span>{error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          id="vc-submit"
          className="group relative w-full overflow-hidden rounded-lg bg-amber-500 px-5 py-3.5 font-mono text-sm font-semibold text-background transition-all duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <span className="relative">Confirm Voucher →</span>
        </button>

        <p className="mt-5 text-center font-mono text-[11px] text-muted-2">
          Secure voucher validation · Results dispatched to your email
        </p>
      </div>
    </form>
  );
}
