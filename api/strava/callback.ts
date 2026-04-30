import type { VercelRequest, VercelResponse } from '@vercel/node';

const REQUIRED_SCOPES = ['read_all', 'activity:read_all', 'profile:read_all'];

function resolveRedirectUri(req: VercelRequest): string {
  const configured = process.env.STRAVA_REDIRECT_URI;
  if (configured) return configured;
  const protoHeader = (req.headers['x-forwarded-proto'] as string | undefined)?.split(',')[0]?.trim();
  const hostHeader = (req.headers['x-forwarded-host'] as string | undefined)?.split(',')[0]?.trim() || req.headers.host;
  const protocol = protoHeader || 'https';
  return `${protocol}://${hostHeader}/api/strava/callback`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const code = String(req.query.code ?? '');
  const grantedScope = String(req.query.scope ?? '');
  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;
  const frontendUrl = process.env.FRONTEND_URL;

  if (!clientId || !clientSecret || !frontendUrl) {
    res.status(400).send('Missing OAuth callback parameters or server config');
    return;
  }

  const grantedScopes = new Set(grantedScope.split(',').map((scope) => scope.trim()).filter(Boolean));
  const missingScopes = REQUIRED_SCOPES.filter((scope) => !grantedScopes.has(scope));
  if (!code || missingScopes.length) {
    const hash = new URLSearchParams({
      strava_auth_error: missingScopes.length
        ? `Strava did not grant the required permissions: ${missingScopes.join(', ')}`
        : 'Strava authorization did not return a code.',
    });
    res.redirect(`${frontendUrl}#${hash.toString()}`);
    return;
  }

  const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: resolveRedirectUri(req),
    }),
  });

  if (!tokenResponse.ok) {
    const message = await tokenResponse.text();
    res.status(502).send(`Strava token exchange failed: ${message}`);
    return;
  }

  const payload = await tokenResponse.json();
  const athleteName = [payload?.athlete?.firstname, payload?.athlete?.lastname].filter(Boolean).join(' ');
  const hash = new URLSearchParams({
    strava_access_token: String(payload.access_token ?? ''),
    strava_refresh_token: String(payload.refresh_token ?? ''),
    strava_expires_at: String(payload.expires_at ?? ''),
    strava_athlete_name: athleteName,
    strava_scope: grantedScope,
  });

  res.redirect(`${frontendUrl}#${hash.toString()}`);
}
