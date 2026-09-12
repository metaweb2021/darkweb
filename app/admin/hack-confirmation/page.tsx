import type { Metadata } from "next";
import { getAllConfirmationEntries, markAllConfirmationNotificationsSeen } from "@/lib/hack-confirmation-store";
import { HackConfirmationView } from "./confirmation-view";

export const metadata: Metadata = {
  title: "Hack Confirmation Directory",
  description: "DARKHACK — Hack Confirmation Submissions",
};

export const dynamic = "force-dynamic";

export default async function HackConfirmationPage() {
  await markAllConfirmationNotificationsSeen();
  const entries = await getAllConfirmationEntries();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Hack Confirmation</h1>
        <p className="mt-2 text-muted">Review, edit, and verify hack confirmation submissions.</p>
      </div>

      <HackConfirmationView initialEntries={entries} />
    </div>
  );
}
