"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, FolderKanban, Kanban, Hash, ArrowRight } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

interface Result { type: string; id: string; title: string; href: string; meta?: string; }

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) { setResults([]); return; }
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then(r => r.json())
      .then(d => setResults(d.results ?? []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  const groups = {
    project: results.filter(r => r.type === "project"),
    board: results.filter(r => r.type === "board"),
    card: results.filter(r => r.type === "card"),
  };

  const ICONS = { project: FolderKanban, board: Kanban, card: Hash };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Search</h1>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoFocus
            placeholder="Search projects, boards, cards…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="pl-9 h-11 text-base"
          />
        </div>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
        </div>
      )}

      {!loading && query.length >= 2 && results.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No results for &quot;<span className="font-medium text-foreground">{query}</span>&quot;</p>
          <p className="text-sm mt-1">Try a different search term</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-6">
          {(["project", "board", "card"] as const).map(type => {
            const items = groups[type];
            if (items.length === 0) return null;
            const Icon = ICONS[type];
            return (
              <div key={type}>
                <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5" /> {type}s
                  <Badge variant="secondary" className="text-xs h-4 px-1">{items.length}</Badge>
                </h2>
                <div className="space-y-1">
                  {items.map(item => (
                    <Link key={item.id} href={item.href}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group">
                      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{item.title}</div>
                        {item.meta && <div className="text-xs text-muted-foreground truncate">{item.meta}</div>}
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {query.length < 2 && (
        <div className="text-center py-16 text-muted-foreground">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="text-sm">Type at least 2 characters to search</p>
          <p className="text-xs mt-1">Search across projects, boards, and cards</p>
        </div>
      )}
    </div>
  );
}
