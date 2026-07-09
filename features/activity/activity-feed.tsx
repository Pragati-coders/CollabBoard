"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Kanban, FolderKanban, MessageSquare, UserPlus, UserMinus,
  Shield, Archive, LogIn, Activity,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: string;
  entityName?: string;
  entityType?: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
  user: { name: string; imageUrl?: string };
}

const MOCK_ACTIVITY: ActivityItem[] = [
  { id: "1", type: "CARD_MOVED", entityName: "Implement OAuth", entityType: "card", createdAt: new Date(Date.now() - 120000).toISOString(), user: { name: "Alex Kim" }, metadata: { to: "In Review" } },
  { id: "2", type: "COMMENT_CREATED", entityName: "Design system v2", entityType: "card", createdAt: new Date(Date.now() - 900000).toISOString(), user: { name: "Sarah Chen" } },
  { id: "3", type: "BOARD_CREATED", entityName: "Sprint Board", entityType: "board", createdAt: new Date(Date.now() - 3600000).toISOString(), user: { name: "Marcus Rivera" } },
  { id: "4", type: "MEMBER_INVITED", entityName: "priya@acme.com", createdAt: new Date(Date.now() - 7200000).toISOString(), user: { name: "Alex Kim" } },
  { id: "5", type: "CARD_CREATED", entityName: "API rate limiting", entityType: "card", createdAt: new Date(Date.now() - 14400000).toISOString(), user: { name: "Priya Patel" } },
  { id: "6", type: "PROJECT_CREATED", entityName: "Mobile App MVP", entityType: "project", createdAt: new Date(Date.now() - 86400000).toISOString(), user: { name: "Marcus Rivera" } },
  { id: "7", type: "MEMBER_ROLE_CHANGED", entityName: "James Wilson", createdAt: new Date(Date.now() - 172800000).toISOString(), user: { name: "Alex Kim" }, metadata: { newRole: "MANAGER" } },
  { id: "8", type: "BOARD_DELETED", entityName: "Old Sprint", entityType: "board", createdAt: new Date(Date.now() - 259200000).toISOString(), user: { name: "Sarah Chen" } },
  { id: "9", type: "LOGIN", createdAt: new Date(Date.now() - 345600000).toISOString(), user: { name: "Leila Hassan" } },
  { id: "10", type: "CARD_MOVED", entityName: "Dark mode toggle", entityType: "card", createdAt: new Date(Date.now() - 432000000).toISOString(), user: { name: "Alex Kim" }, metadata: { to: "Done" } },
];

const TYPE_CONFIG: Record<string, { icon: typeof Activity; label: string; color: string }> = {
  CARD_MOVED:           { icon: Kanban, label: "moved card", color: "text-blue-400" },
  CARD_CREATED:         { icon: Kanban, label: "created card", color: "text-green-400" },
  CARD_DELETED:         { icon: Kanban, label: "deleted card", color: "text-red-400" },
  COMMENT_CREATED:      { icon: MessageSquare, label: "commented on", color: "text-purple-400" },
  BOARD_CREATED:        { icon: FolderKanban, label: "created board", color: "text-green-400" },
  BOARD_DELETED:        { icon: Archive, label: "deleted board", color: "text-red-400" },
  PROJECT_CREATED:      { icon: FolderKanban, label: "created project", color: "text-green-400" },
  PROJECT_DELETED:      { icon: Archive, label: "deleted project", color: "text-red-400" },
  MEMBER_INVITED:       { icon: UserPlus, label: "invited", color: "text-blue-400" },
  MEMBER_REMOVED:       { icon: UserMinus, label: "removed member", color: "text-orange-400" },
  MEMBER_ROLE_CHANGED:  { icon: Shield, label: "changed role of", color: "text-yellow-400" },
  LOGIN:                { icon: LogIn, label: "logged in", color: "text-muted-foreground" },
};

export function ActivityFeed() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/activity");
        if (res.ok) {
          const data = await res.json();
          setItems(data.activities?.length ? data.activities : MOCK_ACTIVITY);
        } else {
          setItems(MOCK_ACTIVITY);
        }
      } catch {
        setItems(MOCK_ACTIVITY);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const FILTER_OPTIONS = [
    { value: "all", label: "All activity" },
    { value: "cards", label: "Cards" },
    { value: "boards", label: "Boards" },
    { value: "members", label: "Members" },
    { value: "comments", label: "Comments" },
  ];

  const FILTER_MAP: Record<string, string[]> = {
    cards:   ["CARD_MOVED","CARD_CREATED","CARD_DELETED"],
    boards:  ["BOARD_CREATED","BOARD_DELETED","PROJECT_CREATED","PROJECT_DELETED"],
    members: ["MEMBER_INVITED","MEMBER_REMOVED","MEMBER_ROLE_CHANGED","LOGIN"],
    comments:["COMMENT_CREATED"],
  };

  const filtered = filter === "all" ? items : items.filter(i => FILTER_MAP[filter]?.includes(i.type));

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Activity className="w-6 h-6" /> Activity Feed</h1>
          <p className="text-muted-foreground mt-1">Complete audit log of workspace events.</p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            {FILTER_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{filtered.length} events</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="divide-y divide-border">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="flex items-start gap-4 px-6 py-4">
                  <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/4" /></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map(item => {
                const cfg = TYPE_CONFIG[item.type] ?? { icon: Activity, label: item.type.toLowerCase().replace(/_/g," "), color: "text-muted-foreground" };
                const Icon = cfg.icon;
                return (
                  <div key={item.id} className="flex items-start gap-4 px-6 py-4 hover:bg-muted/20 transition-colors">
                    <div className="relative shrink-0">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs font-medium">{item.user.name.slice(0,2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-background flex items-center justify-center`}>
                        <Icon className={`w-2.5 h-2.5 ${cfg.color}`} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{item.user.name}</span>{" "}
                        <span className="text-muted-foreground">{cfg.label}</span>{" "}
                        {item.entityName && <span className="font-medium">{item.entityName}</span>}
                        {typeof item.metadata?.to === "string" && <span className="text-muted-foreground"> → <Badge variant="outline" className="text-xs">{item.metadata.to}</Badge></span>}
                        {typeof item.metadata?.newRole === "string" && <span className="text-muted-foreground"> → <Badge variant="secondary" className="text-xs">{item.metadata.newRole}</Badge></span>}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatRelativeTime(item.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="py-12 text-center text-sm text-muted-foreground">No activity for this filter</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
