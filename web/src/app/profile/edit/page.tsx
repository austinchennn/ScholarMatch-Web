import { redirect } from "next/navigation";
import { ApiError, getProfile, type ScholarProfile } from "@/lib/api";
import { getSessionToken } from "@/lib/session";
import { ProfileEditForm } from "./ProfileEditForm";

async function loadProfile(token: string): Promise<ScholarProfile> {
  try {
    return await getProfile(token);
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect("/login");
    }
    throw err;
  }
}

export default async function ProfileEditPage() {
  const token = await getSessionToken();
  if (!token) {
    redirect("/login");
  }

  const profile = await loadProfile(token);

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <h1 className="mb-1 text-2xl font-semibold">Edit profile</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        This information is used to rank your recommendations — the more complete, the better your matches.
      </p>
      <ProfileEditForm profile={profile} />
    </div>
  );
}
