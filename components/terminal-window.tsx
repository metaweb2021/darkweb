"use client";

import { useEffect, useRef, useState } from "react";
import { Panel } from "./panel";

type Line = {
  /** "in" = prompt/command, "out" = system output, "ok" = success line. */
  kind: "in" | "out" | "ok" | "warn";
  text: string;
};

const SCRIPT: Line[] = [
  { kind: "in", text: "darkhack --init --range=lab-07" },
  { kind: "out", text: "spinning up isolated sandbox…" },
  { kind: "ok", text: "✓ container ready  ·  net=isolated  ·  ttl=4h" },
  { kind: "in", text: "recon --target 10.10.14.0/24" },
  { kind: "out", text: "scanning 254 hosts …" },
  { kind: "ok", text: "✓ 3 services mapped  ·  2 flags in scope" },
  { kind: "in", text: "exploit web/sqli-warmup" },
  { kind: "warn", text: "payload staged — awaiting your input" },
  { kind: "ok", text: "flag captured → DHW{practice_makes_pwnage}" },
];

const color: Record<Line["kind"], string> = {
  in: "text-foreground",
  out: "text-muted",
  ok: "text-primary",
  warn: "text-amber",
};

/**
 * Animated terminal that types out a scripted boot/exploit sequence.
 * Loops. Client-only because it drives a timer.
 */
export function TerminalWindow({ className = "" }: { className?: string }) {
  const [visible, setVisible] = useState<Line[]>([]);
  const [typing, setTyping] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduce) {
      setVisible(SCRIPT);
      return;
    }

    const run = async () => {
      while (!cancelled) {
        setVisible([]);
        setTyping("");
        for (const line of SCRIPT) {
          if (cancelled) return;
          if (line.kind === "in") {
            for (let i = 1; i <= line.text.length; i++) {
              if (cancelled) return;
              setTyping(line.text.slice(0, i));
              await wait(26);
            }
            await wait(220);
            setVisible((v) => [...v, line]);
            setTyping("");
          } else {
            await wait(320);
            setVisible((v) => [...v, line]);
          }
        }
        await wait(2600);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [visible, typing]);

  return (
    <Panel
      chrome
      title="root@darkhack:~"
      className={`hair-border ${className}`}
    >
      <div className="scanlines relative">
        <div
          ref={scrollRef}
          className="h-72 overflow-hidden p-4 font-mono text-[13px] leading-6 sm:h-80"
        >
          {visible.map((line, i) => (
            <div key={i} className={color[line.kind]}>
              {line.kind === "in" ? (
                <>
                  <span className="text-cyan">λ</span>{" "}
                  <span className="text-muted-2">~</span> {line.text}
                </>
              ) : (
                <span className="whitespace-pre-wrap">{line.text}</span>
              )}
            </div>
          ))}
          {typing !== "" && (
            <div className="text-foreground">
              <span className="text-cyan">λ</span>{" "}
              <span className="text-muted-2">~</span> {typing}
              <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-blink bg-primary" />
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
