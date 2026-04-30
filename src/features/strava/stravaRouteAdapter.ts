import { parseGpx } from '../route/parseGpx';
import { normalizeRoutePoints } from '../route/parseGeoJson';
import type { ImportedRoute } from '../../types/route';
import type { StravaActivityStreams, StravaActivitySummary, StravaRouteSummary } from './stravaClient';

export function stravaRouteGpxToImportedRoute(route: StravaRouteSummary, gpxText: string): ImportedRoute {
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

export function stravaActivityStreamsToImportedRoute(activity: StravaActivitySummary, streams: StravaActivityStreams): ImportedRoute {
  const latlng = Array.isArray(streams?.latlng?.data) ? streams.latlng.data : [];
  if (latlng.length < 2) throw new Error('That Strava activity does not include route coordinates to import.');

  const altitude = Array.isArray(streams?.altitude?.data) ? streams.altitude.data : [];
  const elapsedSeconds = Array.isArray(streams?.time?.data) ? streams.time.data : [];
  const baseTime = activity?.start_date || activity?.start_date_local || null;

  const geometry = normalizeRoutePoints(latlng.map((pair, index) => ({
    lat: Number(pair?.[0]),
    lon: Number(pair?.[1]),
    ele: Number.isFinite(Number(altitude[index])) ? Number(altitude[index]) : null,
    time: baseTime && Number.isFinite(Number(elapsedSeconds[index]))
      ? new Date(Date.parse(baseTime) + (Number(elapsedSeconds[index]) * 1000)).toISOString()
      : null,
  })));

  if (geometry.length < 2) throw new Error('That Strava activity does not include enough route points to import.');

  return {
    provider: 'strava',
    providerRouteId: String(activity?.id ?? ''),
    name: activity?.name || 'Strava activity',
    geometry,
    distanceMeters: Number(activity?.distance) || undefined,
    elevationGainMeters: Number(activity?.total_elevation_gain) || undefined,
    estimatedMovingTimeSeconds: Number(activity?.moving_time) || undefined,
    hasRealTimestamps: geometry.some((point) => !!point.time),
  };
}
