"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldIcon, TerminalIcon } from "@/components/icons";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    title: "Overview",
    href: "/admin",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    title: "Hack Check",
    href: "/admin/hack-check",
    icon: <TerminalIcon className="size-4" />,
  },
  {
    title: "Hack Confirmation",
    href: "/admin/hack-confirmation",
    icon: <ShieldIcon className="size-4" />,
  },
  {
    title: "Hack Done",
    href: "/admin/hack-done",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  {
    title: "Voucher Conf",
    href: "/admin/voucher-confirmation",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    ),
  },
];

export function AdminNav({ mobile }: { mobile?: boolean }) {
  const pathname = usePathname();

  if (mobile) {
    return (
      <div className="flex gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 font-mono text-[11px] transition-all ${
                isActive
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border bg-surface-2 text-muted hover:text-foreground"
              }`}
            >
              {item.icon}
              {item.title}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <nav className="flex flex-col gap-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 font-mono text-sm transition-all ${
              isActive
                ? "border-primary/50 bg-primary/10 text-primary shadow-[0_0_15px_rgba(53,255,158,0.1)]"
                : "border-transparent text-muted hover:bg-surface-2 hover:text-foreground"
            }`}
          >
            {item.icon}
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
