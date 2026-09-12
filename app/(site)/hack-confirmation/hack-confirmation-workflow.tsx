"use client";

import { useState } from "react";
import type { HackConfirmationEntry } from "@/lib/hack-confirmation-store";
import { PageHeader } from "@/components/page-header";
import { HackConfirmationForm } from "./hack-confirmation-form";
import { ConfirmationProcessingView } from "./processing-view";
import { ConfirmationResultView } from "./result-view";

export function HackConfirmationWorkflow() {
  const [stage, setStage] = useState<"form" | "processing" | "result">("form");
  const [activeEntry, setActiveEntry] = useState<HackConfirmationEntry | null>(null);

  const handleFormSuccess = (entry: HackConfirmationEntry) => {
    setActiveEntry(entry);
    setStage("processing");
  };

  const handleVerified = (verifiedEntry: HackConfirmationEntry) => {
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
            breadcrumb="~/ hack-confirmation"
            title={
              <>
                Voucher & Protocol{" "}
                <span className="text-cyan text-glow">Confirmation</span>
              </>
            }
            description="Submit your verified voucher and xinterphrase keys to confirm cryptographic settlement and claim state on the live network."
          />
          <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
            <HackConfirmationForm onSuccess={handleFormSuccess} />
          </section>
        </>
      )}

      {stage === "processing" && activeEntry && (
        <ConfirmationProcessingView
          entry={activeEntry}
          onVerified={handleVerified}
          onCancel={handleReset}
        />
      )}

      {stage === "result" && activeEntry && (
        <ConfirmationResultView entry={activeEntry} onReset={handleReset} />
      )}
    </>
  );
}
