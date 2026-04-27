import type { RoutePoint } from '../../types/route';

function flattenCoordinates(coordinates: unknown): number[][] {
  if (!Array.isArray(coordinates)) return [];
  if (typeof coordinates[0] === 'number') return [coordinates as number[]];
  return coordinates.flatMap(flattenCoordinates);
}

export function parseGeoJsonRouteObject(geoJson: unknown): RoutePoint[] {
  const root = geoJson as { type?: string; features?: unknown[]; geometry?: { coordinates?: unknown } };
  const geometries =
    root.type === 'FeatureCollection'
      ? (root.features || []).map((feature) => (feature as { geometry?: { coordinates?: unknown } }).geometry)
      : [root.geometry || root];

  return geometries
    .flatMap((geometry) => flattenCoordinates((geometry as { coordinates?: unknown })?.coordinates))
    .filter((coord) => coord.length >= 2)
    .map(([lon, lat, ele]) => ({ lat, lon, ele: ele ?? null }));
}
