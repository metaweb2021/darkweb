"use server";

import { cookies } from "next/headers";
import { upsertByEmailAndWallet, type HackCheckEntry } from "@/lib/hack-check-store";

export type SubmitResult =
  | { success: true; entry: HackCheckEntry; isNew: boolean }
  | { success: false; error: string };

export async function submitHackCheck(
  _prevState: SubmitResult | null,
  formData: FormData
): Promise<SubmitResult> {
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const wallet = (formData.get("wallet") as string | null)?.trim() ?? "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }
  if (!wallet) {
    return { success: false, error: "Please select a crypto wallet." };
  }

  try {
    const { entry, isNew } = await upsertByEmailAndWallet(email, wallet);

    // Ensure no persistent cookies remain
    const cookieStore = await cookies();
    cookieStore.delete("dweb_case_id");

    return { success: true, entry, isNew };
  } catch (err: unknown) {
    console.error("submitHackCheck error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Storage error. Please try again.",
    };
  }
}
