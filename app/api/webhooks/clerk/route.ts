import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, data } = body;

    switch (type) {
      case "user.created":
      case "user.updated": {
        const email = data.email_addresses?.[0]?.email_address;
        if (!email) break;
        const name = `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() || email;
        await db.user.upsert({
          where: { clerkUserId: data.id },
          create: { clerkUserId: data.id, email, name, imageUrl: data.image_url },
          update: { name, imageUrl: data.image_url },
        });
        break;
      }
      case "organization.created": {
        await db.organization.upsert({
          where: { clerkOrgId: data.id },
          create: {
            clerkOrgId: data.id,
            name: data.name,
            slug: data.slug ?? data.id,
            ownerId: data.created_by,
          },
          update: { name: data.name, slug: data.slug ?? data.id },
        });
        break;
      }
      case "organizationMembership.created": {
        const org = await db.organization.findFirst({ where: { clerkOrgId: data.organization?.id } });
        const user = await db.user.findFirst({ where: { clerkUserId: data.public_user_data?.user_id } });
        if (org && user) {
          const roleMap: Record<string, "ADMIN" | "MEMBER"> = { "org:admin": "ADMIN", "org:member": "MEMBER" };
          const role = roleMap[data.role] ?? "MEMBER";
          await db.member.upsert({
            where: { organizationId_userId: { organizationId: org.id, userId: user.id } },
            create: { organizationId: org.id, userId: user.id, role },
            update: { role },
          });
        }
        break;
      }
      case "organizationMembership.deleted": {
        const org = await db.organization.findFirst({ where: { clerkOrgId: data.organization?.id } });
        const user = await db.user.findFirst({ where: { clerkUserId: data.public_user_data?.user_id } });
        if (org && user) {
          await db.member.deleteMany({ where: { organizationId: org.id, userId: user.id } });
        }
        break;
      }
      default:
        console.log("Unhandled Clerk webhook:", type);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
