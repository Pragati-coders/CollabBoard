"use server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { checkPermission } from "@/lib/permissions";
import { logActivity } from "@/lib/activity";
import type { ApiResponse } from "@/types/ApiResponse";

interface CreateProjectInput {
  name: string;
  description?: string;
  color?: string;
}

export async function createProject(input: CreateProjectInput): Promise<ApiResponse<{ id: string }>> {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) return { error: "Unauthorized" };

    const member = await db.member.findFirst({
      where: { organizationId: orgId, user: { clerkUserId: userId } },
    });
    if (!member) return { error: "Forbidden" };
    checkPermission(member.role, "create:project");

    const project = await db.project.create({
      data: {
        name: input.name,
        description: input.description,
        color: input.color ?? "#6366f1",
        organizationId: orgId,
        createdById: member.id,
      },
    });

    await logActivity({ orgId, userId: member.id, type: "PROJECT_CREATED", entityId: project.id, entityType: "project", entityName: project.name });
    revalidatePath("/dashboard/projects");
    return { data: { id: project.id } };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create project" };
  }
}

export async function deleteProject(projectId: string): Promise<ApiResponse<null>> {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) return { error: "Unauthorized" };

    const member = await db.member.findFirst({
      where: { organizationId: orgId, user: { clerkUserId: userId } },
    });
    if (!member) return { error: "Forbidden" };
    checkPermission(member.role, "delete:project");

    const project = await db.project.findFirst({ where: { id: projectId, organizationId: orgId } });
    if (!project) return { error: "Project not found" };

    await db.project.delete({ where: { id: projectId } });
    await logActivity({ orgId, userId: member.id, type: "PROJECT_DELETED", entityId: projectId, entityName: project.name });
    revalidatePath("/dashboard/projects");
    return { data: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to delete project" };
  }
}

export async function updateProject(projectId: string, data: Partial<CreateProjectInput>): Promise<ApiResponse<null>> {
  try {
    const { orgId } = await auth();
    if (!orgId) return { error: "Unauthorized" };

    await db.project.updateMany({ where: { id: projectId, organizationId: orgId }, data });
    revalidatePath("/dashboard/projects");
    return { data: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update project" };
  }
}
