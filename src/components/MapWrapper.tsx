import dynamic from "next/dynamic";
import type { IncidentReport } from "@/lib/types";

const IncidentMap = dynamic(() => import("./IncidentMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-100">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        <p className="mt-3 text-sm text-slate-500">Loading GTA map...</p>
      </div>
    </div>
  ),
});

interface MapWrapperProps {
  reports?: IncidentReport[];
  selectedLat?: number;
  selectedLng?: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  interactive?: boolean;
  height?: string;
}

export default function MapWrapper(props: MapWrapperProps) {
  return <IncidentMap {...props} />;
}
