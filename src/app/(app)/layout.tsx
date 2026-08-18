import { getProfile } from "@/lib/api";
import { requireSessionToken, withAuthRedirect } from "@/lib/session";
import { Navbar } from "@/components/navbar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const token = await requireSessionToken();
  const profile = await withAuthRedirect(() => getProfile(token));
  const name = `${profile.firstName} ${profile.lastName}`;
  const avatarUrl = profile.avatarUrl ?? null;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <Navbar name={name} avatarUrl={avatarUrl} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
