import { getMatches } from "@/lib/api";
import { requireSessionToken, withAuthRedirect } from "@/lib/session";
import { MatchesSidebar } from "./MatchesSidebar";

export default async function MatchesLayout({ children }: { children: React.ReactNode }) {
  const token = await requireSessionToken();
  const matches = await withAuthRedirect(() => getMatches(token));

  return (
    <div className="flex h-[calc(100vh-7.5rem)] min-h-[420px] overflow-hidden rounded-xl ring-1 ring-foreground/10">
      <MatchesSidebar matches={matches} />
      <div className="flex min-w-0 flex-1 flex-col bg-card">{children}</div>
    </div>
  );
}
