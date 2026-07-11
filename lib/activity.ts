import { db } from "@/lib/db";
import type { ActivityType } from "@prisma/client";
import { Prisma } from "@prisma/client";

interface LogActivityInput {
  orgId: string;
  userId: string;
  type: ActivityType;
  entityId?: string;
  entityType?: string;
  entityName?: string;
  metadata?: Record<string, unknown>;
}

export async function logActivity(input: LogActivityInput): Promise<void> {
  try {
    await db.activity.create({
      data: {
        organizationId: input.orgId,
        userId: input.userId,
        type: input.type,
        entityId: input.entityId,
        entityType: input.entityType,
        entityName: input.entityName,
        metadata: input.metadata as Prisma.InputJsonValue,      
      },
    });
  } catch {
    // Activity logging should never break the main flow
    console.error("Failed to log activity:", input.type);
  }
}
