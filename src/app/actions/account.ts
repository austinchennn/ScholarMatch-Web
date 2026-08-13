"use server";

import { redirect } from "next/navigation";
import {
  changeEmail,
  changePassword,
  deleteAccount,
  requestEmailChangeCode,
} from "@/lib/api";
import { clearSessionToken, getSessionToken } from "@/lib/session";

async function requireToken(): Promise<string> {
  const token = await getSessionToken();
  if (!token) {
    redirect("/login");
  }
  return token;
}

export async function requestEmailChangeCodeAction(newEmail: string): Promise<void> {
  const token = await requireToken();
  await requestEmailChangeCode(token, newEmail);
}

export async function changeEmailAction(
  newEmail: string,
  verificationCode: string,
  currentPassword: string
) {
  const token = await requireToken();
  return changeEmail(token, newEmail, verificationCode, currentPassword);
}

export async function changePasswordAction(
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string
): Promise<void> {
  const token = await requireToken();
  await changePassword(token, currentPassword, newPassword, confirmNewPassword);
}

export async function deleteAccountAction(): Promise<void> {
  const token = await requireToken();
  await deleteAccount(token);
  await clearSessionToken();
  redirect("/");
}
