const KEY_ACCESS = 'strava_access_token';
const KEY_REFRESH = 'strava_refresh_token';
const KEY_EXPIRES = 'strava_expires_at';
const KEY_ATHLETE = 'strava_athlete_name';
const KEY_ERROR = 'strava_auth_error';

export interface StravaSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  athleteName: string;
}

export function getStravaSession(): StravaSession | null {
  const accessToken = localStorage.getItem(KEY_ACCESS);
  const refreshToken = localStorage.getItem(KEY_REFRESH);
  const expiresAt = Number(localStorage.getItem(KEY_EXPIRES));
  if (!accessToken || !refreshToken || !Number.isFinite(expiresAt)) return null;
  return { accessToken, refreshToken, expiresAt, athleteName: localStorage.getItem(KEY_ATHLETE) || 'Athlete' };
}

export function saveStravaSession(session: StravaSession) {
  localStorage.setItem(KEY_ACCESS, session.accessToken);
  localStorage.setItem(KEY_REFRESH, session.refreshToken);
  localStorage.setItem(KEY_EXPIRES, String(session.expiresAt));
  localStorage.setItem(KEY_ATHLETE, session.athleteName || 'Athlete');
  localStorage.removeItem(KEY_ERROR);
}

export function getStravaAuthError(): string {
  return localStorage.getItem(KEY_ERROR) || '';
}

export function clearStravaSession() {
  [KEY_ACCESS, KEY_REFRESH, KEY_EXPIRES, KEY_ATHLETE, KEY_ERROR].forEach((key) => localStorage.removeItem(key));
}

export function consumeStravaOAuthCallback(): boolean {
  const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : '';
  const params = new URLSearchParams(hash);
  const authError = params.get('strava_auth_error');
  if (authError) {
    clearStravaSession();
    localStorage.setItem(KEY_ERROR, authError);
    history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    return true;
  }
  const accessToken = params.get('strava_access_token');
  const refreshToken = params.get('strava_refresh_token');
  const expiresAt = Number(params.get('strava_expires_at'));
  if (!accessToken || !refreshToken || !Number.isFinite(expiresAt)) return false;
  saveStravaSession({ accessToken, refreshToken, expiresAt, athleteName: params.get('strava_athlete_name') || 'Athlete' });
  history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  return true;
}

export async function getValidAccessToken(backendUrl: string): Promise<string> {
  const session = getStravaSession();
  if (!session) throw new Error('Not connected to Strava');
  const aboutToExpire = session.expiresAt * 1000 - Date.now() < 5 * 60 * 1000;
  if (!aboutToExpire) return session.accessToken;

  const response = await fetch(`${backendUrl}/api/strava/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: session.refreshToken }),
  });
  if (!response.ok) throw new Error('Failed to refresh Strava token');
  const payload = await response.json();
  const next: StravaSession = {
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token || session.refreshToken,
    expiresAt: payload.expires_at,
    athleteName: session.athleteName,
  };
  saveStravaSession(next);
  return next.accessToken;
}
