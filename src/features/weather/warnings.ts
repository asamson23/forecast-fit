import type { WeatherAlert } from '../../types/weather';
import { isCanadianCountryCode } from '../../utils/geo';

export function shouldUseEcccAlerts(countryCode: string | null | undefined): boolean {
  return isCanadianCountryCode(countryCode);
}

export function dedupeAlerts(alerts: WeatherAlert[]): WeatherAlert[] {
  const seen = new Set<string>();
  return alerts.filter((alert) => {
    const key = alert.id || `${alert.title}:${alert.description || ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
