"use client";

import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { ScholarAvatar } from "@/components/scholar-avatar";
import { prepareAvatar } from "@/lib/avatar-upload";

export function AvatarUploadField({
  preview,
  name,
  disabled = false,
  onFileSelected,
  onProcessingChange,
}: {
  preview: string | null;
  name: string;
  disabled?: boolean;
  onFileSelected: (dataUrl: string) => void;
  onProcessingChange: (processing: boolean) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const processing = useRef(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Allow the same file to be selected again after an error.
    e.target.value = "";
    if (!file || disabled || processing.current) return;

    processing.current = true;
    setError(null);
    setIsProcessing(true);
    onProcessingChange(true);
    try {
      onFileSelected(await prepareAvatar(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not prepare this image. Please try again.");
    } finally {
      processing.current = false;
      setIsProcessing(false);
      onProcessingChange(false);
    }
  }

  return (
    <section className="flex items-center gap-4">
      <ScholarAvatar name={name} avatarUrl={preview} size="lg" className="data-[size=lg]:size-16" />
      <div>
        <Label htmlFor="avatar" className="mb-2 block">
          Avatar
        </Label>
        <input
          id="avatar"
          type="file"
          accept="image/*"
          disabled={disabled || isProcessing}
          onChange={handleChange}
          aria-invalid={!!error}
          aria-describedby={error ? "avatar-help avatar-error" : "avatar-help"}
          className="text-sm"
        />
        <p id="avatar-help" className="mt-1 text-xs text-muted-foreground">
          Images up to 10 MB. Large photos are automatically resized.
        </p>
        {isProcessing && <p role="status" className="mt-1 text-sm">Preparing photo…</p>}
        {error && <p id="avatar-error" role="alert" className="mt-1 text-sm text-destructive">{error}</p>}
      </div>
    </section>
  );
}
