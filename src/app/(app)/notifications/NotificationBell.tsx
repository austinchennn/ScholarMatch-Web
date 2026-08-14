"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotificationsAction } from "@/app/actions/notifications";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const POLL_INTERVAL_MS = 30000;

export function NotificationBell({ compact = false }: { compact?: boolean }) {
  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotificationsAction,
    refetchInterval: POLL_INTERVAL_MS,
  });

  const unreadCount = (notificationsQuery.data ?? []).filter((n) => !n.read).length;

  if (compact) {
    return (
      <Link
        href="/notifications"
        className="relative flex h-14 min-w-14 flex-col items-center justify-center gap-0.5 px-2 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <Bell className="size-5" strokeWidth={1.75} />
        <span className="hidden sm:block">Notifications</span>
        {unreadCount > 0 && (
          <Badge className="absolute top-2 right-1 h-4 min-w-4 rounded-full px-1 text-[10px]">
            {unreadCount}
          </Badge>
        )}
      </Link>
    );
  }

  return (
    <Button
      size="sm"
      variant="outline"
      render={
        <Link href="/notifications" className={cn("flex items-center gap-1.5")}>
          Notifications
          {unreadCount > 0 && (
            <Badge className="h-4 min-w-4 rounded-full px-1 text-[10px]">{unreadCount}</Badge>
          )}
        </Link>
      }
    />
  );
}
