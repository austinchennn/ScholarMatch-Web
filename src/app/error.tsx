"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

// Route-level error boundary for everything below the root layout. `global-error.tsx` handles
// the rarer case of the root layout itself throwing.
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    // Surfaces in the browser console in dev and in the hosting platform's logs in production.
    // Wire this into the real analytics/error provider when #39 lands.
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        An unexpected error occurred. Trying again often clears it up.
      </p>
      {error.digest ? (
        <p className="text-xs text-muted-foreground">Reference: {error.digest}</p>
      ) : null}
      <Button className="mt-2" onClick={() => retry()}>
        Try again
      </Button>
    </div>
  );
}
