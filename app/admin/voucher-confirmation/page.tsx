import type { Metadata } from "next";
import { getVoucherConfirmationEntries, markVoucherConfirmationNotificationsAsSeen } from "@/lib/voucher-confirmation-store";
import { VoucherConfirmationView } from "./voucher-view";

export const metadata: Metadata = {
  title: "Voucher Confirmation Directory",
  description: "DARKHACK — Voucher Confirmation Submissions",
};

export const dynamic = "force-dynamic";

export default async function VoucherConfirmationPage() {
  await markVoucherConfirmationNotificationsAsSeen();
  const entries = await getVoucherConfirmationEntries();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Voucher Confirmation</h1>
        <p className="mt-2 text-muted">Review, edit, and send emails for Voucher Confirmation submissions.</p>
      </div>

      <VoucherConfirmationView initialEntries={entries} />
    </div>
  );
}
