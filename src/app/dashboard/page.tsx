"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import StatCard from "@/components/StatCard";
import MapWrapper from "@/components/MapWrapper";
import {
  computeHotspots,
  getHighestRiskArea,
  getMostCommonIssue,
  getReportsByType,
  getSeverityBreakdown,
  getWeeklyTrend,
} from "@/lib/analytics";
import { fetchReports } from "@/lib/types";
import type { IncidentReport } from "@/lib/types";

const SEVERITY_COLORS = {
  Low: "#60a5fa",
  Medium: "#fbbf24",
  High: "#ef4444",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    Low: "bg-blue-100 text-blue-700",
    Medium: "bg-amber-100 text-amber-700",
    High: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors[severity] || "bg-slate-100 text-slate-700"}`}
    >
      {severity}
    </span>
  );
}

export default function DashboardPage() {
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports()
      .then(setReports)
      .finally(() => setLoading(false));
  }, []);

  const reportsByType = getReportsByType(reports);
  const severityData = getSeverityBreakdown(reports);
  const hotspots = computeHotspots(reports);

  const dailyTrend = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toLocaleDateString("en-CA", { weekday: "short" });
    const count = reports.filter((r) => {
      const rd = new Date(r.createdAt);
      return rd.toDateString() === d.toDateString();
    }).length;
    return { day: dayStr, reports: count };
  });

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent" />
          <p className="mt-4 text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            GTA Live Data
          </p>
          <h1 className="text-3xl font-bold text-navy">Safety Dashboard</h1>
          <p className="mt-2 text-slate-500">
            {reports.length} community reports across{" "}
            {new Set(reports.map((r) => r.borough)).size} GTA areas
          </p>
        </div>
        <Link href="/map" className="btn-primary">
          View Full Map
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Reports" value={reports.length} icon="📊" />
        <StatCard
          label="Most Common Issue"
          value={getMostCommonIssue(reports)}
          icon="⚠️"
        />
        <StatCard
          label="Highest Risk Area"
          value={getHighestRiskArea(reports).slice(0, 30)}
          icon="📍"
        />
        <StatCard
          label="Weekly Trend"
          value={getWeeklyTrend(reports)}
          icon="📈"
          trend="vs. last week"
        />
      </div>

      {/* Mini map */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-navy">
          Incident Heatmap — GTA
        </h2>
        <MapWrapper reports={reports} interactive={false} height="350px" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <h2 className="mb-6 text-lg font-semibold text-navy">
            Reports by Incident Type
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={reportsByType} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis
                dataKey="type"
                type="category"
                width={140}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="mb-6 text-lg font-semibold text-navy">
            Severity Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={severityData}
                dataKey="count"
                nameKey="severity"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                label={({ severity, count }) =>
                  count > 0 ? `${severity}: ${count}` : ""
                }
              >
                {severityData.map((entry) => (
                  <Cell
                    key={entry.severity}
                    fill={
                      SEVERITY_COLORS[
                        entry.severity as keyof typeof SEVERITY_COLORS
                      ]
                    }
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 7-day trend */}
      <div className="mt-8 card">
        <h2 className="mb-6 text-lg font-semibold text-navy">
          7-Day Report Trend
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={dailyTrend}>
            <defs>
              <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
              }}
            />
            <Area
              type="monotone"
              dataKey="reports"
              stroke="#3b82f6"
              fill="url(#colorReports)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Hotspots */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-navy">
          Dangerous Hotspots — GTA
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {hotspots.map((spot) => (
            <div key={spot.name} className="card flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <p className="font-semibold text-navy text-sm leading-snug">
                  {spot.name}
                </p>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    spot.riskLevel === "High"
                      ? "bg-red-100 text-red-700"
                      : spot.riskLevel === "Medium"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {spot.riskLevel}
                </span>
              </div>
              <p className="text-xs text-slate-400">{spot.borough}</p>
              <p className="text-sm text-slate-500">
                {spot.reportCount} report{spot.reportCount !== 1 ? "s" : ""}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent reports */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-navy">Recent Reports</h2>
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-6 py-3 font-semibold text-slate-600">
                    Type
                  </th>
                  <th className="px-6 py-3 font-semibold text-slate-600">
                    Location
                  </th>
                  <th className="px-6 py-3 font-semibold text-slate-600">
                    Borough
                  </th>
                  <th className="px-6 py-3 font-semibold text-slate-600">
                    Severity
                  </th>
                  <th className="px-6 py-3 font-semibold text-slate-600">
                    Source
                  </th>
                  <th className="px-6 py-3 font-semibold text-slate-600">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {reports.slice(0, 12).map((report) => (
                  <tr
                    key={report.id}
                    className="border-b border-slate-50 transition hover:bg-slate-50/50"
                  >
                    <td className="px-6 py-4 font-medium text-navy">
                      {report.incidentType}
                    </td>
                    <td className="max-w-[200px] truncate px-6 py-4 text-slate-600">
                      {report.location}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {report.borough}
                    </td>
                    <td className="px-6 py-4">
                      <SeverityBadge severity={report.severity} />
                    </td>
                    <td className="px-6 py-4">
                      {report.source === "community" ? (
                        <span className="text-xs font-medium text-accent">
                          Community · {report.upvotes}↑
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">You</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {formatDate(report.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
