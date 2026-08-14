import { redirect } from "next/navigation";
import { ApiError, getProfile } from "@/lib/api";
import { getSessionToken } from "@/lib/session";
import { Navbar } from "@/components/navbar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const token = await getSessionToken();
  if (!token) {
    redirect("/login");
  }

  let name = "";
  let avatarUrl: string | null = null;
  try {
    const profile = await getProfile(token);
    name = `${profile.firstName} ${profile.lastName}`;
    avatarUrl = profile.avatarUrl ?? null;
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect("/login");
    }
    throw err;
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <Navbar name={name} avatarUrl={avatarUrl} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
