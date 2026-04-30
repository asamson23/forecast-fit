import { getValidAccessToken } from './stravaAuth';

export interface StravaRouteSummary {
  id: number | string;
  name?: string;
  distance?: number;
  elevation_gain?: number;
  estimated_moving_time?: number;
  type?: number;
  sub_type?: number;
  updated_at?: string;
  permalink_url?: string;
  map?: {
    summary_polyline?: string;
    polyline?: string;
  };
}

export interface StravaActivitySummary {
  id: number | string;
  name?: string;
  type?: string;
  sport_type?: string;
  distance?: number;
  moving_time?: number;
  elapsed_time?: number;
  average_speed?: number;
  total_elevation_gain?: number;
  start_date?: string;
  start_date_local?: string;
  trainer?: boolean;
}

export interface StravaStreamSeries<T> {
  data?: T[];
}

export interface StravaActivityStreams {
  latlng?: StravaStreamSeries<[number, number]>;
  altitude?: StravaStreamSeries<number>;
  time?: StravaStreamSeries<number>;
}

function getPayloadMessage(payload: unknown): string | null {
  if (typeof payload === 'string' && payload.trim()) return payload.trim();
  if (!payload || typeof payload !== 'object') return null;
  const record = payload as { error?: unknown; message?: unknown };
  if (typeof record.error === 'string' && record.error.trim()) return record.error.trim();
  if (typeof record.message === 'string' && record.message.trim()) return record.message.trim();
  return null;
}

async function buildRequestError(response: Response): Promise<Error> {
  let payload: unknown = null;
  try {
    const contentType = response.headers.get('content-type') || '';
    payload = contentType.includes('application/json') ? await response.json() : await response.text();
  } catch {
    payload = null;
  }
  return new Error(getPayloadMessage(payload) || `Strava request failed (${response.status})`);
}

async function authedFetch(url: string, backendUrl: string) {
  const token = await getValidAccessToken(backendUrl);
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) throw await buildRequestError(response);
  return response;
}

export function fetchStravaRoutes(backendUrl: string) {
  return authedFetch(`${backendUrl}/api/strava/routes`, backendUrl).then((response) => response.json()) as Promise<StravaRouteSummary[]>;
}

export function fetchStravaRouteGpx(backendUrl: string, routeId: string | number) {
  return authedFetch(`${backendUrl}/api/strava/route-gpx?routeId=${encodeURIComponent(String(routeId))}`, backendUrl).then((response) => response.text());
}

export function fetchStravaActivities(backendUrl: string, page = 1) {
  return authedFetch(`${backendUrl}/api/strava/activities?page=${encodeURIComponent(String(page))}`, backendUrl).then((response) => response.json()) as Promise<StravaActivitySummary[]>;
}

export function fetchStravaActivityStreams(backendUrl: string, activityId: string | number) {
  return authedFetch(`${backendUrl}/api/strava/activity-streams?activityId=${encodeURIComponent(String(activityId))}`, backendUrl).then((response) => response.json()) as Promise<StravaActivityStreams>;
}
