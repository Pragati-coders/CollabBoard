"use client";
import { useState, useEffect, useCallback } from "react";
import type { Column, Card } from "@/features/boards/types";

interface UseBoardsReturn {
  columns: Column[];
  cards: Card[];
  isLoading: boolean;
  error: string | null;
  moveCard: (cardId: string, toColumnId: string, newOrder: number) => void;
  addCard: (columnId: string, title: string) => void;
  deleteCard: (cardId: string) => void;
  refetch: () => void;
}

export function useBoards(boardId: string): UseBoardsReturn {
  const [columns, setColumns] = useState<Column[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBoard = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/boards/${boardId}`);
      if (!res.ok) throw new Error("Failed to fetch board");
      const data = await res.json();
      setColumns(data.columns ?? []);
      setCards(data.cards ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load board");
    } finally {
      setIsLoading(false);
    }
  }, [boardId]);

  useEffect(() => { fetchBoard(); }, [fetchBoard]);

  const moveCard = useCallback((cardId: string, toColumnId: string, newOrder: number) => {
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, columnId: toColumnId, order: newOrder } : c));
    // Fire-and-forget server sync
    fetch("/api/cards/move", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId, toColumnId, newOrder, boardId }),
    }).catch(console.error);
  }, [boardId]);

  const addCard = useCallback((columnId: string, title: string) => {
    const tempCard: Card = {
      id: `temp-${Date.now()}`,
      columnId,
      title,
      description: "",
      priority: "NONE",
      dueDate: null,
      assignee: null,
      labels: [],
      order: cards.filter(c => c.columnId === columnId).length,
    };
    setCards(prev => [...prev, tempCard]);
    // Sync to server
    fetch("/api/cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ columnId, title, boardId }),
    }).then(res => res.json()).then(data => {
      if (data.id) {
        setCards(prev => prev.map(c => c.id === tempCard.id ? { ...c, id: data.id } : c));
      }
    }).catch(console.error);
  }, [cards, boardId]);

  const deleteCard = useCallback((cardId: string) => {
    setCards(prev => prev.filter(c => c.id !== cardId));
    fetch(`/api/cards/${cardId}`, { method: "DELETE" }).catch(console.error);
  }, []);

  return { columns, cards, isLoading, error, moveCard, addCard, deleteCard, refetch: fetchBoard };
}
