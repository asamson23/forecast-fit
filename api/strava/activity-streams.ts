import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getBearerToken, handleOptions, setCors, stravaFetch } from './_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;
  setCors(res);
  const token = getBearerToken(req);
  const activityId = String(req.query.activityId ?? req.query.id ?? '');
  if (!token) return res.status(401).json({ error: 'Missing bearer token' });
  if (!activityId) return res.status(400).json({ error: 'Missing activityId' });

  const response = await stravaFetch(`/activities/${activityId}/streams?keys=latlng,altitude,time&key_by_type=true`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await response.json();
  res.status(response.status).json(json);
}
