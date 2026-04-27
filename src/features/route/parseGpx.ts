import type { RoutePoint } from '../../types/route';

export function parseGpx(xmlText: string): RoutePoint[] {
  const doc = new DOMParser().parseFromString(xmlText, 'application/xml');
  const nodes = Array.from(doc.querySelectorAll('trkpt, rtept'));
  return nodes.map((node) => ({
    lat: Number(node.getAttribute('lat')),
    lon: Number(node.getAttribute('lon')),
    ele: node.querySelector('ele')?.textContent ? Number(node.querySelector('ele')?.textContent) : null,
    time: node.querySelector('time')?.textContent || null,
  })).filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lon));
}
