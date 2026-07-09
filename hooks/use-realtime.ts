"use client";
import { useEffect, useRef, useCallback } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export interface RealtimePayload {
  [key: string]: unknown;
}

interface RealtimeOptions {
  boardId: string;
  onCardMoved?: (payload: RealtimePayload) => void;
  onCardCreated?: (payload: RealtimePayload) => void;
  onCardDeleted?: (payload: RealtimePayload) => void;
  onCommentAdded?: (payload: RealtimePayload) => void;
  onPresenceChange?: (users: string[]) => void;
}

export function useRealtime(options: RealtimeOptions) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const channel = supabase.channel(`board:${options.boardId}`, {
      config: { presence: { key: options.boardId } },
    });

    channel
      .on("broadcast", { event: "card:moved" }, ({ payload }) => optionsRef.current.onCardMoved?.(payload))
      .on("broadcast", { event: "card:created" }, ({ payload }) => optionsRef.current.onCardCreated?.(payload))
      .on("broadcast", { event: "card:deleted" }, ({ payload }) => optionsRef.current.onCardDeleted?.(payload))
      .on("broadcast", { event: "comment:added" }, ({ payload }) => optionsRef.current.onCommentAdded?.(payload))
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState<{ userId: string }>();
        const users = Object.values(state)
          .flat()
          .map((p) => p.userId);
        optionsRef.current.onPresenceChange?.(users);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ userId: "current-user", boardId: options.boardId });
        }
      });

    channelRef.current = channel;
    return () => {
      supabase.removeChannel(channel);
    };
  }, [options.boardId]);

  const broadcast = useCallback(async (event: string, payload: RealtimePayload) => {
    await channelRef.current?.send({ type: "broadcast", event, payload });
  }, []);

  return { broadcast };
}
