import type { Metadata } from "next";
import { getAllEntries, markAllNotificationsSeen } from "@/lib/hack-check-store";
import { HackCheckView } from "./hack-check-view";

export const metadata: Metadata = {
  title: "Hack Check Directory",
  description: "DARKHACK — Hack Check Submissions",
};

export const dynamic = "force-dynamic";

export default async function HackCheckPage() {
  await markAllNotificationsSeen();
  const entries = await getAllEntries();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Hack Check</h1>
        <p className="mt-2 text-muted">Review, edit, and verify initial hack check submissions.</p>
      </div>

      <HackCheckView initialEntries={entries} />
    </div>
  );
}
