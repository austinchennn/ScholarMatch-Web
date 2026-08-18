import { getProfile } from "@/lib/api";
import { requireSessionToken, withAuthRedirect } from "@/lib/session";
import { ProfileEditForm } from "./ProfileEditForm";

export default async function ProfileEditPage() {
  const token = await requireSessionToken();
  const profile = await withAuthRedirect(() => getProfile(token));

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="mb-1 text-2xl font-semibold">Edit profile</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        This information is used to rank your recommendations — the more complete, the better your matches.
      </p>
      <ProfileEditForm profile={profile} />
    </div>
  );
}
