"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MapWrapper from "@/components/MapWrapper";
import {
  INCIDENT_TYPES,
  SEVERITY_LEVELS,
  VEHICLE_TYPES,
  submitReport,
} from "@/lib/types";
import { GTA_BOROUGHS, GTA_CENTER, GTA_LOCATIONS, isWithinGTA } from "@/lib/gta";

export default function ReportPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [lat, setLat] = useState(GTA_CENTER.lat);
  const [lng, setLng] = useState(GTA_CENTER.lng);
  const [form, setForm] = useState({
    incidentType: INCIDENT_TYPES[0],
    severity: SEVERITY_LEVELS[1],
    vehicleType: VEHICLE_TYPES[0],
    carColor: "",
    licensePlate: "",
    location: "",
    borough: "Toronto" as string,
    dateTime: "",
    description: "",
    anonymous: true,
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleLocationPreset(name: string) {
    const loc = GTA_LOCATIONS.find((l) => l.name === name);
    if (loc) {
      setForm((prev) => ({
        ...prev,
        location: loc.name,
        borough: loc.borough,
      }));
      setLat(loc.lat);
      setLng(loc.lng);
    }
  }

  function handleMapClick(newLat: number, newLng: number) {
    if (!isWithinGTA(newLat, newLng)) {
      setError("Please pin a location within the Greater Toronto Area");
      return;
    }
    setError("");
    setLat(newLat);
    setLng(newLng);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await submitReport({
        incidentType: form.incidentType as typeof form.incidentType,
        severity: form.severity as typeof form.severity,
        vehicleType: form.vehicleType as typeof form.vehicleType,
        carColor: form.carColor,
        licensePlate: form.licensePlate || undefined,
        location: form.location,
        borough: form.borough,
        latitude: lat,
        longitude: lng,
        dateTime: form.dateTime,
        description: form.description,
        anonymous: form.anonymous,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="card text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
            ✓
          </div>
          <h1 className="mt-6 text-2xl font-bold text-navy">
            Report Submitted Successfully
          </h1>
          <p className="mt-3 text-slate-500">
            Your report is now live on the GTA incident map and dashboard.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button onClick={() => router.push("/map")} className="btn-primary">
              View on Map
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="btn-outline"
            >
              View Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="mb-2 inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
          📍 Greater Toronto Area Only
        </p>
        <h1 className="text-3xl font-bold text-navy">Report an Incident</h1>
        <p className="mt-2 text-slate-500">
          Pin the exact location on the map. Your report helps build community
          safety intelligence across the GTA.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Map picker */}
        <div className="card p-4">
          <label className="label">Pin Incident Location on Map</label>
          <p className="mb-3 text-xs text-slate-400">
            Click the map to set the exact location, or choose a preset below.
          </p>
          <MapWrapper
            selectedLat={lat}
            selectedLng={lng}
            onLocationSelect={handleMapClick}
            height="320px"
          />
          <p className="mt-2 text-xs text-slate-500">
            📌 {lat.toFixed(4)}, {lng.toFixed(4)}
          </p>
        </div>

        <div className="card space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="preset" className="label">
                Quick Location Preset
              </label>
              <select
                id="preset"
                onChange={(e) => handleLocationPreset(e.target.value)}
                className="input-field"
                defaultValue=""
              >
                <option value="" disabled>
                  Select a GTA location...
                </option>
                {GTA_LOCATIONS.map((loc) => (
                  <option key={loc.name} value={loc.name}>
                    {loc.name} ({loc.borough})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="borough" className="label">
                Borough / City
              </label>
              <select
                id="borough"
                name="borough"
                value={form.borough}
                onChange={handleChange}
                className="input-field"
                required
              >
                {GTA_BOROUGHS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="incidentType" className="label">
                Incident Type
              </label>
              <select
                id="incidentType"
                name="incidentType"
                value={form.incidentType}
                onChange={handleChange}
                className="input-field"
                required
              >
                {INCIDENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="severity" className="label">
                Severity
              </label>
              <select
                id="severity"
                name="severity"
                value={form.severity}
                onChange={handleChange}
                className="input-field"
                required
              >
                {SEVERITY_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="location" className="label">
              Location Description
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Lakeshore Blvd E & Carlaw Ave (GO Crossing)"
              className="input-field"
              required
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="vehicleType" className="label">
                Vehicle Type
              </label>
              <select
                id="vehicleType"
                name="vehicleType"
                value={form.vehicleType}
                onChange={handleChange}
                className="input-field"
                required
              >
                {VEHICLE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="carColor" className="label">
                Car Color
              </label>
              <input
                id="carColor"
                name="carColor"
                type="text"
                value={form.carColor}
                onChange={handleChange}
                placeholder="e.g. Red, Silver, Black"
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="licensePlate" className="label">
              License Plate{" "}
              <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="licensePlate"
              name="licensePlate"
              type="text"
              value={form.licensePlate}
              onChange={handleChange}
              placeholder="e.g. ABCX 123"
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="dateTime" className="label">
              Date and Time
            </label>
            <input
              id="dateTime"
              name="dateTime"
              type="datetime-local"
              value={form.dateTime}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe what happened — include details like train times, traffic direction, etc."
              className="input-field resize-none"
              required
            />
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
            <input
              id="anonymous"
              name="anonymous"
              type="checkbox"
              checked={form.anonymous}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent"
            />
            <label htmlFor="anonymous" className="text-sm text-slate-700">
              Submit anonymously — your identity will not be stored
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full sm:w-auto disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </form>
    </div>
  );
}
