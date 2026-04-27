import { AIR_QUALITY_API } from '../../data/constants';

export interface AirQualityPayload {
  hourly: {
    time: string[];
    us_aqi: (number | null)[];
  };
}

export async function fetchAirQuality(latitude: number, longitude: number): Promise<AirQualityPayload | null> {
  try {
    const url = `${AIR_QUALITY_API}?latitude=${latitude}&longitude=${longitude}&hourly=us_aqi&forecast_days=7&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    if (!json?.hourly?.time || !json?.hourly?.us_aqi) return null;
    return json as AirQualityPayload;
  } catch {
    return null;
  }
}

export function matchAqiToHourlyTime(aqiPayload: AirQualityPayload | null, time: string): number | undefined {
  if (!aqiPayload) return undefined;
  const idx = aqiPayload.hourly.time.indexOf(time);
  if (idx === -1) return undefined;
  const val = aqiPayload.hourly.us_aqi[idx];
  return val !== null && Number.isFinite(val) ? val : undefined;
}
