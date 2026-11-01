import type { SerializedReport } from "./db";

export type IncidentType =
  | "Distracted Driving"
  | "Speeding"
  | "Dangerous Lane Change"
  | "Road Rage"
  | "Illegal Parking"
  | "Dangerous Intersection"
  | "Road Hazard"
  | "Near Miss"
  | "Other";

export type Severity = "Low" | "Medium" | "High";

export type VehicleType = "Sedan" | "SUV" | "Truck" | "Motorcycle" | "Other";

export type IncidentReport = SerializedReport;

export const INCIDENT_TYPES: IncidentType[] = [
  "Distracted Driving",
  "Speeding",
  "Dangerous Lane Change",
  "Road Rage",
  "Illegal Parking",
  "Dangerous Intersection",
  "Road Hazard",
  "Near Miss",
  "Other",
];

export const SEVERITY_LEVELS: Severity[] = ["Low", "Medium", "High"];

export const VEHICLE_TYPES: VehicleType[] = [
  "Sedan",
  "SUV",
  "Truck",
  "Motorcycle",
  "Other",
];

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  category: "pattern" | "infrastructure" | "community" | "transit";
  priority: "High" | "Medium" | "Low";
  trend?: "up" | "down" | "neutral";
}

export interface AIAction {
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  targetArea?: string;
}

export interface AIInsightsResponse {
  insights: AIInsight[];
  actions: AIAction[];
  summary: string;
  poweredBy: "openai" | "groq" | "local";
}

export async function fetchReports(): Promise<IncidentReport[]> {
  const res = await fetch("/api/reports");
  if (!res.ok) throw new Error("Failed to fetch reports");
  return res.json();
}

export async function submitReport(
  data: Omit<
    IncidentReport,
    "id" | "createdAt" | "source" | "upvotes" | "reporterName"
  > & {
    reporterName?: string;
  }
): Promise<IncidentReport> {
  const res = await fetch("/api/reports", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to submit report");
  }
  return res.json();
}

export async function fetchStats() {
  const res = await fetch("/api/stats");
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export async function fetchAIInsights(): Promise<AIInsightsResponse> {
  const res = await fetch("/api/insights");
  if (!res.ok) throw new Error("Failed to fetch insights");
  return res.json();
}
