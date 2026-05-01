export const GEO_API = 'https://geocoding-api.open-meteo.com/v1/search';
export const NOMINATIM_SEARCH_API = 'https://nominatim.openstreetmap.org/search';
export const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';
export const MARINE_API = 'https://marine-api.open-meteo.com/v1/marine';
export const ECCC_ALERTS_API = 'https://api.weather.gc.ca/collections/weather-alerts/items';
export const AIR_QUALITY_API = 'https://air-quality-api.open-meteo.com/v1/air-quality';
export const LOCATION_PRIORITY_COUNTRY_CODES = [
  'CA', 'US', 'MX',
  'AD', 'AT', 'BE', 'CH', 'DE', 'DK', 'ES', 'FI', 'FR', 'GB', 'IE', 'IS', 'IT', 'LI', 'LU', 'MC', 'NL', 'NO', 'PT', 'SE',
];
export const NORTH_AMERICA_COUNTRY_CODES = ['CA', 'US', 'MX'];
export const WESTERN_EUROPE_COUNTRY_CODES = [
  'AD', 'AT', 'BE', 'CH', 'DE', 'DK', 'ES', 'FI', 'FR', 'GB', 'IE', 'IS', 'IT', 'LI', 'LU', 'MC', 'NL', 'NO', 'PT', 'SE',
];
const DEFAULT_STRAVA_BACKEND_URL = 'https://forecast-fit-zeta.vercel.app';
const configuredAppBackendUrl = import.meta.env.VITE_APP_BACKEND_URL?.trim() || import.meta.env.VITE_STRAVA_BACKEND_URL?.trim();
const isGithubPagesHost = typeof window !== 'undefined' && window.location.hostname.endsWith('.github.io');

const normalizeAppBackendUrl = (url: string | undefined) => {
  if (!url) return null;
  if (url.includes('forecast-fit-zeta.vercel.app')) return DEFAULT_STRAVA_BACKEND_URL;
  return url;
};

export const APP_BACKEND_URL = normalizeAppBackendUrl(configuredAppBackendUrl)
  ?? (isGithubPagesHost ? DEFAULT_STRAVA_BACKEND_URL : window.location.origin);
export const STRAVA_BACKEND_URL = APP_BACKEND_URL;
export const NOAA_NDBC_ACTIVE_XML = `${APP_BACKEND_URL}/api/noaa/activestations`;
export const NOAA_NDBC_REALTIME_BASE = `${APP_BACKEND_URL}/api/noaa/realtime2`;
