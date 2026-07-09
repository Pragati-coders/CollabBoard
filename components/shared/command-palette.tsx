"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Search, LayoutDashboard, FolderKanban, CheckSquare,
  Users, BarChart3, Bell, Settings, Kanban, Plus,
  ArrowRight, Hash,
} from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

interface SearchResult {
  type: "project" | "board" | "card";
  id: string;
  title: string;
  href: string;
  meta?: string;
}

const NAV_SHORTCUTS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { label: "My Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { label: "Team", href: "/dashboard/members", icon: Users },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "New Project", href: "/dashboard/projects/new", icon: Plus },
];

const TYPE_ICONS = { project: FolderKanban, board: Kanban, card: Hash };

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 250);

  // Open on Cmd+K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (!open) return;
      if (e.key === "ArrowDown") { e.preventDefault(); setSelected(s => s + 1); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelected(s => Math.max(0, s - 1)); }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open]);

  useEffect(() => {
    if (!open) { setQuery(""); setResults([]); setSelected(0); }
  }, [open]);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) { setResults([]); return; }
    const fetch_results = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
        const data = await res.json();
        setResults(data.results ?? []);
        setSelected(0);
      } catch { setResults([]); }
      finally { setLoading(false); }
    };
    fetch_results();
  }, [debouncedQuery]);

  const navigate = useCallback((href: string) => {
    router.push(href);
    setOpen(false);
  }, [router]);

  const items = query.length < 2 ? NAV_SHORTCUTS : results;
  const clampedSelected = Math.min(selected, items.length - 1);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 max-w-xl overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && items[clampedSelected]) {
                  const item = items[clampedSelected] as SearchResult | (typeof NAV_SHORTCUTS)[number];
                  navigate(item.href);
                }
              }}
              placeholder="Search projects, boards, cards…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {loading && <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin shrink-0" />}
            <kbd className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono text-muted-foreground">ESC</kbd>
          </div>

          {/* Results */}
          <div className="py-2 max-h-96 overflow-y-auto">
            {query.length < 2 && (
              <div className="px-3 pb-1">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider px-2 py-1">Quick Navigation</p>
                {NAV_SHORTCUTS.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.href}
                      onClick={() => navigate(item.href)}
                      className={cn(
                        "w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors text-left",
                        i === clampedSelected ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                      )}
                      onMouseEnter={() => setSelected(i)}
                    >
                      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                      {item.label}
                      <ArrowRight className="w-3 h-3 ml-auto text-muted-foreground" />
                    </button>
                  );
                })}
              </div>
            )}

            {query.length >= 2 && results.length === 0 && !loading && (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No results for &quot;<span className="font-medium">{query}</span>&quot;
              </div>
            )}

            {results.length > 0 && (
              <div className="px-3">
                {results.map((result, i) => {
                  const Icon = TYPE_ICONS[result.type] ?? Hash;
                  return (
                    <button
                      key={result.id}
                      onClick={() => navigate(result.href)}
                      className={cn(
                        "w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors text-left",
                        i === clampedSelected ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                      )}
                      onMouseEnter={() => setSelected(i)}
                    >
                      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{result.title}</div>
                        {result.meta && <div className="text-xs text-muted-foreground truncate">{result.meta}</div>}
                      </div>
                      <span className="text-xs text-muted-foreground capitalize px-1.5 py-0.5 bg-muted rounded shrink-0">{result.type}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border px-4 py-2 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><kbd className="bg-muted px-1 py-0.5 rounded font-mono">↑↓</kbd> navigate</span>
            <span className="flex items-center gap-1"><kbd className="bg-muted px-1 py-0.5 rounded font-mono">↵</kbd> open</span>
            <span className="flex items-center gap-1"><kbd className="bg-muted px-1 py-0.5 rounded font-mono">esc</kbd> close</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
