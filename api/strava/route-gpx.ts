import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getBearerToken, handleOptions, proxyTextResponse, respondWithProxyError, setCors, stravaFetch } from './stravaUtils.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (handleOptions(req, res)) return;
    setCors(res);
    const token = getBearerToken(req);
    const routeId = String(req.query.routeId ?? req.query.id ?? '');
    if (!token) return res.status(401).json({ error: 'Missing bearer token' });
    if (!routeId) return res.status(400).json({ error: 'Missing routeId' });
    const response = await stravaFetch(`/routes/${routeId}/export_gpx`, { headers: { Authorization: `Bearer ${token}` } });
    return proxyTextResponse(res, response, 'application/gpx+xml');
  } catch (error) {
    return respondWithProxyError(res, error);
  }
}
