import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { KanbanBoard } from "@/features/boards/kanban-board";

interface BoardPageProps {
  params: Promise<{ boardId: string }>;
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) redirect("/onboarding");
  const { boardId } = await params;

  return <KanbanBoard boardId={boardId} />;
}
