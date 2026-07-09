import { db } from "@/lib/db";

export async function getUserByClerkId(clerkUserId: string) {
  return db.user.findFirst({ where: { clerkUserId } });
}

export async function upsertUser(data: { clerkUserId: string; email: string; name: string; imageUrl?: string }) {
  return db.user.upsert({
    where: { clerkUserId: data.clerkUserId },
    create: data,
    update: { name: data.name, imageUrl: data.imageUrl },
  });
}
