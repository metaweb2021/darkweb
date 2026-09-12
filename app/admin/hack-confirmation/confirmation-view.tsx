"use client";

import { useActionState, useState, useEffect, useTransition } from "react";
import type { HackConfirmationEntry } from "@/lib/hack-confirmation-store";
import { adminUpdateConfirmation, adminDeleteConfirmation, type AdminConfirmationUpdateResult } from "../actions";
import { ShieldIcon } from "@/components/icons";

const INITIAL_CONFIRMATION_STATE: AdminConfirmationUpdateResult | null = null;

function formatDate(iso: string | Date) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function generateConfirmationHash() {
  const hex = "0123456789abcdef";
  let hash = "0x";
  for (let i = 0; i < 40; i++) {
    hash += hex[Math.floor(Math.random() * hex.length)];
  }
  return hash;
}

export function HackConfirmationView({ initialEntries }: { initialEntries: HackConfirmationEntry[] }) {
  const [entries, setEntries] = useState(initialEntries);
  const [editingTarget, setEditingTarget] = useState<{ entry: HackConfirmationEntry; mode: "verify" | "edit" } | null>(null);
  const [deletingTarget, setDeletingTarget] = useState<HackConfirmationEntry | null>(null);
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "verified">("all");
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => { setEntries(initialEntries); }, [initialEntries]);
  useEffect(() => { setCurrentPage(1); }, [search, statusFilter]);

  const filteredEntries = entries.filter((e) => {
    if (statusFilter !== "all" && e.status !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return e.email.toLowerCase().includes(q) || e.voucherCode.toLowerCase().includes(q) || e.xinterphraseCode.toLowerCase().includes(q) || e.id.toLowerCase().includes(q);
  });

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const paginatedEntries = filteredEntries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const pendingCount = entries.filter((e) => e.status === "pending").length;
  const verifiedCount = entries.filter((e) => e.status === "verified").length;

  return (
    <>
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Confirmations", value: entries.length, color: "text-foreground" },
          { label: "Pending", value: pendingCount, color: "text-amber-400" },
          { label: "Verified", value: verifiedCount, color: "text-cyan" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-border bg-surface/60 px-5 py-4">
            <p className="font-mono text-xs uppercase tracking-wider text-muted">{label}</p>
            <p className={`mt-1 text-3xl font-bold tabular-nums ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-surface/60 overflow-hidden">
        <div className="border-b border-border px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface/40">
          <div className="flex items-center gap-2">
            <ShieldIcon className="size-4 text-cyan/70" />
            <span className="font-mono text-xs uppercase tracking-widest text-muted">Hack Confirmation Directory</span>
            <span className="rounded-md border border-border bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-muted-2">
              {filteredEntries.length} {filteredEntries.length === 1 ? "entry" : "entries"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-lg border border-border bg-surface-2 p-0.5">
              {(["all", "pending", "verified"] as const).map((tab) => (
                <button
                  key={tab} type="button" onClick={() => setStatusFilter(tab)}
                  className={`rounded-md px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                    statusFilter === tab ? "bg-surface text-foreground font-semibold shadow-sm" : "text-muted hover:text-foreground"
                  }`}
                >{tab}</button>
              ))}
            </div>

            <div className="relative">
              <input
                type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search email, voucher, key…"
                className="w-full sm:w-56 rounded-lg border border-border bg-surface-2 px-3 py-1.5 font-mono text-xs text-foreground placeholder:text-muted-2 focus:border-cyan/60 focus:outline-none focus:ring-1 focus:ring-cyan/20"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground text-xs">✕</button>
              )}
            </div>
          </div>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="py-16 text-center font-mono text-sm text-muted">
            {search || statusFilter !== "all" ? <p>No confirmation submissions match your search criteria.</p> : <p>No confirmation entries yet.</p>}
          </div>
        ) : (
          <div>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-surface/20">
                    {["Status", "Email", "Voucher Code", "Xinterphrase Code", "Submitted", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-2">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedEntries.map((e) => (
                    <ConfirmationEntryRow key={e.id} entry={e} onEdit={(entry, mode) => setEditingTarget({ entry, mode })} onDelete={setDeletingTarget} />
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
                        e.status === "pending" ? "border-amber-400/40 bg-amber-400/10 text-amber-400" : "border-cyan/40 bg-cyan/10 text-cyan"
                      }`}>
                        {e.status}
                      </span>
                      <p className="font-mono text-xs font-semibold text-foreground truncate">{e.email}</p>
                      <p className="font-mono text-xs text-cyan mt-1">{e.voucherCode}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                    <span className="font-mono text-[10px] text-muted-2">{formatDate(e.submittedAt)}</span>
                    <div className="flex gap-2">
                      {e.status === "pending" && (
                        <button onClick={() => setEditingTarget({ entry: e, mode: "verify" })} className="rounded-md border border-cyan/40 bg-cyan/10 px-2 py-1 font-mono text-[10px] text-cyan">Verify</button>
                      )}
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
        <ConfirmationEditModal
          entry={editingTarget.entry}
          initialMode={editingTarget.mode}
          onClose={() => setEditingTarget(null)}
          onSaved={(updated) => setEntries(prev => prev.map(e => e.id === updated.id ? updated : e))}
          onDeleteRequest={(entry) => { setEditingTarget(null); setDeletingTarget(entry); }}
        />
      )}

      {deletingTarget && (
        <ConfirmationDeleteModal
          entry={deletingTarget}
          onClose={() => setDeletingTarget(null)}
          onDeleted={(id) => setEntries(prev => prev.filter(e => e.id !== id))}
        />
      )}
    </>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function ConfirmationEntryRow({ entry, onEdit, onDelete }: { entry: HackConfirmationEntry; onEdit: (e: HackConfirmationEntry, m: "verify" | "edit") => void; onDelete: (e: HackConfirmationEntry) => void; }) {
  const isPending = entry.status === "pending";
  return (
    <tr className={`border-b border-border transition-colors hover:bg-surface-2/50 ${isPending ? "bg-amber-400/[0.02]" : ""}`}>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${isPending ? "border-amber-400/40 bg-amber-400/10 text-amber-400" : "border-cyan/40 bg-cyan/10 text-cyan"}`}>
          {isPending ? "⏳" : <ShieldIcon className="size-2.5" />} {entry.status}
        </span>
      </td>
      <td className="px-4 py-3 font-mono text-xs text-foreground font-medium max-w-[200px] truncate">{entry.email}</td>
      <td className="px-4 py-3 font-mono text-xs text-cyan font-bold whitespace-nowrap">{entry.voucherCode}</td>
      <td className="px-4 py-3 font-mono text-xs text-muted whitespace-nowrap">{entry.xinterphraseCode}</td>
      <td className="px-4 py-3 font-mono text-xs text-muted-2 whitespace-nowrap">{formatDate(entry.submittedAt)}</td>
      <td className="px-4 py-3 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-2">
          {isPending && <button type="button" onClick={() => onEdit(entry, "verify")} className="inline-flex items-center gap-1 rounded border border-cyan/40 bg-cyan/10 px-2.5 py-1 font-mono text-xs text-cyan hover:bg-cyan/20">⚡ Verify</button>}
          <button type="button" onClick={() => onEdit(entry, "edit")} className="rounded border border-border bg-surface-2 px-2.5 py-1 font-mono text-xs text-muted hover:text-foreground">Edit</button>
          <button type="button" onClick={() => onDelete(entry)} className="grid size-7 place-items-center rounded border border-border text-muted hover:border-red-500/40 hover:text-red-400">×</button>
        </div>
      </td>
    </tr>
  );
}

function ConfirmationDeleteModal({ entry, onClose, onDeleted }: { entry: HackConfirmationEntry; onClose: () => void; onDeleted: (id: string) => void; }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const res = await adminDeleteConfirmation(entry.id);
      if (res.success) { onDeleted(entry.id); onClose(); }
      else { setError(res.error ?? "Failed to delete confirmation entry."); }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => !isPending && onClose()} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-red-500/30 bg-surface/95 p-6 shadow-[0_0_60px_-15px_rgba(239,68,68,0.25)] backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">Delete Confirmation</h3>
            <p className="mt-1 text-sm text-muted">Are you sure you want to delete the confirmation for {entry.email} (Voucher: {entry.voucherCode})?</p>
          </div>
        </div>
        {error && <div className="mt-4 text-xs text-red-400">{error}</div>}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} disabled={isPending} className="rounded-lg border px-4 py-2 text-xs text-muted">Cancel</button>
          <button type="button" onClick={handleDelete} disabled={isPending} className="rounded-lg bg-red-500/20 border border-red-500/40 px-4 py-2 text-xs text-red-400 hover:bg-red-500/30">
            {isPending ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmationEditModal({ entry, initialMode, onClose, onSaved, onDeleteRequest }: { entry: HackConfirmationEntry; initialMode: "verify" | "edit"; onClose: () => void; onSaved: (e: HackConfirmationEntry) => void; onDeleteRequest: (e: HackConfirmationEntry) => void; }) {
  const [status, setStatus] = useState<"pending" | "verified">(initialMode === "verify" ? "verified" : entry.status);
  const [confirmationHash, setConfirmationHash] = useState(entry.confirmationHash || (initialMode === "verify" ? generateConfirmationHash() : ""));
  const [securityProtocol, setSecurityProtocol] = useState(entry.securityProtocol || "SHA256-XIP // ZERO-KNOWLEDGE");
  const [remarks, setRemarks] = useState(entry.remarks || "");
  const [percentageLevel, setPercentageLevel] = useState<number>(entry.percentageLevel ?? 85);
  const [amountToReceive, setAmountToReceive] = useState<number>(entry.amountToReceive ?? 0);
  const [walletAccount, setWalletAccount] = useState(entry.walletAccount || "");
  const [loaderCode, setLoaderCode] = useState(entry.loaderCode || "");
  const [securityLevel, setSecurityLevel] = useState<number>(entry.securityLevel ?? 1);
  const [emailSentLocal, setEmailSentLocal] = useState(entry.emailSent ?? false);

  const [state, formAction, pending] = useActionState(adminUpdateConfirmation, INITIAL_CONFIRMATION_STATE);

  useEffect(() => {
    if (state?.success && state.entry) {
      onSaved(state.entry);
      onClose();
    }
  }, [state, onSaved, onClose]);

  const isVerifiedMode = status === "verified";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-surface/95 p-6 shadow-[0_0_80px_-20px_rgba(34,211,238,0.25)] backdrop-blur-md">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="font-mono text-xs text-muted-2">Confirmation Entry ID: {entry.id}</p>
            <h3 className="text-base font-semibold text-foreground">{isVerifiedMode ? "Verify & Release Confirmation" : "Edit Confirmation"}</h3>
          </div>
          <button type="button" onClick={onClose} className="grid size-7 place-items-center rounded border text-muted hover:text-foreground">×</button>
        </div>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={entry.id} />
          <input type="hidden" name="status" value={status} />
          <input type="hidden" name="emailSent" value={emailSentLocal ? "true" : "false"} />

          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setStatus("pending")} className={`rounded-lg border px-3 py-2 font-mono text-xs ${status === "pending" ? "bg-amber-400/10 text-amber-400" : "text-muted"}`}>⏳ Pending</button>
            <button type="button" onClick={() => { setStatus("verified"); if (!confirmationHash) setConfirmationHash(generateConfirmationHash()); }} className={`rounded-lg border px-3 py-2 font-mono text-xs ${status === "verified" ? "bg-cyan/10 text-cyan" : "text-muted"}`}>✓ Verified</button>
          </div>

          <div><label className="mb-1 block font-mono text-xs text-muted">Email Address</label><input name="email" type="email" required defaultValue={entry.email} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-xs text-foreground" /></div>
          <div><label className="mb-1 block font-mono text-xs text-muted">Voucher Code</label><input name="voucherCode" type="text" required defaultValue={entry.voucherCode} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-xs text-foreground" /></div>
          <div><label className="mb-1 block font-mono text-xs text-muted">Xinterphrase Code</label><input name="xinterphraseCode" type="text" required defaultValue={entry.xinterphraseCode} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-xs text-foreground" /></div>
          
          <div className="rounded-xl border border-cyan/20 bg-cyan/[0.03] p-4 space-y-3.5 mt-4">
             <div className="grid grid-cols-2 gap-3">
               <div>
                  <label className="mb-1 block font-mono text-xs text-muted">Percentage Level (%)</label>
                  <input name="percentageLevel" type="number" min={0} max={100} value={percentageLevel} onChange={(e) => setPercentageLevel(Number(e.target.value))} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-xs text-foreground" />
               </div>
               <div>
                  <label className="mb-1 block font-mono text-xs text-muted">Security Level (1-10)</label>
                  <input name="securityLevel" type="number" min={1} max={10} value={securityLevel} onChange={(e) => setSecurityLevel(Number(e.target.value))} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-xs text-foreground" />
               </div>
             </div>
             <div className="grid grid-cols-2 gap-3">
               <div>
                  <label className="mb-1 block font-mono text-xs text-muted">Amount to Receive ($)</label>
                  <input name="amountToReceive" type="number" step="0.01" value={amountToReceive} onChange={(e) => setAmountToReceive(Number(e.target.value))} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-xs text-foreground" />
               </div>
               <div>
                  <label className="mb-1 block font-mono text-xs text-muted">Wallet Account</label>
                  <input name="walletAccount" type="text" value={walletAccount} onChange={(e) => setWalletAccount(e.target.value)} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-xs text-foreground" />
               </div>
             </div>
             <div>
                <label className="mb-1 block font-mono text-xs text-muted">Loader Code</label>
                <input name="loaderCode" type="text" value={loaderCode} onChange={(e) => setLoaderCode(e.target.value)} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-xs uppercase text-foreground" />
             </div>
             <div>
                <label className="mb-1 block font-mono text-xs text-muted">Confirmation Hash</label>
                <input name="confirmationHash" type="text" value={confirmationHash} onChange={(e) => setConfirmationHash(e.target.value)} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-xs text-foreground" />
             </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-4 py-3 mt-4">
            <span className="font-mono text-xs text-muted">Email Sent</span>
            <button type="button" onClick={() => setEmailSentLocal(!emailSentLocal)} className={`relative h-6 w-11 rounded-full border transition-all ${emailSentLocal ? "border-cyan/60 bg-cyan/20" : "border-border bg-surface-2"}`}>
              <span className={`absolute top-0.5 left-0.5 size-5 rounded-full transition-all ${emailSentLocal ? "translate-x-5 bg-cyan" : "bg-muted-2"}`} />
            </button>
          </div>

          {state && !state.success && <div className="mt-4 text-xs text-red-400">{state.error}</div>}

          <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/50">
            <button type="button" onClick={() => { onClose(); onDeleteRequest(entry); }} className="text-xs text-red-400 hover:bg-red-500/10 px-3 py-2 rounded-lg">Delete</button>
            <div className="flex gap-2.5">
              <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 text-xs text-muted">Cancel</button>
              <button type="submit" disabled={pending} className="rounded-lg bg-cyan px-5 py-2 text-xs font-semibold text-background">
                {pending ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
