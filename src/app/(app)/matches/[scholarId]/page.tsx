import { redirect } from "next/navigation";
import { ApiError, getProfile, getPublicProfile } from "@/lib/api";
import { getSessionToken } from "@/lib/session";
import { ChatView } from "./ChatView";

async function loadChatContext(token: string, scholarId: string) {
  try {
    const [me, other] = await Promise.all([
      getProfile(token),
      getPublicProfile(scholarId, token),
    ]);
    return { me, other };
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect("/login");
    }
    throw err;
  }
}

export default async function ChatPage({
  params,
}: {
  params: Promise<{ scholarId: string }>;
}) {
  const { scholarId } = await params;
  const token = await getSessionToken();
  if (!token) {
    redirect("/login");
  }

  const { me, other } = await loadChatContext(token, scholarId);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col">
      <ChatView
        currentScholarId={me.scholarId}
        otherScholarId={scholarId}
        otherName={other.displayName}
        otherAvatarUrl={other.avatarUrl}
      />
    </div>
  );
}
