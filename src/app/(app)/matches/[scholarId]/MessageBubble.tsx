import { cn } from "@/lib/utils";
import { ScholarAvatar } from "@/components/scholar-avatar";

export function MessageBubble({
  content,
  isMine,
  senderName,
  senderAvatarUrl,
}: {
  content: string;
  isMine: boolean;
  senderName: string;
  senderAvatarUrl?: string | null;
}) {
  return (
    <div className={cn("flex items-end gap-2", isMine ? "justify-end" : "justify-start")}>
      {!isMine && (
        <ScholarAvatar name={senderName} avatarUrl={senderAvatarUrl} size="sm" />
      )}
      <div
        className={cn(
          "max-w-[75%] min-w-0 break-words rounded-lg px-3 py-2 text-sm",
          isMine ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
        )}
      >
        {content}
      </div>
    </div>
  );
}
