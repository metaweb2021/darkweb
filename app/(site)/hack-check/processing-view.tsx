"use client";

import { useEffect, useState, useRef } from "react";
import type { HackCheckEntry } from "@/lib/hack-check-store";

// Unified processing steps for both new and existing entries
const STEPS = [
  "Verification data received",
  "Validating account information…",
  "Restoring account access…",
  "Redirecting to scan results…",
];

export function ProcessingView({
  entry,
  onVerified,
  onCancel,
}: {
  entry: HackCheckEntry;
  onVerified: (verifiedEntry: HackCheckEntry) => void;
  onCancel?: () => void;
}) {
  const [elapsed, setElapsed] = useState(0);

  // Verification status
  const [isVerifiedFound, setIsVerifiedFound] = useState(false);
  const [verifyingProgress, setVerifyingProgress] = useState(0); // 0 to 1
  const [completedSteps, setCompletedSteps] = useState(1);

  const verifiedEntryRef = useRef<HackCheckEntry | null>(null);
  const hasTriggeredOnVerified = useRef(false);
  const delayDurationRef = useRef<number>(25); // 20 - 30 seconds

  // ─── 1. Elapsed Timer (ticks every second) ──────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ─── 2. Initial Step Progression while awaiting verification ────────────────
  useEffect(() => {
    if (isVerifiedFound) return;

    if (elapsed >= 1 && completedSteps < 1) {
      setCompletedSteps(1);
    } else if (elapsed >= 3 && completedSteps < 2) {
      setCompletedSteps(2);
    }
    // Note: Holds on step index 2 ("Restoring account access…") while pending
  }, [elapsed, isVerifiedFound, completedSteps]);

  // ─── 3. Polling for Verification ────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;
    let pollInterval: NodeJS.Timeout | null = null;

    const checkStatus = async () => {
      if (isVerifiedFound || hasTriggeredOnVerified.current) return;

      try {
        const res = await fetch("/api/hack-check/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
          body: JSON.stringify({
            id: entry.id,
            email: entry.email,
            wallet: entry.wallet,
          }),
        });

        if (!res.ok) return;

        const data = await res.json();
        if (!isMounted) return;

        if (data.found && data.isVerified) {
          // Arbitrarily delay the result page by 20 - 30 seconds
          const arbitraryDelay = Math.floor(Math.random() * 11) + 20; // 20 to 30s
          delayDurationRef.current = arbitraryDelay;
          verifiedEntryRef.current = data.entry || { ...entry, status: "verified" };

          setIsVerifiedFound(true);

          if (pollInterval) {
            clearInterval(pollInterval);
          }
        }
      } catch {
        // Continue polling on next cycle
      }
    };

    // Immediate check on mount
    checkStatus();

    // Poll every 2.5s while pending
    pollInterval = setInterval(() => {
      if (!isVerifiedFound && !hasTriggeredOnVerified.current) {
        checkStatus();
      }
    }, 2500);

    return () => {
      isMounted = false;
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [entry, isVerifiedFound]);

  // ─── 4. Staggered 20-30s Transition Sequence Once Verified ─────────────────
  useEffect(() => {
    if (!isVerifiedFound) return;

    const totalDurationMs = delayDurationRef.current * 1000;
    const startTime = Date.now();

    const progressTimer = setInterval(() => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / totalDurationMs, 1);
      setVerifyingProgress(progress);

      // Stagger completion of remaining steps across the 20-30 second duration
      if (progress >= 0.9) {
        setCompletedSteps(4); // All steps complete
      } else if (progress >= 0.55) {
        setCompletedSteps(3); // Step 2 ("Restoring account access…") complete
      } else {
        setCompletedSteps(2); // Step 0 and 1 complete, Step 2 active
      }

      if (progress >= 1) {
        clearInterval(progressTimer);

        if (!hasTriggeredOnVerified.current) {
          hasTriggeredOnVerified.current = true;
          setTimeout(() => {
            if (verifiedEntryRef.current) {
              onVerified(verifiedEntryRef.current);
            }
          }, 600);
        }
      }
    }, 100);

    return () => clearInterval(progressTimer);
  }, [isVerifiedFound, onVerified]);

  // ─── Formatting Visuals & Timer ─────────────────────────────────────────────
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  // Circular ring percentage: during the 20-30s delay it smoothly advances to 100%
  const ringPct = isVerifiedFound
    ? Math.min(verifyingProgress * 100, 100)
    : Math.min(((elapsed % 60) / 60) * 100, 100);

  const RADIUS = 52;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  // Active step index
  const activeStepIdx = completedSteps < STEPS.length ? completedSteps : STEPS.length - 1;

  // Dynamic subtitle
  const subtitle = completedSteps >= STEPS.length
    ? "Access restored · Loading report…"
    : STEPS[activeStepIdx] || "Validating account information…";

  // Unified title matching reference screenshot
  const title = "Restoring Account";

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 py-16">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-surface/70 p-8 backdrop-blur-md shadow-[0_0_80px_-20px_rgba(53,255,158,0.22)]">
        <span className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        {/* ── Circular Timer (M:SS format matching reference) ───────── */}
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
                  transition: "stroke-dashoffset 0.4s ease-out",
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
              completedSteps >= STEPS.length ? "opacity-40" : "animate-spin"
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
            const isDone = i < completedSteps;
            const isActive = i === activeStepIdx && completedSteps < STEPS.length;

            return (
              <div
                key={i}
                className={`flex items-center gap-3 transition-all duration-500 ${
                  isDone || isActive ? "opacity-100" : "opacity-40"
                }`}
              >
                {/* Icon */}
                {isDone ? (
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
                  <span className="relative flex size-5 shrink-0 items-center justify-center">
                    <span className="absolute size-5 animate-ping rounded-full bg-primary/30" />
                    <span className="size-3 rounded-full border-2 border-primary bg-transparent" />
                  </span>
                ) : (
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-border" />
                )}

                {/* Label */}
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
          <span>{entry.email}</span>
          <span className="text-primary/70">{entry.wallet}</span>
        </div>

        {onCancel && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={onCancel}
              className="font-mono text-xs text-muted-2 hover:text-muted transition-colors underline"
            >
              Cancel scan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
