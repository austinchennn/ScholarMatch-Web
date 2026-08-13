import Link from "next/link";
import { redirect } from "next/navigation";
import { ApiError, getProfile, type ScholarProfile } from "@/lib/api";
import { getSessionToken } from "@/lib/session";
import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

  return (
    <div className="flex flex-1 flex-col items-center gap-6 px-6 py-16">
      <nav className="flex gap-2">
        <Button size="sm" render={<Link href="/recommend">Recommend</Link>} />
      </nav>
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>
              {profile.firstName} {profile.lastName}
            </CardTitle>
            <CardDescription>{profile.email}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" render={<Link href="/profile/edit">Edit profile</Link>} />
            <form action={logoutAction}>
              <Button type="submit" variant="outline" size="sm">
                Log out
              </Button>
            </form>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {profile.institution && (
            <p className="text-sm text-muted-foreground">
              {profile.institution}
              {profile.academicLevel ? ` · ${profile.academicLevel}` : ""}
            </p>
          )}
          {profile.researchField && (
            <Badge variant="secondary" className="w-fit">
              {profile.researchField}
            </Badge>
          )}
          {profile.researchDescription && (
            <p className="text-sm">{profile.researchDescription}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
