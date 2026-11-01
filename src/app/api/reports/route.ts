import { NextResponse } from "next/server";
import { prisma, serializeReport } from "@/lib/db";
import { isWithinGTA } from "@/lib/gta";

export async function GET() {
  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(reports.map(serializeReport));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const lat = Number(body.latitude);
    const lng = Number(body.longitude);

    if (!isWithinGTA(lat, lng)) {
      return NextResponse.json(
        { error: "Location must be within the Greater Toronto Area" },
        { status: 400 }
      );
    }

    const report = await prisma.report.create({
      data: {
        incidentType: body.incidentType,
        severity: body.severity,
        vehicleType: body.vehicleType,
        carColor: body.carColor,
        licensePlate: body.licensePlate || null,
        location: body.location,
        borough: body.borough || "Toronto",
        latitude: lat,
        longitude: lng,
        dateTime: new Date(body.dateTime),
        description: body.description,
        anonymous: body.anonymous ?? true,
        reporterName: body.anonymous ? null : body.reporterName || null,
        source: "user",
      },
    });

    return NextResponse.json(serializeReport(report), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid report data" }, { status: 400 });
  }
}
