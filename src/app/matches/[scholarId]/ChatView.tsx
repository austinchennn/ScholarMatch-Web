"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchConversationAction, sendMessageAction } from "@/app/actions/messages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const POLL_INTERVAL_MS = 5000;

export function ChatView({
  currentScholarId,
  otherScholarId,
  otherName,
}: {
  currentScholarId: string;
  otherScholarId: string;
  otherName: string;
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

  const messages = conversationQuery.data ?? [];

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center gap-2 border-b pb-4">
        <Link href="/matches" className="text-sm text-muted-foreground hover:underline">
          ← Matches
        </Link>
        <Link href={`/scholars/${otherScholarId}`} className="text-lg font-semibold hover:underline">
          {otherName}
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto py-4">
        {conversationQuery.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading conversation…</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">Say hello — you two matched!</p>
        ) : (
          messages.map((message) => {
            const isMine = message.senderId === currentScholarId;
            return (
              <div
                key={message.messageId}
                className={cn("flex", isMine ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[75%] rounded-lg px-3 py-2 text-sm",
                    isMine
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  {message.content}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex gap-2 border-t pt-4">
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
