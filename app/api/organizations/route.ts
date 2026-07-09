import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { orgId } = await auth();
    if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const org = await db.organization.findFirst({
      where: { clerkOrgId: orgId },
      include: { _count: { select: { members: true, projects: true, boards: true } } },
    });

    return NextResponse.json({ org });
  } catch {
    return NextResponse.json({ error: "Failed to fetch organization" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { orgId } = await auth();
    if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const org = await db.organization.updateMany({
      where: { clerkOrgId: orgId },
      data: { name: body.name, slug: body.slug },
    });

    return NextResponse.json(org);
  } catch {
    return NextResponse.json({ error: "Failed to update organization" }, { status: 500 });
  }
}
