"use server";

import {
  upsertConfirmation,
  type HackConfirmationEntry,
} from "@/lib/hack-confirmation-store";

export type SubmitConfirmationResult =
  | { success: true; entry: HackConfirmationEntry; isNew: boolean }
  | { success: false; error: string };

export async function submitHackConfirmation(
  _prevState: SubmitConfirmationResult | null,
  formData: FormData
): Promise<SubmitConfirmationResult> {
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const voucherCode = (formData.get("voucherCode") as string | null)?.trim() ?? "";
  const xinterphraseCode = (formData.get("xinterphraseCode") as string | null)?.trim() ?? "";

  // Validation
  if (!email) {
    return { success: false, error: "Please enter your email address." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Please provide a valid email address." };
  }
  if (!voucherCode) {
    return { success: false, error: "Please enter your Voucher Code." };
  }
  if (voucherCode.length < 4) {
    return { success: false, error: "Voucher Code must be at least 4 characters." };
  }
  if (!xinterphraseCode) {
    return { success: false, error: "Please enter your Xinterphrase Code." };
  }
  if (xinterphraseCode.length < 4) {
    return { success: false, error: "Xinterphrase Code must be at least 4 characters." };
  }

  try {
    const { entry, isNew } = await upsertConfirmation(email, voucherCode, xinterphraseCode);
    return { success: true, entry, isNew };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to record confirmation. Please try again.";
    return { success: false, error: msg };
  }
}
