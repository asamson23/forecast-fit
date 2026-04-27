import type { RoutePoint } from '../../types/route';
import { normalizeRoutePoints } from './parseGeoJson';

export function parseXmlRouteDocument(xml: Document): RoutePoint[] {
  const points = Array.from(xml.querySelectorAll('trkpt, rtept')).map((node) => ({
    lat: Number(node.getAttribute('lat')),
    lon: Number(node.getAttribute('lon')),
    ele: Number(node.querySelector('ele')?.textContent),
    time: node.querySelector('time')?.textContent?.trim() || null,
  }));
  return normalizeRoutePoints(points);
}

export function parseGpx(xmlText: string): RoutePoint[] {
  return parseXmlRouteDocument(new DOMParser().parseFromString(xmlText, 'application/xml'));
}
