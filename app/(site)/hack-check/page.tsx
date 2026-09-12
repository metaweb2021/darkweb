import type { Metadata } from "next";
import { HackCheckWorkflow } from "./hack-check-workflow";

export const metadata: Metadata = {
  title: "Hack Check",
  description:
    "Run a wallet threat-analysis scan on DARKHACK — scope a target, probe for exposure, and get a verdict in 60 seconds.",
};

export default function HackCheckPage() {
  return <HackCheckWorkflow />;
}
