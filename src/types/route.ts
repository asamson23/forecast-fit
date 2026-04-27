export interface RoutePoint {
  lat: number;
  lon: number;
  ele?: number | null;
  time?: string | null;
  distanceKm?: number;
}

export interface ImportedRoute {
  name: string;
  points: RoutePoint[];
  distanceKm: number;
  hasTimeData: boolean;
  durationMinutes?: number | null;
}
