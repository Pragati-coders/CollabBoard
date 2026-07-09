"use server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { checkPermission } from "@/lib/permissions";
import { createBoardSchema, updateBoardSchema } from "@/lib/validations";
import { logActivity } from "@/lib/activity";
import type { ApiResponse } from "@/types/ApiResponse";

export async function createBoard(formData: FormData): Promise<ApiResponse<{ id: string }>> {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) return { error: "Unauthorized" };

    const member = await db.member.findFirst({
      where: { organizationId: orgId, user: { clerkUserId: userId } },
    });
    if (!member) return { error: "Not a member of this organization" };
    checkPermission(member.role, "create:board");

    const raw = Object.fromEntries(formData);
    const parsed = createBoardSchema.safeParse(raw);
    if (!parsed.success) return { error: parsed.error.errors[0].message };

    const { name, description, projectId } = parsed.data;

    const board = await db.board.create({
      data: {
        name,
        description,
        projectId,
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

    await logActivity({ orgId, userId: member.id, type: "BOARD_CREATED", entityId: board.id, entityType: "board", entityName: board.name });
    revalidatePath("/dashboard/projects");
    return { data: { id: board.id } };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create board" };
  }
}

export async function deleteBoard(boardId: string): Promise<ApiResponse<null>> {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) return { error: "Unauthorized" };

    const member = await db.member.findFirst({
      where: { organizationId: orgId, user: { clerkUserId: userId } },
    });
    if (!member) return { error: "Forbidden" };
    checkPermission(member.role, "delete:board");

    const board = await db.board.findFirst({ where: { id: boardId, organizationId: orgId } });
    if (!board) return { error: "Board not found" };

    await db.board.delete({ where: { id: boardId } });
    await logActivity({ orgId, userId: member.id, type: "BOARD_DELETED", entityId: boardId, entityType: "board", entityName: board.name });
    revalidatePath("/dashboard/projects");
    return { data: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to delete board" };
  }
}

export async function updateBoard(boardId: string, data: { name?: string; description?: string }): Promise<ApiResponse<null>> {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) return { error: "Unauthorized" };

    const parsed = updateBoardSchema.safeParse(data);
    if (!parsed.success) return { error: parsed.error.errors[0].message };

    await db.board.updateMany({ where: { id: boardId, organizationId: orgId }, data: parsed.data });
    revalidatePath(`/dashboard/board/${boardId}`);
    return { data: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update board" };
  }
}
