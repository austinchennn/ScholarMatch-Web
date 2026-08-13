"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ApiError, updateProfile, type UpdateProfilePayload } from "@/lib/api";
import { getSessionToken } from "@/lib/session";

export interface UpdateProfileResult {
  error?: string;
  success?: boolean;
}

export async function updateProfileAction(
  payload: UpdateProfilePayload
): Promise<UpdateProfileResult> {
  const token = await getSessionToken();
  if (!token) {
    redirect("/login");
  }

  try {
    await updateProfile(token, payload);
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Could not save profile." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/profile/edit");
  return { success: true };
}
