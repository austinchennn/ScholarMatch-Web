"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateProfileAction } from "@/app/actions/profile";
import type { EducationEntry, Paper, ScholarProfile } from "@/lib/api";
import {
  ACADEMIC_LEVELS,
  COLLABORATION_TYPES,
  DEGREE_TYPES,
  FUNDING_STATUSES,
  RESEARCH_FIELDS,
  formatEnumLabel,
} from "@/lib/enums";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MAX_PAPERS = 5;

function EnumSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder: string;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v ?? "")}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {formatEnumLabel(option)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

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

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatarBase64(result);
      setAvatarPreview(result);
    };
    reader.readAsDataURL(file);
  }

  function updateEducation(index: number, patch: Partial<EducationEntry>) {
    setEducations((prev) =>
      prev.map((edu, i) => (i === index ? { ...edu, ...patch } : edu))
    );
  }

  function updatePaper(index: number, patch: Partial<Paper>) {
    setPapers((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)));
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
      <section className="flex items-center gap-4">
        {avatarPreview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarPreview}
            alt="Avatar preview"
            className="size-16 rounded-full object-cover"
          />
        ) : (
          <div className="size-16 rounded-full bg-muted" />
        )}
        <div>
          <Label htmlFor="avatar" className="mb-2 block">
            Avatar
          </Label>
          <input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="text-sm"
          />
        </div>
      </section>

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

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Education</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setEducations((prev) => [...prev, { school: "", degree: "", field: "" }])
            }
          >
            Add education
          </Button>
        </div>
        {educations.map((edu, i) => (
          <div key={i} className="grid gap-3 rounded-lg border p-4 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label>School</Label>
              <Input
                value={edu.school}
                onChange={(e) => updateEducation(i, { school: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Degree</Label>
              <EnumSelect
                value={edu.degree}
                onChange={(v) => updateEducation(i, { degree: v })}
                options={DEGREE_TYPES}
                placeholder="Select degree"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Field</Label>
              <Input
                value={edu.field}
                onChange={(e) => updateEducation(i, { field: e.target.value })}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="sm:col-span-3 w-fit"
              onClick={() => setEducations((prev) => prev.filter((_, idx) => idx !== i))}
            >
              Remove
            </Button>
          </div>
        ))}
      </section>

      <Separator />

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Papers ({papers.length}/{MAX_PAPERS})</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={papers.length >= MAX_PAPERS}
            onClick={() => setPapers((prev) => [...prev, { title: "", doi: "" }])}
          >
            Add paper
          </Button>
        </div>
        {papers.map((paper, i) => (
          <div key={i} className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Title</Label>
              <Input
                value={paper.title}
                onChange={(e) => updatePaper(i, { title: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>DOI</Label>
              <Input
                value={paper.doi}
                onChange={(e) => updatePaper(i, { doi: e.target.value })}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="sm:col-span-2 w-fit"
              onClick={() => setPapers((prev) => prev.filter((_, idx) => idx !== i))}
            >
              Remove
            </Button>
          </div>
        ))}
      </section>

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
