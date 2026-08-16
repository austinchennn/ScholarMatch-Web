import { Label } from "@/components/ui/label";

export function AvatarUploadField({
  preview,
  onFileSelected,
}: {
  preview: string | null;
  onFileSelected: (dataUrl: string) => void;
}) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onFileSelected(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <section className="flex items-center gap-4">
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="Avatar preview" className="size-16 rounded-full object-cover" />
      ) : (
        <div className="size-16 rounded-full bg-muted" />
      )}
      <div>
        <Label htmlFor="avatar" className="mb-2 block">
          Avatar
        </Label>
        <input id="avatar" type="file" accept="image/*" onChange={handleChange} className="text-sm" />
      </div>
    </section>
  );
}
