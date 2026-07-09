import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await db.user.findFirst({ where: { clerkUserId: userId } });
    if (!user) return NextResponse.json({ notifications: [], unreadCount: 0 });

    const [notifications, unreadCount] = await Promise.all([
      db.notification.findMany({
        where: { userId: user.id, organizationId: orgId },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      db.notification.count({ where: { userId: user.id, organizationId: orgId, isRead: false } }),
    ]);

    return NextResponse.json({ notifications, unreadCount });
  } catch {
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}
