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

export function pointInRing(lon: number, lat: number, ring: unknown[]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const current = ring[i] as unknown[];
    const previous = ring[j] as unknown[];
    const xi = Number(current[0]);
    const yi = Number(current[1]);
    const xj = Number(previous[0]);
    const yj = Number(previous[1]);
    const intersects = (yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / ((yj - yi) || 1e-12) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

export function ecccFeatureContainsPoint(feature: any, lat: unknown, lon: unknown): boolean {
  const geom = feature?.geometry;
  if (!geom) return false;
  const latitude = Number(lat);
  const longitude = Number(lon);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return false;
  if (geom.type === 'Polygon') {
    const rings = geom.coordinates || [];
    if (!rings.length || !pointInRing(longitude, latitude, rings[0])) return false;
    return !rings.slice(1).some((ring: unknown[]) => pointInRing(longitude, latitude, ring));
  }
  if (geom.type === 'MultiPolygon') {
    return (geom.coordinates || []).some((poly: unknown[][]) => {
      const rings = poly || [];
      return rings.length && pointInRing(longitude, latitude, rings[0]) && !rings.slice(1).some((ring) => pointInRing(longitude, latitude, ring));
    });
  }
  return false;
}

export function isActiveEcccAlertFeature(feature: any, now = new Date()): boolean {
  const p = feature?.properties || {};
  const status = String(p.status_en || '').toLowerCase();
  if (['ended', 'expired', 'cancelled', 'canceled', 'changed_from'].includes(status)) return false;
  const expiry = p.expiration_datetime ? new Date(p.expiration_datetime) : null;
  if (expiry && Number.isFinite(expiry.getTime()) && expiry < now) return false;
  const eventEnd = p.event_end_datetime ? new Date(p.event_end_datetime) : null;
  if (eventEnd && Number.isFinite(eventEnd.getTime()) && eventEnd < now) return false;
  return true;
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
