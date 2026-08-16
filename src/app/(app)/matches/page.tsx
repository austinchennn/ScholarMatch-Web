import { MessagesSquare } from "lucide-react";

export default function MatchesPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
      <MessagesSquare className="size-8 text-muted-foreground/50" />
      <p className="text-sm text-muted-foreground">
        Select a match on the left to start chatting.
      </p>
    </div>
  );
}
