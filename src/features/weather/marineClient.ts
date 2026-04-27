export { MARINE_API } from '../../data/constants';

export interface EcccMarineStation {
  id: string;
  name: string;
  lat: number;
  lon: number;
  url: string;
}

export const ECCC_MARINE_STATIONS: EcccMarineStation[] = [
  { id: '44258', name: 'Halifax Harbour', lat: 44.5, lon: -63.4, url: 'https://www.weather.gc.ca/marine/weatherConditions-currentConditions_e.html?mapID=15&siteID=13807&stationID=44258' },
  { id: '44489', name: 'West Chedabucto Bay', lat: 45.49, lon: -61.14, url: 'https://www.weather.gc.ca/marine/weatherConditions-currentConditions_e.html?mapID=15&siteID=15603&stationID=44489' },
  { id: '46036', name: 'South Nomad', lat: 48.35, lon: -133.95, url: 'https://weather.gc.ca/marine/weatherConditions-currentConditions_e.html?mapID=02&siteID=&stationID=46036' },
  { id: '46146', name: 'Halibut Bank', lat: 49.34, lon: -123.72, url: 'https://weather.gc.ca/marine/weatherConditions-currentConditions_e.html?mapID=02&siteID=&stationID=46146' },
  { id: '46132', name: 'South Brooks', lat: 49.46, lon: -127.53, url: 'https://weather.gc.ca/marine/weatherConditions-currentConditions_e.html?mapID=02&siteID=14300&stationID=46132' },
  { id: '46131', name: 'Sentry Shoal', lat: 49.92, lon: -125.0, url: 'https://weather.gc.ca/marine/weatherConditions-currentConditions_e.html?mapID=02&siteID=04800&stationID=46131' },
  { id: '46206', name: 'La Perouse Bank', lat: 48.83, lon: -126.0, url: 'https://weather.gc.ca/marine/weatherConditions-currentConditions_e.html?mapID=02&siteID=14300&stationID=46206' },
  { id: '46185', name: 'South Hecate Strait', lat: 52.85, lon: -130.08, url: 'https://weather.gc.ca/marine/weatherConditions-currentConditions_e.html?mapID=02&siteID=06205&stationID=46185' },
];

export interface MarinePoint {
  time?: string;
  waterTemp?: number | null;
  waveHeight?: number | null;
}

export interface MarineSource {
  source: string;
  latitude?: number;
  longitude?: number;
  currentWaterTemp?: number | null;
  currentWaveHeight?: number | null;
  hourly: MarinePoint[];
  snapDistanceKm?: number;
  tooFar?: boolean;
}

export function isFiniteMarineNumber(value: unknown): boolean {
  return Number.isFinite(Number(value));
}

export function buildMarinePayloadFromOpenMeteo(marineJson: any): MarineSource | null {
  if (!marineJson) return null;
  const hourly = (marineJson.hourly?.time || [])
    .map((time: string, index: number) => ({
      time,
      waterTemp: marineJson.hourly.sea_surface_temperature?.[index],
      waveHeight: marineJson.hourly.wave_height?.[index],
    }))
    .filter((point: MarinePoint) => isFiniteMarineNumber(point.waterTemp) || isFiniteMarineNumber(point.waveHeight));
  return {
    source: 'Open-Meteo Marine',
    latitude: marineJson.latitude,
    longitude: marineJson.longitude,
    currentWaterTemp: marineJson.current?.sea_surface_temperature,
    currentWaveHeight: marineJson.current?.wave_height,
    hourly,
  };
}

export function buildMarinePayloadFromEccc(station: EcccMarineStation, parsed: MarinePoint): MarineSource | null {
  if (!station || !parsed) return null;
  return {
    source: `ECCC buoy ${station.name}`,
    latitude: station.lat,
    longitude: station.lon,
    currentWaterTemp: parsed.waterTemp,
    currentWaveHeight: parsed.waveHeight,
    hourly: [],
  };
}

export function buildMarinePayloadFromNdbcStation(station: { id: string; lat: number; lon: number }, parsed: MarinePoint): MarineSource | null {
  if (!station || !parsed) return null;
  return {
    source: `NOAA NDBC buoy ${station.id}`,
    latitude: station.lat,
    longitude: station.lon,
    currentWaterTemp: parsed.waterTemp,
    currentWaveHeight: parsed.waveHeight,
    hourly: [],
  };
}

export function sanitizeMarineSource(
  source: MarineSource | null,
  latitude: number,
  longitude: number,
  distanceKm: (lat1: number, lon1: number, lat2: number, lon2: number) => number,
): MarineSource | null {
  if (!source) return null;
  if (isFiniteMarineNumber(source.latitude) && isFiniteMarineNumber(source.longitude)) {
    const snapDistanceKm = distanceKm(latitude, longitude, Number(source.latitude), Number(source.longitude));
    source.snapDistanceKm = snapDistanceKm;
    if (snapDistanceKm > 60) {
      source.currentWaterTemp = null;
      source.currentWaveHeight = null;
      source.hourly = [];
      source.tooFar = true;
    }
  }
  return source;
}

export function hasUsefulMarineSource(source: MarineSource | null | undefined): boolean {
  return !!(
    source &&
    (isFiniteMarineNumber(source.currentWaterTemp) ||
      isFiniteMarineNumber(source.currentWaveHeight) ||
      (source.hourly || []).some((point) => isFiniteMarineNumber(point.waterTemp) || isFiniteMarineNumber(point.waveHeight)))
  );
}

export function getNearestMarinePointFromSeries(
  series: MarinePoint[] | undefined,
  targetTime: unknown,
  parseTime: (value: unknown) => number,
): MarinePoint | null {
  if (!Array.isArray(series) || !series.length) return null;
  const targetMs = parseTime(targetTime);
  if (!Number.isFinite(targetMs)) return series[0] || null;
  let best: MarinePoint | null = null;
  let bestDiff = Infinity;
  for (const point of series) {
    const ms = parseTime(point.time);
    if (!Number.isFinite(ms)) continue;
    const diff = Math.abs(ms - targetMs);
    if (diff < bestDiff) {
      best = point;
      bestDiff = diff;
    }
  }
  return best;
}

export function getBestMarinePoint(
  marinePayload: { primary?: MarineSource; eccc?: MarineSource; noaa?: MarineSource } | null | undefined,
  targetTime: unknown,
  parseTime: (value: unknown) => number,
  firstFinite: (...values: unknown[]) => number,
): { waterTemp: number | null; waveHeight: number | null } {
  if (!marinePayload) return { waterTemp: null, waveHeight: null };
  const primaryPoint = getNearestMarinePointFromSeries(marinePayload.primary?.hourly, targetTime, parseTime);
  const ecccPoint = getNearestMarinePointFromSeries(marinePayload.eccc?.hourly, targetTime, parseTime);
  const noaaPoint = getNearestMarinePointFromSeries(marinePayload.noaa?.hourly, targetTime, parseTime);
  return {
    waterTemp: firstFinite(primaryPoint?.waterTemp, marinePayload.primary?.currentWaterTemp, ecccPoint?.waterTemp, marinePayload.eccc?.currentWaterTemp, noaaPoint?.waterTemp, marinePayload.noaa?.currentWaterTemp),
    waveHeight: firstFinite(primaryPoint?.waveHeight, marinePayload.primary?.currentWaveHeight, ecccPoint?.waveHeight, marinePayload.eccc?.currentWaveHeight, noaaPoint?.waveHeight, marinePayload.noaa?.currentWaveHeight),
  };
}

export function describeMarineSource(marinePayload: { primary?: MarineSource; eccc?: MarineSource; noaa?: MarineSource } | null | undefined): string {
  const parts = [];
  if (hasUsefulMarineSource(marinePayload?.primary)) parts.push(marinePayload?.primary?.source);
  if (hasUsefulMarineSource(marinePayload?.eccc)) parts.push(marinePayload?.eccc?.source);
  if (hasUsefulMarineSource(marinePayload?.noaa)) parts.push(marinePayload?.noaa?.source);
  return parts.length ? parts.join(' + ') : 'Marine data unavailable';
}
