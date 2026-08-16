import { cn } from "@/lib/utils";

export function MessageBubble({ content, isMine }: { content: string; isMine: boolean }) {
  return (
    <div className={cn("flex", isMine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-lg px-3 py-2 text-sm",
          isMine ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
        )}
      >
        {content}
      </div>
    </div>
  );
}
