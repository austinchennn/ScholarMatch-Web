"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchScholarsAction } from "@/app/actions/search";
import { Input } from "@/components/ui/input";
import { ScholarCard } from "@/components/scholar-card";

const DEBOUNCE_MS = 350;

export function SearchBox({ initialQuery = "" }: { initialQuery?: string }) {
  const [input, setInput] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedQuery(input.trim()), DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [input]);

  const searchQuery = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => searchScholarsAction(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  });

  const results = searchQuery.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <Input
        placeholder="Search by name, institution, research field, or interest…"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
      />

      {debouncedQuery.length === 0 ? (
        <p className="text-sm text-muted-foreground">Start typing to search scholars.</p>
      ) : searchQuery.isLoading ? (
        <p className="text-sm text-muted-foreground">Searching…</p>
      ) : results.length === 0 ? (
        <p className="text-sm text-muted-foreground">No scholars matched &quot;{debouncedQuery}&quot;.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {results.map((scholar) => (
            <ScholarCard
              key={scholar.scholarId}
              href={`/scholars/${scholar.scholarId}`}
              name={scholar.displayName}
              avatarUrl={scholar.avatarUrl}
              institution={scholar.institution}
              academicLevel={scholar.academicLevel}
              researchField={scholar.researchField}
            />
          ))}
        </div>
      )}
    </div>
  );
}
