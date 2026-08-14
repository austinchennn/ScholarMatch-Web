import { redirect } from "next/navigation";
import { getSessionToken } from "@/lib/session";
import { AccountSettingsForm } from "./AccountSettingsForm";

export default async function SettingsPage() {
  const token = await getSessionToken();
  if (!token) {
    redirect("/login");
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      <h1 className="mb-8 text-2xl font-semibold">Account settings</h1>
      <AccountSettingsForm />
    </div>
  );
}
