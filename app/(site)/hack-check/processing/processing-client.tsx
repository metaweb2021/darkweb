"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

// Steps shown while verification is pending
const STEPS_PENDING = [
  "Verification data received",
  "Validating account information…",
  "Scanning wallet threat profile…",
  "Awaiting security team authorization…",
  "Redirecting to scan results…",
];

// Steps shown when a returning verified account is detected
const STEPS_VERIFIED = [
  "Verification data received",
  "Validating account information…",
  "Verified record confirmed",
  "Restoring account access…",
  "Redirecting to scan results…",
];

export default function ProcessingPageClient() {
  const router = useRouter();

  const [elapsed, setElapsed] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(1);
  const [entryEmail, setEntryEmail] = useState<string | null>(null);
  const [entryWallet, setEntryWallet] = useState<string | null>(null);
  const hasRedirected = useRef(false);

  const STEPS = isVerified ? STEPS_VERIFIED : STEPS_PENDING;

  // ─── 1. Elapsed Timer (runs till infinity while pending) ────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ─── 2. Step Progression while pending ──────────────────────────────────────
  useEffect(() => {
    if (isVerified) return;

    if (elapsed >= 1 && completedSteps < 1) {
      setCompletedSteps(1);
    } else if (elapsed >= 3 && completedSteps < 2) {
      setCompletedSteps(2);
    } else if (elapsed >= 6 && completedSteps < 3) {
      setCompletedSteps(3);
    }
    // Cap at step 3 while pending so it remains active indefinitely
  }, [elapsed, isVerified, completedSteps]);

  // ─── 3. Polling Request via POST under the hood ─────────────────────────────
  useEffect(() => {
    let isMounted = true;
    let pollInterval: NodeJS.Timeout | null = null;

    const checkStatus = async () => {
      if (hasRedirected.current) return;

      try {
        const res = await fetch("/api/hack-check/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!res.ok) {
          if (res.status === 404 && isMounted) {
            router.replace("/hack-check");
          }
          return;
        }

        const data = await res.json();
        if (!isMounted) return;

        if (data.email) setEntryEmail(data.email);
        if (data.wallet) setEntryWallet(data.wallet);

        if (data.found && data.isVerified) {
          setIsVerified(true);
          setCompletedSteps(STEPS.length);

          if (!hasRedirected.current) {
            hasRedirected.current = true;
            if (pollInterval) clearInterval(pollInterval);

            // Brief visual pause so the user sees all green checkmarks before redirecting
            setTimeout(() => {
              // Redirect under the hood without ID in the URL bar
              router.push("/hack-check/result");
            }, 1000);
          }
        }
      } catch {
        // Continue polling on next cycle
      }
    };

    // Immediate check on mount
    checkStatus();

    // Poll every 2.5 seconds until verified
    pollInterval = setInterval(() => {
      if (!isVerified && !hasRedirected.current) {
        checkStatus();
      }
    }, 2500);

    return () => {
      isMounted = false;
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [router, isVerified, STEPS.length]);

  // ─── Formatting Timer & Progress Ring ───────────────────────────────────────
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  // Progress ring completes one full 60-second cycle
  const ringPct = isVerified ? 100 : Math.min(((elapsed % 60) / 60) * 100, 100);

  // SVG circle constants
  const RADIUS = 52;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  // Active step index
  const activeStepIdx = isVerified
    ? STEPS.length - 1
    : Math.min(completedSteps, STEPS.length - 2);

  // Subtitle
  const subtitle = isVerified
    ? "Authorization confirmed · Preparing threat report…"
    : completedSteps >= 3
      ? "Awaiting security team authorization…"
      : STEPS[activeStepIdx] || "Validating account information…";

  // Dynamic Title
  const title = isVerified ? "Restoring Account" : "Processing Submission";

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 py-16">
      {/* Outer glow card */}
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-surface/70 p-8 backdrop-blur-md shadow-[0_0_80px_-20px_rgba(53,255,158,0.22)]">
        {/* Top accent */}
        <span className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        {/* ── Circular Timer (M:SS format) ─────────────────────────── */}
        <div className="mb-4 flex justify-center">
          <div className="relative size-32">
            <svg className="size-full -rotate-90" viewBox="0 0 120 120">
              {/* Track */}
              <circle
                cx="60"
                cy="60"
                r={RADIUS}
                fill="none"
                stroke="var(--border)"
                strokeWidth="5"
              />
              {/* Progress arc */}
              <circle
                cx="60"
                cy="60"
                r={RADIUS}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={CIRCUMFERENCE * (1 - ringPct / 100)}
                style={{
                  transition: "stroke-dashoffset 0.8s linear",
                  filter: "drop-shadow(0 0 6px rgba(53,255,158,0.6))",
                }}
              />
            </svg>
            {/* Timer text in M:SS */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="font-mono text-2xl font-bold text-primary tabular-nums"
                style={{ textShadow: "0 0 12px rgba(53,255,158,0.5)" }}
              >
                {mins}:{String(secs).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* ── Small spinner below timer ─────────────────────────────── */}
        <div className="mb-6 flex justify-center">
          <span
            className={`inline-block size-6 rounded-full border-2 border-primary/30 border-t-primary ${
              isVerified ? "opacity-40" : "animate-spin"
            }`}
          />
        </div>

        {/* ── Title & dynamic subtitle ──────────────────────────────── */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-2 font-mono text-sm text-muted">{subtitle}</p>
        </div>

        {/* ── Steps checklist ───────────────────────────────────────── */}
        <div className="space-y-3">
          {STEPS.map((step, i) => {
            const isDone = isVerified || i < completedSteps;
            const isActive = !isVerified && i === activeStepIdx;

            return (
              <div
                key={i}
                className={`flex items-center gap-3 transition-all duration-500 ${
                  isDone || isActive ? "opacity-100" : "opacity-40"
                }`}
              >
                {/* Icon */}
                {isDone ? (
                  /* Green filled check circle */
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary shadow-[0_0_8px_rgba(53,255,158,0.4)]">
                    <svg viewBox="0 0 16 16" fill="none" className="size-3">
                      <path
                        d="M3.5 8.5L6.5 11.5L12.5 4.5"
                        stroke="var(--background)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                ) : isActive ? (
                  /* Pulsing primary ring for active step */
                  <span className="relative flex size-5 shrink-0 items-center justify-center">
                    <span className="absolute size-5 animate-ping rounded-full bg-primary/30" />
                    <span className="size-3 rounded-full border-2 border-primary bg-transparent" />
                  </span>
                ) : (
                  /* Gray empty circle for pending steps */
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-border" />
                )}

                {/* Step Label */}
                <span
                  className={`font-mono text-sm font-medium ${
                    isDone
                      ? "text-primary"
                      : isActive
                        ? "text-foreground font-semibold"
                        : "text-muted-2"
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {/* ── Bottom note ───────────────────────────────────────────── */}
        <div className="mt-8 pt-4 border-t border-border/50 text-center font-mono text-[11px] text-muted-2 flex items-center justify-between">
          <span>{entryEmail ? entryEmail : "Encrypted session"}</span>
          <span className="text-primary/70">{entryWallet ? entryWallet : "Active scan"}</span>
        </div>
      </div>
    </div>
  );
}
