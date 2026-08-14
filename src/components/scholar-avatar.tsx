import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function ScholarAvatar({
  name,
  avatarUrl,
  size = "default",
  className,
}: {
  name: string;
  avatarUrl?: string | null;
  size?: "default" | "sm" | "lg";
  className?: string;
}) {
  return (
    <Avatar size={size} className={className}>
      {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
      <AvatarFallback>{initials(name)}</AvatarFallback>
    </Avatar>
  );
}
