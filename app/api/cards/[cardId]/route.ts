import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_: Request, { params }: { params: Promise<{ cardId: string }> }) {
  try {
    const { orgId } = await auth();
    if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { cardId } = await params;

    const card = await db.card.findUnique({
      where: { id: cardId },
      include: {
        assignees: { include: { user: { select: { id: true, name: true, imageUrl: true } } } },
        labels: { include: { label: true } },
        comments: { include: { user: { select: { name: true, imageUrl: true } } }, orderBy: { createdAt: "asc" } },
        attachments: true,
        checklists: { include: { items: true } },
        column: { include: { board: { select: { id: true, name: true, projectId: true } } } },
      },
    });

    if (!card) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(card);
  } catch {
    return NextResponse.json({ error: "Failed to fetch card" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ cardId: string }> }) {
  try {
    const { orgId } = await auth();
    if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { cardId } = await params;
    const body = await req.json();

    const card = await db.card.update({
      where: { id: cardId },
      data: {
        title: body.title,
        description: body.description,
        priority: body.priority,
        dueDate: body.dueDate ? new Date(body.dueDate) : body.dueDate,
      },
    });

    return NextResponse.json(card);
  } catch {
    return NextResponse.json({ error: "Failed to update card" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ cardId: string }> }) {
  try {
    const { orgId } = await auth();
    if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { cardId } = await params;

    await db.card.delete({ where: { id: cardId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete card" }, { status: 500 });
  }
}
