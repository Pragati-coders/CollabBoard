import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding CollabBoard database...");

  // NOTE: Replace these with real Clerk IDs after creating test accounts
  const CLERK_USER_ID = process.env.SEED_CLERK_USER_ID;
  const CLERK_ORG_ID = process.env.SEED_CLERK_ORG_ID;

  if (!CLERK_USER_ID || !CLERK_ORG_ID) {
    console.log("⚠️  Set SEED_CLERK_USER_ID and SEED_CLERK_ORG_ID in .env to seed data.");
    console.log("   Get these from your Clerk dashboard after signing up.");
    return;
  }

  // Upsert user
  const user = await db.user.upsert({
    where: { clerkUserId: CLERK_USER_ID },
    create: { clerkUserId: CLERK_USER_ID, email: "admin@collabboard.app", name: "Admin User" },
    update: {},
  });
  console.log("✓ User:", user.name);

  // Upsert organization
  const org = await db.organization.upsert({
    where: { clerkOrgId: CLERK_ORG_ID },
    create: { clerkOrgId: CLERK_ORG_ID, name: "Demo Workspace", slug: "demo-workspace", ownerId: user.id },
    update: {},
  });
  console.log("✓ Organization:", org.name);

  // Upsert membership
  await db.member.upsert({
    where: { organizationId_userId: { organizationId: org.id, userId: user.id } },
    create: { organizationId: org.id, userId: user.id, role: "OWNER" },
    update: {},
  });
  console.log("✓ Member: OWNER role assigned");

  // Create project
  const project = await db.project.create({
    data: { name: "Demo Project", description: "A demo project to get you started", organizationId: org.id, createdById: user.id, color: "#6366f1" },
  });
  console.log("✓ Project:", project.name);

  // Create board with columns and cards
  const board = await db.board.create({
    data: {
      name: "Sprint Board",
      description: "Main sprint board",
      projectId: project.id,
      organizationId: org.id,
      createdById: user.id,
    },
  });

  const columns = await Promise.all([
    db.column.create({ data: { boardId: board.id, name: "Todo", color: "#94a3b8", order: 0 } }),
    db.column.create({ data: { boardId: board.id, name: "In Progress", color: "#3b82f6", order: 1 } }),
    db.column.create({ data: { boardId: board.id, name: "Review", color: "#f59e0b", order: 2 } }),
    db.column.create({ data: { boardId: board.id, name: "Done", color: "#10b981", order: 3 } }),
  ]);

  const [todo, inProgress, review, done] = columns;

  await db.card.createMany({
    data: [
      { columnId: todo.id, title: "Design new landing page", priority: "HIGH", order: 0, createdById: user.id },
      { columnId: todo.id, title: "Write API documentation", priority: "MEDIUM", order: 1, createdById: user.id },
      { columnId: inProgress.id, title: "Implement authentication", priority: "URGENT", order: 0, createdById: user.id, description: "Set up Clerk with org-based auth and protected routes." },
      { columnId: inProgress.id, title: "Build kanban drag-and-drop", priority: "HIGH", order: 1, createdById: user.id },
      { columnId: review.id, title: "Add dark mode support", priority: "LOW", order: 0, createdById: user.id },
      { columnId: done.id, title: "Set up CI/CD pipeline", priority: "MEDIUM", order: 0, createdById: user.id },
      { columnId: done.id, title: "Configure Supabase RLS", priority: "HIGH", order: 1, createdById: user.id },
    ],
  });

  console.log("✓ Board:", board.name, "with", columns.length, "columns and 7 cards");
  console.log("\n✅ Seeding complete!");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
