import type { Metadata } from "next";
import { HackConfirmationWorkflow } from "./hack-confirmation-workflow";

export const metadata: Metadata = {
  title: "Hack Confirmation",
  description:
    "Verify your voucher code and xinterphrase keys on DARKHACK — audit confirmation status and finalize protocol release.",
};

export default function HackConfirmationPage() {
  return <HackConfirmationWorkflow />;
}
