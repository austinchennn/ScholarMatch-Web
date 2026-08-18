"use server";

import { revalidatePath } from "next/cache";
import { apiErrorMessage, updateProfile, type UpdateProfilePayload } from "@/lib/api";
import { requireSessionToken } from "@/lib/session";

export interface UpdateProfileResult {
  error?: string;
  success?: boolean;
}

export async function updateProfileAction(
  payload: UpdateProfilePayload
): Promise<UpdateProfileResult> {
  const token = await requireSessionToken();

  try {
    await updateProfile(token, payload);
  } catch (err) {
    return { error: apiErrorMessage(err, "Could not save profile.") };
  }

  revalidatePath("/dashboard");
  revalidatePath("/profile/edit");
  return { success: true };
}
