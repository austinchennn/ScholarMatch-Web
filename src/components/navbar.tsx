"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, MessagesSquare, Search, Briefcase } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { ScholarAvatar } from "@/components/scholar-avatar";
import { NotificationBell } from "@/app/(app)/notifications/NotificationBell";
import { Input } from "@/components/ui/input";
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
] as const;

function NavbarSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xs shrink-0">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search scholars…"
        aria-label="Search scholars"
        className="h-10 rounded-full bg-muted/60 pl-9 dark:bg-muted/40"
      />
    </form>
  );
}

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
      <div className="mx-auto flex h-20 max-w-6xl items-center gap-4 px-4">
        <Link href="/dashboard" className="flex shrink-0 items-center">
          <Image src="/logo.png" alt="ScholarMatch" width={40} height={40} priority />
        </Link>

        <NavbarSearch />

        <nav className="flex flex-1 items-center justify-center gap-1">
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
                  "flex h-20 min-w-20 flex-col items-center justify-center gap-1 border-b-2 px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
                  isActive
                    ? "border-foreground text-foreground"
                    : "border-transparent"
                )}
              >
                <Icon className="size-6" strokeWidth={isActive ? 2.25 : 1.75} />
                <span className="hidden sm:block">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <NotificationBell compact />
          <DropdownMenu>
            <DropdownMenuTrigger className="ml-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <ScholarAvatar name={name} avatarUrl={avatarUrl} size="lg" />
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
