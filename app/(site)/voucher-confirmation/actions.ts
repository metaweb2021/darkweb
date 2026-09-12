"use server";

import { upsertVoucherConfirmation, getVoucherConfirmationEntryByEmailAndVoucher, type VoucherConfirmationEntry } from "@/lib/voucher-confirmation-store";

export type UserVoucherConfirmationUpsertResult =
  | { success: true; entry: VoucherConfirmationEntry; isNew: boolean }
  | { success: false; error: string };

export async function userUpsertVoucherConfirmation(
  email: string,
  voucherCode: string,
  voucherType: string,
  voucherValue: string
): Promise<UserVoucherConfirmationUpsertResult> {
  try {
    const { entry, isNew } = await upsertVoucherConfirmation(email, voucherCode, voucherType, voucherValue);
    return { success: true, entry, isNew };
  } catch (error: any) {
    console.error("userUpsertVoucherConfirmation error:", error);
    return { success: false, error: error.message || "Failed to process voucher confirmation." };
  }
}

export async function userGetVoucherConfirmationEntry(
  email: string,
  voucherCode: string
): Promise<{ success: true; entry: VoucherConfirmationEntry } | { success: false; error: string }> {
  try {
    const entry = await getVoucherConfirmationEntryByEmailAndVoucher(email, voucherCode);
    if (!entry) {
      return { success: false, error: "Submission not found." };
    }
    return { success: true, entry };
  } catch (error: any) {
    return { success: false, error: "Failed to fetch submission status." };
  }
}
