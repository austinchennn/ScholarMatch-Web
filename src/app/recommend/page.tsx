import Link from "next/link";
import { redirect } from "next/navigation";
import { ApiError, getProfile } from "@/lib/api";
import { getSessionToken } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RecommendFeed } from "./RecommendFeed";

export default async function RecommendPage() {
  const token = await getSessionToken();
  if (!token) {
    redirect("/login");
  }

  let profileComplete = false;
  try {
    const profile = await getProfile(token);
    profileComplete = Boolean(profile.researchDescription?.trim());
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect("/login");
    }
    throw err;
  }

  if (!profileComplete) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Finish your profile first</CardTitle>
            <CardDescription>
              Recommendations are ranked from your research description — add one to start seeing matches.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button render={<Link href="/profile/edit">Edit profile</Link>} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center px-6 py-16">
      <RecommendFeed />
    </div>
  );
}
