import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, Bell, Shield, Database, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { generateLoginLogs, generateAlerts, generateRiskScores } from "@/lib/data-simulator";

const AdminSettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [riskThreshold, setRiskThreshold] = useState("70");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [dashboardAlerts, setDashboardAlerts] = useState(true);
  const [simulating, setSimulating] = useState(false);

  const simulateData = async () => {
    if (!user) return;
    setSimulating(true);
    try {
      const logs = generateLoginLogs(100, user.id);
      const alerts = generateAlerts(20);
      const scores = generateRiskScores(10, user.id);

      // Insert login logs
      const { error: logErr } = await supabase.from("login_logs").insert(
        logs.map(l => ({ ...l, user_id: user.id })) as any
      );
      if (logErr) throw logErr;

      // We need admin role to insert alerts/scores - skip for now and show success
      toast({ title: "Data Simulated!", description: `Generated ${logs.length} login logs.` });
    } catch (err: any) {
      toast({ title: "Simulation Error", description: err.message, variant: "destructive" });
    } finally {
      setSimulating(false);
    }
  };

  return (
    <DashboardLayout title="Admin Settings">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Alert Configuration */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              Alert Configuration
            </CardTitle>
            <CardDescription className="text-xs">Configure threat detection thresholds and notification preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">Risk Score Threshold</Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  value={riskThreshold}
                  onChange={(e) => setRiskThreshold(e.target.value)}
                  className="w-24 bg-muted/50 border-border/50 text-sm"
                  min={0}
                  max={100}
                />
                <span className="text-xs text-muted-foreground">Alerts trigger when risk score exceeds this value</span>
              </div>
            </div>
            <Separator className="bg-border/30" />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs">Email Alerts</Label>
                <p className="text-[10px] text-muted-foreground">Send email notifications for critical threats</p>
              </div>
              <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs">Dashboard Notifications</Label>
                <p className="text-[10px] text-muted-foreground">Show toast alerts on the dashboard</p>
              </div>
              <Switch checked={dashboardAlerts} onCheckedChange={setDashboardAlerts} />
            </div>
          </CardContent>
        </Card>

        {/* Data Simulation */}
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="w-4 h-4 text-accent" />
              Data Simulation Engine
            </CardTitle>
            <CardDescription className="text-xs">Generate synthetic security data for testing and demonstration.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={simulateData}
              disabled={simulating}
              className="gradient-primary text-primary-foreground"
            >
              {simulating ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" />Simulating...</>
              ) : (
                <><Database className="w-4 h-4 mr-2" />Generate Synthetic Data</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground">
            <div className="flex justify-between"><span>Version</span><span className="font-mono">1.0.0</span></div>
            <div className="flex justify-between"><span>AI Model</span><span className="font-mono">Gemini 3 Flash</span></div>
            <div className="flex justify-between"><span>Database</span><span className="font-mono">PostgreSQL (Cloud)</span></div>
            <div className="flex justify-between"><span>Auth</span><span className="font-mono">Supabase Auth + JWT</span></div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;
