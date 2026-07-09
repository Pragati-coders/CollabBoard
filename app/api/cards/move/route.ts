import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(req: Request) {
  try {
    const { orgId } = await auth();
    if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { cardId, toColumnId, newOrder } = await req.json();

    await db.card.update({
      where: { id: cardId },
      data: { columnId: toColumnId, order: newOrder },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to move card" }, { status: 500 });
  }
}
