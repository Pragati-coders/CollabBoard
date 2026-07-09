import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_: Request, { params }: { params: Promise<{ boardId: string }> }) {
  try {
    const { orgId } = await auth();
    if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { boardId } = await params;

    const board = await db.board.findFirst({
      where: { id: boardId, organizationId: orgId },
      include: {
        columns: { orderBy: { order: "asc" } },
        labels: true,
      },
    });
    if (!board) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const cards = await db.card.findMany({
      where: { column: { boardId } },
      include: {
        assignees: { include: { user: { select: { name: true, imageUrl: true } } } },
        labels: { include: { label: true } },
        _count: { select: { comments: true, attachments: true, checklists: true } },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ ...board, cards });
  } catch {
    return NextResponse.json({ error: "Failed to fetch board" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ boardId: string }> }) {
  try {
    const { orgId } = await auth();
    if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { boardId } = await params;
    const body = await req.json();

    const board = await db.board.updateMany({
      where: { id: boardId, organizationId: orgId },
      data: { name: body.name, description: body.description },
    });

    return NextResponse.json(board);
  } catch {
    return NextResponse.json({ error: "Failed to update board" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ boardId: string }> }) {
  try {
    const { orgId } = await auth();
    if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { boardId } = await params;

    await db.board.deleteMany({ where: { id: boardId, organizationId: orgId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete board" }, { status: 500 });
  }
}
