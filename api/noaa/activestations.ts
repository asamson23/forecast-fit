import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCors } from './_utils';

const NOAA_ACTIVE_STATIONS_URL = 'https://www.ndbc.noaa.gov/activestations.xml';

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

  try {
    const upstream = await fetch(NOAA_ACTIVE_STATIONS_URL, {
      headers: {
        'User-Agent': 'Forecast Fit NOAA proxy',
        Accept: 'application/xml,text/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!upstream.ok) {
      res.status(upstream.status).json({ error: `NOAA station list unavailable (${upstream.status})` });
      return;
    }

    const xml = await upstream.text();
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=86400');
    res.status(200).send(xml);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to reach NOAA station list';
    res.status(502).json({ error: message });
  }
}
