import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AnalyticsDashboard } from "@/features/analytics/analytics-dashboard";

export default async function AnalyticsPage() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) redirect("/onboarding");
  return <AnalyticsDashboard />;
}
