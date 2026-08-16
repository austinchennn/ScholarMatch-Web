import { request } from "./client";

export interface Notification {
  notificationId: string;
  type: string;
  message: string;
  relatedId?: string | null;
  read: boolean;
  createdAt: string;
}

export function getNotifications(token: string) {
  return request<Notification[]>("/api/notifications", { token });
}

export function markNotificationRead(token: string, notificationId: string) {
  return request<Notification>(`/api/notifications/${notificationId}/read`, {
    method: "POST",
    token,
  });
}
