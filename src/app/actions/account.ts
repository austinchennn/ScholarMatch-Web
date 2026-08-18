"use server";

import { redirect } from "next/navigation";
import {
  changeEmail,
  changePassword,
  deleteAccount,
  requestEmailChangeCode,
} from "@/lib/api";
import { clearSessionToken, requireSessionToken } from "@/lib/session";

export async function requestEmailChangeCodeAction(newEmail: string): Promise<void> {
  const token = await requireSessionToken();
  await requestEmailChangeCode(token, newEmail);
}

export async function changeEmailAction(
  newEmail: string,
  verificationCode: string,
  currentPassword: string
) {
  const token = await requireSessionToken();
  return changeEmail(token, newEmail, verificationCode, currentPassword);
}

export async function changePasswordAction(
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string
): Promise<void> {
  const token = await requireSessionToken();
  await changePassword(token, currentPassword, newPassword, confirmNewPassword);
}

export async function deleteAccountAction(): Promise<void> {
  const token = await requireSessionToken();
  await deleteAccount(token);
  await clearSessionToken();
  redirect("/");
}
