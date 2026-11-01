import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  computeHotspots,
  computeSafetyScore,
  getWeeklyTrend,
} from "@/lib/analytics";

export async function GET() {
  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
  });

  const hotspots = computeHotspots(
    reports.map((r) => ({
      ...r,
      licensePlate: r.licensePlate ?? undefined,
      dateTime: r.dateTime.toISOString(),
      createdAt: r.createdAt.toISOString(),
      reporterName: r.reporterName ?? undefined,
    }))
  );

  const boroughs = new Set(reports.map((r) => r.borough));

  return NextResponse.json({
    totalReports: reports.length,
    communityReports: reports.filter((r) => r.source === "community").length,
    userReports: reports.filter((r) => r.source === "user").length,
    hotspots: hotspots.length,
    safetyScore: computeSafetyScore(
      reports.map((r) => ({
        ...r,
        licensePlate: r.licensePlate ?? undefined,
        dateTime: r.dateTime.toISOString(),
        createdAt: r.createdAt.toISOString(),
        reporterName: r.reporterName ?? undefined,
      }))
    ),
    weeklyTrend: getWeeklyTrend(
      reports.map((r) => ({
        ...r,
        licensePlate: r.licensePlate ?? undefined,
        dateTime: r.dateTime.toISOString(),
        createdAt: r.createdAt.toISOString(),
        reporterName: r.reporterName ?? undefined,
      }))
    ),
    boroughs: boroughs.size,
    topHotspot: hotspots[0]?.name ?? "Lakeshore & Carlaw",
  });
}
