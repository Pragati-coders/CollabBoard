"use server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { checkPermission, canManageRole } from "@/lib/permissions";
import { logActivity } from "@/lib/activity";
import type { MemberRole } from "@prisma/client";
import type { ApiResponse } from "@/types/ApiResponse";

export async function inviteMember(email: string, role: MemberRole = "MEMBER"): Promise<ApiResponse<null>> {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) return { error: "Unauthorized" };

    const actor = await db.member.findFirst({
      where: { organizationId: orgId, user: { clerkUserId: userId } },
    });
    if (!actor) return { error: "Forbidden" };
    checkPermission(actor.role, "invite:member");

    // Use Clerk to send invitation
    const clerk = await clerkClient();
    await clerk.organizations.createOrganizationInvitation({
      organizationId: orgId,
      emailAddress: email,
      role: role === "OWNER" ? "org:admin" : "org:member",
      inviterUserId: userId,
    });

    await logActivity({ orgId, userId: actor.id, type: "MEMBER_INVITED", entityName: email });
    revalidatePath("/dashboard/members");
    return { data: null, message: `Invitation sent to ${email}` };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to invite member" };
  }
}

export async function removeMember(memberId: string): Promise<ApiResponse<null>> {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) return { error: "Unauthorized" };

    const actor = await db.member.findFirst({
      where: { organizationId: orgId, user: { clerkUserId: userId } },
    });
    if (!actor) return { error: "Forbidden" };
    checkPermission(actor.role, "remove:member");

    const target = await db.member.findUnique({ where: { id: memberId } });
    if (!target) return { error: "Member not found" };
    if (!canManageRole(actor.role, target.role)) return { error: "Cannot remove a member with equal or higher role" };

    await db.member.delete({ where: { id: memberId } });
    await logActivity({ orgId, userId: actor.id, type: "MEMBER_REMOVED", entityId: memberId });
    revalidatePath("/dashboard/members");
    return { data: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to remove member" };
  }
}

export async function changeMemberRole(memberId: string, newRole: MemberRole): Promise<ApiResponse<null>> {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) return { error: "Unauthorized" };

    const actor = await db.member.findFirst({
      where: { organizationId: orgId, user: { clerkUserId: userId } },
    });
    if (!actor) return { error: "Forbidden" };
    checkPermission(actor.role, "manage:roles");

    const target = await db.member.findUnique({ where: { id: memberId } });
    if (!target) return { error: "Member not found" };
    if (!canManageRole(actor.role, target.role)) return { error: "Cannot change role of a member with equal or higher role" };

    await db.member.update({ where: { id: memberId }, data: { role: newRole } });
    await logActivity({ orgId, userId: actor.id, type: "MEMBER_ROLE_CHANGED", entityId: memberId, metadata: { newRole } });
    revalidatePath("/dashboard/members");
    return { data: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to change role" };
  }
}

export async function suspendMember(memberId: string, suspend: boolean): Promise<ApiResponse<null>> {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) return { error: "Unauthorized" };

    const actor = await db.member.findFirst({
      where: { organizationId: orgId, user: { clerkUserId: userId } },
    });
    if (!actor) return { error: "Forbidden" };
    checkPermission(actor.role, "remove:member");

    await db.member.update({ where: { id: memberId }, data: { isSuspended: suspend } });
    revalidatePath("/dashboard/members");
    return { data: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update member" };
  }
}
