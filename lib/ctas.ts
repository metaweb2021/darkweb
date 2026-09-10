import type { Cta } from "@/components/cta-card";
import { FlagIcon, TrophyIcon, BookIcon } from "@/components/icons";

/**
 * The three primary calls-to-action for the landing page.
 * Kept here so the hero and any other surface stay in sync.
 */
export const CTAS: Cta[] = [
  {
    index: "01",
    title: "Enter the Arena",
    command: "darkhack start --range",
    description:
      "Jump into a curated set of capture-the-flag challenges across web, binary, crypto and cloud. Each one spins up its own disposable sandbox you fully own.",
    href: "/challenges",
    cta: "Browse challenges",
    Icon: FlagIcon,
    accent: "primary",
  },
  {
    index: "02",
    title: "Live Scoreboard",
    command: "darkhack rank --live",
    description:
      "Track first-bloods, watch the leaderboard shift in real time, and see where you land against the rest of the range. Points decay, so speed matters.",
    href: "/scoreboard",
    cta: "View standings",
    Icon: TrophyIcon,
    accent: "cyan",
  },
  {
    index: "03",
    title: "Field Manual",
    command: "man darkhack",
    description:
      "The playbook: rules of engagement, category primers, tooling setup and write-up guidelines. Everything you need to go from first login to first flag.",
    href: "/docs",
    cta: "Read the docs",
    Icon: BookIcon,
    accent: "violet",
  },
];
