import { prisma } from "./prisma";
import type { VoucherConfirmationEntry as PrismaVoucherConfirmationEntry, VoucherConfirmationNotification } from "@prisma/client";

export type VoucherConfirmationEntry = {
  id: string;
  email: string;
  voucherCode: string;
  voucherType: string;
  voucherValue: string;
  submittedAt: string | Date;
  status: "pending" | "verified";

  // Admin fields
  remarks: string | null;
  verifiedAt: string | Date | null;
  emailSent: boolean;
};

// ============================================================================
// 1. Core Logic (Server Actions)
// ============================================================================

export async function upsertVoucherConfirmation(
  email: string,
  voucherCode: string,
  voucherType: string,
  voucherValue: string,
): Promise<{ entry: VoucherConfirmationEntry; isNew: boolean }> {
  const normEmail = email.toLowerCase().trim();
  const normVoucher = voucherCode.toUpperCase().trim();
  const normType = voucherType.trim();
  const normValue = voucherValue.trim();

  // 1. Check if entry already exists (Fetch)
  const existing = await prisma.voucherConfirmationEntry.findFirst({
    where: {
      email: normEmail,
      voucherCode: normVoucher,
      voucherType: normType,
    },
  });

  if (existing) {
    return { entry: existing, isNew: false };
  }

  // 2. Store new entry if it doesn't exist (Create)
  try {
    const created = await prisma.voucherConfirmationEntry.create({
      data: {
        email: normEmail,
        voucherCode: normVoucher,
        voucherType: normType,
        voucherValue: normValue,
        status: "pending",
        notification: {
          create: { seenByAdmin: false },
        },
      },
    });

    return { entry: created, isNew: true };
  } catch (error: any) {
    if (error.code === "P2002") {
      const refetched = await prisma.voucherConfirmationEntry.findFirst({
        where: {
          email: normEmail,
          voucherCode: normVoucher,
          voucherType: normType,
        },
      });

      if (refetched) {
        return { entry: refetched, isNew: false };
      }
    }
    throw error;
  }
}

// ============================================================================
// 2. Admin UI / Client Fetching
// ============================================================================

export async function getVoucherConfirmationEntryByEmailAndVoucher(
  email: string,
  voucherCode: string
): Promise<VoucherConfirmationEntry | null> {
  const normEmail = email.toLowerCase().trim();
  const normVoucher = voucherCode.toUpperCase().trim();

  return prisma.voucherConfirmationEntry.findFirst({
    where: {
      email: normEmail,
      voucherCode: normVoucher,
    },
    orderBy: { submittedAt: 'desc' },
  });
}

export async function getVoucherConfirmationEntries() {
  const entries = await prisma.voucherConfirmationEntry.findMany({
    orderBy: { submittedAt: "desc" },
    include: { notification: true },
  }) as (PrismaVoucherConfirmationEntry & { notification: VoucherConfirmationNotification | null })[];

  return entries.map((entry) => ({
    ...entry,
    hasUnseenNotification: entry.notification?.seenByAdmin === false,
  }));
}

export async function markVoucherConfirmationNotificationsAsSeen() {
  return prisma.voucherConfirmationNotification.updateMany({
    where: { seenByAdmin: false },
    data: { seenByAdmin: true },
  });
}

export async function getUnseenVoucherConfirmationCount(): Promise<number> {
  return prisma.voucherConfirmationNotification.count({
    where: { seenByAdmin: false },
  });
}

// ============================================================================
// 3. Admin Mutations
// ============================================================================

export async function adminUpdateVoucherConfirmationEntry(
  id: string,
  data: {
    status: "pending" | "verified";
    remarks: string | null;
    emailSent?: boolean;
  },
) {
  const isVerified = data.status === "verified";
  
  return prisma.voucherConfirmationEntry.update({
    where: { id },
    data: {
      status: data.status,
      remarks: data.remarks,
      ...(data.emailSent !== undefined ? { emailSent: data.emailSent } : {}),
      verifiedAt: isVerified ? new Date() : null,
    },
  });
}

export async function adminDeleteVoucherConfirmationEntry(id: string) {
  return prisma.voucherConfirmationEntry.delete({
    where: { id },
  });
}

export async function getVoucherConfirmationEntryById(id: string): Promise<VoucherConfirmationEntry | null> {
  return prisma.voucherConfirmationEntry.findUnique({
    where: { id },
  });
}

export async function setVoucherConfirmationEmailSent(id: string, emailSent: boolean = true) {
  return prisma.voucherConfirmationEntry.update({
    where: { id },
    data: { emailSent },
  });
}
