export { ECCC_ALERTS_API } from '../../data/constants';
import { ECCC_ALERTS_API } from '../../data/constants';
import {
  dedupeAlerts,
  ecccFeatureContainsPoint,
  isActiveEcccAlertFeature,
  isProbablyCanadaPoint,
  normalizeEcccAlertFeature,
} from './warnings';

export async function fetchEcccWeatherAlertsForPoint(lat: number, lon: number, countryCode = '') {
  if (String(countryCode || '').toUpperCase() !== 'CA' && !isProbablyCanadaPoint(lat, lon)) {
    return { source: 'forecast-derived', status: 'not_canada', alerts: [] };
  }
  const radius = 0.08;
  const bbox = [Number(lon) - radius, Number(lat) - radius, Number(lon) + radius, Number(lat) + radius].join(',');
  const url = `${ECCC_ALERTS_API}?f=json&lang=en&limit=100&bbox=${encodeURIComponent(bbox)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`ECCC alerts HTTP ${res.status}`);
    const json = await res.json();
    const now = new Date();
    const alerts = (json.features || [])
      .filter((feature: unknown) => isActiveEcccAlertFeature(feature, now))
      .filter((feature: unknown) => ecccFeatureContainsPoint(feature, lat, lon))
      .map(normalizeEcccAlertFeature);
    return { source: 'eccc', status: 'ok', alerts: dedupeAlerts(alerts) };
  } catch (error) {
    console.warn('ECCC alert lookup failed', error);
    return { source: 'eccc', status: 'error', alerts: [], error: error instanceof Error ? error.message : String(error) };
  }
}
