"use server";

import { redirect } from "next/navigation";
import { ApiError, login, register, requestVerificationCode } from "@/lib/api";
import { clearSessionToken, setSessionToken } from "@/lib/session";

export interface ActionState {
  error?: string;
  success?: boolean;
}

export async function requestCodeAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "");
  try {
    await requestVerificationCode(email);
    return { success: true };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Could not send verification code." };
  }
}

export async function registerAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const payload = {
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    code: String(formData.get("code") ?? ""),
  };

  let auth;
  try {
    auth = await register(payload);
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Registration failed." };
  }

  await setSessionToken(auth.token);
  // The ?signup=1 param lets the dashboard fire a one-time "signup_completed" analytics
  // event client-side (this server action can't call the browser-only analytics module).
  redirect("/dashboard?signup=1");
}

export async function loginAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  let auth;
  try {
    auth = await login(email, password);
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Login failed." };
  }

  await setSessionToken(auth.token);
  redirect("/dashboard");
}

export async function logoutAction() {
  await clearSessionToken();
  redirect("/login");
}
