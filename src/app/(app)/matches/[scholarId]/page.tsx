import { getProfile, getPublicProfile } from "@/lib/api";
import { requireSessionToken, withAuthRedirect } from "@/lib/session";
import { ChatView } from "./ChatView";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ scholarId: string }>;
}) {
  const { scholarId } = await params;
  const token = await requireSessionToken();
  const { me, other } = await withAuthRedirect(async () => {
    const [me, other] = await Promise.all([
      getProfile(token),
      getPublicProfile(scholarId, token),
    ]);
    return { me, other };
  });

  return (
    <ChatView
      currentScholarId={me.scholarId}
      otherScholarId={scholarId}
      otherName={other.displayName}
      otherAvatarUrl={other.avatarUrl}
    />
  );
}
