"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BarChart, Bar, LineChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const BURNDOWN = [
  { day: "Jun 1", remaining: 120, ideal: 120 },
  { day: "Jun 5", remaining: 95, ideal: 90 },
  { day: "Jun 10", remaining: 70, ideal: 60 },
  { day: "Jun 15", remaining: 58, ideal: 30 },
  { day: "Jun 20", remaining: 30, ideal: 0 },
  { day: "Jun 25", remaining: 12, ideal: 0 },
];

const VELOCITY = [
  { sprint: "S1", points: 42 }, { sprint: "S2", points: 58 },
  { sprint: "S3", points: 51 }, { sprint: "S4", points: 67 },
  { sprint: "S5", points: 73 }, { sprint: "S6", points: 69 },
];

const WORKLOAD = [
  { member: "Alex", tasks: 12, points: 34 },
  { member: "Sarah", tasks: 8, points: 28 },
  { member: "Marcus", tasks: 15, points: 41 },
  { member: "Priya", tasks: 6, points: 19 },
  { member: "James", tasks: 10, points: 25 },
];

const RADAR_DATA = [
  { subject: "Velocity", A: 85 }, { subject: "Quality", A: 72 },
  { subject: "Delivery", A: 90 }, { subject: "Collab", A: 78 }, { subject: "Focus", A: 65 },
];

const KPI = [
  { label: "Sprint Velocity", value: "69 pts", trend: "up", delta: "+8%" },
  { label: "Cycle Time", value: "3.2 days", trend: "down", delta: "-15%" },
  { label: "Bug Rate", value: "2.1%", trend: "up", delta: "+0.3%" },
  { label: "Completion Rate", value: "87%", trend: "up", delta: "+4%" },
];

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "up") return <TrendingUp className="w-3.5 h-3.5 text-green-400" />;
  if (trend === "down") return <TrendingDown className="w-3.5 h-3.5 text-green-400" />;
  return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
}

const CHART_STYLE = {
  grid: "hsl(215 27.9% 16.9%)",
  tick: { fontSize: 11, fill: "hsl(217.9 10.6% 64.9%)" },
  tooltip: {
    contentStyle: { background: "hsl(224 71.4% 4.1%)", border: "1px solid hsl(215 27.9% 16.9%)", borderRadius: "8px", fontSize: "12px" },
    labelStyle: { color: "hsl(210 20% 98%)" },
  },
};

export function AnalyticsDashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Team performance and project health insights.</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {KPI.map(({ label, value, trend, delta }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <div className="text-xs text-muted-foreground mb-2">{label}</div>
              <div className="text-2xl font-bold mb-2">{value}</div>
              <div className="flex items-center gap-1 text-xs text-green-400">
                <TrendIcon trend={trend} /> {delta} this sprint
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="burndown">Burndown</TabsTrigger>
          <TabsTrigger value="workload">Workload</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Sprint Velocity</CardTitle>
                <CardDescription>Story points completed per sprint</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={VELOCITY} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_STYLE.grid} vertical={false} />
                    <XAxis dataKey="sprint" tick={CHART_STYLE.tick} tickLine={false} axisLine={false} />
                    <YAxis tick={CHART_STYLE.tick} tickLine={false} axisLine={false} />
                    <Tooltip {...CHART_STYLE.tooltip} />
                    <Bar dataKey="points" fill="hsl(262.1 83.3% 57.8%)" radius={[4,4,0,0]} name="Points" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Team Health</CardTitle>
                <CardDescription>Performance across key dimensions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={RADAR_DATA} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
                    <PolarGrid stroke={CHART_STYLE.grid} />
                    <PolarAngleAxis dataKey="subject" tick={CHART_STYLE.tick} />
                    <Radar name="Team" dataKey="A" stroke="hsl(262.1 83.3% 57.8%)" fill="hsl(262.1 83.3% 57.8%)" fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="burndown">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Sprint Burndown</CardTitle>
              <CardDescription>Remaining vs ideal work for the current sprint</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={BURNDOWN} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_STYLE.grid} />
                  <XAxis dataKey="day" tick={CHART_STYLE.tick} tickLine={false} axisLine={false} />
                  <YAxis tick={CHART_STYLE.tick} tickLine={false} axisLine={false} />
                  <Tooltip {...CHART_STYLE.tooltip} />
                  <Legend />
                  <Line type="monotone" dataKey="remaining" stroke="hsl(262.1 83.3% 57.8%)" strokeWidth={2} dot={false} name="Remaining" />
                  <Line type="monotone" dataKey="ideal" stroke="hsl(217.9 10.6% 64.9%)" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Ideal" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workload">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Workload Distribution</CardTitle>
              <CardDescription>Tasks and story points per team member</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={WORKLOAD} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_STYLE.grid} vertical={false} />
                  <XAxis dataKey="member" tick={CHART_STYLE.tick} tickLine={false} axisLine={false} />
                  <YAxis tick={CHART_STYLE.tick} tickLine={false} axisLine={false} />
                  <Tooltip {...CHART_STYLE.tooltip} />
                  <Legend />
                  <Bar dataKey="tasks" fill="hsl(262.1 83.3% 57.8%)" radius={[4,4,0,0]} name="Tasks" />
                  <Bar dataKey="points" fill="hsl(217.2 91.2% 59.8%)" radius={[4,4,0,0]} name="Points" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
