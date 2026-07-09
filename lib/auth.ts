import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import type { MemberRole } from "@prisma/client";

export interface AuthContext {
  userId: string;
  orgId: string;
  clerkUserId: string;
  role: MemberRole;
}

export async function requireAuth(): Promise<AuthContext> {
  const { userId: clerkUserId, orgId } = await auth();
  if (!clerkUserId) throw new Error("Unauthorized");
  if (!orgId) throw new Error("No organization selected");

  const member = await db.member.findFirst({
    where: { organizationId: orgId, user: { clerkUserId } },
    include: { user: true },
  });

  if (!member) throw new Error("Not a member of this organization");
  if (member.isSuspended) throw new Error("Your account has been suspended");

  return {
    userId: member.userId,
    orgId,
    clerkUserId,
    role: member.role,
  };
}

export async function getCurrentUser() {
  return currentUser();
}
