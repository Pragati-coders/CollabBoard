import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { orgId } = await auth();
    if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const projects = await db.project.findMany({
      where: { organizationId: orgId, isArchived: false },
      include: {
        boards: { where: { isArchived: false }, select: { id: true, name: true } },
        _count: { select: { boards: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ projects });
  } catch {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
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

    const project = await db.project.create({
      data: {
        name: body.name,
        description: body.description,
        color: body.color ?? "#6366f1",
        organizationId: orgId,
        createdById: member.id,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
