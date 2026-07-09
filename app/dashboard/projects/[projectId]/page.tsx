"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Plus, Kanban, MoreHorizontal, Users, CheckSquare, Calendar } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CreateBoardDialog } from "@/features/boards/create-board-dialog";
import { toast } from "sonner";

const PROJECT_DATA: Record<string, {
  name: string; description: string; color: string; progress: number; members: number;
  boards: Array<{ id: string; name: string; cards: number; done: number; updatedAt: string }>;
}> = {
  "1": {
    name: "Frontend Redesign", description: "Complete UI overhaul with the new design system", color: "#6366f1", progress: 68, members: 6,
    boards: [
      { id: "b1", name: "Sprint Board", cards: 24, done: 16, updatedAt: "2h ago" },
      { id: "b2", name: "Design Backlog", cards: 18, done: 6, updatedAt: "1d ago" },
      { id: "b3", name: "Component Library", cards: 12, done: 10, updatedAt: "3d ago" },
    ],
  },
  "2": {
    name: "API Gateway v2", description: "Rebuild the API gateway with improved routing and caching", color: "#f59e0b", progress: 34, members: 4,
    boards: [
      { id: "b4", name: "Development Board", cards: 18, done: 6, updatedAt: "30m ago" },
    ],
  },
  "3": {
    name: "Mobile App MVP", description: "React Native app for iOS and Android", color: "#10b981", progress: 82, members: 8,
    boards: [
      { id: "b5", name: "iOS Sprint", cards: 30, done: 25, updatedAt: "1h ago" },
      { id: "b6", name: "Android Sprint", cards: 28, done: 22, updatedAt: "2h ago" },
      { id: "b7", name: "QA Board", cards: 9, done: 8, updatedAt: "4h ago" },
    ],
  },
};

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const [createBoardOpen, setCreateBoardOpen] = useState(false);

  const project = PROJECT_DATA[projectId] ?? {
    name: "Project", description: "Project details", color: "#6366f1", progress: 0, members: 0, boards: [],
  };

  const handleDeleteBoard = (boardId: string) => {
    toast.success("Board deleted");
    console.log("delete board", boardId);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Back */}
      <Link href="/dashboard/projects" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Projects
      </Link>

      {/* Project Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: project.color + "20" }}>
            <Kanban className="w-6 h-6" style={{ color: project.color }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground mt-0.5">{project.description}</p>
          </div>
        </div>
        <Button size="sm" className="gap-2 shrink-0" onClick={() => setCreateBoardOpen(true)}>
          <Plus className="w-4 h-4" /> New Board
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-5">
            <div className="text-xs text-muted-foreground mb-1">Progress</div>
            <div className="text-2xl font-bold mb-2">{project.progress}%</div>
            <Progress value={project.progress} className="h-1.5" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
              <Kanban className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Boards</div>
              <div className="text-2xl font-bold">{project.boards.length}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Members</div>
              <div className="text-2xl font-bold">{project.members}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Boards */}
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Boards</h2>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {project.boards.map(board => {
          const pct = board.cards > 0 ? Math.round((board.done / board.cards) * 100) : 0;
          return (
            <Card key={board.id} className="group hover:shadow-md hover:border-primary/30 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Kanban className="w-4 h-4 text-muted-foreground" />
                    <CardTitle className="text-sm font-semibold">{board.name}</CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Rename</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteBoard(board.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                    <span className="flex items-center gap-1"><CheckSquare className="w-3 h-3" /> {board.done}/{board.cards} done</span>
                    <span>{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-1.5" />
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" /> Updated {board.updatedAt}
                </div>
                <Link href={`/dashboard/board/${board.id}`}>
                  <Button variant="outline" size="sm" className="w-full h-7 text-xs mt-1">Open Board</Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}

        {/* Create board card */}
        <button onClick={() => setCreateBoardOpen(true)} className="group border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 rounded-lg p-6 flex flex-col items-center justify-center gap-3 transition-all min-h-[180px]">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Plus className="w-5 h-5 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">New Board</p>
            <p className="text-xs text-muted-foreground mt-0.5">Start a new kanban board</p>
          </div>
        </button>
      </div>

      <CreateBoardDialog
        open={createBoardOpen}
        onClose={() => setCreateBoardOpen(false)}
        projectId={projectId}
        projectName={project.name}
      />
    </div>
  );
}
