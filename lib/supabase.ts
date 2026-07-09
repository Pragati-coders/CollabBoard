import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side singleton
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role
export function createServerSupabaseClient() {
  return createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// Broadcast a realtime event to a board channel
export async function broadcastBoardEvent(boardId: string, event: string, payload: object) {
  const channel = supabase.channel(`board:${boardId}`);
  await channel.send({ type: "broadcast", event, payload });
  await supabase.removeChannel(channel);
}
