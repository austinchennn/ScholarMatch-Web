"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateProfileAction } from "@/app/actions/profile";
import type { EducationEntry, Paper, ScholarProfile } from "@/lib/api";
import {
  ACADEMIC_LEVELS,
  COLLABORATION_TYPES,
  FUNDING_STATUSES,
  RESEARCH_FIELDS,
} from "@/lib/enums";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { EnumSelect } from "./EnumSelect";
import { AvatarUploadField } from "./AvatarUploadField";
import { EducationsSection } from "./EducationsSection";
import { PapersSection } from "./PapersSection";

export function ProfileEditForm({ profile }: { profile: ScholarProfile }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber ?? "");
  const [institution, setInstitution] = useState(profile.institution ?? "");
  const [academicLevel, setAcademicLevel] = useState(profile.academicLevel ?? "");
  const [researchField, setResearchField] = useState(profile.researchField ?? "");
  const [lookingFor, setLookingFor] = useState(profile.lookingFor ?? "");
  const [fundingStatus, setFundingStatus] = useState(profile.fundingStatus ?? "");
  const [weeklyAvailabilityHours, setWeeklyAvailabilityHours] = useState(
    profile.weeklyAvailabilityHours?.toString() ?? ""
  );
  const [collaborationDescription, setCollaborationDescription] = useState(
    profile.collaborationDescription ?? ""
  );
  const [researchDescription, setResearchDescription] = useState(
    profile.researchDescription ?? ""
  );
  const [researchInterests, setResearchInterests] = useState(
    (profile.researchInterests ?? []).join(", ")
  );
  const [hIndex, setHIndex] = useState(profile.hIndex?.toString() ?? "");
  const [totalCitations, setTotalCitations] = useState(
    profile.totalCitations?.toString() ?? ""
  );
  const [educations, setEducations] = useState<EducationEntry[]>(
    profile.educations ?? []
  );
  const [papers, setPapers] = useState<Paper[]>(profile.papers ?? []);
  const [avatarBase64, setAvatarBase64] = useState<string | undefined>(undefined);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    profile.avatarUrl ?? null
  );

  function handleAvatarSelected(dataUrl: string) {
    setAvatarBase64(dataUrl);
    setAvatarPreview(dataUrl);
  }

  function handleSave() {
    startTransition(async () => {
      const result = await updateProfileAction({
        phoneNumber,
        institution,
        academicLevel: academicLevel || undefined,
        researchField: researchField || undefined,
        lookingFor: lookingFor || undefined,
        fundingStatus: fundingStatus || undefined,
        weeklyAvailabilityHours: weeklyAvailabilityHours
          ? Number(weeklyAvailabilityHours)
          : undefined,
        collaborationDescription,
        researchDescription,
        researchInterests: researchInterests
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        hIndex: hIndex ? Number(hIndex) : undefined,
        totalCitations: totalCitations ? Number(totalCitations) : undefined,
        educations: educations.filter((e) => e.school.trim()),
        papers: papers.filter((p) => p.title.trim()),
        avatarBase64,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Profile saved");
      router.push("/dashboard");
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <AvatarUploadField preview={avatarPreview} onFileSelected={handleAvatarSelected} />

      <Separator />

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="phoneNumber">Phone number</Label>
          <Input
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="institution">Institution</Label>
          <Input
            id="institution"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Academic level</Label>
          <EnumSelect
            value={academicLevel}
            onChange={setAcademicLevel}
            options={ACADEMIC_LEVELS}
            placeholder="Select academic level"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Research field</Label>
          <EnumSelect
            value={researchField}
            onChange={setResearchField}
            options={RESEARCH_FIELDS}
            placeholder="Select research field"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Looking for</Label>
          <EnumSelect
            value={lookingFor}
            onChange={setLookingFor}
            options={COLLABORATION_TYPES}
            placeholder="Select collaboration type"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Funding status</Label>
          <EnumSelect
            value={fundingStatus}
            onChange={setFundingStatus}
            options={FUNDING_STATUSES}
            placeholder="Select funding status"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="weeklyAvailabilityHours">Weekly availability (hours)</Label>
          <Input
            id="weeklyAvailabilityHours"
            type="number"
            min={0}
            value={weeklyAvailabilityHours}
            onChange={(e) => setWeeklyAvailabilityHours(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="researchInterests">Research interests</Label>
          <Input
            id="researchInterests"
            placeholder="Comma-separated, e.g. NLP, Graph Learning"
            value={researchInterests}
            onChange={(e) => setResearchInterests(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="hIndex">h-index</Label>
          <Input
            id="hIndex"
            type="number"
            min={0}
            value={hIndex}
            onChange={(e) => setHIndex(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="totalCitations">Total citations</Label>
          <Input
            id="totalCitations"
            type="number"
            min={0}
            value={totalCitations}
            onChange={(e) => setTotalCitations(e.target.value)}
          />
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <Label htmlFor="collaborationDescription">What kind of collaboration are you looking for?</Label>
        <Textarea
          id="collaborationDescription"
          rows={3}
          value={collaborationDescription}
          onChange={(e) => setCollaborationDescription(e.target.value)}
        />
      </section>

      <section className="flex flex-col gap-2">
        <Label htmlFor="researchDescription">Describe your research</Label>
        <Textarea
          id="researchDescription"
          rows={5}
          value={researchDescription}
          onChange={(e) => setResearchDescription(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          This is used to generate your recommendation embedding — the more specific, the better your matches.
        </p>
      </section>

      <Separator />

      <EducationsSection educations={educations} onChange={setEducations} />

      <Separator />

      <PapersSection papers={papers} onChange={setPapers} />

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving…" : "Save profile"}
        </Button>
      </div>
    </div>
  );
}
