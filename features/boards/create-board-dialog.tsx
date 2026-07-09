"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Kanban, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface CreateBoardDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
}

const TEMPLATES = [
  { id: "kanban", name: "Kanban", desc: "Todo → In Progress → Review → Done" },
  { id: "scrum", name: "Scrum Sprint", desc: "Backlog → Sprint → In Progress → Done" },
  { id: "bug", name: "Bug Tracker", desc: "Reported → Confirmed → In Progress → Resolved" },
  { id: "blank", name: "Blank Board", desc: "Start with an empty board" },
];

export function CreateBoardDialog({ open, onClose, projectId, projectName }: CreateBoardDialogProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [template, setTemplate] = useState("kanban");
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description, projectId, template }),
      });
      const data = await res.json();
      toast.success(`Board "${name}" created!`);
      onClose();
      setName(""); setDescription(""); setTemplate("kanban");
      if (data.id) router.push(`/dashboard/board/${data.id}`);
    } catch {
      toast.error("Failed to create board");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Kanban className="w-5 h-5" /> Create Board</DialogTitle>
          <DialogDescription>Add a new board to <span className="font-medium">{projectName}</span></DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Board name *</Label>
            <Input placeholder="e.g. Sprint Board, Q3 Roadmap…" value={name} onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCreate()} autoFocus />
          </div>

          <div className="space-y-2">
            <Label>Description <span className="text-muted-foreground">(optional)</span></Label>
            <Textarea placeholder="What is this board for?" value={description} onChange={e => setDescription(e.target.value)} rows={2} />
          </div>

          <div className="space-y-2">
            <Label>Start from template</Label>
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATES.map(t => (
                <button key={t.id} onClick={() => setTemplate(t.id)}
                  className={`text-left p-3 rounded-lg border text-sm transition-all ${template === t.id ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40 hover:bg-muted/40"}`}>
                  <div className="font-medium">{t.name}</div>
                  <div className={`text-xs mt-0.5 ${template === t.id ? "text-primary/70" : "text-muted-foreground"}`}>{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={handleCreate} disabled={!name.trim() || creating} className="flex-1 gap-2">
              {creating ? "Creating…" : <><ArrowRight className="w-4 h-4" /> Create Board</>}
            </Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
