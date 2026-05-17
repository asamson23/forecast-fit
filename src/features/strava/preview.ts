type PreviewPoint = {
  lat: number;
  lon: number;
};

function decodePolylineValue(polyline: string, indexRef: { index: number }): number {
  let result = 0;
  let shift = 0;
  let byte = 0;

  do {
    byte = polyline.charCodeAt(indexRef.index++) - 63;
    result |= (byte & 0x1f) << shift;
    shift += 5;
  } while (byte >= 0x20 && indexRef.index < polyline.length + 1);

  return (result & 1) ? ~(result >> 1) : (result >> 1);
}

export function decodePolyline(polyline: string | null | undefined): PreviewPoint[] {
  const value = String(polyline || '').trim();
  if (!value) return [];

  const points: PreviewPoint[] = [];
  const state = { index: 0 };
  let lat = 0;
  let lon = 0;

  while (state.index < value.length) {
    lat += decodePolylineValue(value, state);
    lon += decodePolylineValue(value, state);
    points.push({ lat: lat / 1e5, lon: lon / 1e5 });
  }

  return points;
}

function buildPreviewPath(points: PreviewPoint[]): string {
  if (points.length < 2) return '';

  const width = 120;
  const height = 48;
  const padding = 4;
  const lats = points.map((point) => point.lat);
  const lons = points.map((point) => point.lon);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const lonSpan = Math.max(0.00001, maxLon - minLon);
  const latSpan = Math.max(0.00001, maxLat - minLat);

  return points.map((point, index) => {
    const x = padding + ((point.lon - minLon) / lonSpan) * (width - padding * 2);
    const y = padding + (1 - ((point.lat - minLat) / latSpan)) * (height - padding * 2);
    return `${index ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
}

export function buildStravaPreviewSvg(
  polyline: string | null | undefined,
  fallbackPoints: PreviewPoint[] = [],
): string {
  const points = decodePolyline(polyline);
  const sourcePoints = points.length >= 2 ? points : fallbackPoints;
  if (sourcePoints.length < 2) return '';

  const path = buildPreviewPath(sourcePoints);
  if (!path) return '';

  return `
    <svg class="strava-picker-preview-svg" viewBox="0 0 120 48" aria-hidden="true" focusable="false">
      <rect class="strava-picker-preview-bg" x="0.5" y="0.5" width="119" height="47" rx="12"></rect>
      <path class="strava-picker-preview-path" d="${path}"></path>
    </svg>
  `;
}
