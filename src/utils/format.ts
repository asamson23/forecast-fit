import { weatherCodeToEmoji } from '../features/weather/weatherCodes';
import { isFiniteNumber } from './math';

export function formatNumber(value: number, digits = 0): string {
  return Number.isFinite(value) ? value.toFixed(digits) : '-';
}

export function formatTemperature(value: number | null | undefined): string {
  return value === null || value === undefined || Number.isNaN(Number(value))
    ? '--'
    : `${Math.round(Number(value))}°`;
}

export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function countryFlag(code: string | null | undefined): string {
  if (!code) return '🌍';
  return code.toUpperCase().replace(/./g, c => String.fromCodePoint(0x1F1E6 - 65 + c.charCodeAt(0)));
}

export function degreesToCompass(deg: unknown): string {
  if (!isFiniteNumber(deg)) return 'Variable';
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  return dirs[Math.round((((deg % 360) + 360) % 360) / 22.5) % 16];
}

export function windDirectionHtml(deg: unknown, className = 'wind-dir-inline', showText = true): string {
  if (!isFiniteNumber(deg)) {
    return `<span class="${escapeHtml(className)}" title="Variable wind" aria-label="Variable wind"><span class="wind-dir-arrow">↻</span>${showText ? '<span>Var.</span>' : ''}</span>`;
  }
  const compass = degreesToCompass(deg);
  const safeDeg = Math.round((((deg % 360) + 360) % 360));
  const label = `Wind direction ${compass} (${safeDeg}°)`;
  return `<span class="${escapeHtml(className)}" title="${escapeHtml(label)}" aria-label="${escapeHtml(label)}"><span class="wind-dir-arrow" style="transform: rotate(${safeDeg}deg)">↑</span>${showText ? `<span>${escapeHtml(compass)}</span>` : ''}</span>`;
}

export function weatherIconHtml(code: unknown, className = 'icon'): string {
  const [emoji, desc] = weatherCodeToEmoji(code as number);
  return `<span class="${escapeHtml(className)}" role="img" aria-label="${escapeHtml(desc)}" title="${escapeHtml(desc)}">${emoji}</span>`;
}

export function formatWindTooltip(speed: unknown, gusts: unknown, dir: unknown): { speedText: string; gustText: string; dirHtml: string } {
  const speedText = isFiniteNumber(speed) ? `${Math.round(speed)} km/h` : '—';
  const gustText = isFiniteNumber(gusts) ? `${Math.round(gusts)} km/h` : '—';
  return { speedText, gustText, dirHtml: windDirectionHtml(dir, 'wind-dir-inline', true) };
}
