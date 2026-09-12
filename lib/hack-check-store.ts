/**
 * Hack Check — Prisma/MySQL-backed store.
 * Drop-in async replacement for the previous file-based implementation.
 */

import { prisma } from "@/lib/prisma";
import type { HackCheckEntry as PrismaEntry, Notification as PrismaNotification } from "@prisma/client";

// ─── Public Types (kept compatible with existing callers) ─────────────────────

export type HackCheckEntry = {
  id: string;
  email: string;
  wallet: string;
  submittedAt: string; // ISO string
  status: "pending" | "verified";
  voucherValue: string | null;
  successfulRate: number | null;
  processingTime: string | null;
  amountMin: number | null;
  amountMax: number | null;
  securityCode: string | null;
  verifiedAt: string | null;
  emailSent: boolean;
};

export type Notification = {
  entryId: string;
  seenByAdmin: boolean;
  createdAt: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toEntry(e: PrismaEntry): HackCheckEntry {
  return {
    id: e.id,
    email: e.email,
    wallet: e.wallet,
    submittedAt: e.submittedAt.toISOString(),
    status: e.status as "pending" | "verified",
    voucherValue: e.voucherValue ?? null,
    successfulRate: e.successfulRate ?? null,
    processingTime: e.processingTime ?? null,
    amountMin: e.amountMin ?? null,
    amountMax: e.amountMax ?? null,
    securityCode: e.securityCode ?? null,
    verifiedAt: e.verifiedAt ? e.verifiedAt.toISOString() : null,
    emailSent: e.emailSent,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Create or fetch entry by email and wallet.
 * - If the entry already exists, fetches and returns it.
 * - If it does not exist, creates and stores the new entry with status 'pending' and an admin notification.
 */
export async function upsertByEmailAndWallet(
  email: string,
  wallet: string
): Promise<{ entry: HackCheckEntry; isNew: boolean }> {
  const cleanEmail = email.toLowerCase().trim();
  const cleanWallet = wallet.trim();

  // 1. Check if entry already exists (Fetch)
  const existing = await prisma.hackCheckEntry.findFirst({
    where: {
      email: cleanEmail,
      wallet: cleanWallet,
    },
  });

  if (existing) {
    return { entry: toEntry(existing), isNew: false };
  }

  // 2. Store new entry if it doesn't exist (Create)
  try {
    const created = await prisma.hackCheckEntry.create({
      data: {
        email: cleanEmail,
        wallet: cleanWallet,
        status: "pending",
        notification: {
          create: { seenByAdmin: false },
        },
      },
    });

    return { entry: toEntry(created), isNew: true };
  } catch (err: unknown) {
    // Handle potential concurrency race condition if created concurrently
    const refetched = await prisma.hackCheckEntry.findFirst({
      where: {
        email: cleanEmail,
        wallet: cleanWallet,
      },
    });

    if (refetched) {
      return { entry: toEntry(refetched), isNew: false };
    }

    throw err;
  }
}

/** Backwards-compatible alias for upsertByEmailAndWallet. */
export const upsertByEmail = upsertByEmailAndWallet;

/** Read a single entry by both email and wallet. */
export async function getEntryByEmailAndWallet(
  email: string,
  wallet: string
): Promise<HackCheckEntry | null> {
  const cleanEmail = email.toLowerCase().trim();
  const cleanWallet = wallet.trim();

  const entry = await prisma.hackCheckEntry.findFirst({
    where: {
      email: cleanEmail,
      wallet: cleanWallet,
    },
  });

  return entry ? toEntry(entry) : null;
}

/** Read a single entry by ID. */
export async function getEntry(id: string): Promise<HackCheckEntry | null> {
  const entry = await prisma.hackCheckEntry.findUnique({ where: { id } });
  return entry ? toEntry(entry) : null;
}

/** Get all entries sorted newest-first. */
export async function getAllEntries(): Promise<HackCheckEntry[]> {
  const entries = await prisma.hackCheckEntry.findMany({
    orderBy: { submittedAt: "desc" },
  });
  return entries.map(toEntry);
}

/** Admin update — updates email, wallet, status, and verification fields. */
export async function adminUpdateEntry(
  id: string,
  fields: {
    email?: string;
    wallet?: string;
    status?: "pending" | "verified";
    voucherValue?: string | null;
    successfulRate?: number | null;
    processingTime?: string | null;
    amountMin?: number | null;
    amountMax?: number | null;
    securityCode?: string | null;
    emailSent?: boolean;
  }
): Promise<HackCheckEntry | null> {
  try {
    const existing = await prisma.hackCheckEntry.findUnique({ where: { id } });
    if (!existing) return null;

    const newStatus = fields.status ?? existing.status;
    let verifiedAt = existing.verifiedAt;
    if (newStatus === "verified" && !verifiedAt) {
      verifiedAt = new Date();
    } else if (newStatus === "pending") {
      verifiedAt = null;
    }

    const updated = await prisma.hackCheckEntry.update({
      where: { id },
      data: {
        ...(fields.email !== undefined ? { email: fields.email.toLowerCase().trim() } : {}),
        ...(fields.wallet !== undefined ? { wallet: fields.wallet.trim() } : {}),
        status: newStatus,
        verifiedAt,
        ...(fields.voucherValue !== undefined ? { voucherValue: fields.voucherValue } : {}),
        ...(fields.successfulRate !== undefined ? { successfulRate: fields.successfulRate } : {}),
        ...(fields.processingTime !== undefined ? { processingTime: fields.processingTime } : {}),
        ...(fields.amountMin !== undefined ? { amountMin: fields.amountMin } : {}),
        ...(fields.amountMax !== undefined ? { amountMax: fields.amountMax } : {}),
        ...(fields.securityCode !== undefined ? { securityCode: fields.securityCode } : {}),
        ...(fields.emailSent !== undefined ? { emailSent: fields.emailSent } : {}),
      },
    });
    return toEntry(updated);
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2002"
    ) {
      throw new Error("An entry with this email and wallet already exists.");
    }
    return null; // record not found or update failed
  }
}

/** Admin delete — permanently removes an entry and its associated notification. */
export async function adminDeleteEntry(id: string): Promise<boolean> {
  try {
    await prisma.hackCheckEntry.delete({
      where: { id },
    });
    return true;
  } catch {
    return false;
  }
}

/** Count of unseen notifications (new pending entries). */
export async function getUnseenNotificationCount(): Promise<number> {
  return prisma.notification.count({ where: { seenByAdmin: false } });
}

/** Mark all notifications as seen. */
export async function markAllNotificationsSeen(): Promise<void> {
  await prisma.notification.updateMany({
    where: { seenByAdmin: false },
    data: { seenByAdmin: true },
  });
}

