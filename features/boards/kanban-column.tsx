"use client";
import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus, MoreHorizontal } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SortableCard } from "./sortable-card";
import { cn } from "@/lib/utils";
import type { Column, Card } from "./types";

interface KanbanColumnProps {
  column: Column;
  cards: Card[];
  onAddCard: (columnId: string, title: string) => void;
  onCardClick: (card: Card) => void;
}

export function KanbanColumn({ column, cards, onAddCard, onCardClick }: KanbanColumnProps) {
  const [addingCard, setAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      onAddCard(column.id, newCardTitle.trim());
      setNewCardTitle("");
      setAddingCard(false);
    }
  };

  return (
    <div className="w-72 shrink-0 flex flex-col max-h-full">
      {/* Column header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: column.color }} />
          <span className="text-sm font-medium">{column.name}</span>
          <Badge variant="secondary" className="text-xs h-5 px-1.5">{cards.length}</Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setAddingCard(true)}>
            <Plus className="w-3.5 h-3.5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreHorizontal className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Rename column</DropdownMenuItem>
              <DropdownMenuItem>Sort by priority</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete column</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Cards container */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 overflow-y-auto rounded-xl p-2 min-h-[120px] transition-colors",
          isOver ? "bg-primary/5 ring-2 ring-primary/30" : "bg-muted/30"
        )}
      >
        <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence>
            {cards.map(card => (
              <motion.div key={card.id} layout initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.15 }}>
                <SortableCard card={card} onClick={() => onCardClick(card)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </SortableContext>

        {cards.length === 0 && !addingCard && (
          <div className="flex items-center justify-center h-20 text-xs text-muted-foreground">
            No cards yet
          </div>
        )}

        <AnimatePresence>
          {addingCard && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="mt-2">
              <div className="bg-card border border-border rounded-lg p-2 space-y-2">
                <Input autoFocus placeholder="Card title..." value={newCardTitle} onChange={e => setNewCardTitle(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") handleAddCard(); if (e.key === "Escape") { setAddingCard(false); setNewCardTitle(""); } }}
                  className="h-8 text-sm" />
                <div className="flex gap-2">
                  <Button size="sm" className="h-7 text-xs" onClick={handleAddCard} disabled={!newCardTitle.trim()}>Add card</Button>
                  <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => { setAddingCard(false); setNewCardTitle(""); }}>Cancel</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!addingCard && (
        <button onClick={() => setAddingCard(true)} className="mt-2 w-full h-8 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Add card
        </button>
      )}
    </div>
  );
}
