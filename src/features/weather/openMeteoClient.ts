import {
  GEO_API,
  NOMINATIM_SEARCH_API,
  WEATHER_API,
  LOCATION_PRIORITY_COUNTRY_CODES,
  NORTH_AMERICA_COUNTRY_CODES,
  WESTERN_EUROPE_COUNTRY_CODES,
} from '../../data/constants';

export { WEATHER_API, GEO_API, NOMINATIM_SEARCH_API };

export interface SearchPlaceResult {
  latitude: number;
  longitude: number;
  name: string;
  admin1?: string;
  country?: string;
  country_code?: string;
  display_name?: string;
}

const locationPriorityCountryCodes = new Set(LOCATION_PRIORITY_COUNTRY_CODES);
const northAmericaCountryCodes = new Set(NORTH_AMERICA_COUNTRY_CODES);
const westernEuropeCountryCodes = new Set(WESTERN_EUROPE_COUNTRY_CODES);

export function normalizeSearchResult(result: any, source = 'openmeteo'): SearchPlaceResult {
  if (source === 'nominatim') {
    const addr = result.address || {};
    const rawName = addr.city || addr.town || addr.village || addr.municipality || addr.hamlet || addr.suburb || addr.neighbourhood || addr.county || addr.state_district || addr.state || addr.postcode || result.name || '';
    const displayName = result.display_name || '';
    const name = rawName || displayName.split(',')[0] || 'Selected location';
    const admin1 = addr.state || addr.province || addr.county || addr.state_district || '';
    const country = addr.country || '';
    const country_code = (addr.country_code || '').toUpperCase();
    return {
      latitude: Number(result.lat),
      longitude: Number(result.lon),
      name,
      admin1,
      country,
      country_code,
      display_name: displayName,
    };
  }
  return result;
}

export function dedupeSearchResults<T extends SearchPlaceResult>(results: T[]): T[] {
  const seen = new Set<string>();
  return results.filter((result) => {
    const lat = typeof result.latitude === 'number' ? result.latitude.toFixed(3) : result.latitude;
    const lon = typeof result.longitude === 'number' ? result.longitude.toFixed(3) : result.longitude;
    const key = `${lat}|${lon}|${String(result.name || '').toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function getLocationPriorityScore(result: SearchPlaceResult): number {
  const code = String(result?.country_code || '').toUpperCase();
  if (northAmericaCountryCodes.has(code)) return 0;
  if (westernEuropeCountryCodes.has(code)) return 1;
  if (locationPriorityCountryCodes.has(code)) return 2;
  return 3;
}

export async function searchPlaces(query: string, count = 6): Promise<SearchPlaceResult[]> {
  const cleaned = String(query || '').trim();
  if (!cleaned) return [];
  const results: SearchPlaceResult[] = [];
  try {
    const geoRes = await fetch(`${GEO_API}?name=${encodeURIComponent(cleaned)}&count=${Math.max(6, count * 3)}&language=en&format=json`);
    const geoData = await geoRes.json();
    if (Array.isArray(geoData.results)) results.push(...geoData.results.map((result: unknown) => normalizeSearchResult(result, 'openmeteo')));
  } catch (_) {}
  try {
    const nomRes = await fetch(`${NOMINATIM_SEARCH_API}?q=${encodeURIComponent(cleaned)}&format=jsonv2&addressdetails=1&limit=${Math.max(6, count * 3)}`, {
      headers: { 'Accept-Language': 'en' },
    });
    const nomData = await nomRes.json();
    if (Array.isArray(nomData)) results.push(...nomData.map((result: unknown) => normalizeSearchResult(result, 'nominatim')));
  } catch (_) {}
  return dedupeSearchResults(results)
    .sort((a, b) => getLocationPriorityScore(a) - getLocationPriorityScore(b))
    .slice(0, count);
}

export function buildOpenMeteoForecastUrl(latitude: number, longitude: number): string {
  return `${WEATHER_API}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_gusts_10m,wind_direction_10m,precipitation,is_day,weather_code&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,wind_speed_10m,wind_gusts_10m,wind_direction_10m,weather_code,is_day,uv_index&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,precipitation_probability_max,sunrise,sunset,daylight_duration,weather_code,uv_index_max&forecast_days=7&past_days=7&wind_speed_unit=kmh&timezone=auto`;
}
