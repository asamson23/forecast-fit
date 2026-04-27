import { getAqiInfo } from '../data/aqiScale';
import { getUvCategory } from '../data/uvScale';
import { dedupeAlerts, isProbablyCanadaPoint, shouldUseEcccAlertsForWeatherData } from '../features/weather/warnings';
import { escapeHtml } from '../utils/format';
import { firstFinite, isFiniteNumber, round1 } from '../utils/math';

// ---------------------------------------------------------------------------
// Weather-code helpers (needed by summarizePlannedConditions)
// ---------------------------------------------------------------------------

export function isWet(code: unknown, precip: unknown): boolean {
  return (Number(precip) ?? 0) > 0 || [51,53,55,56,57,61,63,65,66,67,80,81,82,95,96,99].includes(Number(code));
}

export function isSnowy(code: unknown): boolean {
  return [71,73,75,77,85,86].includes(Number(code));
}

// ---------------------------------------------------------------------------
// Planned-conditions summarizer (pure — used by warning generators below)
// ---------------------------------------------------------------------------

export interface PlannedConditions {
  points: unknown[];
  minFeels: number | null;
  maxWind: number;
  maxGust: number;
  maxUv: number;
  maxAqi: number | null;
  maxPrecip: number;
  maxPrecipProb: number;
  anyWet: boolean;
  anySnow: boolean;
  precipitationWindowNote: string;
}

export function summarizePlannedConditions(selection: unknown, fallbackPoint: unknown): PlannedConditions {
  const sel = selection as { points?: unknown[] } | null;
  const fp = fallbackPoint as Record<string, unknown> | null;
  const points: Record<string, unknown>[] = (Array.isArray(sel?.points) && sel!.points!.length ? sel!.points! : [fp].filter(Boolean)) as Record<string, unknown>[];
  const feelsValues = points.map(p => firstFinite(p?.feels as number, p?.temp as number)).filter(isFiniteNumber);
  const maxWind = points.reduce((max, p) => Math.max(max, firstFinite(p?.wind as number, 0)!), 0);
  const maxGust = points.reduce((max, p) => Math.max(max, firstFinite(p?.gusts as number, p?.wind as number, 0)!), 0);
  const maxUv = points.reduce((max, p) => Math.max(max, firstFinite(p?.uv as number, 0)!), 0);
  const maxAqiRaw = points.reduce((max, p) => isFiniteNumber(p?.aqi) ? Math.max(max, p.aqi as number) : max, -Infinity);
  const maxPrecip = points.reduce((max, p) => Math.max(max, firstFinite(p?.precip as number, 0)!), 0);
  const maxPrecipProb = points.reduce((max, p) => Math.max(max, firstFinite(p?.precipProb as number, 0)!), 0);
  return {
    points,
    minFeels: feelsValues.length ? Math.min(...feelsValues) : firstFinite(fp?.feels as number, fp?.temp as number),
    maxWind,
    maxGust,
    maxUv,
    maxAqi: isFiniteNumber(maxAqiRaw) && maxAqiRaw >= 0 ? maxAqiRaw : null,
    maxPrecip,
    maxPrecipProb,
    anyWet: points.some(p => isWet(p?.code, p?.precip) || firstFinite(p?.precipProb as number, 0)! >= 35),
    anySnow: points.some(p => isSnowy(p?.code)),
    precipitationWindowNote: maxPrecip > 0
      ? `up to ${round1(maxPrecip)} mm during the planned window`
      : maxPrecipProb >= 35 ? `up to ${Math.round(maxPrecipProb)}% precip risk during the planned window` : '',
  };
}

// ---------------------------------------------------------------------------
// UV / AQI badge rendering
// ---------------------------------------------------------------------------

export interface UvRiskInfo {
  value: number;
  label: string;
  icon: string;
  tone: string;
  className: string;
  colour: string;
}

export function getUvRiskInfo(value: unknown): UvRiskInfo | null {
  const uv = firstFinite(value as number, null as unknown as number);
  if (!isFiniteNumber(uv)) return null;
  const category = getUvCategory(uv);
  const byCategory: Record<string, { tone: string; className: string; colour: string }> = {
    Extreme:    { tone: 'severe', className: 'extreme',    colour: 'purple' },
    'Very high': { tone: 'severe', className: 'very-high',  colour: 'red' },
    High:       { tone: 'warn',   className: 'high',       colour: 'orange' },
    Moderate:   { tone: '',       className: 'moderate',   colour: 'yellow' },
    Low:        { tone: 'ok',     className: 'low',        colour: 'green' },
  };
  return { value: uv, label: category, icon: '☀️', ...(byCategory[category] ?? { tone: '', className: 'low', colour: 'green' }) };
}

export function formatUvValue(value: unknown): string {
  const uv = firstFinite(value as number, null as unknown as number);
  return isFiniteNumber(uv) ? String(round1(uv)) : '—';
}

export function renderUvBadge(value: unknown, compact = false): string {
  const info = getUvRiskInfo(value);
  if (!info) return '';
  return `<span class="uv-badge uv-${escapeHtml(info.className)}${compact ? ' compact' : ''}">UV ${escapeHtml(formatUvValue(info.value))} · ${escapeHtml(info.label)}</span>`;
}

export function renderAqiBadge(value: unknown, compact = false): string {
  const info = getAqiInfo(value as number);
  if (!info) return '';
  return `<span class="aqi-badge aqi-${escapeHtml(info.className)}${compact ? ' compact' : ''}">AQI ${escapeHtml(String(info.value))}${compact ? '' : ` · ${escapeHtml(info.category)}`}</span>`;
}

export function renderUvRatingBadge(value: unknown, compact = false): string {
  const info = getUvRiskInfo(value);
  if (!info) return '';
  return `<span class="uv-badge uv-${escapeHtml(info.className)}${compact ? ' compact' : ''}">UV ${escapeHtml(info.label)}</span>`;
}

export function renderUvValueBadge(value: unknown, compact = false): string {
  const info = getUvRiskInfo(value);
  if (!info) return '';
  return `<span class="uv-badge uv-${escapeHtml(info.className)}${compact ? ' compact' : ''}">UV ${escapeHtml(formatUvValue(info.value))}</span>`;
}

// ---------------------------------------------------------------------------
// Warning generators
// ---------------------------------------------------------------------------

export interface WeatherWarning {
  level: string;
  icon: string;
  title: string;
  detail: string;
}

export function getEcccAlertWarningsForData(data: unknown): WeatherWarning[] {
  const d = data as { ecccAlerts?: WeatherWarning[] } | null;
  return dedupeAlerts(d?.ecccAlerts || []) as WeatherWarning[];
}

export function getEcccAlertWarningsForRoute(samples: unknown[]): WeatherWarning[] {
  return dedupeAlerts((samples || []).flatMap((cp: any) => cp.ecccAlerts || [])) as WeatherWarning[];
}

export function getAqiHazardWarning(selection: unknown, point: unknown): WeatherWarning | null {
  const planned = summarizePlannedConditions(selection, point);
  const p = point as { aqi?: number } | null;
  const maxAqi = firstFinite(planned.maxAqi as number, p?.aqi as number, null as unknown as number);
  const info = getAqiInfo(maxAqi as number);
  if (!info || info.value < 100) return null;
  if (info.value >= 201) {
    return { level: 'purple', icon: '😷', title: `${info.category} air quality`, detail: `Peak AQI around ${info.value}. Avoid prolonged outdoor exertion. N95/KN95 mask recommended if going out.` };
  }
  if (info.value >= 151) {
    return { level: 'red', icon: '😷', title: 'Unhealthy air quality', detail: `Peak AQI around ${info.value}. Everyone may experience health effects. Reduce prolonged outdoor effort and consider a mask.` };
  }
  return { level: 'orange', icon: '😷', title: 'Unhealthy for Sensitive Groups', detail: `Peak AQI around ${info.value}. Sensitive individuals (asthma, heart/lung conditions) should reduce prolonged outdoor exertion.` };
}

export function getUvHazardWarning(data: unknown, selection: unknown, point: unknown, activity: string | null, routeSamples: unknown[] = []): WeatherWarning | null {
  const indoorActivities = ['gym', 'indoor_running', 'indoor_cycling', 'indoor_multisport', 'swimming_pool_indoor'];
  if (activity && indoorActivities.includes(activity)) return null;
  const planned = summarizePlannedConditions(selection, point);
  const p = point as { uv?: number } | null;
  const ready = (routeSamples || []).filter((cp: any) => cp.weather);
  const routeUvValues = ready.map((cp: any) => firstFinite(cp.windowWeather?.maxUv, cp.weather?.uv)).filter(isFiniteNumber) as number[];
  const maxUv = Math.max(firstFinite(planned.maxUv, p?.uv as number, 0)!, routeUvValues.length ? Math.max(...routeUvValues) : 0);
  const info = getUvRiskInfo(maxUv);
  if (!info || info.value < 6) return null;
  if (info.value >= 8) {
    return { level: info.className === 'extreme' ? 'purple' : 'red', icon: '☀️', title: `${info.label} UV exposure`, detail: `Peak UV around ${formatUvValue(maxUv)}. Follow ECCC sun-safety guidance: avoid the strongest sun around 11:00–15:00 when possible, seek shade, wear sunglasses, use sunscreen, and cover skin.` };
  }
  return { level: 'orange', icon: '☀️', title: 'High UV exposure', detail: `Peak UV around ${formatUvValue(maxUv)}. ECCC guidance says protection is required: reduce midday exposure, seek shade, cover up, wear sunglasses, and use sunscreen.` };
}

export function getRouteUvHazardWarning(samples: unknown[], activity: string | null): WeatherWarning | null {
  const indoorActivities = ['gym', 'indoor_running', 'indoor_cycling', 'indoor_multisport', 'swimming_pool_indoor'];
  const ready = (samples || []).filter((cp: any) => cp.weather);
  if (!ready.length || (activity && indoorActivities.includes(activity))) return null;
  const maxUv = Math.max(...ready.map((cp: any) => firstFinite(cp.windowWeather?.maxUv, cp.weather?.uv, 0)!));
  const info = getUvRiskInfo(maxUv);
  if (!info || info.value < 6) return null;
  return {
    level: info.value >= 8 ? (info.className === 'extreme' ? 'purple' : 'red') : 'orange',
    icon: '☀️',
    title: `Route checkpoint ${info.label.toLowerCase()} UV`,
    detail: `Peak checkpoint UV is around ${formatUvValue(maxUv)}. Let sun protection influence the kit choice.`,
  };
}

export function getForecastHazardWarnings(data: unknown, selection: unknown, point: unknown, activity: string | null, routeSamples: unknown[] = []): WeatherWarning[] {
  const planned = summarizePlannedConditions(selection, point);
  const ready = (routeSamples || []).filter((cp: any) => cp.weather);
  const routeMaxGust = ready.map((cp: any) => firstFinite(cp.windowWeather?.maxGust, cp.weather?.gusts)).filter(isFiniteNumber) as number[];
  const routeMaxWind = ready.map((cp: any) => firstFinite(cp.windowWeather?.maxWind, cp.weather?.wind)).filter(isFiniteNumber) as number[];
  const routeMaxPrecipProb = ready.map((cp: any) => firstFinite(cp.windowWeather?.maxPrecipProb, cp.weather?.precipProb)).filter(isFiniteNumber) as number[];
  const routeMaxPrecip = ready.map((cp: any) => firstFinite(cp.windowWeather?.maxPrecip, cp.weather?.precip)).filter(isFiniteNumber) as number[];
  const sel = selection as { points?: { code?: number }[] } | null;
  const fp = point as { code?: number } | null;
  const forecastPoints = Array.isArray(sel?.points) && sel!.points!.length ? sel!.points! : [fp].filter(Boolean);
  const maxGust = Math.max(firstFinite(planned.maxGust, 0)!, routeMaxGust.length ? Math.max(...routeMaxGust) : 0);
  const maxWind = Math.max(firstFinite(planned.maxWind, 0)!, routeMaxWind.length ? Math.max(...routeMaxWind) : 0);
  const maxPrecipProb = Math.max(firstFinite(planned.maxPrecipProb, 0)!, routeMaxPrecipProb.length ? Math.max(...routeMaxPrecipProb) : 0);
  const maxPrecip = Math.max(firstFinite(planned.maxPrecip, 0)!, routeMaxPrecip.length ? Math.max(...routeMaxPrecip) : 0);
  const codes = [...forecastPoints.map((p: any) => firstFinite(p?.code, -1)!), ...ready.map((cp: any) => firstFinite(cp.weather?.code, -1)!)];
  const warnings: WeatherWarning[] = [];
  if (codes.some(code => [95, 96, 99].includes(code))) {
    warnings.push({ level: 'severe', icon: '⛈️', title: 'Thunderstorm risk in the planned window', detail: 'Consider changing the timing or route rather than trying to solve this with clothing.' });
  }
  if (maxGust >= 55 || maxWind >= 40) {
    warnings.push({ level: 'severe', icon: '💨', title: 'Strong wind / gust warning', detail: `Peak gusts around ${Math.round(maxGust)} km/h. Exposed cycling, paddling, swimming, and trail sections deserve extra caution.` });
  } else if (maxGust >= 38) {
    warnings.push({ level: 'warn', icon: '💨', title: 'Gusty conditions', detail: `Gusts may reach about ${Math.round(maxGust)} km/h. Secure loose layers and expect colder-feeling exposed sections.` });
  }
  if (maxPrecipProb >= 75 || maxPrecip >= 3) {
    warnings.push({ level: 'warn', icon: '🌧️', title: 'High precipitation risk', detail: `Rain risk peaks near ${Math.round(maxPrecipProb)}%${maxPrecip > 0 ? ` with up to ${round1(maxPrecip)} mm in a slice` : ''}. Waterproofing, traction, and dry backup layers matter.` });
  }
  if (codes.some(code => isSnowy(code))) {
    warnings.push({ level: 'warn', icon: '❄️', title: 'Snow / mixed winter precipitation possible', detail: 'Prioritize traction, visibility, hands, and a warmer backup layer.' });
  }
  return warnings;
}

export function getRouteCheckpointHazardWarnings(samples: unknown[]): WeatherWarning[] {
  const ready = (samples || []).filter((cp: any) => cp.weather);
  if (!ready.length) return [];
  const maxGust = Math.max(...ready.map((cp: any) => firstFinite(cp.windowWeather?.maxGust, cp.weather?.gusts, cp.weather?.wind, 0)!));
  const maxWind = Math.max(...ready.map((cp: any) => firstFinite(cp.windowWeather?.maxWind, cp.weather?.wind, 0)!));
  const maxPrecipProb = Math.max(...ready.map((cp: any) => firstFinite(cp.windowWeather?.maxPrecipProb, cp.weather?.precipProb, 0)!));
  const maxPrecip = Math.max(...ready.map((cp: any) => firstFinite(cp.windowWeather?.maxPrecip, cp.weather?.precip, 0)!));
  const hasStorm = ready.some((cp: any) => [95, 96, 99].includes(firstFinite(cp.weather?.code, -1)!));
  const warnings: WeatherWarning[] = [];
  if (hasStorm) warnings.push({ level: 'severe', icon: '⛈️', title: 'Route checkpoint thunderstorm risk', detail: 'One or more checkpoints look stormy. Consider changing the route or timing.' });
  if (maxGust >= 55 || maxWind >= 40) warnings.push({ level: 'severe', icon: '💨', title: 'Route checkpoint wind warning', detail: `A checkpoint may see gusts near ${Math.round(maxGust)} km/h.` });
  else if (maxGust >= 38) warnings.push({ level: 'warn', icon: '💨', title: 'Route checkpoint gusts', detail: `Peak checkpoint gusts may reach about ${Math.round(maxGust)} km/h.` });
  if (maxPrecipProb >= 75 || maxPrecip >= 3) warnings.push({ level: 'warn', icon: '🌧️', title: 'Route checkpoint precipitation risk', detail: `Checkpoint precip risk peaks near ${Math.round(maxPrecipProb)}%${maxPrecip > 0 ? ` with up to ${round1(maxPrecip)} mm in a slice` : ''}.` });
  return warnings;
}

// ---------------------------------------------------------------------------
// Warning renderers
// ---------------------------------------------------------------------------

export function renderGenericWarningList(warnings: WeatherWarning[], note: string, ariaLabel = 'Weather warnings'): string {
  if (!warnings.length) return '';
  return `
    <div class="forecast-warning-list" role="note" aria-label="${escapeHtml(ariaLabel)}">
      ${warnings.slice(0, 5).map(w => `
        <div class="forecast-warning-item ${escapeHtml(w.level === 'severe' ? 'severe' : (w.level || ''))}">
          <span class="forecast-warning-icon" aria-hidden="true">${escapeHtml(w.icon)}</span>
          <span class="forecast-warning-copy"><strong>${escapeHtml(w.title)}</strong><span>${escapeHtml(w.detail)}</span></span>
        </div>`).join('')}
      ${note ? `<div class="forecast-warning-note">${escapeHtml(note)}</div>` : ''}
    </div>`;
}

export function renderWeatherHazardWarnings(data: unknown, selection: unknown, point: unknown, activity: string | null, routeSamples: unknown[] = []): string {
  const useEccc = shouldUseEcccAlertsForWeatherData(data);
  const uvWarning = getUvHazardWarning(data, selection, point, activity, routeSamples);
  const d = data as { ecccAlertStatus?: string } | null;
  let warnings: WeatherWarning[] = [];
  let note = '';
  if (useEccc && d?.ecccAlertStatus === 'ok') {
    warnings = getEcccAlertWarningsForData(data);
    note = warnings.length
      ? 'Official Environment Canada weather alerts for this Canadian location. UV guidance follows ECCC / Health Canada UV categories.'
      : 'No active official Environment Canada weather alerts found for this Canadian location. UV guidance follows ECCC / Health Canada UV categories.';
  } else if (useEccc && d?.ecccAlertStatus === 'error') {
    warnings = getForecastHazardWarnings(data, selection, point, activity, routeSamples);
    note = 'Environment Canada alert lookup failed, so this panel is using forecast-derived warnings as a fallback. UV guidance follows ECCC / Health Canada UV categories.';
  } else {
    warnings = getForecastHazardWarnings(data, selection, point, activity, routeSamples);
    note = 'Forecast-derived warnings for non-Canadian locations. UV guidance follows ECCC / Health Canada UV categories.';
  }
  if (uvWarning) warnings.push(uvWarning);
  const aqiWarning = getAqiHazardWarning(selection, point);
  if (aqiWarning) warnings.push(aqiWarning);
  if (!warnings.length && !(useEccc && d?.ecccAlertStatus === 'ok')) return '';
  return renderGenericWarningList(warnings, note, 'Weather warnings');
}

export function renderRouteCheckpointHazardWarnings(samples: unknown[], data: unknown, activity: string | null): string {
  const useEccc = shouldUseEcccAlertsForWeatherData(data);
  const routeTouchesCanada = useEccc || (samples || []).some((cp: any) => isProbablyCanadaPoint(cp.lat, cp.lon));
  const uvWarning = getRouteUvHazardWarning(samples, activity);
  let warnings: WeatherWarning[] = [];
  let note = '';
  if (routeTouchesCanada) {
    warnings = getEcccAlertWarningsForRoute(samples);
    const anyError = (samples || []).some((cp: any) => cp.ecccAlertStatus === 'error');
    if (anyError && !warnings.length) {
      warnings = getRouteCheckpointHazardWarnings(samples);
      note = 'Environment Canada route alert lookup failed for at least one checkpoint, so this panel is using forecast-derived warnings as a fallback.';
    } else {
      note = warnings.length
        ? 'Official Environment Canada weather alerts matched at one or more Canadian route checkpoints.'
        : 'No active official Environment Canada weather alerts matched the Canadian route checkpoints.';
    }
  } else {
    warnings = getRouteCheckpointHazardWarnings(samples);
    note = 'Route checkpoint warnings are forecast-derived for non-Canadian locations.';
  }
  if (uvWarning) warnings.push(uvWarning);
  if (!warnings.length && !routeTouchesCanada) return '';
  return renderGenericWarningList(warnings, note, 'Route checkpoint warnings');
}
