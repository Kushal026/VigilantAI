import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  variant?: "default" | "warning" | "danger" | "success";
}

const variantStyles = {
  default: "border-border/50 hover:border-primary/30",
  warning: "border-warning/20 hover:border-warning/40",
  danger: "border-destructive/20 hover:border-destructive/40",
  success: "border-success/20 hover:border-success/40",
};

const iconVariantStyles = {
  default: "bg-primary/10 text-primary",
  warning: "bg-warning/10 text-warning",
  danger: "bg-destructive/10 text-destructive",
  success: "bg-success/10 text-success",
};

export function StatCard({ title, value, icon: Icon, trend, variant = "default" }: StatCardProps) {
  return (
    <Card className={`glass-card-hover ${variantStyles[variant]}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${iconVariantStyles[variant]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground font-mono">{value.toLocaleString()}</div>
        {trend && (
          <p className={`text-xs mt-1 ${trend.value >= 0 ? "text-success" : "text-destructive"}`}>
            {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}% {trend.label}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
