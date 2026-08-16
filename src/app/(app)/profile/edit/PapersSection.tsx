import type { Paper } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MAX_PAPERS = 5;

export function PapersSection({
  papers,
  onChange,
}: {
  papers: Paper[];
  onChange: (next: Paper[]) => void;
}) {
  function update(index: number, patch: Partial<Paper>) {
    onChange(papers.map((p, i) => (i === index ? { ...p, ...patch } : p)));
  }

  function add() {
    onChange([...papers, { title: "", doi: "" }]);
  }

  function remove(index: number) {
    onChange(papers.filter((_, i) => i !== index));
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">
          Papers ({papers.length}/{MAX_PAPERS})
        </h2>
        <Button type="button" variant="outline" size="sm" disabled={papers.length >= MAX_PAPERS} onClick={add}>
          Add paper
        </Button>
      </div>
      {papers.map((paper, i) => (
        <div key={i} className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label>Title</Label>
            <Input value={paper.title} onChange={(e) => update(i, { title: e.target.value })} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>DOI</Label>
            <Input value={paper.doi} onChange={(e) => update(i, { doi: e.target.value })} />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="sm:col-span-2 w-fit"
            onClick={() => remove(i)}
          >
            Remove
          </Button>
        </div>
      ))}
    </section>
  );
}
