"use client";

import { useActionState, useState, useEffect, useTransition } from "react";
import type { HackDoneEntry } from "@/lib/hack-done-store";
import { adminUpdateHackDone, adminDeleteHackDone, sendHackDoneEmailAction, type AdminHackDoneUpdateResult } from "../actions";

const INITIAL_HACK_DONE_STATE: AdminHackDoneUpdateResult | null = null;

function formatDate(iso: string | Date) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function HackDoneView({ initialEntries }: { initialEntries: HackDoneEntry[] }) {
  const [entries, setEntries] = useState(initialEntries);
  const [editingTarget, setEditingTarget] = useState<HackDoneEntry | null>(null);
  const [deletingTarget, setDeletingTarget] = useState<HackDoneEntry | null>(null);
  
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
    return e.email.toLowerCase().includes(q) || e.voucherCode.toLowerCase().includes(q) || e.id.toLowerCase().includes(q);
  });

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const paginatedEntries = filteredEntries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const pendingCount = entries.filter((e) => e.status === "pending").length;
  const verifiedCount = entries.filter((e) => e.status === "verified").length;

  return (
    <>
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Hack Done", value: entries.length, color: "text-foreground" },
          { label: "Pending", value: pendingCount, color: "text-amber-400" },
          { label: "Verified", value: verifiedCount, color: "text-amber-500" },
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4 text-amber-500"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            <span className="font-mono text-xs uppercase tracking-widest text-muted">Hack Done Directory</span>
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
                placeholder="Search email, voucher…"
                className="w-full sm:w-56 rounded-lg border border-border bg-surface-2 px-3 py-1.5 font-mono text-xs text-foreground placeholder:text-muted-2 focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/20"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground text-xs">✕</button>
              )}
            </div>
          </div>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="py-16 text-center font-mono text-sm text-muted">
            {search || statusFilter !== "all" ? <p>No Hack Done submissions match your search criteria.</p> : <p>No Hack Done entries yet.</p>}
          </div>
        ) : (
          <div>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-surface/20">
                    {["Status", "Email", "Voucher Code", "Generated Code", "Email Sent", "Submitted", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-2">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedEntries.map((e) => (
                    <HackDoneRow key={e.id} entry={e} onEdit={(entry) => setEditingTarget(entry)} onDelete={setDeletingTarget} />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-border">
              {paginatedEntries.map((e) => (
                <div key={e.id} className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider mb-2 ${
                        e.status === "pending" ? "border-amber-400/40 bg-amber-400/10 text-amber-400" : "border-amber-500/40 bg-amber-500/10 text-amber-500"
                      }`}>
                        {e.status}
                      </span>
                      <p className="font-mono text-xs font-semibold text-foreground truncate">{e.email}</p>
                      <p className="font-mono text-xs text-amber-400 mt-1">{e.voucherCode}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                    <span className="font-mono text-[10px] text-muted-2">{formatDate(e.submittedAt)}</span>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingTarget(e)} className="rounded-md border border-border bg-surface px-2 py-1 font-mono text-[10px] text-muted">Edit</button>
                      <button onClick={() => setDeletingTarget(e)} className="rounded-md border border-red-500/30 px-2 py-1 font-mono text-[10px] text-red-400">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
        <HackDoneEditModal
          entry={editingTarget}
          onClose={() => setEditingTarget(null)}
          onSaved={(updated) => setEntries(prev => prev.map(e => e.id === updated.id ? updated : e))}
          onDeleteRequest={(entry) => { setEditingTarget(null); setDeletingTarget(entry); }}
        />
      )}

      {deletingTarget && (
        <HackDoneDeleteModal
          entry={deletingTarget}
          onClose={() => setDeletingTarget(null)}
          onDeleted={(id) => setEntries(prev => prev.filter(e => e.id !== id))}
        />
      )}
    </>
  );
}

function HackDoneRow({ entry, onEdit, onDelete }: { entry: HackDoneEntry; onEdit: (entry: HackDoneEntry) => void; onDelete: (entry: HackDoneEntry) => void; }) {
  const isPending = entry.status === "pending";
  return (
    <tr className={`border-b border-border transition-colors hover:bg-surface-2/50 ${isPending ? "bg-amber-400/[0.02]" : ""}`}>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${isPending ? "border-amber-400/40 bg-amber-400/10 text-amber-400" : "border-amber-500/40 bg-amber-500/10 text-amber-500"}`}>
          {entry.status}
        </span>
      </td>
      <td className="px-4 py-3 font-mono text-xs text-foreground font-medium max-w-[180px] truncate">{entry.email}</td>
      <td className="px-4 py-3 font-mono text-xs text-amber-400 font-bold uppercase whitespace-nowrap">{entry.voucherCode}</td>
      <td className="px-4 py-3 font-mono text-xs text-muted whitespace-nowrap">{entry.generatedCode}</td>
      <td className="px-4 py-3 whitespace-nowrap"><span className={`font-mono text-xs ${entry.emailSent ? "text-cyan" : "text-muted-2"}`}>{entry.emailSent ? "✓ Sent" : "—"}</span></td>
      <td className="px-4 py-3 font-mono text-xs text-muted-2 whitespace-nowrap">{formatDate(entry.submittedAt)}</td>
      <td className="px-4 py-3 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-2">
          <button type="button" onClick={() => onEdit(entry)} className="rounded border border-border bg-surface-2 px-2.5 py-1 font-mono text-xs text-muted hover:text-foreground">Edit</button>
          <button type="button" onClick={() => onDelete(entry)} className="grid size-7 place-items-center rounded border border-border text-muted hover:border-red-500/40 hover:text-red-400">×</button>
        </div>
      </td>
    </tr>
  );
}

function HackDoneEditModal({ entry, onClose, onSaved, onDeleteRequest }: { entry: HackDoneEntry; onClose: () => void; onSaved: (updated: HackDoneEntry) => void; onDeleteRequest: (entry: HackDoneEntry) => void; }) {
  const [status, setStatus] = useState<"pending" | "verified">(entry.status);
  const [remarks, setRemarks] = useState(entry.remarks || "");
  const [emailSentLocal, setEmailSentLocal] = useState(entry.emailSent);
  const [state, formAction, pending] = useActionState(adminUpdateHackDone, INITIAL_HACK_DONE_STATE);

  useEffect(() => {
    if (state?.success && state.entry) {
      onSaved(state.entry);
      onClose();
    }
  }, [state, onSaved, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-surface/95 p-6 shadow-[0_0_80px_-20px_rgba(245,158,11,0.25)] backdrop-blur-md">
        <div className="mb-6 flex items-start justify-between">
          <div><p className="font-mono text-xs text-muted-2">Hack Done Entry ID: {entry.id}</p><h3 className="text-base font-semibold text-foreground mt-0.5">{entry.email}</h3></div>
          <button type="button" onClick={onClose} className="grid size-7 place-items-center rounded border border-border text-muted hover:text-foreground">×</button>
        </div>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={entry.id} />
          <input type="hidden" name="status" value={status} />
          <input type="hidden" name="emailSent" value={emailSentLocal ? "true" : "false"} />

          <div className="rounded-xl border border-border bg-surface/50 p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><p className="font-mono text-[11px] text-muted mb-1">Voucher Code</p><p className="font-mono text-xs text-amber-400 font-bold uppercase">{entry.voucherCode}</p></div>
              <div><p className="font-mono text-[11px] text-muted mb-1">Generated Code</p><p className="font-mono text-xs text-foreground uppercase">{entry.generatedCode}</p></div>
              <div className="col-span-2"><p className="font-mono text-[11px] text-muted mb-1">Loader Code</p><p className="font-mono text-xs text-foreground uppercase">{entry.loaderCode}</p></div>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button type="button" onClick={() => setStatus("pending")} className={`rounded-lg border px-3 py-2 font-mono text-xs font-semibold ${status === "pending" ? "bg-amber-400/10 text-amber-400 border-amber-400" : "text-muted"}`}>⏳ Pending</button>
              <button type="button" onClick={() => setStatus("verified")} className={`rounded-lg border px-3 py-2 font-mono text-xs font-semibold ${status === "verified" ? "bg-amber-500/10 text-amber-500 border-amber-500" : "text-muted"}`}>✓ Verified</button>
            </div>
          </div>

          <div><label className="mb-1 block font-mono text-xs text-muted">Remarks / Admin Notes</label><textarea name="remarks" rows={2} value={remarks} onChange={(e) => setRemarks(e.target.value)} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-xs text-foreground resize-none" /></div>

          <div className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-4 py-3">
            <div><p className="font-mono text-xs text-muted">Email Status</p></div>
            <button type="button" onClick={() => setEmailSentLocal(!emailSentLocal)} className={`relative h-6 w-11 rounded-full border transition-all ${emailSentLocal ? "border-amber-500/60 bg-amber-500/20" : "border-border bg-surface-2"}`}><span className={`absolute top-0.5 left-0.5 size-5 rounded-full transition-all ${emailSentLocal ? "translate-x-5 bg-amber-400" : "bg-muted-2"}`} /></button>
          </div>

          {state && !state.success && <div className="mt-4 text-xs text-red-400">{state.error}</div>}

          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <button type="button" onClick={() => { onClose(); onDeleteRequest(entry); }} className="text-xs text-red-400 hover:underline">Delete</button>
            <div className="flex gap-2.5">
              <button type="button" onClick={onClose} className="rounded-lg border border-border bg-surface/50 px-4 py-2 font-mono text-xs text-muted">Cancel</button>
              <button type="submit" disabled={pending} className="rounded-lg bg-amber-500 px-5 py-2 font-mono text-xs font-semibold text-background">{pending ? "Saving…" : "Save Changes"}</button>
            </div>
          </div>
        </form>
        <HackDoneSendEmailButton entry={entry} onEmailSent={onSaved} />
      </div>
    </div>
  );
}

function HackDoneDeleteModal({ entry, onClose, onDeleted }: { entry: HackDoneEntry; onClose: () => void; onDeleted: (id: string) => void; }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const res = await adminDeleteHackDone(entry.id);
      if (res.success) { onDeleted(entry.id); onClose(); }
      else setError(res.error ?? "Failed to delete.");
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => !isPending && onClose()} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-red-500/30 bg-surface/95 p-6 shadow-[0_0_60px_-15px_rgba(239,68,68,0.25)] backdrop-blur-md">
        <h3 className="text-base font-semibold text-foreground">Delete Hack Done Entry</h3>
        <p className="mt-2 text-sm text-muted">Permanently delete submission for <span className="font-mono text-foreground">{entry.email}</span>?</p>
        {error && <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 font-mono text-xs text-red-400">{error}</div>}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} disabled={isPending} className="rounded-lg border border-border px-4 py-2 font-mono text-xs text-muted">Cancel</button>
          <button type="button" onClick={handleDelete} disabled={isPending} className="rounded-lg bg-red-600 px-4 py-2 font-mono text-xs font-semibold text-white hover:bg-red-500">{isPending ? "Deleting…" : "Yes, Delete"}</button>
        </div>
      </div>
    </div>
  );
}

function HackDoneSendEmailButton({ entry, onEmailSent }: { entry: HackDoneEntry; onEmailSent: (updated: HackDoneEntry) => void; }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSend = () => {
    setStatus("sending"); setErrorMsg(null);
    startTransition(async () => {
      const res = await sendHackDoneEmailAction(entry.id);
      if (res.success) { setStatus("sent"); onEmailSent({ ...entry, emailSent: true }); }
      else { setStatus("error"); setErrorMsg(res.error ?? "Failed to send email."); }
    });
  };

  return (
    <div className="mt-4 rounded-xl border border-border bg-surface/50 px-4 py-3">
      <div className="flex items-center justify-between">
        <div><p className="font-mono text-xs text-muted">Send Receipt Email</p></div>
        <button type="button" onClick={handleSend} disabled={isPending || status === "sending"} className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-xs font-semibold ${status === "sent" ? "border border-green-500/40 bg-green-500/10 text-green-400" : "border border-amber-500/40 bg-amber-500/10 text-amber-400"}`}>
          {status === "sending" ? "Sending…" : status === "sent" ? "✓ Sent" : "✉ Send"}
        </button>
      </div>
      {status === "error" && errorMsg && <p className="mt-2 font-mono text-[11px] text-red-400">{errorMsg}</p>}
    </div>
  );
}
