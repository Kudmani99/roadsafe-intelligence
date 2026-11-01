/** Greater Toronto Area geographic bounds */
export const GTA_BOUNDS = {
  north: 43.85,
  south: 43.58,
  west: -79.65,
  east: -79.12,
};

export const GTA_CENTER = { lat: 43.7184, lng: -79.3832 };

export const GTA_BOROUGHS = [
  "Toronto",
  "Scarborough",
  "North York",
  "Etobicoke",
  "Mississauga",
  "Brampton",
  "Markham",
  "Vaughan",
  "Richmond Hill",
  "Oakville",
] as const;

export type GTABorough = (typeof GTA_BOROUGHS)[number];

export function isWithinGTA(lat: number, lng: number): boolean {
  return (
    lat >= GTA_BOUNDS.south &&
    lat <= GTA_BOUNDS.north &&
    lng >= GTA_BOUNDS.west &&
    lng <= GTA_BOUNDS.east
  );
}

export interface GTALocation {
  name: string;
  borough: GTABorough;
  lat: number;
  lng: number;
}

/** Real GTA intersections & landmarks used for seed data and location presets */
export const GTA_LOCATIONS: GTALocation[] = [
  { name: "Yonge St & Bloor St", borough: "Toronto", lat: 43.6709, lng: -79.3865 },
  { name: "Queen St W & Spadina Ave", borough: "Toronto", lat: 43.6487, lng: -79.3965 },
  { name: "Finch Ave E & Yonge St", borough: "North York", lat: 43.7805, lng: -79.4156 },
  { name: "Kennedy Rd & Eglinton Ave E", borough: "Scarborough", lat: 43.7275, lng: -79.2629 },
  { name: "Highway 401 & Don Valley Pkwy", borough: "Toronto", lat: 43.7253, lng: -79.3321 },
  { name: "Dundas St W & Ossington Ave", borough: "Toronto", lat: 43.6492, lng: -79.4242 },
  { name: "Lakeshore Blvd E & Carlaw Ave (GO Crossing)", borough: "Toronto", lat: 43.6547, lng: -79.3406 },
  { name: "Bloor St W & Dundas St W (The Junction)", borough: "Toronto", lat: 43.6652, lng: -79.4701 },
  { name: "Steeles Ave W & Jane St", borough: "Etobicoke", lat: 43.7598, lng: -79.5162 },
  { name: "Hurontario St & Burnhamthorpe Rd", borough: "Mississauga", lat: 43.589, lng: -79.6447 },
  { name: "Queen St E & Broadview Ave", borough: "Toronto", lat: 43.6598, lng: -79.3598 },
  { name: "Sheppard Ave E & Victoria Park Ave", borough: "Scarborough", lat: 43.7765, lng: -79.3045 },
  { name: "Gardiner Expressway — Jarvis On-Ramp", borough: "Toronto", lat: 43.6425, lng: -79.3712 },
  { name: "Highway 427 & Finch Ave W", borough: "Etobicoke", lat: 43.7485, lng: -79.5872 },
  { name: "Main St & Danforth Ave", borough: "Toronto", lat: 43.6855, lng: -79.2985 },
  { name: "Markham Rd & Ellesmere Rd", borough: "Scarborough", lat: 43.7675, lng: -79.2285 },
  { name: "Square One — City Centre Dr", borough: "Mississauga", lat: 43.593, lng: -79.6425 },
  { name: "Brampton — Main St & Queen St", borough: "Brampton", lat: 43.685, lng: -79.7598 },
  { name: "Richmond Hill — Yonge St & Major Mackenzie Dr", borough: "Richmond Hill", lat: 43.8565, lng: -79.4335 },
  { name: "Port Credit — Lakeshore Rd E & Hurontario St", borough: "Mississauga", lat: 43.553, lng: -79.5835 },
];

export function findLocationByName(name: string): GTALocation | undefined {
  return GTA_LOCATIONS.find(
    (loc) => loc.name.toLowerCase() === name.toLowerCase()
  );
}
