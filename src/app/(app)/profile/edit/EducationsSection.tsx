import type { EducationEntry } from "@/lib/api";
import { DEGREE_TYPES } from "@/lib/enums";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EnumSelect } from "./EnumSelect";

export function EducationsSection({
  educations,
  onChange,
}: {
  educations: EducationEntry[];
  onChange: (next: EducationEntry[]) => void;
}) {
  function update(index: number, patch: Partial<EducationEntry>) {
    onChange(educations.map((edu, i) => (i === index ? { ...edu, ...patch } : edu)));
  }

  function add() {
    onChange([...educations, { school: "", degree: "", field: "" }]);
  }

  function remove(index: number) {
    onChange(educations.filter((_, i) => i !== index));
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Education</h2>
        <Button type="button" variant="outline" size="sm" onClick={add}>
          Add education
        </Button>
      </div>
      {educations.map((edu, i) => (
        <div key={i} className="grid gap-3 rounded-lg border p-4 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label>School</Label>
            <Input value={edu.school} onChange={(e) => update(i, { school: e.target.value })} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Degree</Label>
            <EnumSelect
              value={edu.degree}
              onChange={(v) => update(i, { degree: v })}
              options={DEGREE_TYPES}
              placeholder="Select degree"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Field</Label>
            <Input value={edu.field} onChange={(e) => update(i, { field: e.target.value })} />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="sm:col-span-3 w-fit"
            onClick={() => remove(i)}
          >
            Remove
          </Button>
        </div>
      ))}
    </section>
  );
}
