"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchSubscriptionAction, startCheckoutAction } from "@/app/actions/billing";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function BillingView() {
  const subscriptionQuery = useQuery({
    queryKey: ["billing", "subscription"],
    queryFn: fetchSubscriptionAction,
  });

  const checkoutMutation = useMutation({
    mutationFn: startCheckoutAction,
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
    onError: (err) => {
      toast.error(
        err instanceof ApiError ? err.message : "Could not start checkout."
      );
    },
  });

  const status = subscriptionQuery.data?.status ?? "NONE";
  const isActive = status === "ACTIVE" || status === "TRIALING";

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>ScholarMatch Plus</CardTitle>
            <Badge variant={isActive ? "default" : "secondary"}>{status}</Badge>
          </div>
          <CardDescription>
            Unlimited postings, boosted visibility, and priority placement in the recommend
            feed. See the pricing proposal in the project docs for details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isActive && (
            <Button
              onClick={() => checkoutMutation.mutate()}
              disabled={checkoutMutation.isPending || subscriptionQuery.isLoading}
            >
              {checkoutMutation.isPending ? "Redirecting…" : "Upgrade to Plus"}
            </Button>
          )}
          {isActive && subscriptionQuery.data?.currentPeriodEnd && (
            <p className="text-sm text-muted-foreground">
              Renews {new Date(subscriptionQuery.data.currentPeriodEnd).toLocaleDateString()}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
