"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { applyToPostingAction, fetchPostingsAction } from "@/app/actions/postings";
import type { Posting } from "@/lib/api";
import { ApiError } from "@/lib/api";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PostingCard } from "@/components/posting-card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function ApplyDialog({ posting }: { posting: Posting }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const applyMutation = useMutation({
    mutationFn: () => applyToPostingAction(posting.postingId, message.trim() || undefined),
    onSuccess: () => {
      track("posting_application_sent", { postingId: posting.postingId });
      toast.success("Application sent");
      setOpen(false);
      setMessage("");
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : "Could not apply.");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" disabled={posting.full || posting.closed} />}>
        {posting.closed ? "Closed" : posting.full ? "Full" : "Apply"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply to &quot;{posting.title}&quot;</DialogTitle>
        </DialogHeader>
        <Textarea
          placeholder="Optional message to the poster…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
        />
        <DialogFooter>
          <Button onClick={() => applyMutation.mutate()} disabled={applyMutation.isPending}>
            {applyMutation.isPending ? "Sending…" : "Send application"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function PostingsBrowse() {
  const queryClient = useQueryClient();
  const postingsQuery = useQuery({
    queryKey: ["postings", "ALL_ACTIVE"],
    queryFn: () => fetchPostingsAction("ALL_ACTIVE"),
  });

  if (postingsQuery.isLoading) {
    return <p className="text-sm text-muted-foreground">Loading postings…</p>;
  }

  if (postingsQuery.isError) {
    return <p className="text-sm text-destructive">Could not load postings.</p>;
  }

  const postings = postingsQuery.data ?? [];

  if (postings.length === 0) {
    return <p className="text-sm text-muted-foreground">No open postings right now.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => queryClient.invalidateQueries({ queryKey: ["postings", "ALL_ACTIVE"] })}
        >
          Refresh
        </Button>
      </div>
      {postings.map((posting) => (
        <PostingCard key={posting.postingId} posting={posting} actions={<ApplyDialog posting={posting} />} />
      ))}
    </div>
  );
}
