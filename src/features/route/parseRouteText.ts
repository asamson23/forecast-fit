import type { RoutePoint } from '../../types/route';
import { parseGeoJsonRouteObject } from './parseGeoJson';
import { parseXmlRouteDocument } from './parseGpx';

export function parseRouteText(name: string, text: string): RoutePoint[] {
  const lower = (name || '').toLowerCase();
  const trimmed = String(text || '').trim();
  if (!trimmed) return [];

  const looksLikeXml = trimmed.startsWith('<?xml') || trimmed.startsWith('<');
  const looksLikeJson = trimmed.startsWith('{') || trimmed.startsWith('[');

  if (lower.endsWith('.gpx') || (looksLikeXml && !lower.endsWith('.geojson'))) {
    const xml = new DOMParser().parseFromString(trimmed, 'application/xml');
    const xmlPoints = parseXmlRouteDocument(xml);
    if (xmlPoints.length) return xmlPoints;
    throw new Error('No route points found in that GPX file.');
  }

  if (lower.endsWith('.geojson') || looksLikeJson) {
    try {
      const geo = JSON.parse(trimmed);
      const geoPoints = parseGeoJsonRouteObject(geo);
      if (geoPoints.length) return geoPoints;
      throw new Error('No route points found in that GeoJSON file.');
    } catch (err) {
      if (err instanceof Error && /GeoJSON file/.test(err.message)) throw err;
      throw new Error('That file is not a valid GPX or GeoJSON route.');
    }
  }

  throw new Error('Unsupported route format. Please use GPX or GeoJSON only.');
}

export async function parseRouteFile(file: File): Promise<RoutePoint[]> {
  const lower = (file?.name || '').toLowerCase();
  if (!lower.endsWith('.gpx') && !lower.endsWith('.geojson')) {
    throw new Error('Unsupported route format. Please use GPX or GeoJSON only.');
  }
  return parseRouteText(file.name, await file.text());
}
