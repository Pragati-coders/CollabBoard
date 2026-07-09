import { inngest } from "./client";
import { db } from "@/lib/db";

// Send due-date reminder notifications
export const dueDateReminder = inngest.createFunction(
  { id: "due-date-reminder", name: "Send Due Date Reminders" },
  { cron: "0 9 * * *" }, // Every day at 9am UTC
  async ({ step }) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cards = await step.run("fetch-due-cards", async () =>
      db.card.findMany({
        where: {
          dueDate: { gte: today, lte: tomorrow },
          isArchived: false,
        },
        include: {
          assignees: { include: { user: true } },
          column: { include: { board: { select: { name: true, organizationId: true } } } },
        },
      })
    ) as Array<{
      id: string;
      title: string;
      assignees: Array<{ userId: string }>;
      column: { board: { name: string; organizationId: string } };
    }>;

    for (const card of cards) {
      for (const assignee of card.assignees) {
        await step.run(`notify-${assignee.userId}`, () =>
          db.notification.create({
            data: {
              organizationId: card.column.board.organizationId,
              userId: assignee.userId,
              type: "DUE_DATE",
              title: "Task due tomorrow",
              message: `"${card.title}" is due tomorrow`,
            },
          }).catch(() => null)
        );
      }
    }

    return { reminded: cards.length };
  }
);

// Sync Clerk user to DB after sign-up
export const syncUser = inngest.createFunction(
  { id: "sync-user", name: "Sync Clerk User to DB" },
  { event: "clerk/user.created" },
  async ({ event, step }) => {
    const { id, email_addresses, first_name, last_name, image_url } = event.data;
    const email = email_addresses?.[0]?.email_address;
    if (!email) return;

    await step.run("upsert-user", () =>
      db.user.upsert({
        where: { clerkUserId: id },
        create: {
          clerkUserId: id,
          email,
          name: `${first_name ?? ""} ${last_name ?? ""}`.trim() || email,
          imageUrl: image_url,
        },
        update: {
          name: `${first_name ?? ""} ${last_name ?? ""}`.trim() || email,
          imageUrl: image_url,
        },
      })
    );
  }
);

export const allFunctions = [dueDateReminder, syncUser];
