"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  acceptApplicationAction,
  closePostingAction,
  declineApplicationAction,
  fetchPostingsAction,
} from "@/app/actions/postings";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
        <Card key={posting.postingId}>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>{posting.title}</CardTitle>
              <CardDescription>
                {posting.applicantCount} applicant{posting.applicantCount === 1 ? "" : "s"}
                {posting.closed ? " · closed" : ""}
              </CardDescription>
            </div>
            {!posting.closed && (
              <Button
                variant="outline"
                size="sm"
                disabled={closeMutation.isPending}
                onClick={() => closeMutation.mutate(posting.postingId)}
              >
                Close
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {posting.description && <p className="text-sm">{posting.description}</p>}
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
