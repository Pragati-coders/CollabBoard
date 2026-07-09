import { db } from "@/lib/db";

export async function getOrgByClerkId(clerkOrgId: string) {
  return db.organization.findFirst({ where: { clerkOrgId } });
}

export async function getMemberInOrg(orgId: string, clerkUserId: string) {
  return db.member.findFirst({
    where: { organizationId: orgId, user: { clerkUserId } },
    include: { user: true },
  });
}

export async function getOrgStats(orgId: string) {
  const [projects, boards, members, cards, done] = await Promise.all([
    db.project.count({ where: { organizationId: orgId, isArchived: false } }),
    db.board.count({ where: { organizationId: orgId, isArchived: false } }),
    db.member.count({ where: { organizationId: orgId } }),
    db.card.count({ where: { column: { board: { organizationId: orgId } }, isArchived: false } }),
    db.card.count({ where: { column: { name: "Done", board: { organizationId: orgId } } } }),
  ]);
  return { projects, boards, members, cards, completedCards: done, openCards: cards - done };
}
