# Remaining Extraction Work — forecast-fit main.ts

## Context

We are extracting logic from the ~7,000-line `src/main.ts` monolith into component and feature modules. The file has `// @ts-nocheck` at line 1, so TypeScript won't catch missing imports there — but extracted modules must have proper types.

**Extraction strategy:** Functions that read global state get those globals as explicit parameters. Local wrapper stubs remain in `main.ts` to preserve all `window.xxx` exports and existing call sites unchanged.

---

## Completed

- `src/utils/math.ts` — `isFiniteNumber`, `firstFinite`, `round1`, `clamp`, `average`
- `src/utils/format.ts` — `escapeHtml`, `countryFlag`, `degreesToCompass`, `windDirectionHtml`, `weatherIconHtml`, `formatWindTooltip`
- `src/utils/dateTime.ts` — all date/time parse and format helpers
- `src/components/WarningPanel.ts` — UV/AQI badges, warning generators, warning panel renderers
- `src/components/ForecastCells.ts` — `renderForecastBlock(data, selection, profile, activity, routeSamples)`
- `src/components/ForecastChart.ts` — `buildForecastChart`, `getForecastChartTooltipPortal`, `bindForecastChartTooltips`
- `src/components/BestWindowPanel.ts` — timeline HTML, results renderer, all scoring/formatting helpers
- `src/app/state.ts` — `AppState`, `BestWindowAnalysis`, `RouteState`, `WeatherData` interfaces + `initialState`
- `src/app/render.ts` — `renderForecastSection`, `renderBestWindowSection`
- `src/app/actions.ts` — `bindDelegatedAction`
- `src/main.ts` wired with imports and one-line delegating stubs for all the above

---

## Remaining Steps

### Step 7 — Extract waterTemperatureEstimate.ts

Source: `src/main.ts` lines ~1083–1303.

Extract the heuristic water temperature fallback model and its rendering helpers.

Target file: `src/features/weather/waterTemperatureEstimate.ts` (create new).

Key exports:
- `estimatePseudoWaterTemperature(data, waterBodyType, lat)` — main estimation algorithm (line 1146)
- `applyPseudoWaterEstimateToData(data, lat, waterBodyType)` — attaches estimates to hourly/daily points
- `getWaterConfidenceLabel(confidence)`, `getWaterSignalLevel(confidence)`, `renderWaterSignal(confidence)` — confidence UI
- `formatWaterTemperatureValue(temp)`, `getWaterTemperatureSourceLabel(source)`, `getWaterTemperatureChip(data)`, `renderWaterTemperatureMetaLine(data)` — display helpers
- Private helpers: `getLatitudeBand`, `getSeasonInfo`, `getWaterBodyConfig`, `getRecentDailyRecordsForWater`, `getRecentHourlyRecordsForWater`

Dependencies: `isFiniteNumber`, `round1`, `clamp` from `utils/math.ts`; `getWaterModelSettings()` stays in main.ts (reads UI state).

---

### Step 8 — Extract hazardWarnings.ts

Source: `src/main.ts` lines ~2671–2841.

Extract weather alert and hazard warning logic.

Target file: `src/features/weather/hazardWarnings.ts` (create new).

Key exports:
- `getForecastHazardWarnings(data, selection, point, activity)` — aggregate UV + AQI + ECCC alerts (line 2753)
- `getRouteCheckpointHazardWarnings(checkpoints, activity)` — warnings for route checkpoints
- `renderWeatherHazardWarnings(warnings, container)` — render hazard HTML
- `renderRouteCheckpointHazardWarnings(warnings, container)` — route-specific warning render
- Private helpers: `isProbablyCanadaPoint`, `pointInRing`, `ecccFeatureContainsPoint`, `isActiveEcccAlertFeature`, `normalizeEcccAlertFeature`, `dedupeAlerts`, `getAqiHazardWarning`, `getUvHazardWarning`, `getRouteUvHazardWarning`, `renderGenericWarningList`

Dependencies: `escapeHtml`, `formatShortTime` from utils; `getAqiInfo` from `data/aqiScale`; `isOutdoorUvRelevantActivity`, `getUvRiskInfo` from existing modules.

---

### Step 9 — Extract routeCheckpoints.ts

Source: `src/main.ts` lines ~1607–1900.

Extract the checkpoint timing model and smart sampling logic.

Target file: `src/features/route/routeCheckpoints.ts` (create new).

Key exports:
- `buildRouteTimingModel(totalMinutes, routePoints, activity)` — builds cumulative-minute mapping (line 1648)
- `getSmartCheckpointConfig(durationMinutes, weatherVolatility, terrainVolatility)` — adaptive interval/gap
- `getSolarCheckpointEvents(data, startTime, endTime)` — sunrise/sunset events within window
- `sampleRouteCheckpointsSmart(routeState, data, activity, durationMinutes, startTime)` — main smart sampler
- `sampleRouteCheckpointsOld(routeState, durationMinutes, startTime)` — legacy fallback
- Helpers: `bearingDegrees`, `findNearestPointIndexByKm`, `findNearestPointIndexByMinute`, `getRouteBearingAtIndex`, `describeRelativeWind`, `getWeatherVolatilityScore`, `getTerrainVolatilityScore`, `buildCheckpointFromIndex`, `mergeCheckpointCandidate`, `pruneCheckpointCandidates`, `applyBaseCheckpointLabels`, `markSmartWeatherEventCheckpoints`

Dependencies: `isFiniteNumber`, `firstFinite` from utils; `parseAnyTime`, `addMinutesToLocalString` from `utils/dateTime.ts`; `getSegmentTimeFactor` stays in main.ts (activity-specific table).

---

### Step 10 — Extract routeMapRendering.ts

Source: `src/main.ts` lines ~1539–2110 (non-checkpoint portions).

Extract Leaflet map management and route rendering.

Target file: `src/features/route/routeMapRendering.ts` (create new).

Key exports:
- `initRouteMap(container)` — create Leaflet map and layer groups
- `renderRouteMap(routeState, checkpoints)` — draw polyline + markers + fit bounds
- `refreshRouteMapTheme(map, tileLayer)` — update tiles on theme change
- `clearRouteMapLayers(map, routeLayer, markersLayer)` — clear layers
- `buildRouteCheckpointMarker(checkpoint)` — marker styling
- `getInterpolatedForecastPointFromHourly(data, timeStr)` — interpolate weather at checkpoint time
- `summarizeCheckpointWeatherWindow(data, startStr, endStr)` — weather summary for popup
- `fetchRouteCheckpointForecast(checkpoint, lat, lon)` — fetch weather for a single checkpoint
- `refreshRouteWeatherIfPossible(routeState, checkpoints, weatherData)` — batch fetch all checkpoints
- `handleRouteFileChange(file, onLoaded)` — parse GPX/GeoJSON upload
- `clearRoute()` — clear route state and map

Dependencies: Leaflet (`L`), `isFiniteNumber` from utils; `parseAnyTime`, `formatShortTime` from utils; `describeRelativeWind`, `getRouteBearingAtIndex` from `routeCheckpoints.ts`.

---

### Step 11 — Extract roadTripItinerary.ts

Source: `src/main.ts` lines ~6113–6361.

Extract road trip stop generation and itinerary rendering.

Target file: `src/features/route/roadTripItinerary.ts` (create new).

Key exports:
- `buildSuggestedRoadTripStops(routeCheckpoints, routeState, weatherData, activity, startTime)` — generate stops (line 6265 area)
- `triggerRoadTripItinerary()` — orchestrator: fetch weather → build stops → render (line 6265)
- `getMaxRenderedRoadTripStops(distanceKm, durationMinutes)` — adaptive render limit
- `trimRoadTripStopsForDisplay(stops, maxCount)` — sample stops to fit limit
- Private helpers: `reverseGeocodePlaceName(lat, lon)`, `describeRoadTripWeather(checkpoint)`, `buildRoadTripRationale(stop, prevStop)`, `findNearestRoutePointForFraction(routePoints, fraction)`

Dependencies: `interpolateNumber`, `firstFinite`, `isFiniteNumber` from utils; `formatShortTime` from utils; `getInterpolatedForecastPointFromHourly`, `summarizeCheckpointWeatherWindow` from `routeMapRendering.ts`; `addMinutesToLocalString` from `utils/dateTime.ts`.

---

### Step 12 — Extract candidateScoring.ts

Source: `src/main.ts` lines ~4181–4949 (the portion not already in BestWindowPanel).

Extract the best-window candidate evaluation and scoring logic.

Target file: `src/features/best-window/candidateScoring.ts` (create new).

Key exports:
- `scoreBestWindowCandidate(candidate, routeMetrics, options)` — multi-factor weighted score (line 4609)
- `evaluateBestWindowBaseCandidate(startStr, data, options)` — build candidate with forecast selection and weather summary
- `refineBestWindowCandidateWithRoute(candidate, routeState, activity, checkpointModel)` — add route weather if route exists
- `getTimeDomainSummary(points)` — aggregate weather stats
- `getWindComponents(windSpeed, windDir, bearingDeg)` — decompose wind into headwind/cross/tail
- `getBestWindowWeights(priority, activity)` — weighting model per activity/priority
- `getBestWindowConstraintValues(activity, priority)` — comfort constraints
- Helpers: `summarizeRouteCandidateSamples`, `getCandidateRouteTimingModel`, route checkpoint variants (`getSmartCheckpointConfigFor`, `getSolarCheckpointEventsForData`, `buildCheckpointFromIndexForStart`, `applyCheckpointLabelsForModel`, `markSmartWeatherEventCheckpointsForModel`, `getRouteSamplesForStart`)

Dependencies: `isFiniteNumber`, `firstFinite` from utils; `getForecastSelection` stays in main.ts (reads UI state); `parseAnyTime`, `addMinutesToLocalString` from `utils/dateTime.ts`; `describeLight` from `forecastHelpers.ts` (Step 15).

---

### Step 13 — Extract clothingWizard.ts

Source: `src/main.ts` lines ~5022–5704+ (the largest remaining block).

Extract the multi-activity clothing decision engine.

Target file: `src/features/gear/clothingWizard.ts` (create new).

Key exports:
- `buildWizard(data, activity, selection, profile, effort, tempPref, raceDayMode, routeSamples)` — main decision engine (line 5022); currently reads many globals — make them explicit params
- `renderSteps(steps, container)` — HTML rendering of wizard steps
- `renderChoiceChecklist(step, container)` — interactive checklist with edit/done states
- `syncInteractiveAdvice(container)` — keep checkmarks in sync with UI
- `clearDoneItems(container)`, `resetWizardStep(stepEl)`, `resetAllWizard(container)` — reset handlers
- Factory helpers: `makeChoiceStep`, `makeListStep`, `item`, `option`
- Display helpers: `compactStepTitle`, `buildCompactSummary`, `getClothingExamples`, `extractOptionPieces`, `toChecklistTitle`

Dependencies: `isFiniteNumber`, `firstFinite` from utils; `formatShortTime` from utils; `getEyewearSuggestionItem` from `eyewearRecommendations.ts` (Step 14); `getAqiInfo` from `data/aqiScale`; activity classification helpers from `activityRules.ts` or inline.

Note: `buildWizard` is ~700 lines of nested decision logic. Extract the function body faithfully without refactoring — just make globals explicit params.

---

### Step 14 — Extract eyewearRecommendations.ts

Source: `src/main.ts` lines ~2866–2905 + small utility functions.

Target file: `src/features/gear/eyewearRecommendations.ts` (create new).

Key exports:
- `getEyewearSuggestionItem(activity, point, planned, light, wetLike, isRaceDay)` — main recommendation (line 2866)
- `isWet(weatherCode)` — check if condition involves water
- `isSnowy(weatherCode)` — check if condition is snowy
- `getCyclingEffectiveTemp(tempC, windSpeedKmh)` — wind-chill-adjusted temp for cycling

Dependencies: `getUvDisplayValue`, `getClothingExamples` (the latter stays in `clothingWizard.ts` after Step 13, so import from there).

---

### Step 15 — Extract forecastHelpers.ts

Source: `src/main.ts` lines ~4949–5021.

Target file: `src/features/forecast/forecastHelpers.ts` (create new).

Key exports:
- `getDayRecord(data, timeStr)` — extract daily summary for a given time string (line 4949)
- `describeLight(data, timeStr)` — classify light conditions (sunrise/sunset/day/night) with tone
- `getTimeDomainSummary(points)` — aggregate weather stats across a set of hourly points (shared with candidateScoring.ts — export from here, import in that module)

Dependencies: `parseAnyTime`, `formatShortTime` from `utils/dateTime.ts`; `isFiniteNumber` from utils.

---

### Step 16 — Extract startTimePicker.ts

Source: `src/main.ts` lines ~3927–3996.

Target file: `src/features/planner/startTimePicker.ts` (create new).

Key exports:
- `getValidLaterRange(data, durationProfile)` — compute min/max valid start times
- `configureLaterInput(data, durationProfile, inputEl, startMode)` — set up flatpickr/native input bounds
- `getSelectedStartTime(data, startMode, bestWindowSelectedStart, bestWindowAnalysis)` — resolve active start time (line 3976); currently reads globals — make explicit params
- `getHourlyPointForStart(data, startTime)` — fetch or interpolate hourly point

Dependencies: `parseAnyTime`, `formatShortTime`, `formatDateTimeLocal` from `utils/dateTime.ts`; `getDurationProfile` stays in main.ts (reads UI state); flatpickr types.

---

### Step 17 — Extract weatherDataFetch.ts

Source: `src/main.ts` line ~3823.

Target file: `src/features/weather/weatherDataFetch.ts` (create new).

Key exports:
- `fetchWeatherCore(place)` — main orchestrator: coordinates Open-Meteo, marine, ECCC alerts, AQI fetches; builds unified data object; applies water temp estimates (line 3823, ~100 lines)

Dependencies: `buildOpenMeteoForecastUrl`, `fetchMarineDataWithFallback`, `fetchEcccWeatherAlertsForPoint`, `fetchAirQuality`, `applyPseudoWaterEstimateToData` from `waterTemperatureEstimate.ts` (Step 7); `isFiniteNumber`, `round1` from utils.

---

### Step 18 — Extract marineDataFallbacks.ts

Source: `src/main.ts` lines ~3186–3746 (remaining inline portions after existing module delegation).

Target file: `src/features/weather/marineDataFallbacks.ts` (create new).

Key exports:
- `fetchNdbcMarineFallback(lat, lon)` — NDBC buoy fallback fetch
- `fetchEcccMarineFallback(lat, lon)` — ECCC marine HTML fallback fetch
- `fetchNdbcActiveStations()`, `sortStationsByDistance(stations, lat, lon)`, `fetchNdbcStationObservation(stationId)` — NDBC helpers
- `parseEcccMarineHtml(html)` — parse ECCC marine page
- `hasUsefulMarineSource(data)`, `getNearestMarinePointFromSeries(series, lat, lon)`, `getBestMarinePoint(data)`, `describeMarineSource(source)` — selection and display helpers

Dependencies: `isFiniteNumber`, `firstFinite`, `round1` from utils; `parseAnyTime` from `utils/dateTime.ts`; API URL constants from existing data modules.

---

### Step 19 — Extract plannerState.ts

Source: `src/main.ts` lines ~280–1600 (distributed — the activity/duration/effort/custom-input state management cluster).

Target file: `src/features/planner/plannerState.ts` (create new).

Key exports:
- Activity/multisport: `selectActivity(activity)`, `selectEventPreset(key)`, `selectDurationKey(key)`, `toggleActivityGroup(groupId)`, `renderCustomMultisportControls(container, activity)`, `updateActivityGroupVisibility(activity)`
- Effort/temp preference: `getTemperaturePreferenceInfo(pref)`, `getTemperaturePreferenceTempOffset(pref)`, `updateTemperaturePreferenceUi(pref)`, `getPlannedEffortInfo(effort)`, `getPlannedEffortTempOffset(effort)`, `updatePlannedEffortUi(effort, container)`
- Custom distance/duration/pace: `getDistanceState()`, `getDurationState()`, `getDurationProfile()`, `getCustomDurationMinutes()`, `getDerivedDurationMinutesFromAverage()`, `getAverageMetric()`, `parseFlexibleDurationMinutes(str)`, `parseFlexiblePace(str)`, `convertDistanceToKm(value, unit)`
- UI rendering: `renderDurationButtons(container, selectedDuration)`, `renderEventButtons(container, selectedEventKey)`, `renderCustomControlOptions(container)`, `updateCustomInputLocks()`, `updateCustomStatusTexts()`, `renderAverageFieldMeta()`, `renderDurationFieldMeta()`
- Race day / manual weather: `toggleRaceDayMode()`, `getCustomWeatherOverride()`, `applyCustomWeatherOverrides(data, overrides)`, `updateManualWeatherStatus()`
- Main render: `renderPlannerState()` — orchestrates all planner UI updates (line 1513)

Dependencies: DOM elements from index.html; `isFiniteNumber`, `round1` from utils; `formatShortTime`, `formatDateTimeLocal` from utils; activity classification helpers; `getSelectedStartTime` from `startTimePicker.ts` (Step 16).

Note: This is the heaviest extraction — `renderPlannerState` calls into many sub-renderers. Extract the helpers first, keep `renderPlannerState` as a delegating stub in main.ts until all its callees are extracted.

---

### Step 20 — Extract quickStartGuide.ts

Source: `src/main.ts` lines ~6371–6530.

Target file: `src/features/ui/quickStartGuide.ts` (create new).

Key exports:
- `getQuickStartSteps(activity, routeState, weatherData)` — build contextual step guide (line 6371); make globals explicit params
- `renderQuickStartGuide(steps, container)` — render guide HTML
- `openQuickStartGuide()`, `closeQuickStartGuide()` — toggle overlay
- `jumpToQuickStartTarget(targetId)` — scroll to matching section
- Helper: `getQuickStartStateForLocation(activity, routeState, weatherData)` — adapt copy based on context

Dependencies: `isPoolSwimmingActivity`, `isWaterRelevantActivity`, `customMultisportHasWaterLeg` from activity rules; `escapeHtml` from utils; DOM elements (quickStartOverlay, quickStartSteps, quickStartCloseBtn).

---

## Build Verification (after each step)

```bash
npm run build        # zero TypeScript errors, all modules resolve
```

After all steps complete:
```bash
npm run build
# Confirm module count increased and app behaves identically
```

---

## Reference

- Extraction pattern: globals → explicit params; local wrapper stubs in main.ts preserve `window.xxx` exports
- `clusterWindows.ts` has its own local `firstFinite` with different semantics — do NOT unify with `utils/math.ts`
- `src/main.ts` has `// @ts-nocheck` at line 1 — TypeScript won't catch missing imports there, but extracted modules must have proper types
- Run `npm run build` after each step, not just at the end
