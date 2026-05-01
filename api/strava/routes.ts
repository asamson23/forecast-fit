import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getBearerToken, getErrorMessage, handleOptions, parsePositiveInteger, proxyJsonResponse, readResponsePayload, respondWithProxyError, setCors, stravaFetch } from './stravaUtils.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (handleOptions(req, res)) return;
    setCors(res);
    const token = getBearerToken(req);
    if (!token) return res.status(401).json({ error: 'Missing bearer token' });
    const headers = { Authorization: `Bearer ${token}` };
    const page = parsePositiveInteger(req.query.page, 1);

    const directRoutesResponse = await stravaFetch(`/athlete/routes?page=${page}&per_page=50`, { headers });
    if (directRoutesResponse.ok) {
      return proxyJsonResponse(res, directRoutesResponse);
    }
    const directRoutesPayload = await readResponsePayload(directRoutesResponse);

    const athleteResponse = await stravaFetch('/athlete', { headers });
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

    const athleteRoutesResponse = await stravaFetch(`/athletes/${athleteId}/routes?page=${page}&per_page=50`, { headers });
    if (athleteRoutesResponse.ok) {
      return proxyJsonResponse(res, athleteRoutesResponse);
    }

    const athleteRoutesPayload = await readResponsePayload(athleteRoutesResponse);
    const directError = getErrorMessage(directRoutesPayload, `Strava route lookup failed (${directRoutesResponse.status})`);
    const athleteError = getErrorMessage(athleteRoutesPayload, `Strava athlete route lookup failed (${athleteRoutesResponse.status})`);

    return res.status(athleteRoutesResponse.status).json({
      error: directError === athleteError ? directError : `${directError} | ${athleteError}`,
    });
  } catch (error) {
    return respondWithProxyError(res, error);
  }
}
