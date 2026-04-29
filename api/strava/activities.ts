import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getBearerToken, handleOptions, setCors, stravaFetch } from './_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;
  setCors(res);
  const token = getBearerToken(req);
  if (!token) return res.status(401).json({ error: 'Missing bearer token' });
  const page = Number(req.query.page ?? 1);
  const response = await stravaFetch(`/athlete/activities?page=${page}&per_page=25`, { headers: { Authorization: `Bearer ${token}` } });
  const json = await response.json();
  res.status(response.status).json(json);
}
