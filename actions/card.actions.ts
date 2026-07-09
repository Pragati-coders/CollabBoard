"use server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity";
import type { ApiResponse } from "@/types/ApiResponse";
import type { CardPriority } from "@prisma/client";

interface CreateCardInput {
  columnId: string;
  title: string;
  boardId: string;
}

export async function createCard(input: CreateCardInput): Promise<ApiResponse<{ id: string }>> {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) return { error: "Unauthorized" };

    const member = await db.member.findFirst({
      where: { organizationId: orgId, user: { clerkUserId: userId } },
    });
    if (!member) return { error: "Forbidden" };

    const count = await db.card.count({ where: { columnId: input.columnId } });

    const card = await db.card.create({
      data: {
        columnId: input.columnId,
        title: input.title,
        order: count,
        createdById: member.id,
      },
    });

    await logActivity({ orgId, userId: member.id, type: "CARD_CREATED", entityId: card.id, entityType: "card", entityName: card.title });
    revalidatePath(`/dashboard/board/${input.boardId}`);
    return { data: { id: card.id } };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create card" };
  }
}

export async function moveCard(cardId: string, toColumnId: string, newOrder: number, boardId: string): Promise<ApiResponse<null>> {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) return { error: "Unauthorized" };

    await db.card.update({
      where: { id: cardId },
      data: { columnId: toColumnId, order: newOrder },
    });

    revalidatePath(`/dashboard/board/${boardId}`);
    return { data: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to move card" };
  }
}

interface UpdateCardInput {
  title?: string;
  description?: string;
  priority?: CardPriority;
  dueDate?: Date | null;
}

export async function updateCard(cardId: string, data: UpdateCardInput): Promise<ApiResponse<null>> {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) return { error: "Unauthorized" };

    await db.card.update({ where: { id: cardId }, data });
    return { data: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update card" };
  }
}

export async function deleteCard(cardId: string, boardId: string): Promise<ApiResponse<null>> {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) return { error: "Unauthorized" };

    const card = await db.card.findUnique({ where: { id: cardId } });
    if (!card) return { error: "Card not found" };

    await db.card.delete({ where: { id: cardId } });
    revalidatePath(`/dashboard/board/${boardId}`);
    return { data: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to delete card" };
  }
}

export async function addComment(cardId: string, content: string): Promise<ApiResponse<null>> {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) return { error: "Unauthorized" };

    const user = await db.user.findFirst({ where: { clerkUserId: userId } });
    if (!user) return { error: "User not found" };

    await db.comment.create({ data: { cardId, userId: user.id, content } });
    return { data: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to add comment" };
  }
}

export async function assignCard(cardId: string, userId: string): Promise<ApiResponse<null>> {
  try {
    const { orgId } = await auth();
    if (!orgId) return { error: "Unauthorized" };

    await db.cardAssignee.upsert({
      where: { cardId_userId: { cardId, userId } },
      create: { cardId, userId },
      update: {},
    });
    return { data: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to assign card" };
  }
}
