import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { ApiError, getProfile, type ScholarProfile } from "@/lib/api";
import { getSessionToken } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScholarAvatar } from "@/components/scholar-avatar";
import { RecommendFeed } from "@/app/(app)/recommend/RecommendFeed";
import { SignupTracker } from "./SignupTracker";

async function loadProfile(token: string): Promise<ScholarProfile> {
  try {
    return await getProfile(token);
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect("/login");
    }
    throw err;
  }
}

export default async function DashboardPage() {
  const token = await getSessionToken();
  if (!token) {
    redirect("/login");
  }

  const profile = await loadProfile(token);
  const fullName = `${profile.firstName} ${profile.lastName}`;
  const profileComplete = Boolean(profile.researchDescription?.trim());

  return (
    <div className="grid gap-6 md:grid-cols-[280px_1fr]">
      <Suspense fallback={null}>
        <SignupTracker />
      </Suspense>

      <Card className="h-fit gap-4 overflow-hidden py-0">
        <div className="h-14 bg-gradient-to-r from-primary/70 to-primary" />
        <CardContent className="-mt-8 flex flex-col items-center gap-2 pb-6 text-center">
          <ScholarAvatar
            name={fullName}
            avatarUrl={profile.avatarUrl}
            size="lg"
            className="size-16 ring-4 ring-card"
          />
          <div>
            <p className="font-semibold">{fullName}</p>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>
          {profile.institution && (
            <p className="text-sm text-muted-foreground">
              {profile.institution}
              {profile.academicLevel ? ` · ${profile.academicLevel}` : ""}
            </p>
          )}
          {profile.researchField && <Badge variant="secondary">{profile.researchField}</Badge>}
          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-full"
            render={<Link href="/profile/edit">Edit profile</Link>}
          />
        </CardContent>
      </Card>

      <div className="flex flex-col items-center gap-6">
        {profileComplete ? (
          <RecommendFeed />
        ) : (
          <Card className="w-full max-w-md border-primary/40 bg-primary/5">
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
