"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAIInsights } from "@/lib/types";
import type { AIAction, AIInsight, AIInsightsResponse } from "@/lib/types";

const categoryIcons: Record<string, string> = {
  pattern: "📊",
  infrastructure: "🚧",
  community: "👥",
  transit: "🚆",
};

const poweredByLabels = {
  openai: "OpenAI GPT-4o-mini",
  groq: "Groq Llama 3.3 (Free)",
  local: "Local Intelligence Engine",
};

export default function InsightsPage() {
  const [data, setData] = useState<AIInsightsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAIInsights()
      .then(setData)
      .catch(() => setError("Failed to load insights"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-accent/20 border-t-accent" />
          <span className="absolute inset-0 flex items-center justify-center text-2xl">
            🧠
          </span>
        </div>
        <p className="text-slate-500">Analyzing GTA community data...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-red-600">{error || "Something went wrong"}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <p className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            AI-Powered Analysis
          </p>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
            {poweredByLabels[data.poweredBy]}
          </span>
        </div>
        <h1 className="mt-3 text-3xl font-bold text-navy">GTA Safety Insights</h1>
        <p className="mt-2 text-slate-500">
          Deep analysis of community reports across the Greater Toronto Area.
        </p>
      </div>

      {/* Executive summary */}
      <div className="card mb-8 bg-gradient-to-br from-navy to-navy-light text-white">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-3xl backdrop-blur">
            🧠
          </div>
          <div>
            <h2 className="text-lg font-bold">Executive Summary</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {data.summary}
            </p>
            {data.poweredBy === "local" && (
              <p className="mt-3 text-xs text-accent-light">
                💡 Add OPENAI_API_KEY or GROQ_API_KEY to .env for live AI
                analysis
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Insights grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {data.insights.map((insight: AIInsight) => (
          <div
            key={insight.id}
            className="card group relative overflow-hidden transition hover:shadow-lg"
          >
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-accent/5 transition group-hover:bg-accent/10" />
            <div className="relative">
              <div className="flex items-start justify-between gap-3">
                <span className="text-2xl">
                  {categoryIcons[insight.category] || "💡"}
                </span>
                <div className="flex gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      insight.priority === "High"
                        ? "bg-red-100 text-red-700"
                        : insight.priority === "Medium"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {insight.priority}
                  </span>
                  {insight.trend && (
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        insight.trend === "up"
                          ? "bg-red-50 text-red-600"
                          : insight.trend === "down"
                            ? "bg-green-50 text-green-600"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {insight.trend === "up"
                        ? "↑ Rising"
                        : insight.trend === "down"
                          ? "↓ Improving"
                          : "→ Stable"}
                    </span>
                  )}
                </div>
              </div>
              <h2 className="mt-4 text-lg font-semibold text-navy">
                {insight.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                {insight.description}
              </p>
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-400">
                {insight.category}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recommended actions */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-navy">
          Recommended Safety Actions
        </h2>
        <p className="mt-2 text-slate-500">
          Targeted recommendations for GTA authorities and community leaders.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {data.actions.map((action: AIAction, i: number) => (
            <div
              key={action.title}
              className="card flex gap-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy text-sm font-bold text-white">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-navy">{action.title}</h3>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      action.priority === "High"
                        ? "bg-red-100 text-red-700"
                        : action.priority === "Medium"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {action.priority}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {action.description}
                </p>
                {action.targetArea && (
                  <p className="mt-2 text-xs font-medium text-accent">
                    📍 {action.targetArea}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link href="/map" className="btn-primary inline-flex">
          Explore Incident Map
        </Link>
      </div>
    </div>
  );
}
