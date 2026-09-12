"use client";

import { useState } from "react";
import { FlagIcon } from "@/components/icons";

type FormData = {
  email: string;
  voucherCode: string;
  generatedCode: string;
  loaderCode: string;
};

export function HackDoneForm({ onSuccess }: { onSuccess: (data: FormData) => void }) {
  const [email, setEmail] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [loaderCode, setLoaderCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !voucherCode.trim() || !generatedCode.trim() || !loaderCode.trim()) {
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
      generatedCode: generatedCode.trim().toUpperCase(),
      loaderCode: loaderCode.trim().toUpperCase(),
    });
  };

  return (
    <form onSubmit={handleSubmit} id="hack-done-form" className="mx-auto mt-10 w-full max-w-lg">
      <div className="relative rounded-2xl border border-border bg-surface/70 p-8 backdrop-blur-md shadow-[0_0_60px_-20px_rgba(139,92,246,0.18)]">
        <span className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />

        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-lg border border-violet-500/40 bg-violet-500/10 text-violet-400">
            <FlagIcon className="size-5" />
          </span>
          <div>
            <p className="font-mono text-xs text-muted">$ darkhack done --finalize</p>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Hack Done · Finalize Session</h2>
          </div>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label htmlFor="hd-email" className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-muted">
            Email Address
          </label>
          <input
            id="hd-email"
            type="email"
            required
            autoComplete="email"
            placeholder="operator@darkhack.io"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-2 transition-colors focus:border-violet-500/60 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

        {/* Voucher Code */}
        <div className="mb-5">
          <label htmlFor="hd-voucher" className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-muted">
            Voucher Code
          </label>
          <input
            id="hd-voucher"
            type="text"
            required
            autoComplete="off"
            placeholder="VCH-XXXX-X"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 font-mono text-sm uppercase text-foreground placeholder:text-muted-2 transition-colors focus:border-violet-500/60 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

        {/* Generated Code */}
        <div className="mb-5">
          <label htmlFor="hd-gen" className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-muted">
            Generated Code
          </label>
          <input
            id="hd-gen"
            type="text"
            required
            autoComplete="off"
            placeholder="GEN-XXXX-XXXX"
            value={generatedCode}
            onChange={(e) => setGeneratedCode(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 font-mono text-sm uppercase text-foreground placeholder:text-muted-2 transition-colors focus:border-violet-500/60 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

        {/* Loader Code */}
        <div className="mb-8">
          <label htmlFor="hd-loader" className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-muted">
            Loader Code
          </label>
          <input
            id="hd-loader"
            type="text"
            required
            autoComplete="off"
            placeholder="LDR-XXXX-XXXX"
            value={loaderCode}
            onChange={(e) => setLoaderCode(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 font-mono text-sm uppercase text-foreground placeholder:text-muted-2 transition-colors focus:border-violet-500/60 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
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
          id="hd-submit"
          className="group relative w-full overflow-hidden rounded-lg bg-violet-600 px-5 py-3.5 font-mono text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/70"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <span className="relative">Finalize Hack Session →</span>
        </button>

        <p className="mt-5 text-center font-mono text-[11px] text-muted-2">
          Secure session finalization · Results dispatched to your email
        </p>
      </div>
    </form>
  );
}
