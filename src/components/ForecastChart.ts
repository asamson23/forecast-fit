import { getAqiInfo } from '../data/aqiScale';
import { isFiniteNumber, round1 } from '../utils/math';
import { escapeHtml, windDirectionHtml } from '../utils/format';
import { parseAnyTime, formatShortTime, formatShortDateTime, formatHumanDate } from '../utils/dateTime';
import { renderAqiBadge, formatUvValue } from './WarningPanel';

let chartTooltipGlobalDismissBound = false;

export function buildForecastChart(data: unknown, selection: unknown, routeSamples: unknown[] = []): string {
  const sel = selection as {
    points: Record<string, unknown>[];
    startTime: unknown;
    endTime: unknown;
    highlightStartTime?: unknown;
    highlightEndTime?: unknown;
    mode?: string;
  } | null;
  const d = data as { daily?: Record<string, unknown>[] } | null;
  const points = sel?.points || [];
  if (!points.length) return '';
  if (sel?.mode === 'daily') return buildDailyForecastChart(points);

  const width = 760;
  const height = 210;
  const pad = { top: 20, right: 42, bottom: 34, left: 30 };
  const tempValues = points.flatMap(p => [p.temp, p.feels]).filter(isFiniteNumber);
  const precipValues = points.map(p => isFiniteNumber(p.precip) ? p.precip as number : 0);
  const minTemp = Math.floor(Math.min(...tempValues) - 1);
  const maxTemp = Math.ceil(Math.max(...tempValues) + 1);
  const maxPrecip = Math.max(0.5, Math.ceil(Math.max(...precipValues, 0) * 2) / 2);
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const stepX = points.length > 1 ? innerW / (points.length - 1) : 0;
  const xForIndex = (i: number) => pad.left + stepX * i;
  const yForTemp = (v: number) => pad.top + ((maxTemp - v) / Math.max(1, maxTemp - minTemp)) * innerH;
  const yForPrecip = (v: number) => pad.top + ((maxPrecip - Math.max(0, Math.min(maxPrecip, v || 0))) / Math.max(0.1, maxPrecip)) * innerH;
  const linePath = (key: string, yFn: (v: number) => number) =>
    points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xForIndex(i).toFixed(1)} ${yFn(p[key] as number).toFixed(1)}`).join(' ');
  const tempGrid = [minTemp, Math.round((minTemp + maxTemp) / 2), maxTemp];
  const precipGrid = [0, round1(maxPrecip / 2), maxPrecip];
  const labelEvery = points.length > 14 ? Math.ceil(points.length / 8) : 1;
  const startMs = parseAnyTime(sel?.startTime);
  const endMs = parseAnyTime(sel?.endTime);
  const markerLines: string[] = [];
  const highlightStartMs = parseAnyTime(sel?.highlightStartTime);
  const highlightEndMs = parseAnyTime(sel?.highlightEndTime);
  const hasEventHighlight = Number.isFinite(highlightStartMs) && Number.isFinite(highlightEndMs) && highlightEndMs > highlightStartMs;
  const eventHighlight = hasEventHighlight
    ? (() => {
        const startRatio = startMs === endMs ? 0 : Math.max(0, Math.min(1, (highlightStartMs - startMs) / Math.max(1, endMs - startMs)));
        const endRatio = startMs === endMs ? 1 : Math.max(0, Math.min(1, (highlightEndMs - startMs) / Math.max(1, endMs - startMs)));
        const x = pad.left + startRatio * innerW;
        const widthPx = Math.max(4, (endRatio - startRatio) * innerW);
        return `
          <rect x="${x.toFixed(1)}" y="${pad.top}" width="${widthPx.toFixed(1)}" height="${innerH}" class="chart-event-highlight"></rect>
          <text x="${(x + (widthPx / 2)).toFixed(1)}" y="${height - pad.bottom - 8}" text-anchor="middle" class="chart-event-label">event</text>
        `;
      })()
    : '';

  for (const day of d?.daily || []) {
    for (const marker of [
      { key: 'sunrise', label: 'sunrise', cls: 'chart-sun-line' },
      { key: 'sunset', label: 'sunset', cls: 'chart-sunset-line' },
    ]) {
      if (!day[marker.key]) continue;
      const ms = parseAnyTime(day[marker.key]);
      if (!Number.isFinite(ms) || ms < startMs || ms > endMs) continue;
      const ratio = startMs === endMs ? 0 : (ms - startMs) / Math.max(1, endMs - startMs);
      const x = pad.left + ratio * innerW;
      markerLines.push(`
        <line x1="${x.toFixed(1)}" y1="${pad.top}" x2="${x.toFixed(1)}" y2="${height - pad.bottom}" class="${marker.cls}"></line>
        <text x="${x.toFixed(1)}" y="${pad.top - 6}" text-anchor="middle" class="chart-marker-label">${marker.label === 'sunrise' ? '↑' : '↓'}</text>
      `);
    }
  }

  const checkpointMarkers = (routeSamples || [])
    .filter((cp: any) => cp.eta)
    .map((cp: any) => {
      const ms = parseAnyTime(cp.eta);
      if (!Number.isFinite(ms) || ms < startMs || ms > endMs) return '';
      const ratio = startMs === endMs ? 0 : (ms - startMs) / Math.max(1, endMs - startMs);
      const x = pad.left + ratio * innerW;
      const label = escapeHtml(cp.markerShort || '•');
      const title = escapeHtml(`${cp.label} · ${formatShortTime(cp.eta)}`);
      return `
        <g>
          <line x1="${x.toFixed(1)}" y1="${pad.top}" x2="${x.toFixed(1)}" y2="${height - pad.bottom}" class="chart-checkpoint-line"></line>
          <circle cx="${x.toFixed(1)}" cy="${height - pad.bottom}" r="3.4" class="chart-checkpoint-dot"></circle>
          <text x="${x.toFixed(1)}" y="${pad.top + 10}" text-anchor="middle" class="chart-checkpoint-label">${label}</text>
          <title>${title}</title>
        </g>`;
    }).join('');

  const hitRects = points.map((p, i) => {
    const prevMid = i === 0 ? pad.left : (xForIndex(i - 1) + xForIndex(i)) / 2;
    const nextMid = i === points.length - 1 ? width - pad.right : (xForIndex(i) + xForIndex(i + 1)) / 2;
    const aqiInfo = isFiniteNumber(p.aqi) ? getAqiInfo(p.aqi as number) : null;
    return `<rect x="${prevMid.toFixed(1)}" y="${pad.top}" width="${Math.max(8, nextMid - prevMid).toFixed(1)}" height="${innerH}" class="chart-hit" data-chart-hit` +
      ` data-time="${escapeHtml(formatShortDateTime(p.time))}"` +
      ` data-temp="${escapeHtml(round1(p.temp as number))}"` +
      ` data-feels="${escapeHtml(round1(p.feels as number))}"` +
      ` data-precip="${escapeHtml(round1((p.precip as number) || 0))}"` +
      ` data-precip-prob="${escapeHtml(Math.round((p.precipProb as number) || 0))}"` +
      ` data-wind="${escapeHtml(Math.round((p.wind as number) || 0))}"` +
      ` data-wind-gust="${isFiniteNumber(p.gusts) ? escapeHtml(Math.round(p.gusts as number)) : ''}"` +
      ` data-wind-dir="${isFiniteNumber(p.windDir) ? escapeHtml(Math.round(p.windDir as number)) : ''}"` +
      ` data-uv="${isFiniteNumber(p.uv) ? escapeHtml(formatUvValue(p.uv)) : ''}"` +
      ` data-uv-value="${isFiniteNumber(p.uv) ? escapeHtml(p.uv) : ''}"` +
      ` data-aqi="${aqiInfo ? escapeHtml(String(aqiInfo.value)) : ''}"` +
      ` data-aqi-category="${aqiInfo ? escapeHtml(aqiInfo.category) : ''}"` +
      ` data-humidity="${isFiniteNumber(p.humidity) ? escapeHtml(Math.round(p.humidity as number)) : ''}"></rect>`;
  }).join('');

  const hasCheckpoints = (routeSamples || []).some((cp: any) => cp.eta);

  return `
    <div class="chart-wrap" data-chart-wrap>
      <svg viewBox="0 0 ${width} ${height}" class="forecast-chart" aria-label="Forecast chart">
        <g class="chart-grid">
          ${tempGrid.map(v => `<line x1="${pad.left}" y1="${yForTemp(v).toFixed(1)}" x2="${width - pad.right}" y2="${yForTemp(v).toFixed(1)}"></line>`).join('')}
          ${minTemp <= 0 && maxTemp >= 0 ? `<line x1="${pad.left}" y1="${yForTemp(0).toFixed(1)}" x2="${width - pad.right}" y2="${yForTemp(0).toFixed(1)}" class="chart-zero-line"></line>` : ''}
        </g>
        <g>${eventHighlight}</g>
        <g>${markerLines.join('')}</g>
        <g>${checkpointMarkers}</g>
        <g class="chart-axis">
          ${tempGrid.map(v => `<text x="4" y="${(yForTemp(v) + 4).toFixed(1)}">${Math.round(v)}°</text>`).join('')}
          ${minTemp <= 0 && maxTemp >= 0 && !tempGrid.includes(0) ? `<text x="4" y="${(yForTemp(0) + 4).toFixed(1)}">0°</text>` : ''}
          ${precipGrid.map(v => `<text x="${width - pad.right + 8}" y="${(yForPrecip(v) + 4).toFixed(1)}">${escapeHtml(round1(v))} mm</text>`).join('')}
          ${points.map((p, i) => {
            const show = i === 0 || i === points.length - 1 || i % labelEvery === 0;
            return show ? `<text x="${xForIndex(i).toFixed(1)}" y="${height - 8}" text-anchor="middle">${escapeHtml(formatShortTime(p.time))}</text>` : '';
          }).join('')}
        </g>
        <path d="${linePath('temp', yForTemp)}" class="chart-line-temp"></path>
        <path d="${linePath('feels', yForTemp)}" class="chart-line-feels"></path>
        <path d="${linePath('precip', yForPrecip)}" class="chart-line-precip"></path>
        ${points.map((p, i) => `<circle cx="${xForIndex(i).toFixed(1)}" cy="${yForTemp(p.temp as number).toFixed(1)}" r="3.4" class="chart-dot-temp"></circle>`).join('')}
        ${points.map((p, i) => `<circle cx="${xForIndex(i).toFixed(1)}" cy="${yForTemp(p.feels as number).toFixed(1)}" r="3.1" class="chart-dot-feels"></circle>`).join('')}
        ${points.map((p, i) => `<circle cx="${xForIndex(i).toFixed(1)}" cy="${yForPrecip(p.precip as number).toFixed(1)}" r="2.9" class="chart-dot-precip"></circle>`).join('')}
        ${hitRects}
      </svg>
      <div class="chart-tooltip" data-chart-tooltip></div>
    </div>
    <div class="chart-legend">
      <span class="temp"><i></i> Temp</span>
      <span class="feels"><i></i> Feels like</span>
      <span class="precip"><i></i> Precip mm + chance %</span>
      <span class="sunrise"><i></i> Sunrise</span>
      <span class="sunset"><i></i> Sunset</span>
      ${hasEventHighlight ? `<span class="event"><i></i> Main event</span>` : ''}
      ${hasCheckpoints ? `<span class="checkpoints"><i></i> Route checkpoints</span>` : ''}
    </div>`;
}


const MAX_DAILY_CHART_POINTS = 10;

function sampleChartPoints<T>(points: T[], maxPoints: number): T[] {
  if (points.length <= maxPoints) return points;
  if (maxPoints <= 2) return [points[0], points[points.length - 1]];

  const lastIndex = points.length - 1;
  const sampledIndexes = new Set<number>([0, lastIndex]);
  const slots = maxPoints - 1;
  for (let i = 1; i < slots; i += 1) {
    sampledIndexes.add(Math.round((lastIndex * i) / slots));
  }

  return Array.from(sampledIndexes)
    .sort((a, b) => a - b)
    .map(i => points[i]);
}

function valueForRange(values: unknown[]): number[] {
  return values.filter(isFiniteNumber) as number[];
}

function buildPath(points: Record<string, unknown>[], xForIndex: (i: number) => number, key: string, yFn: (v: number) => number): string {
  let path = '';
  points.forEach((p, i) => {
    if (!isFiniteNumber(p[key])) return;
    path += `${path ? ' L' : 'M'} ${xForIndex(i).toFixed(1)} ${yFn(p[key] as number).toFixed(1)}`;
  });
  return path;
}

function formatDailyRange(max: unknown, min: unknown): string {
  if (!isFiniteNumber(max) || !isFiniteNumber(min)) return '—';
  return `${round1(max)}° / ${round1(min)}°`;
}

function buildDailyForecastChart(rawPoints: Record<string, unknown>[]): string {
  const points = sampleChartPoints(rawPoints, MAX_DAILY_CHART_POINTS);
  const width = 760;
  const height = 210;
  const pad = { top: 20, right: 42, bottom: 34, left: 30 };
  const tempValues = valueForRange(points.flatMap(p => [p.tMax, p.tMin, p.feelsMax, p.feelsMin]));
  if (!tempValues.length) return '';
  const precipValues = points.map(p => isFiniteNumber(p.precipSum) ? p.precipSum as number : 0);
  const minTemp = Math.floor(Math.min(...tempValues) - 1);
  const maxTemp = Math.ceil(Math.max(...tempValues) + 1);
  const maxPrecip = Math.max(0.5, Math.ceil(Math.max(...precipValues, 0) * 2) / 2);
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const stepX = points.length > 1 ? innerW / (points.length - 1) : 0;
  const xForIndex = (i: number) => pad.left + stepX * i;
  const yForTemp = (v: number) => pad.top + ((maxTemp - v) / Math.max(1, maxTemp - minTemp)) * innerH;
  const yForPrecip = (v: number) => pad.top + ((maxPrecip - Math.max(0, Math.min(maxPrecip, v || 0))) / Math.max(0.1, maxPrecip)) * innerH;
  const tempGrid = [minTemp, Math.round((minTemp + maxTemp) / 2), maxTemp];
  const precipGrid = [0, round1(maxPrecip / 2), maxPrecip];
  const labelEvery = points.length > 8 ? Math.ceil(points.length / 6) : 1;
  const dailyRangeLines = points.map((p, i) => {
    if (!isFiniteNumber(p.tMax) || !isFiniteNumber(p.tMin)) return '';
    const x = xForIndex(i).toFixed(1);
    return `<line x1="${x}" y1="${yForTemp(p.tMax as number).toFixed(1)}" x2="${x}" y2="${yForTemp(p.tMin as number).toFixed(1)}" class="chart-range-temp"></line>`;
  }).join('');
  const feelsRangeLines = points.map((p, i) => {
    if (!isFiniteNumber(p.feelsMax) || !isFiniteNumber(p.feelsMin)) return '';
    const x = xForIndex(i).toFixed(1);
    return `<line x1="${x}" y1="${yForTemp(p.feelsMax as number).toFixed(1)}" x2="${x}" y2="${yForTemp(p.feelsMin as number).toFixed(1)}" class="chart-range-feels"></line>`;
  }).join('');
  const hitRects = points.map((p, i) => {
    const prevMid = i === 0 ? pad.left : (xForIndex(i - 1) + xForIndex(i)) / 2;
    const nextMid = i === points.length - 1 ? width - pad.right : (xForIndex(i) + xForIndex(i + 1)) / 2;
    const aqiInfo = isFiniteNumber(p.aqiMax) ? getAqiInfo(p.aqiMax as number) : null;
    return `<rect x="${prevMid.toFixed(1)}" y="${pad.top}" width="${Math.max(8, nextMid - prevMid).toFixed(1)}" height="${innerH}" class="chart-hit" data-chart-hit` +
      ` data-time="${escapeHtml(formatHumanDate(p.date))}"` +
      ` data-temp-label="Temp range"` +
      ` data-temp="${escapeHtml(formatDailyRange(p.tMax, p.tMin))}"` +
      ` data-feels-label="Feels-like range"` +
      ` data-feels="${escapeHtml(formatDailyRange(p.feelsMax, p.feelsMin))}"` +
      ` data-precip="${escapeHtml(round1((p.precipSum as number) || 0))}"` +
      ` data-precip-prob="${escapeHtml(Math.round((p.precipProbMax as number) || 0))}"` +
      ` data-uv-value="${isFiniteNumber(p.uvMax) ? escapeHtml(p.uvMax) : ''}"` +
      ` data-aqi="${aqiInfo ? escapeHtml(String(aqiInfo.value)) : ''}"` +
      ` data-aqi-category="${aqiInfo ? escapeHtml(aqiInfo.category) : ''}"></rect>`;
  }).join('');

  return `
    <div class="chart-wrap" data-chart-wrap>
      <svg viewBox="0 0 ${width} ${height}" class="forecast-chart" aria-label="Daily forecast chart">
        <g class="chart-grid">
          ${tempGrid.map(v => `<line x1="${pad.left}" y1="${yForTemp(v).toFixed(1)}" x2="${width - pad.right}" y2="${yForTemp(v).toFixed(1)}"></line>`).join('')}
          ${minTemp <= 0 && maxTemp >= 0 ? `<line x1="${pad.left}" y1="${yForTemp(0).toFixed(1)}" x2="${width - pad.right}" y2="${yForTemp(0).toFixed(1)}" class="chart-zero-line"></line>` : ''}
        </g>
        <g class="chart-axis">
          ${tempGrid.map(v => `<text x="4" y="${(yForTemp(v) + 4).toFixed(1)}">${Math.round(v)}°</text>`).join('')}
          ${minTemp <= 0 && maxTemp >= 0 && !tempGrid.includes(0) ? `<text x="4" y="${(yForTemp(0) + 4).toFixed(1)}">0°</text>` : ''}
          ${precipGrid.map(v => `<text x="${width - pad.right + 8}" y="${(yForPrecip(v) + 4).toFixed(1)}">${escapeHtml(round1(v))} mm</text>`).join('')}
          ${points.map((p, i) => {
            const show = i === 0 || i === points.length - 1 || i % labelEvery === 0;
            return show ? `<text x="${xForIndex(i).toFixed(1)}" y="${height - 8}" text-anchor="middle">${escapeHtml(formatHumanDate(p.date))}</text>` : '';
          }).join('')}
        </g>
        <g>${feelsRangeLines}${dailyRangeLines}</g>
        <path d="${buildPath(points, xForIndex, 'tMax', yForTemp)}" class="chart-line-temp chart-line-temp-high"></path>
        <path d="${buildPath(points, xForIndex, 'tMin', yForTemp)}" class="chart-line-temp chart-line-temp-low"></path>
        <path d="${buildPath(points, xForIndex, 'feelsMax', yForTemp)}" class="chart-line-feels chart-line-feels-high"></path>
        <path d="${buildPath(points, xForIndex, 'feelsMin', yForTemp)}" class="chart-line-feels chart-line-feels-low"></path>
        <path d="${buildPath(points, xForIndex, 'precipSum', yForPrecip)}" class="chart-line-precip"></path>
        ${points.map((p, i) => isFiniteNumber(p.tMax) ? `<circle cx="${xForIndex(i).toFixed(1)}" cy="${yForTemp(p.tMax as number).toFixed(1)}" r="3.4" class="chart-dot-temp"></circle>` : '').join('')}
        ${points.map((p, i) => isFiniteNumber(p.tMin) ? `<circle cx="${xForIndex(i).toFixed(1)}" cy="${yForTemp(p.tMin as number).toFixed(1)}" r="2.8" class="chart-dot-temp chart-dot-temp-low"></circle>` : '').join('')}
        ${points.map((p, i) => isFiniteNumber(p.feelsMax) ? `<circle cx="${xForIndex(i).toFixed(1)}" cy="${yForTemp(p.feelsMax as number).toFixed(1)}" r="3.1" class="chart-dot-feels"></circle>` : '').join('')}
        ${points.map((p, i) => isFiniteNumber(p.feelsMin) ? `<circle cx="${xForIndex(i).toFixed(1)}" cy="${yForTemp(p.feelsMin as number).toFixed(1)}" r="2.6" class="chart-dot-feels chart-dot-feels-low"></circle>` : '').join('')}
        ${points.map((p, i) => `<circle cx="${xForIndex(i).toFixed(1)}" cy="${yForPrecip(p.precipSum as number).toFixed(1)}" r="2.9" class="chart-dot-precip"></circle>`).join('')}
        ${hitRects}
      </svg>
      <div class="chart-tooltip" data-chart-tooltip></div>
    </div>
    <div class="chart-legend">
      <span class="temp"><i></i> Temp high / low</span>
      <span class="feels"><i></i> Feels high / low</span>
      <span class="precip"><i></i> Precip total + chance %</span>
    </div>`;
}

export function getForecastChartTooltipPortal(): HTMLElement {
  let tooltip = document.getElementById('chart-tooltip-portal');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'chart-tooltip-portal';
    tooltip.className = 'chart-tooltip chart-tooltip-portal';
    tooltip.setAttribute('role', 'tooltip');
    document.body.appendChild(tooltip);
  }
  return tooltip;
}

export function bindForecastChartTooltips(root: Element = document.body): void {
  const tooltip = getForecastChartTooltipPortal();

  const positionTooltip = (event: { clientX?: number; clientY?: number }) => {
    const margin = 12;
    const gap = 14;
    const width = tooltip.offsetWidth || 210;
    const height = tooltip.offsetHeight || 150;
    const clientX = Number.isFinite(event.clientX) ? event.clientX! : window.innerWidth / 2;
    const clientY = Number.isFinite(event.clientY) ? event.clientY! : window.innerHeight / 2;
    let x = clientX + gap;
    let y = clientY - height - gap;
    if (x + width > window.innerWidth - margin) x = clientX - width - gap;
    if (y < margin) y = clientY + gap;
    x = Math.max(margin, Math.min(window.innerWidth - width - margin, x));
    y = Math.max(margin, Math.min(window.innerHeight - height - margin, y));
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
  };

  const show = (hit: HTMLElement, event: { clientX?: number; clientY?: number }) => {
    const tempLabel = hit.dataset.tempLabel || 'Temp';
    const tempText = hit.dataset.tempLabel ? hit.dataset.temp || '—' : `${hit.dataset.temp}°C`;
    const feelsLabel = hit.dataset.feelsLabel || 'Feels like';
    const feelsText = hit.dataset.feelsLabel ? hit.dataset.feels || '—' : `${hit.dataset.feels}°C`;
    const precipChance = hit.dataset.precipProb ? `${hit.dataset.precipProb}%` : '—';
    const windRows = hit.dataset.wind
      ? (() => {
          const gustText = hit.dataset.windGust ? `${hit.dataset.windGust} km/h` : '—';
          const dirHtml = hit.dataset.windDir
            ? windDirectionHtml(Number(hit.dataset.windDir), 'wind-dir-inline', true)
            : windDirectionHtml(NaN, 'wind-dir-inline', true);
          return `
            <div class="tt-row"><span>Wind</span><strong>${hit.dataset.wind} km/h ${dirHtml}</strong></div>
            <div class="tt-row"><span>Gusts</span><strong>${gustText}</strong></div>`;
        })()
      : '';
    tooltip.innerHTML = `
      <div class="tt-time">${hit.dataset.time}</div>
      <div class="tt-row"><span>${escapeHtml(tempLabel)}</span><strong>${escapeHtml(tempText)}</strong></div>
      <div class="tt-row"><span>${escapeHtml(feelsLabel)}</span><strong>${escapeHtml(feelsText)}</strong></div>
      ${hit.dataset.humidity ? `<div class="tt-row"><span>Humidity</span><strong>${escapeHtml(hit.dataset.humidity)}%</strong></div>` : ''}
      <div class="tt-row"><span>Precip amount</span><strong>${hit.dataset.precip} mm</strong></div>
      <div class="tt-row"><span>Precip chance</span><strong>${precipChance}</strong></div>
      ${windRows}
      <div class="tt-row"><span>UV</span><strong>${hit.dataset.uvValue ? `UV ${escapeHtml(formatUvValue(Number(hit.dataset.uvValue)))}` : '—'}</strong></div>
      ${hit.dataset.aqi ? `<div class="tt-row"><span>AQI</span><strong>${renderAqiBadge(Number(hit.dataset.aqi), true)}</strong></div>` : ''}`;
    tooltip.classList.add('visible');
    positionTooltip(event);
  };

  const hide = () => tooltip.classList.remove('visible');

  root.querySelectorAll('[data-chart-hit]').forEach(el => {
    const hit = el as HTMLElement;
    if (hit.dataset.chartTooltipBound === '1') return;
    hit.dataset.chartTooltipBound = '1';

    hit.addEventListener('mouseenter', event => show(hit, event as MouseEvent));
    hit.addEventListener('mousemove', event => show(hit, event as MouseEvent));
    hit.addEventListener('mouseleave', hide);
    hit.addEventListener('touchstart', event => {
      const touch = (event as TouchEvent).touches[0];
      if (touch) show(hit, touch);
    }, { passive: true });
    hit.addEventListener('touchmove', event => {
      const touch = (event as TouchEvent).touches[0];
      if (touch) positionTooltip(touch);
    }, { passive: true });
    hit.addEventListener('touchend', hide, { passive: true });
    hit.addEventListener('touchcancel', hide, { passive: true });
  });

  root.querySelectorAll('[data-chart-wrap]').forEach(el => {
    const wrap = el as HTMLElement;
    if (wrap.dataset.chartWrapDismissBound === '1') return;
    wrap.dataset.chartWrapDismissBound = '1';
    wrap.addEventListener('mouseleave', hide);
  });

  if (!chartTooltipGlobalDismissBound) {
    chartTooltipGlobalDismissBound = true;
    window.addEventListener('scroll', hide, { passive: true });
    window.addEventListener('resize', hide, { passive: true });
  }
}
