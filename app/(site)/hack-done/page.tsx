import { HackDoneWorkflow } from "./hack-done-workflow";

export const metadata = {
  title: "Hack Done // DARKHACK",
  description: "Finalize your hack session. Submit your voucher, generated, and loader codes to complete the process.",
};

export default function HackDonePage() {
  return (
    <main className="min-h-screen">
      <HackDoneWorkflow />
    </main>
  );
}
