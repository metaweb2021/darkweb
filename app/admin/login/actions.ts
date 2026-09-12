"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type LoginResult =
  | { success: true }
  | { success: false; error: string };

export async function adminLogin(
  _prevState: LoginResult | null,
  formData: FormData
): Promise<LoginResult> {
  const username = (formData.get("username") as string | null)?.trim() ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  if (!username || !password) {
    return { success: false, error: "Username and password are required." };
  }

  const user = await prisma.adminUser.findUnique({ where: { username } });

  if (!user) {
    return { success: false, error: "Invalid credentials." };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { success: false, error: "Invalid credentials." };
  }

  // Update last login timestamp
  await prisma.adminUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // Set a signed HTTP-only session cookie (1 day)
  const cookieStore = await cookies();
  cookieStore.set("admin_session", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });

  redirect("/admin");
}

export async function adminLogout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}
