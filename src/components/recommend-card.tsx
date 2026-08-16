import type { ReactNode } from "react";
import { BadgeCheck, GraduationCap, BookOpen, FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScholarAvatar } from "@/components/scholar-avatar";
import { formatEnumLabel } from "@/lib/enums";
import type { EducationEntry, Paper } from "@/lib/api";

export interface RecommendCardProps {
  name: string;
  avatarUrl?: string | null;
  academicEmailVerified?: boolean;
  institution?: string | null;
  academicLevel?: string | null;
  researchField?: string | null;
  lookingFor?: string | null;
  fundingStatus?: string | null;
  weeklyAvailabilityHours?: number | null;
  hIndex?: number | null;
  totalCitations?: number | null;
  collaborationDescription?: string | null;
  researchDescription?: string | null;
  researchInterests?: string[];
  educations?: EducationEntry[];
  papers?: Paper[];
  actions?: ReactNode;
  className?: string;
}

function stat(value: number | null | undefined): string {
  return value === null || value === undefined ? "—" : String(value);
}

function ColumnHeading({ icon: Icon, children }: { icon: typeof GraduationCap; children: ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 border-t pt-3 text-xs font-semibold text-muted-foreground">
      <Icon className="size-3.5" />
      {children}
    </div>
  );
}

export function RecommendCard({
  name,
  avatarUrl,
  academicEmailVerified,
  institution,
  academicLevel,
  researchField,
  lookingFor,
  fundingStatus,
  weeklyAvailabilityHours,
  hIndex,
  totalCitations,
  collaborationDescription,
  researchDescription,
  researchInterests,
  educations,
  papers,
  actions,
  className,
}: RecommendCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex items-start gap-4">
        <ScholarAvatar name={name} avatarUrl={avatarUrl} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-xl font-semibold">{name}</span>
            {researchField && (
              <Badge variant="secondary" className="shrink-0 font-normal">
                {formatEnumLabel(researchField)}
              </Badge>
            )}
          </div>
          {academicEmailVerified && (
            <div className="mt-1 flex items-center gap-1 text-xs font-medium text-primary">
              <BadgeCheck className="size-3.5" />
              Verified university email
            </div>
          )}
          {(institution || academicLevel) && (
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {institution}
              {institution && academicLevel ? " · " : ""}
              {academicLevel && formatEnumLabel(academicLevel)}
            </p>
          )}
          {lookingFor && (
            <p className="mt-1 text-sm text-muted-foreground">
              Looking for: {formatEnumLabel(lookingFor)}
            </p>
          )}
          {(fundingStatus || weeklyAvailabilityHours != null) && (
            <p className="mt-1 text-sm text-muted-foreground">
              {fundingStatus && `Funding: ${formatEnumLabel(fundingStatus)}`}
              {fundingStatus && weeklyAvailabilityHours != null ? "   ·   " : ""}
              {weeklyAvailabilityHours != null && `Availability: ${weeklyAvailabilityHours} h/wk`}
            </p>
          )}
          {(hIndex != null || totalCitations != null) && (
            <p className="mt-1 text-sm font-medium">
              h-index: {stat(hIndex)}   ·   Citations: {stat(totalCitations)}
            </p>
          )}
          {collaborationDescription && (
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">
              {collaborationDescription}
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-4 @md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <ColumnHeading icon={GraduationCap}>EDUCATION</ColumnHeading>
          {educations && educations.length > 0 ? (
            educations.map((ed, i) => (
              <p key={i} className="text-sm text-foreground/90">
                {ed.school} — {formatEnumLabel(ed.degree)}
                {ed.field ? `, ${ed.field}` : ""}
              </p>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">None on file</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <ColumnHeading icon={BookOpen}>PUBLICATIONS</ColumnHeading>
          {papers && papers.length > 0 ? (
            papers.map((paper, i) => (
              <p key={i} className="text-sm text-foreground/90">
                {paper.title}
              </p>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">None on file</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <ColumnHeading icon={FlaskConical}>RESEARCH</ColumnHeading>
          <p className="text-sm text-foreground/90">
            {researchDescription || "None on file"}
          </p>
          {researchInterests && researchInterests.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {researchInterests.map((interest) => (
                <Badge key={interest} variant="outline" className="font-normal">
                  {interest}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      {actions && <CardContent>{actions}</CardContent>}
    </Card>
  );
}
