import type { ReactNode } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScholarAvatar } from "@/components/scholar-avatar";

export interface ScholarCardProps {
  name: string;
  avatarUrl?: string | null;
  institution?: string | null;
  academicLevel?: string | null;
  researchField?: string | null;
  researchDescription?: string | null;
  researchInterests?: string[];
  href?: string;
  actions?: ReactNode;
  className?: string;
}

export function ScholarCard({
  name,
  avatarUrl,
  institution,
  academicLevel,
  researchField,
  researchDescription,
  researchInterests,
  href,
  actions,
  className,
}: ScholarCardProps) {
  const card = (
    <Card className={className}>
      <CardHeader className="flex items-center gap-3">
        <ScholarAvatar name={name} avatarUrl={avatarUrl} size="lg" />
        <div className="min-w-0 flex-1">
          <CardTitle className="truncate">{name}</CardTitle>
          {(institution || academicLevel) && (
            <CardDescription className="truncate">
              {institution}
              {institution && academicLevel ? " · " : ""}
              {academicLevel}
            </CardDescription>
          )}
        </div>
        {researchField && (
          <Badge variant="secondary" className="shrink-0">
            {researchField}
          </Badge>
        )}
      </CardHeader>
      {(researchDescription || (researchInterests && researchInterests.length > 0) || actions) && (
        <CardContent className="flex flex-col gap-3">
          {researchDescription && <p className="text-sm">{researchDescription}</p>}
          {researchInterests && researchInterests.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {researchInterests.map((interest) => (
                <Badge key={interest} variant="outline">
                  {interest}
                </Badge>
              ))}
            </div>
          )}
          {actions}
        </CardContent>
      )}
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block transition-shadow hover:shadow-md">
        {card}
      </Link>
    );
  }

  return card;
}
