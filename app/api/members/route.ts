import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { orgId } = await auth();
    if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const members = await db.member.findMany({
      where: { organizationId: orgId },
      include: { user: { select: { name: true, email: true, imageUrl: true } } },
      orderBy: { joinedAt: "asc" },
    });

    return NextResponse.json({ members });
  } catch {
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}
