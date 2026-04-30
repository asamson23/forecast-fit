import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getBearerToken, getErrorMessage, handleOptions, proxyJsonResponse, readResponsePayload, respondWithProxyError, setCors, stravaFetch } from './_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (handleOptions(req, res)) return;
    setCors(res);
    const token = getBearerToken(req);
    if (!token) return res.status(401).json({ error: 'Missing bearer token' });

    const athleteResponse = await stravaFetch('/athlete', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const athletePayload = await readResponsePayload(athleteResponse);
    if (!athleteResponse.ok) {
      return res.status(athleteResponse.status).json({
        error: getErrorMessage(athletePayload, `Strava athlete lookup failed (${athleteResponse.status})`),
      });
    }

    const athleteId = Number((athletePayload as { id?: unknown })?.id);
    if (!Number.isFinite(athleteId) || athleteId <= 0) {
      return res.status(502).json({ error: 'Unable to resolve the authenticated Strava athlete ID' });
    }

    const response = await stravaFetch(`/athletes/${athleteId}/routes?page=1&per_page=50`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return proxyJsonResponse(res, response);
  } catch (error) {
    return respondWithProxyError(res, error);
  }
}
