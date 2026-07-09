import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { orgId } = await auth();
    if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const boards = await db.board.findMany({
      where: { organizationId: orgId, isArchived: false },
      include: {
        project: { select: { name: true, color: true } },
        _count: { select: { columns: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ boards });
  } catch {
    return NextResponse.json({ error: "Failed to fetch boards" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();

    const member = await db.member.findFirst({
      where: { organizationId: orgId, user: { clerkUserId: userId } },
    });
    if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const board = await db.board.create({
      data: {
        name: body.name,
        description: body.description,
        projectId: body.projectId,
        organizationId: orgId,
        createdById: member.id,
        columns: {
          createMany: {
            data: [
              { name: "Todo", color: "#94a3b8", order: 0 },
              { name: "In Progress", color: "#3b82f6", order: 1 },
              { name: "Review", color: "#f59e0b", order: 2 },
              { name: "Done", color: "#10b981", order: 3 },
            ],
          },
        },
      },
    });

    return NextResponse.json(board, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create board" }, { status: 500 });
  }
}
