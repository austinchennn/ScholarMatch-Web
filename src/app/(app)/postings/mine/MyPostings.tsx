"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  acceptApplicationAction,
  boostPostingAction,
  closePostingAction,
  declineApplicationAction,
  fetchPostingsAction,
  unboostPostingAction,
} from "@/app/actions/postings";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PostingCard } from "@/components/posting-card";

export function MyPostings() {
  const queryClient = useQueryClient();
  const postingsQuery = useQuery({
    queryKey: ["postings", "MINE"],
    queryFn: () => fetchPostingsAction("MINE"),
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["postings", "MINE"] });
  }

  const acceptMutation = useMutation({
    mutationFn: acceptApplicationAction,
    onSuccess: invalidate,
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Could not accept."),
  });

  const declineMutation = useMutation({
    mutationFn: declineApplicationAction,
    onSuccess: invalidate,
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Could not decline."),
  });

  const closeMutation = useMutation({
    mutationFn: closePostingAction,
    onSuccess: () => {
      toast.success("Posting closed");
      invalidate();
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Could not close posting."),
  });

  const boostMutation = useMutation({
    mutationFn: (postingId: string) => boostPostingAction(postingId),
    onSuccess: () => {
      toast.success("Posting boosted");
      invalidate();
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Could not boost posting."),
  });

  const unboostMutation = useMutation({
    mutationFn: (postingId: string) => unboostPostingAction(postingId),
    onSuccess: invalidate,
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Could not unboost posting."),
  });

  if (postingsQuery.isLoading) {
    return <p className="text-sm text-muted-foreground">Loading your postings…</p>;
  }

  if (postingsQuery.isError) {
    return <p className="text-sm text-destructive">Could not load your postings.</p>;
  }

  const postings = postingsQuery.data ?? [];

  if (postings.length === 0) {
    return <p className="text-sm text-muted-foreground">You haven&apos;t created any postings yet.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      {postings.map((posting) => (
        <PostingCard
          key={posting.postingId}
          posting={posting}
          headerActions={
            !posting.closed && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={boostMutation.isPending || unboostMutation.isPending}
                  onClick={() =>
                    posting.boosted
                      ? unboostMutation.mutate(posting.postingId)
                      : boostMutation.mutate(posting.postingId)
                  }
                >
                  {posting.boosted ? "Unboost" : "Boost"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={closeMutation.isPending}
                  onClick={() => closeMutation.mutate(posting.postingId)}
                >
                  Close
                </Button>
              </div>
            )
          }
        >
          <Separator />
          {!posting.applications || posting.applications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No applications yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {posting.applications.map((application) => (
                <div
                  key={application.applicationId}
                  className="flex items-center justify-between gap-3 rounded-lg border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{application.applicantName}</p>
                    {application.message && (
                      <p className="text-sm text-muted-foreground">{application.message}</p>
                    )}
                  </div>
                  {application.status === "PENDING" ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={declineMutation.isPending}
                        onClick={() => declineMutation.mutate(application.applicationId)}
                      >
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        disabled={acceptMutation.isPending}
                        onClick={() => acceptMutation.mutate(application.applicationId)}
                      >
                        Accept
                      </Button>
                    </div>
                  ) : (
                    <Badge variant={application.status === "ACCEPTED" ? "default" : "secondary"}>
                      {application.status}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </PostingCard>
      ))}
    </div>
  );
}
