import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApiError, getPublicProfile } from "@/lib/api";
import { getSessionToken } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScholarAvatar } from "@/components/scholar-avatar";

// Passes the viewer's token when they're logged in, so this page works today for logged-in
// visitors even before the backend's public (anonymous) access change ships — see #9's PR notes.
async function loadProfile(scholarId: string) {
  const token = await getSessionToken();
  try {
    return await getPublicProfile(scholarId, token);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ scholarId: string }>;
}): Promise<Metadata> {
  const { scholarId } = await params;
  const profile = await loadProfile(scholarId);

  const description =
    profile.researchDescription?.slice(0, 160) ??
    `${profile.displayName}'s research profile on ScholarMatch.`;

  return {
    title: `${profile.displayName} — ScholarMatch`,
    description,
    openGraph: {
      title: `${profile.displayName} — ScholarMatch`,
      description,
      images: profile.avatarUrl ? [profile.avatarUrl] : undefined,
    },
  };
}

export default async function PublicScholarPage({
  params,
}: {
  params: Promise<{ scholarId: string }>;
}) {
  const { scholarId } = await params;
  const profile = await loadProfile(scholarId);

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <Card>
        <CardHeader className="flex items-center gap-4">
          <ScholarAvatar name={profile.displayName} avatarUrl={profile.avatarUrl} size="lg" className="size-16" />
          <div>
            <CardTitle className="text-2xl">{profile.displayName}</CardTitle>
            <CardDescription>
              {profile.institution}
              {profile.academicLevel ? ` · ${profile.academicLevel}` : ""}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {profile.researchField && <Badge variant="secondary">{profile.researchField}</Badge>}
            {profile.lookingFor && <Badge variant="outline">{profile.lookingFor}</Badge>}
          </div>
          {profile.researchDescription && <p className="text-sm">{profile.researchDescription}</p>}
          {profile.researchInterests && profile.researchInterests.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {profile.researchInterests.map((interest) => (
                <Badge key={interest} variant="outline">
                  {interest}
                </Badge>
              ))}
            </div>
          )}
          {profile.educations && profile.educations.length > 0 && (
            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-semibold">Education</h2>
              {profile.educations.map((edu, i) => (
                <p key={i} className="text-sm text-muted-foreground">
                  {edu.degree} in {edu.field} — {edu.school}
                </p>
              ))}
            </div>
          )}
          {profile.papers && profile.papers.length > 0 && (
            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-semibold">Papers</h2>
              {profile.papers.map((paper, i) => (
                <p key={i} className="text-sm text-muted-foreground">
                  {paper.title}
                </p>
              ))}
            </div>
          )}
          {(profile.hIndex || profile.totalCitations) && (
            <p className="text-sm text-muted-foreground">
              h-index {profile.hIndex ?? 0} · {profile.totalCitations ?? 0} citations
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
