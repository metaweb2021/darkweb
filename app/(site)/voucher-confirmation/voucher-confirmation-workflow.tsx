"use client";

import { useState, useCallback } from "react";
import { VoucherConfirmationForm } from "./voucher-confirmation-form";
import { VoucherConfirmationProcessingView } from "./processing-view";
import { VoucherConfirmationResultView } from "./result-view";

type FormData = {
  email: string;
  voucherCode: string;
  voucherType: string;
  voucherValue: string;
};

type Stage = "form" | "processing" | "result";

export function VoucherConfirmationWorkflow() {
  const [stage, setStage] = useState<Stage>("form");
  const [formData, setFormData] = useState<FormData | null>(null);

  const handleFormSuccess = useCallback((data: FormData) => {
    setFormData(data);
    setStage("processing");
  }, []);

  const handleProcessingComplete = useCallback(() => {
    setStage("result");
  }, []);

  const handleReset = useCallback(() => {
    setFormData(null);
    setStage("form");
  }, []);

  if (stage === "processing" && formData) {
    return <VoucherConfirmationProcessingView data={formData} onComplete={handleProcessingComplete} />;
  }

  if (stage === "result" && formData) {
    return <VoucherConfirmationResultView data={formData} onReset={handleReset} />;
  }

  return <VoucherConfirmationForm onSuccess={handleFormSuccess} />;
}
