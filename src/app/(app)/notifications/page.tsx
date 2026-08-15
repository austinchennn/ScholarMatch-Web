import { redirect } from "next/navigation";
import { getSessionToken } from "@/lib/session";
import { NotificationsList } from "./NotificationsList";

export default async function NotificationsPage() {
  const token = await getSessionToken();
  if (!token) {
    redirect("/login");
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="mb-8 text-2xl font-semibold">Notifications</h1>
      <NotificationsList />
    </div>
  );
}
