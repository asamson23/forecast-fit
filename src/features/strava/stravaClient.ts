import { getValidAccessToken } from './stravaAuth';

async function authedFetch(url: string, backendUrl: string) {
  const token = await getValidAccessToken(backendUrl);
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error(`Strava request failed (${response.status})`);
  return response;
}

export function fetchStravaRoutes(backendUrl: string) {
  return authedFetch(`${backendUrl}/api/strava/routes`, backendUrl).then((response) => response.json());
}

export function fetchStravaRouteGpx(backendUrl: string, routeId: string | number) {
  return authedFetch(`${backendUrl}/api/strava/route-gpx?routeId=${encodeURIComponent(String(routeId))}`, backendUrl).then((response) => response.text());
}
