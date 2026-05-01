import { hasFlag } from 'country-flag-icons';
import weather01dUrl from '@bybas/weather-icons/production/fill/openweathermap/01d.svg?url';
import weather02dUrl from '@bybas/weather-icons/production/fill/openweathermap/02d.svg?url';
import weather03dUrl from '@bybas/weather-icons/production/fill/openweathermap/03d.svg?url';
import weather04dUrl from '@bybas/weather-icons/production/fill/openweathermap/04d.svg?url';
import weather09dUrl from '@bybas/weather-icons/production/fill/openweathermap/09d.svg?url';
import weather10dUrl from '@bybas/weather-icons/production/fill/openweathermap/10d.svg?url';
import weather11dUrl from '@bybas/weather-icons/production/fill/openweathermap/11d.svg?url';
import weather13dUrl from '@bybas/weather-icons/production/fill/openweathermap/13d.svg?url';
import weather50dUrl from '@bybas/weather-icons/production/fill/openweathermap/50d.svg?url';
import globeShowingAmericasUrl from 'fluentui-emoji/icons/flat/globe-showing-americas.svg?url';
import firstPlaceMedalUrl from 'fluentui-emoji/icons/flat/1st-place-medal.svg?url';
import secondPlaceMedalUrl from 'fluentui-emoji/icons/flat/2nd-place-medal.svg?url';
import thirdPlaceMedalUrl from 'fluentui-emoji/icons/flat/3rd-place-medal.svg?url';
import automobileUrl from 'fluentui-emoji/icons/flat/automobile.svg?url';
import campingUrl from 'fluentui-emoji/icons/flat/camping.svg?url';
import canoeUrl from 'fluentui-emoji/icons/flat/canoe.svg?url';
import cloudUrl from 'fluentui-emoji/icons/flat/cloud.svg?url';
import cloudWithLightningAndRainUrl from 'fluentui-emoji/icons/flat/cloud-with-lightning-and-rain.svg?url';
import cloudWithRainUrl from 'fluentui-emoji/icons/flat/cloud-with-rain.svg?url';
import cloudWithSnowUrl from 'fluentui-emoji/icons/flat/cloud-with-snow.svg?url';
import coatUrl from 'fluentui-emoji/icons/flat/coat.svg?url';
import deerUrl from 'fluentui-emoji/icons/flat/deer.svg?url';
import divingMaskUrl from 'fluentui-emoji/icons/flat/diving-mask.svg?url';
import dropletUrl from 'fluentui-emoji/icons/flat/droplet.svg?url';
import faceWithMedicalMaskUrl from 'fluentui-emoji/icons/flat/face-with-medical-mask.svg?url';
import fishingPoleUrl from 'fluentui-emoji/icons/flat/fishing-pole.svg?url';
import foggyUrl from 'fluentui-emoji/icons/flat/foggy.svg?url';
import hikingBootUrl from 'fluentui-emoji/icons/flat/hiking-boot.svg?url';
import houseUrl from 'fluentui-emoji/icons/flat/house.svg?url';
import informationUrl from 'fluentui-emoji/icons/flat/information.svg?url';
import kiteUrl from 'fluentui-emoji/icons/flat/kite.svg?url';
import labelUrl from 'fluentui-emoji/icons/flat/label.svg?url';
import personBikingUrl from 'fluentui-emoji/icons/flat/person-biking-default.svg?url';
import personLiftingWeightsUrl from 'fluentui-emoji/icons/flat/person-lifting-weights-default.svg?url';
import personRunningUrl from 'fluentui-emoji/icons/flat/person-running-default.svg?url';
import personSurfingUrl from 'fluentui-emoji/icons/flat/person-surfing-default.svg?url';
import personSwimmingUrl from 'fluentui-emoji/icons/flat/person-swimming-default.svg?url';
import personWalkingUrl from 'fluentui-emoji/icons/flat/person-walking-default.svg?url';
import skierUrl from 'fluentui-emoji/icons/flat/skier.svg?url';
import stadiumUrl from 'fluentui-emoji/icons/flat/stadium.svg?url';
import sunUrl from 'fluentui-emoji/icons/flat/sun.svg?url';
import sunBehindRainCloudUrl from 'fluentui-emoji/icons/flat/sun-behind-rain-cloud.svg?url';
import sunBehindSmallCloudUrl from 'fluentui-emoji/icons/flat/sun-behind-small-cloud.svg?url';
import sunWithFaceUrl from 'fluentui-emoji/icons/flat/sun-with-face.svg?url';
import warningUrl from 'fluentui-emoji/icons/flat/warning.svg?url';
import waterWaveUrl from 'fluentui-emoji/icons/flat/water-wave.svg?url';
import windFaceUrl from 'fluentui-emoji/icons/flat/wind-face.svg?url';
import { weatherCodeToEmoji } from '../features/weather/weatherCodes';
import { isFiniteNumber } from './math';

type IconAsset = {
  label: string;
  url: string;
};

const ICONS: Record<string, IconAsset> = {
  '☀️': { label: 'Sun', url: sunUrl },
  '☀': { label: 'Sun', url: sunUrl },
  '🌤️': { label: 'Partly cloudy', url: sunBehindSmallCloudUrl },
  '☁️': { label: 'Cloudy', url: cloudUrl },
  '🌫️': { label: 'Fog', url: foggyUrl },
  '🌦️': { label: 'Showers', url: sunBehindRainCloudUrl },
  '🌧️': { label: 'Rain', url: cloudWithRainUrl },
  '🌨️': { label: 'Snow', url: cloudWithSnowUrl },
  '⛈️': { label: 'Thunderstorm', url: cloudWithLightningAndRainUrl },
  '💨': { label: 'Wind', url: windFaceUrl },
  '😷': { label: 'Air quality', url: faceWithMedicalMaskUrl },
  '❄️': { label: 'Snow', url: cloudWithSnowUrl },
  '⚠️': { label: 'Warning', url: warningUrl },
  'ℹ️': { label: 'Information', url: informationUrl },
  '🌊': { label: 'Water', url: waterWaveUrl },
  '💦': { label: 'Water drops', url: dropletUrl },
  '🏃': { label: 'Running', url: personRunningUrl },
  '🚴': { label: 'Cycling', url: personBikingUrl },
  '🏊': { label: 'Swimming', url: personSwimmingUrl },
  '🏋️': { label: 'Gym', url: personLiftingWeightsUrl },
  '🏟️': { label: 'Indoor multisport', url: stadiumUrl },
  '🤿': { label: 'Snorkeling', url: divingMaskUrl },
  '🏄': { label: 'Surfing', url: personSurfingUrl },
  '🛶': { label: 'Kayaking', url: canoeUrl },
  '🥾': { label: 'Hiking', url: hikingBootUrl },
  '🚵': { label: 'Mountain biking', url: personBikingUrl },
  '⛷️': { label: 'Skiing', url: skierUrl },
  '🎣': { label: 'Fishing', url: fishingPoleUrl },
  '🦌': { label: 'Hunting', url: deerUrl },
  '🚶': { label: 'Walking', url: personWalkingUrl },
  '🧥': { label: 'Casual', url: coatUrl },
  '🚗': { label: 'Road trip', url: automobileUrl },
  '🏕️': { label: 'Camping', url: campingUrl },
  '🏷': { label: 'Activity', url: labelUrl },
  'ðŸ·': { label: 'Activity', url: labelUrl },
  '🏠': { label: 'Indoor', url: houseUrl },
  'ðŸ ': { label: 'Indoor', url: houseUrl },
  '🥇': { label: '1st place', url: firstPlaceMedalUrl },
  'ðŸ¥‡': { label: '1st place', url: firstPlaceMedalUrl },
  '🥈': { label: '2nd place', url: secondPlaceMedalUrl },
  'ðŸ¥ˆ': { label: '2nd place', url: secondPlaceMedalUrl },
  '🥉': { label: '3rd place', url: thirdPlaceMedalUrl },
  'ðŸ¥‰': { label: '3rd place', url: thirdPlaceMedalUrl },
  '🌍': { label: 'Globe', url: globeShowingAmericasUrl },
  'ðŸŒ': { label: 'Globe', url: globeShowingAmericasUrl },
  'ðŸŒŠ': { label: 'Water', url: waterWaveUrl },
  'ðŸ’¨': { label: 'Wind', url: windFaceUrl },
  'â˜€': { label: 'Sun', url: sunUrl },
  'âš ï¸': { label: 'Warning', url: warningUrl },
};

const ACTIVITY_ICON_BY_ACTIVITY: Record<string, string> = {
  running: '🏃',
  cycling: '🚴',
  triathlon: '🏊',
  gym: '🏋️',
  indoor_running: '🏃',
  indoor_cycling: '🚴',
  indoor_multisport: '🏟️',
  swimming_pool_indoor: '🏊',
  swimming_open: '🌊',
  swimming_pool_outdoor: '🏊',
  snorkeling: '🤿',
  sup: '🏄',
  kayaking: '🛶',
  surfing: '🌊',
  water_sports: '💦',
  hiking: '🥾',
  trail_running: '🏃',
  mtb_gravel: '🚵',
  ski_snowboard: '⛷️',
  fishing: '🎣',
  hunting: '🦌',
  walk: '🚶',
  casual: '🧥',
  road_trip: '🚗',
  camping: '🏕️',
};

const LEADING_ICON_TOKENS = Object.keys(ICONS).sort((a, b) => b.length - a.length);

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

function getIconAsset(token: string | null | undefined): IconAsset | null {
  if (!token) return null;
  return ICONS[token] ?? null;
}

function buildIconImageHtml(token: string, label?: string): string {
  const asset = getIconAsset(token);
  if (!asset) return '';
  const title = escapeHtml(label || asset.label);
  return `<img class="emoji-asset-img" src="${asset.url}" alt="" decoding="async" title="${title}">`;
}

function buildAssetImageHtml(url: string, label: string): string {
  return `<img class="emoji-asset-img" src="${url}" alt="" decoding="async" title="${escapeHtml(label)}">`;
}

export function renderSymbolIconHtml(
  token: string | null | undefined,
  className = 'icon',
  label?: string,
  decorative = false,
): string {
  const safeClassName = escapeHtml(className);
  const asset = getIconAsset(token);
  if (!asset || !token) {
    if (!token) return '';
    if (decorative) return `<span class="${safeClassName}" aria-hidden="true">${escapeHtml(token)}</span>`;
    const safeLabel = escapeHtml(label || token);
    return `<span class="${safeClassName}" role="img" aria-label="${safeLabel}" title="${safeLabel}">${escapeHtml(token)}</span>`;
  }

  const safeLabel = escapeHtml(label || asset.label);
  const semantics = decorative
    ? 'aria-hidden="true"'
    : `role="img" aria-label="${safeLabel}" title="${safeLabel}"`;
  return `<span class="${safeClassName} emoji-asset-icon" ${semantics}>${buildIconImageHtml(token, label)}</span>`;
}

function getLeadingIconToken(value: string): string | null {
  const trimmed = String(value || '').trimStart();
  for (const token of LEADING_ICON_TOKENS) {
    if (trimmed === token || trimmed.startsWith(`${token} `)) return token;
  }
  return null;
}

export function renderLeadingEmojiLabel(value: unknown, className = 'inline-symbol-icon'): string {
  const text = String(value ?? '');
  const token = getLeadingIconToken(text);
  if (!token) return escapeHtml(text);
  const rest = text.trimStart().slice(token.length).trimStart();
  const iconHtml = renderSymbolIconHtml(token, className, undefined, true);
  return rest ? `${iconHtml} ${escapeHtml(rest)}` : iconHtml;
}

function getWeatherToken(code: unknown): string {
  const value = Number(code);
  if (value === 0) return '☀️';
  if (value <= 2) return '🌤️';
  if (value === 3) return '☁️';
  if (value <= 49) return '🌫️';
  if (value <= 59) return '🌧️';
  if (value <= 69) return '🌧️';
  if (value <= 79) return '🌨️';
  if (value <= 82) return '🌦️';
  if (value <= 86) return '🌨️';
  if (value <= 99) return '⛈️';
  return '☁️';
}

function getWeatherAssetUrl(code: unknown): string {
  const value = Number(code);
  if (value === 0) return weather01dUrl;
  if (value <= 2) return weather02dUrl;
  if (value === 3) return weather04dUrl;
  if (value <= 49) return weather50dUrl;
  if (value <= 59) return weather09dUrl;
  if (value <= 69) return weather10dUrl;
  if (value <= 79) return weather13dUrl;
  if (value <= 82) return weather09dUrl;
  if (value <= 86) return weather13dUrl;
  if (value <= 99) return weather11dUrl;
  return weather03dUrl;
}

export function countryFlag(code: string | null | undefined): string {
  const safeCode = String(code || '').trim().toUpperCase();
  if (!safeCode) return renderSymbolIconHtml('🌍', 'country-flag-icon', 'Unknown country', true);
  if (!/^[A-Z]{2,3}(?:-[A-Z]{2,3})?$/.test(safeCode) || !hasFlag(safeCode)) {
    return renderSymbolIconHtml('🌍', 'country-flag-icon', safeCode, true);
  }
  return `<span class="country-flag-icon flag:${escapeHtml(safeCode)}" aria-hidden="true"></span>`;
}

export function degreesToCompass(deg: unknown): string {
  if (!isFiniteNumber(deg)) return 'Variable';
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round((((deg as number) % 360) + 360) % 360 / 22.5) % 16];
}

export function windDirectionHtml(deg: unknown, className = 'wind-dir-inline', showText = true): string {
  if (!isFiniteNumber(deg)) {
    return `<span class="${escapeHtml(className)}" title="Variable wind" aria-label="Variable wind"><span class="wind-dir-arrow">↻</span>${showText ? '<span>Var.</span>' : ''}</span>`;
  }
  const compass = degreesToCompass(deg);
  const safeDeg = Math.round((((deg as number) % 360) + 360) % 360);
  const label = `Wind direction ${compass} (${safeDeg}°)`;
  return `<span class="${escapeHtml(className)}" title="${escapeHtml(label)}" aria-label="${escapeHtml(label)}"><span class="wind-dir-arrow" style="transform: rotate(${safeDeg}deg)">↑</span>${showText ? `<span>${escapeHtml(compass)}</span>` : ''}</span>`;
}

export function weatherIconHtml(code: unknown, className = 'icon'): string {
  const [, desc] = weatherCodeToEmoji(code as number);
  return `<span class="${escapeHtml(className)} emoji-asset-icon" role="img" aria-label="${escapeHtml(desc)}" title="${escapeHtml(desc)}">${buildAssetImageHtml(getWeatherAssetUrl(code), desc)}</span>`;
}

export function formatWindTooltip(speed: unknown, gusts: unknown, dir: unknown): { speedText: string; gustText: string; dirHtml: string } {
  const speedText = isFiniteNumber(speed) ? `${Math.round(speed)} km/h` : '—';
  const gustText = isFiniteNumber(gusts) ? `${Math.round(gusts)} km/h` : '—';
  return { speedText, gustText, dirHtml: windDirectionHtml(dir, 'wind-dir-inline', true) };
}

export function replaceActivityEmojiIcons(root: ParentNode = document): void {
  const buttons = root.querySelectorAll<HTMLElement>('.activity-btn[data-activity] .icon');
  buttons.forEach(iconNode => {
    const button = iconNode.closest<HTMLElement>('.activity-btn[data-activity]');
    const activity = button?.dataset.activity || '';
    const token = ACTIVITY_ICON_BY_ACTIVITY[activity];
    if (!token) return;
    const asset = getIconAsset(token);
    if (!asset) return;
    iconNode.setAttribute('aria-hidden', 'true');
    iconNode.innerHTML = buildIconImageHtml(token, asset.label);
  });
}
