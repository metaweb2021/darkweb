"use server";

import {
  adminUpdateEntry,
  adminDeleteEntry,
  markAllNotificationsSeen,
  type HackCheckEntry,
} from "@/lib/hack-check-store";
import {
  adminUpdateConfirmationEntry,
  adminDeleteConfirmationEntry,
  markAllConfirmationNotificationsSeen,
  type HackConfirmationEntry,
} from "@/lib/hack-confirmation-store";
import {
  adminUpdateHackDoneEntry,
  adminDeleteHackDoneEntry,
  markHackDoneNotificationsAsSeen,
  getHackDoneEntryById,
  setHackDoneEmailSent,
  type HackDoneEntry,
} from "@/lib/hack-done-store";
import {
  adminUpdateVoucherConfirmationEntry,
  adminDeleteVoucherConfirmationEntry,
  markVoucherConfirmationNotificationsAsSeen,
  getVoucherConfirmationEntryById,
  setVoucherConfirmationEmailSent,
  type VoucherConfirmationEntry,
} from "@/lib/voucher-confirmation-store";
import { revalidatePath } from "next/cache";

export type AdminUpdateResult =
  | { success: true; entry: HackCheckEntry }
  | { success: false; error: string };

export type AdminDeleteResult =
  | { success: true }
  | { success: false; error: string };

export async function adminUpdate(
  _prevState: AdminUpdateResult | null,
  formData: FormData
): Promise<AdminUpdateResult> {
  const id = (formData.get("id") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const wallet = (formData.get("wallet") as string | null)?.trim() ?? "";
  const status = (formData.get("status") as string | null)?.trim() as "pending" | "verified" | undefined;

  const voucherValue = (formData.get("voucherValue") as string | null)?.trim() ?? "";
  const successfulRateRaw = formData.get("successfulRate");
  const processingTime = (formData.get("processingTime") as string | null)?.trim() ?? "";
  const amountMinRaw = formData.get("amountMin");
  const amountMaxRaw = formData.get("amountMax");
  const securityCode = (formData.get("securityCode") as string | null)?.trim() ?? "";
  const emailSent = formData.get("emailSent") === "true";

  if (!id) return { success: false, error: "Missing entry ID." };
  if (!email) return { success: false, error: "Email address is required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Invalid email address format." };
  }
  if (!wallet) return { success: false, error: "Wallet name or type is required." };
  if (status !== "pending" && status !== "verified") {
    return { success: false, error: "Status must be either pending or verified." };
  }

  // If status is verified, the verification fields are strictly required
  if (status === "verified") {
    if (!voucherValue) return { success: false, error: "Voucher value is required for verified status." };
    if (!processingTime) return { success: false, error: "Processing time is required for verified status." };
    if (!securityCode) return { success: false, error: "Security code is required for verified status." };
  }

  let successfulRate: number | null = null;
  if (successfulRateRaw !== null && successfulRateRaw !== "") {
    const num = Number(successfulRateRaw);
    if (isNaN(num) || num < 0 || num > 100) {
      return { success: false, error: "Successful rate must be a number between 0 and 100." };
    }
    successfulRate = num;
  } else if (status === "verified") {
    return { success: false, error: "Successful rate is required for verified status." };
  }

  let amountMin: number | null = null;
  let amountMax: number | null = null;
  if (amountMinRaw !== null && amountMinRaw !== "" && amountMaxRaw !== null && amountMaxRaw !== "") {
    const min = Number(amountMinRaw);
    const max = Number(amountMaxRaw);
    if (isNaN(min) || isNaN(max) || min > max) {
      return { success: false, error: "Amount range is invalid (min must be less than or equal to max)." };
    }
    amountMin = min;
    amountMax = max;
  } else if (status === "verified") {
    return { success: false, error: "Expected amount range is required for verified status." };
  }

  try {
    const updated = await adminUpdateEntry(id, {
      email,
      wallet,
      status,
      voucherValue: voucherValue || null,
      successfulRate,
      processingTime: processingTime || null,
      amountMin,
      amountMax,
      securityCode: securityCode || null,
      emailSent,
    });

    if (!updated) {
      return { success: false, error: "Entry not found." };
    }

    revalidatePath("/admin");
    revalidatePath("/hack-check/result");
    return { success: true, entry: updated };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { success: false, error: err.message };
    }
    return { success: false, error: "Failed to save. Please try again." };
  }
}

export async function adminDelete(id: string): Promise<AdminDeleteResult> {
  const trimmedId = id?.trim();
  if (!trimmedId) return { success: false, error: "Missing entry ID." };

  try {
    const deleted = await adminDeleteEntry(trimmedId);
    if (!deleted) {
      return { success: false, error: "Entry not found or already deleted." };
    }

    revalidatePath("/admin");
    revalidatePath("/hack-check/result");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete entry. Please try again." };
  }
}

export async function markSeen(): Promise<void> {
  await Promise.all([
    markAllNotificationsSeen(),
    markAllConfirmationNotificationsSeen(),
    markHackDoneNotificationsAsSeen(),
    markVoucherConfirmationNotificationsAsSeen(),
  ]);
  revalidatePath("/admin");
}

export type AdminConfirmationUpdateResult =
  | { success: true; entry: HackConfirmationEntry }
  | { success: false; error: string };

export async function adminUpdateConfirmation(
  _prevState: AdminConfirmationUpdateResult | null,
  formData: FormData
): Promise<AdminConfirmationUpdateResult> {
  const id = (formData.get("id") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const voucherCode = (formData.get("voucherCode") as string | null)?.trim() ?? "";
  const xinterphraseCode = (formData.get("xinterphraseCode") as string | null)?.trim() ?? "";
  const status = (formData.get("status") as string | null)?.trim() as "pending" | "verified" | undefined;
  const confirmationHash = (formData.get("confirmationHash") as string | null)?.trim() ?? "";
  const securityProtocol = (formData.get("securityProtocol") as string | null)?.trim() ?? "";
  const remarks = (formData.get("remarks") as string | null)?.trim() ?? "";

  // New admin-populated fields
  const percentageLevelRaw = formData.get("percentageLevel");
  const amountToReceiveRaw = formData.get("amountToReceive");
  const walletAccount = (formData.get("walletAccount") as string | null)?.trim() ?? "";
  const loaderCode = (formData.get("loaderCode") as string | null)?.trim() ?? "";
  const securityLevelRaw = formData.get("securityLevel");
  const emailSent = formData.get("emailSent") === "true";

  if (!id) return { success: false, error: "Missing entry ID." };
  if (!email) return { success: false, error: "Email is required." };
  if (!voucherCode) return { success: false, error: "Voucher Code is required." };
  if (!xinterphraseCode) return { success: false, error: "Xinterphrase Code is required." };
  if (status !== "pending" && status !== "verified") {
    return { success: false, error: "Status must be pending or verified." };
  }

  let percentageLevel: number | null = null;
  if (percentageLevelRaw !== null && percentageLevelRaw !== "") {
    const n = Number(percentageLevelRaw);
    if (isNaN(n) || n < 0 || n > 100) return { success: false, error: "Percentage level must be 0–100." };
    percentageLevel = n;
  }

  let amountToReceive: number | null = null;
  if (amountToReceiveRaw !== null && amountToReceiveRaw !== "") {
    const n = Number(amountToReceiveRaw);
    if (isNaN(n) || n < 0) return { success: false, error: "Amount to receive must be a positive number." };
    amountToReceive = n;
  }

  let securityLevel: number | null = null;
  if (securityLevelRaw !== null && securityLevelRaw !== "") {
    const n = Number(securityLevelRaw);
    if (isNaN(n) || n < 0) return { success: false, error: "Security level must be a positive number." };
    securityLevel = n;
  }

  try {
    const updated = await adminUpdateConfirmationEntry(id, {
      email,
      voucherCode,
      xinterphraseCode,
      status,
      confirmationHash: confirmationHash || null,
      securityProtocol: securityProtocol || null,
      remarks: remarks || null,
      percentageLevel,
      amountToReceive,
      walletAccount: walletAccount || null,
      loaderCode: loaderCode || null,
      securityLevel,
      emailSent,
    });

    if (!updated) {
      return { success: false, error: "Confirmation entry not found." };
    }

    revalidatePath("/admin");
    return { success: true, entry: updated };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to update confirmation entry." };
  }
}

export async function adminDeleteConfirmation(id: string): Promise<AdminDeleteResult> {
  const trimmedId = id?.trim();
  if (!trimmedId) return { success: false, error: "Missing entry ID." };

  try {
    const deleted = await adminDeleteConfirmationEntry(trimmedId);
    if (!deleted) {
      return { success: false, error: "Confirmation entry not found or already deleted." };
    }

    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete confirmation entry." };
  }
}

// ----------------------------------------------------------------------------
// Hack Done
// ----------------------------------------------------------------------------
export type AdminHackDoneUpdateResult =
  | { success: true; entry: HackDoneEntry }
  | { success: false; error: string };

export async function adminUpdateHackDone(
  _prevState: AdminHackDoneUpdateResult | null,
  formData: FormData
): Promise<AdminHackDoneUpdateResult> {
  const id = (formData.get("id") as string | null)?.trim() ?? "";
  const status = (formData.get("status") as string | null)?.trim() as "pending" | "verified" | undefined;
  const remarks = (formData.get("remarks") as string | null)?.trim() ?? "";
  const emailSent = formData.get("emailSent") === "true";

  if (!id) return { success: false, error: "Missing entry ID." };
  if (status !== "pending" && status !== "verified") {
    return { success: false, error: "Status must be pending or verified." };
  }

  try {
    const updated = await adminUpdateHackDoneEntry(id, {
      status,
      remarks: remarks || null,
      emailSent,
    });
    revalidatePath("/admin");
    return { success: true, entry: updated };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to update hack done entry." };
  }
}

export async function adminDeleteHackDone(id: string): Promise<AdminDeleteResult> {
  if (!id) return { success: false, error: "Missing entry ID." };
  try {
    await adminDeleteHackDoneEntry(id);
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete hack done entry." };
  }
}

// ----------------------------------------------------------------------------
// Voucher Confirmation
// ----------------------------------------------------------------------------
export type AdminVoucherConfirmationUpdateResult =
  | { success: true; entry: VoucherConfirmationEntry }
  | { success: false; error: string };

export async function adminUpdateVoucherConfirmation(
  _prevState: AdminVoucherConfirmationUpdateResult | null,
  formData: FormData
): Promise<AdminVoucherConfirmationUpdateResult> {
  const id = (formData.get("id") as string | null)?.trim() ?? "";
  const status = (formData.get("status") as string | null)?.trim() as "pending" | "verified" | undefined;
  const remarks = (formData.get("remarks") as string | null)?.trim() ?? "";
  const emailSent = formData.get("emailSent") === "true";

  if (!id) return { success: false, error: "Missing entry ID." };
  if (status !== "pending" && status !== "verified") {
    return { success: false, error: "Status must be pending or verified." };
  }

  try {
    const updated = await adminUpdateVoucherConfirmationEntry(id, {
      status,
      remarks: remarks || null,
      emailSent,
    });
    revalidatePath("/admin");
    return { success: true, entry: updated };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to update voucher confirmation entry." };
  }
}

export async function adminDeleteVoucherConfirmation(id: string): Promise<AdminDeleteResult> {
  if (!id) return { success: false, error: "Missing entry ID." };
  try {
    await adminDeleteVoucherConfirmationEntry(id);
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete voucher confirmation entry." };
  }
}

// ----------------------------------------------------------------------------
// Email Actions (Nodemailer)
// ----------------------------------------------------------------------------

export type SendEmailResult =
  | { success: true }
  | { success: false; error: string };

export async function sendHackDoneEmailAction(id: string): Promise<SendEmailResult> {
  if (!id) return { success: false, error: "Missing entry ID." };

  try {
    const { sendHackDoneReceiptEmail } = await import("@/lib/mailer");

    const entry = await getHackDoneEntryById(id);
    if (!entry) return { success: false, error: "Entry not found." };

    await sendHackDoneReceiptEmail(entry);

    // Mark emailSent = true
    await setHackDoneEmailSent(id, true);
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    console.error("sendHackDoneEmailAction error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to send email." };
  }
}

export async function sendVoucherConfirmationEmailAction(id: string): Promise<SendEmailResult> {
  if (!id) return { success: false, error: "Missing entry ID." };

  try {
    const { sendVoucherConfirmationReceiptEmail } = await import("@/lib/mailer");

    const entry = await getVoucherConfirmationEntryById(id);
    if (!entry) return { success: false, error: "Entry not found." };

    await sendVoucherConfirmationReceiptEmail(entry);

    // Mark emailSent = true
    await setVoucherConfirmationEmailSent(id, true);
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    console.error("sendVoucherConfirmationEmailAction error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to send email." };
  }
}


