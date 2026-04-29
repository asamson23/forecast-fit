import { parseGpx } from '../route/parseGpx';
import type { ImportedRoute } from '../../types/route';

export function stravaRouteGpxToImportedRoute(route: any, gpxText: string): ImportedRoute {
  const geometry = parseGpx(gpxText);
  return {
    provider: 'strava',
    providerRouteId: String(route?.id ?? ''),
    name: route?.name || 'Strava route',
    geometry,
    distanceMeters: Number(route?.distance) || undefined,
    elevationGainMeters: Number(route?.elevation_gain) || undefined,
    estimatedMovingTimeSeconds: Number(route?.estimated_moving_time) || undefined,
    hasRealTimestamps: geometry.some((point) => !!point.time),
    sourceUrl: route?.permalink_url || undefined,
  };
}
