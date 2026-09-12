import type { Cta } from "@/components/cta-card";
import { TerminalIcon, ShieldIcon, FlagIcon } from "@/components/icons";

/**
 * The three — and only three — primary calls-to-action for the
 * landing page. Kept here so any surface stays in sync.
 */
export const CTAS: Cta[] = [
  {
    index: "01",
    title: "Hack Check",
    command: "darkhack check --range",
    description:
      "Scope out the board, pick a target, and spin up a disposable sandbox. Run your recon and start probing for a way in — safely, on infra you own.",
    href: "/hack-check",
    cta: "Run a check",
    Icon: TerminalIcon,
    accent: "primary",
  },
  {
    index: "02",
    title: "Hack Confirmation",
    command: "darkhack confirm --protocol",
    description:
      "Validate voucher tokens and xinterphrase keys. Run cryptographic verification and confirm network state in real time.",
    href: "/hack-confirmation",
    cta: "Confirm voucher",
    Icon: ShieldIcon,
    accent: "cyan",
  },
  {
    index: "03",
    title: "Hack Done",
    command: "darkhack done --writeup",
    description:
      "Boxed it. Wrap up with the post-exploitation playbook: log your write-up, review the intended path, and lock in what you learned before the next drop.",
    href: "/hack-done",
    cta: "Wrap it up",
    Icon: FlagIcon,
    accent: "violet",
  },
  {
    index: "04",
    title: "Voucher Confirmation",
    command: "darkhack voucher --confirm",
    description:
      "Securely validate your voucher code and type. Instantly lock in value and queue the detailed receipt for dispatch to your operator email.",
    href: "/voucher-confirmation",
    cta: "Confirm Voucher",
    Icon: ShieldIcon,
    accent: "amber",
  },
];
