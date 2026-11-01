"use client";

import { useEffect, useState } from "react";
import MapWrapper from "@/components/MapWrapper";
import { fetchReports } from "@/lib/types";
import type { IncidentReport } from "@/lib/types";
import { INCIDENT_TYPES, SEVERITY_LEVELS } from "@/lib/types";

export default function MapPage() {
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedReport, setSelectedReport] = useState<IncidentReport | null>(
    null
  );

  useEffect(() => {
    fetchReports()
      .then(setReports)
      .finally(() => setLoading(false));
  }, []);

  const filtered = reports.filter((r) => {
    if (filterSeverity !== "all" && r.severity !== filterSeverity) return false;
    if (filterType !== "all" && r.incidentType !== filterType) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            📍 Greater Toronto Area
          </p>
          <h1 className="text-3xl font-bold text-navy">Incident Map</h1>
          <p className="mt-2 text-slate-500">
            Live community reports plotted across the GTA. Click markers for
            details.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="input-field w-auto"
          >
            <option value="all">All Severity</option>
            {SEVERITY_LEVELS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="input-field w-auto"
          >
            <option value="all">All Types</option>
            {INCIDENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-4 text-xs text-slate-600">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-500" /> High
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-amber-400" /> Medium
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-blue-400" /> Low
        </span>
        <span className="ml-auto text-slate-400">
          {filtered.length} incidents shown
        </span>
      </div>

      {loading ? (
        <div className="flex h-[600px] items-center justify-center rounded-2xl bg-slate-100">
          <p className="text-slate-500">Loading map data...</p>
        </div>
      ) : (
        <MapWrapper reports={filtered} height="600px" />
      )}

      {/* Report list below map */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-navy">
          Incidents on Map
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.slice(0, 9).map((report) => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report)}
              className={`card text-left transition hover:shadow-md ${
                selectedReport?.id === report.id ? "ring-2 ring-accent" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-navy">{report.incidentType}</p>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    report.severity === "High"
                      ? "bg-red-100 text-red-700"
                      : report.severity === "Medium"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {report.severity}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">{report.location}</p>
              <p className="mt-2 text-xs text-slate-400 line-clamp-2">
                {report.description}
              </p>
              {report.source === "community" && (
                <p className="mt-2 text-xs font-medium text-accent">
                  Community report · {report.upvotes} upvotes
                </p>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
