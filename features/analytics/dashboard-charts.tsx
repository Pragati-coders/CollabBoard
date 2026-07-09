"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const WEEKLY_DATA = [
  { day: "Mon", completed: 8, created: 12 },
  { day: "Tue", completed: 15, created: 10 },
  { day: "Wed", completed: 6, created: 14 },
  { day: "Thu", completed: 20, created: 8 },
  { day: "Fri", completed: 18, created: 16 },
  { day: "Sat", completed: 4, created: 2 },
  { day: "Sun", completed: 2, created: 1 },
];

const MONTHLY_DATA = [
  { month: "Aug", tasks: 145 },
  { month: "Sep", tasks: 189 },
  { month: "Oct", tasks: 167 },
  { month: "Nov", tasks: 234 },
  { month: "Dec", tasks: 198 },
  { month: "Jan", tasks: 276 },
];

export function DashboardCharts() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={WEEKLY_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="completedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(262.1 83.3% 57.8%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(262.1 83.3% 57.8%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 27.9% 16.9%)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(217.9 10.6% 64.9%)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(217.9 10.6% 64.9%)" }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: "hsl(224 71.4% 4.1%)", border: "1px solid hsl(215 27.9% 16.9%)", borderRadius: "8px", fontSize: "12px" }}
                labelStyle={{ color: "hsl(210 20% 98%)" }}
              />
              <Area type="monotone" dataKey="completed" stroke="hsl(262.1 83.3% 57.8%)" fill="url(#completedGrad)" strokeWidth={2} name="Completed" />
              <Area type="monotone" dataKey="created" stroke="hsl(217.2 91.2% 59.8%)" fill="transparent" strokeWidth={2} strokeDasharray="4 2" name="Created" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Monthly Tasks Closed</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={MONTHLY_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 27.9% 16.9%)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(217.9 10.6% 64.9%)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(217.9 10.6% 64.9%)" }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: "hsl(224 71.4% 4.1%)", border: "1px solid hsl(215 27.9% 16.9%)", borderRadius: "8px", fontSize: "12px" }}
                cursor={{ fill: "hsl(215 27.9% 16.9%)" }}
              />
              <Bar dataKey="tasks" fill="hsl(262.1 83.3% 57.8%)" radius={[4, 4, 0, 0]} name="Tasks" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
