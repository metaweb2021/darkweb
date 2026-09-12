import { VoucherConfirmationWorkflow } from "./voucher-confirmation-workflow";

export const metadata = {
  title: "Voucher Confirmation // DARKHACK",
  description: "Confirm your voucher code securely.",
};

export default function VoucherConfirmationPage() {
  return (
    <main className="min-h-screen">
      <VoucherConfirmationWorkflow />
    </main>
  );
}
