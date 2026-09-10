import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ChallengeBoard } from "./challenge-board";

export const metadata: Metadata = {
  title: "Challenges",
  description:
    "Browse the DARKHACK capture-the-flag challenge board across web, pwn, crypto, cloud and forensics.",
};

export default function ChallengesPage() {
  return (
    <>
      <PageHeader
        breadcrumb="~/ challenges"
        title={
          <>
            The <span className="text-primary text-glow">board</span>
          </>
        }
        description="Pick a target, spin up your sandbox, and go hunting. Points decay as more players solve — first blood is worth the rush."
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <ChallengeBoard />
      </section>
    </>
  );
}
