"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Search, MoreHorizontal, Shield } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { InviteMemberDialog } from "@/features/invite/invite-member-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const MEMBERS = [
  { id: "1", name: "Alex Kim", email: "alex@acme.com", role: "OWNER", initials: "AK", status: "online", joinedAt: "Jan 2026" },
  { id: "2", name: "Sarah Chen", email: "sarah@acme.com", role: "ADMIN", initials: "SC", status: "online", joinedAt: "Jan 2026" },
  { id: "3", name: "Marcus Rivera", email: "marcus@acme.com", role: "MANAGER", initials: "MR", status: "away", joinedAt: "Feb 2026" },
  { id: "4", name: "Priya Patel", email: "priya@acme.com", role: "MEMBER", initials: "PP", status: "offline", joinedAt: "Feb 2026" },
  { id: "5", name: "James Wilson", email: "james@acme.com", role: "MEMBER", initials: "JW", status: "offline", joinedAt: "Mar 2026" },
  { id: "6", name: "Leila Hassan", email: "leila@acme.com", role: "GUEST", initials: "LH", status: "online", joinedAt: "Apr 2026" },
];

const ROLE_STYLES: Record<string, string> = {
  OWNER: "bg-primary/20 text-primary",
  ADMIN: "bg-blue-500/20 text-blue-400",
  MANAGER: "bg-purple-500/20 text-purple-400",
  MEMBER: "bg-secondary text-secondary-foreground",
  GUEST: "bg-muted text-muted-foreground",
};

const STATUS_DOT: Record<string, string> = {
  online: "bg-green-500", away: "bg-yellow-500", offline: "bg-muted-foreground/50",
};

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [loading] = useState(false);

  const filtered = MEMBERS.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = (memberId: string, newRole: string) => {
    toast.success(`Role updated to ${newRole}`);
    console.log("Update role:", memberId, newRole);
  };

  const handleSuspend = (memberId: string, name: string) => {
    toast.success(`${name} has been suspended`);
    console.log("Suspend:", memberId);
  };

  const handleRemove = (memberId: string, name: string) => {
    toast.success(`${name} removed from workspace`);
    console.log("Remove:", memberId);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Team Members</h1>
          <p className="text-muted-foreground mt-1">{MEMBERS.length} members · {MEMBERS.filter(m => m.status === "online").length} online now</p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => setInviteOpen(true)}>
          <UserPlus className="w-4 h-4" /> Invite Member
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search members by name or email…" className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Shield className="w-4 h-4" /> Members ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="divide-y divide-border">
              {[1,2,3,4].map(i => (
                <div key={i} className="flex items-center gap-4 px-6 py-4">
                  <Skeleton className="w-9 h-9 rounded-full" />
                  <div className="flex-1 space-y-1"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-48" /></div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map(member => (
                <div key={member.id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-9 h-9">
                        <AvatarFallback className="text-sm font-semibold">{member.initials}</AvatarFallback>
                      </Avatar>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${STATUS_DOT[member.status]}`} />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{member.name}</div>
                      <div className="text-xs text-muted-foreground">{member.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground hidden sm:block">Joined {member.joinedAt}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ROLE_STYLES[member.role]}`}>
                      {member.role.charAt(0) + member.role.slice(1).toLowerCase()}
                    </span>
                    {member.role !== "OWNER" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleRoleChange(member.id, "ADMIN")}>Make Admin</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRoleChange(member.id, "MANAGER")}>Make Manager</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRoleChange(member.id, "MEMBER")}>Make Member</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRoleChange(member.id, "GUEST")}>Make Guest</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleSuspend(member.id, member.name)} className="text-yellow-600">Suspend</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRemove(member.id, member.name)} className="text-destructive">Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="py-12 text-center text-muted-foreground text-sm">No members match your search</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <InviteMemberDialog open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </div>
  );
}
