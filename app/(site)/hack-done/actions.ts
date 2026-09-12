"use server";

import { upsertHackDone, getHackDoneEntryByEmailAndVoucher, type HackDoneEntry } from "@/lib/hack-done-store";

export type UserHackDoneUpsertResult =
  | { success: true; entry: HackDoneEntry; isNew: boolean }
  | { success: false; error: string };

export async function userUpsertHackDone(
  email: string,
  voucherCode: string,
  generatedCode: string,
  loaderCode: string
): Promise<UserHackDoneUpsertResult> {
  try {
    const { entry, isNew } = await upsertHackDone(email, voucherCode, generatedCode, loaderCode);
    return { success: true, entry, isNew };
  } catch (error: any) {
    console.error("userUpsertHackDone error:", error);
    return { success: false, error: error.message || "Failed to process hack done submission." };
  }
}

export async function userGetHackDoneEntry(
  email: string,
  voucherCode: string
): Promise<{ success: true; entry: HackDoneEntry } | { success: false; error: string }> {
  try {
    const entry = await getHackDoneEntryByEmailAndVoucher(email, voucherCode);
    if (!entry) {
      return { success: false, error: "Submission not found." };
    }
    return { success: true, entry };
  } catch (error: any) {
    return { success: false, error: "Failed to fetch submission status." };
  }
}
