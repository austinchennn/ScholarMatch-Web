"use server";

import { getNotifications, markNotificationRead, type Notification } from "@/lib/api";
import { requireSessionToken } from "@/lib/session";

export async function fetchNotificationsAction(): Promise<Notification[]> {
  const token = await requireSessionToken();
  return getNotifications(token);
}

export async function markNotificationReadAction(notificationId: string): Promise<Notification> {
  const token = await requireSessionToken();
  return markNotificationRead(token, notificationId);
}
