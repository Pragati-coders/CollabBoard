import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Kanban, Users, Zap, BarChart3, Bell, Shield } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Kanban className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">CollabBoard</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="#about" className="hover:text-foreground transition-colors">About</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-32 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium mb-8">
          <Zap className="w-3.5 h-3.5" />
          Now with real-time collaboration
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent">
          Your team&apos;s work,<br />beautifully organized.
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          CollabBoard brings your tasks, projects, and team members together in one powerful workspace.
          Built for modern engineering teams that move fast.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/sign-up">
            <Button size="lg" className="gap-2">
              Start for free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button size="lg" variant="outline">View demo</Button>
          </Link>
        </div>
        {/* Hero UI mockup */}
        <div className="mt-20 rounded-xl border border-border/50 bg-card overflow-hidden shadow-2xl shadow-primary/10">
          <div className="bg-sidebar p-3 flex items-center gap-2 border-b border-border/30">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <div className="flex-1 mx-4 bg-background/20 rounded text-xs text-muted-foreground py-1 px-3">
              app.collabboard.io/dashboard
            </div>
          </div>
          <div className="grid grid-cols-4 h-64">
            <div className="bg-sidebar col-span-1 p-4 border-r border-border/20">
              {["Dashboard","Projects","My Tasks","Team","Analytics"].map(item => (
                <div key={item} className={`text-xs py-1.5 px-2 rounded mb-1 ${item === "Projects" ? "bg-sidebar-accent text-sidebar-foreground" : "text-sidebar-foreground/60"}`}>{item}</div>
              ))}
            </div>
            <div className="col-span-3 p-6 bg-background">
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: "Active Projects", value: "12" },
                  { label: "Tasks Due", value: "5" },
                  { label: "Team Members", value: "24" },
                ].map(kpi => (
                  <div key={kpi.label} className="bg-card border border-border rounded-lg p-3">
                    <div className="text-xs text-muted-foreground">{kpi.label}</div>
                    <div className="text-2xl font-bold mt-1">{kpi.value}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {["Todo", "In Progress", "Done"].map(col => (
                  <div key={col} className="bg-muted/40 rounded-lg p-2">
                    <div className="text-xs font-medium text-muted-foreground mb-2">{col}</div>
                    {[1,2].map(i => (
                      <div key={i} className="bg-card border border-border rounded p-2 mb-1.5 text-xs">
                        <div className="h-2 bg-muted rounded w-3/4 mb-1" />
                        <div className="h-2 bg-muted rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-center mb-4">Everything your team needs</h2>
        <p className="text-muted-foreground text-center mb-16">Powerful features designed for modern software teams.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Kanban, title: "Kanban Boards", desc: "Visualize work with drag-and-drop boards. Real-time sync keeps everyone on the same page." },
            { icon: Users, title: "Team Collaboration", desc: "Invite members, assign roles, and manage permissions with our fine-grained RBAC system." },
            { icon: Zap, title: "Real-Time Updates", desc: "See changes instantly as they happen. No more refreshing to check for updates." },
            { icon: BarChart3, title: "Analytics & Reports", desc: "Track velocity, burndown, workload distribution, and team productivity metrics." },
            { icon: Bell, title: "Smart Notifications", desc: "Get notified about what matters — mentions, due dates, assignments, and more." },
            { icon: Shield, title: "Enterprise Security", desc: "SOC 2 ready, with row-level security, audit logs, and tenant isolation." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="group p-6 rounded-xl border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 bg-card">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="rounded-2xl bg-primary/5 border border-primary/20 p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to ship faster?</h2>
          <p className="text-muted-foreground mb-8">Join thousands of teams already using CollabBoard.</p>
          <Link href="/sign-up">
            <Button size="lg" className="gap-2">
              Start free today <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Kanban className="w-4 h-4 text-primary" />
            <span>CollabBoard © 2026</span>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
