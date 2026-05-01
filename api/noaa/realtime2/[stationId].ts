import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCors } from '../_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const rawStationId = Array.isArray(req.query.stationId) ? req.query.stationId[0] : req.query.stationId;
  const stationId = String(rawStationId || '').trim();

  if (!/^[a-z0-9_-]+$/i.test(stationId)) {
    res.status(400).json({ error: 'Invalid station id' });
    return;
  }

  try {
    const upstream = await fetch(`https://www.ndbc.noaa.gov/data/realtime2/${encodeURIComponent(stationId)}.txt`, {
      headers: {
        'User-Agent': 'Forecast Fit NOAA proxy',
        Accept: 'text/plain,*/*;q=0.8',
      },
    });

    if (!upstream.ok) {
      res.status(upstream.status).json({ error: `NOAA station observation unavailable (${upstream.status})` });
      return;
    }

    const body = await upstream.text();
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=3600');
    res.status(200).send(body);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to reach NOAA station observation';
    res.status(502).json({ error: message });
  }
}
