"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  disableScholarAction,
  enableScholarAction,
  fetchAdminScholarsAction,
} from "@/app/actions/admin";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function AdminDashboard() {
  const queryClient = useQueryClient();
  const scholarsQuery = useQuery({
    queryKey: ["admin", "scholars"],
    queryFn: fetchAdminScholarsAction,
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin", "scholars"] });
  }

  const disableMutation = useMutation({
    mutationFn: disableScholarAction,
    onSuccess: invalidate,
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Could not disable account."),
  });

  const enableMutation = useMutation({
    mutationFn: enableScholarAction,
    onSuccess: invalidate,
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Could not enable account."),
  });

  if (scholarsQuery.isLoading) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  if (scholarsQuery.isError) {
    const message =
      scholarsQuery.error instanceof ApiError && scholarsQuery.error.status === 403
        ? "You don't have admin access."
        : "Could not load scholars.";
    return <p className="text-sm text-destructive">{message}</p>;
  }

  const scholars = scholarsQuery.data ?? [];

  return (
    <div className="flex flex-col gap-2">
      {scholars.map((scholar) => (
        <div
          key={scholar.scholarId}
          className="flex items-center justify-between gap-3 rounded-lg border p-3"
        >
          <div>
            <p className="text-sm font-medium">
              {scholar.firstName} {scholar.lastName}{" "}
              {scholar.isAdmin && <Badge variant="secondary">Admin</Badge>}
              {scholar.disabled && <Badge variant="destructive">Disabled</Badge>}
            </p>
            <p className="text-sm text-muted-foreground">
              {scholar.email}
              {scholar.institution ? ` · ${scholar.institution}` : ""}
            </p>
          </div>
          {!scholar.isAdmin && (
            <Button
              size="sm"
              variant="outline"
              disabled={disableMutation.isPending || enableMutation.isPending}
              onClick={() =>
                scholar.disabled
                  ? enableMutation.mutate(scholar.scholarId)
                  : disableMutation.mutate(scholar.scholarId)
              }
            >
              {scholar.disabled ? "Enable" : "Disable"}
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
