"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { connectAction, dislikeAction, fetchRecommendationsAction } from "@/app/actions/recommend";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { ScholarCard } from "@/components/scholar-card";

export function RecommendFeed() {
  const queryClient = useQueryClient();
  const [consumedIds, setConsumedIds] = useState<Set<string>>(new Set());

  const recommendQuery = useQuery({
    queryKey: ["recommend"],
    queryFn: fetchRecommendationsAction,
  });

  const queue = (recommendQuery.data ?? []).filter(
    (candidate) => !consumedIds.has(candidate.scholarId)
  );

  function consume(scholarId: string) {
    if (queue.length <= 1) {
      setConsumedIds(new Set());
      queryClient.invalidateQueries({ queryKey: ["recommend"] });
    } else {
      setConsumedIds((prev) => new Set(prev).add(scholarId));
    }
  }

  const connectMutation = useMutation({
    mutationFn: connectAction,
    onSuccess: (result) => {
      track("connect_sent");
      if (result.matched) {
        track("match_made");
        toast.success(
          result.matchedScholar
            ? `You matched with ${result.matchedScholar.firstName}!`
            : "It's a match!"
        );
      }
    },
    onError: () => toast.error("Could not connect right now."),
  });

  const dislikeMutation = useMutation({
    mutationFn: dislikeAction,
    onSuccess: () => track("dislike_sent"),
    onError: () => toast.error("Could not skip that profile."),
  });

  function handleSkip(scholarId: string) {
    consume(scholarId);
  }

  function handleDislike(scholarId: string) {
    dislikeMutation.mutate(scholarId);
    consume(scholarId);
  }

  function handleConnect(scholarId: string) {
    connectMutation.mutate(scholarId);
    consume(scholarId);
  }

  if (recommendQuery.isError) {
    return (
      <p className="mx-auto text-sm text-destructive">Could not load recommendations.</p>
    );
  }

  if (queue.length === 0) {
    if (recommendQuery.isFetching) {
      return (
        <p className="mx-auto text-sm text-muted-foreground">Loading recommendations…</p>
      );
    }
    return (
      <div className="mx-auto flex flex-col items-center gap-4 py-6">
        <p className="text-sm text-muted-foreground">
          No more recommendations right now — check back later.
        </p>
        <Button
          variant="outline"
          onClick={() => queryClient.invalidateQueries({ queryKey: ["recommend"] })}
        >
          Refresh
        </Button>
      </div>
    );
  }

  const candidate = queue[0];

  return (
    <ScholarCard
      className="mx-auto w-full max-w-md"
      name={`${candidate.firstName} ${candidate.lastName}`}
      avatarUrl={candidate.avatarUrl}
      institution={candidate.institution}
      academicLevel={candidate.academicLevel}
      researchField={candidate.researchField}
      researchDescription={candidate.researchDescription}
      researchInterests={candidate.researchInterests}
      actions={
        <div className="mt-2 flex justify-between gap-2">
          <Button variant="outline" onClick={() => handleDislike(candidate.scholarId)}>
            Dislike
          </Button>
          <Button
            variant="outline"
            className="text-muted-foreground"
            onClick={() => handleSkip(candidate.scholarId)}
          >
            Skip
          </Button>
          <Button onClick={() => handleConnect(candidate.scholarId)}>Connect</Button>
        </div>
      }
    />
  );
}
