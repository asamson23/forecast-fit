import type { RoutePoint } from '../../types/route';

function isFiniteRouteNumber(value: unknown): boolean {
  return Number.isFinite(Number(value));
}

export function normalizeRoutePoints(points: RoutePoint[]): RoutePoint[] {
  const cleaned: RoutePoint[] = [];
  for (const point of points) {
    if (!isFiniteRouteNumber(point.lat) || !isFiniteRouteNumber(point.lon)) continue;
    const nextPoint = {
      lat: point.lat,
      lon: point.lon,
      ele: isFiniteRouteNumber(point.ele) ? Number(point.ele) : null,
      time: point.time || null,
    };
    const last = cleaned[cleaned.length - 1];
    if (!last || last.lat !== nextPoint.lat || last.lon !== nextPoint.lon) cleaned.push(nextPoint);
  }
  return cleaned;
}

export function parseGeoJsonRouteObject(geoJson: unknown): RoutePoint[] {
  const points: RoutePoint[] = [];

  function walkGeometry(geometry: any, properties: any = {}) {
    if (!geometry) return;
    const coordTimes = properties.coordTimes || properties.times || properties.timestamps || null;

    if (geometry.type === 'LineString') {
      geometry.coordinates.forEach((coord: unknown[], index: number) => {
        points.push({
          lon: Number(coord[0]),
          lat: Number(coord[1]),
          ele: isFiniteRouteNumber(coord[2]) ? Number(coord[2]) : null,
          time: Array.isArray(coordTimes) ? coordTimes[index] || null : null,
        });
      });
    } else if (geometry.type === 'MultiLineString') {
      geometry.coordinates.forEach((line: unknown[][], lineIndex: number) => {
        const nestedTimes = Array.isArray(coordTimes?.[lineIndex]) ? coordTimes[lineIndex] : null;
        line.forEach((coord, index) => {
          points.push({
            lon: Number(coord[0]),
            lat: Number(coord[1]),
            ele: isFiniteRouteNumber(coord[2]) ? Number(coord[2]) : null,
            time: nestedTimes?.[index] || null,
          });
        });
      });
    } else if (geometry.type === 'Feature') {
      walkGeometry(geometry.geometry, geometry.properties || {});
    } else if (geometry.type === 'FeatureCollection') {
      geometry.features.forEach((feature: unknown) => {
        const typedFeature = feature as { geometry?: unknown; properties?: unknown };
        walkGeometry(typedFeature.geometry, typedFeature.properties || {});
      });
    }
  }

  walkGeometry(geoJson);
  return normalizeRoutePoints(points);
}
