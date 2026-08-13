"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createPostingAction } from "@/app/actions/postings";
import { ApiError } from "@/lib/api";
import {
  COLLABORATION_TYPES,
  RESEARCH_FIELDS,
  formatEnumLabel,
} from "@/lib/enums";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function NewPostingForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [researchField, setResearchField] = useState("");
  const [collaborationType, setCollaborationType] = useState("");
  const [maxApplicants, setMaxApplicants] = useState("");

  const createMutation = useMutation({
    mutationFn: () =>
      createPostingAction({
        title,
        description: description || undefined,
        researchField: researchField || undefined,
        collaborationType: collaborationType || undefined,
        maxApplicants: maxApplicants ? Number(maxApplicants) : undefined,
      }),
    onSuccess: () => {
      toast.success("Posting created");
      router.push("/postings");
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : "Could not create posting.");
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Research field</Label>
        <Select value={researchField} onValueChange={(v) => setResearchField(v ?? "")}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select research field" />
          </SelectTrigger>
          <SelectContent>
            {RESEARCH_FIELDS.map((field) => (
              <SelectItem key={field} value={field}>
                {formatEnumLabel(field)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Collaboration type</Label>
        <Select value={collaborationType} onValueChange={(v) => setCollaborationType(v ?? "")}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select collaboration type" />
          </SelectTrigger>
          <SelectContent>
            {COLLABORATION_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {formatEnumLabel(type)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="maxApplicants">Max applicants (optional, unlimited if blank)</Label>
        <Input
          id="maxApplicants"
          type="number"
          min={1}
          value={maxApplicants}
          onChange={(e) => setMaxApplicants(e.target.value)}
        />
      </div>
      <Button
        onClick={() => createMutation.mutate()}
        disabled={createMutation.isPending || !title.trim()}
      >
        {createMutation.isPending ? "Creating…" : "Create posting"}
      </Button>
    </div>
  );
}
