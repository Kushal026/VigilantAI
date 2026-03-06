import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { generateLoginLogs } from "@/lib/data-simulator";

const UserActivity = () => {
  const logs = useMemo(() => generateLoginLogs(50), []);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = logs.filter((log) => {
    const matchSearch = !search || log.email?.toLowerCase().includes(search.toLowerCase()) || log.ip_address?.includes(search) || log.location?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || (statusFilter === "success" && log.success) || (statusFilter === "failed" && !log.success);
    return matchSearch && matchStatus;
  });

  return (
    <DashboardLayout title="User Activity Monitor">
      <Card className="glass-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <CardTitle className="text-sm font-medium">Login Activity Log</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search email, IP, location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-muted/50 border-border/50 w-64 text-sm"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 bg-muted/50 border-border/50 text-sm">
                  <Filter className="w-3 h-3 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="text-muted-foreground text-xs">Email</TableHead>
                <TableHead className="text-muted-foreground text-xs">IP Address</TableHead>
                <TableHead className="text-muted-foreground text-xs">Device</TableHead>
                <TableHead className="text-muted-foreground text-xs">Browser</TableHead>
                <TableHead className="text-muted-foreground text-xs">Location</TableHead>
                <TableHead className="text-muted-foreground text-xs">Time</TableHead>
                <TableHead className="text-muted-foreground text-xs">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((log, i) => (
                <TableRow key={i} className="border-border/30 hover:bg-muted/30">
                  <TableCell className="font-mono text-xs">{log.email}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{log.ip_address}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{log.device_info}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{log.browser}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{log.location}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{log.login_at ? new Date(log.login_at).toLocaleString() : ""}</TableCell>
                  <TableCell>
                    <Badge variant={log.success ? "default" : "destructive"} className="text-[10px]">
                      {log.success ? "Success" : "Failed"}
                    </Badge>
                    {!log.success && log.failure_reason && (
                      <span className="block text-[10px] text-destructive/70 mt-0.5">{log.failure_reason}</span>
                    )}
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

export default UserActivity;
