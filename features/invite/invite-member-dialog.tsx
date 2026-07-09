"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, UserPlus, X, CheckCircle, Send } from "lucide-react";
import { toast } from "sonner";

interface InviteMemberDialogProps {
  open: boolean;
  onClose: () => void;
}

const ROLE_OPTIONS = [
  { value: "ADMIN",   label: "Admin",   desc: "Can manage boards, members, and settings" },
  { value: "MANAGER", label: "Manager", desc: "Can create boards and invite members" },
  { value: "MEMBER",  label: "Member",  desc: "Can create and edit cards" },
  { value: "GUEST",   label: "Guest",   desc: "View-only access" },
];

interface PendingInvite { email: string; role: string; }

export function InviteMemberDialog({ open, onClose }: InviteMemberDialogProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [pending, setPending] = useState<PendingInvite[]>([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const addInvite = () => {
    if (!email.trim() || !email.includes("@")) { toast.error("Enter a valid email address"); return; }
    if (pending.some(p => p.email === email.trim())) { toast.error("Already added"); return; }
    setPending(prev => [...prev, { email: email.trim(), role }]);
    setEmail("");
  };

  const removeInvite = (em: string) => setPending(prev => prev.filter(p => p.email !== em));

  const handleSend = async () => {
    const toSend = pending.length > 0 ? pending : email.trim() ? [{ email: email.trim(), role }] : [];
    if (toSend.length === 0) { toast.error("Add at least one email"); return; }
    setSending(true);
    try {
      for (const inv of toSend) {
        await fetch("/api/members/invite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(inv),
        });
      }
      setSent(true);
      toast.success(`${toSend.length} invitation${toSend.length > 1 ? "s" : ""} sent!`);
      setTimeout(() => { setSent(false); setPending([]); setEmail(""); onClose(); }, 1500);
    } catch {
      toast.error("Failed to send invitations");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><UserPlus className="w-5 h-5" /> Invite Members</DialogTitle>
          <DialogDescription>Invite people to your workspace by email.</DialogDescription>
        </DialogHeader>

        {sent ? (
          <div className="py-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="font-medium">Invitations sent!</p>
            <p className="text-sm text-muted-foreground mt-1">They&apos;ll receive an email shortly.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Email + Role input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="colleague@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addInvite()}
                  className="pl-9"
                />
              </div>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map(r => (
                    <SelectItem key={r.value} value={r.value}>
                      <div>
                        <div className="font-medium text-sm">{r.label}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={addInvite}><UserPlus className="w-4 h-4" /></Button>
            </div>

            {/* Role description */}
            <p className="text-xs text-muted-foreground">
              {ROLE_OPTIONS.find(r => r.value === role)?.desc}
            </p>

            {/* Pending invites */}
            {pending.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {pending.map(inv => (
                  <div key={inv.email} className="flex items-center gap-3 p-2 rounded-lg bg-muted/40">
                    <Avatar className="w-7 h-7 shrink-0">
                      <AvatarFallback className="text-xs">{inv.email.slice(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm truncate">{inv.email}</div>
                      <div className="text-xs text-muted-foreground">{inv.role}</div>
                    </div>
                    <Button onClick={() => removeInvite(inv.email)} className="text-muted-foreground hover:text-foreground">
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button onClick={handleSend} disabled={sending || (pending.length === 0 && !email.trim())} className="flex-1 gap-2">
                <Send className="w-4 h-4" />
                {sending ? "Sending…" : `Send ${pending.length > 0 ? `${pending.length} ` : ""}Invitation${pending.length !== 1 ? "s" : ""}`}
              </Button>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
