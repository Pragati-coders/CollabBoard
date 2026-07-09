"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Building2, Users, DollarSign, TrendingUp,
  Activity, Shield, AlertTriangle, CheckCircle,
} from "lucide-react";

const GROWTH_DATA = [
  { month: "Aug", orgs: 12, users: 89 }, { month: "Sep", orgs: 19, users: 134 },
  { month: "Oct", orgs: 28, users: 201 }, { month: "Nov", orgs: 41, users: 312 },
  { month: "Dec", orgs: 53, users: 445 }, { month: "Jan", orgs: 67, users: 589 },
];

const REVENUE_DATA = [
  { month: "Aug", mrr: 1200 }, { month: "Sep", mrr: 2400 },
  { month: "Oct", mrr: 3800 }, { month: "Nov", mrr: 5100 },
  { month: "Dec", mrr: 6700 }, { month: "Jan", mrr: 8900 },
];

const ORGS = [
  { name: "Acme Inc", members: 24, plan: "PRO", status: "active", mrr: "$99" },
  { name: "Globex Corp", members: 8, plan: "FREE", status: "active", mrr: "$0" },
  { name: "Initech", members: 52, plan: "BUSINESS", status: "active", mrr: "$299" },
  { name: "Umbrella LLC", members: 3, plan: "FREE", status: "suspended", mrr: "$0" },
  { name: "Stark Industries", members: 120, plan: "ENTERPRISE", status: "active", mrr: "$999" },
];

const PLATFORM_HEALTH = [
  { label: "API Uptime", value: 99.97, status: "healthy" },
  { label: "DB Latency", value: 87, status: "healthy" },
  { label: "Error Rate", value: 0.3, status: "healthy" },
  { label: "Queue Depth", value: 14, status: "warning" },
];

const CHART_TOOLTIP = {
  contentStyle: { background: "hsl(224 71.4% 4.1%)", border: "1px solid hsl(215 27.9% 16.9%)", borderRadius: "8px", fontSize: "12px" },
  labelStyle: { color: "hsl(210 20% 98%)" },
};

const PLAN_COLORS: Record<string, string> = {
  FREE: "bg-muted text-muted-foreground",
  PRO: "bg-blue-500/20 text-blue-400",
  BUSINESS: "bg-purple-500/20 text-purple-400",
  ENTERPRISE: "bg-primary/20 text-primary",
};

export function AdminDashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Platform Admin</h1>
          <p className="text-muted-foreground text-sm">Global platform overview & analytics</p>
        </div>
        <Badge variant="destructive" className="ml-auto text-xs">Admin Only</Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Orgs", value: "67", delta: "+8 this month", icon: Building2, color: "text-blue-400" },
          { label: "Total Users", value: "589", delta: "+144 this month", icon: Users, color: "text-purple-400" },
          { label: "MRR", value: "$8,900", delta: "+$2,200 MoM", icon: DollarSign, color: "text-green-400" },
          { label: "Active Today", value: "312", delta: "53% DAU", icon: Activity, color: "text-orange-400" },
        ].map(({ label, value, delta, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground">{label}</span>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div className="text-2xl font-bold mb-1">{value}</div>
              <div className="text-xs text-green-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> {delta}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="health">Platform Health</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">User & Org Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={GROWTH_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(262.1 83.3% 57.8%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(262.1 83.3% 57.8%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 27.9% 16.9%)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(217.9 10.6% 64.9%)" }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(217.9 10.6% 64.9%)" }} tickLine={false} axisLine={false} />
                    <Tooltip {...CHART_TOOLTIP} />
                    <Area type="monotone" dataKey="users" stroke="hsl(262.1 83.3% 57.8%)" fill="url(#usersGrad)" strokeWidth={2} name="Users" />
                    <Area type="monotone" dataKey="orgs" stroke="hsl(217.2 91.2% 59.8%)" fill="transparent" strokeWidth={2} name="Orgs" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Monthly Recurring Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={REVENUE_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 27.9% 16.9%)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(217.9 10.6% 64.9%)" }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(217.9 10.6% 64.9%)" }} tickLine={false} axisLine={false} />
                    <Tooltip {...CHART_TOOLTIP} formatter={(v) => [`$${v}`, "MRR"]} />
                    <Bar dataKey="mrr" fill="hsl(262.1 83.3% 57.8%)" radius={[4, 4, 0, 0]} name="MRR" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Plan distribution */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Plan Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { plan: "FREE", count: 41, pct: 61 },
                  { plan: "PRO", count: 18, pct: 27 },
                  { plan: "BUSINESS", count: 6, pct: 9 },
                  { plan: "ENTERPRISE", count: 2, pct: 3 },
                ].map(({ plan, count, pct }) => (
                  <div key={plan} className="text-center">
                    <div className="text-2xl font-bold mb-1">{count}</div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PLAN_COLORS[plan]}`}>{plan}</span>
                    <Progress value={pct} className="h-1 mt-2" />
                    <div className="text-xs text-muted-foreground mt-1">{pct}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Organizations */}
        <TabsContent value="organizations">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">All Organizations</CardTitle>
              <CardDescription>{ORGS.length} total workspaces</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {ORGS.map(org => (
                  <div key={org.name} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/20 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                      {org.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{org.name}</div>
                      <div className="text-xs text-muted-foreground">{org.members} members</div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PLAN_COLORS[org.plan]}`}>{org.plan}</span>
                    <span className="text-xs font-medium text-green-400 w-14 text-right">{org.mrr}</span>
                    <Badge variant={org.status === "active" ? "default" : "destructive"} className="text-xs">
                      {org.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platform Health */}
        <TabsContent value="health">
          <div className="grid gap-4 md:grid-cols-2">
            {PLATFORM_HEALTH.map(({ label, value, status }) => (
              <Card key={label}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">{label}</span>
                    {status === "healthy"
                      ? <CheckCircle className="w-4 h-4 text-green-400" />
                      : <AlertTriangle className="w-4 h-4 text-yellow-400" />}
                  </div>
                  <div className="text-2xl font-bold mb-2">
                    {label === "API Uptime" ? `${value}%` : label === "Error Rate" ? `${value}%` : value}
                  </div>
                  <Progress value={label === "Error Rate" ? value * 10 : label === "Queue Depth" ? value : value} className="h-1.5" />
                  <div className={`text-xs mt-2 ${status === "healthy" ? "text-green-400" : "text-yellow-400"}`}>
                    {status === "healthy" ? "All systems normal" : "Minor degradation"}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Subscriptions */}
        <TabsContent value="subscriptions">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Subscription Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6 mb-6">
                {[
                  { label: "MRR", value: "$8,900", sub: "↑ 33% MoM" },
                  { label: "ARR", value: "$106,800", sub: "Annualised" },
                  { label: "Churn Rate", value: "1.2%", sub: "↓ 0.3% MoM" },
                ].map(({ label, value, sub }) => (
                  <div key={label} className="text-center p-4 rounded-lg bg-muted/30">
                    <div className="text-xs text-muted-foreground mb-1">{label}</div>
                    <div className="text-2xl font-bold">{value}</div>
                    <div className="text-xs text-green-400 mt-1">{sub}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
