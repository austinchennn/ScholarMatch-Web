"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScholarAvatar } from "@/components/scholar-avatar";
import { formatEnumLabel } from "@/lib/enums";
import { cn } from "@/lib/utils";
import type { ConversationPartner } from "@/lib/api";

export function dedupeByScholarId(
  conversations: ConversationPartner[]
): ConversationPartner[] {
  const seen = new Set<string>();
  return conversations.filter((conversation) => {
    if (seen.has(conversation.scholarId)) return false;
    seen.add(conversation.scholarId);
    return true;
  });
}

export function MatchesSidebar({
  conversations: rawConversations,
}: {
  conversations: ConversationPartner[];
}) {
  const pathname = usePathname();
  const conversations = dedupeByScholarId(rawConversations);

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r bg-card">
      <h1 className="border-b px-4 py-4 text-lg font-semibold">Chats</h1>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">
            No chats yet — head to{" "}
            <Link href="/dashboard" className="underline">
              Home
            </Link>{" "}
            to find collaborators.
          </p>
        ) : (
          conversations.map((conversation) => {
            const isActive = pathname === `/matches/${conversation.scholarId}`;
            const name = `${conversation.firstName} ${conversation.lastName}`;
            return (
              <Link
                key={conversation.scholarId}
                href={`/matches/${conversation.scholarId}`}
                className={cn(
                  "flex items-center gap-3 border-b px-4 py-3 transition-colors hover:bg-muted",
                  isActive && "bg-muted"
                )}
              >
                <ScholarAvatar name={name} avatarUrl={conversation.avatarUrl} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{name}</p>
                  {(conversation.institution || conversation.researchField) && (
                    <p className="truncate text-xs text-muted-foreground">
                      {conversation.institution}
                      {conversation.institution && conversation.researchField ? " · " : ""}
                      {conversation.researchField &&
                        formatEnumLabel(conversation.researchField)}
                    </p>
                  )}
                  {conversation.relationship === "APPLICATION" && (
                    <p className="truncate text-xs text-muted-foreground">via posting</p>
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
