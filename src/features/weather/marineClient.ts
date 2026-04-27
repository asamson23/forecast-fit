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
