"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchConversationAction, sendMessageAction } from "@/app/actions/messages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScholarAvatar } from "@/components/scholar-avatar";
import { MessageBubble } from "./MessageBubble";
import type { Message } from "@/lib/api";

const POLL_INTERVAL_MS = 5000;

function dedupeAndSortMessages(messages: Message[]): Message[] {
  const seen = new Set<string>();
  return messages
    .filter((message) => {
      if (seen.has(message.messageId)) return false;
      seen.add(message.messageId);
      return true;
    })
    .sort((a, b) => a.sentAt.localeCompare(b.sentAt));
}

export function ChatView({
  currentScholarId,
  otherScholarId,
  otherName,
  otherAvatarUrl,
}: {
  currentScholarId: string;
  otherScholarId: string;
  otherName: string;
  otherAvatarUrl?: string | null;
}) {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");

  const conversationQuery = useQuery({
    queryKey: ["conversation", otherScholarId],
    queryFn: () => fetchConversationAction(otherScholarId),
    refetchInterval: POLL_INTERVAL_MS,
  });

  const sendMutation = useMutation({
    mutationFn: (content: string) => sendMessageAction(otherScholarId, content),
    onSuccess: () => {
      setDraft("");
      queryClient.invalidateQueries({ queryKey: ["conversation", otherScholarId] });
    },
    onError: () => toast.error("Could not send that message."),
  });

  function handleSend() {
    const content = draft.trim();
    if (!content) return;
    sendMutation.mutate(content);
  }

  const messages = dedupeAndSortMessages(conversationQuery.data ?? []);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center gap-2 border-b px-6 py-4">
        <Link
          href={`/scholars/${otherScholarId}`}
          className="flex items-center gap-2 text-base font-semibold hover:underline"
        >
          <ScholarAvatar name={otherName} avatarUrl={otherAvatarUrl} size="sm" />
          {otherName}
        </Link>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-6 py-4">
        {conversationQuery.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading conversation…</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">Say hello — you two matched!</p>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.messageId}
              content={message.content}
              isMine={message.senderId === currentScholarId}
            />
          ))
        )}
      </div>

      <div className="flex gap-2 border-t px-6 py-4">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Write a message…"
        />
        <Button onClick={handleSend} disabled={sendMutation.isPending || !draft.trim()}>
          Send
        </Button>
      </div>
    </div>
  );
}
