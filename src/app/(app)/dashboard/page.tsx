import Link from "next/link";
import { Suspense } from "react";
import { getProfile } from "@/lib/api";
import { requireSessionToken, withAuthRedirect } from "@/lib/session";
import { formatEnumLabel } from "@/lib/enums";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScholarAvatar } from "@/components/scholar-avatar";
import { RecommendFeed } from "@/app/(app)/recommend/RecommendFeed";
import { SignupTracker } from "./SignupTracker";

export default async function DashboardPage() {
  const token = await requireSessionToken();
  const profile = await withAuthRedirect(() => getProfile(token));
  const fullName = `${profile.firstName} ${profile.lastName}`;
  const profileComplete = Boolean(profile.researchDescription?.trim());

  return (
    <div className="grid gap-6 md:grid-cols-[280px_1fr]">
      <Suspense fallback={null}>
        <SignupTracker />
      </Suspense>

      <Card className="h-fit gap-4 overflow-hidden py-0">
        <div className="h-14 bg-gradient-to-r from-primary/70 to-primary" />
        <CardContent className="-mt-8 flex w-full min-w-0 flex-col items-center gap-2 pb-6 text-center">
          <ScholarAvatar
            name={fullName}
            avatarUrl={profile.avatarUrl}
            size="lg"
            className="size-16 ring-4 ring-card"
          />
          <div className="w-full min-w-0">
            <p className="truncate text-[15px] font-semibold">{fullName}</p>
            <p className="truncate text-[13px] text-muted-foreground">{profile.email}</p>
          </div>
          {profile.institution && (
            <p className="w-full truncate text-[13px] text-muted-foreground">
              {profile.institution}
              {profile.academicLevel ? ` · ${formatEnumLabel(profile.academicLevel)}` : ""}
            </p>
          )}
          {profile.researchField && (
            <Badge variant="secondary" className="max-w-full truncate font-normal">
              {formatEnumLabel(profile.researchField)}
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-full"
            render={<Link href="/profile/edit">Edit profile</Link>}
          />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-6">
        {profileComplete ? (
          <RecommendFeed />
        ) : (
          <Card className="mx-auto w-full max-w-md border-primary/40 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-base">Finish setting up your profile</CardTitle>
              <CardDescription>
                Recommendations are ranked from your research description — add one to start
                seeing collaborators here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="sm" render={<Link href="/profile/edit">Complete profile</Link>} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
