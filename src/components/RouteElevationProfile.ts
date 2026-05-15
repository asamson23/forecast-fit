import type { EnrichedRoutePoint } from '../features/route/routeMetrics';
import type { RoutePoint } from '../types/route';
import { formatShortTime } from '../utils/dateTime';
import { escapeHtml, renderSymbolIconHtml } from '../utils/format';

export type RouteElevationProfilePoint = Pick<RoutePoint, 'ele'> & Partial<Pick<EnrichedRoutePoint, 'kmFromStart'>>;
export interface RouteElevationRenderablePoint {
  index: number;
  lat: number | undefined;
  lon: number | undefined;
  km: number;
  ele: number;
}
export interface RouteElevationCheckpoint {
  pointIndex?: number;
  kmFromStart?: number;
  eta?: string;
  lat?: number;
  lon?: number;
  label?: string;
  markerKind?: string;
  markerTone?: string;
  markerShort?: string;
}

const CHART_WIDTH = 720;
const CHART_HEIGHT = 180;
const PAD_LEFT = 52;
const PAD_RIGHT = 20;
const PAD_TOP = 22;
const PAD_BOTTOM = 38;

export const ROUTE_ELEVATION_PROFILE_METRICS = {
  chartWidth: CHART_WIDTH,
  chartHeight: CHART_HEIGHT,
  padLeft: PAD_LEFT,
  padRight: PAD_RIGHT,
  padTop: PAD_TOP,
  padBottom: PAD_BOTTOM,
};

function isFiniteRouteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function formatKm(value: number): string {
  return value >= 10 ? `${Math.round(value)} km` : `${Math.round(value * 10) / 10} km`;
}

function buildDistanceMarkers(totalKm: number): number[] {
  if (!Number.isFinite(totalKm) || totalKm <= 0) return [0];
  const markerCount = totalKm < 8 ? 4 : 5;
  const markers = Array.from({ length: markerCount + 1 }, (_, index) => (totalKm * index) / markerCount);
  return markers.filter((value, index) => index === 0 || value - markers[index - 1] > 0.05);
}

function getPointKm(point: RouteElevationProfilePoint, fallbackIndex: number, totalFallbackPoints: number): number {
  if (isFiniteRouteNumber(point.kmFromStart)) return point.kmFromStart;
  const denominator = Math.max(1, totalFallbackPoints - 1);
  return fallbackIndex / denominator;
}

export function getRouteElevationRenderablePoints(points: Array<RouteElevationProfilePoint & Partial<RoutePoint>>): RouteElevationRenderablePoint[] {
  return points
    .map((point, index) => ({
      index,
      km: getPointKm(point, index, points.length),
      ele: isFiniteRouteNumber(point.ele) ? point.ele : null,
      lat: typeof point.lat === 'number' ? point.lat : undefined,
      lon: typeof point.lon === 'number' ? point.lon : undefined,
    }))
    .filter((point): point is RouteElevationRenderablePoint => isFiniteRouteNumber(point.km) && isFiniteRouteNumber(point.ele));
}

function buildElevationCheckpointMarkerHtml(cp: RouteElevationCheckpoint, x: number, y: number): string {
  const kind = cp?.markerKind || (cp?.label === 'Start' ? 'start' : (cp?.label === 'Finish' ? 'finish' : 'mid'));
  const toneClass = cp?.markerTone ? ` ${escapeHtml(cp.markerTone)}` : '';
  const shortLabel = cp?.markerShort || (kind === 'start' ? 'S' : (kind === 'finish' ? 'F' : '*'));
  const markerInner = kind === 'event'
    ? renderSymbolIconHtml(shortLabel, 'checkpoint-marker-icon', cp?.label || shortLabel, true)
    : escapeHtml(shortLabel);
  const title = escapeHtml(`${cp?.label || 'Route checkpoint'} - ${formatShortTime(cp?.eta)}`);

  return `
    <foreignObject x="${(x - 11).toFixed(1)}" y="${(y - 11).toFixed(1)}" width="22" height="22" class="route-elevation-checkpoint-fo">
      <div xmlns="http://www.w3.org/1999/xhtml" class="route-elevation-checkpoint-fo-box">
        <button
          type="button"
          class="route-elevation-checkpoint-button"
          data-route-elevation-jump="checkpoint"
          data-route-elevation-time-value="${escapeHtml(String(cp?.eta || ''))}"
          data-route-elevation-lat="${escapeHtml(String(cp?.lat ?? ''))}"
          data-route-elevation-lon="${escapeHtml(String(cp?.lon ?? ''))}"
          data-route-elevation-label="${escapeHtml(String(cp?.label || 'Route checkpoint'))}"
          title="${title}"
          aria-label="${title}">
          <span class="checkpoint-marker ${escapeHtml(kind)}${toneClass}">${markerInner}</span>
        </button>
      </div>
    </foreignObject>`;
}

export function renderRouteElevationProfile(points: RouteElevationProfilePoint[], routeSamples: RouteElevationCheckpoint[] = []): string {
  const elevationPoints = getRouteElevationRenderablePoints(points);

  if (elevationPoints.length < 2) return '';

  const totalKm = Math.max(...elevationPoints.map((point) => point.km), 0);
  const elevations = elevationPoints.map((point) => point.ele);
  const minEle = Math.min(...elevations);
  const maxEle = Math.max(...elevations);
  const eleRange = Math.max(1, maxEle - minEle);
  const paddedMinEle = minEle - eleRange * 0.08;
  const paddedMaxEle = maxEle + eleRange * 0.08;
  const paddedRange = Math.max(1, paddedMaxEle - paddedMinEle);
  const plotWidth = CHART_WIDTH - PAD_LEFT - PAD_RIGHT;
  const plotHeight = CHART_HEIGHT - PAD_TOP - PAD_BOTTOM;
  const xForKm = (km: number) => PAD_LEFT + (totalKm > 0 ? (km / totalKm) * plotWidth : 0);
  const yForEle = (ele: number) => PAD_TOP + ((paddedMaxEle - ele) / paddedRange) * plotHeight;
  const linePath = elevationPoints
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${xForKm(point.km).toFixed(1)} ${yForEle(point.ele).toFixed(1)}`)
    .join(' ');
  const areaPath = `${linePath} L ${xForKm(elevationPoints[elevationPoints.length - 1].km).toFixed(1)} ${PAD_TOP + plotHeight} L ${xForKm(elevationPoints[0].km).toFixed(1)} ${PAD_TOP + plotHeight} Z`;
  const minPoint = elevationPoints.reduce((lowest, point) => (point.ele < lowest.ele ? point : lowest), elevationPoints[0]);
  const maxPoint = elevationPoints.reduce((highest, point) => (point.ele > highest.ele ? point : highest), elevationPoints[0]);
  const distanceMarkers = buildDistanceMarkers(totalKm);
  const minLabel = `${Math.round(minEle)} m min`;
  const maxLabel = `${Math.round(maxEle)} m max`;
  const checkpointMarkers = (routeSamples || [])
    .map((cp) => {
      const markerKm = isFiniteRouteNumber(cp?.kmFromStart) ? Number(cp.kmFromStart) : null;
      if (!isFiniteRouteNumber(markerKm) || markerKm < 0 || markerKm > totalKm) return '';
      const sampleIndex = elevationPoints.reduce((bestIndex, point, index, list) => {
        const bestPoint = list[bestIndex];
        return Math.abs(point.km - markerKm) < Math.abs(bestPoint.km - markerKm) ? index : bestIndex;
      }, 0);
      const samplePoint = elevationPoints[sampleIndex];
      return buildElevationCheckpointMarkerHtml(cp, xForKm(markerKm), yForEle(samplePoint.ele));
    })
    .filter(Boolean)
    .join('');

  return `
    <svg class="route-elevation-svg" data-route-elevation-chart viewBox="0 0 ${CHART_WIDTH} ${CHART_HEIGHT}" role="img" aria-label="Route elevation profile from 0 to ${formatKm(totalKm)}, ${minLabel}, ${maxLabel}" preserveAspectRatio="none">
      <defs>
        <linearGradient id="route-elevation-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="currentColor" stop-opacity="0.24" />
          <stop offset="100%" stop-color="currentColor" stop-opacity="0.04" />
        </linearGradient>
      </defs>
      <rect class="route-elevation-bg" x="0" y="0" width="${CHART_WIDTH}" height="${CHART_HEIGHT}" rx="14" />
      <line class="route-elevation-axis" x1="${PAD_LEFT}" x2="${CHART_WIDTH - PAD_RIGHT}" y1="${PAD_TOP + plotHeight}" y2="${PAD_TOP + plotHeight}" />
      <line class="route-elevation-axis" x1="${PAD_LEFT}" x2="${PAD_LEFT}" y1="${PAD_TOP}" y2="${PAD_TOP + plotHeight}" />
      ${distanceMarkers.map((km) => {
        const x = xForKm(km);
        return `<g class="route-elevation-marker"><line x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${PAD_TOP}" y2="${PAD_TOP + plotHeight}" /><text x="${x.toFixed(1)}" y="${CHART_HEIGHT - 13}" text-anchor="middle">${formatKm(km)}</text></g>`;
      }).join('')}
      <path class="route-elevation-area" d="${areaPath}" />
      <path class="route-elevation-line" d="${linePath}" />
      <g class="route-elevation-checkpoints">${checkpointMarkers}</g>
      <g class="route-elevation-extreme route-elevation-max">
        <circle cx="${xForKm(maxPoint.km).toFixed(1)}" cy="${yForEle(maxPoint.ele).toFixed(1)}" r="3.8" />
        <text x="${Math.min(CHART_WIDTH - 72, Math.max(PAD_LEFT + 42, xForKm(maxPoint.km))).toFixed(1)}" y="${Math.max(PAD_TOP + 12, yForEle(maxPoint.ele) - 8).toFixed(1)}" text-anchor="middle">${maxLabel}</text>
      </g>
      <g class="route-elevation-extreme route-elevation-min">
        <circle cx="${xForKm(minPoint.km).toFixed(1)}" cy="${yForEle(minPoint.ele).toFixed(1)}" r="3.8" />
        <text x="${Math.min(CHART_WIDTH - 70, Math.max(PAD_LEFT + 40, xForKm(minPoint.km))).toFixed(1)}" y="${Math.min(CHART_HEIGHT - PAD_BOTTOM - 8, yForEle(minPoint.ele) + 18).toFixed(1)}" text-anchor="middle">${minLabel}</text>
      </g>
      <text class="route-elevation-y-label" x="14" y="${PAD_TOP + 12}">${Math.round(maxEle)} m</text>
      <text class="route-elevation-y-label" x="14" y="${PAD_TOP + plotHeight}">${Math.round(minEle)} m</text>
      <g class="route-elevation-hover" data-route-elevation-hover hidden>
        <line class="route-elevation-hover-line" data-route-elevation-hover-line x1="${PAD_LEFT}" x2="${PAD_LEFT}" y1="${PAD_TOP}" y2="${PAD_TOP + plotHeight}" />
        <circle class="route-elevation-hover-dot" data-route-elevation-hover-dot cx="${PAD_LEFT}" cy="${PAD_TOP + plotHeight}" r="4.5" />
      </g>
    </svg>
  `;
}
