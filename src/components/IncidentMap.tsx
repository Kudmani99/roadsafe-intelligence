"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { GTA_BOUNDS, GTA_CENTER } from "@/lib/gta";
import type { IncidentReport } from "@/lib/types";

const severityColors: Record<string, string> = {
  Low: "#60a5fa",
  Medium: "#fbbf24",
  High: "#ef4444",
};

function createIcon(severity: string) {
  const color = severityColors[severity] || "#3b82f6";
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: 28px; height: 28px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.35);
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

function MapClickHandler({
  onLocationSelect,
}: {
  onLocationSelect?: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onLocationSelect?.(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface IncidentMapProps {
  reports?: IncidentReport[];
  selectedLat?: number;
  selectedLng?: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  interactive?: boolean;
  height?: string;
  showGtaBoundary?: boolean;
}

export default function IncidentMap({
  reports = [],
  selectedLat,
  selectedLng,
  onLocationSelect,
  interactive = true,
  height = "500px",
  showGtaBoundary = false,
}: IncidentMapProps) {
  useEffect(() => {
    delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
      ._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  const gtaBounds = L.latLngBounds(
    [GTA_BOUNDS.south, GTA_BOUNDS.west],
    [GTA_BOUNDS.north, GTA_BOUNDS.east]
  );

  return (
    <div
      className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm"
      style={{ height }}
    >
      <MapContainer
        center={[GTA_CENTER.lat, GTA_CENTER.lng]}
        zoom={11}
        minZoom={10}
        maxZoom={16}
        maxBounds={gtaBounds}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={interactive}
        dragging={interactive}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {showGtaBoundary && (
          <CircleMarker
            center={[GTA_CENTER.lat, GTA_CENTER.lng]}
            radius={0}
            pathOptions={{ opacity: 0 }}
          />
        )}

        {onLocationSelect && (
          <MapClickHandler onLocationSelect={onLocationSelect} />
        )}

        {selectedLat && selectedLng && (
          <Marker
            position={[selectedLat, selectedLng]}
            icon={L.divIcon({
              className: "selected-pin",
              html: `<div style="
                width: 20px; height: 20px;
                background: #2563eb;
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 0 0 4px rgba(37,99,235,0.3), 0 2px 8px rgba(0,0,0,0.3);
              "></div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })}
          />
        )}

        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.latitude, report.longitude]}
            icon={createIcon(report.severity)}
          >
            <Popup>
              <div className="min-w-[200px] p-1">
                <p className="font-semibold text-navy">{report.incidentType}</p>
                <p className="mt-1 text-xs text-slate-500">{report.location}</p>
                <p className="mt-1 text-xs">
                  <span
                    className="inline-block rounded-full px-2 py-0.5 text-white"
                    style={{
                      background: severityColors[report.severity],
                    }}
                  >
                    {report.severity}
                  </span>
                </p>
                <p className="mt-2 text-xs text-slate-600 line-clamp-3">
                  {report.description}
                </p>
                {report.source === "community" && (
                  <p className="mt-2 text-xs text-accent">
                    👥 Community · {report.upvotes} upvotes
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
