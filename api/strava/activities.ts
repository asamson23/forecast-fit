import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getBearerToken, handleOptions, parsePositiveInteger, proxyJsonResponse, respondWithProxyError, setCors, stravaFetch } from './stravaUtils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (handleOptions(req, res)) return;
    setCors(res);
    const token = getBearerToken(req);
    if (!token) return res.status(401).json({ error: 'Missing bearer token' });
    const page = parsePositiveInteger(req.query.page, 1);
    const response = await stravaFetch(`/athlete/activities?page=${page}&per_page=25`, { headers: { Authorization: `Bearer ${token}` } });
    return proxyJsonResponse(res, response);
  } catch (error) {
    return respondWithProxyError(res, error);
  }
}
