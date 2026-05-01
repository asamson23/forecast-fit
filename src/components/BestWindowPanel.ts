import { getTimelineTickConfig, TimelineTickConfig } from '../features/best-window/timelineTicks';
import { waterExposureActivities } from '../features/gear/waterRules';
import { clamp, firstFinite, isFiniteNumber, round1 } from '../utils/math';
import { escapeHtml, renderSymbolIconHtml } from '../utils/format';
import {
  ceilDateToStep,
  formatDateOnlyLocal,
  formatDateTimeLocal,
  formatShortTime,
  formatWeekdayTime,
  parseAnyTime,
  parseLocalString,
} from '../utils/dateTime';

// ---------------------------------------------------------------------------
// Duration formatting (used only by formatBestWindowOverrunWarning)
// ---------------------------------------------------------------------------

function formatDurationDisplay(minutes: number): string {
  const mins = Math.max(0, Math.round(minutes || 0));
  if (mins < 60) return `${mins} min`;
  if (mins < 1440) {
    const hours = Math.floor(mins / 60);
    const rem = mins % 60;
    return rem ? `${hours} h ${rem} min` : `${hours} h`;
  }
  const days = mins / 1440;
  return Number.isInteger(days) ? `${days} day${days === 1 ? '' : 's'}` : `${round1(days)} days`;
}

// ---------------------------------------------------------------------------
// Span / tick helpers
// ---------------------------------------------------------------------------

export function formatBestWindowSpan(startStr: unknown, endStr: unknown): string {
  const start = parseLocalString(startStr as string);
  const end = parseLocalString(endStr as string);
  if (!start || !end) return `${startStr}–${endStr}`;
  const sameDay = formatDateOnlyLocal(start) === formatDateOnlyLocal(end);
  if (sameDay) return `${formatWeekdayTime(startStr)}–${formatShortTime(endStr)}`;
  return `${formatWeekdayTime(startStr)}–${formatWeekdayTime(endStr)}`;
}

export function getBestWindowTimelineTickConfig(totalMinutes: number): TimelineTickConfig {
  return getTimelineTickConfig(totalMinutes);
}

export function formatBestWindowTimelineTickLabel(
  dateOrStr: Date | string,
  tickInfo: TimelineTickConfig | number,
  multiDay: boolean,
  tickType: string = 'major',
): string {
  const d = typeof dateOrStr === 'string' ? parseLocalString(dateOrStr) : new Date(dateOrStr.getTime());
  if (!d) return '';
  const tickMinutes = typeof tickInfo === 'object' ? firstFinite(tickInfo.major, 60)! : firstFinite(tickInfo as number, 60)!;
  const weekday = d.toLocaleDateString([], { weekday: 'short' });
  const dateLabel = d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  if (tickType === 'date') return dateLabel;
  if (tickMinutes >= 1440) return weekday;
  if (multiDay || tickMinutes >= 720) return `${weekday} ${time}`;
  return time;
}

export function getBestWindowTimelineDayBoundaryTicks(startMs: number, endMs: number): Date[] {
  const ticks: Date[] = [];
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs <= startMs) return ticks;
  const cursor = new Date(startMs);
  cursor.setHours(24, 0, 0, 0);
  while (cursor.getTime() < endMs) {
    ticks.push(new Date(cursor.getTime()));
    cursor.setDate(cursor.getDate() + 1);
  }
  return ticks;
}

// ---------------------------------------------------------------------------
// Rank helpers
// ---------------------------------------------------------------------------

export function getBestWindowRankClass(index: number): string {
  return index < 3 ? `rank-${index + 1}` : 'rank-runner';
}

export function getBestWindowRankEmoji(index: number): string {
  return ['🥇', '🥈', '🥉'][index] || '';
}

export function getBestWindowPresetLabel(priority: string): string {
  return ({
    best_overall: 'Best overall',
    driest: 'Driest',
    calmest: 'Calmest',
    warmest: 'Warmest',
    fastest: 'Fastest conditions',
    safest: 'Safest',
  } as Record<string, string>)[priority] || 'Best overall';
}

export function getBestWindowRankLabel(index: number, priority: string): string {
  const suffix = index === 0 ? getBestWindowPresetLabel(priority) : (index < 3 ? 'Podium pick' : 'Runner-up');
  return `#${index + 1} ${suffix}`;
}

// ---------------------------------------------------------------------------
// Activity helpers
// ---------------------------------------------------------------------------

function getBestWindowActivityName(activity: string | null | undefined): string {
  return ({
    running: 'running',
    cycling: 'cycling',
    triathlon: 'triathlon',
    swimming_open: 'open-water swim',
    swimming_pool: 'pool swim',
    swimming_pool_indoor: 'indoor pool swim',
    swimming_pool_outdoor: 'outdoor pool swim',
    sup: 'paddleboarding',
    surfing: 'surfing',
    kayaking: 'kayaking',
    snorkeling: 'snorkeling',
    water_sports: 'water sports',
    fishing: 'fishing',
    hunting: 'hunting',
    camping: 'camping',
    road_trip: 'road trip',
    casual: 'casual use',
  } as Record<string, string>)[activity || ''] || 'this activity';
}

export function getBestWindowComfortBand(activity: string | null | undefined): { low: number; high: number } {
  if (activity === 'cycling') return { low: 7, high: 20 };
  if (activity === 'running') return { low: 4, high: 18 };
  if (activity === 'triathlon') return { low: 7, high: 21 };
  if (waterExposureActivities.has(activity as any)) return { low: 10, high: 24 };
  if (activity === 'swimming_pool' || activity === 'swimming_pool_indoor' || activity === 'swimming_pool_outdoor') return { low: 14, high: 28 };
  if (activity === 'fishing' || activity === 'hunting') return { low: 6, high: 18 };
  if (activity === 'camping') return { low: 8, high: 22 };
  if (activity === 'road_trip') return { low: 10, high: 25 };
  return { low: 10, high: 23 };
}

export function getBestWindowPrioritySummary(priority: string, activity: string | null): string {
  if (priority === 'driest') return 'Biases strongly toward the driest full activity window.';
  if (priority === 'calmest') return 'Biases toward lower wind and lower gusts.';
  if (priority === 'warmest') return 'Biases toward warmer, more comfortable conditions.';
  if (priority === 'fastest') return activity === 'cycling' || activity === 'running'
    ? 'Biases toward quicker-feeling conditions: lower wind penalties, lower gusts, and lower rain risk.'
    : 'Biases toward smoother, easier-moving conditions for the chosen activity.';
  if (priority === 'safest') return 'Biases toward lower risk: less rain, lower gusts, better daylight, and fewer nasty surprises.';
  if (activity === 'triathlon') return 'Best overall stays available for training or self-directed sessions; race starts are usually fixed.';
  return `Best overall quietly adapts to ${getBestWindowActivityName(activity)}.`;
}

// ---------------------------------------------------------------------------
// Scoring helpers
// ---------------------------------------------------------------------------

function isBestWindowWaterExposureActivity(activity: string | null | undefined): boolean {
  return waterExposureActivities.has(activity as any);
}

function isBestWindowOutdoorUvRelevantActivity(activity: string | null | undefined): boolean {
  if (!activity) return true;
  return !['gym', 'indoor_running', 'indoor_cycling', 'indoor_multisport', 'swimming_pool_indoor'].includes(activity);
}

function getBestWindowWeights(priority: string | null | undefined, activity: string | null | undefined): Record<string, number> {
  const base = {
    precipProb: 13,
    precipMm: 14,
    gust: 12,
    wind: 7,
    comfort: 12,
    daylight: 10,
    storm: 14,
    routeHeadwind: 8,
    routeCrosswind: 7,
    tailwindBonus: 3,
    water: 10,
    uv: 5,
  };

  if (activity === 'cycling') {
    base.gust += 3;
    base.routeHeadwind += 6;
    base.routeCrosswind += 5;
    base.comfort -= 2;
  } else if (activity === 'running') {
    base.comfort += 2;
    base.precipProb += 2;
  } else if (isBestWindowWaterExposureActivity(activity)) {
    base.water += 8;
    base.wind += 4;
    base.gust += 4;
    base.daylight += 2;
  } else if (activity === 'camping') {
    base.precipMm += 4;
    base.daylight -= 2;
  } else if (activity === 'road_trip') {
    base.routeHeadwind = 2;
    base.routeCrosswind = 1;
    base.wind = Math.max(0, base.wind - 2);
  } else if (activity === 'triathlon') {
    base.routeHeadwind += 2;
    base.gust += 2;
    base.precipProb += 1;
  }

  if (priority === 'driest') {
    base.precipProb += 10;
    base.precipMm += 12;
    base.gust = Math.max(0, base.gust - 2);
    base.comfort = Math.max(0, base.comfort - 3);
  } else if (priority === 'calmest') {
    base.gust += 12;
    base.wind += 7;
    base.routeHeadwind += 6;
    base.routeCrosswind += 8;
  } else if (priority === 'warmest') {
    base.comfort += 14;
    base.precipProb = Math.max(0, base.precipProb - 3);
    base.gust = Math.max(0, base.gust - 2);
  } else if (priority === 'fastest') {
    base.gust += 6;
    base.precipProb += 4;
    base.routeHeadwind += 12;
    base.routeCrosswind += 8;
    base.tailwindBonus += 8;
    base.comfort = Math.max(0, base.comfort - 3);
  } else if (priority === 'safest') {
    base.precipProb += 9;
    base.precipMm += 8;
    base.gust += 8;
    base.daylight += 7;
    base.storm += 10;
    base.uv += 4;
    base.routeCrosswind += 4;
  }

  return base;
}

function formatBestWindowMetric(value: number | null, suffix: string, fallback: string = 'n/a'): string {
  if (!isFiniteNumber(value)) return fallback;
  return `${round1(value)}${suffix}`;
}

function formatBestWindowSignedDelta(value: number): string {
  if (!isFiniteNumber(value) || Math.abs(value) < 0.05) return 'steady';
  return `${value > 0 ? '+' : '-'}${round1(Math.abs(value))}`;
}

function getBestWindowImpactTone(value: number): 'boost' | 'penalty' | 'neutral' {
  if (value > 0.4) return 'boost';
  if (value < -0.4) return 'penalty';
  return 'neutral';
}

function buildBestWindowScoreExplainerRows(candidate: unknown, options: unknown): Array<Record<string, string>> {
  const c = candidate as Record<string, any>;
  const opts = options as Record<string, any>;
  const priority = opts.priority || 'best_overall';
  const activity = opts.activity || null;
  const weights = getBestWindowWeights(priority, activity);
  const band = getBestWindowComfortBand(activity);
  const domain = c.domain || {};
  const point = c.point || {};
  const route = c.routeMetrics || null;
  const light = c.light || {};
  const rows: Array<Record<string, string>> = [];

  const maxPrecipProb = firstFinite(route?.maxPrecipProb, domain.maxPrecipProb, 0);
  const maxPrecip = firstFinite(route?.maxPrecip, domain.maxPrecip, 0);
  const rainPenalty = weights.precipProb * clamp((firstFinite(maxPrecipProb, 0)! - 10) / 60, 0, 1.2)
    + weights.precipMm * clamp((firstFinite(maxPrecip, 0)! - 0.05) / 1.75, 0, 1.2);
  const rainBonus = priority === 'driest'
    ? clamp((25 - firstFinite(maxPrecipProb, 25)!) / 25, 0, 1.2) * 10
    : 0;
  const rainNet = rainBonus - rainPenalty;
  rows.push({
    label: 'Rain risk',
    tone: getBestWindowImpactTone(rainNet),
    score: formatBestWindowSignedDelta(rainNet),
    detail: priority === 'driest'
      ? `Peak precip risk ${Math.round(firstFinite(maxPrecipProb, 0)!)}% with up to ${formatBestWindowMetric(maxPrecip, ' mm', '0 mm')}. Driest priority adds extra credit when that stays low.`
      : `Peak precip risk ${Math.round(firstFinite(maxPrecipProb, 0)!)}% with up to ${formatBestWindowMetric(maxPrecip, ' mm', '0 mm')} during the activity window.`,
  });

  const maxWind = firstFinite(route?.maxWind, domain.maxWind, 0);
  const maxGust = firstFinite(route?.maxGust, domain.maxGust, 0);
  const windPenalty = weights.gust * clamp((firstFinite(maxGust, 0)! - 18) / 32, 0, 1.2)
    + weights.wind * clamp((firstFinite(maxWind, 0)! - 10) / 25, 0, 1.2);
  const calmBonus = priority === 'calmest'
    ? clamp((24 - firstFinite(maxGust, 24)!) / 18, 0, 1.2) * 10
    : 0;
  const windNet = calmBonus - windPenalty;
  rows.push({
    label: 'Wind and gusts',
    tone: getBestWindowImpactTone(windNet),
    score: formatBestWindowSignedDelta(windNet),
    detail: priority === 'calmest'
      ? `Sustained wind peaks near ${formatBestWindowMetric(maxWind, ' km/h', '0 km/h')} with gusts to ${formatBestWindowMetric(maxGust, ' km/h', '0 km/h')}. Calmest priority rewards lower-gust windows.`
      : `Sustained wind peaks near ${formatBestWindowMetric(maxWind, ' km/h', '0 km/h')} with gusts to ${formatBestWindowMetric(maxGust, ' km/h', '0 km/h')}.`,
  });

  if (route) {
    const headwindPenalty = firstFinite(route?.avgHeadwind, 0)! > 0
      ? weights.routeHeadwind * clamp(firstFinite(route?.avgHeadwind, 0)! / 22, 0, 1.3)
      : 0;
    const crosswindPenalty = firstFinite(route?.avgCrosswind, 0)! > 0
      ? weights.routeCrosswind * clamp(firstFinite(route?.avgCrosswind, 0)! / 26, 0, 1.2)
      : 0;
    const tailwindBonus = firstFinite(route?.avgTailwind, 0)! > 0
      ? weights.tailwindBonus * clamp(firstFinite(route?.avgTailwind, 0)! / 18, 0, 1)
      : 0;
    const routeWindNet = tailwindBonus - headwindPenalty - crosswindPenalty;
    rows.push({
      label: 'Route wind effect',
      tone: getBestWindowImpactTone(routeWindNet),
      score: formatBestWindowSignedDelta(routeWindNet),
      detail: `Average route exposure is about ${formatBestWindowMetric(firstFinite(route?.avgHeadwind, 0), ' km/h', '0 km/h')} headwind, ${formatBestWindowMetric(firstFinite(route?.avgCrosswind, 0), ' km/h', '0 km/h')} crosswind, and ${formatBestWindowMetric(firstFinite(route?.avgTailwind, 0), ' km/h', '0 km/h')} tailwind.`,
    });
  }

  const meanFeels = firstFinite(domain.meanFeels, point.feels, point.temp);
  const minFeels = firstFinite(route?.minFeels, domain.minFeels, meanFeels);
  const maxFeels = firstFinite(route?.maxFeels, domain.maxFeels, meanFeels);
  let comfortPenalty = 0;
  if (isFiniteNumber(meanFeels)) {
    if (meanFeels < band.low) comfortPenalty += weights.comfort * clamp((band.low - meanFeels) / 12, 0, 1.25);
    if (meanFeels > band.high) comfortPenalty += weights.comfort * clamp((meanFeels - band.high) / 12, 0, 1.25);
  }
  if (isFiniteNumber(minFeels) && minFeels < band.low - 2) comfortPenalty += weights.comfort * 0.35 * clamp((band.low - minFeels) / 10, 0, 1);
  if (isFiniteNumber(maxFeels) && maxFeels > band.high + 2) comfortPenalty += weights.comfort * 0.3 * clamp((maxFeels - band.high) / 10, 0, 1);
  const comfortBonus = priority === 'warmest' && isFiniteNumber(meanFeels)
    ? clamp((meanFeels - band.low) / 8, 0, 1.4) * 12
    : 0;
  const comfortNet = comfortBonus - comfortPenalty;
  rows.push({
    label: 'Comfort band',
    tone: getBestWindowImpactTone(comfortNet),
    score: formatBestWindowSignedDelta(comfortNet),
    detail: priority === 'warmest' && isFiniteNumber(meanFeels)
      ? `Feels-like range ${formatBestWindowMetric(minFeels, ' C')} to ${formatBestWindowMetric(maxFeels, ' C')} against a target band of ${band.low}-${band.high} C. Warmest priority adds credit to warmer windows.`
      : `Feels-like range ${formatBestWindowMetric(minFeels, ' C')} to ${formatBestWindowMetric(maxFeels, ' C')} against a target band of ${band.low}-${band.high} C for ${getBestWindowActivityName(activity)}.`,
  });

  const daylightPenalty = /mostly dark|starts after sunset|starts before sunrise/i.test(light.label || '')
    ? weights.daylight * 0.95
    : (/crosses sunset|crosses sunrise/i.test(light.label || '') ? weights.daylight * 0.45 : 0);
  rows.push({
    label: 'Daylight',
    tone: getBestWindowImpactTone(-daylightPenalty),
    score: formatBestWindowSignedDelta(-daylightPenalty),
    detail: light.label
      ? `Light coverage for this window: ${String(light.label)}.`
      : 'Light coverage stays favorable across the activity window.',
  });

  const maxUv = firstFinite(route?.maxUv, domain.maxUv, point.uv, 0);
  const uvPenalty = firstFinite(maxUv, 0)! >= 6 && isBestWindowOutdoorUvRelevantActivity(activity)
    ? weights.uv * clamp((firstFinite(maxUv, 0)! - 5) / 6, 0, 1.25)
    : 0;
  rows.push({
    label: 'UV exposure',
    tone: getBestWindowImpactTone(-uvPenalty),
    score: formatBestWindowSignedDelta(-uvPenalty),
    detail: isBestWindowOutdoorUvRelevantActivity(activity)
      ? `Peak UV is ${formatBestWindowMetric(maxUv, '', 'n/a')} for this window.`
      : 'UV is not weighted heavily for this indoor-focused activity.',
  });

  const stormPenalty = domain.hasStorm ? weights.storm : 0;
  rows.push({
    label: 'Storm signal',
    tone: getBestWindowImpactTone(-stormPenalty),
    score: formatBestWindowSignedDelta(-stormPenalty),
    detail: domain.hasStorm
      ? 'A thunderstorm or severe-weather signal appears inside the planned window.'
      : 'No storm signal is present inside the planned window.',
  });

  if (isBestWindowWaterExposureActivity(activity) && isFiniteNumber(firstFinite(point.waterTemp, null))) {
    const waterTemp = firstFinite(point.waterTemp, null)!;
    const waterNet = waterTemp < 16
      ? -(weights.water * clamp((16 - waterTemp) / 8, 0, 1.2))
      : clamp((waterTemp - 16) / 8, 0, 1) * 6;
    rows.push({
      label: 'Water temperature',
      tone: getBestWindowImpactTone(waterNet),
      score: formatBestWindowSignedDelta(waterNet),
      detail: `Water temperature is ${formatBestWindowMetric(waterTemp, ' C')} for this start window.`,
    });
  }

  rows.push({
    label: 'Priority bias',
    tone: 'neutral',
    score: getBestWindowPresetLabel(priority),
    detail: getBestWindowPrioritySummary(priority, activity),
  });

  return rows;
}

function getBestWindowScoreExplainerHtml(candidate: unknown, options: unknown): string {
  if (!candidate || !options) return '';
  const c = candidate as Record<string, any>;
  const opts = options as Record<string, any>;
  const rows = buildBestWindowScoreExplainerRows(candidate, options);
  const score = firstFinite(c.score, 0);
  const title = formatWeekdayTime(c.startTime || '');
  return `
    <div class="best-window-explainer" aria-live="polite">
      <div class="best-window-explainer-header">
        <div>
          <div class="best-window-explainer-kicker">Selected score explainer</div>
          <div class="best-window-explainer-title">${escapeHtml(title ? `Why ${title} scores ${String(score)}` : `Why this window scores ${String(score)}`)}</div>
        </div>
        <div class="best-window-explainer-summary">${escapeHtml(getBestWindowPresetLabel(opts.priority || 'best_overall'))}</div>
      </div>
      <div class="best-window-explainer-grid">
        ${rows.map((row) => `
          <div class="best-window-explainer-row tone-${escapeHtml(String(row.tone || 'neutral'))}">
            <div class="best-window-explainer-factor">${escapeHtml(String(row.label || ''))}</div>
            <div class="best-window-explainer-score">${escapeHtml(String(row.score || ''))}</div>
            <div class="best-window-explainer-detail">${escapeHtml(String(row.detail || ''))}</div>
          </div>
        `).join('')}
      </div>
    </div>`;
}

export function buildBestWindowReasons(candidate: unknown, options: unknown): string[] {
  const c = candidate as Record<string, any>;
  const opts = options as Record<string, any>;
  const bits: string[] = [];
  const domain = c.domain || {};
  const route = c.routeMetrics || null;
  const light = c.light || {};
  const meanFeels = firstFinite(domain.meanFeels, c.point?.feels, c.point?.temp);
  if (firstFinite(route?.maxPrecipProb, domain.maxPrecipProb, 100)! < 25 && firstFinite(route?.maxPrecip, domain.maxPrecip, 9)! < 0.2) bits.push('mostly dry');
  else if (firstFinite(route?.maxPrecipProb, domain.maxPrecipProb, 100)! < 40) bits.push('lower rain risk');
  if (firstFinite(route?.maxGust, domain.maxGust, 99)! < 25) bits.push('lower gusts');
  else if (firstFinite(route?.maxGust, domain.maxGust, 99)! < 32) bits.push('manageable gusts');
  if (isFiniteNumber(meanFeels)) {
    const band = getBestWindowComfortBand(opts.activity);
    if (meanFeels >= band.low && meanFeels <= band.high) bits.push('comfortable temperatures');
    else if (opts.priority === 'warmest') bits.push('warmer than the cooler options');
  }
  if (route && firstFinite(route.avgHeadwind, 99)! < 8) bits.push('less headwind on route');
  const maxUv = firstFinite(route?.maxUv, domain.maxUv, c.point?.uv, null);
  const indoorActivities = ['gym', 'indoor_running', 'indoor_cycling', 'indoor_multisport', 'swimming_pool_indoor'];
  const uvRelevant = !opts.activity || !indoorActivities.includes(opts.activity);
  if (uvRelevant && isFiniteNumber(maxUv) && (maxUv as number) < 6) bits.push('UV manageable');
  if (route && firstFinite(route.avgCrosswind, 99)! < 10 && opts.activity === 'cycling') bits.push('tamer crosswinds');
  if (!/dark/i.test(light.label || '')) bits.push('full daylight');
  else if (!/mostly dark/i.test(light.label || '')) bits.push('better daylight coverage');
  return bits.slice(0, 3);
}

// ---------------------------------------------------------------------------
// Cluster / range helpers
// ---------------------------------------------------------------------------

export function getBestWindowClusterStartRangeInfo(
  cluster: unknown,
  maxSpanMinutes: number = 30,
): { start: unknown; end: unknown; count: number; spanMinutes: number; label: string } | null {
  const cl = cluster as Record<string, any>;
  const rep = cl?.representative;
  const repMs = parseAnyTime(rep?.startTime);
  if (!rep || !Number.isFinite(repMs) || !Array.isArray(cl?.items) || cl.items.length < 2) return null;

  const byStart = new Map<string, any>();
  cl.items.forEach((item: any) => {
    const startMs = parseAnyTime(item.startTime);
    if (!Number.isFinite(startMs)) return;
    const existing = byStart.get(item.startTime);
    if (!existing || firstFinite(item.score, -Infinity)! > firstFinite(existing.score, -Infinity)!) byStart.set(item.startTime, item);
  });
  const sorted = [...byStart.values()].sort((a: any, b: any) => parseAnyTime(a.startTime) - parseAnyTime(b.startTime));
  if (sorted.length < 2) return null;

  const maxSpanMs = Math.max(1, maxSpanMinutes) * 60000;
  let bestSlice: { slice: any[]; containsRep: boolean; avgScore: number } | null = null;
  for (let i = 0; i < sorted.length; i++) {
    const itemStartMs = parseAnyTime(sorted[i].startTime);
    const slice: any[] = [];
    for (let j = i; j < sorted.length; j++) {
      const itemMs = parseAnyTime(sorted[j].startTime);
      if (itemMs - itemStartMs > maxSpanMs) break;
      slice.push(sorted[j]);
    }
    if (slice.length < 2) continue;
    const containsRep = slice.some((item: any) => item.startTime === rep.startTime);
    const avgScore = slice.reduce((sum: number, item: any) => sum + firstFinite(item.score, 0)!, 0) / slice.length;
    const current = { slice, containsRep, avgScore };
    if (!bestSlice ||
        current.slice.length > bestSlice.slice.length ||
        (current.slice.length === bestSlice.slice.length && Number(current.containsRep) > Number(bestSlice.containsRep)) ||
        (current.slice.length === bestSlice.slice.length && current.containsRep === bestSlice.containsRep && current.avgScore > bestSlice.avgScore)) {
      bestSlice = current;
    }
  }

  if (!bestSlice) return null;
  const first = bestSlice.slice[0];
  const last = bestSlice.slice[bestSlice.slice.length - 1];
  if (first.startTime === last.startTime) return null;
  const spanMinutes = Math.round((parseAnyTime(last.startTime) - parseAnyTime(first.startTime)) / 60000);
  return {
    start: first.startTime,
    end: last.startTime,
    count: bestSlice.slice.length,
    spanMinutes,
    label: formatBestWindowSpan(first.startTime, last.startTime),
  };
}

export function getBestWindowActivityRange(
  startTime: unknown,
  durationMinutes: unknown,
): { startMs: number; endMs: number; startTime: unknown; endTime: string } {
  const startMs = parseAnyTime(startTime);
  const durMs = Math.max(1, firstFinite(durationMinutes as number, 0)!) * 60000;
  if (!Number.isFinite(startMs)) return { startMs: NaN, endMs: NaN, startTime, endTime: startTime as string };
  const end = new Date(startMs + durMs);
  return {
    startMs,
    endMs: end.getTime(),
    startTime,
    endTime: formatDateTimeLocal(end).slice(0, 16),
  };
}

export function bestWindowRangeOverrunMinutes(activityRange: unknown, analysis: unknown): number {
  const ar = activityRange as { endMs?: number } | null;
  const an = analysis as { range?: { end?: unknown } } | null;
  const rangeEndMs = parseAnyTime(an?.range?.end);
  if (!Number.isFinite(ar?.endMs) || !Number.isFinite(rangeEndMs)) return 0;
  return Math.max(0, Math.ceil((ar!.endMs! - rangeEndMs) / 60000));
}

export function formatBestWindowOverrunWarning(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes <= 0) return '';
  return `⚠ extends ${formatDurationDisplay(minutes)} past search end`;
}

// ---------------------------------------------------------------------------
// Timeline HTML
// ---------------------------------------------------------------------------

export function getBestWindowTimelineHtml(analysis: unknown, selectedStart: string | null): string {
  const an = analysis as {
    topWindows: any[];
    range: { start: unknown; end: unknown };
    options?: { durationMinutes?: number; priority?: string };
  } | null;
  if (!an?.topWindows?.length || !an.range) return '';

  const baseStartMs = parseAnyTime(an.range.start);
  const baseEndMs = parseAnyTime(an.range.end);
  const durationMinutes = firstFinite(an.options?.durationMinutes, 0)!;
  const activityRanges = an.topWindows.map(cluster =>
    getBestWindowActivityRange(cluster.representative?.startTime, durationMinutes));
  const startMs = baseStartMs;
  const endMs = Math.max(baseEndMs, ...activityRanges.map(r => firstFinite(r.endMs, baseEndMs)!));
  const totalMs = Math.max(1, endMs - startMs);
  const totalMinutes = Math.max(1, Math.round(totalMs / 60000));
  const tickConfig = getBestWindowTimelineTickConfig(totalMinutes);
  const multiDay = formatDateOnlyLocal(new Date(startMs)) !== formatDateOnlyLocal(new Date(endMs));
  const currentSelected = selectedStart || an.topWindows[0]?.representative?.startTime || null;

  const drawOrder = an.topWindows
    .map((cluster, index) => ({
      cluster,
      index,
      range: activityRanges[index],
      active: currentSelected === cluster.representative?.startTime,
    }))
    .sort((a, b) => Number(a.active) - Number(b.active));

  const bands = drawOrder.map(({ cluster, index, range, active }) => {
    const rawLeft = ((range.startMs - startMs) / totalMs) * 100;
    const rawRight = ((range.endMs - startMs) / totalMs) * 100;
    const left = clamp(rawLeft, 0, 100);
    const right = clamp(rawRight, 0, 100);
    const width = Math.max(1.2, right - left);
    const rank = getBestWindowRankClass(index);
    const activeClass = active ? 'active' : '';
    const overrun = bestWindowRangeOverrunMinutes(range, an);
    const overrunClass = overrun > 0 ? 'extends-past-range' : '';
    const warning = overrun > 0 ? ` · ${formatBestWindowOverrunWarning(overrun)}` : '';
    const startRange = getBestWindowClusterStartRangeInfo(cluster);
    const startRangeText = startRange ? ` · good starts ${startRange.label}` : '';
    const title = `${getBestWindowRankLabel(index, an.options?.priority || 'best_overall')} · ${formatWeekdayTime(range.startTime)}–${formatShortTime(range.endTime)}${startRangeText}${warning}`;
    return `<div class="best-window-strip-band ${rank} ${activeClass} ${overrunClass}" style="left:${left.toFixed(2)}%; width:${width.toFixed(2)}%;" title="${escapeHtml(title)}" data-action="applyBestWindowResult" data-start-time="${escapeHtml(cluster.representative?.startTime || '')}"></div>`;
  }).join('');

  const markers = drawOrder.map(({ cluster, index, active }) => {
    const rep = cluster.representative;
    const left = ((parseAnyTime(rep.startTime) - startMs) / totalMs) * 100;
    const activeClass = active ? 'active' : '';
    const rank = getBestWindowRankClass(index);
    const edgeClass = left <= 4 ? 'edge-start' : (left >= 96 ? 'edge-end' : '');
    const labelHtml = index < 3
      ? renderSymbolIconHtml(getBestWindowRankEmoji(index), 'best-window-strip-icon', `Rank ${index + 1}`, true)
      : escapeHtml(`#${index + 1}`);
    return `<div class="best-window-strip-marker ${rank} ${activeClass}" style="left:${left.toFixed(2)}%;" data-action="applyBestWindowResult" data-start-time="${escapeHtml(rep.startTime)}"><span class="best-window-strip-label ${edgeClass}">${labelHtml}</span></div>`;
  }).join('');

  const tickItems: { date: Date; type: string }[] = [];
  const addTick = (date: Date, type: string) => {
    const time = date.getTime();
    if (!Number.isFinite(time) || time < startMs || time > endMs) return;
    tickItems.push({ date: new Date(time), type });
  };

  addTick(new Date(startMs), 'major');
  let minorCursor = ceilDateToStep(new Date(startMs), tickConfig.minor);
  while (minorCursor.getTime() < endMs) {
    addTick(minorCursor, 'minor');
    minorCursor = new Date(minorCursor.getTime() + tickConfig.minor * 60000);
  }
  let majorCursor = ceilDateToStep(new Date(startMs), tickConfig.major);
  while (majorCursor.getTime() < endMs) {
    addTick(majorCursor, 'major');
    majorCursor = new Date(majorCursor.getTime() + tickConfig.major * 60000);
  }
  getBestWindowTimelineDayBoundaryTicks(startMs, endMs).forEach(date => addTick(date, 'date'));
  addTick(new Date(endMs), 'major');

  const priority: Record<string, number> = { minor: 1, major: 2, date: 3 };
  const dedupedTicks = new Map<string, { date: Date; type: string }>();
  tickItems.forEach(item => {
    const key = item.date.toISOString().slice(0, 16);
    const existing = dedupedTicks.get(key);
    if (!existing || priority[item.type] > priority[existing.type]) dedupedTicks.set(key, item);
  });
  const orderedTicks = [...dedupedTicks.values()].sort((a, b) => a.date.getTime() - b.date.getTime());

  const gridlines = orderedTicks.map(item => {
    const left = ((item.date.getTime() - startMs) / totalMs) * 100;
    return `<div class="best-window-strip-gridline is-${item.type}" style="left:${left.toFixed(2)}%;"></div>`;
  }).join('');

  const axis = orderedTicks.map(item => {
    const left = ((item.date.getTime() - startMs) / totalMs) * 100;
    const edgeClass = left <= 4 ? 'edge-start' : (left >= 96 ? 'edge-end' : '');
    const label = item.type === 'minor' ? '' : formatBestWindowTimelineTickLabel(item.date, tickConfig, multiDay, item.type);
    return `<div class="best-window-strip-tick is-${item.type}" style="left:${left.toFixed(2)}%;"></div>${label ? `<div class="best-window-strip-tick-label is-${item.type} ${edgeClass}" style="left:${left.toFixed(2)}%;">${escapeHtml(label)}</div>` : ''}`;
  }).join('');

  return `
    <div class="best-window-strip" aria-label="Best activity windows timeline">
      ${gridlines}
      ${bands}
      ${markers}
    </div>
    <div class="best-window-strip-axis">
      ${axis}
    </div>`;
}

// ---------------------------------------------------------------------------
// Results renderer
// ---------------------------------------------------------------------------

export function renderBestWindowResults(
  analysis: unknown,
  containerEl: HTMLElement | null,
  selectedStart: string | null,
): void {
  if (!containerEl) return;
  const an = analysis as {
    topWindows: any[];
    options: { durationMinutes: number; priority: string };
  } | null;
  if (!an?.topWindows?.length) {
    containerEl.innerHTML = `<div class="best-window-empty">No strong weather windows found inside the current range. Try widening the search, loosening the limits, or using a different priority preset.</div>`;
    return;
  }
  const currentSelected = selectedStart || an.topWindows[0]?.representative?.startTime || null;
  const selectedCluster = an.topWindows.find((cluster) => cluster?.representative?.startTime === currentSelected) || an.topWindows[0];
  const selectedExplainerHtml = getBestWindowScoreExplainerHtml(selectedCluster?.representative, an.options);
  containerEl.innerHTML = `
    ${getBestWindowTimelineHtml(analysis, selectedStart)}
    <div class="best-window-grid">
      ${an.topWindows.map((cluster, index) => {
        const rep = cluster.representative;
        const active = currentSelected === rep.startTime;
        const reasons = buildBestWindowReasons(rep, an.options);
        const windowLabel = cluster.start === cluster.end
          ? `Start ${formatWeekdayTime(cluster.start)}`
          : formatBestWindowSpan(cluster.start, cluster.end);
        const startRangeInfo = getBestWindowClusterStartRangeInfo(cluster);
        const startRangeHtml = startRangeInfo
          ? `<div class="best-window-start-range">⏱ good starts ${escapeHtml(startRangeInfo.label)} · ${escapeHtml(String(startRangeInfo.count))} slots</div>`
          : '';
        const activityRange = getBestWindowActivityRange(rep.startTime, an.options.durationMinutes);
        const overrun = bestWindowRangeOverrunMinutes(activityRange, analysis);
        const overrunWarning = formatBestWindowOverrunWarning(overrun);
        return `
          <button type="button" class="best-window-card ${getBestWindowRankClass(index)} ${active ? 'active' : ''}" data-action="applyBestWindowResult" data-start-time="${escapeHtml(rep.startTime)}">
            <div class="best-window-rank">${index < 3 ? `${renderSymbolIconHtml(getBestWindowRankEmoji(index), 'best-window-rank-icon', `Rank ${index + 1}`, true)} ` : ''}${escapeHtml(getBestWindowRankLabel(index, an.options.priority))}</div>
            <div class="best-window-time">${escapeHtml(formatWeekdayTime(rep.startTime))}</div>
            <div class="best-window-window">Activity ${escapeHtml(formatWeekdayTime(rep.startTime))}–${escapeHtml(formatShortTime(activityRange.endTime))} · ${startRangeInfo ? 'best start' : 'start window'} ${escapeHtml(startRangeInfo ? formatWeekdayTime(rep.startTime) : windowLabel)} · score ${escapeHtml(rep.score)}</div>
            ${startRangeHtml}
            ${overrunWarning ? `<div class="best-window-overrun-warning">${escapeHtml(overrunWarning)}</div>` : ''}
            <div class="best-window-why">${escapeHtml(reasons.join(' · ') || 'Balanced full-window conditions.')}</div>
          </button>`;
      }).join('')}
    </div>
    ${selectedExplainerHtml}`;
}
