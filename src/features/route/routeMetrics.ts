import type { ImportedRoute, RoutePoint } from '../../types/route';
import { haversineKm } from '../../utils/distance';

export interface EnrichedRoutePoint extends RoutePoint {
  index: number;
  kmFromStart: number;
  segmentKm: number;
  deltaEle: number;
  gradePct: number;
  timeMs: number;
}

export interface RouteStateModel {
  fileName: string;
  points: EnrichedRoutePoint[];
  totalKm: number;
  totalGain: number;
  hasElevation: boolean;
  timedPointCount: number;
  elapsedMinutes: number | null;
  derivedDurationKey: string | null;
  weatherCache: Record<string, unknown>;
  timingCache: Record<string, unknown>;
  samples: unknown[];
}

export interface BuildRouteStateOptions {
  parseTime: (value: unknown) => number;
  nearestDurationKey: (minutes: number) => string;
}

export function calculateRouteDistanceKm(points: RoutePoint[]): number {
  return points.reduce((total, point, index) => {
    const previous = points[index - 1];
    if (!previous) return total;
    return total + haversineKm(previous.lat, previous.lon, point.lat, point.lon);
  }, 0);
}

function isFiniteRouteNumber(value: unknown): boolean {
  return Number.isFinite(Number(value));
}

export function buildRouteStateModel(
  points: RoutePoint[],
  fileName: string,
  options: BuildRouteStateOptions,
): RouteStateModel {
  const enriched: EnrichedRoutePoint[] = [];
  let totalKm = 0;
  let totalGain = 0;

  points.forEach((point, index) => {
    const previous = index > 0 ? points[index - 1] : null;
    const segmentKm = previous ? haversineKm(previous.lat, previous.lon, point.lat, point.lon) : 0;
    totalKm += segmentKm;

    const ele = isFiniteRouteNumber(point.ele) ? Number(point.ele) : null;
    const previousEle = isFiniteRouteNumber(previous?.ele) ? Number(previous?.ele) : null;
    const deltaEle = index > 0 && isFiniteRouteNumber(ele) && isFiniteRouteNumber(previousEle) ? Number(ele) - Number(previousEle) : 0;
    if (deltaEle > 0) totalGain += deltaEle;

    const gradePct =
      segmentKm > 0 && isFiniteRouteNumber(ele) && isFiniteRouteNumber(previousEle)
        ? (deltaEle / Math.max(1, segmentKm * 1000)) * 100
        : 0;

    enriched.push({
      ...point,
      ele,
      index,
      kmFromStart: totalKm,
      segmentKm,
      deltaEle,
      gradePct,
      timeMs: options.parseTime(point.time),
    });
  });

  const timed = enriched.filter((point) => isFiniteRouteNumber(point.timeMs));
  const elapsedMinutes =
    timed.length >= 2 ? Math.max(0, (timed[timed.length - 1].timeMs - timed[0].timeMs) / 60000) : null;
  const hasElapsed = isFiniteRouteNumber(elapsedMinutes) && Number(elapsedMinutes) > 0;

  return {
    fileName,
    points: enriched,
    totalKm,
    totalGain,
    hasElevation: enriched.some((point) => isFiniteRouteNumber(point.ele)),
    timedPointCount: timed.length,
    elapsedMinutes: hasElapsed ? elapsedMinutes : null,
    derivedDurationKey: hasElapsed ? options.nearestDurationKey(Number(elapsedMinutes)) : null,
    weatherCache: {},
    timingCache: {},
    samples: [],
  };
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
