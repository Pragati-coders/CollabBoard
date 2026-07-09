import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Filter } from "lucide-react";

const TASKS = [
  { id: "1", title: "Implement real-time notifications", priority: "HIGH", dueDate: "Jul 5", project: "Frontend Redesign", done: false },
  { id: "2", title: "Refactor auth middleware", priority: "URGENT", dueDate: "Jul 3", project: "API Gateway v2", done: false },
  { id: "3", title: "Write API documentation", priority: "MEDIUM", dueDate: "Jul 15", project: "API Gateway v2", done: false },
  { id: "4", title: "Add dark mode support", priority: "LOW", dueDate: "Jul 20", project: "Frontend Redesign", done: false },
  { id: "5", title: "Set up CI/CD pipeline", priority: "MEDIUM", dueDate: "Jun 28", project: "DevOps", done: true },
];

const PRIORITY_STYLES: Record<string, string> = {
  URGENT: "bg-red-500/20 text-red-400 border-red-500/30",
  HIGH: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  MEDIUM: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  LOW: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

export default async function TasksPage() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) redirect("/onboarding");

  const active = TASKS.filter(t => !t.done);
  const done = TASKS.filter(t => t.done);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Tasks</h1>
          <p className="text-muted-foreground mt-1">{active.length} open · {done.length} completed</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="w-4 h-4" /> Filter
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {active.map(task => (
              <div key={task.id} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors group">
                <Checkbox className="shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{task.project}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${PRIORITY_STYLES[task.priority]}`}>
                    {task.priority.charAt(0) + task.priority.slice(1).toLowerCase()}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" /> {task.dueDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {done.length > 0 && (
            <>
              <div className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider border-t border-border bg-muted/20">
                Completed
              </div>
              <div className="divide-y divide-border">
                {done.map(task => (
                  <div key={task.id} className="flex items-center gap-4 px-6 py-4 opacity-50">
                    <Checkbox checked className="shrink-0" />
                    <p className="text-sm line-through text-muted-foreground">{task.title}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
