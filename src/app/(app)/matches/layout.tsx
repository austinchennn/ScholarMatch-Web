import { fetchConversationsAction } from "@/app/actions/messages";
import { withAuthRedirect } from "@/lib/session";
import { MatchesSidebar } from "./MatchesSidebar";

export default async function MatchesLayout({ children }: { children: React.ReactNode }) {
  const conversations = await withAuthRedirect(fetchConversationsAction);

  return (
    <div className="flex h-[calc(100vh-7.5rem)] min-h-[420px] overflow-hidden rounded-xl ring-1 ring-foreground/10">
      <MatchesSidebar conversations={conversations} />
      <div className="flex min-w-0 flex-1 flex-col bg-card">{children}</div>
    </div>
  );
}
