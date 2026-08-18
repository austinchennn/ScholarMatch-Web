import { requireSessionToken } from "@/lib/session";
import { AccountSettingsForm } from "./AccountSettingsForm";

export default async function SettingsPage() {
  await requireSessionToken();

  return (
    <div className="mx-auto w-full max-w-lg">
      <h1 className="mb-8 text-2xl font-semibold">Account settings</h1>
      <AccountSettingsForm />
    </div>
  );
}
