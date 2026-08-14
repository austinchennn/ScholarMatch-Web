"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchNotificationsAction, markNotificationReadAction } from "@/app/actions/notifications";
import type { Notification } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

function linkFor(notification: Notification): string {
  switch (notification.type) {
    case "MATCH":
    case "MESSAGE":
      return notification.relatedId ? `/matches/${notification.relatedId}` : "/matches";
    case "APPLICATION":
      return "/postings/mine";
    case "APPLICATION_ACCEPTED":
    case "APPLICATION_REJECTED":
      return "/applications";
    default:
      return "/dashboard";
  }
}

export function NotificationsList() {
  const queryClient = useQueryClient();
  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotificationsAction,
  });

  const markReadMutation = useMutation({
    mutationFn: markNotificationReadAction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  if (notificationsQuery.isLoading) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  if (notificationsQuery.isError) {
    return <p className="text-sm text-destructive">Could not load notifications.</p>;
  }

  const notifications = notificationsQuery.data ?? [];

  if (notifications.length === 0) {
    return <p className="text-sm text-muted-foreground">No notifications yet.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {notifications.map((notification) => (
        <Link
          key={notification.notificationId}
          href={linkFor(notification)}
          onClick={() => {
            if (!notification.read) markReadMutation.mutate(notification.notificationId);
          }}
        >
          <Card
            className={
              notification.read ? "transition-colors hover:bg-muted/50" : "border-primary/50 bg-primary/5 transition-colors hover:bg-primary/10"
            }
          >
            <CardContent className="flex items-center justify-between gap-3">
              <p className="text-sm">{notification.message}</p>
              {!notification.read && <Badge>New</Badge>}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
