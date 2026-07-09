"use client";
import { useState, useCallback, useEffect } from "react";
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors,
  type DragStartEvent, type DragOverEvent, type DragEndEvent, closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Plus, Settings, Users, Search, Filter, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { KanbanColumn } from "./kanban-column";
import { KanbanCard } from "./kanban-card";
import { CardDetailModal } from "@/features/cards/card-detail-modal";
import { useRealtime } from "@/hooks/use-realtime";
import type { RealtimePayload } from "@/hooks/use-realtime";
import { Skeleton } from "@/components/ui/skeleton";
import type { Column, Card as CardType } from "./types";
import { toast } from "sonner";

const INITIAL_COLUMNS: Column[] = [
  { id: "todo", name: "Todo", color: "#94a3b8", order: 0 },
  { id: "in-progress", name: "In Progress", color: "#3b82f6", order: 1 },
  { id: "review", name: "Review", color: "#f59e0b", order: 2 },
  { id: "done", name: "Done", color: "#10b981", order: 3 },
];

const INITIAL_CARDS: CardType[] = [
  { id: "card-1", columnId: "todo", title: "Design new onboarding flow", description: "Create wireframes and prototypes for the new user onboarding experience.", priority: "HIGH", dueDate: "2026-07-10", assignee: "AK", labels: ["Design", "UX"], order: 0 },
  { id: "card-2", columnId: "todo", title: "Write API documentation", description: "Document all REST endpoints with examples and error codes.", priority: "MEDIUM", dueDate: "2026-07-15", assignee: "SC", labels: ["Docs"], order: 1 },
  { id: "card-3", columnId: "in-progress", title: "Implement real-time notifications", description: "Add Supabase realtime subscriptions for live notification updates.", priority: "HIGH", dueDate: "2026-07-05", assignee: "MR", labels: ["Backend", "Feature"], order: 0 },
  { id: "card-4", columnId: "in-progress", title: "Refactor auth middleware", description: "Clean up authentication middleware with proper error handling.", priority: "URGENT", dueDate: "2026-07-03", assignee: "PP", labels: ["Backend"], order: 1 },
  { id: "card-5", columnId: "review", title: "Add dark mode support", description: "Implement dark/light theme toggle using next-themes.", priority: "LOW", dueDate: "2026-07-20", assignee: "AK", labels: ["Frontend"], order: 0 },
  { id: "card-6", columnId: "done", title: "Set up CI/CD pipeline", description: "GitHub Actions workflow for testing and deployment.", priority: "MEDIUM", dueDate: "2026-06-28", assignee: "MR", labels: ["DevOps"], order: 0 },
];

interface KanbanBoardProps { boardId: string; }

export function KanbanBoard({ boardId }: KanbanBoardProps) {
  const [columns] = useState<Column[]>(INITIAL_COLUMNS);
  const [cards, setCards] = useState<CardType[]>(INITIAL_CARDS);
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Simulate initial load
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  // Real-time sync
  const { broadcast } = useRealtime({
    boardId,
    onCardMoved: useCallback((payload: RealtimePayload) => {
      const { cardId, toColumnId, newOrder } = payload as { cardId: string; toColumnId: string; newOrder: number };
      setCards(prev => prev.map(c => c.id === cardId ? { ...c, columnId: toColumnId, order: newOrder } : c));
    }, []),
    onCardCreated: useCallback((payload: RealtimePayload) => {
      const card = payload as unknown as CardType;
      setCards(prev => [...prev.filter(c => c.id !== card.id), card]);
    }, []),
    onCardDeleted: useCallback((payload: RealtimePayload) => {
      const { cardId } = payload as { cardId: string };
      setCards(prev => prev.filter(c => c.id !== cardId));
    }, []),
    onPresenceChange: useCallback((users: string[]) => {
      setOnlineUsers(users);
      setIsConnected(true);
    }, []),
  });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const filteredCards = cards.filter(card =>
    !search || card.title.toLowerCase().includes(search.toLowerCase())
  );

  const getCardsByColumn = useCallback(
    (columnId: string) => filteredCards.filter(c => c.columnId === columnId).sort((a, b) => a.order - b.order),
    [filteredCards]
  );

  const handleDragStart = (event: DragStartEvent) => {
    const card = cards.find(c => c.id === event.active.id);
    if (card) setActiveCard(card);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const dragged = cards.find(c => c.id === active.id);
    if (!dragged) return;
    const overColumn = columns.find(col => col.id === over.id);
    if (overColumn && dragged.columnId !== overColumn.id) {
      setCards(prev => prev.map(c => c.id === dragged.id ? { ...c, columnId: overColumn.id } : c));
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCard(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const dragged = cards.find(c => c.id === active.id);
    const target = cards.find(c => c.id === over.id);
    if (!dragged || !target || dragged.columnId !== target.columnId) return;
    const colCards = cards.filter(c => c.columnId === dragged.columnId);
    const oldIdx = colCards.findIndex(c => c.id === active.id);
    const newIdx = colCards.findIndex(c => c.id === over.id);
    const reordered = arrayMove(colCards, oldIdx, newIdx).map((card, i) => ({ ...card, order: i }));
    setCards(prev => [...prev.filter(c => c.columnId !== dragged.columnId), ...reordered]);
    // Broadcast to other users
    broadcast("card:moved", { cardId: dragged.id, toColumnId: dragged.columnId, newOrder: newIdx });
    // Server sync
    fetch("/api/cards/move", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId: dragged.id, toColumnId: dragged.columnId, newOrder: newIdx, boardId }),
    }).catch(() => toast.error("Failed to sync card position"));
  };

  const addCard = useCallback((columnId: string, title: string) => {
    const newCard: CardType = {
      id: `card-${Date.now()}`,
      columnId, title, description: "", priority: "NONE",
      dueDate: null, assignee: null, labels: [],
      order: getCardsByColumn(columnId).length,
    };
    setCards(prev => [...prev, newCard]);
    broadcast("card:created", { ...newCard } as RealtimePayload);
    // Server sync
    fetch("/api/cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ columnId, title, boardId }),
    }).catch(() => toast.error("Failed to sync card"));
  }, [getCardsByColumn, broadcast, boardId]);

  const handleUpdateCard = useCallback((cardId: string, data: Partial<CardType>) => {
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, ...data } : c));
    fetch(`/api/cards/${cardId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch(() => toast.error("Failed to save changes"));
  }, []);

  const handleDeleteCard = useCallback((cardId: string) => {
    setCards(prev => prev.filter(c => c.id !== cardId));
    broadcast("card:deleted", { cardId });
    fetch(`/api/cards/${cardId}`, { method: "DELETE" }).catch(() => toast.error("Failed to delete card"));
  }, [broadcast]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background shrink-0">
          <Skeleton className="h-6 w-40" />
          <div className="flex gap-2"><Skeleton className="h-8 w-32" /><Skeleton className="h-8 w-20" /></div>
        </div>
        <div className="flex gap-4 p-6 overflow-x-auto">
          {[1,2,3,4].map(i => (
            <div key={i} className="w-72 shrink-0 space-y-3">
              <Skeleton className="h-6 w-24" />
              {[1,2,3].map(j => <Skeleton key={j} className="h-24 w-full rounded-lg" />)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Board Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold">Sprint Board</h1>
            <Badge variant="outline" className="text-xs">Q1 2026</Badge>
            {/* Online presence */}
            <div className="flex items-center gap-1.5 ml-2">
              {isConnected
                ? <Wifi className="w-3.5 h-3.5 text-green-400" />
                : <WifiOff className="w-3.5 h-3.5 text-muted-foreground" />}
              {onlineUsers.length > 0 && (
                <div className="flex -space-x-1.5">
                  {onlineUsers.slice(0, 4).map((u, i) => (
                    <Tooltip key={i}>
                      <TooltipTrigger>
                        <Avatar className="w-5 h-5 border border-background">
                          <AvatarFallback className="text-[8px]">{u.slice(0,2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>{u} is online</TooltipContent>
                    </Tooltip>
                  ))}
                  {onlineUsers.length > 4 && (
                    <div className="w-5 h-5 rounded-full bg-muted border border-background flex items-center justify-center text-[8px] font-medium">
                      +{onlineUsers.length - 4}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search cards..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 w-52 text-sm" />
            </div>
            <Button variant="outline" size="sm" className="h-8 gap-1.5"><Filter className="w-3.5 h-3.5" /> Filter</Button>
            <Button variant="outline" size="sm" className="h-8 gap-1.5"><Users className="w-3.5 h-3.5" /> Members</Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Settings className="w-3.5 h-3.5" /></Button>
          </div>
        </div>

        {/* Columns */}
        <div className="flex-1 overflow-x-auto">
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
            <div className="flex gap-4 p-6 h-full min-w-max">
              {columns.map(column => (
                <KanbanColumn key={column.id} column={column} cards={getCardsByColumn(column.id)} onAddCard={addCard} onCardClick={setSelectedCard} />
              ))}
              <div className="w-72 shrink-0">
                <button className="w-full h-10 border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 flex items-center justify-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" /> Add column
                </button>
              </div>
            </div>
            <DragOverlay>
              {activeCard && <div className="opacity-90 rotate-2 scale-105"><KanbanCard card={activeCard} isDragging /></div>}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      {/* Card Detail Modal */}
      <CardDetailModal
        card={selectedCard}
        open={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        onUpdate={handleUpdateCard}
        onDelete={handleDeleteCard}
      />
    </TooltipProvider>
  );
}
