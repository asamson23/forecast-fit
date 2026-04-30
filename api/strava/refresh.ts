import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, setCors } from './stravaUtils.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;
  setCors(res);
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const refreshToken = req.body?.refresh_token;
  if (!refreshToken) return res.status(400).json({ error: 'refresh_token is required' });

  const response = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  const json = await response.json();
  res.status(response.status).json(json);
}
