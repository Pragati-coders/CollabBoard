"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, FolderKanban, MoreHorizontal, Users, CheckSquare } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const PROJECTS = [
  { id: "1", name: "Frontend Redesign", description: "Complete UI overhaul with the new design system", color: "#6366f1", progress: 68, tasks: 42, members: 6, status: "active" },
  { id: "2", name: "API Gateway v2", description: "Rebuild the API gateway with improved routing and caching", color: "#f59e0b", progress: 34, tasks: 18, members: 4, status: "active" },
  { id: "3", name: "Mobile App MVP", description: "React Native app for iOS and Android", color: "#10b981", progress: 82, tasks: 67, members: 8, status: "active" },
  { id: "4", name: "Data Pipeline", description: "Real-time analytics data pipeline with Apache Kafka", color: "#ef4444", progress: 12, tasks: 9, members: 3, status: "active" },
  { id: "5", name: "Auth Service", description: "Centralized authentication service with SSO support", color: "#8b5cf6", progress: 100, tasks: 28, members: 2, status: "completed" },
];

export default function ProjectsPage() {
  const [loading] = useState(false);
  const active = PROJECTS.filter(p => p.status === "active");
  const completed = PROJECTS.filter(p => p.status === "completed");

  const handleArchive = (id: string, name: string) => toast.success(`"${name}" archived`);
  const handleDelete = (id: string, name: string) => toast.success(`"${name}" deleted`);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8"><Skeleton className="h-8 w-32" /><Skeleton className="h-9 w-32" /></div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-52 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">{active.length} active · {completed.length} completed</p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> New Project</Button>
        </Link>
      </div>

      {/* Active */}
      <section className="mb-10">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Active</h2>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {active.map(project => (
            <Card key={project.id} className="group hover:shadow-md hover:border-primary/30 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: project.color + "20" }}>
                      <FolderKanban className="w-4 h-4" style={{ color: project.color }} />
                    </div>
                    <CardTitle className="text-sm font-semibold">{project.name}</CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild><Link href={`/dashboard/projects/${project.id}`}>Open</Link></DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleArchive(project.id, project.name)}>Archive</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(project.id, project.name)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription className="text-xs mt-2 line-clamp-2">{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                      <span>Progress</span><span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-1.5" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><CheckSquare className="w-3 h-3" /> {project.tasks} tasks</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {project.members}</span>
                  </div>
                  <Link href={`/dashboard/projects/${project.id}`}>
                    <Button variant="outline" size="sm" className="w-full h-7 text-xs mt-1">Open Project</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
          <Link href="/dashboard/projects/new">
            <Card className="border-dashed hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer h-full min-h-[200px] flex items-center justify-center">
              <CardContent className="text-center p-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Plus className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm font-medium">New Project</p>
                <p className="text-xs text-muted-foreground mt-1">Start from scratch</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {completed.length > 0 && (
        <section>
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Completed</h2>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {completed.map(project => (
              <Card key={project.id} className="opacity-60 hover:opacity-100 transition-opacity">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: project.color + "20" }}>
                      <FolderKanban className="w-4 h-4" style={{ color: project.color }} />
                    </div>
                    <CardTitle className="text-sm font-semibold">{project.name}</CardTitle>
                    <Badge variant="secondary" className="ml-auto text-xs">Done</Badge>
                  </div>
                </CardHeader>
                <CardContent><Progress value={100} className="h-1.5" /></CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
