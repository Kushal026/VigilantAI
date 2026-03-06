import { useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Activity, AlertTriangle, ShieldAlert } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { getDashboardStats, getLoginChartData, getRiskDistribution, generateLoginLogs, generateAlerts } from "@/lib/data-simulator";

const Dashboard = () => {
  const stats = useMemo(() => getDashboardStats(), []);
  const loginData = useMemo(() => getLoginChartData(7), []);
  const riskDist = useMemo(() => getRiskDistribution(), []);
  const recentLogs = useMemo(() => generateLoginLogs(5), []);
  const recentAlerts = useMemo(() => generateAlerts(5), []);

  return (
    <DashboardLayout title="Security Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} variant="default" trend={{ value: 12, label: "vs last month" }} />
        <StatCard title="Active Sessions" value={stats.activeSessions} icon={Activity} variant="success" trend={{ value: 5, label: "vs yesterday" }} />
        <StatCard title="Suspicious Logins" value={stats.suspiciousLogins} icon={AlertTriangle} variant="warning" trend={{ value: -8, label: "vs last week" }} />
        <StatCard title="Threat Alerts" value={stats.threatAlerts} icon={ShieldAlert} variant="danger" trend={{ value: 15, label: "vs last week" }} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Login Attempts Chart */}
        <Card className="glass-card col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Login Attempts (7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={loginData}>
                <defs>
                  <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }}
                />
                <Area type="monotone" dataKey="successful" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorSuccess)" />
                <Area type="monotone" dataKey="failed" stroke="hsl(var(--destructive))" fillOpacity={1} fill="url(#colorFailed)" />
                <Area type="monotone" dataKey="suspicious" stroke="hsl(var(--warning))" fillOpacity={0.2} fill="hsl(var(--warning))" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={riskDist} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                  {riskDist.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <div className="px-6 pb-4 flex gap-4 justify-center">
            {riskDist.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.fill }} />
                {item.name}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Tables row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Logins */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Recent Login Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="text-muted-foreground text-xs">Email</TableHead>
                  <TableHead className="text-muted-foreground text-xs">Location</TableHead>
                  <TableHead className="text-muted-foreground text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLogs.map((log, i) => (
                  <TableRow key={i} className="border-border/30">
                    <TableCell className="font-mono text-xs">{log.email}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{log.location}</TableCell>
                    <TableCell>
                      <Badge variant={log.success ? "default" : "destructive"} className="text-[10px]">
                        {log.success ? "Success" : "Failed"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Latest Threat Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="text-muted-foreground text-xs">Type</TableHead>
                  <TableHead className="text-muted-foreground text-xs">Severity</TableHead>
                  <TableHead className="text-muted-foreground text-xs">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentAlerts.map((alert, i) => (
                  <TableRow key={i} className="border-border/30">
                    <TableCell className="text-xs capitalize">{alert.alert_type?.replace(/_/g, " ")}</TableCell>
                    <TableCell>
                      <Badge
                        variant={alert.severity === "critical" ? "destructive" : "outline"}
                        className={`text-[10px] ${
                          alert.severity === "high" ? "border-destructive/50 text-destructive" :
                          alert.severity === "medium" ? "border-warning/50 text-warning" :
                          "border-success/50 text-success"
                        }`}
                      >
                        {alert.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{alert.risk_score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
