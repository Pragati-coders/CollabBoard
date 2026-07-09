"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tag, User, MessageSquare, Paperclip, CheckSquare, Trash2, Edit3, Send, X, Calendar, Plus } from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { Card } from "./types";
import { toast } from "sonner";

interface Comment { id: string; content: string; user: { name: string }; createdAt: string; }
interface ChecklistItem { id: string; title: string; isCompleted: boolean; }
interface ChecklistData { id: string; title: string; items: ChecklistItem[]; }

const PRIORITY_OPTIONS = [
  { value: "URGENT", label: "🔴 Urgent" },
  { value: "HIGH",   label: "🟠 High" },
  { value: "MEDIUM", label: "🟡 Medium" },
  { value: "LOW",    label: "🔵 Low" },
  { value: "NONE",   label: "⚪ None" },
];

const LABEL_OPTIONS = ["Design","UX","Backend","Frontend","Feature","Docs","DevOps","Bug","Infra"];

const MOCK_COMMENTS: Comment[] = [
  { id: "1", content: "We should handle the edge case where the token expires mid-request.", user: { name: "Alex Kim" }, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "2", content: "Good point. I'll add a refresh token interceptor.", user: { name: "Sarah Chen" }, createdAt: new Date(Date.now() - 1800000).toISOString() },
];

interface CardDetailModalProps {
  card: Card | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (cardId: string, data: Partial<Card>) => void;
  onDelete: (cardId: string) => void;
}

export function CardDetailModal({ card, open, onClose, onUpdate, onDelete }: CardDetailModalProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingDesc, setEditingDesc] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [checklists, setChecklists] = useState<ChecklistData[]>([]);
  const [addingChecklist, setAddingChecklist] = useState(false);
  const [checklistTitle, setChecklistTitle] = useState("");
  const [newItemText, setNewItemText] = useState<Record<string, string>>({});
  const [showLabelPicker, setShowLabelPicker] = useState(false);

  useEffect(() => {
    if (card) { setTitle(card.title); setDescription(card.description ?? ""); }
  }, [card]);

  if (!card) return null;

  const handleTitleSave = () => {
    if (title.trim() && title !== card.title) { onUpdate(card.id, { title: title.trim() }); toast.success("Title updated"); }
    setEditingTitle(false);
  };

  const handleDescSave = () => {
    onUpdate(card.id, { description });
    setEditingDesc(false);
    toast.success("Description saved");
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    const c: Comment = { id: `c-${Date.now()}`, content: commentText, user: { name: "You" }, createdAt: new Date().toISOString() };
    setComments(prev => [...prev, c]);
    setCommentText("");
    await fetch(`/api/cards/${card.id}/comments`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: c.content }) }).catch(() => toast.error("Failed to save comment"));
    setSubmittingComment(false);
  };

  const handleAddChecklist = () => {
    if (!checklistTitle.trim()) return;
    const cl: ChecklistData = { id: `cl-${Date.now()}`, title: checklistTitle, items: [] };
    setChecklists(prev => [...prev, cl]);
    setChecklistTitle("");
    setAddingChecklist(false);
  };

  const handleAddChecklistItem = (clId: string) => {
    const text = newItemText[clId]?.trim();
    if (!text) return;
    const item: ChecklistItem = { id: `item-${Date.now()}`, title: text, isCompleted: false };
    setChecklists(prev => prev.map(cl => cl.id === clId ? { ...cl, items: [...cl.items, item] } : cl));
    setNewItemText(prev => ({ ...prev, [clId]: "" }));
  };

  const toggleChecklistItem = (clId: string, itemId: string) => {
    setChecklists(prev => prev.map(cl => cl.id === clId
      ? { ...cl, items: cl.items.map(it => it.id === itemId ? { ...it, isCompleted: !it.isCompleted } : it) }
      : cl
    ));
  };

  const toggleLabel = (label: string) => {
    const labels = card.labels.includes(label) ? card.labels.filter(l => l !== label) : [...card.labels, label];
    onUpdate(card.id, { labels });
  };

  const completedCount = (cl: ChecklistData) => cl.items.filter(i => i.isCompleted).length;
  const pct = (cl: ChecklistData) => cl.items.length ? Math.round((completedCount(cl) / cl.items.length) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-primary to-blue-500" />
        <div className="flex overflow-hidden" style={{ height: "calc(90vh - 6px)" }}>

          {/* Main content */}
          <ScrollArea className="flex-1 p-6">
            {/* Title */}
            <div className="mb-4">
              {editingTitle ? (
                <div className="flex gap-2">
                  <Input autoFocus value={title} onChange={e => setTitle(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") handleTitleSave(); if (e.key === "Escape") setEditingTitle(false); }}
                    className="text-lg font-semibold" />
                  <Button size="sm" onClick={handleTitleSave}>Save</Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingTitle(false)}><X className="w-4 h-4" /></Button>
                </div>
              ) : (
                <h2 className="text-xl font-semibold cursor-pointer hover:bg-muted rounded-lg px-2 py-1 -mx-2 group flex items-start gap-2" onClick={() => setEditingTitle(true)}>
                  {card.title}
                  <Edit3 className="w-4 h-4 opacity-0 group-hover:opacity-40 mt-1 shrink-0" />
                </h2>
              )}
              {/* Labels */}
              {card.labels.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2 px-2">
                  {card.labels.map(l => (
                    <Badge key={l} variant="secondary" className="text-xs cursor-pointer" onClick={() => toggleLabel(l)}>
                      {l} <X className="w-2.5 h-2.5 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Separator className="mb-4" />

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2"><Edit3 className="w-4 h-4" /> Description</h3>
              {editingDesc ? (
                <div className="space-y-2">
                  <Textarea autoFocus value={description} onChange={e => setDescription(e.target.value)} rows={5} placeholder="Add a description…" />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleDescSave}>Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingDesc(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div onClick={() => setEditingDesc(true)} className="min-h-[60px] p-3 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer text-sm">
                  {card.description || <span className="text-muted-foreground italic">Click to add description…</span>}
                </div>
              )}
            </div>

            {/* Checklists */}
            {checklists.map(cl => (
              <div key={cl.id} className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium flex items-center gap-2"><CheckSquare className="w-4 h-4" /> {cl.title}</h3>
                  <span className="text-xs text-muted-foreground">{completedCount(cl)}/{cl.items.length} — {pct(cl)}%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full mb-3">
                  <div className="h-1.5 bg-primary rounded-full transition-all" style={{ width: `${pct(cl)}%` }} />
                </div>
                <div className="space-y-2 mb-2">
                  {cl.items.map(item => (
                    <div key={item.id} className="flex items-center gap-2">
                      <Checkbox checked={item.isCompleted} onCheckedChange={() => toggleChecklistItem(cl.id, item.id)} />
                      <span className={cn("text-sm", item.isCompleted && "line-through text-muted-foreground")}>{item.title}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-1">
                  <Input placeholder="Add item…" value={newItemText[cl.id] ?? ""} onChange={e => setNewItemText(p => ({ ...p, [cl.id]: e.target.value }))}
                    onKeyDown={e => { if (e.key === "Enter") handleAddChecklistItem(cl.id); }}
                    className="h-7 text-xs flex-1" />
                  <Button size="sm" className="h-7 text-xs" onClick={() => handleAddChecklistItem(cl.id)}>Add</Button>
                </div>
              </div>
            ))}

            {addingChecklist && (
              <div className="mb-6 flex gap-2">
                <Input autoFocus placeholder="Checklist title…" value={checklistTitle} onChange={e => setChecklistTitle(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") handleAddChecklist(); if (e.key === "Escape") setAddingChecklist(false); }}
                  className="h-8 text-sm" />
                <Button size="sm" onClick={handleAddChecklist}>Add</Button>
                <Button size="sm" variant="ghost" onClick={() => setAddingChecklist(false)}>Cancel</Button>
              </div>
            )}

            {/* Comments */}
            <div>
              <h3 className="text-sm font-medium mb-4 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Comments ({comments.length})</h3>
              <div className="space-y-4 mb-4">
                {comments.map(comment => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="w-7 h-7 shrink-0 mt-0.5">
                      <AvatarFallback className="text-xs">{comment.user.name.slice(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-sm font-medium">{comment.user.name}</span>
                        <span className="text-xs text-muted-foreground">{formatRelativeTime(comment.createdAt)}</span>
                      </div>
                      <div className="bg-muted/40 rounded-lg p-3 text-sm">{comment.content}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Avatar className="w-7 h-7 shrink-0 mt-1"><AvatarFallback className="text-xs">ME</AvatarFallback></Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea placeholder="Write a comment… (Ctrl+Enter to submit)" value={commentText} onChange={e => setCommentText(e.target.value)} rows={3} className="text-sm"
                    onKeyDown={e => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleAddComment(); }} />
                  <Button size="sm" onClick={handleAddComment} disabled={!commentText.trim() || submittingComment} className="gap-2">
                    <Send className="w-3.5 h-3.5" /> {submittingComment ? "Posting…" : "Comment"}
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Sidebar actions */}
          <div className="w-52 border-l border-border p-4 space-y-4 overflow-y-auto shrink-0 bg-muted/10">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Priority</p>
              <Select value={card.priority ?? "NONE"} onValueChange={v => { onUpdate(card.id, { priority: v as Card["priority"] }); toast.success("Priority updated"); }}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{PRIORITY_OPTIONS.map(p => <SelectItem key={p.value} value={p.value} className="text-xs">{p.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Due Date</p>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <Input type="date" defaultValue={card.dueDate ?? ""}
                  onChange={e => onUpdate(card.id, { dueDate: e.target.value || null })}
                  className="h-8 text-xs flex-1 min-w-0" />
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Labels</p>
              <div className="flex flex-wrap gap-1 mb-1">
                {card.labels.map(l => <Badge key={l} variant="secondary" className="text-[10px]">{l}</Badge>)}
              </div>
              {showLabelPicker ? (
                <div className="space-y-1">
                  {LABEL_OPTIONS.map(l => (
                    <button key={l} onClick={() => toggleLabel(l)}
                      className={cn("w-full text-left text-xs px-2 py-1 rounded hover:bg-muted transition-colors", card.labels.includes(l) && "bg-primary/10 text-primary")}>
                      {card.labels.includes(l) ? "✓ " : ""}{l}
                    </button>
                  ))}
                  <Button size="sm" variant="ghost" className="w-full h-6 text-xs" onClick={() => setShowLabelPicker(false)}>Done</Button>
                </div>
              ) : (
                <Button size="sm" variant="ghost" className="w-full h-7 text-xs gap-1" onClick={() => setShowLabelPicker(true)}>
                  <Tag className="w-3 h-3" /> Edit Labels
                </Button>
              )}
            </div>

            <Separator />

            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Actions</p>
              <div className="space-y-1">
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2 h-8 text-xs"><User className="w-3.5 h-3.5" /> Assign Member</Button>
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2 h-8 text-xs" onClick={() => setAddingChecklist(true)}>
                  <CheckSquare className="w-3.5 h-3.5" /> Add Checklist
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2 h-8 text-xs"><Paperclip className="w-3.5 h-3.5" /> Attach File</Button>
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2 h-8 text-xs"><Plus className="w-3.5 h-3.5" /> Add to Sprint</Button>
              </div>
            </div>

            <Separator />

            <Button variant="ghost" size="sm" className="w-full justify-start gap-2 h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => { onDelete(card.id); onClose(); toast.success("Card deleted"); }}>
              <Trash2 className="w-3.5 h-3.5" /> Delete card
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
