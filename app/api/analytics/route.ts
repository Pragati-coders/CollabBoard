import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { orgId } = await auth();
    if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [totalProjects, totalBoards, totalMembers, totalCards, completedCards] = await Promise.all([
      db.project.count({ where: { organizationId: orgId, isArchived: false } }),
      db.board.count({ where: { organizationId: orgId, isArchived: false } }),
      db.member.count({ where: { organizationId: orgId } }),
      db.card.count({ where: { column: { board: { organizationId: orgId } }, isArchived: false } }),
      db.card.count({ where: { column: { name: "Done", board: { organizationId: orgId } } } }),
    ]);

    return NextResponse.json({ totalProjects, totalBoards, totalMembers, totalCards, completedCards });
  } catch {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
