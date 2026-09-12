"use client";

import { useActionState, useState, useEffect, useTransition } from "react";
import type { HackCheckEntry } from "@/lib/hack-check-store";
import { adminUpdate, adminDelete, type AdminUpdateResult } from "../actions";
import { TerminalIcon, ShieldIcon } from "@/components/icons";

const INITIAL_STATE: AdminUpdateResult | null = null;
const COMMON_WALLETS = [
  "MetaMask", "Phantom", "Coinbase Wallet", "Trust Wallet", "Ledger Live",
  "Trezor Suite", "Exodus", "Atomic Wallet", "Electrum", "Mycelium",
];

function formatDate(iso: string | Date) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function generateSecurityCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const p1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const p2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `DH-${p1}-${p2}`;
}

export function HackCheckView({ initialEntries }: { initialEntries: HackCheckEntry[] }) {
  const [entries, setEntries] = useState(initialEntries);
  const [editingTarget, setEditingTarget] = useState<{ entry: HackCheckEntry; mode: "verify" | "edit" } | null>(null);
  const [deletingTarget, setDeletingTarget] = useState<HackCheckEntry | null>(null);
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "verified">("all");
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => { setEntries(initialEntries); }, [initialEntries]);
  
  // Reset page when filters change
  useEffect(() => { setCurrentPage(1); }, [search, statusFilter]);

  const filteredEntries = entries.filter((e) => {
    if (statusFilter !== "all" && e.status !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return e.email.toLowerCase().includes(q) || e.wallet.toLowerCase().includes(q) || e.id.toLowerCase().includes(q);
  });

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const paginatedEntries = filteredEntries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const pendingCount = entries.filter((e) => e.status === "pending").length;
  const verifiedCount = entries.filter((e) => e.status === "verified").length;

  return (
    <>
      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Entries", value: entries.length, color: "text-foreground" },
          { label: "Pending", value: pendingCount, color: "text-amber-400" },
          { label: "Verified", value: verifiedCount, color: "text-primary" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-border bg-surface/60 px-5 py-4">
            <p className="font-mono text-xs uppercase tracking-wider text-muted">{label}</p>
            <p className={`mt-1 text-3xl font-bold tabular-nums ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Table & Controls Card */}
      <div className="rounded-xl border border-border bg-surface/60 overflow-hidden">
        {/* Controls Bar */}
        <div className="border-b border-border px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface/40">
          <div className="flex items-center gap-2">
            <TerminalIcon className="size-4 text-muted-2" />
            <span className="font-mono text-xs uppercase tracking-widest text-muted">Hack Check Directory</span>
            <span className="rounded-md border border-border bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-muted-2">
              {filteredEntries.length} {filteredEntries.length === 1 ? "entry" : "entries"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Pills */}
            <div className="flex rounded-lg border border-border bg-surface-2 p-0.5">
              {(["all", "pending", "verified"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`rounded-md px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                    statusFilter === tab
                      ? "bg-surface text-foreground font-semibold shadow-sm"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search email, wallet…"
                className="w-full sm:w-56 rounded-lg border border-border bg-surface-2 px-3 py-1.5 font-mono text-xs text-foreground placeholder:text-muted-2 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground text-xs"
                >✕</button>
              )}
            </div>
          </div>
        </div>

        {/* Entries List */}
        {filteredEntries.length === 0 ? (
          <div className="py-16 text-center font-mono text-sm text-muted">
            {search || statusFilter !== "all" ? (
              <p>No submissions match your search criteria.</p>
            ) : (
              <p>No entries yet — submissions will appear here.</p>
            )}
          </div>
        ) : (
          <div>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-surface/20">
                    {["Status", "Email", "Wallet", "Submitted", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-2">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedEntries.map((e) => (
                    <EntryRow key={e.id} entry={e} onEdit={(entry, mode) => setEditingTarget({ entry, mode })} onDelete={setDeletingTarget} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-border">
              {paginatedEntries.map((e) => (
                <div key={e.id} className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider mb-2 ${
                        e.status === "pending" ? "border-amber-400/40 bg-amber-400/10 text-amber-400" : "border-primary/40 bg-primary/10 text-primary"
                      }`}>
                        {e.status}
                      </span>
                      <p className="font-mono text-xs font-semibold text-foreground truncate">{e.email}</p>
                      <p className="font-mono text-xs text-muted mt-1">{e.wallet}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                    <span className="font-mono text-[10px] text-muted-2">{formatDate(e.submittedAt)}</span>
                    <div className="flex gap-2">
                      {e.status === "pending" ? (
                        <button onClick={() => setEditingTarget({ entry: e, mode: "verify" })} className="rounded-md border border-primary/40 bg-primary/10 px-2 py-1 font-mono text-[10px] text-primary">Verify</button>
                      ) : null}
                      <button onClick={() => setEditingTarget({ entry: e, mode: "edit" })} className="rounded-md border border-border bg-surface px-2 py-1 font-mono text-[10px] text-muted">Edit</button>
                      <button onClick={() => setDeletingTarget(e)} className="rounded-md border border-red-500/30 px-2 py-1 font-mono text-[10px] text-red-400">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="border-t border-border px-5 py-3 flex items-center justify-between bg-surface/20">
                <p className="font-mono text-[10px] text-muted-2">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredEntries.length)} of {filteredEntries.length}
                </p>
                <div className="flex gap-1">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-2 py-1 rounded border border-border bg-surface text-xs disabled:opacity-50">Prev</button>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-2 py-1 rounded border border-border bg-surface text-xs disabled:opacity-50">Next</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {editingTarget && (
        <EditPanel
          entry={editingTarget.entry}
          initialMode={editingTarget.mode}
          onClose={() => setEditingTarget(null)}
          onSaved={(updated) => setEntries(prev => prev.map(e => e.id === updated.id ? updated : e))}
          onDeleteRequest={(entry) => { setEditingTarget(null); setDeletingTarget(entry); }}
        />
      )}

      {deletingTarget && (
        <DeleteConfirmModal
          entry={deletingTarget}
          onClose={() => setDeletingTarget(null)}
          onDeleted={(id) => setEntries(prev => prev.filter(e => e.id !== id))}
        />
      )}
    </>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function EntryRow({ entry, onEdit, onDelete }: { entry: HackCheckEntry; onEdit: (e: HackCheckEntry, m: "verify"|"edit") => void; onDelete: (e: HackCheckEntry) => void; }) {
  const isPending = entry.status === "pending";
  return (
    <tr className="border-b border-border/50 bg-surface/10 transition-colors hover:bg-surface/30">
      <td className="px-4 py-3 whitespace-nowrap">
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
            isPending ? "border-amber-400/40 bg-amber-400/10 text-amber-400" : "border-primary/40 bg-primary/10 text-primary"
          }`}
        >
          {entry.status}
        </span>
      </td>
      <td className="px-4 py-3 font-mono text-xs text-foreground font-medium max-w-[220px] truncate">{entry.email}</td>
      <td className="px-4 py-3 font-mono text-xs text-muted whitespace-nowrap">{entry.wallet}</td>
      <td className="px-4 py-3 font-mono text-xs text-muted-2 whitespace-nowrap">{formatDate(entry.submittedAt)}</td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-2">
          {isPending ? (
            <>
              <button onClick={() => onEdit(entry, "verify")} className="inline-flex items-center gap-1 rounded-md border border-primary/40 bg-primary/10 px-2.5 py-1.5 font-mono text-xs font-medium text-primary transition-all hover:bg-primary hover:text-background">Verify →</button>
              <button onClick={() => onEdit(entry, "edit")} className="rounded-md border border-border bg-surface px-2.5 py-1.5 font-mono text-xs text-muted transition-colors hover:border-border-bright hover:text-foreground">Edit</button>
            </>
          ) : (
            <button onClick={() => onEdit(entry, "edit")} className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-primary/50 hover:text-primary">Edit</button>
          )}
          <button onClick={() => onDelete(entry)} className="grid size-7 place-items-center rounded-md border border-border bg-surface text-muted transition-colors hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400">×</button>
        </div>
      </td>
    </tr>
  );
}

function DeleteConfirmModal({ entry, onClose, onDeleted }: { entry: HackCheckEntry; onClose: () => void; onDeleted: (id: string) => void; }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const res = await adminDelete(entry.id);
      if (res.success) { onDeleted(entry.id); onClose(); }
      else { setError(res.error ?? "Failed to delete entry."); }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => !isPending && onClose()} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-red-500/30 bg-surface/95 p-6 shadow-[0_0_60px_-15px_rgba(239,68,68,0.25)] backdrop-blur-md">
        <span className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
        <div className="flex items-start gap-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">Delete Entry</h3>
            <p className="mt-1 text-sm text-muted">Are you sure you want to permanently delete the submission for {entry.email}?</p>
          </div>
        </div>
        {error && <div className="mt-3 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 font-mono text-xs text-red-400">[ERR] {error}</div>}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" disabled={isPending} onClick={onClose} className="rounded-lg border border-border bg-surface/50 px-4 py-2 font-mono text-xs text-muted hover:text-foreground">Cancel</button>
          <button type="button" disabled={isPending} onClick={handleDelete} className="rounded-lg bg-red-600 px-4 py-2 font-mono text-xs font-semibold text-white hover:bg-red-500">
            {isPending ? "Deleting…" : "Yes, Delete Entry"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditPanel({ entry, initialMode = "edit", onClose, onSaved, onDeleteRequest }: { entry: HackCheckEntry; initialMode?: "verify" | "edit"; onClose: () => void; onSaved: (e: HackCheckEntry) => void; onDeleteRequest: (e: HackCheckEntry) => void; }) {
  const [state, formAction, pending] = useActionState(adminUpdate, INITIAL_STATE);
  const [status, setStatus] = useState<"pending" | "verified">(initialMode === "verify" ? "verified" : entry.status);
  const [email, setEmail] = useState(entry.email);
  const [wallet, setWallet] = useState(entry.wallet);
  const [voucherValue, setVoucherValue] = useState(entry.voucherValue ?? (initialMode === "verify" || status === "verified" ? "$250 USDT" : ""));
  const [successfulRate, setSuccessfulRate] = useState(entry.successfulRate ?? 85);
  const [processingTime, setProcessingTime] = useState(entry.processingTime ?? "3–5 business days");
  const [amountMin, setAmountMin] = useState(entry.amountMin ?? 500);
  const [amountMax, setAmountMax] = useState(entry.amountMax ?? 5000);
  const [securityCode, setSecurityCode] = useState(entry.securityCode ?? (initialMode === "verify" ? generateSecurityCode() : ""));
  const [emailSentLocal, setEmailSentLocal] = useState(entry.emailSent);

  useEffect(() => {
    if (state?.success && state.entry) {
      onSaved(state.entry);
      const timer = setTimeout(onClose, 1100);
      return () => clearTimeout(timer);
    }
  }, [state, onClose, onSaved]);

  const isVerifiedMode = status === "verified";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 my-8 w-full max-w-xl rounded-2xl border border-border bg-surface/95 p-6 shadow-[0_0_80px_-20px_rgba(53,255,158,0.3)] backdrop-blur-md">
        <span className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="mt-1 text-lg font-semibold text-foreground">{email || "Submission Details"}</h2>
            <p className="font-mono text-xs text-muted">Case ID: {entry.id}</p>
          </div>
          <button onClick={onClose} className="grid size-8 place-items-center rounded-lg border border-border text-muted">✕</button>
        </div>

        <form action={formAction}>
          <input type="hidden" name="id" value={entry.id} />
          <input type="hidden" name="status" value={status} />
          <input type="hidden" name="emailSent" value={emailSentLocal ? "true" : "false"} />

          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-muted">Submission Status</label>
              <div className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-surface-2 p-1">
                <button type="button" onClick={() => setStatus("pending")} className={`rounded-md py-2 font-mono text-xs ${status === "pending" ? "bg-amber-400/15 text-amber-400" : "text-muted"}`}>Pending</button>
                <button type="button" onClick={() => { setStatus("verified"); if (!securityCode) setSecurityCode(generateSecurityCode()); if (!voucherValue) setVoucherValue("$250 USDT"); }} className={`rounded-md py-2 font-mono text-xs ${status === "verified" ? "bg-primary/15 text-primary" : "text-muted"}`}>Verified</button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface/50 p-4 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-mono text-xs text-muted">Email Address</label>
                  <input name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-xs text-foreground" />
                </div>
                <div>
                  <label className="mb-1 block font-mono text-xs text-muted">Wallet</label>
                  <input name="wallet" list="wallet-list" required value={wallet} onChange={(e) => setWallet(e.target.value)} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-xs text-foreground" />
                  <datalist id="wallet-list">{COMMON_WALLETS.map(w => <option key={w} value={w} />)}</datalist>
                </div>
              </div>
            </div>

            <div className={`rounded-xl border p-4 space-y-3.5 ${isVerifiedMode ? "border-primary/30 bg-primary/[0.03]" : "border-border bg-surface/30 opacity-80"}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-mono text-xs text-muted">Voucher Value</label>
                  <input name="voucherValue" type="text" required={isVerifiedMode} value={voucherValue} onChange={(e) => setVoucherValue(e.target.value)} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-xs text-foreground" />
                </div>
                <div>
                  <label className="mb-1 block font-mono text-xs text-muted">Processing Time</label>
                  <input name="processingTime" type="text" required={isVerifiedMode} value={processingTime} onChange={(e) => setProcessingTime(e.target.value)} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-xs text-foreground" />
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="mb-1 block font-mono text-xs text-muted">Successful Rate (%)</label>
                  <input name="successfulRate" type="number" min={0} max={100} required={isVerifiedMode} value={successfulRate} onChange={(e) => setSuccessfulRate(Number(e.target.value))} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-xs text-foreground" />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block font-mono text-xs text-muted">Security Code</label>
                  <input name="securityCode" type="text" required={isVerifiedMode} value={securityCode} onChange={(e) => setSecurityCode(e.target.value)} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-xs text-foreground" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="mb-1 block font-mono text-xs text-muted">Min Expected</label>
                  <input name="amountMin" type="number" required={isVerifiedMode} value={amountMin} onChange={(e) => setAmountMin(Number(e.target.value))} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-xs text-foreground" />
                </div>
                 <div>
                  <label className="mb-1 block font-mono text-xs text-muted">Max Expected</label>
                  <input name="amountMax" type="number" required={isVerifiedMode} value={amountMax} onChange={(e) => setAmountMax(Number(e.target.value))} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-xs text-foreground" />
                </div>
              </div>
            </div>

             <div className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-4 py-3">
              <span className="font-mono text-xs text-muted">Email Sent</span>
              <button type="button" onClick={() => setEmailSentLocal(!emailSentLocal)} className={`relative h-6 w-11 rounded-full border transition-all ${emailSentLocal ? "border-primary/60 bg-primary/20" : "border-border bg-surface-2"}`}>
                <span className={`absolute top-0.5 left-0.5 size-5 rounded-full transition-all ${emailSentLocal ? "translate-x-5 bg-primary" : "bg-muted-2"}`} />
              </button>
            </div>
          </div>

          {state && !state.success && <div className="mt-4 text-xs text-red-400">{state.error}</div>}
          {state?.success && <div className="mt-4 text-xs text-primary">✓ Saved successfully</div>}

          <div className="mt-6 flex items-center justify-between gap-3 pt-4 border-t border-border">
            <button type="button" onClick={() => { onClose(); onDeleteRequest(entry); }} className="text-xs text-red-400 hover:underline">Delete</button>
            <div className="flex gap-2.5">
              <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 text-xs text-muted">Cancel</button>
              <button type="submit" disabled={pending} className="rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-background">
                {pending ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
