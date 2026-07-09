import { db } from "@/lib/db";

export async function getBoardsByOrg(orgId: string) {
  return db.board.findMany({
    where: { organizationId: orgId, isArchived: false },
    include: {
      project: { select: { id: true, name: true, color: true } },
      _count: { select: { columns: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getBoardById(boardId: string, orgId: string) {
  return db.board.findFirst({
    where: { id: boardId, organizationId: orgId },
    include: {
      columns: {
        orderBy: { order: "asc" },
        include: {
          cards: {
            where: { isArchived: false },
            orderBy: { order: "asc" },
            include: {
              assignees: { include: { user: { select: { name: true, imageUrl: true } } } },
              labels: { include: { label: true } },
              _count: { select: { comments: true, attachments: true } },
            },
          },
        },
      },
      labels: true,
    },
  });
}
