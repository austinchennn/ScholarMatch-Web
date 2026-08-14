import type { ReactNode } from "react";
import type { Posting } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function PostingCard({
  posting,
  headerActions,
  actions,
  children,
}: {
  posting: Posting;
  headerActions?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Card className={posting.boosted ? "border-primary/50" : undefined}>
      <CardHeader className={headerActions ? "flex flex-row items-start justify-between" : undefined}>
        <div>
          <div className="flex items-center gap-2">
            <CardTitle>{posting.title}</CardTitle>
            {posting.boosted && <Badge>Boosted</Badge>}
            {posting.closed && <Badge variant="secondary">Closed</Badge>}
          </div>
          <CardDescription>
            {posting.posterName}
            {posting.maxApplicants
              ? ` · ${posting.applicantCount}/${posting.maxApplicants} applicants`
              : ` · ${posting.applicantCount} applicants`}
          </CardDescription>
        </div>
        {headerActions}
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {posting.researchField && <Badge variant="secondary">{posting.researchField}</Badge>}
          {posting.collaborationType && <Badge variant="outline">{posting.collaborationType}</Badge>}
        </div>
        {posting.description && <p className="text-sm">{posting.description}</p>}
        {children}
      </CardContent>
      {actions && <CardFooter className="justify-end gap-2">{actions}</CardFooter>}
    </Card>
  );
}
