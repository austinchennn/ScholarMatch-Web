"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { track } from "@/lib/analytics";

// Fires the signup_completed event once, then strips ?signup=1 from the URL so a page
// refresh/back-navigation doesn't double-count it.
export function SignupTracker() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("signup") === "1") {
      track("signup_completed");
      router.replace("/dashboard");
    }
  }, [searchParams, router]);

  return null;
}
