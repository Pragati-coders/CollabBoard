import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ActivityFeed } from "@/features/activity/activity-feed";
export const metadata = { title: "Activity Feed" };
export default async function ActivityPage() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) redirect("/onboarding");
  return <ActivityFeed />;
}
