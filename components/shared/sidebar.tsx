"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard, FolderKanban, CheckSquare, Users,
  BarChart3, Bell, Settings, Kanban, Search, Plus, Activity, CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CommandPalette } from "@/components/shared/command-palette";
import { useNotifications } from "@/hooks/use-notifications";

const NAV_ITEMS = [
  { label: "Dashboard",     href: "/dashboard",                icon: LayoutDashboard },
  { label: "Projects",      href: "/dashboard/projects",       icon: FolderKanban },
  { label: "My Tasks",      href: "/dashboard/tasks",          icon: CheckSquare },
  { label: "Team",          href: "/dashboard/members",        icon: Users },
  { label: "Analytics",     href: "/dashboard/analytics",      icon: BarChart3 },
  { label: "Activity",      href: "/dashboard/activity",       icon: Activity },
];

const BOTTOM_NAV = [
  { label: "Billing",       href: "/dashboard/billing",        icon: CreditCard },
  { label: "Settings",      href: "/dashboard/settings",       icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { unreadCount } = useNotifications();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <>
      <CommandPalette />
      <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-sidebar-border bg-sidebar flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-4 border-b border-sidebar-border shrink-0">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Kanban className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sidebar-foreground text-sm">CollabBoard</span>
        </div>

        {/* Org Switcher */}
        <div className="px-3 py-3 border-b border-sidebar-border shrink-0">
          <OrganizationSwitcher
            appearance={{
              elements: {
                rootBox: "w-full",
                organizationSwitcherTrigger: "w-full justify-start gap-2 px-2 py-1.5 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
              },
            }}
          />
        </div>

        {/* Search */}
        <div className="px-3 py-2 shrink-0">
          <button
            onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }))}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-sidebar-foreground/60 bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
          >
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span>Search…</span>
            <kbd className="ml-auto text-xs bg-sidebar-border/50 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
          </button>
        </div>

        <ScrollArea className="flex-1 px-3 py-2">
          {/* Main nav */}
          <nav className="space-y-0.5">
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
              <Link key={href} href={href}>
                <span className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive(href)
                    ? "bg-sidebar-accent text-sidebar-foreground font-medium"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}>
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </span>
              </Link>
            ))}

            {/* Notifications with badge */}
            <Link href="/dashboard/notifications">
              <span className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
                isActive("/dashboard/notifications")
                  ? "bg-sidebar-accent text-sidebar-foreground font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}>
                <Bell className="w-4 h-4 shrink-0" />
                Notifications
                {unreadCount > 0 && (
                  <Badge className="ml-auto text-xs h-4 px-1.5 min-w-4 flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Badge>
                )}
              </span>
            </Link>
          </nav>

          {/* Quick actions */}
          <div className="mt-6">
            <p className="text-xs font-medium text-sidebar-foreground/40 uppercase tracking-wider px-3 mb-2">Quick Actions</p>
            <Link href="/dashboard/projects/new">
              <span className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors">
                <Plus className="w-4 h-4 shrink-0" /> New Project
              </span>
            </Link>
          </div>
        </ScrollArea>

        {/* Footer nav */}
        <div className="border-t border-sidebar-border p-3 space-y-0.5 shrink-0">
          {BOTTOM_NAV.map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href}>
              <span className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
                isActive(href)
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}>
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </span>
            </Link>
          ))}
          <div className="flex items-center gap-3 px-3 py-2">
            <UserButton appearance={{ elements: { avatarBox: "w-6 h-6" } }} />
            <span className="text-sm text-sidebar-foreground/70 truncate">Account</span>
          </div>
        </div>
      </aside>
    </>
  );
}
