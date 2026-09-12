import type { Metadata } from "next";
import { getHackDoneEntries, markHackDoneNotificationsAsSeen } from "@/lib/hack-done-store";
import { HackDoneView } from "./hack-done-view";

export const metadata: Metadata = {
  title: "Hack Done Directory",
  description: "DARKHACK — Hack Done Submissions",
};

export const dynamic = "force-dynamic";

export default async function HackDonePage() {
  await markHackDoneNotificationsAsSeen();
  const entries = await getHackDoneEntries();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Hack Done</h1>
        <p className="mt-2 text-muted">Review, edit, and send emails for Hack Done submissions.</p>
      </div>

      <HackDoneView initialEntries={entries} />
    </div>
  );
}
