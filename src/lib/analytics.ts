"use client";

/**
 * Pluggable analytics call site. No real provider is wired up yet (#19 follow-up) — this
 * no-ops in production and logs to the console in development, so every event call site in
 * the app is already in place and doesn't need to change when a real provider is added later.
 * To wire one up: call the provider's script/capture function from inside `track()` (e.g.
 * `window.plausible?.(event, { props: properties })` for Plausible, `posthog.capture(event,
 * properties)` for PostHog, `window.gtag?.('event', event, properties)` for GA) — every
 * existing call site keeps working unchanged.
 */
export function track(event: string, properties?: Record<string, unknown>) {
  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event, properties ?? {});
  }
}
