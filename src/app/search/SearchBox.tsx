"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { searchScholarsAction } from "@/app/actions/search";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DEBOUNCE_MS = 350;

export function SearchBox() {
  const [input, setInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

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
            <Link key={scholar.scholarId} href={`/scholars/${scholar.scholarId}`}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{scholar.displayName}</CardTitle>
                    <CardDescription>
                      {scholar.institution}
                      {scholar.academicLevel ? ` · ${scholar.academicLevel}` : ""}
                    </CardDescription>
                  </div>
                  {scholar.researchField && <Badge variant="secondary">{scholar.researchField}</Badge>}
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
