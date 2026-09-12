import type { Metadata } from "next";
import Link from "next/link";
import { adminLogout } from "./login/actions";
import { AdminNav } from "./components/admin-nav";

export const metadata: Metadata = {
  title: {
    template: "%s | Admin | DARKHACK",
    default: "Admin Dashboard | DARKHACK",
  },
  description: "DARKHACK Admin Panel",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-surface/30">
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-2">~/ admin</span>
          </Link>
          <h2 className="mt-2 text-xl font-bold tracking-tight">
            DARK<span className="text-primary text-glow">HACK</span>
          </h2>
        </div>
        
        <div className="flex-1 px-4 py-2">
          <AdminNav />
        </div>

        <div className="p-4 border-t border-border">
          <form action={adminLogout}>
            <button
              type="submit"
              className="w-full rounded-lg border border-border bg-surface px-4 py-2 font-mono text-xs text-muted transition-colors hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/10 text-left flex justify-between items-center"
            >
              Sign Out <span>⎋</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile Header & Nav */}
      <div className="lg:hidden flex flex-col border-b border-border bg-surface/30 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center justify-between p-4">
          <Link href="/admin" className="flex items-center gap-2">
            <h2 className="text-lg font-bold tracking-tight">
              DARK<span className="text-primary text-glow">HACK</span> <span className="font-mono text-[10px] text-muted-2">ADMIN</span>
            </h2>
          </Link>
          <form action={adminLogout}>
            <button
              type="submit"
              className="rounded border border-border bg-surface px-2.5 py-1.5 font-mono text-[10px] text-muted transition-colors hover:border-red-500/50 hover:text-red-400"
            >
              Sign Out
            </button>
          </form>
        </div>
        <div className="overflow-x-auto px-4 pb-3 hide-scrollbar">
          <AdminNav mobile />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
