export const WATER_BODY_TYPE_DEFINITIONS = [
    {
        key: 'auto',
        label: 'Auto / unknown',
        summary: 'Use when unsure. Keeps the fallback more conservative and lowers confidence.'
    },
    {
        key: 'deep_lake',
        label: 'Deep lake',
        summary: 'Large or deep inland water that warms slowly and stays colder longer.'
    },
    {
        key: 'shallow_lake',
        label: 'Shallow lake',
        summary: 'Smaller or shallower inland water that reacts faster to warm or cool spells.'
    },
    {
        key: 'bay',
        label: 'Bay / inlet',
        summary: 'Semi-protected coastal water that usually warms a bit faster than open coast.'
    },
    {
        key: 'river',
        label: 'River',
        summary: 'Moving water where flow can keep temperatures less stable and often cooler.'
    },
    {
        key: 'sheltered',
        label: 'Sheltered beach / pond',
        summary: 'Small, protected, low-exchange water that can warm quickly.'
    },
    {
        key: 'coastal',
        label: 'Coastal / sea',
        summary: 'Open coast or sea exposure with larger-body lag and more persistent cold influence.'
    }
];
export const WIND_EXPOSURE_DEFINITIONS = [
    {
        key: 'auto',
        label: 'Auto / neutral',
        summary: 'Default when unsure. Keeps the model cautious instead of forcing a shoreline assumption.'
    },
    {
        key: 'neutral',
        label: 'Neutral / unknown',
        summary: 'No clear onshore or offshore assumption.'
    },
    {
        key: 'onshore',
        label: 'Mostly onshore',
        summary: 'Wind usually blows from open water toward shore and may keep near-shore surface water milder.'
    },
    {
        key: 'offshore',
        label: 'Mostly offshore',
        summary: 'Wind usually blows from shore toward open water and may pull colder water toward the surface or away from shore.'
    },
    {
        key: 'sheltered',
        label: 'Sheltered',
        summary: 'Shoreline, cove, or pond where surrounding terrain reduces direct wind effect.'
    }
];
export function isFiniteNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
}
export function firstFinite(...values) {
    for (const value of values) {
        if (isFiniteNumber(value))
            return value;
    }
    return null;
}
export function round1(value) {
    return Math.round(value * 10) / 10;
}
export function clampNumber(value, min, max) {
    if (!isFiniteNumber(value))
        return value;
    return Math.min(max, Math.max(min, value));
}
export function clampEstimate(value, min, max) {
    return clampNumber(value, min, max);
}
export function mapRange(value, inMin, inMax, outMin, outMax) {
    const ratio = clampNumber((value - inMin) / Math.max(1, inMax - inMin), 0, 1);
    return outMin + ((outMax - outMin) * ratio);
}
export function averageNumbers(values) {
    const nums = values.filter(isFiniteNumber);
    if (!nums.length)
        return null;
    return nums.reduce((sum, value) => sum + value, 0) / nums.length;
}
export function parseLocalString(str) {
    if (!str || typeof str !== 'string')
        return null;
    const [datePart, timePart = '00:00'] = str.split('T');
    const [y, m, d] = datePart.split('-').map(Number);
    const [hh, mm] = timePart.split(':').map(Number);
    return new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0, 0);
}
export function parseAnyTime(value) {
    if (value == null)
        return Number.NaN;
    if (value instanceof Date)
        return value.getTime();
    if (typeof value === 'number')
        return value;
    const text = String(value).trim();
    if (!text)
        return Number.NaN;
    const nativeParsed = Date.parse(text);
    if (Number.isFinite(nativeParsed))
        return nativeParsed;
    const local = parseLocalString(text);
    return local ? local.getTime() : Number.NaN;
}
export function getLatitudeBand(latitude) {
    const abs = Math.abs(firstFinite(latitude, 45) ?? 45);
    if (abs < 23.5)
        return { key: 'tropical', label: 'tropical / low latitude', bias: 3.0 };
    if (abs < 35)
        return { key: 'warm', label: 'warm temperate', bias: 1.5 };
    if (abs < 50)
        return { key: 'temperate', label: 'temperate', bias: 0 };
    if (abs < 60)
        return { key: 'cold', label: 'cool northern / southern', bias: -1.2 };
    return { key: 'subpolar', label: 'subpolar / high latitude', bias: -2.5 };
}
export function getSeasonInfo(dateStr, latitude) {
    const date = parseLocalString(String(dateStr || '').slice(0, 10) + 'T12:00') || new Date();
    const month = date.getMonth();
    const day = date.getDate();
    const north = (firstFinite(latitude, 45) ?? 45) >= 0;
    const seasonsNorth = ['winter', 'winter', 'spring', 'spring', 'spring', 'summer', 'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter'];
    const seasonsSouth = ['summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter', 'winter', 'winter', 'spring', 'spring', 'spring', 'summer'];
    const season = (north ? seasonsNorth : seasonsSouth)[month] || 'summer';
    const phase = day <= 10 ? 'early' : day <= 20 ? 'mid' : 'late';
    const autumnStart = new Date(date.getFullYear(), north ? 8 : 2, 1, 12, 0, 0, 0);
    let weeksIntoAutumn = 0;
    if (season === 'autumn')
        weeksIntoAutumn = Math.max(0, (date.getTime() - autumnStart.getTime()) / (7 * 24 * 3600 * 1000));
    const factor = (season === 'spring' ? 0
        : season === 'summer' ? (phase === 'early' ? 0.4 : phase === 'mid' ? 0.5 : 0.6)
            : season === 'autumn' ? (phase === 'early' ? 0.9 : phase === 'mid' ? 1 : 1.1)
                : (phase === 'early' ? 1.15 : phase === 'mid' ? 1.25 : 1.35));
    return { season, phase, label: `${phase} ${season}`, factor, weeksIntoAutumn };
}
export function getWaterBodyConfig(type) {
    const config = {
        deep_lake: { label: 'deep lake', depthFactor: 1, positiveScale: 0.55, adjust: 0 },
        shallow_lake: { label: 'shallow lake', depthFactor: 0, positiveScale: 1.35, adjust: 0.8 },
        bay: { label: 'bay / inlet', depthFactor: 0, positiveScale: 1.25, adjust: 0.4 },
        river: { label: 'river', depthFactor: 0.5, positiveScale: 0.75, adjust: -2 },
        sheltered: { label: 'sheltered beach / pond', depthFactor: 0.5, positiveScale: 1.45, adjust: 1.5 },
        coastal: { label: 'coastal / sea', depthFactor: 1, positiveScale: 0.65, adjust: -1 },
        auto: { label: 'unknown water body', depthFactor: 0.5, positiveScale: 1, adjust: 0 }
    }[String(type || 'auto')];
    return config || { label: 'unknown water body', depthFactor: 0.5, positiveScale: 1, adjust: 0 };
}
export function getRecentDailyRecordsForWater(data) {
    const currentDate = String(data?.currentTime || '').slice(0, 10);
    const daily = Array.isArray(data?.daily) ? data.daily : [];
    const past = daily.filter((day) => !currentDate || String(day?.date || '') <= currentDate);
    return (past.length ? past : daily).slice(-7);
}
export function getRecentHourlyRecordsForWater(data) {
    const currentMs = parseAnyTime(data?.currentTime);
    const hourly = Array.isArray(data?.hourly) ? data.hourly : [];
    if (!Number.isFinite(currentMs))
        return hourly.slice(-48);
    const minMs = currentMs - (48 * 3600 * 1000);
    const recent = hourly.filter((point) => {
        const ms = parseAnyTime(point?.time);
        return Number.isFinite(ms) && ms >= minMs && ms <= currentMs;
    });
    return (recent.length ? recent : hourly).slice(-48);
}
export function getAlignedDailyWaterRecords(data) {
    return getRecentDailyRecordsForWater(data).map((day) => ({
        date: typeof day?.date === 'string' ? day.date : null,
        low: firstFinite(day?.tMin, null),
        high: firstFinite(day?.tMax, null)
    }));
}
export function getRecentWindWindow(data, hours = 24) {
    const currentMs = parseAnyTime(data?.currentTime);
    const hourly = Array.isArray(data?.hourly) ? data.hourly : [];
    const valid = hourly.filter((point) => {
        const ms = parseAnyTime(point?.time);
        return Number.isFinite(ms) && (!Number.isFinite(currentMs) || ms <= currentMs);
    });
    const source = valid.length ? valid : hourly;
    return source.slice(-Math.max(1, hours));
}
export function getSeasonalDepthEffect(season, body) {
    if (season.season === 'spring') {
        const scale = season.phase === 'early' ? 4.0 : season.phase === 'mid' ? 3.2 : 2.4;
        return -scale * body.depthFactor;
    }
    if (season.season === 'summer') {
        const scale = season.phase === 'early' ? 2.0 : season.phase === 'mid' ? 1.6 : 1.2;
        return -scale * body.depthFactor;
    }
    if (season.season === 'autumn') {
        const scale = season.phase === 'early' ? 0.5 : season.phase === 'mid' ? 1.0 : 1.5;
        return scale * body.depthFactor;
    }
    if (season.season === 'winter') {
        const scale = season.phase === 'early' ? 2.25 : season.phase === 'mid' ? 2.5 : 2.75;
        return -scale * body.depthFactor;
    }
    return 0;
}
export function getSpringCap(band, waterBodyType) {
    const baseCap = band.key === 'tropical' ? 24 : band.key === 'warm' ? 20 : band.key === 'cold' || band.key === 'subpolar' ? 12 : 15;
    const isFastWarmingBody = ['shallow_lake', 'bay', 'sheltered'].includes(String(waterBodyType || ''));
    return baseCap + (isFastWarmingBody ? 2 : 0);
}
export function getSummerFloor(band, waterBodyType) {
    if (!['shallow_lake', 'bay', 'sheltered'].includes(String(waterBodyType || '')))
        return null;
    return band.key === 'tropical' ? 22 : band.key === 'warm' ? 20 : band.key === 'temperate' ? 18 : 16;
}
export function getDynamicUncertainty(args) {
    let uncertainty = args.confidence === 'medium' ? 2.0 : 2.75;
    if (String(args.settings.waterBodyType || 'auto') === 'auto')
        uncertainty += 0.5;
    if (String(args.settings.windExposure || 'auto') === 'auto')
        uncertainty += 0.25;
    if (args.season.season === 'winter')
        uncertainty += 0.75;
    else if (args.season.season === 'spring')
        uncertainty += 0.35;
    if (args.lows.length < 5 || args.highs.length < 5)
        uncertainty += 0.5;
    if (args.recentWindHours.length < 12)
        uncertainty += 0.25;
    return clampNumber(uncertainty, 2.0, 4.25);
}
function getWaterBodyDefinition(type) {
    return WATER_BODY_TYPE_DEFINITIONS.find((entry) => entry.key === String(type || 'auto')) || WATER_BODY_TYPE_DEFINITIONS[0];
}
function getWindExposureDefinition(type) {
    return WIND_EXPOSURE_DEFINITIONS.find((entry) => entry.key === String(type || 'auto')) || WIND_EXPOSURE_DEFINITIONS[0];
}
export function estimatePseudoWaterTemperature(data, settings = {}) {
    const resolvedSettings = {
        waterBodyType: String(settings?.waterBodyType || 'auto'),
        windExposure: String(settings?.windExposure || 'auto'),
        poolType: settings?.poolType || ''
    };
    const dailyPoints = getAlignedDailyWaterRecords(data);
    const lows = dailyPoints.map((day) => day.low).filter(isFiniteNumber);
    const highs = dailyPoints.map((day) => day.high).filter(isFiniteNumber);
    const completeDays = dailyPoints.filter((day) => isFiniteNumber(day.low) && isFiniteNumber(day.high));
    if (lows.length < 2 || highs.length < 2) {
        return {
            available: false,
            source: 'unknown',
            confidence: 'unknown',
            explanation: 'Not enough recent temperature data for a fallback estimate.'
        };
    }
    const body = getWaterBodyConfig(resolvedSettings.waterBodyType);
    const band = getLatitudeBand(data?.latitude);
    const season = getSeasonInfo(data?.currentTime, data?.latitude);
    const bodyDefinition = getWaterBodyDefinition(resolvedSettings.waterBodyType);
    const windDefinition = getWindExposureDefinition(resolvedSettings.windExposure);
    const L = averageNumbers(lows.slice(-2)) ?? 0;
    const L7 = averageNumbers(lows.slice(-7)) ?? L;
    const H7 = averageNumbers(highs.slice(-7)) ?? L7;
    const recentWindHours = getRecentWindWindow(data, 24);
    const windyWindKmh = 22;
    const windyHours = recentWindHours.filter((point) => firstFinite(point?.wind, null) != null && firstFinite(point?.wind, null) >= windyWindKmh);
    const windFraction = recentWindHours.length ? windyHours.length / recentWindHours.length : 0;
    const avgRecentWind = averageNumbers(recentWindHours.map((point) => firstFinite(point?.wind, null))) ?? 0;
    const offshoreAdjustment = resolvedSettings.windExposure === 'offshore' ? (-6.0 * windFraction) : 0;
    const onshoreAdjustment = resolvedSettings.windExposure === 'onshore' ? (3.0 * windFraction) : 0;
    const windAdjustment = offshoreAdjustment + onshoreAdjustment;
    const seasonalDepthEffect = getSeasonalDepthEffect(season, body);
    const seasonAdjustment = -2.0 * season.factor;
    const bodyAdjustment = body.adjust;
    const latitudeAdjustment = band.bias;
    const nightBase = 0.55 * L;
    const weeklyLowMemory = 0.25 * L7;
    const daytimeWarmingSignal = 0.05 * H7;
    let estimate = nightBase +
        weeklyLowMemory +
        daytimeWarmingSignal +
        windAdjustment +
        seasonalDepthEffect +
        seasonAdjustment +
        bodyAdjustment +
        latitudeAdjustment;
    const rawEstimateBeforeRules = estimate;
    const notes = [band.label, season.label, body.label];
    const last2Below10 = lows.slice(-2).filter((value) => value < 10).length >= 2;
    const last3 = lows.slice(-3);
    const last5 = lows.slice(-5);
    if (last3.length >= 3 && last3.filter((value) => value > 20).length >= 3) {
        estimate = clampEstimate(estimate, 22, 25);
        notes.push('very warm nights');
    }
    else if (last5.length >= 5 && last5.filter((value) => value > 15).length >= 5) {
        estimate = clampEstimate(estimate, 17, 21);
        notes.push('warm recent nights');
    }
    else if (last3.length >= 3 && last3.filter((value) => value >= 10 && value <= 15).length >= 3) {
        estimate = clampEstimate(estimate, 14, 18);
        notes.push('moderate recent nights');
    }
    else if (last2Below10) {
        estimate = Math.min(estimate, 14);
        notes.push('cool recent nights');
    }
    const last5CompleteDays = completeDays.slice(-5);
    const last5HighAvg = averageNumbers(last5CompleteDays.map((day) => day.high));
    const last5LowAvg = averageNumbers(last5CompleteDays.map((day) => day.low));
    if (isFiniteNumber(last5HighAvg) && isFiniteNumber(last5LowAvg) && last5HighAvg > 25 && last5LowAvg > 15) {
        estimate += 1.5 * body.positiveScale;
        notes.push('daytime warming');
    }
    const windyFractionForMapping = clampNumber(windFraction, 0.5, 1);
    let offshoreCoolingPenalty = 0;
    let onshorePushBonus = 0;
    let genericWindMixingPenalty = 0;
    if (resolvedSettings.windExposure === 'offshore' && windFraction >= 0.5) {
        offshoreCoolingPenalty = mapRange(windyFractionForMapping, 0.5, 1, 2, 6);
        estimate -= offshoreCoolingPenalty;
        notes.push('offshore cooling risk');
    }
    if (resolvedSettings.windExposure === 'onshore' && windFraction >= 0.5) {
        onshorePushBonus = mapRange(windyFractionForMapping, 0.5, 1, 1, 3) * body.positiveScale;
        estimate += onshorePushBonus;
        notes.push('onshore push');
    }
    if ((resolvedSettings.windExposure === 'auto' || resolvedSettings.windExposure === 'neutral') && avgRecentWind >= windyWindKmh) {
        genericWindMixingPenalty = mapRange(clampNumber(avgRecentWind, 22, 40), 22, 40, 0.5, 2.5);
        estimate -= genericWindMixingPenalty;
        notes.push('wind mixing');
    }
    if (season.season === 'spring') {
        estimate = Math.min(estimate, getSpringCap(band, resolvedSettings.waterBodyType));
    }
    const summerFloor = season.season === 'summer' ? getSummerFloor(band, resolvedSettings.waterBodyType) : null;
    if (isFiniteNumber(summerFloor)) {
        estimate = Math.max(estimate, summerFloor);
    }
    let autumnCoolingPenalty = 0;
    if (season.season === 'autumn') {
        const autumnBaseCooling = band.key === 'tropical' ? 0.2 : band.key === 'warm' ? 0.4 : 0.65;
        const bodyAutumnLag = body.depthFactor >= 0.75 ? 0.5 : body.depthFactor >= 0.4 ? 0.75 : 1.0;
        autumnCoolingPenalty = autumnBaseCooling * bodyAutumnLag * season.weeksIntoAutumn;
        estimate -= autumnCoolingPenalty;
    }
    let winterPenalty = 0;
    if (season.season === 'winter') {
        winterPenalty = band.key === 'tropical' ? 0 : band.key === 'warm' ? 1.5 : 3.5;
        estimate -= winterPenalty;
    }
    const hasEnoughDailyData = lows.length >= 5 && highs.length >= 5;
    const hasEnoughWindData = recentWindHours.length >= 12;
    const hasManualBodyType = resolvedSettings.waterBodyType !== 'auto';
    const hasUsefulWindExposure = resolvedSettings.windExposure !== 'auto';
    const isNotWinter = season.season !== 'winter';
    const confidence = hasEnoughDailyData && hasEnoughWindData && hasManualBodyType && hasUsefulWindExposure && isNotWinter
        ? 'medium'
        : 'low';
    const uncertainty = getDynamicUncertainty({
        confidence,
        settings: resolvedSettings,
        season,
        lows,
        highs,
        recentWindHours
    });
    const finalTemp = clampEstimate(estimate, 0, 30);
    const low = clampEstimate(finalTemp - uncertainty, 0, 30);
    const high = clampEstimate(finalTemp + uncertainty, 0, 30);
    return {
        available: true,
        source: 'estimated',
        confidence,
        temp: round1(finalTemp),
        conservativeTemp: round1(low),
        rangeLow: round1(low),
        rangeHigh: round1(high),
        explanation: `Fallback estimate from recent air temperature, season, wind, and water-body settings. Not measured water data. Factors: ${notes.slice(0, 5).join(', ')}.`,
        settings: resolvedSettings,
        latitudeBand: band.key,
        season: season.season,
        seasonPhase: season.phase,
        debug: {
            L,
            L7,
            H7,
            windFraction: round1(windFraction),
            avgRecentWind: round1(avgRecentWind),
            windyThresholdKmh: windyWindKmh,
            windyHoursCount: windyHours.length,
            recentWindHoursCount: recentWindHours.length,
            nightBase: round1(nightBase),
            weeklyLowMemory: round1(weeklyLowMemory),
            daytimeWarmingSignal: round1(daytimeWarmingSignal),
            windAdjustment: round1(windAdjustment),
            offshoreAdjustment: round1(offshoreAdjustment),
            onshoreAdjustment: round1(onshoreAdjustment),
            seasonalDepthEffect: round1(seasonalDepthEffect),
            seasonAdjustment: round1(seasonAdjustment),
            bodyAdjustment: round1(bodyAdjustment),
            latitudeAdjustment: round1(latitudeAdjustment),
            offshoreCoolingPenalty: round1(offshoreCoolingPenalty),
            onshorePushBonus: round1(onshorePushBonus),
            genericWindMixingPenalty: round1(genericWindMixingPenalty),
            autumnCoolingPenalty: round1(autumnCoolingPenalty),
            winterPenalty: round1(winterPenalty),
            rawEstimateBeforeRules: round1(rawEstimateBeforeRules),
            finalTemp: round1(finalTemp),
            uncertainty: round1(uncertainty),
            seasonPhase: season.phase,
            seasonLabel: season.label,
            bodyDefinition: bodyDefinition.summary,
            windDefinition: windDefinition.summary
        }
    };
}
