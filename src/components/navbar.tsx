"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessagesSquare, Search, Briefcase } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { ScholarAvatar } from "@/components/scholar-avatar";
import { NotificationBell } from "@/app/(app)/notifications/NotificationBell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/matches", label: "Matches", icon: MessagesSquare },
  { href: "/postings", label: "Postings", icon: Briefcase },
  { href: "/search", label: "Search", icon: Search },
] as const;

export function Navbar({
  name,
  avatarUrl,
}: {
  name: string;
  avatarUrl?: string | null;
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-1 px-4">
        <Link href="/dashboard" className="mr-2 flex shrink-0 items-center">
          <Image src="/logo.png" alt="ScholarMatch" width={30} height={30} priority />
        </Link>

        <nav className="flex flex-1 items-center gap-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-14 min-w-16 flex-col items-center justify-center gap-0.5 border-b-2 px-2 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground",
                  isActive
                    ? "border-foreground text-foreground"
                    : "border-transparent"
                )}
              >
                <Icon className="size-5" strokeWidth={isActive ? 2.25 : 1.75} />
                <span className="hidden sm:block">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1">
          <NotificationBell compact />
          <DropdownMenu>
            <DropdownMenuTrigger className="ml-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <ScholarAvatar name={name} avatarUrl={avatarUrl} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>{name}</DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link href="/profile/edit">Edit profile</Link>} />
              <DropdownMenuItem render={<Link href="/applications">My applications</Link>} />
              <DropdownMenuItem render={<Link href="/postings/mine">My postings</Link>} />
              <DropdownMenuItem render={<Link href="/billing">Billing</Link>} />
              <DropdownMenuItem render={<Link href="/settings">Settings</Link>} />
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => logoutAction()}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
