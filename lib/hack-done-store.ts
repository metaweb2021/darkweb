import { prisma } from "./prisma";
import type { HackDoneEntry as PrismaHackDoneEntry, HackDoneNotification } from "@prisma/client";

export type HackDoneEntry = {
  id: string;
  email: string;
  voucherCode: string;
  generatedCode: string;
  loaderCode: string;
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

export async function upsertHackDone(
  email: string,
  voucherCode: string,
  generatedCode: string,
  loaderCode: string,
): Promise<{ entry: HackDoneEntry; isNew: boolean }> {
  const normEmail = email.toLowerCase().trim();
  const normVoucher = voucherCode.toUpperCase().trim();
  const normGen = generatedCode.toUpperCase().trim();
  const normLoader = loaderCode.toUpperCase().trim();

  // 1. Check if entry already exists (Fetch)
  const existing = await prisma.hackDoneEntry.findFirst({
    where: {
      email: normEmail,
      voucherCode: normVoucher,
      generatedCode: normGen,
    },
  });

  if (existing) {
    return { entry: existing, isNew: false };
  }

  // 2. Store new entry if it doesn't exist (Create)
  try {
    const created = await prisma.hackDoneEntry.create({
      data: {
        email: normEmail,
        voucherCode: normVoucher,
        generatedCode: normGen,
        loaderCode: normLoader,
        status: "pending",
        notification: {
          create: { seenByAdmin: false },
        },
      },
    });

    return { entry: created, isNew: true };
  } catch (error: any) {
    if (error.code === "P2002") {
      const refetched = await prisma.hackDoneEntry.findFirst({
        where: {
          email: normEmail,
          voucherCode: normVoucher,
          generatedCode: normGen,
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

export async function getHackDoneEntryByEmailAndVoucher(
  email: string,
  voucherCode: string
): Promise<HackDoneEntry | null> {
  const normEmail = email.toLowerCase().trim();
  const normVoucher = voucherCode.toUpperCase().trim();

  return prisma.hackDoneEntry.findFirst({
    where: {
      email: normEmail,
      voucherCode: normVoucher,
    },
    orderBy: { submittedAt: 'desc' },
  });
}

export async function getHackDoneEntries() {
  const entries = await prisma.hackDoneEntry.findMany({
    orderBy: { submittedAt: "desc" },
    include: { notification: true },
  }) as (PrismaHackDoneEntry & { notification: HackDoneNotification | null })[];

  return entries.map((entry) => ({
    ...entry,
    hasUnseenNotification: entry.notification?.seenByAdmin === false,
  }));
}

export async function markHackDoneNotificationsAsSeen() {
  return prisma.hackDoneNotification.updateMany({
    where: { seenByAdmin: false },
    data: { seenByAdmin: true },
  });
}

export async function getUnseenHackDoneCount(): Promise<number> {
  return prisma.hackDoneNotification.count({
    where: { seenByAdmin: false },
  });
}

// ============================================================================
// 3. Admin Mutations
// ============================================================================

export async function adminUpdateHackDoneEntry(
  id: string,
  data: {
    status: "pending" | "verified";
    remarks: string | null;
    emailSent?: boolean;
  },
) {
  const isVerified = data.status === "verified";
  
  return prisma.hackDoneEntry.update({
    where: { id },
    data: {
      status: data.status,
      remarks: data.remarks,
      ...(data.emailSent !== undefined ? { emailSent: data.emailSent } : {}),
      verifiedAt: isVerified ? new Date() : null,
    },
  });
}

export async function adminDeleteHackDoneEntry(id: string) {
  return prisma.hackDoneEntry.delete({
    where: { id },
  });
}

export async function getHackDoneEntryById(id: string): Promise<HackDoneEntry | null> {
  return prisma.hackDoneEntry.findUnique({
    where: { id },
  });
}

export async function setHackDoneEmailSent(id: string, emailSent: boolean = true) {
  return prisma.hackDoneEntry.update({
    where: { id },
    data: { emailSent },
  });
}
