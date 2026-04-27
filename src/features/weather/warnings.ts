import type { WeatherAlert } from '../../types/weather';
import { isCanadianCountryCode } from '../../utils/geo';

export interface EcccAlertFeature {
  id?: string;
  properties?: Record<string, unknown>;
}

export function isProbablyCanadaPoint(lat: unknown, lon: unknown): boolean {
  const latitude = Number(lat);
  const longitude = Number(lon);
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= 41 &&
    latitude <= 84 &&
    longitude >= -142 &&
    longitude <= -52
  );
}

export function shouldUseEcccAlerts(countryCode: string | null | undefined, lat?: unknown, lon?: unknown): boolean {
  return isCanadianCountryCode(countryCode) || isProbablyCanadaPoint(lat, lon);
}

export function shouldUseEcccAlertsForWeatherData(data: any): boolean {
  const code = String(data?.countryCode || data?.country_code || '').toUpperCase();
  return shouldUseEcccAlerts(code, data?.latitude, data?.longitude);
}

export function normalizeEcccAlertFeature(feature: EcccAlertFeature): any {
  const p = feature?.properties || {};
  const colour = String(p.risk_colour_en || '').toLowerCase() || (p.alert_type === 'statement' ? 'grey' : 'yellow');
  const type = String(p.alert_type || 'alert').toLowerCase();
  const hazard = p.alert_short_name_en || p.alert_name_en || 'Weather alert';
  const featureName = p.feature_name_en || p.province || 'Affected area';
  const text = String(p.alert_text_en || '').replace(/\s+/g, ' ').trim();
  const summary = text ? (text.length > 240 ? `${text.slice(0, 237)}…` : text) : `${hazard} in effect for ${featureName}.`;
  const colourLabel = colour ? colour.charAt(0).toUpperCase() + colour.slice(1) : '';
  const typeLabel = type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Alert';
  const level = colour === 'red' ? 'severe' : colour;
  return {
    id: p.id || feature?.id || `${hazard}-${featureName}`,
    level,
    colour,
    icon: type === 'statement' ? 'ℹ️' : '⚠️',
    title: `${colourLabel ? `${colourLabel} ` : ''}${typeLabel} · ${hazard}`,
    detail: `${summary} (${featureName})`,
    source: 'eccc',
  };
}

type AlertLike = WeatherAlert & { detail?: string };

export function dedupeAlerts<T extends AlertLike>(alerts: T[] = []): T[] {
  const seen = new Set<string>();
  return alerts.filter((alert) => {
    const key = String(alert.id || `${alert.title}|${alert.detail || alert.description || ''}`).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
