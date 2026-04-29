import type { VercelRequest, VercelResponse } from '@vercel/node';

export function setCors(res: VercelResponse) {
  const origin = process.env.FRONTEND_URL ?? '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type');
}

export function handleOptions(req: VercelRequest, res: VercelResponse): boolean {
  if (req.method === 'OPTIONS') {
    setCors(res);
    res.status(204).end();
    return true;
  }
  return false;
}

export function getBearerToken(req: VercelRequest): string | null {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice(7);
}

export async function stravaFetch(path: string, init: RequestInit = {}) {
  return fetch(`https://www.strava.com/api/v3${path}`, init);
}
