import { fetchConversationsAction } from "@/app/actions/messages";
import { withAuthRedirect } from "@/lib/session";
import { ServiceUnavailableError } from "@/lib/api";
import { MatchesSidebar } from "./MatchesSidebar";
import { BackendUnavailable } from "@/components/backend-unavailable";

export default async function MatchesLayout({ children }: { children: React.ReactNode }) {
  let conversations;
  try {
    conversations = await withAuthRedirect(fetchConversationsAction);
  } catch (err) {
    // Same treatment as the app-shell layout: a backend that never gave a usable answer
    // degrades to a retryable notice rather than crashing the whole /matches route.
    if (err instanceof ServiceUnavailableError) {
      return <BackendUnavailable />;
    }
    throw err;
  }

  return (
    <div className="flex h-[calc(100vh-7.5rem)] min-h-[420px] overflow-hidden rounded-xl ring-1 ring-foreground/10">
      <MatchesSidebar conversations={conversations} />
      <div className="flex min-w-0 flex-1 flex-col bg-card">{children}</div>
    </div>
  );
}
