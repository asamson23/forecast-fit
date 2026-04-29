import { isFiniteNumber, round1 } from '../utils/math';
import { escapeHtml, weatherIconHtml } from '../utils/format';
import { formatShortTime } from '../utils/dateTime';
import { renderUvValueBadge, renderAqiBadge } from './WarningPanel';
import { buildForecastChart } from './ForecastChart';

export interface DurationProfile {
  label: string;
  minutes: number;
  [key: string]: unknown;
}

export interface ForecastSelection {
  points: Record<string, unknown>[];
  mode?: string;
  interpolated?: boolean;
  sliceMinutes?: number;
  startTime?: unknown;
  endTime?: unknown;
}

export function renderForecastBlock(
  data: unknown,
  selection: ForecastSelection,
  profile: DurationProfile,
  activity: string | null,
  routeSamples: unknown[] = [],
): string {
  if (!selection.points.length) return '';

  if (selection.mode === 'daily') {
    const cells = selection.points.map(p => {
      const daylightH = isFiniteNumber(p.daylightDuration) ? round1((p.daylightDuration as number) / 3600) : null;
      return `
        <div class="daily-forecast-cell">
          <div class="day">${escapeHtml(p.date)}</div>
          ${weatherIconHtml(p.code, 'icon')}
          <div class="temps"><span class="forecast-metric" title="High / low temperature">${Math.round(p.tMax as number)}° / ${Math.round(p.tMin as number)}°</span><span class="feels-line forecast-metric" title="Feels-like high / low">feels ${Math.round(p.feelsMax as number)}° / ${Math.round(p.feelsMin as number)}°</span></div>
          <div class="meta"><span class="forecast-metric" title="Precipitation chance / amount">${Math.round((p.precipProbMax as number) || 0)}% · ${round1((p.precipSum as number) || 0)} mm</span>${isFiniteNumber(p.uvMax) ? `<br>${renderUvValueBadge(p.uvMax, true)}` : ''}${isFiniteNumber(p.aqiMax) ? `<br>${renderAqiBadge(p.aqiMax, true)}` : ''}<br><span class="forecast-metric" title="Sunrise / sunset">${escapeHtml(formatShortTime(p.sunrise))} · ${escapeHtml(formatShortTime(p.sunset))}</span>${daylightH != null ? `<br><span class="forecast-metric" title="Daylight duration">${daylightH} h daylight</span>` : ''}</div>
        </div>`;
    }).join('');
    return `
      <div class="forecast-box">
        <div class="forecast-header">
          <strong>Forecast over the planned duration</strong>
          <span>${escapeHtml(profile.label)} · daily overview</span>
        </div>
        <div class="forecast-scroll">
          <div class="daily-forecast-grid">${cells}</div>
        </div>
      </div>`;
  }

  const points = selection.points;
  const showEvery = points.length > 12 ? Math.max(1, Math.ceil(points.length / 10)) : 1;
  const tablePoints = points.filter((_, i) => i === 0 || i === points.length - 1 || i % showEvery === 0);
  const table = tablePoints.map(p => `
      <div class="forecast-cell">
        <div class="hour">${escapeHtml(formatShortTime(p.time))}</div>
        ${weatherIconHtml(p.code, 'icon')}
        <div class="temp"><span class="forecast-metric" title="Temperature">${Math.round(p.temp as number)}°</span><span class="feels-line forecast-metric" title="Feels like">feels ${Math.round(p.feels as number)}°</span></div>
        <div class="meta"><span class="forecast-metric" title="Wind speed">${Math.round((p.wind as number) || 0)} km/h</span><br><span class="forecast-metric" title="Precipitation amount / chance">${round1((p.precip as number) || 0)} mm · ${Math.round((p.precipProb as number) || 0)}%</span>${isFiniteNumber(p.uv) ? `<br>${renderUvValueBadge(p.uv, true)}` : ''}${isFiniteNumber(p.aqi) ? `<br>${renderAqiBadge(p.aqi, true)}` : ''}</div>
      </div>`).join('');

  const chartHtml = buildForecastChart(data, selection, routeSamples);
  const sliceLabel = selection.interpolated
    ? `${selection.sliceMinutes}-min slices`
    : (profile.minutes === 1440 ? '24-hour chart' : 'temp / feels / precip mm + %');

  return `
    <div class="forecast-box">
      <div class="forecast-header">
        <strong>Forecast over the planned duration</strong>
        <span>${escapeHtml(profile.label)} · ${sliceLabel}</span>
      </div>
      <div class="forecast-scroll">
        <div>
          ${chartHtml}
          <div class="forecast-table">${table}</div>
        </div>
      </div>
    </div>`;
}
