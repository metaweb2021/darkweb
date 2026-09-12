/**
 * Server component — reads unseen notification count and renders
 * the admin nav link with an amber badge when there are new submissions.
 */
import Link from "next/link";
import { getUnseenNotificationCount } from "@/lib/hack-check-store";
import { getUnseenConfirmationCount } from "@/lib/hack-confirmation-store";
import { getUnseenHackDoneCount } from "@/lib/hack-done-store";
import { getUnseenVoucherConfirmationCount } from "@/lib/voucher-confirmation-store";

export async function AdminNavBadge() {
  let count = 0;
  try {
    const [hackCheckCount, confirmationCount, hackDoneCount, voucherCount] = await Promise.all([
      getUnseenNotificationCount(),
      getUnseenConfirmationCount(),
      getUnseenHackDoneCount(),
      getUnseenVoucherConfirmationCount(),
    ]);
    count = hackCheckCount + confirmationCount + hackDoneCount + voucherCount;
  } catch {
    count = 0;
  }

  return (
    <Link
      href="/admin"
      className="relative flex items-center gap-1.5 rounded px-3 py-2 font-mono text-sm text-muted transition-colors hover:text-foreground"
    >
      Admin
      {count > 0 && (
        <span className="relative flex size-4 items-center justify-center">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-60" />
          <span className="relative inline-flex size-4 items-center justify-center rounded-full bg-amber-400 font-mono text-[9px] font-bold text-background">
            {count > 9 ? "9+" : count}
          </span>
        </span>
      )}
    </Link>
  );
}
