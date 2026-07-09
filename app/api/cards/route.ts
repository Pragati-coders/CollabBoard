import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();

    const member = await db.member.findFirst({
      where: { organizationId: orgId, user: { clerkUserId: userId } },
    });
    if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const count = await db.card.count({ where: { columnId: body.columnId } });
    const card = await db.card.create({
      data: {
        title: body.title,
        columnId: body.columnId,
        order: count,
        createdById: member.id,
        priority: body.priority ?? "NONE",
        description: body.description,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
      },
    });

    return NextResponse.json(card, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create card" }, { status: 500 });
  }
}
