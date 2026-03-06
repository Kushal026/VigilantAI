import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Loader2, AlertTriangle, Shield, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AIAnalysis {
  risk_score: number;
  anomaly_label: string;
  explanation: string;
  recommendations: string[];
  factors: Record<string, number>;
}

const RiskAnalysis = () => {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-risk-analysis", {
        body: { action: "analyze" },
      });

      if (error) throw error;
      setAnalysis(data);
    } catch (err: any) {
      toast({ title: "Analysis Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score: number) => 
    score > 70 ? "text-destructive" : score > 40 ? "text-warning" : "text-success";

  const scoreLabel = (score: number) =>
    score > 70 ? "High Risk" : score > 40 ? "Suspicious" : "Normal";

  return (
    <DashboardLayout title="AI Risk Analysis">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Trigger Card */}
        <Card className="glass-card border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center neon-glow mb-4">
              <Brain className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="gradient-text text-xl">AI-Powered Threat Analysis</CardTitle>
            <CardDescription>
              Analyze user behavior patterns using AI to detect anomalies, generate risk scores, and get actionable recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button
              onClick={runAnalysis}
              disabled={loading}
              className="gradient-primary text-primary-foreground neon-glow px-8"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Run AI Analysis
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {analysis && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Risk Score Gauge */}
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="relative w-40 h-40 mx-auto mb-4">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                      <circle
                        cx="60" cy="60" r="50" fill="none"
                        stroke={analysis.risk_score > 70 ? "hsl(var(--destructive))" : analysis.risk_score > 40 ? "hsl(var(--warning))" : "hsl(var(--success))"}
                        strokeWidth="8"
                        strokeDasharray={`${(analysis.risk_score / 100) * 314} 314`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-4xl font-bold font-mono ${scoreColor(analysis.risk_score)}`}>
                        {analysis.risk_score}
                      </span>
                      <span className="text-xs text-muted-foreground">/ 100</span>
                    </div>
                  </div>
                  <Badge className={`${
                    analysis.risk_score > 70 ? "bg-destructive/10 text-destructive border-destructive/30" :
                    analysis.risk_score > 40 ? "bg-warning/10 text-warning border-warning/30" :
                    "bg-success/10 text-success border-success/30"
                  }`}>
                    {scoreLabel(analysis.risk_score)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Explanation */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{analysis.explanation}</p>
              </CardContent>
            </Card>

            {/* Recommendations */}
            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-0.5">→</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Risk Factors */}
            {analysis.factors && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-accent" />
                    Risk Factors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(analysis.factors).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                        <span className="text-xs text-muted-foreground capitalize">{key.replace(/_/g, " ")}</span>
                        <span className="font-mono text-sm font-bold text-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RiskAnalysis;
