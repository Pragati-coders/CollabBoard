import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderKanban, CheckSquare, Users, AlertCircle, Clock, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DashboardCharts } from "@/features/analytics/dashboard-charts";
import { Suspense } from "react";

const KPI_CARDS = [
  { title: "Active Projects", value: "12", change: "+2 this week", icon: FolderKanban, color: "text-blue-500", bg: "bg-blue-500/10" },
  { title: "Tasks Due Today", value: "5",  change: "3 overdue",    icon: AlertCircle,  color: "text-orange-500", bg: "bg-orange-500/10" },
  { title: "Completed Tasks", value: "38", change: "+12 this week", icon: CheckSquare, color: "text-green-500",  bg: "bg-green-500/10" },
  { title: "Team Members",    value: "24", change: "3 online now",  icon: Users,       color: "text-purple-500", bg: "bg-purple-500/10" },
];

const RECENT_ACTIVITY = [
  { user: "Alex Kim",     action: "moved",      entity: "Implement OAuth",    to: "In Review",   time: "2m ago",  initials: "AK" },
  { user: "Sarah Chen",   action: "commented on", entity: "Design system v2", to: "",            time: "15m ago", initials: "SC" },
  { user: "Marcus Rivera", action: "created",    entity: "Sprint Planning Board", to: "",         time: "1h ago",  initials: "MR" },
  { user: "Priya Patel",  action: "completed",   entity: "API documentation", to: "",            time: "3h ago",  initials: "PP" },
];

const ACTIVE_PROJECTS = [
  { id: "1", name: "Frontend Redesign", progress: 68, tasks: 42, dueIn: "5 days",  color: "#6366f1" },
  { id: "2", name: "API Gateway v2",    progress: 34, tasks: 18, dueIn: "2 weeks", color: "#f59e0b" },
  { id: "3", name: "Mobile App MVP",    progress: 82, tasks: 67, dueIn: "3 days",  color: "#10b981" },
  { id: "4", name: "Data Pipeline",     progress: 12, tasks: 9,  dueIn: "1 month", color: "#ef4444" },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function KPISkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 rounded-lg" />)}
    </div>
  );
}

export default async function DashboardPage() {
  const { userId, orgId } = await auth();
  if (!userId) redirect("/sign-in");
  if (!orgId) redirect("/onboarding");

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here&apos;s what&apos;s happening.</p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> New Project</Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {KPI_CARDS.map(({ title, value, change, icon: Icon, color, bg }) => (
          <Card key={title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">{title}</span>
                <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{value}</div>
              <div className="text-xs text-muted-foreground">{change}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts + Activity */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Suspense fallback={<Skeleton className="h-[360px] rounded-lg" />}>
            <DashboardCharts />
          </Suspense>
        </div>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              Recent Activity
              <Link href="/dashboard/activity">
                <Button variant="ghost" size="sm" className="text-xs h-7 gap-1">View all <ArrowRight className="w-3 h-3" /></Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[280px]">
              <div className="space-y-4">
                {RECENT_ACTIVITY.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Avatar className="w-7 h-7 shrink-0">
                      <AvatarFallback className="text-xs">{item.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{item.user}</span>{" "}
                        <span className="text-muted-foreground">{item.action}</span>{" "}
                        <span className="font-medium">{item.entity}</span>
                        {item.to && <span className="text-muted-foreground"> → {item.to}</span>}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Active Projects */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            Active Projects
            <Link href="/dashboard/projects">
              <Button variant="ghost" size="sm" className="text-xs h-7 gap-1">All projects <ArrowRight className="w-3 h-3" /></Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ACTIVE_PROJECTS.map(project => (
              <Link key={project.id} href={`/dashboard/projects/${project.id}`} className="flex items-center gap-4 group cursor-pointer">
                <div className="w-2 h-8 rounded-full shrink-0" style={{ backgroundColor: project.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">{project.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0 ml-4">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-1.5" />
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-medium">{project.tasks} tasks</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <Clock className="w-3 h-3" /> {project.dueIn}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
