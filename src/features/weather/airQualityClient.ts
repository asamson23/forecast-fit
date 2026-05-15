import { AIR_QUALITY_API } from '../../data/constants';

export interface AirQualityPayload {
  hourly: {
    time: string[];
    us_aqi: (number | null)[];
  };
}

const airQualityCache = new Map<string, Promise<AirQualityPayload | null>>();

function buildAirQualityCacheKey(latitude: number, longitude: number): string {
  return `${latitude.toFixed(3)},${longitude.toFixed(3)}`;
}

export async function fetchAirQuality(latitude: number, longitude: number): Promise<AirQualityPayload | null> {
  const cacheKey = buildAirQualityCacheKey(latitude, longitude);
  const cached = airQualityCache.get(cacheKey);
  if (cached) return cached;

  const pending = (async () => {
    const url = `${AIR_QUALITY_API}?latitude=${latitude}&longitude=${longitude}&hourly=us_aqi&forecast_days=14&timezone=auto`;
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const json = await res.json();
      if (!json?.hourly?.time || !json?.hourly?.us_aqi) return null;
      return json as AirQualityPayload;
    } catch {
      return null;
    }
  })();

  airQualityCache.set(cacheKey, pending);
  const result = await pending;
  return result;
}

export function matchAqiToHourlyTime(aqiPayload: AirQualityPayload | null, time: string): number | undefined {
  if (!aqiPayload) return undefined;
  const idx = aqiPayload.hourly.time.indexOf(time);
  if (idx === -1) return undefined;
  const val = aqiPayload.hourly.us_aqi[idx];
  return val !== null && Number.isFinite(val) ? val : undefined;
}
