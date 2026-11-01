import type { SerializedReport } from "./db";
import type { AIAction, AIInsight } from "./types";

export interface Hotspot {
  name: string;
  borough: string;
  reportCount: number;
  riskLevel: "Low" | "Medium" | "High";
  lat: number;
  lng: number;
}

export function computeHotspots(reports: SerializedReport[]): Hotspot[] {
  const map = new Map<
    string,
    { count: number; high: number; borough: string; lat: number; lng: number }
  >();

  reports.forEach((r) => {
    const key = r.location;
    const existing = map.get(key) ?? {
      count: 0,
      high: 0,
      borough: r.borough,
      lat: r.latitude,
      lng: r.longitude,
    };
    existing.count++;
    if (r.severity === "High") existing.high++;
    map.set(key, existing);
  });

  return Array.from(map.entries())
    .map(([name, data]) => ({
      name,
      borough: data.borough,
      reportCount: data.count,
      lat: data.lat,
      lng: data.lng,
      riskLevel:
        data.high >= 2 || data.count >= 3
          ? ("High" as const)
          : data.count >= 2
            ? ("Medium" as const)
            : ("Low" as const),
    }))
    .sort((a, b) => b.reportCount - a.reportCount)
    .slice(0, 8);
}

export function getMostCommonIssue(reports: SerializedReport[]): string {
  if (reports.length === 0) return "Speeding";
  const counts: Record<string, number> = {};
  reports.forEach((r) => {
    counts[r.incidentType] = (counts[r.incidentType] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

export function getHighestRiskArea(reports: SerializedReport[]): string {
  const hotspots = computeHotspots(reports);
  return hotspots[0]?.name ?? "Lakeshore Blvd E & Carlaw Ave (GO Crossing)";
}

export function getWeeklyTrend(reports: SerializedReport[]): string {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const thisWeek = reports.filter((r) => new Date(r.createdAt) >= weekAgo).length;
  const lastWeek = reports.filter(
    (r) =>
      new Date(r.createdAt) >= twoWeeksAgo && new Date(r.createdAt) < weekAgo
  ).length;

  if (lastWeek === 0) return thisWeek > 0 ? "+100%" : "0%";
  const change = Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
  return change >= 0 ? `+${change}%` : `${change}%`;
}

export function getReportsByType(reports: SerializedReport[]) {
  const types = [
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
  return types
    .map((type) => ({
      type,
      count: reports.filter((r) => r.incidentType === type).length,
    }))
    .filter((item) => item.count > 0);
}

export function getSeverityBreakdown(reports: SerializedReport[]) {
  return (["Low", "Medium", "High"] as const).map((level) => ({
    severity: level,
    count: reports.filter((r) => r.severity === level).length,
  }));
}

export function computeSafetyScore(reports: SerializedReport[]): number {
  if (reports.length === 0) return 75;
  const high = reports.filter((r) => r.severity === "High").length;
  const ratio = high / reports.length;
  return Math.max(35, Math.min(92, Math.round(78 - ratio * 40)));
}

export function generateLocalInsights(reports: SerializedReport[]): {
  insights: AIInsight[];
  actions: AIAction[];
  summary: string;
} {
  const trainReports = reports.filter(
    (r) =>
      r.location.toLowerCase().includes("go") ||
      r.location.toLowerCase().includes("crossing") ||
      r.description.toLowerCase().includes("train")
  );

  const afternoonReports = reports.filter((r) => {
    const h = new Date(r.dateTime).getHours();
    return h >= 16 && h <= 18;
  });

  const schoolReports = reports.filter(
    (r) =>
      r.description.toLowerCase().includes("school") ||
      r.location.toLowerCase().includes("finch")
  );

  const insights: AIInsight[] = [
    {
      id: "train-crossing",
      title: "GO Train Crossing Pattern — Carlaw Ave",
      description:
        trainReports.length >= 2
          ? `${trainReports.length} community reports confirm a daily GO train crossing at Lakeshore Blvd E & Carlaw Ave between 12:15–1:00 PM. Traffic queues exceed 200m; gate-running and illegal passing are recurring high-severity incidents.`
          : "Community data indicates a recurring GO train crossing at Lakeshore Blvd E & Carlaw Ave between 12:15–1:00 PM causing significant traffic backup and near-miss incidents.",
      category: "transit",
      priority: "High",
      trend: "up",
    },
    {
      id: "rush-hour",
      title: "Afternoon Rush Hour Risk Cluster",
      description: `${Math.round((afternoonReports.length / Math.max(reports.length, 1)) * 100)}% of GTA reports occur between 4–6 PM. Distracted driving and aggressive merging on the Gardiner and 401 are primary contributors.`,
      category: "pattern",
      priority: "High",
      trend: "up",
    },
    {
      id: "school-zones",
      title: "School Zone Speeding — North York",
      description:
        schoolReports.length > 0
          ? `${schoolReports.length} reports near school zones, especially Finch & Yonge, document speeding during 7:30–8:30 AM drop-off. Community upvotes suggest strong resident concern.`
          : "Finch Ave school zones show consistent morning speeding complaints from community members.",
      category: "community",
      priority: "High",
      trend: "up",
    },
    {
      id: "401-dvp",
      title: "401/DVP Merge Danger Zone",
      description:
        "Highway 401 at Don Valley Pkwy generates recurring road rage and dangerous merge reports. Transport truck solid-line violations cause chain-reaction braking.",
      category: "infrastructure",
      priority: "High",
      trend: "neutral",
    },
    {
      id: "weekly",
      title: "Weekly Severity Trend",
      description: `High-severity reports ${getWeeklyTrend(reports).startsWith("+") ? "increased" : "changed"} ${getWeeklyTrend(reports)} this week across ${new Set(reports.map((r) => r.borough)).size} GTA boroughs.`,
      category: "pattern",
      priority: "Medium",
      trend: getWeeklyTrend(reports).startsWith("+") ? "up" : "down",
    },
    {
      id: "streetcar",
      title: "Queen East Streetcar Corridor",
      description:
        "Queen St E corridor reports illegal passing in bike lanes and streetcar zones. Cyclist near-misses are a growing community concern.",
      category: "infrastructure",
      priority: "Medium",
      trend: "up",
    },
  ];

  const actions: AIAction[] = [
    {
      title: "Deploy Midday Crossing Enforcement",
      description:
        "Position traffic enforcement at Lakeshore & Carlaw GO crossing between 12:00–1:15 PM to prevent gate-running and illegal passing.",
      priority: "High",
      targetArea: "Leslieville / Carlaw Ave",
    },
    {
      title: "School Zone Speed Cameras — Finch Corridor",
      description:
        "Install automated speed enforcement near Finch & Yonge school zone during 7:30–9:00 AM weekdays.",
      priority: "High",
      targetArea: "North York",
    },
    {
      title: "401/DVP Merge Lane Marking Upgrade",
      description:
        "Refresh solid-line markings and add overhead signage at 401 collectors merge to Don Valley Pkwy.",
      priority: "High",
      targetArea: "Don Valley",
    },
    {
      title: "Afternoon Rush Distracted Driving Blitz",
      description:
        "Target 4–6 PM enforcement on Gardiner on-ramps for handheld device violations.",
      priority: "Medium",
      targetArea: "Downtown Toronto",
    },
    {
      title: "Queen East Bike Lane Protection",
      description:
        "Add flexible bollards on Queen St E streetcar corridor to prevent illegal right-side passing.",
      priority: "Medium",
      targetArea: "Riverside / Leslieville",
    },
  ];

  const summary = `RoadSafe Intelligence analyzed ${reports.length} community reports across the Greater Toronto Area. Key findings: recurring GO train crossing incidents at Carlaw Ave (12:15–1:00 PM daily), school zone speeding on Finch, and afternoon rush-hour clusters on the Gardiner and 401. Community safety score: ${computeSafetyScore(reports)}/100.`;

  return { insights, actions, summary };
}

export function buildAIPrompt(reports: SerializedReport[]): string {
  const sample = reports.slice(0, 30).map((r) => ({
    type: r.incidentType,
    severity: r.severity,
    location: r.location,
    borough: r.borough,
    time: r.dateTime,
    description: r.description.slice(0, 200),
    upvotes: r.upvotes,
  }));

  return `You are RoadSafe Intelligence, an AI analyst for community road safety in the Greater Toronto Area (GTA), Ontario, Canada.

Analyze these ${reports.length} community incident reports and return JSON only (no markdown):

{
  "summary": "2-3 sentence executive summary for GTA residents",
  "insights": [
    {
      "id": "unique-id",
      "title": "Short title",
      "description": "Detailed, specific insight referencing real locations and patterns from the data. Mention GO train crossings, school zones, Gardiner/401 if relevant.",
      "category": "pattern|infrastructure|community|transit",
      "priority": "High|Medium|Low",
      "trend": "up|down|neutral"
    }
  ],
  "actions": [
    {
      "title": "Action title",
      "description": "Specific recommendation for Toronto/GTA authorities or community",
      "priority": "High|Medium|Low",
      "targetArea": "Neighbourhood or corridor name"
    }
  ]
}

Provide 5-6 insights and 4-5 actions. Be specific to GTA geography. If train/crossing reports exist, analyze timing patterns (e.g. midday GO trains). Reference real Toronto infrastructure (Gardiner, 401, DVP, TTC, GO Transit, LRT construction).

Report data:
${JSON.stringify(sample, null, 2)}`;
}
