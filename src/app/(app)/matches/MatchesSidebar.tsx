"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScholarAvatar } from "@/components/scholar-avatar";
import { formatEnumLabel } from "@/lib/enums";
import { cn } from "@/lib/utils";
import type { ScholarProfile } from "@/lib/api";

function dedupeByScholarId(matches: ScholarProfile[]): ScholarProfile[] {
  const seen = new Set<string>();
  return matches.filter((match) => {
    if (seen.has(match.scholarId)) return false;
    seen.add(match.scholarId);
    return true;
  });
}

export function MatchesSidebar({ matches: rawMatches }: { matches: ScholarProfile[] }) {
  const pathname = usePathname();
  const matches = dedupeByScholarId(rawMatches);

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r bg-card">
      <h1 className="border-b px-4 py-4 text-lg font-semibold">Matches</h1>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {matches.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">
            No matches yet — head to{" "}
            <Link href="/dashboard" className="underline">
              Home
            </Link>{" "}
            to find collaborators.
          </p>
        ) : (
          matches.map((match) => {
            const isActive = pathname === `/matches/${match.scholarId}`;
            const name = `${match.firstName} ${match.lastName}`;
            return (
              <Link
                key={match.scholarId}
                href={`/matches/${match.scholarId}`}
                className={cn(
                  "flex items-center gap-3 border-b px-4 py-3 transition-colors hover:bg-muted",
                  isActive && "bg-muted"
                )}
              >
                <ScholarAvatar name={name} avatarUrl={match.avatarUrl} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{name}</p>
                  {(match.institution || match.researchField) && (
                    <p className="truncate text-xs text-muted-foreground">
                      {match.institution}
                      {match.institution && match.researchField ? " · " : ""}
                      {match.researchField && formatEnumLabel(match.researchField)}
                    </p>
                  )}
                </div>
              </Link>
            );
          })
        )}
      </div>
    </aside>
  );
}
