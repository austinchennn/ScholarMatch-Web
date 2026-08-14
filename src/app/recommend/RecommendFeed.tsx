"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { connectAction, dislikeAction, fetchRecommendationsAction } from "@/app/actions/recommend";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
    return <p className="text-sm text-destructive">Could not load recommendations.</p>;
  }

  if (queue.length === 0) {
    if (recommendQuery.isFetching) {
      return <p className="text-sm text-muted-foreground">Loading recommendations…</p>;
    }
    return (
      <div className="flex flex-col items-center gap-4">
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
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {candidate.firstName} {candidate.lastName}
        </CardTitle>
        <CardDescription>
          {candidate.institution}
          {candidate.academicLevel ? ` · ${candidate.academicLevel}` : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {candidate.researchField && (
          <Badge variant="secondary" className="w-fit">
            {candidate.researchField}
          </Badge>
        )}
        {candidate.researchDescription && (
          <p className="text-sm">{candidate.researchDescription}</p>
        )}
        {candidate.researchInterests && candidate.researchInterests.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {candidate.researchInterests.map((interest) => (
              <Badge key={interest} variant="outline">
                {interest}
              </Badge>
            ))}
          </div>
        )}
        <div className="mt-2 flex justify-between gap-2">
          <Button variant="outline" onClick={() => handleDislike(candidate.scholarId)}>
            Dislike
          </Button>
          <Button variant="ghost" onClick={() => handleSkip(candidate.scholarId)}>
            Skip
          </Button>
          <Button onClick={() => handleConnect(candidate.scholarId)}>Connect</Button>
        </div>
      </CardContent>
    </Card>
  );
}
