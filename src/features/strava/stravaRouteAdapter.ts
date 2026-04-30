import { parseGpx } from '../route/parseGpx';
import { normalizeRoutePoints } from '../route/parseGeoJson';
import type { ImportedRoute } from '../../types/route';
import type { StravaActivityStreams, StravaActivitySummary, StravaRouteSummary } from './stravaClient';

function decodePolyline(encoded: string) {
  const points: Array<{ lat: number; lon: number }> = [];
  let index = 0;
  let lat = 0;
  let lon = 0;

  while (index < encoded.length) {
    let result = 0;
    let shift = 0;
    let byte = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lat += (result & 1) ? ~(result >> 1) : (result >> 1);

    result = 0;
    shift = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lon += (result & 1) ? ~(result >> 1) : (result >> 1);

    points.push({ lat: lat / 1e5, lon: lon / 1e5 });
  }

  return points;
}

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

export function stravaRouteSummaryToImportedRoute(route: StravaRouteSummary): ImportedRoute {
  const encoded = route?.map?.summary_polyline || route?.map?.polyline || '';
  const geometry = normalizeRoutePoints(decodePolyline(encoded));
  if (geometry.length < 2) throw new Error('That Strava route could not be exported and does not include enough fallback map data.');

  return {
    provider: 'strava',
    providerRouteId: String(route?.id ?? ''),
    name: route?.name || 'Strava route',
    geometry,
    distanceMeters: Number(route?.distance) || undefined,
    elevationGainMeters: Number(route?.elevation_gain) || undefined,
    estimatedMovingTimeSeconds: Number(route?.estimated_moving_time) || undefined,
    hasRealTimestamps: false,
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
