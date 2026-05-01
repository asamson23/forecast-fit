import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, setCors } from './stravaUtils.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;
  setCors(res);
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const refreshToken = req.body?.refresh_token;
  if (!refreshToken) return res.status(400).json({ error: 'refresh_token is required' });

  const clientId = process.env.STRAVA_CLIENT_ID?.trim();
  const clientSecret = process.env.STRAVA_CLIENT_SECRET?.trim();

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'Missing Strava client configuration' });
  }

  const tokenParams = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'refresh_token',
    refresh_token: String(refreshToken).trim(),
  });

  const response = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: tokenParams.toString(),
  });

  const json = await response.json();
  res.status(response.status).json(json);
}
