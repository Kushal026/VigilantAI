import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, AlertTriangle } from "lucide-react";
import { generateAlerts } from "@/lib/data-simulator";

const severityColors: Record<string, string> = {
  critical: "bg-destructive text-destructive-foreground",
  high: "border-destructive/50 text-destructive",
  medium: "border-warning/50 text-warning",
  low: "border-success/50 text-success",
};

const statusColors: Record<string, string> = {
  open: "bg-destructive/10 text-destructive border-destructive/30",
  investigating: "bg-warning/10 text-warning border-warning/30",
  resolved: "bg-success/10 text-success border-success/30",
  dismissed: "bg-muted text-muted-foreground border-border",
};

const ThreatAlerts = () => {
  const alerts = useMemo(() => generateAlerts(30), []);
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = alerts.filter((a) => {
    return (severityFilter === "all" || a.severity === severityFilter) &&
           (statusFilter === "all" || a.status === statusFilter);
  });

  return (
    <DashboardLayout title="Threat Alerts">
      <Card className="glass-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <CardTitle className="text-sm font-medium">Security Alerts Feed</CardTitle>
              <Badge variant="outline" className="text-[10px] border-destructive/50 text-destructive">
                {alerts.filter(a => a.status === "open").length} Open
              </Badge>
            </div>
            <div className="flex gap-2">
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-32 bg-muted/50 border-border/50 text-sm">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 bg-muted/50 border-border/50 text-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="text-muted-foreground text-xs">Alert Type</TableHead>
                <TableHead className="text-muted-foreground text-xs">Anomaly</TableHead>
                <TableHead className="text-muted-foreground text-xs">Severity</TableHead>
                <TableHead className="text-muted-foreground text-xs">Risk Score</TableHead>
                <TableHead className="text-muted-foreground text-xs">IP Address</TableHead>
                <TableHead className="text-muted-foreground text-xs">Status</TableHead>
                <TableHead className="text-muted-foreground text-xs">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((alert, i) => (
                <TableRow key={i} className="border-border/30 hover:bg-muted/30">
                  <TableCell className="text-xs capitalize">{alert.alert_type?.replace(/_/g, " ")}</TableCell>
                  <TableCell className="text-xs text-muted-foreground capitalize">{alert.anomaly_type?.replace(/_/g, " ")}</TableCell>
                  <TableCell>
                    <Badge variant={alert.severity === "critical" ? "destructive" : "outline"} className={`text-[10px] ${severityColors[alert.severity || "low"]}`}>
                      {alert.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`font-mono text-xs font-bold ${
                      (alert.risk_score || 0) > 70 ? "text-destructive" : (alert.risk_score || 0) > 40 ? "text-warning" : "text-success"
                    }`}>
                      {alert.risk_score}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{alert.ip_address}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] ${statusColors[alert.status || "open"]}`}>
                      {alert.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {alert.created_at ? new Date(alert.created_at).toLocaleString() : ""}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default ThreatAlerts;
