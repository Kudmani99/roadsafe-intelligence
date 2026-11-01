"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import MapWrapper from "@/components/MapWrapper";
import { fetchReports, fetchStats } from "@/lib/types";
import type { IncidentReport } from "@/lib/types";

const steps = [
  {
    step: "01",
    title: "Report an Issue",
    description:
      "Pin the exact location on our GTA map and describe dangerous driving or road hazards in your neighbourhood.",
    icon: "📍",
  },
  {
    step: "02",
    title: "Community Data Grows",
    description:
      "Reports from real GTA residents build a living picture of traffic patterns, train crossings, and school zone risks.",
    icon: "👥",
  },
  {
    step: "03",
    title: "AI Safety Insights",
    description:
      "Smart analysis detects patterns — like midday GO train crossings or rush-hour Gardiner incidents — and recommends actions.",
    icon: "🧠",
  },
];

export default function HomePage() {
  const [stats, setStats] = useState({
    totalReports: 0,
    hotspots: 0,
    safetyScore: 72,
    weeklyTrend: "+0%",
    boroughs: 0,
  });
  const [reports, setReports] = useState<IncidentReport[]>([]);

  useEffect(() => {
    fetchStats().then(setStats).catch(() => {});
    fetchReports()
      .then(setReports)
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/25 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-accent-light backdrop-blur">
                  Greater Toronto Area
                </span>
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-400 backdrop-blur">
                  Community Safety Intelligence
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                RoadSafe
                <span className="text-accent-light"> Intelligence</span>
              </h1>
              <p className="mt-4 text-lg text-slate-300 sm:text-xl">
                Smarter road safety through community intelligence.
              </p>
              <p className="mt-4 max-w-xl text-base text-slate-400">
                Report dangerous driving and road hazards across the GTA. See
                incidents on a live map. Get AI-powered safety insights built
                from real community data.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/report" className="btn-primary">
                  Report Incident
                </Link>
                <Link href="/map" className="btn-secondary">
                  View GTA Map
                </Link>
                <Link href="/dashboard" className="btn-outline !border-white/20 !bg-transparent !text-white hover:!bg-white/10">
                  Dashboard
                </Link>
              </div>
            </div>

            {/* Hero visual stats */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              <div className="glass-card rounded-2xl p-6">
                <p className="text-3xl font-bold text-white">
                  {stats.totalReports || "—"}
                </p>
                <p className="mt-1 text-sm text-slate-400">GTA Reports</p>
              </div>
              <div className="glass-card rounded-2xl p-6">
                <p className="text-3xl font-bold text-accent-light">
                  {stats.safetyScore}/100
                </p>
                <p className="mt-1 text-sm text-slate-400">Safety Score</p>
              </div>
              <div className="glass-card rounded-2xl p-6">
                <p className="text-3xl font-bold text-white">
                  {stats.boroughs || "—"}
                </p>
                <p className="mt-1 text-sm text-slate-400">Areas Covered</p>
              </div>
              <div className="glass-card rounded-2xl p-6">
                <p className="text-3xl font-bold text-white">
                  {stats.weeklyTrend}
                </p>
                <p className="mt-1 text-sm text-slate-400">Weekly Trend</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live map preview */}
      {reports.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-navy">Live GTA Incident Map</h2>
              <p className="mt-1 text-slate-500">
                Community reports plotted across Toronto, Mississauga, Brampton &amp; more
              </p>
            </div>
            <Link href="/map" className="btn-outline hidden sm:inline-flex">
              Full Map →
            </Link>
          </div>
          <MapWrapper
            reports={reports.slice(0, 30)}
            interactive={false}
            height="400px"
          />
        </section>
      )}

      {/* Stats */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-3">
            <StatCard
              label="Incidents Reported"
              value={stats.totalReports || "—"}
              icon="📋"
              trend={`${stats.weeklyTrend} this week`}
            />
            <StatCard
              label="Dangerous Hotspots"
              value={stats.hotspots || "—"}
              icon="📍"
              trend="Across the GTA"
            />
            <StatCard
              label="Community Safety Score"
              value={`${stats.safetyScore}/100`}
              icon="🛡️"
              trend="Live calculation"
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-navy">How It Works</h2>
            <p className="mt-3 text-slate-500">
              Community-powered road safety for the Greater Toronto Area
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((item) => (
              <div
                key={item.step}
                className="card group text-center transition hover:shadow-lg"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-2xl transition group-hover:scale-110">
                  {item.icon}
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-widest text-accent">
                  Step {item.step}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-navy">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="bg-navy py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: "🗺️",
                title: "GTA Incident Map",
                desc: "Every report pinned to its exact location. Filter by severity and type.",
                href: "/map",
              },
              {
                icon: "📊",
                title: "Live Dashboard",
                desc: "Charts, hotspots, and trends computed from real community data.",
                href: "/dashboard",
              },
              {
                icon: "🧠",
                title: "AI Insights",
                desc: "Detects train crossing patterns, school zone risks, and rush-hour clusters.",
                href: "/insights",
              },
            ].map((f) => (
              <Link
                key={f.href}
                href={f.href}
                className="glass-card group rounded-2xl p-6 transition hover:bg-white/10"
              >
                <span className="text-3xl">{f.icon}</span>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-slate-400">{f.desc}</p>
                <span className="mt-4 inline-block text-sm font-medium text-accent-light group-hover:underline">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="card flex flex-col items-center bg-gradient-to-br from-navy to-navy-light px-8 py-12 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Make the GTA safer — one report at a time
          </h2>
          <p className="mt-3 max-w-lg text-slate-300">
            From GO train crossings on Lakeshore to school zone speeding on
            Finch — your reports power the intelligence that keeps communities
            safe.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/report" className="btn-primary">
              Submit a Report
            </Link>
            <Link href="/insights" className="btn-secondary">
              View AI Insights
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
