import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/features/admin/admin-dashboard";

export const metadata = { title: "Admin Dashboard | CollabBoard" };

export default async function AdminPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  // In production, add admin role check here
  return <AdminDashboard />;
}
