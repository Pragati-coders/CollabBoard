import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";


export async function POST(req: Request) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { email, role = "MEMBER" } = await req.json();
    if (!email || !email.includes("@")) return NextResponse.json({ error: "Invalid email" }, { status: 400 });

    const member = await db.member.findFirst({
      where: { organizationId: orgId, user: { clerkUserId: userId } },
    });
    if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const clerk = await clerkClient();
    const clerkRole = role === "ADMIN" ? "org:admin" : "org:member";

    await clerk.organizations.createOrganizationInvitation({
      organizationId: orgId,
      emailAddress: email,
      role: clerkRole,
      inviterUserId: userId,
    });

    return NextResponse.json({ success: true, message: `Invitation sent to ${email}` });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to invite";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
