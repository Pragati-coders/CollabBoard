import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCheck, Calendar } from "lucide-react";

const NOTIFICATIONS = [
  { id: "1", type: "MENTION", title: "Alex Kim mentioned you", message: "in Implement OAuth — can you review this PR?", time: "2m ago", read: false, initials: "AK" },
  { id: "2", type: "ASSIGNMENT", title: "New task assigned", message: "Sarah Chen assigned API rate limiting to you", time: "1h ago", read: false, initials: "SC" },
  { id: "3", type: "COMMENT", title: "New comment", message: "Marcus Rivera commented on Design system v2", time: "3h ago", read: false, initials: "MR" },
  { id: "4", type: "INVITATION", title: "Workspace invitation", message: "You were invited to join Acme Engineering workspace", time: "1d ago", read: true, initials: "PP" },
  { id: "5", type: "DUE_DATE", title: "Task due tomorrow", message: "Frontend redesign is due on Jul 5, 2026", time: "2d ago", read: true, initials: null },
  { id: "6", type: "BOARD_UPDATE", title: "Board updated", message: "James Wilson archived the Old Sprint board", time: "3d ago", read: true, initials: "JW" },
];

export default async function NotificationsPage() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) redirect("/onboarding");
  const unread = NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Notifications
            {unread > 0 && <Badge className="text-xs">{unread} new</Badge>}
          </h1>
          <p className="text-muted-foreground mt-1">Stay up to date with your team.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <CheckCheck className="w-4 h-4" /> Mark all read
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {NOTIFICATIONS.map((notif) => (
              <div key={notif.id} className={`flex items-start gap-4 px-6 py-4 hover:bg-muted/30 transition-colors ${!notif.read ? "bg-primary/5" : ""}`}>
                <div className="relative mt-0.5">
                  {notif.initials ? (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs font-semibold">{notif.initials}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  {!notif.read && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{notif.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{notif.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
