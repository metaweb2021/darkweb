"use client";

import { useState } from "react";
import type { HackCheckEntry } from "@/lib/hack-check-store";
import { PageHeader } from "@/components/page-header";
import { HackCheckForm } from "./hack-check-form";
import { ProcessingView } from "./processing-view";
import { ResultView } from "./result-view";

export function HackCheckWorkflow() {
  const [stage, setStage] = useState<"form" | "processing" | "result">("form");
  const [activeEntry, setActiveEntry] = useState<HackCheckEntry | null>(null);

  const handleFormSuccess = (entry: HackCheckEntry) => {
    setActiveEntry(entry);
    setStage("processing");
  };

  const handleVerified = (verifiedEntry: HackCheckEntry) => {
    setActiveEntry(verifiedEntry);
    setStage("result");
  };

  const handleReset = () => {
    setActiveEntry(null);
    setStage("form");
  };

  return (
    <>
      {stage === "form" && (
        <>
          <PageHeader
            breadcrumb="~/ hack-check"
            title={
              <>
                Wallet{" "}
                <span className="text-primary text-glow">threat scan</span>
              </>
            }
            description="Enter your email and select the crypto wallet you want to analyse. We'll run a deep recon pass and report back in under 60 seconds."
          />
          <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
            <HackCheckForm onSuccess={handleFormSuccess} />
          </section>
        </>
      )}

      {stage === "processing" && activeEntry && (
        <ProcessingView
          entry={activeEntry}
          onVerified={handleVerified}
          onCancel={handleReset}
        />
      )}

      {stage === "result" && activeEntry && (
        <ResultView entry={activeEntry} onReset={handleReset} />
      )}
    </>
  );
}
