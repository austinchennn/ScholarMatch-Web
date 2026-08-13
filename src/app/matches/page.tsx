import Link from "next/link";
import { redirect } from "next/navigation";
import { ApiError, getMatches } from "@/lib/api";
import { getSessionToken } from "@/lib/session";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function MatchesPage() {
  const token = await getSessionToken();
  if (!token) {
    redirect("/login");
  }

  let matches;
  try {
    matches = await getMatches(token);
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect("/login");
    }
    throw err;
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <h1 className="mb-8 text-2xl font-semibold">Matches</h1>
      {matches.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No matches yet — head to{" "}
          <Link href="/recommend" className="underline">
            Recommend
          </Link>{" "}
          to find collaborators.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {matches.map((match) => (
            <Link key={match.scholarId} href={`/matches/${match.scholarId}`}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">
                      {match.firstName} {match.lastName}
                    </CardTitle>
                    <CardDescription>{match.institution}</CardDescription>
                  </div>
                  {match.researchField && (
                    <Badge variant="secondary">{match.researchField}</Badge>
                  )}
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
