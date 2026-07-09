"use server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import type { ApiResponse } from "@/types/ApiResponse";

export async function markNotificationRead(notificationId: string): Promise<ApiResponse<null>> {
  try {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const user = await db.user.findFirst({ where: { clerkUserId: userId } });
    if (!user) return { error: "User not found" };

    await db.notification.updateMany({
      where: { id: notificationId, userId: user.id },
      data: { isRead: true },
    });
    revalidatePath("/dashboard/notifications");
    return { data: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to mark notification" };
  }
}

export async function markAllNotificationsRead(): Promise<ApiResponse<null>> {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) return { error: "Unauthorized" };

    const user = await db.user.findFirst({ where: { clerkUserId: userId } });
    if (!user) return { error: "User not found" };

    await db.notification.updateMany({
      where: { userId: user.id, organizationId: orgId, isRead: false },
      data: { isRead: true },
    });
    revalidatePath("/dashboard/notifications");
    return { data: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to mark all read" };
  }
}

export async function createNotification(data: {
  organizationId: string;
  userId: string;
  type: "MENTION" | "ASSIGNMENT" | "COMMENT" | "INVITATION" | "DUE_DATE" | "BOARD_UPDATE" | "ROLE_CHANGE";
  title: string;
  message: string;
  linkUrl?: string;
}): Promise<void> {
  await db.notification.create({ data });
}
