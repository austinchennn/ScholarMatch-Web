import { requireSessionToken } from "@/lib/session";
import { NotificationsList } from "./NotificationsList";

export default async function NotificationsPage() {
  await requireSessionToken();

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="mb-8 text-2xl font-semibold">Notifications</h1>
      <NotificationsList />
    </div>
  );
}
