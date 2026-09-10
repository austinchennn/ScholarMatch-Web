import { getProfile, ServiceUnavailableError } from "@/lib/api";
import { requireSessionToken, withAuthRedirect } from "@/lib/session";
import { Navbar } from "@/components/navbar";
import { BackendUnavailable } from "@/components/backend-unavailable";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const token = await requireSessionToken();

  let profile;
  try {
    profile = await withAuthRedirect(() => getProfile(token));
  } catch (err) {
    // The backend never answered (redeploy window, restart, network blip) — every page under
    // this layout would otherwise crash into the generic error boundary. Degrade to a calm,
    // retryable notice instead. Anything else (including withAuthRedirect's redirect) re-throws.
    if (err instanceof ServiceUnavailableError) {
      return <BackendUnavailable />;
    }
    throw err;
  }

  const name = `${profile.firstName} ${profile.lastName}`;
  const avatarUrl = profile.avatarUrl ?? null;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <Navbar name={name} avatarUrl={avatarUrl} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
