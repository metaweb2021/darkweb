import type { Metadata } from "next";
import {
  getAllEntries,
  getUnseenNotificationCount,
  markAllNotificationsSeen,
} from "@/lib/hack-check-store";
import {
  getAllConfirmationEntries,
  getUnseenConfirmationCount,
  markAllConfirmationNotificationsSeen,
} from "@/lib/hack-confirmation-store";
import { getHackDoneEntries, markHackDoneNotificationsAsSeen } from "@/lib/hack-done-store";
import {
  getVoucherConfirmationEntries,
  markVoucherConfirmationNotificationsAsSeen,
} from "@/lib/voucher-confirmation-store";
import { ShieldIcon, TerminalIcon } from "@/components/icons";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Overview",
  description: "DARKHACK — Admin Dashboard Overview",
};

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  // Mark all notifications seen when admin visits the dashboard overview
  await Promise.all([
    markAllNotificationsSeen(),
    markAllConfirmationNotificationsSeen(),
    markHackDoneNotificationsAsSeen(),
    markVoucherConfirmationNotificationsAsSeen(),
  ]);

  const [entries, confirmationEntries, hackDoneEntries, voucherEntries] = await Promise.all([
    getAllEntries(),
    getAllConfirmationEntries(),
    getHackDoneEntries(),
    getVoucherConfirmationEntries(),
  ]);

  const stats = [
    {
      title: "Hack Check",
      href: "/admin/hack-check",
      icon: <TerminalIcon className="size-5 text-primary" />,
      total: entries.length,
      pending: entries.filter((e: any) => e.status === "pending").length,
      verified: entries.filter((e: any) => e.status === "verified").length,
      color: "border-primary/20 hover:border-primary/50 text-primary",
      bg: "bg-primary/5"
    },
    {
      title: "Hack Confirmation",
      href: "/admin/hack-confirmation",
      icon: <ShieldIcon className="size-5 text-cyan" />,
      total: confirmationEntries.length,
      pending: confirmationEntries.filter((e: any) => e.status === "pending").length,
      verified: confirmationEntries.filter((e: any) => e.status === "verified").length,
      color: "border-cyan/20 hover:border-cyan/50 text-cyan",
      bg: "bg-cyan/5"
    },
    {
      title: "Hack Done",
      href: "/admin/hack-done",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-5 text-amber-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ),
      total: hackDoneEntries.length,
      pending: hackDoneEntries.filter((e: any) => e.status === "pending").length,
      verified: hackDoneEntries.filter((e: any) => e.status === "verified").length,
      color: "border-amber-400/20 hover:border-amber-400/50 text-amber-400",
      bg: "bg-amber-400/5"
    },
    {
      title: "Voucher Confirmation",
      href: "/admin/voucher-confirmation",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-5 text-amber-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      ),
      total: voucherEntries.length,
      pending: voucherEntries.filter((e: any) => e.status === "pending").length,
      verified: voucherEntries.filter((e: any) => e.status === "verified").length,
      color: "border-amber-500/20 hover:border-amber-500/50 text-amber-500",
      bg: "bg-amber-500/5"
    }
  ];

  const totalPending = stats.reduce((acc, curr) => acc + curr.pending, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="mt-2 text-muted">Monitor and manage all system workflows from one place.</p>
      </div>

      {totalPending > 0 && (
        <div className="mb-8 flex items-center gap-3 rounded-xl border border-amber-400/30 bg-amber-400/10 px-5 py-4">
          <span className="relative flex size-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex size-3 rounded-full bg-amber-400" />
          </span>
          <p className="font-mono text-sm text-amber-400">
            <span className="font-bold">{totalPending}</span> pending {totalPending === 1 ? 'submission needs' : 'submissions need'} your attention across all workflows.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href} className={`flex flex-col rounded-2xl border ${stat.color} ${stat.bg} p-6 transition-all hover:bg-surface/50 hover:shadow-lg`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-xl border border-current p-2.5 opacity-80">
                {stat.icon}
              </div>
              <h2 className="text-xl font-bold text-foreground">{stat.title}</h2>
            </div>
            
            <div className="mt-auto grid grid-cols-3 gap-4 border-t border-current/20 pt-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-2">Total</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{stat.total}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-2">Pending</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums opacity-90">{stat.pending}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-2">Verified</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums opacity-90">{stat.verified}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
