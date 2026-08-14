"use server";

import { redirect } from "next/navigation";
import { getNotifications, markNotificationRead, type Notification } from "@/lib/api";
import { getSessionToken } from "@/lib/session";

async function requireToken(): Promise<string> {
  const token = await getSessionToken();
  if (!token) {
    redirect("/login");
  }
  return token;
}

export async function fetchNotificationsAction(): Promise<Notification[]> {
  const token = await requireToken();
  return getNotifications(token);
}

export async function markNotificationReadAction(notificationId: string): Promise<Notification> {
  const token = await requireToken();
  return markNotificationRead(token, notificationId);
}
