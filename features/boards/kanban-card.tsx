"use client";
import { Calendar } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Card } from "./types";

interface KanbanCardProps {
  card: Card;
  isDragging?: boolean;
}

const PRIORITY_COLORS: Record<string, string> = {
  URGENT: "bg-red-500",
  HIGH: "bg-orange-500",
  MEDIUM: "bg-yellow-500",
  LOW: "bg-blue-500",
  NONE: "bg-transparent",
};

const LABEL_COLORS: Record<string, string> = {
  Design: "bg-purple-500/20 text-purple-400",
  UX: "bg-pink-500/20 text-pink-400",
  Backend: "bg-blue-500/20 text-blue-400",
  Frontend: "bg-cyan-500/20 text-cyan-400",
  Feature: "bg-green-500/20 text-green-400",
  Docs: "bg-yellow-500/20 text-yellow-400",
  DevOps: "bg-orange-500/20 text-orange-400",
};

export function KanbanCard({ card, isDragging = false }: KanbanCardProps) {
  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-lg p-3 mb-2 cursor-grab active:cursor-grabbing group hover:border-primary/40 hover:shadow-sm transition-all",
        isDragging && "shadow-xl border-primary/50 opacity-90"
      )}
    >
      {/* Priority bar */}
      {card.priority !== "NONE" && (
        <div className={cn("w-full h-0.5 rounded-full mb-2.5", PRIORITY_COLORS[card.priority])} />
      )}

      {/* Labels */}
      {card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {card.labels.map(label => (
            <span
              key={label}
              className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full", LABEL_COLORS[label] ?? "bg-muted text-muted-foreground")}
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <p className="text-sm font-medium leading-snug mb-2 line-clamp-2">{card.title}</p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          {card.dueDate && (
            <span className={cn(
              "flex items-center gap-1 text-[11px]",
              isOverdue ? "text-red-400" : "text-muted-foreground"
            )}>
              <Calendar className="w-3 h-3" />
              {new Date(card.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          )}
        </div>
        {card.assignee && (
          <Avatar className="w-5 h-5">
            <AvatarFallback className="text-[9px] font-semibold">{card.assignee}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}
