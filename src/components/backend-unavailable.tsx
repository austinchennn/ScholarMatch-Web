"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

// Shown by a server component (a layout, usually) that couldn't load its data because the
// ScholarMatch backend never answered — a redeploy window, a restart, a brief network blip.
// Distinct from the generic `error.tsx` boundary on purpose: this state is expected, transient,
// and self-heals, so it gets calmer copy and a retry that just re-runs the server render
// instead of the alarming "Something went wrong".
export function BackendUnavailable() {
  const router = useRouter();
  const [retrying, setRetrying] = useState(false);

  return (
    <div className="flex min-h-[60vh] flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h1 className="text-xl font-semibold">Can’t reach the server</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        ScholarMatch’s server didn’t respond just now. This is usually brief — try again in a
        moment.
      </p>
      <Button
        className="mt-2"
        disabled={retrying}
        onClick={() => {
          setRetrying(true);
          router.refresh();
          // router.refresh() doesn't return a promise; clear the pending state after a beat so
          // the button doesn't stay stuck if the refresh lands on this same component again.
          setTimeout(() => setRetrying(false), 3000);
        }}
      >
        {retrying ? "Retrying…" : "Try again"}
      </Button>
    </div>
  );
}
