import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { orgId } = await auth();
    if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();
    if (!q || q.length < 2) return NextResponse.json({ results: [] });

    const [cards, boards, projects] = await Promise.all([
      db.card.findMany({
        where: {
          title: { contains: q, mode: "insensitive" },
          column: { board: { organizationId: orgId } },
          isArchived: false,
        },
        include: { column: { include: { board: { select: { id: true, name: true } } } } },
        take: 5,
      }),
      db.board.findMany({
        where: { name: { contains: q, mode: "insensitive" }, organizationId: orgId, isArchived: false },
        select: { id: true, name: true, project: { select: { name: true } } },
        take: 5,
      }),
      db.project.findMany({
        where: { name: { contains: q, mode: "insensitive" }, organizationId: orgId, isArchived: false },
        select: { id: true, name: true, color: true },
        take: 5,
      }),
    ]);

    return NextResponse.json({
      results: [
        ...projects.map((p: { id: string; name: string }) => ({
          type: "project", id: p.id, title: p.name, href: `/dashboard/projects/${p.id}`, meta: "",
        })),
        ...boards.map((b: { id: string; name: string; project: { name: string } | null }) => ({
          type: "board", id: b.id, title: b.name, href: `/dashboard/board/${b.id}`, meta: b.project?.name,
        })),
        ...cards.map((c: { id: string; title: string; column: { board: { id: string; name: string } } }) => ({
          type: "card", id: c.id, title: c.title, href: `/dashboard/board/${c.column.board.id}`, meta: c.column.board.name,
        })),
      ],
    });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
