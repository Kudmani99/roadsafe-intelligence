import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export function serializeReport(report: {
  id: string;
  incidentType: string;
  severity: string;
  vehicleType: string;
  carColor: string;
  licensePlate: string | null;
  location: string;
  borough: string;
  latitude: number;
  longitude: number;
  dateTime: Date;
  description: string;
  anonymous: boolean;
  reporterName: string | null;
  source: string;
  upvotes: number;
  createdAt: Date;
}) {
  return {
    id: report.id,
    incidentType: report.incidentType,
    severity: report.severity,
    vehicleType: report.vehicleType,
    carColor: report.carColor,
    licensePlate: report.licensePlate ?? undefined,
    location: report.location,
    borough: report.borough,
    latitude: report.latitude,
    longitude: report.longitude,
    dateTime: report.dateTime.toISOString(),
    description: report.description,
    anonymous: report.anonymous,
    reporterName: report.anonymous ? undefined : report.reporterName ?? undefined,
    source: report.source,
    upvotes: report.upvotes,
    createdAt: report.createdAt.toISOString(),
  };
}

export type SerializedReport = ReturnType<typeof serializeReport>;
