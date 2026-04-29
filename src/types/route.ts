export interface RoutePoint {
  lat: number;
  lon: number;
  ele?: number | null;
  time?: string | null;
  distanceKm?: number;
}

export interface ImportedRoute {
  provider: 'manual' | 'strava' | 'ridewithgps';
  providerRouteId?: string;
  name: string;
  distanceMeters?: number;
  elevationGainMeters?: number;
  estimatedMovingTimeSeconds?: number;
  hasRealTimestamps: boolean;
  geometry: RoutePoint[];
  sourceUrl?: string;
}
