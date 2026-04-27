import type { ImportedRoute, RoutePoint } from '../../types/route';
import { haversineKm } from '../../utils/distance';

export function calculateRouteDistanceKm(points: RoutePoint[]): number {
  return points.reduce((total, point, index) => {
    const previous = points[index - 1];
    if (!previous) return total;
    return total + haversineKm(previous.lat, previous.lon, point.lat, point.lon);
  }, 0);
}

export function buildImportedRoute(name: string, points: RoutePoint[]): ImportedRoute {
  const timed = points.filter((point) => point.time);
  const start = timed[0]?.time ? new Date(timed[0].time).getTime() : NaN;
  const end = timed[timed.length - 1]?.time ? new Date(timed[timed.length - 1].time as string).getTime() : NaN;
  const durationMinutes = Number.isFinite(start) && Number.isFinite(end) && end > start ? (end - start) / 60000 : null;
  return {
    name,
    points,
    distanceKm: calculateRouteDistanceKm(points),
    hasTimeData: timed.length > 1,
    durationMinutes,
  };
}
