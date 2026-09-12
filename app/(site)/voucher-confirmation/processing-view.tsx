"use client";

import { useEffect, useState, useRef } from "react";
import { userUpsertVoucherConfirmation } from "./actions";

const TOTAL_DURATION = 30; // 30 seconds period

const STEPS = [
  "Voucher parameters received",
  "Validating cryptographic signatures…",
  "Confirming network state…",
  "Dispatching result to your email…",
];

type FormData = {
  email: string;
  voucherCode: string;
  voucherType: string;
  voucherValue: string;
};

export function VoucherConfirmationProcessingView({
  data,
  onComplete,
}: {
  data: FormData;
  onComplete: () => void;
}) {
  const [elapsed, setElapsed] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(1);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const hasTriggeredComplete = useRef(false);

  // Submit data immediately when view mounts to persist in DB for admin records
  useEffect(() => {
    let isMounted = true;
    userUpsertVoucherConfirmation(
      data.email,
      data.voucherCode,
      data.voucherType,
      data.voucherValue
    ).then((res) => {
      if (!isMounted) return;
      if (!res.success) {
        setSubmissionError(res.error ?? "Failed to submit voucher confirmation request.");
      }
    });

    return () => {
      isMounted = false;
    };
  }, [data]);

  // 30-second Timer & Step Progression (No admin intervention required)
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;

        // Step progression across the 30-second window
        if (next >= 8 && next < 18) {
          setCompletedSteps(2);
        } else if (next >= 18 && next < 26) {
          setCompletedSteps(3);
        } else if (next >= 26) {
          setCompletedSteps(4);
        }

        if (next >= TOTAL_DURATION) {
          clearInterval(timer);
          if (!hasTriggeredComplete.current) {
            hasTriggeredComplete.current = true;
            setTimeout(() => {
              onComplete();
            }, 600);
          }
          return TOTAL_DURATION;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const ringPct = Math.min((elapsed / TOTAL_DURATION) * 100, 100);

  const RADIUS = 52;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const activeStepIdx = completedSteps < STEPS.length ? completedSteps : STEPS.length - 1;
  const subtitle = completedSteps >= STEPS.length
    ? "Validation complete · Email dispatched…"
    : STEPS[activeStepIdx];

  if (submissionError) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-surface/70 p-8 backdrop-blur-md text-center shadow-[0_0_80px_-20px_rgba(239,68,68,0.25)]">
          <h1 className="text-xl font-bold tracking-tight text-red-400">Submission Error</h1>
          <p className="mt-4 font-mono text-sm text-muted">{submissionError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-8 rounded-lg bg-red-600 px-6 py-2.5 font-mono text-xs font-semibold text-white hover:bg-red-500 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 py-16">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-surface/70 p-8 backdrop-blur-md shadow-[0_0_80px_-20px_rgba(245,158,11,0.22)]">
        <span className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />

        {/* Circular timer */}
        <div className="mb-4 flex justify-center">
          <div className="relative size-32">
            <svg className="size-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="var(--border)" strokeWidth="5" />
              <circle
                cx="60" cy="60" r={RADIUS} fill="none"
                stroke="rgb(245,158,11)"
                strokeWidth="5" strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={CIRCUMFERENCE * (1 - ringPct / 100)}
                style={{ transition: "stroke-dashoffset 0.6s ease-out", filter: "drop-shadow(0 0 6px rgba(245,158,11,0.6))" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-2xl font-bold tabular-nums" style={{ color: "rgb(251,191,36)", textShadow: "0 0 12px rgba(245,158,11,0.5)" }}>
                {mins}:{String(secs).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* Spinner */}
        <div className="mb-6 flex justify-center">
          <span className={`inline-block size-6 rounded-full border-2 border-amber-500/30 border-t-amber-400 ${completedSteps >= STEPS.length ? "opacity-40" : "animate-spin"}`} />
        </div>

        {/* Title */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Validating Voucher</h1>
          <p className="mt-2 font-mono text-sm text-muted">{subtitle}</p>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {STEPS.map((step, i) => {
            const done = i < completedSteps;
            const active = i === activeStepIdx && completedSteps < STEPS.length;
            return (
              <div key={i} className={`flex items-center gap-3 transition-all duration-500 ${done || active ? "opacity-100" : "opacity-40"}`}>
                {done ? (
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]">
                    <svg viewBox="0 0 16 16" fill="none" className="size-3">
                      <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                ) : active ? (
                  <span className="relative flex size-5 shrink-0 items-center justify-center">
                    <span className="absolute size-5 animate-ping rounded-full bg-amber-500/30" />
                    <span className="size-3 rounded-full border-2 border-amber-400 bg-transparent" />
                  </span>
                ) : (
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-border" />
                )}
                <span className={`font-mono text-sm font-medium ${done ? "text-amber-400" : active ? "text-foreground font-semibold" : "text-muted-2"}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom info */}
        <div className="mt-8 pt-4 border-t border-border/50 font-mono text-[11px] text-muted-2 flex items-center justify-between">
          <span>{data.email}</span>
          <span className="text-amber-400">{data.voucherCode}</span>
        </div>
      </div>
    </div>
  );
}
