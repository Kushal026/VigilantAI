import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, CheckCircle, XCircle, FileText } from "lucide-react";
import { generateAlerts, generateLoginLogs } from "@/lib/data-simulator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Investigation = () => {
  const flaggedAlerts = useMemo(() => generateAlerts(15).filter(a => a.severity === "critical" || a.severity === "high"), []);
  const [selectedAlert, setSelectedAlert] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});

  const markResolved = (index: number) => {
    // In production, this would update the database
    flaggedAlerts[index].status = "resolved";
  };

  return (
    <DashboardLayout title="Threat Investigation Panel">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Flagged Users List */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-primary" />
              <CardTitle className="text-sm font-medium">Flagged Threats</CardTitle>
              <Badge variant="destructive" className="text-[10px]">
                {flaggedAlerts.length} Items
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="text-muted-foreground text-xs">Alert Type</TableHead>
                  <TableHead className="text-muted-foreground text-xs">Severity</TableHead>
                  <TableHead className="text-muted-foreground text-xs">Score</TableHead>
                  <TableHead className="text-muted-foreground text-xs">IP</TableHead>
                  <TableHead className="text-muted-foreground text-xs">Status</TableHead>
                  <TableHead className="text-muted-foreground text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flaggedAlerts.map((alert, i) => (
                  <TableRow
                    key={i}
                    className={`border-border/30 cursor-pointer ${selectedAlert === i ? "bg-primary/5" : "hover:bg-muted/30"}`}
                    onClick={() => setSelectedAlert(i)}
                  >
                    <TableCell className="text-xs capitalize">{alert.alert_type?.replace(/_/g, " ")}</TableCell>
                    <TableCell>
                      <Badge variant="destructive" className="text-[10px]">{alert.severity}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs font-bold text-destructive">{alert.risk_score}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{alert.ip_address}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] ${
                        alert.status === "resolved" ? "border-success/50 text-success" : "border-destructive/50 text-destructive"
                      }`}>
                        {alert.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-success hover:text-success hover:bg-success/10"
                          onClick={(e) => { e.stopPropagation(); markResolved(i); }}
                        >
                          <CheckCircle className="w-3 h-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <XCircle className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Detail Panel */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Investigation Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedAlert !== null ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Alert Type</span>
                    <span className="capitalize">{flaggedAlerts[selectedAlert]?.alert_type?.replace(/_/g, " ")}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Anomaly</span>
                    <span className="capitalize">{flaggedAlerts[selectedAlert]?.anomaly_type?.replace(/_/g, " ")}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Risk Score</span>
                    <span className="font-mono font-bold text-destructive">{flaggedAlerts[selectedAlert]?.risk_score}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">IP Address</span>
                    <span className="font-mono">{flaggedAlerts[selectedAlert]?.ip_address}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Time</span>
                    <span>{flaggedAlerts[selectedAlert]?.created_at ? new Date(flaggedAlerts[selectedAlert].created_at!).toLocaleString() : ""}</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Description</p>
                  <p className="text-xs bg-muted/30 p-3 rounded-lg">{flaggedAlerts[selectedAlert]?.description}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Investigation Notes</p>
                  <Textarea
                    placeholder="Add investigation notes..."
                    value={notes[selectedAlert] || ""}
                    onChange={(e) => setNotes({ ...notes, [selectedAlert]: e.target.value })}
                    className="bg-muted/30 border-border/50 text-xs min-h-[80px]"
                  />
                </div>

                <Button className="w-full gradient-primary text-primary-foreground text-xs" size="sm">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Mark as Resolved
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Select a threat to view details
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Investigation;
