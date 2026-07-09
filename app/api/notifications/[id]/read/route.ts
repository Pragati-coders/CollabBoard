import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;

    const user = await db.user.findFirst({ where: { clerkUserId: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    await db.notification.updateMany({ where: { id, userId: user.id }, data: { isRead: true } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to mark read" }, { status: 500 });
  }
}
