import Link from "next/link";
import { redirect } from "next/navigation";
import { ApiError, getMatches } from "@/lib/api";
import { getSessionToken } from "@/lib/session";
import { ScholarCard } from "@/components/scholar-card";

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
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="mb-8 text-2xl font-semibold">Matches</h1>
      {matches.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No matches yet — head to{" "}
          <Link href="/dashboard" className="underline">
            Home
          </Link>{" "}
          to find collaborators.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {matches.map((match) => (
            <ScholarCard
              key={match.scholarId}
              href={`/matches/${match.scholarId}`}
              name={`${match.firstName} ${match.lastName}`}
              avatarUrl={match.avatarUrl}
              institution={match.institution}
              researchField={match.researchField}
            />
          ))}
        </div>
      )}
    </div>
  );
}
