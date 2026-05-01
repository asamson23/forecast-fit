import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getBearerToken, handleOptions, parsePositiveInteger, proxyJsonResponse, respondWithProxyError, setCors, stravaFetch } from './stravaUtils.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (handleOptions(req, res)) return;
    setCors(res);
    const token = getBearerToken(req);
    if (!token) return res.status(401).json({ error: 'Missing bearer token' });
    const activityId = parsePositiveInteger(req.query.activityId, 0);
    if (!activityId) return res.status(400).json({ error: 'Missing activityId' });
    const response = await stravaFetch(`/activities/${activityId}`, { headers: { Authorization: `Bearer ${token}` } });
    return proxyJsonResponse(res, response);
  } catch (error) {
    return respondWithProxyError(res, error);
  }
}
