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

export async function readResponsePayload(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') || '';
  try {
    if (contentType.includes('application/json')) return await response.json();
    return await response.text();
  } catch {
    return null;
  }
}

export function getErrorMessage(payload: unknown, fallback: string): string {
  if (typeof payload === 'string' && payload.trim()) return payload.trim();
  if (!payload || typeof payload !== 'object') return fallback;

  const record = payload as {
    error?: unknown;
    message?: unknown;
    errors?: Array<{ message?: unknown; code?: unknown; resource?: unknown; field?: unknown }>;
  };

  if (typeof record.error === 'string' && record.error.trim()) return record.error.trim();
  if (typeof record.message === 'string' && record.message.trim()) return record.message.trim();
  if (Array.isArray(record.errors) && record.errors.length) {
    const first = record.errors[0] || {};
    const parts = [first.message, first.code, first.resource, first.field]
      .map((value) => (typeof value === 'string' ? value.trim() : ''))
      .filter(Boolean);
    if (parts.length) return parts.join(' · ');
  }

  return fallback;
}

export async function proxyJsonResponse(res: VercelResponse, response: Response) {
  const payload = await readResponsePayload(response);
  if (!response.ok) {
    return res.status(response.status).json({
      error: getErrorMessage(payload, `Strava API request failed (${response.status})`),
      details: payload,
    });
  }
  return res.status(response.status).json(payload);
}

export async function proxyTextResponse(res: VercelResponse, response: Response, contentType: string) {
  const payload = await readResponsePayload(response);
  if (!response.ok) {
    return res.status(response.status).json({
      error: getErrorMessage(payload, `Strava API request failed (${response.status})`),
      details: payload,
    });
  }

  res.status(response.status).setHeader('Content-Type', contentType);
  return res.send(typeof payload === 'string' ? payload : '');
}

export function respondWithProxyError(res: VercelResponse, error: unknown) {
  const message = error instanceof Error ? error.message : 'Unable to reach Strava';
  return res.status(502).json({ error: message });
}
