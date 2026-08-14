"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMyApplicationsAction } from "@/app/actions/postings";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const STATUS_VARIANT = {
  PENDING: "outline",
  ACCEPTED: "default",
  REJECTED: "secondary",
} as const;

export function MyApplications() {
  const applicationsQuery = useQuery({
    queryKey: ["applications", "mine"],
    queryFn: fetchMyApplicationsAction,
  });

  if (applicationsQuery.isLoading) {
    return <p className="text-sm text-muted-foreground">Loading your applications…</p>;
  }

  if (applicationsQuery.isError) {
    return <p className="text-sm text-destructive">Could not load your applications.</p>;
  }

  const applications = applicationsQuery.data ?? [];

  if (applications.length === 0) {
    return <p className="text-sm text-muted-foreground">You haven&apos;t applied to any postings yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {applications.map((application) => (
        <Card key={application.applicationId}>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-base">
                {application.postingTitle ?? "Posting removed"}
              </CardTitle>
              <CardDescription>{application.posterName ?? "Unknown poster"}</CardDescription>
            </div>
            <Badge variant={STATUS_VARIANT[application.status]}>{application.status}</Badge>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
