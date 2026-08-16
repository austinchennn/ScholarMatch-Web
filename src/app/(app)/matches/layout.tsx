import { redirect } from "next/navigation";
import { ApiError, getMatches } from "@/lib/api";
import { getSessionToken } from "@/lib/session";
import { MatchesSidebar } from "./MatchesSidebar";

export default async function MatchesLayout({ children }: { children: React.ReactNode }) {
  const token = await getSessionToken();
  if (!token) {
    redirect("/login");
  }

  let matches;
  try {
    matches = await getMatches(token);
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect("/login");
    }
    throw err;
  }

  return (
    <div className="flex h-[calc(100vh-7.5rem)] min-h-[420px] overflow-hidden rounded-xl ring-1 ring-foreground/10">
      <MatchesSidebar matches={matches} />
      <div className="flex min-w-0 flex-1 flex-col bg-card">{children}</div>
    </div>
  );
}
