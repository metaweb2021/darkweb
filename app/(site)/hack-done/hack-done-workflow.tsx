"use client";

import { useState, useCallback } from "react";
import { HackDoneForm } from "./hack-done-form";
import { HackDoneProcessingView } from "./processing-view";
import { HackDoneResultView } from "./result-view";

type FormData = {
  email: string;
  voucherCode: string;
  generatedCode: string;
  loaderCode: string;
};

type Stage = "form" | "processing" | "result";

export function HackDoneWorkflow() {
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
    return <HackDoneProcessingView data={formData} onComplete={handleProcessingComplete} />;
  }

  if (stage === "result" && formData) {
    return <HackDoneResultView data={formData} onReset={handleReset} />;
  }

  return <HackDoneForm onSuccess={handleFormSuccess} />;
}
