import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const code = String(req.query.code ?? '');
  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;
  const frontendUrl = process.env.FRONTEND_URL;

  if (!code || !clientId || !clientSecret || !frontendUrl) {
    res.status(400).send('Missing OAuth callback parameters or server config');
    return;
  }

  const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, grant_type: 'authorization_code' }),
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
  });

  res.redirect(`${frontendUrl}#${hash.toString()}`);
}
