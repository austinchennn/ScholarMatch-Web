"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchNotificationsAction } from "@/app/actions/notifications";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const POLL_INTERVAL_MS = 30000;

export function NotificationBell() {
  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotificationsAction,
    refetchInterval: POLL_INTERVAL_MS,
  });

  const unreadCount = (notificationsQuery.data ?? []).filter((n) => !n.read).length;

  return (
    <Button
      size="sm"
      variant="outline"
      render={
        <Link href="/notifications" className="flex items-center gap-1.5">
          Notifications
          {unreadCount > 0 && (
            <Badge className="h-4 min-w-4 rounded-full px-1 text-[10px]">{unreadCount}</Badge>
          )}
        </Link>
      }
    />
  );
}
