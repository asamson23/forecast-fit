import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getBearerToken, handleOptions, proxyJsonResponse, respondWithProxyError, setCors, stravaFetch } from './_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;
  setCors(res);
  const token = getBearerToken(req);
  if (!token) return res.status(401).json({ error: 'Missing bearer token' });

  try {
    const response = await stravaFetch('/athlete/routes?page=1&per_page=50', { headers: { Authorization: `Bearer ${token}` } });
    return proxyJsonResponse(res, response);
  } catch (error) {
    return respondWithProxyError(res, error);
  }
}
