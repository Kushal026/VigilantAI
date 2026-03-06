import { Tables } from "@/integrations/supabase/types";

// Synthetic data generation for demo purposes
const firstNames = ["John", "Alice", "Bob", "Emma", "David", "Sarah", "Mike", "Lisa", "Tom", "Jane"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Wilson", "Moore"];
const cities = ["New York", "London", "Tokyo", "Berlin", "Sydney", "Mumbai", "São Paulo", "Toronto", "Paris", "Seoul"];
const countries = ["US", "UK", "JP", "DE", "AU", "IN", "BR", "CA", "FR", "KR"];
const browsers = ["Chrome 120", "Firefox 121", "Safari 17", "Edge 120", "Opera 105"];
const oses = ["Windows 11", "macOS 14", "Ubuntu 22.04", "iOS 17", "Android 14"];
const devices = ["Desktop", "Laptop", "Mobile", "Tablet"];
const anomalyTypes = ["brute_force", "unusual_location", "unusual_time", "new_device", "impossible_travel", "credential_stuffing"];
const alertTypes = ["login_anomaly", "brute_force_detected", "unusual_location", "impossible_travel", "credential_stuffing", "insider_threat"];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomIp(): string {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function randomDate(daysBack: number): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  date.setHours(Math.floor(Math.random() * 24));
  date.setMinutes(Math.floor(Math.random() * 60));
  return date.toISOString();
}

export function generateLoginLogs(count: number, userId?: string): Partial<Tables<"login_logs">>[] {
  return Array.from({ length: count }, () => {
    const cityIdx = Math.floor(Math.random() * cities.length);
    const success = Math.random() > 0.2;
    return {
      user_id: userId || undefined,
      email: `${randomFrom(firstNames).toLowerCase()}@example.com`,
      ip_address: randomIp(),
      device_info: randomFrom(devices),
      browser: randomFrom(browsers),
      os: randomFrom(oses),
      location: `${cities[cityIdx]}, ${countries[cityIdx]}`,
      country: countries[cityIdx],
      city: cities[cityIdx],
      latitude: (Math.random() * 180) - 90,
      longitude: (Math.random() * 360) - 180,
      success,
      failure_reason: success ? null : randomFrom(["invalid_password", "account_locked", "mfa_failed", "expired_session"]),
      login_at: randomDate(30),
    };
  });
}

export function generateAlerts(count: number): Partial<Tables<"alerts">>[] {
  return Array.from({ length: count }, () => {
    const severity = randomFrom(["low", "medium", "high", "critical"] as const);
    const riskScore = severity === "critical" ? 80 + Math.floor(Math.random() * 20)
      : severity === "high" ? 60 + Math.floor(Math.random() * 20)
      : severity === "medium" ? 40 + Math.floor(Math.random() * 20)
      : 10 + Math.floor(Math.random() * 30);
    return {
      alert_type: randomFrom(alertTypes),
      anomaly_type: randomFrom(anomalyTypes),
      severity,
      risk_score: riskScore,
      ip_address: randomIp(),
      description: `${randomFrom(alertTypes).replace(/_/g, " ")} detected from ${randomFrom(cities)}`,
      status: randomFrom(["open", "investigating", "resolved", "dismissed"] as const),
      created_at: randomDate(14),
    };
  });
}

export function generateRiskScores(count: number, userId: string): Partial<Tables<"risk_scores">>[] {
  return Array.from({ length: count }, (_, i) => {
    const score = Math.floor(Math.random() * 100);
    const label = score > 70 ? "high_risk" : score > 40 ? "suspicious" : "normal";
    return {
      user_id: userId,
      score,
      anomaly_label: label,
      explanation: `Risk assessment based on ${Math.floor(Math.random() * 50) + 5} login events. ${
        score > 70 ? "Multiple anomalies detected." : score > 40 ? "Some unusual patterns observed." : "Normal behavior."
      }`,
      factors: {
        failed_logins: Math.floor(Math.random() * 20),
        unusual_locations: Math.floor(Math.random() * 5),
        off_hours_logins: Math.floor(Math.random() * 10),
        new_devices: Math.floor(Math.random() * 3),
      },
      created_at: randomDate(30),
    };
  });
}

// Mock stat data for dashboard
export function getDashboardStats() {
  return {
    totalUsers: Math.floor(Math.random() * 500) + 1200,
    activeSessions: Math.floor(Math.random() * 100) + 200,
    suspiciousLogins: Math.floor(Math.random() * 30) + 10,
    threatAlerts: Math.floor(Math.random() * 15) + 5,
  };
}

// Generate chart data
export function getLoginChartData(days: number = 7) {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      successful: Math.floor(Math.random() * 200) + 100,
      failed: Math.floor(Math.random() * 40) + 5,
      suspicious: Math.floor(Math.random() * 15) + 2,
    };
  });
}

export function getRiskDistribution() {
  return [
    { name: "Normal", value: Math.floor(Math.random() * 300) + 500, fill: "hsl(var(--success))" },
    { name: "Suspicious", value: Math.floor(Math.random() * 100) + 50, fill: "hsl(var(--warning))" },
    { name: "High Risk", value: Math.floor(Math.random() * 30) + 10, fill: "hsl(var(--destructive))" },
  ];
}

export function getHeatmapData() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  return days.flatMap((day) =>
    hours.map((hour) => ({
      day,
      hour: `${hour}:00`,
      value: Math.floor(Math.random() * 100),
    }))
  );
}
