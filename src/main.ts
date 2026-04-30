// @ts-nocheck
import 'leaflet/dist/leaflet.css';
import 'flatpickr/dist/flatpickr.min.css';
import './styles/base.css';
import './styles/theme.css';
import './styles/components.css';
import './styles/forecast.css';
import './styles/map.css';
import './styles/responsive.css';
import { registerServiceWorker } from './registerServiceWorker';
import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';
import * as L from 'leaflet';
import flatpickr from 'flatpickr';
import JSZip from 'jszip';
import {
  ECCC_ALERTS_API as SHARED_ECCC_ALERTS_API,
  GEO_API as SHARED_GEO_API,
  LOCATION_PRIORITY_COUNTRY_CODES,
  MARINE_API as SHARED_MARINE_API,
  NOAA_NDBC_ACTIVE_XML as SHARED_NOAA_NDBC_ACTIVE_XML,
  NOAA_NDBC_REALTIME_BASE as SHARED_NOAA_NDBC_REALTIME_BASE,
  NORTH_AMERICA_COUNTRY_CODES,
  NOMINATIM_SEARCH_API as SHARED_NOMINATIM_SEARCH_API,
  WEATHER_API as SHARED_WEATHER_API,
  WESTERN_EUROPE_COUNTRY_CODES,
} from './data/constants';
import {
  durationOrder as SHARED_DURATION_ORDER,
  durationProfiles as SHARED_DURATION_PROFILES,
} from './data/durationProfiles';
import { activityLabels as SHARED_ACTIVITY_LABELS } from './data/activityPresets';
import {
  averageUnitOptionsByActivity as SHARED_AVERAGE_UNIT_OPTIONS_BY_ACTIVITY,
  avgDeriveActivities as SHARED_AVG_DERIVE_ACTIVITIES,
  distanceUnitOptionsByActivity as SHARED_DISTANCE_UNIT_OPTIONS_BY_ACTIVITY,
} from './data/activityOptions';
import { eventPresetsByActivity as SHARED_EVENT_PRESETS_BY_ACTIVITY } from './data/eventPresets';
import { getUvCategory as getSharedUvCategory } from './data/uvScale';
import {
  addMinimumBestWindowFallbacks as addMinimumBestWindowFallbacksFromModule,
  clusterBestWindowCandidates as clusterBestWindowCandidatesFromModule,
  getBestWindowCondenseMinutes as getBestWindowCondenseMinutesFromModule,
  makeBestWindowClusterFromCandidate as makeBestWindowClusterFromCandidateFromModule,
  rankBestWindowCluster as rankBestWindowClusterFromModule,
} from './features/best-window/clusterWindows';
import { getTimelineTickConfig as getSharedTimelineTickConfig } from './features/best-window/timelineTicks';
import {
  effortRelevantActivities as SHARED_EFFORT_RELEVANT_ACTIVITIES,
  noLocationIndoorActivities as SHARED_NO_LOCATION_INDOOR_ACTIVITIES,
} from './features/gear/activityRules';
import {
  paddleDistanceActivities as SHARED_PADDLE_DISTANCE_ACTIVITIES,
  waterDistanceActivities as SHARED_WATER_DISTANCE_ACTIVITIES,
  waterExposureActivities as SHARED_WATER_EXPOSURE_ACTIVITIES,
} from './features/gear/waterRules';
import { fetchEcccWeatherAlertsForPoint as fetchEcccWeatherAlertsForPointFromModule } from './features/weather/ecccAlertsClient';
import {
  buildMarinePayloadFromEccc as buildMarinePayloadFromEcccFromModule,
  buildMarinePayloadFromNdbcStation as buildMarinePayloadFromNdbcStationFromModule,
  buildMarinePayloadFromOpenMeteo as buildMarinePayloadFromOpenMeteoFromModule,
  describeMarineSource as describeMarineSourceFromModule,
  ECCC_MARINE_STATIONS as SHARED_ECCC_MARINE_STATIONS,
  getBestMarinePoint as getBestMarinePointFromModule,
  getNearestMarinePointFromSeries as getNearestMarinePointFromSeriesFromModule,
  hasUsefulMarineSource as hasUsefulMarineSourceFromModule,
  sanitizeMarineSource as sanitizeMarineSourceFromModule,
} from './features/weather/marineClient';
import {
  buildOpenMeteoForecastUrl,
  dedupeSearchResults as dedupeSearchResultsFromModule,
  getLocationPriorityScore as getLocationPriorityScoreFromModule,
  normalizeSearchResult as normalizeSearchResultFromModule,
  searchPlaces as searchPlacesFromModule,
} from './features/weather/openMeteoClient';
import { weatherCodeToEmoji } from './features/weather/weatherCodes';
import {
  dedupeAlerts as dedupeAlertsFromModule,
  ecccFeatureContainsPoint as ecccFeatureContainsPointFromModule,
  isActiveEcccAlertFeature as isActiveEcccAlertFeatureFromModule,
  isProbablyCanadaPoint as isProbablyCanadaPointFromModule,
  normalizeEcccAlertFeature as normalizeEcccAlertFeatureFromModule,
  pointInRing as pointInRingFromModule,
  shouldUseEcccAlertsForWeatherData,
} from './features/weather/warnings';
import {
  parseRouteFile as parseUploadedRouteFile,
  parseRouteText as parseUploadedRouteText,
} from './features/route/parseRouteText';
import { parseGeoJsonRouteObject as parseGeoJsonRouteObjectFromModule } from './features/route/parseGeoJson';
import { parseXmlRouteDocument as parseXmlRouteDocumentFromModule } from './features/route/parseGpx';
import { normalizeRoutePoints as normalizeRoutePointsFromModule } from './features/route/parseGeoJson';
import { buildRouteStateModel } from './features/route/routeMetrics';
import { getSegmentTimeFactor as getSegmentTimeFactorFromModule } from './features/route/routeTiming';
import { haversineKm } from './utils/distance';
import { fetchAirQuality, matchAqiToHourlyTime } from './features/weather/airQualityClient';
import { getAqiInfo } from './data/aqiScale';
import {
  bindForecastChartTooltips as bindForecastChartTooltipsFromModule,
  buildForecastChart as buildForecastChartFromModule,
  getForecastChartTooltipPortal as getForecastChartTooltipPortalFromModule,
} from './components/ForecastChart';
import { renderForecastBlock as renderForecastBlockFromModule } from './components/ForecastCells';
import {
  bestWindowRangeOverrunMinutes as bestWindowRangeOverrunMinutesFromModule,
  buildBestWindowReasons as buildBestWindowReasonsFromModule,
  formatBestWindowOverrunWarning as formatBestWindowOverrunWarningFromModule,
  formatBestWindowSpan as formatBestWindowSpanFromModule,
  formatBestWindowTimelineTickLabel as formatBestWindowTimelineTickLabelFromModule,
  getBestWindowActivityRange as getBestWindowActivityRangeFromModule,
  getBestWindowClusterStartRangeInfo as getBestWindowClusterStartRangeInfoFromModule,
  getBestWindowComfortBand as getBestWindowComfortBandFromModule,
  getBestWindowPresetLabel as getBestWindowPresetLabelFromModule,
  getBestWindowPrioritySummary as getBestWindowPrioritySummaryFromModule,
  getBestWindowRankClass as getBestWindowRankClassFromModule,
  getBestWindowRankEmoji as getBestWindowRankEmojiFromModule,
  getBestWindowRankLabel as getBestWindowRankLabelFromModule,
  getBestWindowTimelineDayBoundaryTicks as getBestWindowTimelineDayBoundaryTicksFromModule,
  getBestWindowTimelineHtml as getBestWindowTimelineHtmlFromModule,
  getBestWindowTimelineTickConfig as getBestWindowTimelineTickConfigFromModule,
  renderBestWindowResults as renderBestWindowResultsFromModule,
} from './components/BestWindowPanel';
import { STRAVA_BACKEND_URL } from './data/constants';
import { clearStravaSession, consumeStravaOAuthCallback, getStravaAuthError, getStravaSession } from './features/strava/stravaAuth';
import { fetchStravaActivities, fetchStravaActivityStreams, fetchStravaRouteGpx, fetchStravaRoutes } from './features/strava/stravaClient';
import { stravaActivityStreamsToImportedRoute, stravaRouteGpxToImportedRoute, stravaRouteSummaryToImportedRoute } from './features/strava/stravaRouteAdapter';

Object.assign(window, { L, flatpickr, JSZip });
registerServiceWorker();
inject();
injectSpeedInsights();
if (consumeStravaOAuthCallback()) {
  setTimeout(() => renderStravaConnectionStateEnhanced(), 0);
}

/**
 * Forecast Fit
 * ---------------------------------------------------------------------------
 * Single-file weather + clothing planner.
 *
 * Main flow:
 * 1) Resolve a location (typed place, current location, or uploaded route)
 * 2) Fetch weather + marine data
 * 3) Pick an activity, event, distance, duration, and start time
 * 4) Build a forecast slice for that exact window
 * 5) Render a compact clothing wizard and route checkpoint weather
 *
 * Handy tweak points:
 * - durationProfiles: preset durations and display modes
 * - eventPresetsByActivity: default events / typical distances
 * - buildWizard(): clothing logic and step content
 * - buildForecastChart(): SVG chart + HTML hover tooltip + sunrise / sunset markers
 * - configureLaterInput(): JS date-time picker range / locking
 * - buildRouteState() / sampleRouteCheckpoints(): route parsing and weather sampling
 * - buildRouteWeatherHtml(): route checkpoint cards
 *
 * v9.4 maintenance notes:
 * - Road-trip itineraries now use a dynamic rendered-stop limit instead of
 *   a hard cap of 10. The cap grows with planned duration and route distance.
 * - When an itinerary still needs trimming, the visible list is evenly sampled
 *   across the whole route so the beginning, middle, and finish remain useful.
 * - The comments in this file intentionally explain the major data flows because
 *   this single-file prototype has grown into a fairly dense planning tool.
 * - v9.4.1 reorganizes the activity picker: indoor activities now live
 *   together, while outdoor swimming and surface-water sports are separated
 *   into clearer groups.
 * - v9.5 lets indoor-only activities render guidance before any location is
 *   selected. Weather-aware commute layers appear again once a location is set.
 * - v9.5 adds a quick-start helper overlay. The guide follows the visual order
 *   of the page and each step can jump to the matching section.
 * - v9.5.1 fixes the race-day exit animation: once the planner card has
 *   completed its first page-load fade-in, toggling race mode off no longer
 *   replays the initial fade/slide animation.
 * - v9.6 adds an indoor multisport activity as a no-location indoor guide. It
 *   also leaves the existing triathlon presets intact; a future multisport
 *   builder should let users manually pick legs/sports without making the quick
 *   preset flow slower.
 * - v9.7 adds Planned effort. It is an activity-context modifier: low-effort
 *   outings ask for more warmth, hard/race efforts ask for less, and the
 *   displayed weather remains untouched.
 * - v9.8.5 moves the Activity & parameters reset button into the section heading row.
 * - v9.8.3 fixes the v9.8.2 startup crash caused by accordion state being read before initialization.
 * - v9.8.2 fixes two regressions from the v9.8.1 cleanup pass:
 *   activity accordion clicks now use a delegated event listener, and the chart
 *   tooltip binding is back on each SVG hit rectangle while still using the
 *   body-level portal so the tooltip does not clip.
 * - v9.8.1 restores chart tooltip reliability and re-adds precip chance
 *   alongside precipitation amount in the hourly chart/table.
 * - v9.8.12 aligns UV categories with ECCC / Health Canada guidance,
 *   adds UV colour badges, and uses official Environment Canada weather alerts
 *   for Canadian locations when available.
 * - v9.8.14 trims UV display inside forecast cells to the category/rating
 *   only, while keeping the rest of each cell's weather data intact.
 * - v9.8.9 keeps at least two best-window options when enough candidate
 *   starts exist, adds adaptive major/minor timeline ticks, and adds date ticks
 *   when activity windows cross into another day.
 * - v9.8.8 condenses nearby best-window starts into 2–6 distinct choices,
 *   flags options whose activity extends past the search end, and brings the
 *   selected timeline item above overlapping windows.
 * - v9.8.7 hides water-temperature fallback chips/notes for non-water
 *   activities and expands Best window with medal styling plus runner-ups.
 * - v9.8 adds a custom multisport leg builder, collapsible/accordion activity
 *   groups, automatic Location & route collapse after loading, route-only
 *   checkpoint controls, and viewport-bound chart tooltips that no longer clip
 *   at the top of the chart.
 */
const GEO_API = SHARED_GEO_API;
const NOMINATIM_SEARCH_API = SHARED_NOMINATIM_SEARCH_API;
const WEATHER_API = SHARED_WEATHER_API;
const MARINE_API = SHARED_MARINE_API;
const ECCC_ALERTS_API = SHARED_ECCC_ALERTS_API;
const NOAA_NDBC_ACTIVE_XML = SHARED_NOAA_NDBC_ACTIVE_XML;
const NOAA_NDBC_REALTIME_BASE = SHARED_NOAA_NDBC_REALTIME_BASE;
const ECCC_MARINE_STATIONS = SHARED_ECCC_MARINE_STATIONS;
let ndbcActiveStationsCache = null;

let selectedActivity = null;
let selectedEventKey = null;
let selectedDuration = 'h1';
let checkpointModel = 'smart';
let startMode = 'now';
let raceDayMode = false;
let manualWeatherPanelOpen = false;
let temperaturePreference = 0;
let plannedEffort = 'steady';
let weatherData = null;
let suggestionsData = [];
let focusedIndex = -1;
let debounceTimer = null;

const input = document.getElementById('location-input');
const fetchBtn = document.getElementById('fetch-btn');
const currentLocationBtn = document.getElementById('current-location-btn');
const refreshWeatherBtn = document.getElementById('refresh-weather-btn');
const resultCard = document.getElementById('result-card');
const resultInner = document.getElementById('result-inner');
const suggestionsPortal = document.getElementById('suggestions-portal');
const laterBox = document.getElementById('later-box');
const laterInput = document.getElementById('later-input');
const laterStatus = document.getElementById('later-status');
const bestWindowBox = document.getElementById('best-window-box');
const bestWindowStartInput = document.getElementById('best-window-start-input');
const bestWindowEndInput = document.getElementById('best-window-end-input');
const bestWindowPrioritySelect = document.getElementById('best-window-priority-select');
const bestWindowStepSelect = document.getElementById('best-window-step-select');
const bestWindowMaxPrecipInput = document.getElementById('best-window-max-precip-input');
const bestWindowMaxGustInput = document.getElementById('best-window-max-gust-input');
const bestWindowMinTempInput = document.getElementById('best-window-min-temp-input');
const bestWindowMaxTempInput = document.getElementById('best-window-max-temp-input');
const bestWindowMinWaterInput = document.getElementById('best-window-min-water-input');
const bestWindowFinishDaylightInput = document.getElementById('best-window-finish-daylight-input');
const bestWindowStatus = document.getElementById('best-window-status');
const bestWindowNote = document.getElementById('best-window-note');
const bestWindowResults = document.getElementById('best-window-results');
const customDistanceInput = document.getElementById('custom-distance-input');
const distanceUnitSelect = document.getElementById('distance-unit-select');
const distanceStatus = document.getElementById('distance-status');
const customDurationInput = document.getElementById('custom-duration-input');
const durationUnitSelect = document.getElementById('duration-unit-select');
const durationStatus = document.getElementById('duration-status');
const averageInput = document.getElementById('average-input');
const averageUnitSelect = document.getElementById('average-unit-select');
const averageStatus = document.getElementById('average-status');
const averageLabel = document.getElementById('average-label');
const raceDayModeBtn = document.getElementById('race-day-mode-btn');
const manualWeatherToggleBtn = document.getElementById('manual-weather-toggle-btn');
const manualWeatherPanel = document.getElementById('manual-weather-panel');
const manualWaterTempInput = document.getElementById('manual-water-temp-input');
const manualWeatherStatus = document.getElementById('manual-weather-status');
const waterBodyTypeSelect = document.getElementById('water-body-type-select');
const windExposureSelect = document.getElementById('wind-exposure-select');
const poolTypeSelect = document.getElementById('pool-type-select');
const temperaturePreferenceInput = document.getElementById('temperature-preference-input');
const temperaturePreferenceLabel = document.getElementById('temperature-preference-label');
const temperaturePreferenceStatus = document.getElementById('temperature-preference-status'); 
const plannedEffortLabel = document.getElementById('planned-effort-label');
const plannedEffortStatus = document.getElementById('planned-effort-status');
const plannedEffortRow = document.getElementById('planned-effort-row');
const waterModelStatus = document.getElementById('water-model-status');
const checkpointModelStatus = document.getElementById('checkpoint-model-status');
const routeFileInput = document.getElementById('route-file-input');
const clearRouteBtn = document.getElementById('clear-route-btn');
const routeStatus = document.getElementById('route-status');
const stravaConnectPanel = document.getElementById('strava-connect-panel');
const stravaStatus = document.getElementById('strava-status');
const mapCard = document.getElementById('map-card');
const routeSummary = document.getElementById('route-summary');
const locationCardToggleBtn = document.getElementById('location-card-toggle-btn');
const locationCardBody = document.getElementById('location-card-body');
const locationCardSummary = document.getElementById('location-card-summary');
const plannerCardToggleBtn = document.getElementById('planner-card-toggle-btn');
const plannerCardBody = document.getElementById('planner-card-body');
const quickStartOverlay = document.getElementById('quick-start-overlay');
const quickStartSteps = document.getElementById('quick-start-steps');
const quickStartCloseBtn = document.getElementById('quick-start-close-btn');
const stravaPickerOverlay = document.getElementById('strava-picker-overlay');
const stravaPickerTabs = document.getElementById('strava-picker-tabs');
const stravaPickerStatus = document.getElementById('strava-picker-status');
const stravaPickerList = document.getElementById('strava-picker-list');
const stravaPickerCloseBtn = document.getElementById('strava-picker-close-btn');
const customMultisportSection = document.getElementById('custom-multisport-section');
const customMultisportSummary = document.getElementById('custom-multisport-summary');
const customMultisportStatus = document.getElementById('custom-multisport-status');
const customMultisportLegList = document.getElementById('custom-multisport-leg-list');

// Custom multisport builder state.
// Triathlon and indoor multisport still keep their fast presets, but these
// selections let the checklist follow the sports/legs the user actually plans.
const customMultisportDefinitions = {
  triathlon: [
    { key: 'swim', label: 'Swim', detail: 'Open-water or race swim', water: true },
    { key: 'bike', label: 'Bike', detail: 'Outdoor bike leg' },
    { key: 'run', label: 'Run', detail: 'Run leg' },
    { key: 'transition', label: 'Transition', detail: 'T1/T2 practice' },
    { key: 'strength', label: 'Strength', detail: 'Gym or activation block' }
  ],
  indoor_multisport: [
    { key: 'indoor_pool', label: 'Indoor pool', detail: 'Pool swim' },
    { key: 'indoor_bike', label: 'Indoor bike / velodrome', detail: 'Trainer, spin, or track' },
    { key: 'indoor_run', label: 'Indoor run', detail: 'Track or treadmill' },
    { key: 'gym', label: 'Gym / strength', detail: 'Lifting or conditioning' },
    { key: 'mobility', label: 'Mobility', detail: 'Warm-up / cooldown' }
  ]
};
const defaultMultisportSelections = {
  triathlon: ['swim', 'bike', 'run'],
  indoor_multisport: ['indoor_bike', 'indoor_run']
};
let customMultisportSelections = {
  triathlon: [...defaultMultisportSelections.triathlon],
  indoor_multisport: [...defaultMultisportSelections.indoor_multisport]
};

let routeState = null;
let stravaPickerTab = 'routes';
let stravaPickerLoading = false;
let stravaPickerImporting = false;
let stravaPickerRoutes = [];
let stravaPickerActivities = [];
let stravaPickerRoutesLoaded = false;
let stravaPickerActivitiesLoaded = false;
let stravaPickerRouteError = '';
let stravaPickerActivityError = '';
let routeMap = null;
let routeLayer = null;
let routeMarkersLayer = null;
let routeTileLayer = null;
let laterPicker = null;
let bestWindowStartPicker = null;
let bestWindowEndPicker = null;
let locationCardCollapsed = false;
let plannerCardCollapsed = false;
let bestWindowAnalysis = null;
let bestWindowAnalysisKey = '';
let bestWindowSelectedStart = null;
let bestWindowDebounceTimer = null;
let bestWindowAnalysisToken = 0;

// Duration presets drive both clothing bias and the forecast window.
const durationProfiles = SHARED_DURATION_PROFILES;
const durationOrder = SHARED_DURATION_ORDER;

function nearestDurationKey(minutes) {
  const mins = Number(minutes);
  if (!Number.isFinite(mins) || mins <= 0) return 'h2';
  return durationOrder.reduce((bestKey, key) => {
    const bestMinutes = durationProfiles[bestKey]?.minutes ?? Infinity;
    const currentMinutes = durationProfiles[key]?.minutes ?? Infinity;
    return Math.abs(currentMinutes - mins) < Math.abs(bestMinutes - mins) ? key : bestKey;
  }, durationOrder[0]);
}

const activityLabels = SHARED_ACTIVITY_LABELS;

// Activities in this set can produce useful clothing/gear guidance without a
// weather lookup. They happen indoors or in a controlled pool environment, so
// the core advice is driven by session type, duration, sweat management, and
// practical before/after layers rather than forecast conditions.
const noLocationIndoorActivities = SHARED_NO_LOCATION_INDOOR_ACTIVITIES;

function isNoLocationIndoorActivity(activity = selectedActivity) {
  return noLocationIndoorActivities.has(activity);
}

function isCustomMultisportActivity(activity = selectedActivity) {
  return activity === 'triathlon' || activity === 'indoor_multisport';
}

function getMultisportDefinitions(activity = selectedActivity) {
  return customMultisportDefinitions[activity] || [];
}

function getSelectedMultisportLegs(activity = selectedActivity) {
  if (!isCustomMultisportActivity(activity)) return [];
  const existing = customMultisportSelections[activity];
  if (Array.isArray(existing) && existing.length) return existing;
  const fallback = defaultMultisportSelections[activity] || [];
  customMultisportSelections[activity] = [...fallback];
  return customMultisportSelections[activity];
}

function getSelectedMultisportLegDetails(activity = selectedActivity) {
  const selected = new Set(getSelectedMultisportLegs(activity));
  return getMultisportDefinitions(activity).filter(def => selected.has(def.key));
}

function getSelectedMultisportLegLabels(activity = selectedActivity) {
  return getSelectedMultisportLegDetails(activity).map(def => def.label);
}

function getMultisportSummary(activity = selectedActivity) {
  const labels = getSelectedMultisportLegLabels(activity);
  return labels.length ? labels.join(' + ') : 'No legs selected';
}

function customMultisportHasLeg(activity, key) {
  return getSelectedMultisportLegs(activity).includes(key);
}

function customMultisportHasWaterLeg(activity = selectedActivity) {
  if (!isCustomMultisportActivity(activity)) return false;
  return getSelectedMultisportLegDetails(activity).some(def => def.water || def.key.includes('pool'));
}

function renderCustomMultisportControls() {
  if (!customMultisportSection || !customMultisportLegList) return;
  const visible = isCustomMultisportActivity(selectedActivity);
  customMultisportSection.hidden = !visible;
  if (!visible) return;

  const definitions = getMultisportDefinitions(selectedActivity);
  const selected = new Set(getSelectedMultisportLegs(selectedActivity));
  customMultisportSummary.textContent = getMultisportSummary(selectedActivity);
  customMultisportStatus.textContent = selectedActivity === 'triathlon'
    ? 'Select the event legs you actually need. Removing the swim hides water-temperature relevance; adding transition/strength adds packing/checklist context.'
    : 'Select the indoor blocks you actually plan: pool, bike/velodrome, run, gym, or mobility. This changes the indoor checklist.';
  customMultisportLegList.innerHTML = definitions.map(def => `
    <button class="pick-pill ${selected.has(def.key) ? 'active' : ''}" type="button" data-action="toggleCustomMultisportLeg" data-leg-key="${escapeHtml(def.key)}" title="${escapeHtml(def.detail)}">
      ${selected.has(def.key) ? '✓ ' : ''}${escapeHtml(def.label)}
    </button>`).join('');
}

function toggleCustomMultisportLeg(key) {
  if (!isCustomMultisportActivity(selectedActivity)) return;
  const definitions = getMultisportDefinitions(selectedActivity);
  if (!definitions.some(def => def.key === key)) return;
  const current = new Set(getSelectedMultisportLegs(selectedActivity));
  if (current.has(key)) {
    if (current.size === 1) return;
    current.delete(key);
  } else {
    current.add(key);
  }
  customMultisportSelections[selectedActivity] = definitions.filter(def => current.has(def.key)).map(def => def.key);
  renderPlannerState();
  if (!weatherData) refreshIndoorAdviceIfNeeded();
  if (weatherData) renderAdvice(weatherData, selectedActivity);
  if (weatherData) refreshRouteWeatherIfPossible();
  if (weatherData && startMode === 'best') scheduleBestWindowAnalysis(true);
}
window.toggleCustomMultisportLeg = toggleCustomMultisportLeg;

// Activity classification helpers.
// These sets keep the recommendation code from hard-coding long chains of
// activity names every time it needs to know whether water temperature, swim
// pace, or paddle-style distance handling should apply.
const waterExposureActivities = SHARED_WATER_EXPOSURE_ACTIVITIES;
const waterDistanceActivities = SHARED_WATER_DISTANCE_ACTIVITIES;
const paddleDistanceActivities = SHARED_PADDLE_DISTANCE_ACTIVITIES;

// Location search priority.
// Open-Meteo can return many cities with the same name. These country-code sets
// gently sort North America first and Western Europe second without filtering out
// other valid world locations.
const locationPriorityCountryCodes = new Set(LOCATION_PRIORITY_COUNTRY_CODES);
const northAmericaCountryCodes = new Set(NORTH_AMERICA_COUNTRY_CODES);
const westernEuropeCountryCodes = new Set(WESTERN_EUROPE_COUNTRY_CODES);

function getPoolType() {
  return poolTypeSelect?.value || 'indoor_heated';
}

function isPoolSwimmingActivity(activity = selectedActivity) {
  return activity === 'swimming_pool' || activity === 'swimming_pool_indoor' || activity === 'swimming_pool_outdoor';
}

function isWaterRelevantActivity(activity = selectedActivity) {
  if (activity === 'triathlon') return customMultisportHasWaterLeg('triathlon');
  return activity === 'swimming_open' || isWaterExposureActivity(activity) || ((activity === 'swimming_pool' || activity === 'swimming_pool_outdoor') && getPoolType() !== 'indoor_heated');
}

function shouldShowWaterTemperature(activity = selectedActivity, point = null) {
  // Keep water-temperature fallback/source UI out of non-water activities.
  // A measured or estimated water value can still exist on the weather payload,
  // but it should only surface when the chosen activity actually uses water.
  return isWaterRelevantActivity(activity);
}

function isWaterExposureActivity(activity = selectedActivity) {
  return waterExposureActivities.has(activity);
}

function isWaterDistanceActivity(activity = selectedActivity) {
  return waterDistanceActivities.has(activity);
}

function isPaddleDistanceActivity(activity = selectedActivity) {
  return paddleDistanceActivities.has(activity);
}

// Typical event-distance presets shown for each activity.
// These are intentionally broad defaults; custom distance / route upload can override them.
const eventPresetsByActivity = SHARED_EVENT_PRESETS_BY_ACTIVITY;
const distanceUnitOptionsByActivity = SHARED_DISTANCE_UNIT_OPTIONS_BY_ACTIVITY;
const averageUnitOptionsByActivity = SHARED_AVERAGE_UNIT_OPTIONS_BY_ACTIVITY;
const avgDeriveActivities = SHARED_AVG_DERIVE_ACTIVITIES;


function parsePositiveNumber(value) {
  const raw = String(value ?? '').trim().replace(',', '.');
  if (!raw) return null;
  const num = Number(raw);
  return Number.isFinite(num) && num > 0 ? num : null;
}

function renderSelectOptions(select, options, preferred) {
  if (!select) return;
  const chosen = options.some(opt => opt.value === preferred) ? preferred : options[0]?.value;
  select.innerHTML = options.map(opt => `<option value="${escapeHtml(opt.value)}" ${opt.value === chosen ? 'selected' : ''}>${escapeHtml(opt.label)}</option>`).join('');
}

function getDistanceUnitOptions() {
  return distanceUnitOptionsByActivity[selectedActivity] || distanceUnitOptionsByActivity.casual;
}

function getAverageUnitOptions() {
  return averageUnitOptionsByActivity[selectedActivity] || averageUnitOptionsByActivity.casual;
}

function getPreferredAverageUnit(activity = selectedActivity) {
  if (activity === 'running' || activity === 'indoor_running' || activity === 'trail_running') return 'min_per_km';
  if (isWaterDistanceActivity(activity)) return 'min_per_100m';
  return 'kmh';
}

// Temperature preference model.
// The slider changes the *effective* temperature used by the clothing logic, not
// the displayed weather. Positive values mean the user wants to feel warmer, so
// the planner behaves as if the day is colder and recommends more coverage.
// Negative values mean the user runs warm or prefers lighter kit.
function getTemperaturePreferenceInfo(value = temperaturePreference) {
  const safe = Math.max(-4, Math.min(4, Math.round(Number(value) || 0)));
  const map = {
    '-4': { label: 'Maximum warmth', shortLabel: 'warmth ++++', offset: -7, chip: '🧣 max warmth preference' },
    '-3': { label: 'Much warmer', shortLabel: 'warmth +++', offset: -5, chip: '🧣 much warmer preference' },
    '-2': { label: 'Warmer', shortLabel: 'warmth ++', offset: -3.5, chip: '🧣 warmer preference' },
    '-1': { label: 'Slightly warmer', shortLabel: 'warmth +', offset: -1.75, chip: '🧣 slightly warmer preference' },
    '0': { label: 'Normal', shortLabel: 'normal', offset: 0, chip: '' },
    '1': { label: 'Slightly cooler', shortLabel: 'cooler +', offset: 1.75, chip: '🌬 slightly cooler preference' },
    '2': { label: 'Cooler', shortLabel: 'cooler ++', offset: 3.5, chip: '🌬 cooler preference' },
    '3': { label: 'Much cooler', shortLabel: 'cooler +++', offset: 5, chip: '🌬 much cooler preference' },
    '4': { label: 'Maximum cooling', shortLabel: 'cooler ++++', offset: 7, chip: '🌬 max cooling preference' }
  };
  return map[String(safe)] || map['0'];
}

function getTemperaturePreferenceTempOffset() {
  return getTemperaturePreferenceInfo().offset;
}

function updateTemperaturePreferenceUi() {
  const info = getTemperaturePreferenceInfo();
  if (temperaturePreferenceInput) temperaturePreferenceInput.value = String(temperaturePreference);
  if (temperaturePreferenceLabel) temperaturePreferenceLabel.textContent = info.label;
  if (temperaturePreferenceStatus) {
    temperaturePreferenceStatus.textContent = temperaturePreference === 0
      ? 'Neutral setting. Recommendations use the weather, activity, duration, and exposure normally.'
      : `${info.label} setting. The kit logic is nudged by about ${Math.abs(info.offset)}°C ${info.offset < 0 ? 'colder' : 'warmer'} so the recommendation lands ${info.offset < 0 ? 'more insulated' : 'lighter'}.`;
  }
}

// Planned effort model.
// This is separate from Temperature preference:
// - Temperature preference is the user's personal comfort bias.
// - Planned effort is the session's expected heat production.
// The offset is applied to the clothing decision temperature only. It never
// changes the real forecast, water temperature, chart, or displayed weather.
const effortRelevantActivities = SHARED_EFFORT_RELEVANT_ACTIVITIES;

function isEffortRelevantActivity(activity = selectedActivity) {
  return !activity || effortRelevantActivities.has(activity);
}

function getPlannedEffortInfo(value = plannedEffort) {
  const map = {
    low: { label: 'Low / standing', shortLabel: 'low effort', offset: -3.5, chip: '🧍 low-effort warmth' },
    easy: { label: 'Easy', shortLabel: 'easy effort', offset: -1.75, chip: '🚶 easy-effort warmth' },
    steady: { label: 'Steady', shortLabel: 'steady', offset: 0, chip: '' },
    hard: { label: 'Hard', shortLabel: 'hard effort', offset: 2.5, chip: '🔥 hard-effort cooling' },
    race: { label: 'Race', shortLabel: 'race effort', offset: 4, chip: '🏁 race-effort cooling' }
  };
  return map[value] || map.steady;
}

function getPlannedEffortTempOffset(activity = selectedActivity) {
  return isEffortRelevantActivity(activity) ? getPlannedEffortInfo().offset : 0;
}

function updatePlannedEffortUi() {
  const info = getPlannedEffortInfo();
  if (plannedEffortLabel) plannedEffortLabel.textContent = info.label;
  if (plannedEffortRow) {
    plannedEffortRow.querySelectorAll('[data-planned-effort]').forEach(btn => {
      const active = btn.dataset.plannedEffort === plannedEffort;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }
  if (plannedEffortStatus) {
    const relevant = isEffortRelevantActivity();
    plannedEffortStatus.textContent = !relevant
      ? 'This activity does not use effort strongly, so the recommendation stays close to the default.'
      : plannedEffort === 'steady'
        ? 'Steady setting. Clothing logic uses the normal activity and weather assumptions.'
        : `${info.label} setting. The clothing logic is nudged by about ${Math.abs(info.offset)}°C ${info.offset < 0 ? 'colder' : 'warmer'} to account for ${info.offset < 0 ? 'lower heat output' : 'higher heat output'}.`;
  }
}

function selectPlannedEffort(value) {
  plannedEffort = ['low', 'easy', 'steady', 'hard', 'race'].includes(value) ? value : 'steady';
  updatePlannedEffortUi();
  bestWindowAnalysis = null;
  bestWindowAnalysisKey = '';
  bestWindowSelectedStart = null;
  renderPlannerState();
  if (!weatherData) refreshIndoorAdviceIfNeeded();
  if (weatherData) renderAdvice(weatherData, selectedActivity);
  if (weatherData) refreshRouteWeatherIfPossible();
  if (weatherData && startMode === 'best') scheduleBestWindowAnalysis(true);
}
window.selectPlannedEffort = selectPlannedEffort;

function renderAverageFieldMeta() {
  const unit = averageUnitSelect?.value || getPreferredAverageUnit(selectedActivity);
  if (averageLabel) averageLabel.textContent = unit === 'kmh' ? 'Average speed' : 'Average pace';
  if (averageInput) {
    averageInput.placeholder = unit === 'kmh'
      ? (isWaterDistanceActivity(selectedActivity) ? 'e.g. 3.2' : 'e.g. 32')
      : (unit === 'min_per_100m' ? 'e.g. 2:05' : 'e.g. 5:00');
  }
}

function renderDurationFieldMeta() {
  if (!customDurationInput) return;
  const unit = durationUnitSelect?.value || 'h';
  customDurationInput.placeholder = unit === 'min'
    ? 'Optional · 90 or 1:30'
    : unit === 'd'
      ? 'Optional · 2 or 2.5'
      : 'Optional · 5:38 or 5.5';
}

// Re-render unit pickers whenever the activity changes so pace vs speed stays sensible.
function renderCustomControlOptions(forceAveragePreferred = false) {
  renderSelectOptions(distanceUnitSelect, getDistanceUnitOptions(), distanceUnitSelect.value || 'km');
  const preferredAverage = forceAveragePreferred ? getPreferredAverageUnit(selectedActivity) : (averageUnitSelect.value || getPreferredAverageUnit(selectedActivity));
  renderSelectOptions(averageUnitSelect, getAverageUnitOptions(), preferredAverage);
  renderAverageFieldMeta();
  renderDurationFieldMeta();
}

function updateRaceDayModeUi() {
  if (raceDayModeBtn) {
    raceDayModeBtn.classList.toggle('active', !!raceDayMode);
    raceDayModeBtn.setAttribute('aria-pressed', raceDayMode ? 'true' : 'false');
    raceDayModeBtn.textContent = raceDayMode ? 'Race day mode on' : 'Race day mode';
  }
  const plannerCard = document.getElementById('planner-card');
  if (plannerCard) plannerCard.classList.toggle('race-party', !!raceDayMode);
}

function updateManualWeatherToggleUi() {
  if (manualWeatherPanel) manualWeatherPanel.hidden = !manualWeatherPanelOpen;
  if (manualWeatherToggleBtn) {
    manualWeatherToggleBtn.classList.toggle('active', !!manualWeatherPanelOpen);
    manualWeatherToggleBtn.setAttribute('aria-pressed', manualWeatherPanelOpen ? 'true' : 'false');
    manualWeatherToggleBtn.textContent = manualWeatherPanelOpen ? 'Hide manual override' : 'Show manual override';
  }
}

function getCheckpointModelStatusText() {
  return checkpointModel === 'smart'
    ? 'Smart = time-based, terrain/daylight/weather-aware checkpoints with route-aware wind notes. Old = evenly spaced by route progress.'
    : 'Old = evenly spaced route checkpoints by progress. Smart adds time, terrain, daylight, weather events, and route-aware wind notes.';
}

function updateCheckpointModelUi() {
  const routeLoaded = !!routeState?.points?.length;
  const section = document.getElementById('checkpoint-model-section');
  if (section) section.hidden = !routeLoaded;
  document.querySelectorAll('[data-checkpoint-model]').forEach(btn => {
    const active = btn.dataset.checkpointModel === checkpointModel;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
  if (checkpointModelStatus) checkpointModelStatus.textContent = getCheckpointModelStatusText();
}

async function selectCheckpointModel(mode) {
  checkpointModel = mode === 'old' ? 'old' : 'smart';
  updateCheckpointModelUi();
  if (!routeState?.points?.length) return;
  sampleRouteCheckpoints();
  renderRouteMap();
  if (weatherData) {
    await refreshRouteWeatherIfPossible();
    renderAdvice(weatherData, selectedActivity);
    if (startMode === 'best') scheduleBestWindowAnalysis(true);
  }
}
window.selectCheckpointModel = selectCheckpointModel;

function getLocationCardSummaryText() {
  const bits = [];
  if (weatherData?.locationName) bits.push(weatherData.locationName);
  else if (input?.value?.trim()) bits.push(input.value.trim());
  if (routeState?.points?.length) bits.push(`${routeState.fileName} · ${formatKm(routeState.totalKm)}`);
  return bits.join(' · ') || 'No location / route loaded';
}

function updateLocationCardCollapseUi() {
  const loaded = !!(weatherData || routeState?.points?.length);
  if (!loaded) locationCardCollapsed = false;
  if (locationCardToggleBtn) {
    locationCardToggleBtn.hidden = !loaded;
    locationCardToggleBtn.textContent = locationCardCollapsed ? 'Expand' : 'Collapse';
    locationCardToggleBtn.classList.toggle('active', !!locationCardCollapsed);
    locationCardToggleBtn.setAttribute('aria-pressed', locationCardCollapsed ? 'true' : 'false');
  }
  if (locationCardBody) locationCardBody.hidden = loaded && locationCardCollapsed;
  if (locationCardSummary) {
    const summary = getLocationCardSummaryText();
    locationCardSummary.hidden = false;
    locationCardSummary.textContent = summary;
    locationCardSummary.title = summary;
    locationCardSummary.classList.toggle('empty', !loaded);
  }
  updateRefreshWeatherButtonUi();
}

function updateRefreshWeatherButtonUi(isLoading = false) {
  if (!refreshWeatherBtn) return;
  const hasRefreshTarget = !!(weatherData?.latitude && weatherData?.longitude) || !!routeState?.points?.length || !!input?.value?.trim();
  refreshWeatherBtn.disabled = isLoading || !hasRefreshTarget;
  refreshWeatherBtn.textContent = isLoading ? 'Refreshing…' : 'Refresh weather';
}

async function forceRefreshWeather() {
  hideSuggestions();
  const hasCurrentWeatherCoords = weatherData && isFiniteNumber(weatherData.latitude) && isFiniteNumber(weatherData.longitude);
  if (hasCurrentWeatherCoords) {
    await fetchWeatherFromResult({
      latitude: weatherData.latitude,
      longitude: weatherData.longitude,
      name: weatherData.locationName || 'Current location',
      admin1: '',
      country: '',
      country_code: ''
    });
    return;
  }
  if (routeState?.points?.length) {
    await fetchWeatherFromResult({ latitude: routeState.points[0].lat, longitude: routeState.points[0].lon, name: 'Route start', admin1: '', country: '', country_code: '' });
    return;
  }
  await fetchWeather();
}
window.forceRefreshWeather = forceRefreshWeather;

function toggleLocationCardCollapse() {
  if (!(weatherData || routeState?.points?.length)) return;
  locationCardCollapsed = !locationCardCollapsed;
  updateLocationCardCollapseUi();
}
window.toggleLocationCardCollapse = toggleLocationCardCollapse;

function updatePlannerCardCollapseUi() {
  if (plannerCardToggleBtn) {
    plannerCardToggleBtn.textContent = plannerCardCollapsed ? 'Expand' : 'Collapse';
    plannerCardToggleBtn.classList.toggle('active', !!plannerCardCollapsed);
    plannerCardToggleBtn.setAttribute('aria-pressed', plannerCardCollapsed ? 'true' : 'false');
  }
  if (plannerCardBody) plannerCardBody.hidden = plannerCardCollapsed;
}

function togglePlannerCardCollapse() {
  plannerCardCollapsed = !plannerCardCollapsed;
  updatePlannerCardCollapseUi();
}
window.togglePlannerCardCollapse = togglePlannerCardCollapse;


function toggleRaceDayMode() {
  raceDayMode = !raceDayMode;
  syncDurationFromEvent(getSelectedEvent());
  updateRaceDayModeUi();
  renderPlannerState();
  updateRaceDayModeUi();
  updateManualWeatherToggleUi();
  updateLocationCardCollapseUi();
  if (weatherData) renderAdvice(weatherData, selectedActivity);
  if (weatherData) refreshRouteWeatherIfPossible();
  if (weatherData && startMode === 'best') scheduleBestWindowAnalysis(true);
}

window.toggleRaceDayMode = toggleRaceDayMode;

function toggleManualWeatherOverride() {
  manualWeatherPanelOpen = !manualWeatherPanelOpen;
  updateManualWeatherToggleUi();
  updateManualWeatherStatus();
  if (weatherData) renderAdvice(weatherData, selectedActivity);
  if (weatherData && startMode === 'best') scheduleBestWindowAnalysis(true);
}
window.toggleManualWeatherOverride = toggleManualWeatherOverride;

function getVisibleEventPresets() {
  return selectedActivity ? (eventPresetsByActivity[selectedActivity] || []).filter(p => !/_race_day$/.test(p.key)) : [];
}

function getRaceDayEventPreset(activity = selectedActivity) {
  if (!activity) return null;
  return (eventPresetsByActivity[activity] || []).find(p => /_race_day$/.test(p.key)) || null;
}

function formatDistanceLabel(value, unit) {
  if (unit === 'm') return `${Math.round(value)} m`;
  if (unit === 'yd') return `${value >= 100 ? Math.round(value) : round1(value)} yd`;
  if (unit === 'mi') return `${value >= 10 ? Math.round(value) : round1(value)} mi`;
  if (unit === 'nights') return `${value >= 10 ? Math.round(value) : round1(value)} night${value === 1 ? '' : 's'}`;
  if (unit === 'days') return `${value >= 10 ? Math.round(value) : round1(value)} day${value === 1 ? '' : 's'}`;
  return `${value >= 10 ? Math.round(value) : round1(value)} km`;
}

function formatDurationDisplay(minutes) {
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

function formatMinutesShort(minutes) {
  return formatDurationDisplay(minutes);
}

function convertDistanceToKm(value, unit) {
  if (!isFiniteNumber(value)) return null;
  if (unit === 'km') return value;
  if (unit === 'mi') return value * 1.60934;
  if (unit === 'm') return value / 1000;
  if (unit === 'yd') return value * 0.0009144;
  return null;
}

function convertDurationToMinutes(value, unit) {
  if (!isFiniteNumber(value)) return null;
  if (unit === 'min') return value;
  if (unit === 'h') return value * 60;
  if (unit === 'd') return value * 1440;
  return null;
}

function getCustomDistanceState() {
  if (routeState?.points?.length) return null;
  const value = parsePositiveNumber(customDistanceInput?.value);
  if (!value) return null;
  const unit = distanceUnitSelect?.value || getDistanceUnitOptions()[0]?.value || 'km';
  return { label: formatDistanceLabel(value, unit), km: convertDistanceToKm(value, unit), source: 'custom' };
}

function parseFlexibleDurationMinutes(raw, unit) {
  const text = String(raw ?? '').trim();
  if (!text) return null;
  const hhmm = text.match(/^(\d{1,3})\s*:\s*(\d{1,2})$/);
  if (hhmm) {
    const hours = Number(hhmm[1]);
    const minutes = Number(hhmm[2]);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes) || minutes >= 60) return null;
    return (hours * 60) + minutes;
  }
  const value = parsePositiveNumber(text);
  if (!value) return null;
  return convertDurationToMinutes(value, unit);
}

function getCustomDurationMinutes() {
  if (routeHasDurationOverride()) return null;
  const raw = customDurationInput?.value;
  if (!String(raw ?? '').trim()) return null;
  const unit = durationUnitSelect?.value || 'h';
  return parseFlexibleDurationMinutes(raw, unit);
}

function parseFlexiblePace(raw) {
  const text = String(raw || '').trim();
  if (!text) return null;
  if (text.includes(':')) {
    const parts = text.split(':').map(part => Number(part.replace(',', '.')));
    if (parts.every(Number.isFinite)) {
      if (parts.length === 2) return parts[0] + (parts[1] / 60);
      if (parts.length === 3) return (parts[0] * 60) + parts[1] + (parts[2] / 60);
    }
    return null;
  }
  const num = Number(text.replace(',', '.'));
  return Number.isFinite(num) && num > 0 ? num : null;
}

function getAverageMetric() {
  const raw = String(averageInput?.value || '').trim();
  if (!raw) return null;
  const unit = averageUnitSelect?.value || getAverageUnitOptions()[0]?.value || 'kmh';
  const parsed = parseFlexiblePace(raw);
  if (!parsed) return { label: raw, kmh: null, unit, valid: false, canDerive: false };
  let kmh = null;
  if (unit === 'kmh') kmh = parsed;
  if (unit === 'min_per_km') kmh = 60 / parsed;
  if (unit === 'min_per_100m') kmh = 6 / parsed;
  return {
    label: unit === 'kmh' ? `${round1(parsed)} km/h` : unit === 'min_per_km' ? `${raw} min/km` : `${raw} min/100m`,
    kmh,
    unit,
    valid: isFiniteNumber(kmh) && kmh > 0,
    canDerive: avgDeriveActivities.has(selectedActivity)
  };
}

function formatDerivedAverageLabel(kmh) {
  if (!isFiniteNumber(kmh) || kmh <= 0) return null;
  const minPerKm = 60 / kmh;
  const whole = Math.floor(minPerKm);
  const secs = Math.round((minPerKm - whole) * 60);
  const safeWhole = secs === 60 ? whole + 1 : whole;
  const safeSecs = secs === 60 ? 0 : secs;
  return `${round1(kmh)} km/h · ${safeWhole}:${String(safeSecs).padStart(2, '0')} min/km`;
}

function getDerivedAverageMetric(eventPreset = getSelectedEvent()) {
  const hasManualAverage = !!String(averageInput?.value || '').trim();
  if (hasManualAverage) return null;
  const customDistance = getCustomDistanceState();
  const customMinutes = getCustomDurationMinutes();
  const distanceState = customDistance || getDistanceState(eventPreset);
  const durationState = isFiniteNumber(customMinutes)
    ? { minutes: customMinutes, source: 'custom' }
    : getDurationState(eventPreset);
  if (!isFiniteNumber(distanceState?.km) || distanceState.km <= 0) return null;
  if (!isFiniteNumber(durationState?.minutes) || durationState.minutes <= 0) return null;
  const kmh = distanceState.km / (durationState.minutes / 60);
  if (!isFiniteNumber(kmh) || kmh <= 0) return null;
  const source = customDistance && isFiniteNumber(customMinutes)
    ? 'custom distance + custom duration'
    : customDistance
      ? 'custom distance + duration'
      : durationState.source === 'custom'
        ? 'custom duration + distance'
        : 'distance + duration';
  return {
    kmh,
    label: formatDerivedAverageLabel(kmh),
    source
  };
}

function getPresetDistanceKm(preset) {
  if (!preset) return null;
  const text = `${preset.distanceLabel || ''} ${preset.sublabel || ''}`;
  const match = text.match(/(\d+(?:\.\d+)?)/);
  if (!match) return null;
  const value = Number(match[1]);
  if (!Number.isFinite(value)) return null;
  if (isWaterDistanceActivity(selectedActivity)) {
    return /\bm\b/i.test(text) && !/km/i.test(text) ? value / 1000 : value;
  }
  if (selectedActivity === 'triathlon' || selectedActivity === 'indoor_multisport' || selectedActivity === 'camping' || selectedActivity === 'walk' || selectedActivity === 'casual') return null;
  return value;
}

function getBaseDistanceState(eventPreset = getSelectedEvent()) {
  if (routeState?.points?.length) return { label: formatKm(routeState.totalKm), km: routeState.totalKm, source: 'route' };
  const custom = getCustomDistanceState();
  if (custom) return custom;
  if (eventPreset) return { label: eventPreset.distanceLabel, km: getPresetDistanceKm(eventPreset), source: 'preset' };
  return { label: 'No preset', km: null, source: 'none' };
}

function getDerivedDistanceState() {
  if (routeState?.points?.length) return null;
  if (getCustomDistanceState()) return null;
  const avg = getAverageMetric();
  const customMinutes = getCustomDurationMinutes();
  if (!avg?.valid || !avg.canDerive || !isFiniteNumber(customMinutes)) return null;
  const km = avg.kmh * (customMinutes / 60);
  return isFiniteNumber(km) && km > 0 ? { label: formatKm(km), km, source: 'derived', detail: 'custom duration + average' } : null;
}

function getDistanceState(eventPreset = getSelectedEvent()) {
  if (routeState?.points?.length) return { label: formatKm(routeState.totalKm), km: routeState.totalKm, source: 'route' };
  const custom = getCustomDistanceState();
  if (custom) return custom;
  const derived = getDerivedDistanceState();
  if (derived) return derived;
  return getBaseDistanceState(eventPreset);
}

function getDerivedDurationMinutesFromAverage(eventPreset = getSelectedEvent()) {
  if (routeHasDurationOverride()) return null;
  if (getCustomDurationMinutes()) return null;
  const avg = getAverageMetric();
  if (!avg?.valid || !avg.canDerive) return null;
  const customDistance = getCustomDistanceState();
  const baseDistance = customDistance || getBaseDistanceState(eventPreset);
  if (!isFiniteNumber(baseDistance.km) || baseDistance.km <= 0) return null;
  return (baseDistance.km / avg.kmh) * 60;
}

function getDurationState(eventPreset = getSelectedEvent()) {
  if (routeHasDurationOverride()) return { minutes: routeState.elapsedMinutes, label: formatDurationDisplay(routeState.elapsedMinutes), source: 'route' };
  const customMinutes = getCustomDurationMinutes();
  if (isFiniteNumber(customMinutes)) return { minutes: customMinutes, label: formatDurationDisplay(customMinutes), source: 'custom' };
  const derivedMinutes = getDerivedDurationMinutesFromAverage(eventPreset);
  if (isFiniteNumber(derivedMinutes)) return { minutes: derivedMinutes, label: formatDurationDisplay(derivedMinutes), source: 'derived' };
  if (!selectedDuration || !durationProfiles[selectedDuration]) return null;
  const profile = durationProfiles[selectedDuration];
  return { minutes: profile.minutes, label: profile.label, source: 'preset', key: selectedDuration };
}

function buildDurationProfile(minutes, label) {
  const mins = Math.max(1, Math.round(minutes || 0));
  if (mins >= 1080) {
    const daysWindow = Math.min(7, Math.max(1, Math.ceil(mins / 1440)));
    return { label, sublabel: 'Custom', minutes: mins, daysWindow, exposureBias: Math.min(7, 4 + daysWindow), mode: 'daily' };
  }
  const hoursWindow = Math.min(14, Math.max(3, Math.ceil(mins / 60) + 1));
  const exposureBias = mins >= 720 ? 4 : mins >= 480 ? 3 : mins >= 240 ? 2 : mins >= 120 ? 1 : 0;
  return { label, sublabel: 'Custom', minutes: mins, hoursWindow, exposureBias, mode: 'hourly' };
}

function getDurationProfile() {
  const state = getDurationState();
  if (!state) return null;
  if (state.source === 'preset') return durationProfiles[selectedDuration] || null;
  return buildDurationProfile(state.minutes, state.label);
}

function getRouteDistanceLabel() {
  return routeState?.points?.length ? formatKm(routeState.totalKm) : null;
}

function getDisplayedDistanceText(eventPreset = getSelectedEvent()) {
  return getDistanceState(eventPreset).label;
}

function getDisplayedDurationText(eventPreset = getSelectedEvent()) {
  return getDurationState(eventPreset)?.label || 'No duration selected';
}

function getEventPresets() {
  return getVisibleEventPresets();
}


// Water temperature source model.
// Source order in practice:
// 1) measured/fetched marine water temperature when available,
// 2) conservative pseudo-estimate from air temperature / season / latitude / wind,
// 3) unknown when the estimate has too little signal,
// 4) manual override when the user enters a known local reading.
// Internally, a valid manual override wins because it is explicit user input.
function getCustomWeatherOverride() {
  const waterTemp = parsePositiveOrNegativeNumber(manualWaterTempInput?.value);
  return {
    waterTemp,
    active: manualWeatherPanelOpen && isFiniteNumber(waterTemp)
  };
}

function parsePositiveOrNegativeNumber(value) {
  const raw = String(value ?? '').trim().replace(',', '.');
  if (!raw) return null;
  const num = Number(raw);
  return Number.isFinite(num) ? num : null;
}

function getWaterModelSettings() {
  return {
    waterBodyType: waterBodyTypeSelect?.value || 'auto',
    windExposure: windExposureSelect?.value || 'auto',
    poolType: getPoolType()
  };
}

function updateWaterModelStatus() {
  if (!waterModelStatus) return;
  const settings = getWaterModelSettings();
  const bits = [];
  bits.push(`water body: ${settings.waterBodyType.replace(/_/g, ' ')}`);
  bits.push(`wind: ${settings.windExposure.replace(/_/g, ' ')}`);
  if (isPoolSwimmingActivity(selectedActivity)) bits.push(`pool: ${settings.poolType.replace(/_/g, ' ')}`);
  waterModelStatus.textContent = `Measured marine data stays preferred. If unavailable, Forecast Fit estimates a conservative fallback from recent air temperatures, broad latitude band, season, wind, and ${bits.join(' · ')}.`;
}

function mapRange(value, inMin, inMax, outMin, outMax) {
  const ratio = clamp((value - inMin) / Math.max(1, inMax - inMin), 0, 1);
  return outMin + ((outMax - outMin) * ratio);
}

function averageNumbers(values) {
  const nums = values.filter(isFiniteNumber);
  if (!nums.length) return null;
  return nums.reduce((sum, value) => sum + value, 0) / nums.length;
}

function clampEstimate(value, min, max) {
  if (!isFiniteNumber(value)) return value;
  return Math.min(max, Math.max(min, value));
}

function getLatitudeBand(latitude) {
  const abs = Math.abs(firstFinite(latitude, 45));
  if (abs < 23.5) return { key: 'tropical', label: 'tropical / low latitude', bias: 3.0 };
  if (abs < 35) return { key: 'warm', label: 'warm temperate', bias: 1.5 };
  if (abs < 50) return { key: 'temperate', label: 'temperate', bias: 0 };
  if (abs < 60) return { key: 'cold', label: 'cool northern / southern', bias: -1.2 };
  return { key: 'subpolar', label: 'subpolar / high latitude', bias: -2.5 };
}

function getSeasonInfo(dateStr, latitude) {
  const date = parseLocalString(String(dateStr || '').slice(0, 10) + 'T12:00') || new Date();
  const month = date.getMonth();
  const north = firstFinite(latitude, 45) >= 0;
  const seasonsNorth = ['winter','winter','spring','spring','spring','summer','summer','summer','autumn','autumn','autumn','winter'];
  const seasonsSouth = ['summer','summer','autumn','autumn','autumn','winter','winter','winter','spring','spring','spring','summer'];
  const season = (north ? seasonsNorth : seasonsSouth)[month] || 'summer';
  const autumnStart = new Date(date.getFullYear(), north ? 8 : 2, 1, 12, 0, 0, 0);
  let weeksIntoAutumn = 0;
  if (season === 'autumn') weeksIntoAutumn = Math.max(0, (date - autumnStart) / (7 * 24 * 3600 * 1000));
  const factor = season === 'spring' ? 0 : season === 'summer' ? 0.5 : season === 'autumn' ? 1 : 1.25;
  return { season, factor, weeksIntoAutumn };
}

function getWaterBodyConfig(type) {
  return ({
    deep_lake: { label: 'deep lake', depthFactor: 1, positiveScale: 0.55, adjust: 0 },
    shallow_lake: { label: 'shallow lake', depthFactor: 0, positiveScale: 1.35, adjust: 0.8 },
    bay: { label: 'bay / inlet', depthFactor: 0, positiveScale: 1.25, adjust: 0.4 },
    river: { label: 'river', depthFactor: 0.5, positiveScale: 0.75, adjust: -2 },
    sheltered: { label: 'sheltered beach / pond', depthFactor: 0.5, positiveScale: 1.45, adjust: 1.5 },
    coastal: { label: 'coastal / sea', depthFactor: 1, positiveScale: 0.65, adjust: -1 },
    auto: { label: 'unknown water body', depthFactor: 0.5, positiveScale: 1, adjust: 0 }
  })[type] || { label: 'unknown water body', depthFactor: 0.5, positiveScale: 1, adjust: 0 };
}

function getRecentDailyRecordsForWater(data) {
  const currentDate = String(data?.currentTime || '').slice(0, 10);
  const daily = Array.isArray(data?.daily) ? data.daily : [];
  const past = daily.filter(day => !currentDate || String(day.date) <= currentDate);
  return (past.length ? past : daily).slice(-7);
}

function getRecentHourlyRecordsForWater(data) {
  const currentMs = parseAnyTime(data?.currentTime);
  const hourly = Array.isArray(data?.hourly) ? data.hourly : [];
  if (!Number.isFinite(currentMs)) return hourly.slice(-48);
  const minMs = currentMs - (48 * 3600 * 1000);
  const recent = hourly.filter(point => {
    const ms = parseAnyTime(point.time);
    return Number.isFinite(ms) && ms >= minMs && ms <= currentMs;
  });
  return (recent.length ? recent : hourly).slice(-48);
}

/** 
 * Estimate fallback water temperature when no live marine reading is available.
 *
 * The goal is not scientific precision. It returns a conservative range and a
 * confidence level so wetsuit/accessory suggestions can fail on the safer side.
 * Inputs come from the same Open-Meteo weather payload: recent lows/highs,
 * recent wind, latitude, current season, selected water-body type, and selected
 * wind exposure.
 */
function estimatePseudoWaterTemperature(data) {
  const daily = getRecentDailyRecordsForWater(data);
  const lows = daily.map(day => firstFinite(day.tMin, null)).filter(isFiniteNumber);
  const highs = daily.map(day => firstFinite(day.tMax, null)).filter(isFiniteNumber);
  if (lows.length < 2 || highs.length < 2) {
    return { available: false, source: 'unknown', confidence: 'unknown', explanation: 'Not enough recent temperature data for a fallback estimate.' };
  }
  const settings = getWaterModelSettings();
  const body = getWaterBodyConfig(settings.waterBodyType);
  const band = getLatitudeBand(data?.latitude);
  const season = getSeasonInfo(data?.currentTime, data?.latitude);
  const L = averageNumbers(lows.slice(-2));
  const L7 = averageNumbers(lows.slice(-7));
  const H7 = averageNumbers(highs.slice(-7));
  const recentHourly = getRecentHourlyRecordsForWater(data);
  const windy = recentHourly.filter(point => firstFinite(point.wind, 0) > 10);
  const windFraction = recentHourly.length ? windy.length / recentHourly.length : 0;
  const W_off = settings.windExposure === 'offshore' ? windFraction : 0;
  const W_on = settings.windExposure === 'onshore' ? windFraction : 0;
  const genericWind = settings.windExposure === 'auto' || settings.windExposure === 'neutral';
  const avgRecentWind = averageNumbers(recentHourly.map(point => firstFinite(point.wind, null))) || 0;
  // Continuous layer: recent overnight lows dominate; daytime highs only add
  // a small warming signal because water temperature lags air temperature.
  let estimate =
      0.55 * L
    + 0.25 * L7
    + 0.05 * H7
    - 6.0 * W_off
    + 3.0 * W_on
    - 4.0 * body.depthFactor
    - 2.0 * season.factor
    + band.bias;

  // Rule-based layer: clamp obvious patterns so the estimate does not become
  // unrealistically warm after a single sunny day or unrealistically cold after
  // a noisy input. Notes are saved for the user-facing explanation.
  const notes = [`${band.label}`, season.season, body.label];
  const last2Below10 = lows.slice(-2).filter(v => v < 10).length >= 2;
  const last3 = lows.slice(-3);
  const last5 = lows.slice(-5);
  if (last2Below10) {
    estimate = Math.min(estimate, 14);
    notes.push('cool recent nights');
  }
  if (last3.length >= 3 && last3.filter(v => v >= 10 && v <= 15).length >= 3) {
    estimate = clampEstimate(estimate, 14, 18);
    notes.push('moderate recent nights');
  }
  if (last5.length >= 5 && last5.filter(v => v > 15).length >= 5) {
    estimate = clampEstimate(estimate, 17, 21);
    notes.push('warm recent nights');
  }
  if (last3.length >= 3 && last3.filter(v => v > 20).length >= 3) {
    estimate = clampEstimate(estimate, 22, 25);
    notes.push('very warm nights');
  }

  const last5HighAvg = averageNumbers(highs.slice(-5));
  const last5LowAvg = averageNumbers(lows.slice(-5));
  if (isFiniteNumber(last5HighAvg) && isFiniteNumber(last5LowAvg) && last5HighAvg > 25 && last5LowAvg > 15) {
    estimate += 1.5 * body.positiveScale;
    notes.push('daytime warming');
  }
  const offshoreHours = settings.windExposure === 'offshore' ? windy.length : 0;
  const onshoreHours = settings.windExposure === 'onshore' ? windy.length : 0;
  if (offshoreHours >= 12) {
    estimate -= mapRange(offshoreHours, 12, 24, 2, 6);
    notes.push('offshore cooling risk');
  }
  if (onshoreHours >= 12) {
    estimate += mapRange(onshoreHours, 12, 24, 1, 3) * body.positiveScale;
    notes.push('onshore push');
  }
  if (genericWind && avgRecentWind >= 22) {
    estimate -= mapRange(avgRecentWind, 22, 40, 0.5, 2.5);
    notes.push('wind mixing');
  }
  estimate += body.adjust;

  if (season.season === 'spring') {
    const springCap = band.key === 'tropical' ? 24 : band.key === 'warm' ? 20 : band.key === 'cold' || band.key === 'subpolar' ? 12 : 15;
    estimate = Math.min(estimate, springCap);
  }
  if (season.season === 'summer' && ['shallow_lake', 'bay', 'sheltered'].includes(settings.waterBodyType)) {
    const summerFloor = band.key === 'tropical' ? 22 : band.key === 'warm' ? 20 : band.key === 'temperate' ? 18 : 16;
    estimate = Math.max(estimate, summerFloor);
  }
  if (season.season === 'autumn') {
    const autumnFactor = band.key === 'tropical' ? 0.2 : band.key === 'warm' ? 0.4 : 0.65;
    estimate -= autumnFactor * season.weeksIntoAutumn;
  }
  if (season.season === 'winter') {
    estimate -= band.key === 'tropical' ? 0 : band.key === 'warm' ? 1.5 : 3.5;
  }

  // Reconciliation layer: clamp to a sane physical range and expose a range
  // rather than fake decimal precision. The conservative low end feeds gear logic.
  const finalTemp = clampEstimate(estimate, 0, 30);
  const confidence = settings.waterBodyType !== 'auto' && lows.length >= 5 && highs.length >= 5 && season.season !== 'winter' ? 'medium' : 'low';
  const uncertainty = confidence === 'medium' ? 2.0 : 3.5;
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
    explanation: `Estimated from recent lows/highs, ${notes.slice(0, 5).join(', ')}.`,
    settings,
    latitudeBand: band.key,
    season: season.season
  };
}

/** 
 * Attach a normalized water temperature source to the current and hourly points.
 *
 * Keeping waterTemp/waterTempSource/waterTempConfidence on each point means the
 * rest of the UI can render chips, disclaimers, and recommendation logic without
 * caring whether the value came from marine data or from the fallback model.
 */
function applyPseudoWaterEstimateToData(data) {
  if (!data) return data;
  const estimate = estimatePseudoWaterTemperature(data);
  data.pseudoWaterEstimate = estimate;
  const apply = point => {
    if (!point) return point;
    if (isFiniteNumber(point.measuredWaterTemp)) {
      point.waterTemp = round1(point.measuredWaterTemp);
      point.waterTempSource = 'measured';
      point.waterTempConfidence = 'high';
      point.waterTempRangeLow = null;
      point.waterTempRangeHigh = null;
      point.waterTempExplanation = 'Measured or fetched marine water temperature.';
      return point;
    }
    if (estimate.available) {
      point.waterTemp = estimate.conservativeTemp;
      point.waterTempSource = 'estimated';
      point.waterTempConfidence = estimate.confidence;
      point.waterTempRangeLow = estimate.rangeLow;
      point.waterTempRangeHigh = estimate.rangeHigh;
      point.waterTempExplanation = estimate.explanation;
      return point;
    }
    point.waterTemp = null;
    point.waterTempSource = 'unknown';
    point.waterTempConfidence = 'unknown';
    point.waterTempExplanation = estimate.explanation || 'Water temperature unavailable.';
    return point;
  };
  apply(data.current);
  (data.hourly || []).forEach(apply);
  return data;
}

function getWaterConfidenceLabel(confidence) {
  return ({ high: 'high', medium: 'medium', low: 'low', unknown: 'unknown', manual: 'manual' })[confidence] || 'unknown';
}

function getWaterSignalLevel(confidence) {
  return ({ high: 4, medium: 3, low: 2, unknown: 1, manual: 4 })[confidence] || 1;
}

function renderWaterSignal(confidence) {
  const safe = getWaterConfidenceLabel(confidence);
  const level = getWaterSignalLevel(safe);
  return `<span class="water-signal ${escapeHtml(safe)}" title="${escapeHtml(`Water temperature confidence: ${safe}`)}" aria-label="Water temperature confidence: ${escapeHtml(safe)}">${[1,2,3,4].map(i => `<span class="bar ${i <= level ? 'fill' : ''}"></span>`).join('')}</span>`;
}

function formatWaterTemperatureValue(point) {
  if (!point || !isFiniteNumber(point.waterTemp)) return 'unknown';
  if (point.waterTempSource === 'estimated' && isFiniteNumber(point.waterTempRangeLow) && isFiniteNumber(point.waterTempRangeHigh)) {
    return `~${round1(point.waterTempRangeLow)}–${round1(point.waterTempRangeHigh)}°C`;
  }
  return `${round1(point.waterTemp)}°C`;
}

function getWaterTemperatureSourceLabel(point, data = weatherData) {
  if (point?.waterTempSource === 'manual') return 'manual';
  if (point?.waterTempSource === 'estimated') return `estimated fallback · ${getWaterConfidenceLabel(point.waterTempConfidence)}`;
  if (point?.waterTempSource === 'measured') return data?.marineSource || 'measured water data';
  return 'water temp unknown';
}

function getWaterTemperatureChip(point, data = weatherData) {
  if (!point || !isFiniteNumber(point.waterTemp)) return { label: '🌊 water unknown', tone: 'warn' };
  const confidence = getWaterConfidenceLabel(point.waterTempConfidence || point.waterTempSource);
  const source = getWaterTemperatureSourceLabel(point, data);
  const tempLabel = formatWaterTemperatureValue(point);
  return { label: `🌊 water ${tempLabel} · ${source}`, tone: point.waterTemp < 14 || confidence === 'unknown' ? 'warn' : (confidence === 'high' ? 'ok' : '') };
}

function renderWaterTemperatureMetaLine(point, data = weatherData) {
  if (!point || !shouldShowWaterTemperature(selectedActivity, point)) return '';
  if (!isFiniteNumber(point.waterTemp)) {
    return `🌊 Water <strong>unknown</strong> ${renderWaterSignal('unknown')} <span class="water-source-label">unknown</span>`;
  }
  const confidence = getWaterConfidenceLabel(point.waterTempConfidence || point.waterTempSource);
  const source = getWaterTemperatureSourceLabel(point, data);
  return `🌊 Water <strong>${escapeHtml(formatWaterTemperatureValue(point))}</strong> ${renderWaterSignal(confidence)} <span class="water-source-label">${escapeHtml(source)}</span>`;
}

function renderWaterTempDisclaimer(point) {
  if (!point || !shouldShowWaterTemperature(selectedActivity, point) || !['estimated', 'manual'].includes(point.waterTempSource)) return '';
  const lead = point.waterTempSource === 'manual'
    ? 'Manual water temperature is user-entered and not verified by the app.'
    : 'Estimated water temperature is a fallback only, not a measured reading.';
  const extra = point.waterTempExplanation ? ` ${point.waterTempExplanation}` : '';
  return `<div class="water-temp-note">${escapeHtml(lead + extra)} Cold-water risk can vary a lot by location, depth, current, wind, and entry/exit conditions.</div>`;
}

function applyCustomWeatherOverrides(point, data) {
  const override = getCustomWeatherOverride();
  if (!override.active) return point;
  return {
    ...point,
    waterTemp: isFiniteNumber(override.waterTemp) ? round1(override.waterTemp) : point.waterTemp,
    waterTempSource: isFiniteNumber(override.waterTemp) ? 'manual' : point.waterTempSource,
    waterTempConfidence: isFiniteNumber(override.waterTemp) ? 'manual' : point.waterTempConfidence,
    waterTempRangeLow: null,
    waterTempRangeHigh: null,
    waterTempExplanation: isFiniteNumber(override.waterTemp) ? 'Manual override entered in the weather override panel.' : point.waterTempExplanation
  };
}

function updateManualWeatherStatus() {
  if (!manualWeatherStatus) return;
  const override = getCustomWeatherOverride();
  const seaTempLinks = [
    '<a class="status-link" href="https://www.seatemperature.info/" target="_blank" rel="noopener noreferrer">seatemperature.info</a>',
    '<a class="status-link" href="https://www.seatemperature.org/" target="_blank" rel="noopener noreferrer">seatemperature.org</a>'
  ].join('');
  const seaTempLookup = `<span class="status-links">${seaTempLinks}</span>`;
  if (!override.active) {
    manualWeatherStatus.innerHTML = manualWeatherPanelOpen
      ? `Optional. Use this only when you have a better local reading than the fetched or estimated water temperature. Quick lookup:${seaTempLookup}`
      : `Visible only when the toggle is open. Manual water temperature overrides fetched or estimated water data. Quick lookup:${seaTempLookup}`;
    return;
  }
  manualWeatherStatus.innerHTML = `Manual water override active: ${round1(override.waterTemp)}°C. The result will be labelled as manual. Quick lookup:${seaTempLookup}`;
}

function routeHasDurationOverride() {
  return !!(routeState && isFiniteNumber(routeState.elapsedMinutes) && routeState.elapsedMinutes > 0);
}

function hasPlannedDurationSelection(eventPreset = getSelectedEvent()) {
  if (routeHasDurationOverride()) return true;
  if (isFiniteNumber(getCustomDurationMinutes())) return true;
  if (isFiniteNumber(getDerivedDurationMinutesFromAverage(eventPreset))) return true;
  return !!selectedDuration;
}

function refreshSelectionNotes() {
  updateCustomStatusTexts();
}

function getSelectedEvent() {
  const racePreset = raceDayMode ? getRaceDayEventPreset() : null;
  if (racePreset) return racePreset;
  const presets = getEventPresets();
  if (!presets.length) return null;
  let preset = presets.find(p => p.key === selectedEventKey);
  if (!preset) {
    preset = presets[0];
    selectedEventKey = preset.key;
  }
  return preset;
}

function renderDurationButtons() {
  const el = document.getElementById('duration-grid');
  const locked = routeHasDurationOverride();
  const hasManualOverride = !!getCustomDurationMinutes() || !!getDerivedDurationMinutesFromAverage();
  const activeKey = locked ? (routeState.derivedDurationKey || selectedDuration) : (hasManualOverride ? null : (selectedDuration || null));
  el.innerHTML = durationOrder.map(key => {
    const p = durationProfiles[key];
    return `<button class="duration-btn ${activeKey === key ? 'active' : ''} ${locked ? 'locked' : ''}" type="button" ${locked ? 'disabled' : ''} data-action="selectDurationKey" data-duration-key="${escapeHtml(key)}"><div class="label">${escapeHtml(p.label)}</div><div class="sublabel">${escapeHtml(locked && activeKey === key ? `${p.sublabel} · route` : p.sublabel)}</div></button>`;
  }).join('');
}

function renderEventButtons() {
  const container = document.getElementById('event-grid');
  const summary = document.getElementById('event-summary');
  const presets = getEventPresets();
  const distanceLocked = !!routeState?.points?.length;
  const customDistanceActive = !!getCustomDistanceState();
  if (!presets.length) {
    container.innerHTML = '';
    summary.textContent = selectedActivity ? 'No event presets for this activity.' : 'Choose an activity to load the usual event and distance presets.';
    return;
  }
  const selected = getSelectedEvent();
  container.innerHTML = presets.map(p => `
    <button class="event-btn ${!raceDayMode && !customDistanceActive && selected?.key === p.key ? 'active' : ''} ${distanceLocked ? 'locked' : ''}" type="button" ${distanceLocked ? 'disabled' : ''} data-action="selectEventPreset" data-event-key="${escapeHtml(p.key)}">
      <div class="label">${escapeHtml(p.label)}</div>
      <div class="sublabel">${escapeHtml(p.sublabel)}</div>
    </button>`).join('');
  if (distanceLocked) {
    summary.textContent = `Route distance in use: ${getDisplayedDistanceText(selected)}.`;
  } else {
    const distanceState = getDistanceState(selected);
    const sourceText = distanceState.source === 'custom' ? 'custom distance' : distanceState.source === 'derived' ? 'estimated from duration + average' : selected.detail;
    const summaryLead = raceDayMode && getRaceDayEventPreset() ? `Race day mode Â· ${selected.label}` : selected.label;
    summary.textContent = distanceState.source === 'custom'
      ? `Custom distance · ${distanceState.label}`
      : `${selected.label} · ${distanceState.label}${sourceText ? ` — ${sourceText}` : ''}`;
  }
  if (!distanceLocked && raceDayMode && getRaceDayEventPreset()) {
    const distanceState = getDistanceState(selected);
    const sourceText = distanceState.source === 'custom' ? 'custom distance' : distanceState.source === 'derived' ? 'estimated from duration + average' : selected.detail;
    summary.textContent = distanceState.source === 'custom'
      ? `Custom distance · ${distanceState.label}`
      : `Race day mode · ${selected.label} · ${distanceState.label}${sourceText ? ` — ${sourceText}` : ''}`;
  }
  refreshSelectionNotes();
}

function syncDurationFromEvent(preset) {
  if (routeHasDurationOverride()) return;
  if (isFiniteNumber(getCustomDurationMinutes())) return;
  const defaultDuration = preset?.defaultDuration;
  if (defaultDuration && durationProfiles[defaultDuration]) selectedDuration = defaultDuration;
}

function updateCustomInputLocks() {
  const distanceLocked = !!routeState?.points?.length;
  customDistanceInput.disabled = distanceLocked;
  distanceUnitSelect.disabled = distanceLocked;
  const durationLocked = routeHasDurationOverride();
  customDurationInput.disabled = durationLocked;
  durationUnitSelect.disabled = durationLocked;
}

// Keep the status copy below custom distance/duration/average inputs in sync.
// Any two of distance, duration, and average can derive the third for activities
// where that calculation makes sense.
function updateCustomStatusTexts() {
  const eventPreset = getSelectedEvent();
  const distanceState = getDistanceState(eventPreset);
  const durationState = getDurationState(eventPreset);
  const avg = getAverageMetric();
  const derivedAvg = getDerivedAverageMetric(eventPreset);
  const rawDuration = String(customDurationInput?.value || '').trim();
  const parsedCustomDuration = rawDuration ? getCustomDurationMinutes() : null;
  const hasCustomDistance = !!getCustomDistanceState();
  const hasCustomDuration = isFiniteNumber(parsedCustomDuration);
  const hasCustomAverage = !!String(averageInput?.value || '').trim();

  distanceStatus.textContent = routeState?.points?.length
    ? `Route distance is active: ${distanceState.label}.`
    : distanceState.source === 'custom'
      ? `Using custom distance: ${distanceState.label}.`
      : distanceState.source === 'derived'
        ? `Calculated distance from custom duration + average: ${distanceState.label}.`
        : 'Preset distance is used.';

  durationStatus.textContent = durationState.source === 'route'
    ? `Route timing is active: ${durationState.label}.`
    : durationState.source === 'custom'
      ? `Using custom duration: ${durationState.label}.`
      : durationState.source === 'derived'
        ? `${hasCustomDistance && hasCustomAverage ? 'Calculated' : 'Estimated'} duration from ${hasCustomDistance && hasCustomAverage ? 'custom distance + average' : 'distance + average'}: ${durationState.label}.`
        : (parsedCustomDuration ? `Using custom duration: ${formatDurationDisplay(parsedCustomDuration)}.` : 'Preset duration is used.');

  averageStatus.textContent = !hasCustomAverage
    ? (derivedAvg?.label
        ? `Calculated average from ${derivedAvg.source}: ${derivedAvg.label}.`
        : 'Optional. Any two custom fields can calculate the third when it makes sense.')
    : !avg?.valid
      ? 'Try a valid value for the selected unit.'
      : avg.canDerive
        ? `Using ${avg.label}${durationState.source === 'derived' || distanceState.source === 'derived' ? ' to calculate the missing side.' : ' as an optional planning aid.'}`
        : `${avg.label} is shown as an info tag only for this activity.`;
}

function renderPlannerState() {
  renderCustomControlOptions();
  updateCustomInputLocks();
  renderEventButtons();
  renderDurationButtons();
  updateCustomStatusTexts();
  updateWaterModelStatus();
  updateCheckpointModelUi();
  updateTemperaturePreferenceUi();
  updatePlannedEffortUi();
  renderCustomMultisportControls();
  updateActivityGroupVisibility();
}

function formatKm(value) {
  return value >= 10 ? `${Math.round(value)} km` : `${round1(value)} km`;
}

function formatKmPrefix(value) {
  return value >= 10 ? `km ${Math.round(value)}` : `km ${round1(value)}`;
}

function prefersDarkTheme() {
  return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function getLeafletTileConfig() {
  if (prefersDarkTheme()) {
    return {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      options: {
        maxZoom: 20,
        subdomains: 'abcd',
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
      }
    };
  }
  return {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    options: {
      maxZoom: 20,
      subdomains: 'abcd',
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    }
  };
}

function refreshRouteMapTheme() {
  if (!routeMap || typeof L === 'undefined') return;
  const cfg = getLeafletTileConfig();
  if (routeTileLayer) routeMap.removeLayer(routeTileLayer);
  routeTileLayer = L.tileLayer(cfg.url, cfg.options).addTo(routeMap);
  routeTileLayer.bringToBack();
}

function initRouteMap() {
  if (routeMap || typeof L === 'undefined') return;
  routeMap = L.map('route-map', { scrollWheelZoom: true });
  refreshRouteMapTheme();
  routeLayer = L.layerGroup().addTo(routeMap);
  routeMarkersLayer = L.layerGroup().addTo(routeMap);
  if (window.matchMedia) {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => refreshRouteMapTheme();
    if (typeof media.addEventListener === 'function') media.addEventListener('change', handler);
    else if (typeof media.addListener === 'function') media.addListener(handler);
  }
}

function clearRouteMapLayers() {
  if (routeLayer) routeLayer.clearLayers();
  if (routeMarkersLayer) routeMarkersLayer.clearLayers();
}

function normalizeRoutePoints(points) {
  return normalizeRoutePointsFromModule(points);
}

function parseGeoJsonRouteObject(geo) {
  return parseGeoJsonRouteObjectFromModule(geo);
}

function parseXmlRouteDocument(xml) {
  return parseXmlRouteDocumentFromModule(xml);
}

function parseRouteText(name, text) {
  return parseUploadedRouteText(name, text);
}

async function parseRouteFile(file) {
  return parseUploadedRouteFile(file);
}

// Route model helpers.
// A loaded GPX/GeoJSON route becomes a normalized list of points with cumulative
// distance, optional elevation, optional timestamps, and later sampled checkpoint
// weather. This is used by route cards, maps, road-trip itinerary, and route-aware
// duration/distance overrides.
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function bearingDegrees(lat1, lon1, lat2, lon2) {
  const toRad = deg => deg * Math.PI / 180;
  const toDeg = rad => rad * 180 / Math.PI;
  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);
  const lambda1 = toRad(lon1);
  const lambda2 = toRad(lon2);
  const y = Math.sin(lambda2 - lambda1) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(lambda2 - lambda1);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

function buildRouteState(points, fileName) {
  return buildRouteStateModel(points, fileName, { parseTime: parseAnyTime, nearestDurationKey });
}

function getRouteTimingMinutes() {
  const durationState = getDurationState(getSelectedEvent());
  return firstFinite(durationState?.minutes, routeState?.elapsedMinutes, null);
}

function getSegmentTimeFactor(activity, gradePct) {
  return getSegmentTimeFactorFromModule(activity, gradePct);
}

/** 
 * Build a route timing model for checkpoint placement.
 *
 * If the file contains timestamps, reuse their pacing shape and scale it to the
 * selected duration. Otherwise, approximate timing from distance plus simple
 * grade penalties so climbs get a little more time than flat/downhill segments.
 */
function buildRouteTimingModel(totalMinutes) {
  if (!routeState?.points?.length || !isFiniteNumber(totalMinutes) || totalMinutes <= 0) return null;
  const cacheKey = `${selectedActivity || 'casual'}:${Math.round(totalMinutes)}`;
  if (routeState.timingCache?.[cacheKey]) return routeState.timingCache[cacheKey];
  const points = routeState.points;
  const cumulativeMinutes = new Array(points.length).fill(0);
  const timedIdxs = points.reduce((acc, p, idx) => {
    if (isFiniteNumber(p.timeMs)) acc.push(idx);
    return acc;
  }, []);

  const canUseTimed = routeState.elapsedMinutes && timedIdxs.length >= Math.max(6, Math.round(points.length * 0.08));
  if (canUseTimed) {
    const firstMs = points[timedIdxs[0]].timeMs;
    const rawElapsed = Math.max(1, routeState.elapsedMinutes);
    timedIdxs.forEach(idx => {
      cumulativeMinutes[idx] = Math.max(0, (points[idx].timeMs - firstMs) / 60000);
    });
    for (let a = 0; a < timedIdxs.length - 1; a++) {
      const startIdx = timedIdxs[a];
      const endIdx = timedIdxs[a + 1];
      const startMin = cumulativeMinutes[startIdx];
      const endMin = cumulativeMinutes[endIdx];
      const spanKm = Math.max(0.001, points[endIdx].kmFromStart - points[startIdx].kmFromStart);
      for (let i = startIdx + 1; i < endIdx; i++) {
        const ratio = (points[i].kmFromStart - points[startIdx].kmFromStart) / spanKm;
        cumulativeMinutes[i] = startMin + ((endMin - startMin) * ratio);
      }
    }
    for (let i = 0; i < timedIdxs[0]; i++) {
      const ratio = points[timedIdxs[0]].kmFromStart > 0 ? points[i].kmFromStart / points[timedIdxs[0]].kmFromStart : 0;
      cumulativeMinutes[i] = cumulativeMinutes[timedIdxs[0]] * ratio;
    }
    for (let i = timedIdxs[timedIdxs.length - 1] + 1; i < points.length; i++) {
      const tailStart = timedIdxs[timedIdxs.length - 1];
      const spanKm = Math.max(0.001, routeState.totalKm - points[tailStart].kmFromStart);
      const ratio = (points[i].kmFromStart - points[tailStart].kmFromStart) / spanKm;
      cumulativeMinutes[i] = cumulativeMinutes[tailStart] + ((rawElapsed - cumulativeMinutes[tailStart]) * ratio);
    }
    const scale = totalMinutes / rawElapsed;
    for (let i = 0; i < cumulativeMinutes.length; i++) cumulativeMinutes[i] *= scale;
  } else {
    const cumulativeWeights = new Array(points.length).fill(0);
    let totalWeight = 0;
    for (let i = 1; i < points.length; i++) {
      const segKm = Math.max(0.001, points[i].segmentKm || (points[i].kmFromStart - points[i - 1].kmFromStart));
      const factor = getSegmentTimeFactor(selectedActivity, points[i].gradePct);
      totalWeight += segKm * factor;
      cumulativeWeights[i] = totalWeight;
    }
    for (let i = 1; i < points.length; i++) {
      cumulativeMinutes[i] = totalWeight > 0 ? (cumulativeWeights[i] / totalWeight) * totalMinutes : 0;
    }
  }
  const model = { totalMinutes, cumulativeMinutes };
  routeState.timingCache[cacheKey] = model;
  return model;
}

function findNearestPointIndexByKm(targetKm) {
  if (!routeState?.points?.length) return 0;
  let nearestIdx = 0;
  let best = Infinity;
  routeState.points.forEach((p, idx) => {
    const diff = Math.abs(p.kmFromStart - targetKm);
    if (diff < best) { best = diff; nearestIdx = idx; }
  });
  return nearestIdx;
}

function findNearestPointIndexByMinute(model, targetMinutes) {
  if (!model?.cumulativeMinutes?.length) return 0;
  let nearestIdx = 0;
  let best = Infinity;
  model.cumulativeMinutes.forEach((minutes, idx) => {
    const diff = Math.abs(minutes - targetMinutes);
    if (diff < best) { best = diff; nearestIdx = idx; }
  });
  return nearestIdx;
}

function getRouteBearingAtIndex(points, index) {
  const curr = points[index];
  if (!curr) return NaN;
  let before = null;
  let after = null;
  for (let i = index - 1; i >= 0; i--) {
    if (points[i].lat !== curr.lat || points[i].lon !== curr.lon) { before = points[i]; break; }
  }
  for (let i = index + 1; i < points.length; i++) {
    if (points[i].lat !== curr.lat || points[i].lon !== curr.lon) { after = points[i]; break; }
  }
  if (before && after) return bearingDegrees(before.lat, before.lon, after.lat, after.lon);
  if (before) return bearingDegrees(before.lat, before.lon, curr.lat, curr.lon);
  if (after) return bearingDegrees(curr.lat, curr.lon, after.lat, after.lon);
  return NaN;
}

function describeRelativeWind(travelBearing, windDir, windSpeed) {
  if (!isFiniteNumber(travelBearing) || !isFiniteNumber(windDir)) return { label: 'wind relative to route unavailable', short: 'route wind —', tone: '' };
  const diff = Math.abs((((windDir - travelBearing) % 360) + 540) % 360 - 180);
  let label = 'crosswind';
  if (diff <= 30) label = 'headwind';
  else if (diff <= 75) label = 'quartering headwind';
  else if (diff >= 150) label = 'tailwind';
  else if (diff >= 105) label = 'quartering tailwind';
  const tone = (label.includes('headwind') || label === 'crosswind') && firstFinite(windSpeed, 0) >= 25 ? 'warn' : '';
  return { label, short: `${label}`, tone, angle: diff };
}

function getWeatherVolatilityScore(data, startTime) {
  if (!data || !startTime) return 0;
  const selection = getForecastSelection(data, startTime);
  const points = selection.points || [];
  if (!points.length) return 0;
  const feels = points.map(p => firstFinite(p.feels, p.temp)).filter(isFiniteNumber);
  const spread = feels.length ? Math.max(...feels) - Math.min(...feels) : 0;
  const maxWind = points.reduce((max, p) => Math.max(max, firstFinite(p.wind, 0)), 0);
  const maxPrecipProb = points.reduce((max, p) => Math.max(max, firstFinite(p.precipProb, 0)), 0);
  let score = 0;
  if (spread >= 6) score++;
  if (maxWind >= 28) score++;
  if (maxPrecipProb >= 45) score++;
  const light = describeLight(data, startTime, selection);
  if (/crosses sunrise|crosses sunset|mostly dark|starts before sunrise|starts after sunset/i.test(light.label)) score++;
  return Math.min(4, score);
}

function getTerrainVolatilityScore() {
  if (!routeState) return 0;
  const gainPerKm = routeState.totalGain / Math.max(1, routeState.totalKm);
  let score = 0;
  if (gainPerKm >= 10) score++;
  if (gainPerKm >= 22) score++;
  return Math.min(2, score);
}

function getSmartCheckpointConfig(totalMinutes) {
  const baseInterval = totalMinutes <= 120 ? 30
    : totalMinutes <= 240 ? 45
    : totalMinutes <= 480 ? 60
    : totalMinutes <= 900 ? 75
    : totalMinutes <= 1440 ? 90
    : 180;
  let gapKm = selectedActivity === 'running' ? 8
    : (selectedActivity === 'road_trip' ? 70
    : (selectedActivity === 'camping' || selectedActivity === 'walk' || selectedActivity === 'casual') ? 16
    : isWaterDistanceActivity(selectedActivity) ? 10
    : (selectedActivity === 'triathlon' ? 22 : 28));
  if (totalMinutes >= 720) gapKm *= 1.15;
  if (totalMinutes >= 1440) gapKm *= 1.2;
  const startTime = weatherData ? getSelectedStartTime(weatherData) : null;
  const volatility = Math.min(4, getTerrainVolatilityScore() + getWeatherVolatilityScore(weatherData, startTime) + (totalMinutes >= 360 ? 1 : 0));
  let intervalMinutes = baseInterval - (volatility >= 1 ? 15 : 0) - (volatility >= 3 ? 15 : 0);
  intervalMinutes = Math.max(20, intervalMinutes);
  gapKm = clamp(gapKm * (volatility >= 2 ? 0.85 : 1), 5, 120);
  const targetMax = totalMinutes <= 180 ? 6
    : totalMinutes <= 360 ? 8
    : totalMinutes <= 720 ? 10
    : totalMinutes <= 1440 ? 12
    : 14;
  return { intervalMinutes, gapKm, volatility, targetMax };
}

function getSolarCheckpointEvents(startTime, totalMinutes) {
  if (!weatherData?.daily?.length || !startTime || !isFiniteNumber(totalMinutes)) return [];
  const startMs = parseAnyTime(startTime);
  const endMs = startMs + (totalMinutes * 60000);
  const events = [];
  weatherData.daily.forEach(day => {
    [['sunrise', 'Sunrise'], ['sunset', 'Sunset']].forEach(([key, label]) => {
      if (!day?.[key]) return;
      const ms = parseAnyTime(day[key]);
      if (!Number.isFinite(ms) || ms < startMs || ms > endMs) return;
      events.push({ kind: key, label, minuteFromStart: (ms - startMs) / 60000 });
    });
  });
  return events;
}

function buildCheckpointFromIndex(pointIndex, reason, model, totalMinutes) {
  const p = routeState.points[pointIndex];
  const startTime = weatherData ? getSelectedStartTime(weatherData) : null;
  const minuteFromStart = model?.cumulativeMinutes?.[pointIndex] ?? (routeState.totalKm > 0 ? (p.kmFromStart / routeState.totalKm) * totalMinutes : 0);
  return {
    id: `cp-${pointIndex}-${reason.kind}`,
    pointIndex,
    lat: p.lat,
    lon: p.lon,
    kmFromStart: p.kmFromStart,
    fraction: routeState.totalKm > 0 ? p.kmFromStart / routeState.totalKm : 0,
    minuteFromStart,
    eta: startTime ? addMinutesToLocalString(startTime, Math.round(minuteFromStart)) : null,
    reasons: [reason.kind],
    reasonLabels: [reason.label],
    bearing: getRouteBearingAtIndex(routeState.points, pointIndex),
    label: reason.label,
    markerShort: null,
    markerKind: 'mid'
  };
}

function mergeCheckpointCandidate(list, checkpoint) {
  const existing = list.find(cp => cp.pointIndex === checkpoint.pointIndex || (Math.abs(cp.kmFromStart - checkpoint.kmFromStart) <= 0.35 && Math.abs(cp.minuteFromStart - checkpoint.minuteFromStart) <= 12));
  if (existing) {
    checkpoint.reasons.forEach(reason => { if (!existing.reasons.includes(reason)) existing.reasons.push(reason); });
    checkpoint.reasonLabels.forEach(label => { if (!existing.reasonLabels.includes(label)) existing.reasonLabels.push(label); });
    existing.minuteFromStart = Math.min(existing.minuteFromStart, checkpoint.minuteFromStart);
    return existing;
  }
  list.push(checkpoint);
  return checkpoint;
}

function pruneCheckpointCandidates(candidates, targetMax) {
  if (candidates.length <= targetMax) return candidates;
  const sorted = [...candidates].sort((a, b) => a.minuteFromStart - b.minuteFromStart);
  const required = sorted.filter(cp => cp.reasons.includes('start') || cp.reasons.includes('finish') || cp.reasons.includes('sunrise') || cp.reasons.includes('sunset'));
  const keep = new Set(required.map(cp => cp.id));
  const optional = sorted.filter(cp => !keep.has(cp.id));
  const remainingSlots = Math.max(0, targetMax - required.length);
  if (remainingSlots > 0 && optional.length) {
    const step = optional.length / remainingSlots;
    for (let i = 0; i < remainingSlots; i++) {
      const cp = optional[Math.min(optional.length - 1, Math.floor(i * step))];
      if (cp) keep.add(cp.id);
    }
  }
  return sorted.filter(cp => keep.has(cp.id));
}

function applyBaseCheckpointLabels(samples) {
  const sorted = [...samples].sort((a, b) => a.minuteFromStart - b.minuteFromStart);
  let genericIndex = 1;
  sorted.forEach(cp => {
    if (cp.reasons.includes('start')) {
      cp.label = 'Start';
      cp.markerShort = 'S';
      cp.markerKind = 'start';
      return;
    }
    if (cp.reasons.includes('finish')) {
      cp.label = 'Finish';
      cp.markerShort = 'F';
      cp.markerKind = 'finish';
      return;
    }
    if (checkpointModel === 'smart' && cp.reasons.includes('sunrise')) {
      cp.label = 'Sunrise';
      cp.markerShort = '↑';
      cp.markerKind = 'event';
      return;
    }
    if (checkpointModel === 'smart' && cp.reasons.includes('sunset')) {
      cp.label = 'Sunset';
      cp.markerShort = '↓';
      cp.markerKind = 'event';
      return;
    }
    cp.label = checkpointModel === 'smart' ? `Forecast checkpoint ${genericIndex}` : `Weather checkpoint ${genericIndex}`;
    cp.markerShort = `${genericIndex}`;
    cp.markerKind = 'mid';
    genericIndex++;
  });
  return sorted;
}

function markSmartWeatherEventCheckpoints(samples) {
  applyBaseCheckpointLabels(samples);
  if (checkpointModel !== 'smart') return samples;
  const mids = samples.filter(cp => !cp.reasons.includes('start') && !cp.reasons.includes('finish') && cp.weather);
  if (!mids.length) return samples;
  const coldest = [...mids].sort((a, b) => firstFinite(a.windowWeather?.feelsMin, a.weather?.feels, 999) - firstFinite(b.windowWeather?.feelsMin, b.weather?.feels, 999))[0];
  const windiest = [...mids].sort((a, b) => firstFinite(b.windowWeather?.maxWind, b.weather?.wind, 0) - firstFinite(a.windowWeather?.maxWind, a.weather?.wind, 0))[0];
  const wettest = [...mids].sort((a, b) => {
    const av = Math.max(firstFinite(a.windowWeather?.maxPrecipProb, a.weather?.precipProb, 0), firstFinite(a.windowWeather?.maxPrecip, a.weather?.precip, 0) * 100);
    const bv = Math.max(firstFinite(b.windowWeather?.maxPrecipProb, b.weather?.precipProb, 0), firstFinite(b.windowWeather?.maxPrecip, b.weather?.precip, 0) * 100);
    return bv - av;
  })[0];
  const uvPeak = [...mids].sort((a, b) => firstFinite(b.windowWeather?.maxUv, b.weather?.uv, 0) - firstFinite(a.windowWeather?.maxUv, a.weather?.uv, 0))[0];
  if (coldest && firstFinite(coldest.windowWeather?.feelsMin, coldest.weather?.feels, 99) <= 6) {
    if (!coldest.reasons.includes('coldest')) coldest.reasons.push('coldest');
  }
  if (windiest && firstFinite(windiest.windowWeather?.maxWind, windiest.weather?.wind, 0) >= 25) {
    if (!windiest.reasons.includes('peakwind')) windiest.reasons.push('peakwind');
  }
  if (wettest && (firstFinite(wettest.windowWeather?.maxPrecipProb, wettest.weather?.precipProb, 0) >= 45 || firstFinite(wettest.windowWeather?.maxPrecip, wettest.weather?.precip, 0) >= 0.3)) {
    if (!wettest.reasons.includes('wettest')) wettest.reasons.push('wettest');
  }
  if (uvPeak && isOutdoorUvRelevantActivity(selectedActivity) && firstFinite(uvPeak.windowWeather?.maxUv, uvPeak.weather?.uv, 0) >= 6) {
    if (!uvPeak.reasons.includes('uvpeak')) uvPeak.reasons.push('uvpeak');
  }
  let genericIndex = 1;
  [...samples].sort((a, b) => a.minuteFromStart - b.minuteFromStart).forEach(cp => {
    if (cp.reasons.includes('start')) {
      cp.label = 'Start';
      cp.markerShort = 'S';
      cp.markerKind = 'start';
    } else if (cp.reasons.includes('finish')) {
      cp.label = 'Finish';
      cp.markerShort = 'F';
      cp.markerKind = 'finish';
    } else if (cp.reasons.includes('sunrise')) {
      cp.label = 'Sunrise';
      cp.markerShort = '↑';
      cp.markerKind = 'event';
    } else if (cp.reasons.includes('sunset')) {
      cp.label = 'Sunset';
      cp.markerShort = '↓';
      cp.markerKind = 'event';
    } else if (cp.reasons.includes('wettest')) {
      cp.label = 'Rain risk';
      cp.markerShort = '☔';
      cp.markerKind = 'event';
    } else if (cp.reasons.includes('uvpeak')) {
      cp.label = 'Peak UV';
      cp.markerShort = '☀';
      cp.markerKind = 'event';
    } else if (cp.reasons.includes('peakwind')) {
      cp.label = 'Peak wind';
      cp.markerShort = '↯';
      cp.markerKind = 'event';
    } else if (cp.reasons.includes('coldest')) {
      cp.label = 'Coldest';
      cp.markerShort = '❄';
      cp.markerKind = 'event';
    } else {
      cp.label = `Forecast checkpoint ${genericIndex}`;
      cp.markerShort = `${genericIndex}`;
      cp.markerKind = 'mid';
      genericIndex++;
    }
  });
  return samples;
}

/** 
 * Old checkpoint model: evenly spaced checkpoints by route progress.
 * Useful as a predictable baseline when the smart model feels too opinionated.
 */
function sampleRouteCheckpointsOld(totalMinutes) {
  const previousByKey = new Map((routeState.samples || []).map(cp => [String(cp.pointIndex), cp]));
  const count = Math.max(2, getRouteSampleCount());
  const checkpoints = [];
  const startTime = weatherData ? getSelectedStartTime(weatherData) : null;
  for (let i = 0; i < count; i++) {
    const fraction = count === 1 ? 0 : i / (count - 1);
    const targetKm = routeState.totalKm * fraction;
    const pointIndex = findNearestPointIndexByKm(targetKm);
    const p = routeState.points[pointIndex];
    const cp = previousByKey.get(String(pointIndex)) || {
      id: `cp-old-${pointIndex}`,
      pointIndex,
      lat: p.lat,
      lon: p.lon,
      bearing: getRouteBearingAtIndex(routeState.points, pointIndex)
    };
    cp.fraction = fraction;
    cp.kmFromStart = p.kmFromStart;
    cp.minuteFromStart = totalMinutes * fraction;
    cp.eta = startTime ? addMinutesToLocalString(startTime, Math.round(cp.minuteFromStart)) : null;
    cp.reasons = [i === 0 ? 'start' : (i === count - 1 ? 'finish' : 'progress')];
    cp.reasonLabels = [i === 0 ? 'Start' : (i === count - 1 ? 'Finish' : 'Progress')];
    checkpoints.push(cp);
  }
  routeState.samples = applyBaseCheckpointLabels(checkpoints);
  return routeState.samples;
}

/** 
 * Smart checkpoint model: time-aware and context-aware checkpoint placement.
 * It starts with start/finish, adds time-distance gaps, inserts sunrise/sunset
 * events when relevant, and later marks weather-event checkpoints such as peak
 * wind, rain risk, or coldest segment.
 */
function sampleRouteCheckpointsSmart(totalMinutes) {
  const previousByKey = new Map((routeState.samples || []).map(cp => [String(cp.pointIndex), cp]));
  const model = buildRouteTimingModel(totalMinutes);
  const config = getSmartCheckpointConfig(totalMinutes);
  const candidates = [];
  mergeCheckpointCandidate(candidates, buildCheckpointFromIndex(0, { kind: 'start', label: 'Start' }, model, totalMinutes));
  mergeCheckpointCandidate(candidates, buildCheckpointFromIndex(routeState.points.length - 1, { kind: 'finish', label: 'Finish' }, model, totalMinutes));
  for (let minute = config.intervalMinutes; minute < totalMinutes; minute += config.intervalMinutes) {
    const pointIndex = findNearestPointIndexByMinute(model, minute);
    const previous = previousByKey.get(String(pointIndex));
    mergeCheckpointCandidate(candidates, previous ? { ...previous, ...buildCheckpointFromIndex(pointIndex, { kind: 'time', label: 'Time slice' }, model, totalMinutes) } : buildCheckpointFromIndex(pointIndex, { kind: 'time', label: 'Time slice' }, model, totalMinutes));
  }
  for (let km = config.gapKm; km < routeState.totalKm; km += config.gapKm) {
    const pointIndex = findNearestPointIndexByKm(km);
    const previous = previousByKey.get(String(pointIndex));
    mergeCheckpointCandidate(candidates, previous ? { ...previous, ...buildCheckpointFromIndex(pointIndex, { kind: 'distance', label: 'Max distance gap' }, model, totalMinutes) } : buildCheckpointFromIndex(pointIndex, { kind: 'distance', label: 'Max distance gap' }, model, totalMinutes));
  }
  getSolarCheckpointEvents(weatherData ? getSelectedStartTime(weatherData) : null, totalMinutes).forEach(event => {
    const pointIndex = findNearestPointIndexByMinute(model, event.minuteFromStart);
    const previous = previousByKey.get(String(pointIndex));
    mergeCheckpointCandidate(candidates, previous ? { ...previous, ...buildCheckpointFromIndex(pointIndex, { kind: event.kind, label: event.label }, model, totalMinutes) } : buildCheckpointFromIndex(pointIndex, { kind: event.kind, label: event.label }, model, totalMinutes));
  });
  routeState.samples = applyBaseCheckpointLabels(pruneCheckpointCandidates(candidates, config.targetMax));
  return routeState.samples;
}

function sampleRouteCheckpoints() {
  if (!routeState?.points?.length) return [];
  const totalMinutes = getRouteTimingMinutes();
  if (!isFiniteNumber(totalMinutes) || totalMinutes <= 0) {
    routeState.samples = [];
    return [];
  }
  return checkpointModel === 'smart' ? sampleRouteCheckpointsSmart(totalMinutes) : sampleRouteCheckpointsOld(totalMinutes);
}

function getRouteSampleCount() {
  const profile = getDurationProfile() || null;
  if (!routeState) return 0;
  const km = routeState.totalKm || 0;
  if (profile?.mode === 'daily') return km >= 200 ? 8 : 6;
  if (km >= 400) return 10;
  if (km >= 250) return 9;
  if (km >= 160) return 8;
  if (km >= 100) return 7;
  if (km >= 60) return 6;
  if (km >= 30) return 5;
  return 4;
}

function buildRouteCheckpointMarker(cp) {
  const kind = cp.markerKind || (cp.label === 'Start' ? 'start' : (cp.label === 'Finish' ? 'finish' : 'mid'));
  const shortLabel = cp.markerShort || (kind === 'start' ? 'S' : (kind === 'finish' ? 'F' : '•'));
  return L.marker([cp.lat, cp.lon], {
    icon: L.divIcon({
      className: 'route-checkpoint-marker-wrapper',
      html: `<span class="checkpoint-marker ${kind}" title="${escapeHtml(cp.label)}">${escapeHtml(shortLabel)}</span>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -10]
    })
  });
}

function renderRouteMap() {
  if (!routeState?.points?.length) {
    mapCard.style.display = 'none';
    return;
  }
  mapCard.style.display = 'block';
  initRouteMap();
  clearRouteMapLayers();
  const latlngs = routeState.points.map(p => [p.lat, p.lon]);
  const poly = L.polyline(latlngs, { color: '#3a6b8a', weight: 4, opacity: 0.9 }).addTo(routeLayer);
  const checkpoints = routeState.samples?.length ? routeState.samples : sampleRouteCheckpoints();
  checkpoints.forEach(cp => {
    buildRouteCheckpointMarker(cp)
      .bindPopup(buildRouteCheckpointPopupHtml(cp))
      .addTo(routeMarkersLayer);
  });
  routeMap.fitBounds(poly.getBounds(), { padding: [24, 24] });
  setTimeout(() => routeMap.invalidateSize(), 0);
  const gainText = routeState.totalGain >= 20 ? ` · +${Math.round(routeState.totalGain)} m` : '';
  const modelText = checkpointModel === 'smart' ? ' · smart checkpoints' : ' · old checkpoints';
  routeSummary.textContent = `${routeState.fileName} · ${routeState.points.length} points · ${formatKm(routeState.totalKm)}${gainText}${routeHasDurationOverride() ? ` · route time ${formatMinutesShort(routeState.elapsedMinutes)}` : ''}${modelText}`;
}

function getInterpolatedForecastPointFromHourly(hourly, timeStr) {
  if (!hourly?.length) return null;
  const targetMs = parseAnyTime(timeStr);
  let afterIndex = hourly.findIndex(h => parseAnyTime(h.time) >= targetMs);
  if (afterIndex <= 0) {
    const point = hourly[Math.max(0, afterIndex)] || hourly[0];
    return point ? { ...point, time: timeStr } : null;
  }
  if (afterIndex < 0) {
    const point = hourly[hourly.length - 1];
    return point ? { ...point, time: timeStr } : null;
  }
  const before = hourly[afterIndex - 1];
  const after = hourly[afterIndex];
  const beforeMs = parseAnyTime(before.time);
  const afterMs = parseAnyTime(after.time);
  const span = Math.max(1, afterMs - beforeMs);
  const ratio = Math.max(0, Math.min(1, (targetMs - beforeMs) / span));
  return {
    time: timeStr,
    temp: interpolateNumber(before, after, ratio, 'temp'),
    feels: interpolateNumber(before, after, ratio, 'feels'),
    precipProb: interpolateNumber(before, after, ratio, 'precipProb'),
    precip: interpolateNumber(before, after, ratio, 'precip'),
    wind: interpolateNumber(before, after, ratio, 'wind'),
    gusts: interpolateNumber(before, after, ratio, 'gusts'),
    uv: interpolateNumber(before, after, ratio, 'uv', null),
    aqi: interpolateNumber(before, after, ratio, 'aqi', null),
    windDir: ratio < 0.5 ? before.windDir : after.windDir,
    code: ratio < 0.5 ? before.code : after.code,
    isDay: ratio < 0.5 ? before.isDay : after.isDay
  };
}

function summarizeCheckpointWeatherWindow(hourly, eta, minutes = 15) {
  const offsets = [-minutes, 0, minutes];
  const points = offsets.map(offset => getInterpolatedForecastPointFromHourly(hourly, addMinutesToLocalString(eta, offset))).filter(Boolean);
  if (!points.length) return null;
  const temps = points.map(p => p.temp).filter(isFiniteNumber);
  const feels = points.map(p => p.feels).filter(isFiniteNumber);
  const winds = points.map(p => p.wind).filter(isFiniteNumber);
  const gusts = points.map(p => p.gusts).filter(isFiniteNumber);
  const precips = points.map(p => p.precip).filter(isFiniteNumber);
  const probs = points.map(p => p.precipProb).filter(isFiniteNumber);
  const uvs = points.map(p => p.uv).filter(isFiniteNumber);
  return {
    tempMin: temps.length ? Math.min(...temps) : null,
    tempMax: temps.length ? Math.max(...temps) : null,
    feelsMin: feels.length ? Math.min(...feels) : null,
    feelsMax: feels.length ? Math.max(...feels) : null,
    maxWind: winds.length ? Math.max(...winds) : null,
    maxGust: gusts.length ? Math.max(...gusts) : null,
    maxPrecip: precips.length ? Math.max(...precips) : null,
    maxPrecipProb: probs.length ? Math.max(...probs) : null,
    maxUv: uvs.length ? Math.max(...uvs) : null
  };
}

async function fetchRouteCheckpointForecast(cp) {
  const cacheKey = `${cp.lat.toFixed(4)},${cp.lon.toFixed(4)}`;
  const cache = routeState.weatherCache[cacheKey] || (routeState.weatherCache[cacheKey] = {});
  if (!cache.hourly) {
    const url = `${WEATHER_API}?latitude=${cp.lat}&longitude=${cp.lon}&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,wind_speed_10m,wind_gusts_10m,wind_direction_10m,weather_code,is_day,uv_index&forecast_days=7&wind_speed_unit=kmh&timezone=auto`;
    const res = await fetchWithTimeout(url, {}, 12000, 'Route checkpoint weather');
    if (!res.ok) throw new Error(`Route checkpoint weather HTTP ${res.status}`);
    const json = await res.json();
    cache.hourly = (json.hourly?.time || []).map((time, i) => ({
      time,
      temp: json.hourly.temperature_2m?.[i],
      feels: json.hourly.apparent_temperature?.[i],
      precipProb: json.hourly.precipitation_probability?.[i],
      precip: json.hourly.precipitation?.[i],
      wind: json.hourly.wind_speed_10m?.[i],
      gusts: json.hourly.wind_gusts_10m?.[i],
      windDir: json.hourly.wind_direction_10m?.[i],
      uv: json.hourly.uv_index?.[i],
      code: json.hourly.weather_code?.[i],
      isDay: json.hourly.is_day?.[i]
    }));
  }
  if (cache.label === undefined) {
    cache.label = await reverseGeocodeLabel(cp.lat, cp.lon) || 'Nearby area';
  }
  if (cache.ecccAlerts === undefined) {
    const alertPayload = await fetchEcccWeatherAlertsForPoint(cp.lat, cp.lon, weatherData?.countryCode || '');
    cache.ecccAlerts = alertPayload.alerts || [];
    cache.ecccAlertStatus = alertPayload.status || 'not_canada';
  }
  return cache;
}

async function refreshRouteWeatherIfPossible() {
  if (!weatherData || !routeState?.points?.length) return;
  sampleRouteCheckpoints();
  renderRouteMap();
  const slot = document.getElementById('route-weather-slot');
  if (!hasPlannedDurationSelection()) {
    routeSummary.textContent = `${routeState.fileName} · ${formatKm(routeState.totalKm)}${routeHasDurationOverride() ? ` · route time ${formatMinutesShort(routeState.elapsedMinutes)}` : ''} · choose a duration to time weather checkpoints`;
    if (slot) slot.innerHTML = buildRouteWeatherHtml();
    return;
  }
  routeSummary.textContent = `${routeState.fileName} · loading checkpoint weather…`;
  await Promise.all(routeState.samples.map(async cp => {
    try {
      const cache = await withTimeout(fetchRouteCheckpointForecast(cp), 12000, 'Route checkpoint forecast');
      cp.placeLabel = cache.label || 'Nearby area';
      cp.weather = cp.eta ? getInterpolatedForecastPointFromHourly(cache.hourly, cp.eta) : null;
      cp.windowWeather = cp.eta ? summarizeCheckpointWeatherWindow(cache.hourly, cp.eta, checkpointModel === 'smart' ? 15 : 10) : null;
      cp.relativeWind = cp.weather ? describeRelativeWind(cp.bearing, cp.weather.windDir, cp.weather.wind) : null;
      cp.ecccAlerts = cache.ecccAlerts || [];
      cp.ecccAlertStatus = cache.ecccAlertStatus || 'not_canada';
    } catch (error) {
      console.warn('Route checkpoint forecast failed', error);
      cp.placeLabel = cp.placeLabel || 'Nearby area';
      cp.weather = null;
      cp.windowWeather = null;
      cp.relativeWind = null;
      cp.ecccAlerts = [];
      cp.ecccAlertStatus = 'error';
    }
  }));
  markSmartWeatherEventCheckpoints(routeState.samples);
  renderRouteMap();
  routeSummary.textContent = `${routeState.fileName} · ${formatKm(routeState.totalKm)}${routeHasDurationOverride() ? ` · route time ${formatMinutesShort(routeState.elapsedMinutes)}` : ''} · ${routeState.samples.length} ${checkpointModel === 'smart' ? 'smart' : 'old'} checkpoints`;
  if (slot) slot.innerHTML = buildRouteWeatherHtml();
}

async function handleRouteFileChange(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const points = await parseRouteFile(file);
    if (!points.length) throw new Error('No route points found in that file.');
    routeState = buildRouteState(points, file.name);
    locationCardCollapsed = true;
    updateLocationCardCollapseUi();
    routeStatus.textContent = `${file.name} loaded · ${formatKm(routeState.totalKm)}${routeState.totalGain >= 20 ? ` · +${Math.round(routeState.totalGain)} m` : ''}${routeHasDurationOverride() ? ` · route time ${formatMinutesShort(routeState.elapsedMinutes)} · duration locked` : ' · no timing found, so duration stays manual'} · ${routeState.points.length} points · ${checkpointModel} checkpoint model.`;
    clearRouteBtn.style.display = 'inline-block';
    renderPlannerState();
    if (weatherData) configureLaterInput(weatherData);
    renderRouteMap();
    if (weatherData) {
      await refreshRouteWeatherIfPossible();
    } else {
      await fetchWeatherFromResult({ latitude: routeState.points[0].lat, longitude: routeState.points[0].lon, name: 'Route start', admin1: '', country: '', country_code: '' });
    }
  } catch (err) {
    routeStatus.textContent = err.message || 'Could not read that route file.';
  }
}

function clearRoute() {
  routeState = null;
  routeFileInput.value = '';
  clearRouteBtn.style.display = 'none';
  routeStatus.textContent = 'Optional GPX or GeoJSON only. If loaded, the app can sample route checkpoints automatically. Route distance always overrides presets; route duration also overrides it when timing data exists.';
  updateLocationCardCollapseUi();
  mapCard.style.display = 'none';
  if (routeLayer) clearRouteMapLayers();
  const slot = document.getElementById('route-weather-slot');
  if (slot) slot.innerHTML = '';
  renderPlannerState();
  if (weatherData) configureLaterInput(weatherData);
  if (weatherData) renderAdvice(weatherData, selectedActivity);
}
window.clearRoute = clearRoute;

function resetLocationSection() {
  weatherData = null;
  hideSuggestions();
  hideError();
  input.value = '';
  clearRoute();
  resultCard.style.display = 'none';
  mapCard.style.display = 'none';
  locationCardCollapsed = false;
  updateLocationCardCollapseUi();
}
window.resetLocationSection = resetLocationSection;

function clearAllTool() {
  raceDayMode = false;
  manualWeatherPanelOpen = false;
  startMode = 'now';
  selectedDuration = 'h1';
  checkpointModel = 'smart';
  temperaturePreference = 0;
  plannedEffort = 'steady';
  selectedEventKey = null;
  selectedActivity = null;
  customDistanceInput.value = '';
  customDurationInput.value = '';
  averageInput.value = '';
  manualWaterTempInput.value = '';
  customMultisportSelections = { triathlon: [...defaultMultisportSelections.triathlon], indoor_multisport: [...defaultMultisportSelections.indoor_multisport] };
  if (waterBodyTypeSelect) waterBodyTypeSelect.value = 'auto';
  if (windExposureSelect) windExposureSelect.value = 'auto';
  if (poolTypeSelect) poolTypeSelect.value = 'indoor_heated';
  if (laterInput) laterInput.value = '';
  bestWindowAnalysis = null;
  bestWindowAnalysisKey = '';
  bestWindowSelectedStart = null;
  if (bestWindowResults) bestWindowResults.innerHTML = '';
  document.querySelectorAll('.activity-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.toggle-btn[data-start-mode]').forEach(btn => btn.classList.toggle('active', btn.dataset.startMode === 'now'));
  if (laterBox) laterBox.classList.remove('visible');
  if (bestWindowBox) bestWindowBox.classList.remove('visible');
  resetLocationSection();
  updateRaceDayModeUi();
  updateManualWeatherToggleUi();
  updateManualWeatherStatus();
  updateCheckpointModelUi();
  renderPlannerState();
}
window.clearAllTool = clearAllTool;

function currentLocationIconHtml() {
  return '<span class="locate-icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="2.5" fill="currentColor"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></span>';
}

function setCurrentLocationButtonState(isLoading = false) {
  if (!currentLocationBtn) return;
  currentLocationBtn.innerHTML = isLoading ? '<span class="spinner locate-spinner" aria-hidden="true"></span>' : currentLocationIconHtml();
  currentLocationBtn.title = isLoading ? 'Locating…' : 'Use current location';
  currentLocationBtn.setAttribute('aria-label', isLoading ? 'Locating current location' : 'Use current location');
}

async function useCurrentLocation() {
  if (!navigator.geolocation) {
    showError('Geolocation is not available in this browser.');
    return;
  }
  hideSuggestions();
  hideError();
  setLoading(true);
  showResultLoading();
  currentLocationBtn.disabled = true;
  setCurrentLocationButtonState(true);
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 12000, maximumAge: 300000 });
    });
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const resolvedLabel = await reverseGeocodeLabel(latitude, longitude);
    const displayLabel = resolvedLabel || 'Nearby area';
    input.value = displayLabel;
    await fetchWeatherFromResult({ latitude, longitude, name: resolvedLabel || 'Nearby area', admin1: '', country: '', country_code: '' });
  } catch (err) {
    showError('Could not get your current location.');
    resultCard.style.display = 'none';
  } finally {
    setLoading(false);
    currentLocationBtn.disabled = false;
    setCurrentLocationButtonState(false);
  }
}
window.useCurrentLocation = useCurrentLocation;

function countryFlag(code) {
  if (!code) return '🌍';
  return code.toUpperCase().replace(/./g, c => String.fromCodePoint(0x1F1E6 - 65 + c.charCodeAt(0)));
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

function showError(msg) {
  const el = document.getElementById('error-msg');
  el.textContent = msg;
  el.style.display = 'block';
}

function hideError() {
  document.getElementById('error-msg').style.display = 'none';
}

function showResultLoading() {
  resultCard.style.display = 'block';
  resultInner.innerHTML = `
    <div class="skeleton" style="width:42%;height:12px"></div>
    <div class="skeleton" style="width:72%;height:44px;margin-top:12px"></div>
    <div class="skeleton" style="width:100%;height:180px;margin-top:18px"></div>
    <div class="skeleton" style="width:100%;height:120px;margin-top:18px"></div>
    <div class="skeleton" style="width:100%;height:120px;margin-top:12px"></div>
  `;
}

function setLoading(isLoading) {
  if (fetchBtn) {
    fetchBtn.disabled = isLoading;
    fetchBtn.innerHTML = isLoading ? '<span class="spinner"></span>Fetching…' : 'Refresh';
  }
  updateRefreshWeatherButtonUi(isLoading);
}

function timeoutError(label, timeoutMs) {
  return new Error(`${label} timed out after ${timeoutMs} ms`);
}

async function withTimeout(promise, timeoutMs, label = 'Request') {
  let timer = null;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = window.setTimeout(() => reject(timeoutError(label, timeoutMs)), timeoutMs);
      })
    ]);
  } finally {
    if (timer != null) window.clearTimeout(timer);
  }
}

async function fetchWithTimeout(resource, options = {}, timeoutMs = 12000, label = 'Request') {
  if (typeof AbortController === 'undefined') {
    return withTimeout(fetch(resource, options), timeoutMs, label);
  }
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(timeoutError(label, timeoutMs)), timeoutMs);
  try {
    return await fetch(resource, { ...options, signal: controller.signal });
  } catch (error) {
    if (error?.name === 'AbortError') throw timeoutError(label, timeoutMs);
    throw error;
  } finally {
    window.clearTimeout(timer);
  }
}

async function settleOptional(promise, fallbackValue, timeoutMs, label) {
  try {
    return await withTimeout(promise, timeoutMs, label);
  } catch (error) {
    console.warn(`${label} failed`, error);
    return fallbackValue;
  }
}

function distanceKm(lat1, lon1, lat2, lon2) {
  return haversineKm(lat1, lon1, lat2, lon2);
}

function wCodeToEmoji(code) {
  return weatherCodeToEmoji(code);
}

function weatherIconHtml(code, className = 'icon') {
  const [emoji, desc] = wCodeToEmoji(code);
  return `<span class="${escapeHtml(className)}" role="img" aria-label="${escapeHtml(desc)}" title="${escapeHtml(desc)}">${emoji}</span>`;
}

function degreesToCompass(deg) {
  if (!isFiniteNumber(deg)) return 'Variable';
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  return dirs[Math.round((((deg % 360) + 360) % 360) / 22.5) % 16];
}

function windDirectionHtml(deg, className = 'wind-dir-inline', showText = true) {
  if (!isFiniteNumber(deg)) return `<span class="${escapeHtml(className)}" title="Variable wind" aria-label="Variable wind"><span class="wind-dir-arrow">↻</span>${showText ? '<span>Var.</span>' : ''}</span>`;
  const compass = degreesToCompass(deg);
  const safeDeg = Math.round((((deg % 360) + 360) % 360));
  const label = `Wind direction ${compass} (${safeDeg}°)`;
  return `<span class="${escapeHtml(className)}" title="${escapeHtml(label)}" aria-label="${escapeHtml(label)}"><span class="wind-dir-arrow" style="transform: rotate(${safeDeg}deg)">↑</span>${showText ? `<span>${escapeHtml(compass)}</span>` : ''}</span>`;
}

function formatWindTooltip(speed, gusts, dir) {
  const speedText = isFiniteNumber(speed) ? `${Math.round(speed)} km/h` : '—';
  const gustText = isFiniteNumber(gusts) ? `${Math.round(gusts)} km/h` : '—';
  return { speedText, gustText, dirHtml: windDirectionHtml(dir, 'wind-dir-inline', true) };
}

function buildRouteCheckpointPopupHtml(cp) {
  const place = cp.placeLabel || 'Nearby area';
  const reasonLine = cp.reasonLabels?.length ? `<span class="popup-muted">${escapeHtml(cp.reasonLabels.join(' · '))}</span>` : '';
  if (!cp.weather) {
    return `<div class="route-popup"><div class="popup-head"><strong>${escapeHtml(cp.label)}</strong><span class="popup-muted popup-km">${escapeHtml(formatKmPrefix(cp.kmFromStart))}</span></div><span class="popup-place">${escapeHtml(place)}</span>${cp.eta ? `<span class="popup-eta">ETA ${escapeHtml(formatShortDateTime(cp.eta))}</span>` : ''}${reasonLine}</div>`;
  }
  const w = cp.weather;
  const [, desc] = wCodeToEmoji(w.code);
  const windBits = formatWindTooltip(w.wind, w.gusts, w.windDir);
  const windowSummary = cp.windowWeather
    ? `${Math.round(firstFinite(cp.windowWeather.feelsMin, w.feels))}° to ${Math.round(firstFinite(cp.windowWeather.feelsMax, w.feels))}° feels · gusts up to ${Math.round(firstFinite(cp.windowWeather.maxGust, w.gusts, 0))} km/h`
    : null;
  const routeWind = cp.relativeWind?.short ? `<span class="popup-muted">${escapeHtml(cp.relativeWind.short)}</span>` : '';
  return `
    <div class="route-popup">
      <div class="popup-head"><strong>${escapeHtml(cp.label)}</strong><span class="popup-muted popup-km">${escapeHtml(formatKmPrefix(cp.kmFromStart))}</span></div>
      <span class="popup-place">${escapeHtml(place)}</span>
      ${cp.eta ? `<span class="popup-eta">ETA ${escapeHtml(formatShortDateTime(cp.eta))}</span>` : ''}
      ${reasonLine}
      <div class="popup-row"><span class="popup-row-left">${weatherIconHtml(w.code, 'cp-icon')} <span>${escapeHtml(desc)}</span></span><span class="popup-row-right"><span>${Math.round(w.temp)}°C</span><span class="popup-muted">feels ${Math.round(w.feels)}°C</span></span></div>
      <div class="popup-row"><span class="popup-row-left"><span>💨 ${windBits.speedText}</span>${windBits.dirHtml}</span><span class="popup-row-right"><span>↯ Gusts ${windBits.gustText}</span></span></div>
      <div class="popup-row"><span class="popup-row-left"><span>🌧 ${Math.round(w.precipProb || 0)}%</span></span><span class="popup-row-right">${routeWind}</span></div>
      ${windowSummary ? `<div class="popup-row"><span class="popup-row-left"><span>${escapeHtml(windowSummary)}</span></span></div>` : ''}
    </div>`;
}


/** 
 * Render route checkpoint cards.
 *
 * The main outfit recommendation still uses the start/main location, while these
 * cards highlight route sections that may become colder, windier, wetter, or
 * darker than the start point.
 */
function buildRouteWeatherHtml() {
  if (!routeState?.points?.length) return '';
  const samples = Array.isArray(routeState.samples) ? routeState.samples : [];
  const ready = samples.filter(cp => cp.weather);
  if (!samples.length) return `<div class="route-callout">Load a GPX or GeoJSON route to sample weather at a few checkpoints.</div>`;
  if (!hasPlannedDurationSelection()) return `<div class="route-callout">Choose a planned duration or enter a custom duration to time the weather checkpoints along the route.</div>`;

  const summary = ready.length ? (() => {
    const feels = ready
      .flatMap(cp => [firstFinite(cp.windowWeather?.feelsMin, cp.weather?.feels), firstFinite(cp.windowWeather?.feelsMax, cp.weather?.feels)])
      .filter(isFiniteNumber);
    const winds = ready.map(cp => firstFinite(cp.windowWeather?.maxWind, cp.weather?.wind)).filter(isFiniteNumber);
    const precips = ready.map(cp => firstFinite(cp.windowWeather?.maxPrecipProb, cp.weather?.precipProb)).filter(isFiniteNumber);
    const uvs = ready.map(cp => firstFinite(cp.windowWeather?.maxUv, cp.weather?.uv)).filter(isFiniteNumber);
    const bits = [];
    if (feels.length) bits.push(`lowest feels-like ${Math.round(Math.min(...feels))}°C`);
    if (winds.length) bits.push(`peak wind ${Math.round(Math.max(...winds))} km/h`);
    if (precips.length) bits.push(`max precip ${Math.round(Math.max(...precips))}%`);
    if (uvs.length) bits.push(`peak UV ${formatUvValue(Math.max(...uvs))}`);
    return bits.join(' · ');
  })() : 'Loading checkpoint weather…';

  return `
    <div class="block-title">Route checkpoints</div>
    <div class="route-callout">Main kit still follows the start or main location. Route checkpoints help catch colder, windier, wetter, sunnier, or darker sections farther along the route.${summary ? `<br>${summary}` : ''}</div>
    ${renderRouteCheckpointHazardWarnings(ready)}
    <div class="route-weather-grid">
      ${samples.map(cp => {
        const w = cp.weather;
        const reasonLine = checkpointModel === 'smart' && cp.reasonLabels?.length
          ? cp.reasonLabels.join(' · ')
          : null;
        const routeWind = cp.relativeWind?.short ? ` · ${cp.relativeWind.short}` : '';
        const windowBits = cp.windowWeather && w ? (() => {
          const bits = [];
          if (isFiniteNumber(cp.windowWeather.feelsMin) && isFiniteNumber(cp.windowWeather.feelsMax)) {
            bits.push(`${Math.round(cp.windowWeather.feelsMin)}° to ${Math.round(cp.windowWeather.feelsMax)}° feels`);
          }
          if (isFiniteNumber(cp.windowWeather.maxGust)) bits.push(`gusts up to ${Math.round(cp.windowWeather.maxGust)} km/h`);
          if (isFiniteNumber(cp.windowWeather.maxPrecipProb) && cp.windowWeather.maxPrecipProb >= 10) bits.push(`precip up to ${Math.round(cp.windowWeather.maxPrecipProb)}%`);
          if (isFiniteNumber(cp.windowWeather.maxUv) && cp.windowWeather.maxUv >= 3) bits.push(`UV up to ${formatUvValue(cp.windowWeather.maxUv)}`);
          return bits.join(' · ');
        })() : '';
        return `
          <div class="route-weather-cell">
            <div class="cp">${escapeHtml(cp.label)}</div>
            <div class="cp-main">${escapeHtml(formatKmPrefix(cp.kmFromStart))} ${w ? weatherIconHtml(w.code, 'cp-icon') : '<span class="cp-icon" aria-hidden="true">…</span>'}</div>
            <div class="cp-place">${escapeHtml(cp.placeLabel || 'Nearby area')}</div>
            <div class="cp-sub">ETA ${cp.eta ? escapeHtml(formatShortDateTime(cp.eta)) : '—'}${reasonLine ? `<br>${escapeHtml(reasonLine)}` : ''}</div>
            ${w ? `
              <div class="cp-temp">${Math.round(w.temp)}° · feels ${Math.round(w.feels)}°</div>
              <div class="cp-meta">💨 ${Math.round(w.wind || 0)} km/h ${windDirectionHtml(w.windDir, 'wind-dir-inline', true)}${escapeHtml(routeWind)}<br>↯ gusts ${isFiniteNumber(w.gusts) ? Math.round(w.gusts) : '—'} km/h${isFiniteNumber(w.uv) ? `<br>☀ ${renderUvBadge(w.uv, true)}` : ''}<br>🌧 ${Math.round(w.precipProb || 0)}%${windowBits ? `<br>${escapeHtml(windowBits)}` : ''}</div>
            ` : `<div class="cp-temp">Loading…</div>`}
          </div>`;
      }).join('')}
    </div>`;
}

function summarizePlannedConditions(selection, fallbackPoint) {
  const points = Array.isArray(selection?.points) && selection.points.length ? selection.points : [fallbackPoint].filter(Boolean);
  const feelsValues = points.map(p => firstFinite(p?.feels, p?.temp)).filter(isFiniteNumber);
  const maxWind = points.reduce((max, p) => Math.max(max, firstFinite(p?.wind, 0)), 0);
  const maxGust = points.reduce((max, p) => Math.max(max, firstFinite(p?.gusts, p?.wind, 0)), 0);
  const maxUv = points.reduce((max, p) => Math.max(max, firstFinite(p?.uv, 0)), 0);
  const maxAqi = points.reduce((max, p) => isFiniteNumber(p?.aqi) ? Math.max(max, p.aqi) : max, -Infinity);
  const maxPrecip = points.reduce((max, p) => Math.max(max, firstFinite(p?.precip, 0)), 0);
  const maxPrecipProb = points.reduce((max, p) => Math.max(max, firstFinite(p?.precipProb, 0)), 0);
  return {
    points,
    minFeels: feelsValues.length ? Math.min(...feelsValues) : firstFinite(fallbackPoint?.feels, fallbackPoint?.temp),
    maxWind,
    maxGust,
    maxUv,
    maxAqi: isFiniteNumber(maxAqi) && maxAqi >= 0 ? maxAqi : null,
    maxPrecip,
    maxPrecipProb,
    anyWet: points.some(p => isWet(p?.code, p?.precip) || firstFinite(p?.precipProb, 0) >= 35),
    anySnow: points.some(p => isSnowy(p?.code)),
    precipitationWindowNote: maxPrecip > 0 ? `up to ${round1(maxPrecip)} mm during the planned window` : (maxPrecipProb >= 35 ? `up to ${Math.round(maxPrecipProb)}% precip risk during the planned window` : '')
  };
}

function isOutdoorUvRelevantActivity(activity = selectedActivity) {
  if (!activity) return true;
  return !['gym', 'indoor_running', 'indoor_cycling', 'indoor_multisport', 'swimming_pool_indoor'].includes(activity);
}

function getUvRiskInfo(value) {
  const uv = firstFinite(value, null);
  if (!isFiniteNumber(uv)) return null;
  const category = getSharedUvCategory(uv);
  const byCategory = {
    Extreme: { tone: 'severe', className: 'extreme', colour: 'purple' },
    'Very high': { tone: 'severe', className: 'very-high', colour: 'red' },
    High: { tone: 'warn', className: 'high', colour: 'orange' },
    Moderate: { tone: '', className: 'moderate', colour: 'yellow' },
    Low: { tone: 'ok', className: 'low', colour: 'green' }
  };
  return { value: uv, label: category, icon: '☀️', ...byCategory[category] };
}

function formatUvValue(value) {
  const uv = firstFinite(value, null);
  return isFiniteNumber(uv) ? round1(uv) : '—';
}

function renderUvBadge(value, compact = false) {
  const info = getUvRiskInfo(value);
  if (!info) return '';
  return `<span class="uv-badge uv-${escapeHtml(info.className)}${compact ? ' compact' : ''}">UV ${escapeHtml(formatUvValue(info.value))} · ${escapeHtml(info.label)}</span>`;
}

function renderAqiBadge(value, compact = false) {
  const info = getAqiInfo(value);
  if (!info) return '';
  return `<span class="aqi-badge aqi-${escapeHtml(info.className)}${compact ? ' compact' : ''}">AQI ${escapeHtml(String(info.value))}${compact ? '' : ` · ${escapeHtml(info.category)}`}</span>`;
}

function renderUvRatingBadge(value, compact = false) {
  const info = getUvRiskInfo(value);
  if (!info) return '';
  return `<span class="uv-badge uv-${escapeHtml(info.className)}${compact ? ' compact' : ''}">UV ${escapeHtml(info.label)}</span>`;
}

function renderUvValueBadge(value, compact = false) {
  const info = getUvRiskInfo(value);
  if (!info) return '';
  return `<span class="uv-badge uv-${escapeHtml(info.className)}${compact ? ' compact' : ''}">UV ${escapeHtml(formatUvValue(info.value))}</span>`;
}

function getDailyUvForTime(data, timeStr) {
  const day = getDayRecord(data, timeStr);
  return firstFinite(day?.uvMax, null);
}

function getUvDisplayValue(point, data) {
  return firstFinite(point?.uv, getDailyUvForTime(data, point?.time || data?.currentTime), null);
}

function getUvProtectionItem(maxUv, activity, light) {
  if (!isOutdoorUvRelevantActivity(activity)) return null;
  const info = getUvRiskInfo(maxUv);
  if (!info || info.value < 3 || !light?.isDay) return null;
  const detail = info.value >= 8
    ? `Peak UV ${formatUvValue(info.value)} (${info.label.toLowerCase()}). ECCC guidance treats this as extra/full precautions territory: avoid the strongest sun around 11:00–15:00 when possible, use shade, sunglasses, sunscreen, and skin coverage.`
    : info.value >= 6
      ? `Peak UV ${formatUvValue(info.value)} (${info.label.toLowerCase()}). ECCC guidance says protection is required: reduce midday exposure, seek shade, cover up, wear sunglasses, and use sunscreen.`
      : `Peak UV ${formatUvValue(info.value)} (${info.label.toLowerCase()}). ECCC guidance says to take precautions if outside long enough: hat, sunglasses, sunscreen, and shade near midday.`;
  return item('Sun / UV protection', detail, ['sun', 'uv']);
}

function addItemToWizardStep(wizard, itemToAdd, preferredTitlePattern = /essential|accessor|practical|basics|safety/i) {
  if (!wizard?.steps?.length || !itemToAdd) return;
  const listStep = wizard.steps.find(step => step.type === 'list' && preferredTitlePattern.test(step.title || ''))
    || wizard.steps.find(step => step.type === 'list');
  if (!listStep) return;
  listStep.items = Array.isArray(listStep.items) ? listStep.items : [];
  if (!listStep.items.some(existing => String(existing.label || '').toLowerCase() === String(itemToAdd.label || '').toLowerCase())) {
    listStep.items.push(itemToAdd);
  }
}

function augmentWizardWithUvContext(wizard, data, activity) {
  if (!wizard || !data || !isOutdoorUvRelevantActivity(activity)) return wizard;
  const selection = getForecastSelection(data, wizard.startTime || getSelectedStartTime(data));
  const planned = summarizePlannedConditions(selection, wizard.point || {});
  const maxUv = firstFinite(planned.maxUv, wizard.point?.uv, null);
  const uvInfo = getUvRiskInfo(maxUv);
  if (uvInfo && uvInfo.value >= 3) {
    wizard.chips = Array.isArray(wizard.chips) ? wizard.chips : [];
    if (!wizard.chips.some(chip => /^☀️ UV/.test(String(chip.label || '')))) {
      wizard.chips.push({ label: `☀️ UV ${formatUvValue(uvInfo.value)} · ${uvInfo.label}`, tone: `uv-${uvInfo.className}` });
    }
    addItemToWizardStep(wizard, getUvProtectionItem(uvInfo.value, activity, describeLight(data, wizard.startTime || getSelectedStartTime(data), selection)));
  }
  return wizard;
}

function augmentWizardWithAqiContext(wizard, data, activity) {
  if (!wizard || !data || !isOutdoorUvRelevantActivity(activity)) return wizard;
  const selection = getForecastSelection(data, wizard.startTime || getSelectedStartTime(data));
  const planned = summarizePlannedConditions(selection, wizard.point || {});
  const maxAqi = firstFinite(planned.maxAqi, wizard.point?.aqi, null);
  const aqiInfo = getAqiInfo(maxAqi);
  if (!aqiInfo || aqiInfo.value < 51) return wizard;
  wizard.chips = Array.isArray(wizard.chips) ? wizard.chips : [];
  if (!wizard.chips.some(chip => /^💨 AQI/.test(String(chip.label || '')))) {
    wizard.chips.push({ label: `💨 AQI ${aqiInfo.value} · ${aqiInfo.category}`, tone: `aqi-${aqiInfo.className}` });
  }
  if (aqiInfo.value >= 101) {
    addItemToWizardStep(wizard, { label: 'Air quality mask', detail: `AQI ${aqiInfo.value} (${aqiInfo.category}) — consider an N95/KN95 mask for prolonged outdoor effort.` });
  }
  return wizard;
}

function isProbablyCanadaPoint(lat, lon) {
  return isProbablyCanadaPointFromModule(lat, lon);
}

function shouldUseEcccAlertsForData(data = weatherData) {
  return shouldUseEcccAlertsForWeatherData(data);
}

function pointInRing(lon, lat, ring) {
  return pointInRingFromModule(lon, lat, ring);
}

function ecccFeatureContainsPoint(feature, lat, lon) {
  return ecccFeatureContainsPointFromModule(feature, lat, lon);
}

function isActiveEcccAlertFeature(feature, now = new Date()) {
  return isActiveEcccAlertFeatureFromModule(feature, now);
}

function normalizeEcccAlertFeature(feature) {
  return normalizeEcccAlertFeatureFromModule(feature);
}

function dedupeAlerts(alerts = []) {
  return dedupeAlertsFromModule(alerts);
}

async function fetchEcccWeatherAlertsForPoint(lat, lon, countryCode = '') {
  return fetchEcccWeatherAlertsForPointFromModule(lat, lon, countryCode);
}

function getEcccAlertWarningsForData(data = weatherData) {
  return dedupeAlerts(data?.ecccAlerts || []);
}

function getEcccAlertWarningsForRoute(samples = []) {
  return dedupeAlerts((samples || []).flatMap(cp => cp.ecccAlerts || []));
}

function getAqiHazardWarning(selection, point) {
  const planned = summarizePlannedConditions(selection, point);
  const maxAqi = firstFinite(planned.maxAqi, point?.aqi, null);
  const info = getAqiInfo(maxAqi);
  if (!info || info.value < 100) return null;
  if (info.value >= 201) {
    return { level: 'purple', icon: '😷', title: `${info.category} air quality`, detail: `Peak AQI around ${info.value}. Avoid prolonged outdoor exertion. N95/KN95 mask recommended if going out.` };
  }
  if (info.value >= 151) {
    return { level: 'red', icon: '😷', title: 'Unhealthy air quality', detail: `Peak AQI around ${info.value}. Everyone may experience health effects. Reduce prolonged outdoor effort and consider a mask.` };
  }
  return { level: 'orange', icon: '😷', title: 'Unhealthy for Sensitive Groups', detail: `Peak AQI around ${info.value}. Sensitive individuals (asthma, heart/lung conditions) should reduce prolonged outdoor exertion.` };
}

function getUvHazardWarning(data, selection, point, activity) {
  if (!isOutdoorUvRelevantActivity(activity)) return null;
  const planned = summarizePlannedConditions(selection, point);
  const routeSamples = (routeState?.samples || []).filter(cp => cp.weather);
  const routeMaxUv = routeSamples.map(cp => firstFinite(cp.windowWeather?.maxUv, cp.weather?.uv)).filter(isFiniteNumber);
  const maxUv = Math.max(firstFinite(planned.maxUv, point?.uv, 0), routeMaxUv.length ? Math.max(...routeMaxUv) : 0);
  const info = getUvRiskInfo(maxUv);
  if (!info || info.value < 6) return null;
  if (info.value >= 8) {
    return { level: info.className === 'extreme' ? 'purple' : 'red', icon: '☀️', title: `${info.label} UV exposure`, detail: `Peak UV around ${formatUvValue(maxUv)}. Follow ECCC sun-safety guidance: avoid the strongest sun around 11:00–15:00 when possible, seek shade, wear sunglasses, use sunscreen, and cover skin.` };
  }
  return { level: 'orange', icon: '☀️', title: 'High UV exposure', detail: `Peak UV around ${formatUvValue(maxUv)}. ECCC guidance says protection is required: reduce midday exposure, seek shade, cover up, wear sunglasses, and use sunscreen.` };
}

function getRouteUvHazardWarning(samples = []) {
  const ready = (samples || []).filter(cp => cp.weather);
  if (!ready.length || !isOutdoorUvRelevantActivity(selectedActivity)) return null;
  const maxUv = Math.max(...ready.map(cp => firstFinite(cp.windowWeather?.maxUv, cp.weather?.uv, 0)));
  const info = getUvRiskInfo(maxUv);
  if (!info || info.value < 6) return null;
  return {
    level: info.value >= 8 ? (info.className === 'extreme' ? 'purple' : 'red') : 'orange',
    icon: '☀️',
    title: `Route checkpoint ${info.label.toLowerCase()} UV`,
    detail: `Peak checkpoint UV is around ${formatUvValue(maxUv)}. Let sun protection influence the kit choice.`
  };
}

function getForecastHazardWarnings(data, selection, point, activity) {
  const points = Array.isArray(selection?.points) && selection.points.length ? selection.points : [point].filter(Boolean);
  const planned = summarizePlannedConditions(selection, point);
  const routeSamples = (routeState?.samples || []).filter(cp => cp.weather);
  const routeMaxGust = routeSamples.map(cp => firstFinite(cp.windowWeather?.maxGust, cp.weather?.gusts)).filter(isFiniteNumber);
  const routeMaxWind = routeSamples.map(cp => firstFinite(cp.windowWeather?.maxWind, cp.weather?.wind)).filter(isFiniteNumber);
  const routeMaxPrecipProb = routeSamples.map(cp => firstFinite(cp.windowWeather?.maxPrecipProb, cp.weather?.precipProb)).filter(isFiniteNumber);
  const routeMaxPrecip = routeSamples.map(cp => firstFinite(cp.windowWeather?.maxPrecip, cp.weather?.precip)).filter(isFiniteNumber);
  const routeMaxUv = routeSamples.map(cp => firstFinite(cp.windowWeather?.maxUv, cp.weather?.uv)).filter(isFiniteNumber);
  const maxGust = Math.max(firstFinite(planned.maxGust, 0), routeMaxGust.length ? Math.max(...routeMaxGust) : 0);
  const maxWind = Math.max(firstFinite(planned.maxWind, 0), routeMaxWind.length ? Math.max(...routeMaxWind) : 0);
  const maxPrecipProb = Math.max(firstFinite(planned.maxPrecipProb, 0), routeMaxPrecipProb.length ? Math.max(...routeMaxPrecipProb) : 0);
  const maxPrecip = Math.max(firstFinite(planned.maxPrecip, 0), routeMaxPrecip.length ? Math.max(...routeMaxPrecip) : 0);
  const maxUv = Math.max(firstFinite(planned.maxUv, point?.uv, 0), routeMaxUv.length ? Math.max(...routeMaxUv) : 0);
  const codes = [...points.map(p => firstFinite(p?.code, -1)), ...routeSamples.map(cp => firstFinite(cp.weather?.code, -1))];
  const warnings = [];

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

function renderGenericWarningList(warnings, note, ariaLabel = 'Weather warnings') {
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

function renderWeatherHazardWarnings(data, selection, point, activity) {
  const useEccc = shouldUseEcccAlertsForData(data);
  const uvWarning = getUvHazardWarning(data, selection, point, activity);
  let warnings = [];
  let note = '';
  if (useEccc && data?.ecccAlertStatus === 'ok') {
    warnings = getEcccAlertWarningsForData(data);
    note = warnings.length
      ? 'Official Environment Canada weather alerts for this Canadian location. UV guidance follows ECCC / Health Canada UV categories.'
      : 'No active official Environment Canada weather alerts found for this Canadian location. UV guidance follows ECCC / Health Canada UV categories.';
  } else if (useEccc && data?.ecccAlertStatus === 'error') {
    warnings = getForecastHazardWarnings(data, selection, point, activity);
    note = 'Environment Canada alert lookup failed, so this panel is using forecast-derived warnings as a fallback. UV guidance follows ECCC / Health Canada UV categories.';
  } else {
    warnings = getForecastHazardWarnings(data, selection, point, activity);
    note = 'Forecast-derived warnings for non-Canadian locations. UV guidance follows ECCC / Health Canada UV categories.';
  }
  if (uvWarning) warnings.push(uvWarning);
  const aqiWarning = getAqiHazardWarning(selection, point);
  if (aqiWarning) warnings.push(aqiWarning);
  if (!warnings.length && !(useEccc && data?.ecccAlertStatus === 'ok')) return '';
  return renderGenericWarningList(warnings, note, 'Weather warnings');
}

function getRouteCheckpointHazardWarnings(samples = []) {
  const ready = (samples || []).filter(cp => cp.weather);
  if (!ready.length) return [];
  const maxGust = Math.max(...ready.map(cp => firstFinite(cp.windowWeather?.maxGust, cp.weather?.gusts, cp.weather?.wind, 0)));
  const maxWind = Math.max(...ready.map(cp => firstFinite(cp.windowWeather?.maxWind, cp.weather?.wind, 0)));
  const maxPrecipProb = Math.max(...ready.map(cp => firstFinite(cp.windowWeather?.maxPrecipProb, cp.weather?.precipProb, 0)));
  const maxPrecip = Math.max(...ready.map(cp => firstFinite(cp.windowWeather?.maxPrecip, cp.weather?.precip, 0)));
  const maxUv = Math.max(...ready.map(cp => firstFinite(cp.windowWeather?.maxUv, cp.weather?.uv, 0)));
  const hasStorm = ready.some(cp => [95, 96, 99].includes(firstFinite(cp.weather?.code, -1)));
  const warnings = [];
  if (hasStorm) warnings.push({ level: 'severe', icon: '⛈️', title: 'Route checkpoint thunderstorm risk', detail: 'One or more checkpoints look stormy. Consider changing the route or timing.' });
  if (maxGust >= 55 || maxWind >= 40) warnings.push({ level: 'severe', icon: '💨', title: 'Route checkpoint wind warning', detail: `A checkpoint may see gusts near ${Math.round(maxGust)} km/h.` });
  else if (maxGust >= 38) warnings.push({ level: 'warn', icon: '💨', title: 'Route checkpoint gusts', detail: `Peak checkpoint gusts may reach about ${Math.round(maxGust)} km/h.` });
  if (maxPrecipProb >= 75 || maxPrecip >= 3) warnings.push({ level: 'warn', icon: '🌧️', title: 'Route checkpoint precipitation risk', detail: `Checkpoint precip risk peaks near ${Math.round(maxPrecipProb)}%${maxPrecip > 0 ? ` with up to ${round1(maxPrecip)} mm in a slice` : ''}.` });
  return warnings;
}

function renderRouteCheckpointHazardWarnings(samples = []) {
  const routeTouchesCanada = shouldUseEcccAlertsForData(weatherData) || (samples || []).some(cp => isProbablyCanadaPoint(cp.lat, cp.lon));
  const uvWarning = getRouteUvHazardWarning(samples);
  let warnings = [];
  let note = '';
  if (routeTouchesCanada) {
    warnings = getEcccAlertWarningsForRoute(samples);
    const anyError = (samples || []).some(cp => cp.ecccAlertStatus === 'error');
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

function getEyewearSuggestionItem(activity, point, planned, light, wetLike, isRaceDay) {
  const windy = firstFinite(planned?.maxWind, point?.wind, 0) >= 25;
  const gloomy = !light?.isDay || light?.tone === 'warn' || firstFinite(point?.code, 3) >= 3;
  const wetWindow = !!wetLike || !!planned?.anyWet || firstFinite(planned?.maxPrecipProb, 0) >= 35;
  const bright = !!light?.isDay && !gloomy && !wetWindow && [0, 1].includes(firstFinite(point?.code, 0));

  if (activity === 'cycling' || activity === 'triathlon') {
    if (!light?.isDay) return item('Clear-lens cycling glasses', 'Best for dark starts, bugs, and keeping wind out without killing contrast.', ['eyewear']);
    if (wetWindow) return item('Clear or photochromic wraparound glasses', 'Skip dark lenses when it is wet or gloomy so road spray, potholes, and painted lines stay visible.', ['eyewear']);
    if (bright) return item('Dark wraparound sunglasses', 'Good call for bright sun, higher speed, and stronger glare.', ['eyewear']);
    if (windy || isRaceDay) return item('Photochromic or mid-tint wraparound sunglasses', 'Good all-round option when light changes and you still want proper wind protection.', ['eyewear']);
    return item('Photochromic sports glasses', 'Useful middle-ground choice when the light could swing a bit.', ['eyewear']);
  }

  if (activity === 'running') {
    if (!light?.isDay) return null;
    if (wetWindow) return item('Clear or very light-tint running glasses', 'More useful than dark lenses if the race or run is wet, gloomy, or low-contrast.', ['eyewear']);
    if (bright) return item('Dark running sunglasses', 'Good for bright sun and harder efforts where squinting gets annoying fast.', ['eyewear']);
    if (isRaceDay) return item('Photochromic or light-tint running sunglasses', 'Safer all-round race choice if the sky looks mixed rather than fully sunny.', ['eyewear']);
    return null;
  }

  if (activity === 'road_trip' || activity === 'walk' || activity === 'casual') {
    if (bright) return item('Sunglasses', 'Useful for glare and fatigue in bright conditions.', ['eyewear']);
    return null;
  }

  return null;
}

function isWet(code, precip) {
  return (precip ?? 0) > 0 || [51,53,55,56,57,61,63,65,66,67,80,81,82,95,96,99].includes(code);
}

function isSnowy(code) {
  return [71,73,75,77,85,86].includes(code);
}

function getCyclingEffectiveTemp(point) {
  const windPenalty = Math.min(8, Math.max(0, ((point.wind ?? 0) - 10) / 4));
  return Math.round((point.feels ?? point.temp ?? 0) - windPenalty);
}

function parseLocalString(str) {
  if (!str || typeof str !== 'string') return null;
  const [datePart, timePart = '00:00'] = str.split('T');
  const [y, m, d] = datePart.split('-').map(Number);
  const [hh, mm] = timePart.split(':').map(Number);
  return new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0, 0);
}

// Accept Date objects, numbers, ISO strings, or local datetime strings and return epoch ms.
function parseAnyTime(value) {
  if (value == null) return NaN;
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'number') return value;
  const text = String(value).trim();
  if (!text) return NaN;
  const nativeParsed = Date.parse(text);
  if (Number.isFinite(nativeParsed)) return nativeParsed;
  const local = parseLocalString(text);
  return local ? local.getTime() : NaN;
}

async function reverseGeocodeLabel(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&zoom=10&addressdetails=1`;
    const res = await fetchWithTimeout(url, { headers: { 'Accept-Language': 'en' } }, 8000, 'Reverse geocode');
    if (!res.ok) throw new Error('reverse geocode failed');
    const data = await res.json();
    const addr = data.address || {};
    const city = addr.city || addr.town || addr.village || addr.municipality || addr.hamlet || addr.county || '';
    const region = addr.state || addr.province || addr.state_district || '';
    const country = addr.country_code ? addr.country_code.toUpperCase() : (addr.country || '');
    if (city && region) return `${city}, ${region}`;
    if (city && country) return `${city}, ${country}`;
    if (city) return city;
    if (region && country) return `${region}, ${country}`;
    return null;
  } catch (_) {
    return null;
  }
}

function formatDateTimeLocal(date) {
  const p = n => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${p(date.getMonth()+1)}-${p(date.getDate())}T${p(date.getHours())}:${p(date.getMinutes())}`;
}

/**
 * Build a neutral pseudo-weather object for indoor-only guidance.
 *
 * This is deliberately NOT a forecast and is only used when the selected
 * activity does not require outdoor conditions. The values are mild and dry so
 * they do not accidentally trigger rain/cold/wind clothing rules. Indoor advice
 * branches also check `noLocationIndoor` so summaries do not pretend that these
 * are real outside conditions.
 */
function buildIndoorFallbackWeatherData(activity = selectedActivity) {
  const now = new Date();
  const currentTime = formatDateTimeLocal(now).slice(0, 16);
  const basePoint = {
    time: currentTime,
    temp: 20,
    feels: 20,
    humidity: 45,
    precipProb: 0,
    precip: 0,
    wind: 0,
    gusts: 0,
    windDir: 0,
    code: 0,
    isDay: 1,
    waterTemp: null,
    waterTempSource: 'unknown'
  };
  const hourly = Array.from({ length: 25 }, (_, i) => ({
    ...basePoint,
    time: addMinutesToLocalString(currentTime, i * 60)
  }));
  const today = currentTime.slice(0, 10);
  const tomorrow = formatDateOnlyLocal(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1));
  const makeDay = date => ({
    date,
    tempMax: 20,
    tempMin: 20,
    precip: 0,
    precipProb: 0,
    code: 0,
    sunrise: `${date}T06:00`,
    sunset: `${date}T20:00`
  });
  return {
    noLocationIndoor: true,
    indoorOnlyActivity: activity,
    locationName: 'Indoor activity',
    currentTime,
    current: basePoint,
    hourly,
    daily: [makeDay(today), makeDay(tomorrow)],
    marineSource: null,
    pseudoWaterEstimate: null,
    latitude: null,
    longitude: null
  };
}

function roundUpToHour(date) {
  const d = new Date(date.getTime());
  if (d.getMinutes() || d.getSeconds() || d.getMilliseconds()) {
    d.setHours(d.getHours() + 1, 0, 0, 0);
  }
  return d;
}

function addMinutesToLocalString(str, minutes) {
  const d = parseLocalString(str);
  if (!d) return str;
  d.setMinutes(d.getMinutes() + minutes);
  return formatDateTimeLocal(d).slice(0,16);
}

function formatShortDateTime(str) {
  const d = parseLocalString(str);
  if (!d) return str;
  return d.toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
}

function formatShortTime(str) {
  const d = parseLocalString(str);
  if (!d) return str;
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

function formatWeatherDateTime(str) {
  const d = parseLocalString(str);
  if (!d) return str;
  return d.toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
}

function formatWeekdayTime(str) {
  const d = parseLocalString(str);
  if (!d) return str;
  const weekday = d.toLocaleDateString([], { weekday: 'short' });
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${weekday} ${time}`;
}

function formatBestWindowSpan(startStr, endStr) {
  return formatBestWindowSpanFromModule(startStr, endStr);
}

function getBestWindowTimelineTickMinutes(totalMinutes) {
  return getBestWindowTimelineTickConfig(totalMinutes).major;
}

function getBestWindowTimelineTickConfig(totalMinutes) {
  return getBestWindowTimelineTickConfigFromModule(totalMinutes);
}

function ceilDateToStep(date, stepMinutes) {
  const d = new Date(date.getTime());
  d.setSeconds(0, 0);
  const mins = d.getHours() * 60 + d.getMinutes();
  const rounded = Math.ceil(mins / stepMinutes) * stepMinutes;
  d.setHours(0, 0, 0, 0);
  d.setMinutes(rounded);
  return d;
}

function formatBestWindowTimelineTickLabel(dateOrStr, tickInfo, multiDay, tickType = 'major') {
  return formatBestWindowTimelineTickLabelFromModule(dateOrStr, tickInfo, multiDay, tickType);
}

// Shorter outings can use finer picker steps; long or multi-day events stay coarser.
function getLaterPickerMinuteIncrement() {
  return 5;
}

// Flatpickr gives us a cleaner JS date-time picker than a giant dropdown list.
function ensureLaterPicker() {
  if (!laterInput || typeof flatpickr === 'undefined' || laterPicker) return laterPicker;
  laterPicker = flatpickr(laterInput, {
    enableTime: true,
    time_24hr: true,
    allowInput: false,
    clickOpens: true,
    disableMobile: true,
    dateFormat: 'Y-m-d\TH:i',
    altInput: true,
    altFormat: 'l, M j · H:i',
    minuteIncrement: getLaterPickerMinuteIncrement(),
    locale: {
      firstDayOfWeek: 1
    },
    onChange: () => {
      if (weatherData) renderAdvice(weatherData, selectedActivity);
      if (weatherData) refreshRouteWeatherIfPossible();
    }
  });
  return laterPicker;
}


function createBestWindowPicker(input, placeholder, onChange) {
  if (!input || typeof flatpickr === 'undefined') return null;
  const picker = flatpickr(input, {
    enableTime: true,
    time_24hr: true,
    allowInput: false,
    clickOpens: true,
    disableMobile: true,
    dateFormat: 'Y-m-d\TH:i',
    altInput: true,
    altFormat: 'l, M j · H:i',
    minuteIncrement: getLaterPickerMinuteIncrement(),
    locale: {
      firstDayOfWeek: 1
    },
    onChange
  });
  if (picker.altInput) picker.altInput.placeholder = placeholder;
  return picker;
}

function ensureBestWindowPickers() {
  if (!bestWindowStartPicker && bestWindowStartInput) {
    bestWindowStartPicker = createBestWindowPicker(
      bestWindowStartInput,
      'Pick a search start date and time',
      () => {
        const startDate = parseLocalString(bestWindowStartInput?.value || '');
        const endDate = parseLocalString(bestWindowEndInput?.value || '');
        if (startDate && endDate && endDate <= startDate) {
          const fallbackEnd = new Date(startDate.getTime() + Math.max(30, getBestWindowStepMinutes()) * 60000);
          if (bestWindowEndPicker) bestWindowEndPicker.setDate(fallbackEnd, false, 'Y-m-d\TH:i');
          else if (bestWindowEndInput) bestWindowEndInput.value = formatDateTimeLocal(fallbackEnd).slice(0, 16);
        }
        handleBestWindowInputChange();
      }
    );
  }
  if (!bestWindowEndPicker && bestWindowEndInput) {
    bestWindowEndPicker = createBestWindowPicker(
      bestWindowEndInput,
      'Pick a search end date and time',
      () => {
        const startDate = parseLocalString(bestWindowStartInput?.value || '');
        const endDate = parseLocalString(bestWindowEndInput?.value || '');
        if (startDate && endDate && endDate <= startDate) {
          const fallbackEnd = new Date(startDate.getTime() + Math.max(30, getBestWindowStepMinutes()) * 60000);
          if (bestWindowEndPicker) bestWindowEndPicker.setDate(fallbackEnd, false, 'Y-m-d\TH:i');
          else if (bestWindowEndInput) bestWindowEndInput.value = formatDateTimeLocal(fallbackEnd).slice(0, 16);
        }
        handleBestWindowInputChange();
      }
    );
  }
  return { start: bestWindowStartPicker, end: bestWindowEndPicker };
}

function setFlatpickrDisabledState(picker, disabled) {
  if (!picker) return;
  if (picker.input) picker.input.disabled = disabled;
  if (picker.altInput) picker.altInput.disabled = disabled;
}


function normalizeSearchResult(result, source = 'openmeteo') {
  return normalizeSearchResultFromModule(result, source);
}

function dedupeSearchResults(results) {
  return dedupeSearchResultsFromModule(results);
}

async function searchPlaces(query, count = 6) {
  return searchPlacesFromModule(query, count);
}

function getLocationPriorityScore(result) {
  return getLocationPriorityScoreFromModule(result);
}

async function resolvePlaceQuery(query) {
  const results = await searchPlaces(query, 1);
  if (!results.length) throw new Error(`Location "${query}" not found.`);
  return results[0];
}

function fetchSuggestions(q) {
  return searchPlaces(q, 6)
    .then(results => {
      suggestionsData = results || [];
      renderSuggestions();
    })
    .catch(() => hideSuggestions());
}

function positionSuggestions() {
  if (suggestionsPortal.style.display === 'none' || suggestionsPortal.style.display === '') return;
  const rect = input.getBoundingClientRect();
  suggestionsPortal.style.left = `${Math.round(rect.left)}px`;
  suggestionsPortal.style.top = `${Math.round(rect.bottom + 6)}px`;
  suggestionsPortal.style.width = `${Math.round(rect.width)}px`;
}

function renderSuggestions() {
  if (!suggestionsData.length) {
    hideSuggestions();
    return;
  }
  focusedIndex = -1;
  suggestionsPortal.innerHTML = suggestionsData.map((r, i) => {
    const parts = [r.admin1, r.country].filter(Boolean).join(' · ') || (r.display_name && r.display_name !== r.name ? r.display_name : '');
    return `
      <button type="button" class="suggestion-item" data-index="${i}" data-action="pickSuggestion">
        <span class="s-flag">${countryFlag(r.country_code)}</span>
        <div>
          <div class="s-main">${escapeHtml(r.name)}</div>
          <div class="s-sub">${escapeHtml(parts)}</div>
        </div>
      </button>`;
  }).join('');
  suggestionsPortal.style.display = 'block';
  positionSuggestions();
}

function hideSuggestions() {
  suggestionsPortal.style.display = 'none';
  focusedIndex = -1;
}

function updateFocus() {
  const items = suggestionsPortal.querySelectorAll('.suggestion-item');
  items.forEach((el, i) => el.classList.toggle('focused', i === focusedIndex));
  if (items[focusedIndex]) items[focusedIndex].scrollIntoView({ block: 'nearest' });
}

function pickSuggestion(index) {
  const r = suggestionsData[index];
  if (!r) return;
  input.value = [r.name, r.admin1, r.country].filter(Boolean).join(', ');
  hideSuggestions();
  fetchWeatherFromResult(r);
}
window.pickSuggestion = pickSuggestion;

renderPlannerState();
updateRaceDayModeUi();
updateManualWeatherToggleUi();
updateLocationCardCollapseUi();
updatePlannerCardCollapseUi();
updateManualWeatherStatus();
updateTemperaturePreferenceUi();
updatePlannedEffortUi();
if (bestWindowBox) bestWindowBox.classList.toggle('visible', startMode === 'best');

input.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  updateRefreshWeatherButtonUi();
  const q = input.value.trim();
  if (q.length < 2) {
    hideSuggestions();
    return;
  }
  debounceTimer = setTimeout(() => fetchSuggestions(q), 260);
});

input.addEventListener('keydown', e => {
  const items = suggestionsPortal.querySelectorAll('.suggestion-item');
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    focusedIndex = Math.min(focusedIndex + 1, items.length - 1);
    updateFocus();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    focusedIndex = Math.max(focusedIndex - 1, 0);
    updateFocus();
  } else if (e.key === 'Enter') {
    if (focusedIndex >= 0 && items[focusedIndex]) {
      items[focusedIndex].click();
    } else {
      fetchWeather();
    }
  } else if (e.key === 'Escape') {
    hideSuggestions();
  }
});

window.addEventListener('resize', positionSuggestions);
window.addEventListener('scroll', positionSuggestions, true);
document.addEventListener('click', e => {
  if (!e.target.closest('.input-wrapper') && !e.target.closest('#suggestions-portal')) hideSuggestions();
});

laterInput.addEventListener('change', () => {
  if (weatherData) renderAdvice(weatherData, selectedActivity);
  if (weatherData) refreshRouteWeatherIfPossible();
});

function handleBestWindowInputChange() {
  bestWindowAnalysis = null;
  bestWindowAnalysisKey = '';
  bestWindowSelectedStart = null;
  if (weatherData) configureBestWindowUi(weatherData);
  if (weatherData && startMode === 'best') scheduleBestWindowAnalysis(true);
}

[
  bestWindowStartInput,
  bestWindowEndInput,
  bestWindowPrioritySelect,
  bestWindowStepSelect,
  bestWindowMaxPrecipInput,
  bestWindowMaxGustInput,
  bestWindowMinTempInput,
  bestWindowMaxTempInput,
  bestWindowMinWaterInput,
  bestWindowFinishDaylightInput
].forEach(el => {
  if (!el) return;
  const evt = el.tagName === 'SELECT' || el.type === 'checkbox' ? 'change' : 'input';
  if (el === bestWindowStartInput || el === bestWindowEndInput) return;
  el.addEventListener(evt, handleBestWindowInputChange);
});

routeFileInput.addEventListener('change', handleRouteFileChange);

function handlePlannerOverrideChange() {
  if (temperaturePreferenceInput) temperaturePreference = Number(temperaturePreferenceInput.value) || 0;
  if (weatherData) applyPseudoWaterEstimateToData(weatherData);
  bestWindowAnalysis = null;
  bestWindowAnalysisKey = '';
  bestWindowSelectedStart = null;
  renderPlannerState();
  updateManualWeatherStatus();
  if (!weatherData) refreshIndoorAdviceIfNeeded();
  if (weatherData) configureLaterInput(weatherData);
  if (weatherData) renderAdvice(weatherData, selectedActivity);
  if (weatherData) refreshRouteWeatherIfPossible();
  if (weatherData && startMode === 'best') scheduleBestWindowAnalysis(true);
}

[customDistanceInput, distanceUnitSelect, customDurationInput, durationUnitSelect, averageInput, averageUnitSelect, manualWaterTempInput, waterBodyTypeSelect, windExposureSelect, poolTypeSelect, temperaturePreferenceInput].forEach(el => {
  if (!el) return;
  const evt = el.tagName === 'SELECT' ? 'change' : 'input';
  el.addEventListener(evt, handlePlannerOverrideChange);
});

function clearPlannerCustomFields() {
  if (customDistanceInput) customDistanceInput.value = '';
  if (customDurationInput) customDurationInput.value = '';
  if (averageInput) averageInput.value = '';
}

// Activity-group accordion.
// Before an activity is selected, all groups stay open for discovery. Once an
// activity is chosen, the matching group opens and the other groups collapse as
// a default state. After that default collapse, the headers behave like normal
// toggles: the user can manually hide/unhide any subsection without the next
// planner refresh immediately undoing their choice.
// These are intentionally var, not let. renderPlannerState() runs during
// startup before this block is reached, and var is safely hoisted. With let,
// updateActivityGroupVisibility() hits the temporal dead zone and stops the
// whole app before location search/event listeners are registered.
var activityGroupsLastAutoSyncedActivity = null;
var activityGroupToggleDelegationBound = false;

function cssEscapeIdent(value) {
  // CSS.escape is available in current browsers, but this fallback keeps the
  // activity lookup from breaking in older embedded browser/webview contexts.
  if (window.CSS && typeof window.CSS.escape === 'function') return window.CSS.escape(String(value));
  return String(value).replace(/[^a-zA-Z0-9_-]/g, '\$&');
}

function getActivityGroupForActivity(activity = selectedActivity) {
  if (!activity) return null;
  const btn = document.querySelector(`.activity-btn[data-activity="${cssEscapeIdent(activity)}"]`);
  return btn?.closest('.activity-section-group') || null;
}

function updateActivityGroupVisibility() {
  const groups = Array.from(document.querySelectorAll('.activity-section-group'));
  const selectedGroup = getActivityGroupForActivity(selectedActivity);

  groups.forEach(group => {
    group.classList.toggle('has-selected-activity', group === selectedGroup);
  });

  // Reset opens everything for browsing. A newly selected activity collapses
  // non-matching groups once; subsequent renderPlannerState() calls preserve
  // the user's manual accordion choices.
  if (!selectedActivity) {
    groups.forEach(group => group.classList.remove('is-collapsed'));
    activityGroupsLastAutoSyncedActivity = null;
    return;
  }

  if (activityGroupsLastAutoSyncedActivity !== selectedActivity) {
    groups.forEach(group => group.classList.toggle('is-collapsed', group !== selectedGroup));
    activityGroupsLastAutoSyncedActivity = selectedActivity;
  }
}

function toggleActivityGroup(group) {
  if (!group) return;
  group.classList.toggle('is-collapsed');
  // Treat a manual click as the current accordion state. That prevents the next
  // planner refresh from immediately overriding the user's open/closed choice.
  activityGroupsLastAutoSyncedActivity = selectedActivity || null;
}

function setupActivityGroupToggles() {
  document.querySelectorAll('.activity-section-group .activity-group-title').forEach(title => {
    title.dataset.activityToggleBound = '1';
    title.setAttribute('role', 'button');
    title.setAttribute('tabindex', '0');
    title.setAttribute('aria-label', `Toggle ${title.textContent.trim()} activity group`);
  });

  // Delegation is more robust than attaching a fresh handler to every title.
  // The activity groups are static today, but this also survives future HTML
  // rewrites without accidentally leaving dead click handlers behind.
  if (activityGroupToggleDelegationBound) return;
  activityGroupToggleDelegationBound = true;

  document.addEventListener('click', event => {
    const title = event.target.closest?.('.activity-section-group .activity-group-title');
    if (!title) return;
    event.preventDefault();
    toggleActivityGroup(title.closest('.activity-section-group'));
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const title = event.target.closest?.('.activity-section-group .activity-group-title');
    if (!title) return;
    event.preventDefault();
    toggleActivityGroup(title.closest('.activity-section-group'));
  });
}

function resetActivitySection() {
  selectedActivity = null;
  selectedEventKey = null;
  customMultisportSelections = { triathlon: [...defaultMultisportSelections.triathlon], indoor_multisport: [...defaultMultisportSelections.indoor_multisport] };
  selectedDuration = 'h1';
  raceDayMode = false;
  temperaturePreference = 0;
  plannedEffort = 'steady';
  plannerCardCollapsed = false;
  clearPlannerCustomFields();
  document.querySelectorAll('.activity-btn').forEach(b => b.classList.remove('active'));
  renderCustomControlOptions(true);
  updateRaceDayModeUi();
  updatePlannerCardCollapseUi();
  renderPlannerState();
  if (!weatherData) resultCard.style.display = 'none';
  if (weatherData) configureLaterInput(weatherData);
  if (weatherData) renderAdvice(weatherData, selectedActivity);
  if (weatherData) refreshRouteWeatherIfPossible();
  if (weatherData && startMode === 'best') scheduleBestWindowAnalysis(true);
}
window.resetActivitySection = resetActivitySection;

function selectActivity(btn) {
  document.querySelectorAll('.activity-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedActivity = btn.dataset.activity;
  selectedEventKey = null;
  if (poolTypeSelect) {
    if (selectedActivity === 'swimming_pool_indoor') poolTypeSelect.value = 'indoor_heated';
    if (selectedActivity === 'swimming_pool_outdoor' && poolTypeSelect.value === 'indoor_heated') poolTypeSelect.value = 'outdoor_unheated';
  }
  renderCustomControlOptions(true);
  renderPlannerState();
  updateRaceDayModeUi();
  const preset = getSelectedEvent();
  syncDurationFromEvent(preset);
  renderPlannerState();
  if (!weatherData) refreshIndoorAdviceIfNeeded();
  if (weatherData) configureLaterInput(weatherData);
  if (weatherData) renderAdvice(weatherData, selectedActivity);
  if (weatherData) refreshRouteWeatherIfPossible();
  if (weatherData && startMode === 'best') scheduleBestWindowAnalysis(true);
}

function selectEventPreset(key) {
  if (customDistanceInput && !customDistanceInput.disabled) customDistanceInput.value = '';
  selectedEventKey = key;
  const preset = getSelectedEvent();
  syncDurationFromEvent(preset);
  renderPlannerState();
  if (!weatherData) refreshIndoorAdviceIfNeeded();
  if (weatherData) configureLaterInput(weatherData);
  if (weatherData) renderAdvice(weatherData, selectedActivity);
  if (weatherData) refreshRouteWeatherIfPossible();
  if (weatherData && startMode === 'best') scheduleBestWindowAnalysis(true);
}
window.selectEventPreset = selectEventPreset;

function selectDurationKey(key) {
  if (routeHasDurationOverride()) return;
  clearPlannerCustomFields();
  selectedDuration = key;
  renderPlannerState();
  if (!weatherData) refreshIndoorAdviceIfNeeded();
  if (weatherData) configureLaterInput(weatherData);
  if (weatherData) renderAdvice(weatherData, selectedActivity);
  if (weatherData) refreshRouteWeatherIfPossible();
  if (weatherData && startMode === 'best') scheduleBestWindowAnalysis(true);
}
window.selectDurationKey = selectDurationKey;

function selectStartMode(btn) {
  document.querySelectorAll('.toggle-btn[data-start-mode]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  updateCheckpointModelUi();
  startMode = btn.dataset.startMode;
  laterBox.classList.toggle('visible', startMode === 'later');
  bestWindowBox.classList.toggle('visible', startMode === 'best');
  if (!weatherData) refreshIndoorAdviceIfNeeded();
  if (weatherData) configureLaterInput(weatherData);
  if (startMode === 'best' && weatherData) scheduleBestWindowAnalysis(true);
  if (weatherData) renderAdvice(weatherData, selectedActivity);
  if (weatherData) refreshRouteWeatherIfPossible();
}

async function fetchWeather() {
  hideSuggestions();
  const loc = input.value.trim();
  if (!loc && routeState?.points?.length) {
    return fetchWeatherFromResult({ latitude: routeState.points[0].lat, longitude: routeState.points[0].lon, name: 'Route start', admin1: '', country: '', country_code: '' });
  }
  if (!loc && isNoLocationIndoorActivity(selectedActivity)) {
    hideError();
    return renderIndoorAdviceWithoutLocation();
  }
  if (!loc) return showError('Please enter a location, or load a route file.');

  hideError();
  setLoading(true);
  showResultLoading();

  try {
    const resolvedPlace = await resolvePlaceQuery(loc);
    await fetchWeatherFromResult(resolvedPlace);
  } catch (e) {
    showError(e.message || 'Something went wrong.');
    resultCard.style.display = 'none';
  } finally {
    setLoading(false);
  }
}

async function fetchWeatherFromResult(place) {
  hideError();
  setLoading(true);
  showResultLoading();
  try {
    weatherData = await fetchWeatherCore(place);
    locationCardCollapsed = true;
    updateLocationCardCollapseUi();
    configureLaterInput(weatherData);
    renderAdvice(weatherData, selectedActivity);
    await refreshRouteWeatherIfPossible();
  } catch (e) {
    showError(e.message || 'Something went wrong.');
    resultCard.style.display = 'none';
  } finally {
    setLoading(false);
  }
}


function firstFinite(...values) {
  for (const value of values) {
    if (isFiniteNumber(value)) return value;
  }
  return null;
}

function sanitizeMarineSource(source, latitude, longitude) {
  return sanitizeMarineSourceFromModule(source, latitude, longitude, distanceKm);
}

function buildMarinePayloadFromOpenMeteo(marineJson) {
  return buildMarinePayloadFromOpenMeteoFromModule(marineJson);
}

function buildMarinePayloadFromEccc(station, parsed) {
  return buildMarinePayloadFromEcccFromModule(station, parsed);
}

function buildMarinePayloadFromNdbcStation(station, parsed) {
  return buildMarinePayloadFromNdbcStationFromModule(station, parsed);
}

function textHasNoData(value) {
  return !value || /^n\/?a/i.test(value) || /^MM$/i.test(value) || value === '--';
}

function parseLooseNumber(value) {
  const cleaned = String(value ?? '').replace(/,/g, '.').replace(/[^0-9+\-.]/g, '').trim();
  if (!cleaned) return null;
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
}

async function fetchNdbcActiveStations() {
  if (Array.isArray(ndbcActiveStationsCache)) return ndbcActiveStationsCache;
  try {
    const res = await fetchWithTimeout(NOAA_NDBC_ACTIVE_XML, {}, 8000, 'NOAA buoy station list');
    if (!res.ok) throw new Error('ndbc active stations unavailable');
    const xmlText = await res.text();
    const xml = new DOMParser().parseFromString(xmlText, 'application/xml');
    ndbcActiveStationsCache = [...xml.querySelectorAll('station')].map(node => ({
      id: node.getAttribute('id') || '',
      name: node.getAttribute('name') || 'NDBC station',
      owner: node.getAttribute('owner') || '',
      lat: Number(node.getAttribute('lat')),
      lon: Number(node.getAttribute('lon')),
      waterquality: (node.getAttribute('waterquality') || 'n').toLowerCase() === 'y',
      met: (node.getAttribute('met') || 'n').toLowerCase() === 'y'
    })).filter(station => station.id && isFiniteNumber(station.lat) && isFiniteNumber(station.lon));
  } catch (_) {
    ndbcActiveStationsCache = [];
  }
  return ndbcActiveStationsCache;
}

function sortStationsByDistance(stations, latitude, longitude) {
  return stations
    .map(station => ({ ...station, distanceKm: distanceKm(latitude, longitude, station.lat, station.lon) }))
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

async function fetchNdbcStationObservation(station) {
  try {
    const res = await fetchWithTimeout(`${NOAA_NDBC_REALTIME_BASE}/${encodeURIComponent(station.id)}.txt`, {}, 8000, 'NOAA buoy observation');
    if (!res.ok) return null;
    const text = await res.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    const headerLine = lines.find(line => /^#?YY\s+MM\s+DD\s+hh/i.test(line));
    const dataLine = lines.find(line => /^\d{4}\s+\d{2}\s+\d{2}\s+\d{2}/.test(line));
    if (!headerLine || !dataLine) return null;
    const headers = headerLine.replace(/^#/, '').trim().split(/\s+/);
    const values = dataLine.trim().split(/\s+/);
    const idxWTMP = headers.indexOf('WTMP');
    const idxWVHT = headers.indexOf('WVHT');
    const waterTemp = idxWTMP >= 0 && idxWTMP < values.length && !textHasNoData(values[idxWTMP]) ? parseLooseNumber(values[idxWTMP]) : null;
    const waveHeight = idxWVHT >= 0 && idxWVHT < values.length && !textHasNoData(values[idxWVHT]) ? parseLooseNumber(values[idxWVHT]) : null;
    if (!isFiniteNumber(waterTemp) && !isFiniteNumber(waveHeight)) return null;
    return { waterTemp, waveHeight };
  } catch (_) {
    return null;
  }
}

function parseEcccMarineHtml(html) {
  const text = String(html || '').replace(/\u00a0/g, ' ');
  const waveMatch = text.match(/Wave height\s*\(m(?:[^)]*)?\)\s*([^<\n]+)/i);
  const waterMatch = text.match(/Water temperature\s*\(°C(?:[^)]*)?\)\s*([^<\n]+)/i);
  const waterTemp = waterMatch && !textHasNoData(waterMatch[1]) ? parseLooseNumber(waterMatch[1]) : null;
  const waveHeight = waveMatch && !textHasNoData(waveMatch[1]) ? parseLooseNumber(waveMatch[1]) : null;
  if (!isFiniteNumber(waterTemp) && !isFiniteNumber(waveHeight)) return null;
  return { waterTemp, waveHeight };
}

async function fetchEcccMarineFallback(latitude, longitude) {
  const nearby = sortStationsByDistance(ECCC_MARINE_STATIONS, latitude, longitude).filter(station => station.distanceKm <= 450).slice(0, 3);
  for (const station of nearby) {
    try {
      const res = await fetchWithTimeout(station.url, {}, 8000, 'ECCC marine fallback');
      if (!res.ok) continue;
      const html = await res.text();
      const parsed = parseEcccMarineHtml(html);
      if (parsed) return buildMarinePayloadFromEccc(station, parsed);
    } catch (_) {}
  }
  return null;
}

async function fetchNdbcMarineFallback(latitude, longitude) {
  const stations = await fetchNdbcActiveStations();
  const nearby = sortStationsByDistance(stations, latitude, longitude)
    .filter(station => station.distanceKm <= 500 && (station.waterquality || station.met))
    .slice(0, 8);
  for (const station of nearby) {
    const parsed = await fetchNdbcStationObservation(station);
    if (parsed) return buildMarinePayloadFromNdbcStation(station, parsed);
  }
  return null;
}

function hasUsefulMarineSource(source) {
  return hasUsefulMarineSourceFromModule(source);
}

function getNearestMarinePointFromSeries(series, targetTime) {
  return getNearestMarinePointFromSeriesFromModule(series, targetTime, parseAnyTime);
}

function getBestMarinePoint(marinePayload, targetTime) {
  return getBestMarinePointFromModule(marinePayload, targetTime, parseAnyTime, firstFinite);
}

function describeMarineSource(marinePayload) {
  return describeMarineSourceFromModule(marinePayload);
}

async function fetchMarineDataWithFallback(latitude, longitude) {
  let primary = null;
  try {
    const res = await fetchWithTimeout(`${MARINE_API}?latitude=${latitude}&longitude=${longitude}&current=sea_surface_temperature,wave_height&hourly=sea_surface_temperature,wave_height&forecast_days=7&timezone=auto`, {}, 10000, 'Marine forecast');
    const json = await res.json().catch(() => null);
    primary = buildMarinePayloadFromOpenMeteo(json);
  } catch (_) {}
  primary = sanitizeMarineSource(primary, latitude, longitude);

  const missingWater = !isFiniteNumber(primary?.currentWaterTemp) && !(primary?.hourly || []).some(point => isFiniteNumber(point.waterTemp));
  const missingWave = !isFiniteNumber(primary?.currentWaveHeight) && !(primary?.hourly || []).some(point => isFiniteNumber(point.waveHeight));

  let eccc = null;
  let noaa = null;
  if (missingWater || missingWave) {
    eccc = sanitizeMarineSource(await fetchEcccMarineFallback(latitude, longitude), latitude, longitude);
  }
  const stillMissingWater = missingWater && !hasUsefulMarineSource(eccc);
  const stillMissingWave = missingWave && !hasUsefulMarineSource(eccc);
  if (stillMissingWater || stillMissingWave) {
    noaa = sanitizeMarineSource(await fetchNdbcMarineFallback(latitude, longitude), latitude, longitude);
  }

  return {
    primary,
    eccc,
    noaa,
    sourceLabel: describeMarineSource({ primary, eccc, noaa })
  };
}

function getRouteWeatherExtremes() {
  const ready = routeState?.samples?.filter(cp => cp.weather) || [];
  if (!ready.length) return null;
  const getFeels = cp => firstFinite(cp.weather?.feels, cp.weather?.temp);
  const start = ready[0];
  const finish = ready[ready.length - 1];
  const coldest = ready.reduce((best, cp) => {
    const bestVal = best ? getFeels(best) : Infinity;
    const cpVal = getFeels(cp);
    return cpVal < bestVal ? cp : best;
  }, ready[0]);
  const warmest = ready.reduce((best, cp) => {
    const bestVal = best ? getFeels(best) : -Infinity;
    const cpVal = getFeels(cp);
    return cpVal > bestVal ? cp : best;
  }, ready[0]);
  const wettest = ready.reduce((best, cp) => (firstFinite(cp.weather?.precipProb, 0) > firstFinite(best?.weather?.precipProb, 0) ? cp : best), ready[0]);
  const windiest = ready.reduce((best, cp) => (firstFinite(cp.weather?.wind, 0) > firstFinite(best?.weather?.wind, 0) ? cp : best), ready[0]);
  const startFeels = getFeels(start);
  const finishFeels = getFeels(finish);
  return {
    start,
    finish,
    coldest,
    warmest,
    wettest,
    windiest,
    startFeels,
    finishFeels,
    deltaFeels: (isFiniteNumber(startFeels) && isFiniteNumber(finishFeels)) ? (finishFeels - startFeels) : null,
    maxPrecipProb: firstFinite(wettest?.weather?.precipProb, 0),
    maxWind: firstFinite(windiest?.weather?.wind, 0),
    coldestFeels: getFeels(coldest),
    warmestFeels: getFeels(warmest)
  };
}

function getCampingOvernightSummary(data, startTime, profile) {
  const startDate = String(startTime).slice(0, 10);
  let startIndex = data.daily.findIndex(day => day.date >= startDate);
  if (startIndex < 0) startIndex = 0;
  const nightCount = profile.mode === 'daily' ? Math.max(1, Math.min(4, profile.daysWindow || 1)) : 1;
  const relevantDays = data.daily.slice(startIndex, startIndex + nightCount + 1);
  if (!relevantDays.length) return null;
  const overnightLow = Math.min(...relevantDays.map(day => firstFinite(day.tMin, Infinity)).filter(Number.isFinite));
  const overnightFeels = Math.min(...relevantDays.map(day => firstFinite(day.feelsMin, day.tMin, Infinity)).filter(Number.isFinite));
  const precipChance = Math.max(...relevantDays.map(day => firstFinite(day.precipProbMax, 0)));
  const precipSum = relevantDays.reduce((sum, day) => sum + firstFinite(day.precipSum, 0), 0);
  const windyCamp = (data.hourly || []).filter(point => point.time >= startTime && point.time <= addMinutesToLocalString(startTime, Math.min(profile.minutes || 1440, 18 * 60))).reduce((max, point) => Math.max(max, firstFinite(point.wind, 0)), 0);
  return {
    nightCount,
    overnightLow: Number.isFinite(overnightLow) ? overnightLow : null,
    overnightFeels: Number.isFinite(overnightFeels) ? overnightFeels : null,
    precipChance,
    precipSum,
    windyCamp
  };
}

function getSleepingBagGuidance(overnightFeels) {
  if (!isFiniteNumber(overnightFeels)) return 'Match the bag to the overnight comfort rating, not just the daytime temperature.';
  if (overnightFeels <= -8) return 'Aim for a sleeping bag with a comfort rating around -10°C or lower.';
  if (overnightFeels <= -2) return 'Aim for a sleeping bag with a comfort rating around -5°C.';
  if (overnightFeels <= 4) return 'Aim for a sleeping bag with a comfort rating around 0°C.';
  if (overnightFeels <= 10) return 'Aim for a sleeping bag with a comfort rating around 5°C.';
  return 'A 10°C-ish comfort-rated sleeping bag is usually enough unless the site runs damp or windy.';
}

function getSleepingPadGuidance(overnightFeels) {
  if (!isFiniteNumber(overnightFeels)) return 'Use enough pad insulation for the ground you expect, not just the air temperature.';
  if (overnightFeels <= -8) return 'Use a properly insulated pad setup, roughly R 5+ territory.';
  if (overnightFeels <= -2) return 'A solid insulated pad, roughly R 4+, makes much more sense here.';
  if (overnightFeels <= 4) return 'A pad around R 3 to R 4 is a safer bet for comfort.';
  return 'A lighter insulated pad is usually fine, but ground chill can still surprise you.';
}


async function fetchWeatherCore(place) {
  const { latitude, longitude, name, country_code, admin1, country } = place;
  const weatherUrl = buildOpenMeteoForecastUrl(latitude, longitude);

  const weatherRes = await fetchWithTimeout(weatherUrl, {}, 12000, 'Weather forecast');
  if (!weatherRes.ok) throw new Error(`Weather forecast HTTP ${weatherRes.status}`);
  const [marinePayload, ecccAlertPayload, aqiPayload] = await Promise.all([
    settleOptional(fetchMarineDataWithFallback(latitude, longitude), { primary: null, eccc: null, noaa: null, sourceLabel: 'Marine data unavailable' }, 12000, 'Marine lookup'),
    settleOptional(fetchEcccWeatherAlertsForPoint(latitude, longitude, country_code), { source: 'eccc', status: 'error', alerts: [] }, 8000, 'ECCC alerts'),
    settleOptional(fetchAirQuality(latitude, longitude), null, 8000, 'Air quality lookup')
  ]);

  const weatherJson = await weatherRes.json();
  if (!weatherJson?.current || !weatherJson?.hourly?.time || !weatherJson?.daily?.time) {
    throw new Error('Weather forecast response was incomplete.');
  }
  const c = weatherJson.current;

  const daily = (weatherJson.daily?.time || []).map((time, i) => ({
    date: time,
    tMax: weatherJson.daily.temperature_2m_max?.[i],
    tMin: weatherJson.daily.temperature_2m_min?.[i],
    feelsMax: weatherJson.daily.apparent_temperature_max?.[i],
    feelsMin: weatherJson.daily.apparent_temperature_min?.[i],
    precipSum: weatherJson.daily.precipitation_sum?.[i],
    precipProbMax: weatherJson.daily.precipitation_probability_max?.[i],
    sunrise: weatherJson.daily.sunrise?.[i],
    sunset: weatherJson.daily.sunset?.[i],
    daylightDuration: weatherJson.daily.daylight_duration?.[i],
    code: weatherJson.daily.weather_code?.[i],
    uvMax: weatherJson.daily.uv_index_max?.[i],
    aqiMax: undefined as number | undefined
  }));

  const hourly = (weatherJson.hourly?.time || []).map((time, i) => {
    const marinePoint = getBestMarinePoint(marinePayload, time);
    return {
      time,
      temp: weatherJson.hourly.temperature_2m?.[i],
      feels: weatherJson.hourly.apparent_temperature?.[i],
      precipProb: weatherJson.hourly.precipitation_probability?.[i],
      precip: weatherJson.hourly.precipitation?.[i],
      wind: weatherJson.hourly.wind_speed_10m?.[i],
      gusts: weatherJson.hourly.wind_gusts_10m?.[i],
      windDir: weatherJson.hourly.wind_direction_10m?.[i],
      uv: weatherJson.hourly.uv_index?.[i],
      aqi: matchAqiToHourlyTime(aqiPayload, time),
      code: weatherJson.hourly.weather_code?.[i],
      isDay: weatherJson.hourly.is_day?.[i],
      measuredWaterTemp: isFiniteNumber(marinePoint.waterTemp) ? marinePoint.waterTemp : null,
      measuredWaveHeight: isFiniteNumber(marinePoint.waveHeight) ? marinePoint.waveHeight : null,
      waterTemp: isFiniteNumber(marinePoint.waterTemp) ? marinePoint.waterTemp : null,
      waveHeight: isFiniteNumber(marinePoint.waveHeight) ? marinePoint.waveHeight : null,
      waterTempSource: isFiniteNumber(marinePoint.waterTemp) ? 'measured' : 'unknown',
      waterTempConfidence: isFiniteNumber(marinePoint.waterTemp) ? 'high' : 'unknown'
    };
  });

  for (const day of daily) {
    const dayHourly = hourly.filter(h => h.time.startsWith(day.date));
    const aqiValues = dayHourly.map(h => h.aqi).filter(v => isFiniteNumber(v)) as number[];
    if (aqiValues.length) day.aqiMax = Math.max(...aqiValues);
  }

  const currentMarine = getBestMarinePoint(marinePayload, c.time);
  const currentHourlyPoint = hourly.find(h => h.time >= c.time) || hourly[0] || {};

  const data = {
    locationName: (name === 'Current location' || name === 'Nearby area')
      ? 'Nearby area'
      : `${name}${admin1 ? ', ' + admin1 : ''}${country ? ', ' + country : country_code ? ', ' + country_code.toUpperCase() : ''}`,
    latitude,
    longitude,
    countryCode: country_code ? String(country_code).toUpperCase() : '',
    countryName: country || '',
    ecccAlerts: ecccAlertPayload?.alerts || [],
    ecccAlertStatus: ecccAlertPayload?.status || 'not_canada',
    timezone: weatherJson.timezone,
    currentTime: c.time,
    marineSource: marinePayload?.sourceLabel || 'Marine data unavailable',
    current: {
      time: c.time,
      temp: Math.round(c.temperature_2m),
      feels: Math.round(c.apparent_temperature),
      humidity: c.relative_humidity_2m,
      wind: Math.round(c.wind_speed_10m),
      gusts: Math.round(c.wind_gusts_10m),
      windDir: Math.round(c.wind_direction_10m),
      precip: c.precipitation,
      uv: currentHourlyPoint.uv,
      aqi: currentHourlyPoint.aqi,
      isDay: c.is_day,
      code: c.weather_code,
      measuredWaterTemp: isFiniteNumber(currentMarine.waterTemp) ? round1(currentMarine.waterTemp) : null,
      measuredWaveHeight: isFiniteNumber(currentMarine.waveHeight) ? round1(currentMarine.waveHeight) : null,
      waterTemp: isFiniteNumber(currentMarine.waterTemp) ? round1(currentMarine.waterTemp) : null,
      waveHeight: isFiniteNumber(currentMarine.waveHeight) ? round1(currentMarine.waveHeight) : null,
      waterTempSource: isFiniteNumber(currentMarine.waterTemp) ? 'measured' : 'unknown',
      waterTempConfidence: isFiniteNumber(currentMarine.waterTemp) ? 'high' : 'unknown'
    },
    hourly,
    daily
  };

  applyPseudoWaterEstimateToData(data);
  return data;
}

function getValidLaterRange(data) {
  const profile = getDurationProfile();
  const currentDate = roundUpToHour(parseLocalString(data.currentTime));
  if (!profile) {
    const maxPoint = data.hourly[data.hourly.length - 1];
    const maxDate = maxPoint ? parseLocalString(maxPoint.time) : currentDate;
    return { minDate: currentDate, maxDate: maxDate < currentDate ? currentDate : maxDate };
  }
  if (profile.mode === 'daily') {
    const lastDaily = data.daily[data.daily.length - 1];
    if (!lastDaily) return { minDate: currentDate, maxDate: currentDate };
    const maxDate = parseLocalString(`${lastDaily.date}T23:00`);
    maxDate.setDate(maxDate.getDate() - Math.max(0, (profile.daysWindow || 1) - 1));
    return { minDate: currentDate, maxDate: maxDate < currentDate ? currentDate : maxDate };
  }
  const maxPoint = data.hourly[data.hourly.length - 1];
  const maxDate = maxPoint ? parseLocalString(maxPoint.time) : currentDate;
  maxDate.setMinutes(maxDate.getMinutes() - Math.max(0, profile.minutes || 0));
  return { minDate: currentDate, maxDate: maxDate < currentDate ? currentDate : maxDate };
}

// Compute the valid later-start window so the picker never goes past the forecast range.
function configureLaterInput(data) {
  const { minDate, maxDate } = getValidLaterRange(data);
  laterInput.disabled = false;
  const picker = ensureLaterPicker();
  const currentValue = laterInput.value ? parseLocalString(laterInput.value) : null;
  const currentMs = currentValue ? currentValue.getTime() : NaN;
  const minMs = minDate.getTime();
  const maxMs = maxDate.getTime();
  const safeDate = Number.isFinite(currentMs) && currentMs >= minMs && currentMs <= maxMs ? currentValue : minDate;

  if (picker) {
    picker.set('minDate', minDate);
    picker.set('maxDate', maxDate);
    picker.set('minuteIncrement', getLaterPickerMinuteIncrement());
    picker.setDate(safeDate, false, 'Y-m-d\TH:i');
    if (picker.altInput) picker.altInput.placeholder = 'Pick a start date and time';
  } else {
    laterInput.type = 'datetime-local';
    laterInput.min = formatDateTimeLocal(minDate).slice(0,16);
    laterInput.max = formatDateTimeLocal(maxDate).slice(0,16);
    laterInput.value = formatDateTimeLocal(safeDate).slice(0,16);
  }

  laterStatus.textContent = `Choose a start time from ${formatShortDateTime(formatDateTimeLocal(minDate).slice(0,16))} to ${formatShortDateTime(formatDateTimeLocal(maxDate).slice(0,16))}.`;
  configureBestWindowUi(data);
}

function getSelectedStartTime(data) {
  if (startMode === 'best') {
    const selected = bestWindowSelectedStart || bestWindowAnalysis?.topWindows?.[0]?.representative?.startTime;
    if (selected) return selected;
    return data.currentTime;
  }
  if (startMode !== 'later') return data.currentTime;
  const { minDate, maxDate } = getValidLaterRange(data);
  const chosen = parseLocalString(laterInput.value || '');
  if (!chosen) return formatDateTimeLocal(minDate).slice(0,16);
  if (chosen < minDate) return formatDateTimeLocal(minDate).slice(0,16);
  if (chosen > maxDate) return formatDateTimeLocal(maxDate).slice(0,16);
  return formatDateTimeLocal(chosen).slice(0,16);
}

function getHourlyPointForStart(data, startTime) {
  if (!data.hourly.length) return data.current;
  if (startTime === data.currentTime) return data.current;
  const point = getInterpolatedHourlyPoint(data, startTime);
  return { ...point, humidity: data.current.humidity };
}

function interpolateNumber(a, b, ratio, key, fallback = 0) {
  const av = isFiniteNumber(a?.[key]) ? a[key] : (isFiniteNumber(b?.[key]) ? b[key] : fallback);
  const bv = isFiniteNumber(b?.[key]) ? b[key] : av;
  return av + ((bv - av) * ratio);
}

// Interpolate hourly forecast values for fine-grained short-event slices.
function getInterpolatedHourlyPoint(data, timeStr) {
  if (!data.hourly.length) return { ...data.current, time: timeStr };
  const targetMs = parseAnyTime(timeStr);
  let afterIndex = data.hourly.findIndex(h => parseAnyTime(h.time) >= targetMs);
  if (afterIndex <= 0) {
    const point = data.hourly[Math.max(0, afterIndex)] || data.hourly[0];
    return { ...point, time: timeStr };
  }
  if (afterIndex < 0) {
    const point = data.hourly[data.hourly.length - 1];
    return { ...point, time: timeStr };
  }
  const before = data.hourly[afterIndex - 1];
  const after = data.hourly[afterIndex];
  const beforeMs = parseAnyTime(before.time);
  const afterMs = parseAnyTime(after.time);
  const span = Math.max(1, afterMs - beforeMs);
  const ratio = Math.max(0, Math.min(1, (targetMs - beforeMs) / span));
  return {
    time: timeStr,
    temp: interpolateNumber(before, after, ratio, 'temp'),
    feels: interpolateNumber(before, after, ratio, 'feels'),
    precipProb: interpolateNumber(before, after, ratio, 'precipProb'),
    precip: interpolateNumber(before, after, ratio, 'precip'),
    wind: interpolateNumber(before, after, ratio, 'wind'),
    gusts: interpolateNumber(before, after, ratio, 'gusts'),
    uv: interpolateNumber(before, after, ratio, 'uv', null),
    aqi: interpolateNumber(before, after, ratio, 'aqi', null),
    windDir: ratio < 0.5 ? before.windDir : after.windDir,
    code: ratio < 0.5 ? before.code : after.code,
    isDay: ratio < 0.5 ? before.isDay : after.isDay
  };
}

function getFineForecastStepMinutes(totalMinutes) {
  if (totalMinutes <= 240) return 10;
  if (totalMinutes >= 360 && totalMinutes < 600) return 30;
  return null;
}

/**
 * Build the forecast slice for the chosen start time and duration.
 * Short events can use interpolated 5/10/15-minute slices; long ones stay hourly/daily.
 */
function getForecastSelection(data, startTime) {
  const profile = getDurationProfile() || durationProfiles.h2;
  if (profile.mode === 'daily') {
    const startDate = String(startTime).slice(0,10);
    let startIndex = data.daily.findIndex(d => d.date >= startDate);
    if (startIndex < 0) startIndex = 0;
    const points = data.daily.slice(startIndex, startIndex + (profile.daysWindow || 1));
    return { mode: 'daily', points, startTime, endTime: points[points.length - 1]?.date || startDate };
  }
  const endTime = addMinutesToLocalString(startTime, profile.minutes);
  const fineStep = getFineForecastStepMinutes(profile.minutes);
  if (fineStep) {
    const finePoints = [];
    for (let offset = 0; offset <= profile.minutes; offset += fineStep) {
      finePoints.push(getInterpolatedHourlyPoint(data, addMinutesToLocalString(startTime, offset)));
    }
    if (finePoints[finePoints.length - 1]?.time !== endTime) finePoints.push(getInterpolatedHourlyPoint(data, endTime));
    return { mode: 'hourly', points: finePoints, startTime, endTime, sliceMinutes: fineStep, interpolated: true };
  }
  const filtered = data.hourly.filter(h => h.time >= startTime && h.time <= endTime);
  const desiredCount = Math.max(3, Math.min((profile.hoursWindow || 4) + 1, filtered.length || (profile.hoursWindow || 4) + 1));
  let points = filtered.slice(0, desiredCount);
  if (!points.length) points = data.hourly.slice(0, desiredCount);
  return { mode: 'hourly', points, startTime, endTime, sliceMinutes: 60, interpolated: false };
}


function formatDateOnlyLocal(date) {
  const p = n => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}

function formatTimeOnlyLocal(date) {
  const p = n => String(n).padStart(2, '0');
  return `${p(date.getHours())}:${p(date.getMinutes())}`;
}

function combineLocalDateAndTime(dateStr, timeStr) {
  const safeTime = String(timeStr || '00:00').slice(0, 5);
  return `${dateStr}T${safeTime}`;
}

function roundUpDateToStep(date, stepMinutes) {
  const d = new Date(date.getTime());
  d.setSeconds(0, 0);
  const mins = d.getHours() * 60 + d.getMinutes();
  const rounded = Math.ceil(mins / stepMinutes) * stepMinutes;
  d.setHours(0, 0, 0, 0);
  d.setMinutes(rounded);
  return d;
}

function getBestWindowAutoStepMinutes(totalMinutes) {
  const mins = firstFinite(totalMinutes, 0);
  return mins > 360 ? 30 : 15;
}

function getBestWindowActivityName(activity) {
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
    casual: 'casual use'
  })[activity] || 'this activity';
}

function getBestWindowPresetLabel(priority) {
  return getBestWindowPresetLabelFromModule(priority);
}

function getBestWindowPrioritySummary(priority, activity) {
  return getBestWindowPrioritySummaryFromModule(priority, activity);
}

function getBestWindowDayRange(data, dateStr) {
  if (!data || !dateStr) return null;
  const { minDate, maxDate } = getValidLaterRange(data);
  const dayStart = parseLocalString(`${dateStr}T00:00`);
  const dayEnd = parseLocalString(`${dateStr}T23:59`);
  if (!dayStart || !dayEnd) return null;
  const start = dayStart < minDate ? minDate : dayStart;
  const end = dayEnd > maxDate ? maxDate : dayEnd;
  if (end < start) return null;
  return { start, end };
}

function getBestWindowDurationMinutes() {
  const durationState = getDurationState(getSelectedEvent());
  return firstFinite(durationState?.minutes, null);
}

function getBestWindowStepMinutes() {
  const manual = bestWindowStepSelect?.value || 'auto';
  if (manual === '15') return 15;
  if (manual === '30') return 30;
  return getBestWindowAutoStepMinutes(getBestWindowDurationMinutes());
}

function getBestWindowSearchRange(data) {
  if (!data) return null;
  const { minDate, maxDate } = getValidLaterRange(data);
  const stepMinutes = getBestWindowStepMinutes();
  let early = parseLocalString(bestWindowStartInput?.value || '');
  let late = parseLocalString(bestWindowEndInput?.value || '');
  if (!early || early < minDate) early = new Date(minDate.getTime());
  if (!late || late > maxDate) late = new Date(maxDate.getTime());
  if (late <= early) {
    late = new Date(Math.min(maxDate.getTime(), early.getTime() + Math.max(30, stepMinutes) * 60000));
  }
  if (late <= early) return null;
  return {
    date: formatDateOnlyLocal(early),
    start: formatDateTimeLocal(early).slice(0, 16),
    end: formatDateTimeLocal(late).slice(0, 16),
    startDate: early,
    endDate: late
  };
}

function getBestWindowConstraintValues() {
  const maxPrecipProb = parsePositiveOrNegativeNumber(bestWindowMaxPrecipInput?.value);
  const maxGust = parsePositiveOrNegativeNumber(bestWindowMaxGustInput?.value);
  const minTemp = parsePositiveOrNegativeNumber(bestWindowMinTempInput?.value);
  const maxTemp = parsePositiveOrNegativeNumber(bestWindowMaxTempInput?.value);
  const minWaterTemp = parsePositiveOrNegativeNumber(bestWindowMinWaterInput?.value);
  const finishBeforeSunset = !!bestWindowFinishDaylightInput?.checked;
  return { maxPrecipProb, maxGust, minTemp, maxTemp, minWaterTemp, finishBeforeSunset };
}

function getBestWindowConfigKey(data) {
  const range = getBestWindowSearchRange(data);
  const durationMinutes = getBestWindowDurationMinutes();
  const override = getCustomWeatherOverride();
  return JSON.stringify({
    loc: data?.locationName || '',
    date: range?.date || '',
    start: range?.start || '',
    end: range?.end || '',
    activity: selectedActivity || '',
    durationMinutes,
    priority: bestWindowPrioritySelect?.value || 'best_overall',
    step: bestWindowStepSelect?.value || 'auto',
    constraints: getBestWindowConstraintValues(),
    routeFile: routeState?.fileName || '',
    routeKm: routeState?.totalKm || '',
    checkpointModel,
    manualWater: override?.waterTemp || null,
    waterModel: getWaterModelSettings()
  });
}

function getBestWindowComfortBand(activity) {
  return getBestWindowComfortBandFromModule(activity);
}

function getBestWindowWeights(priority, activity) {
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
    uv: 5
  };
  if (activity === 'cycling') {
    base.gust += 3;
    base.routeHeadwind += 6;
    base.routeCrosswind += 5;
    base.comfort -= 2;
  } else if (activity === 'running') {
    base.comfort += 2;
    base.precipProb += 2;
  } else if (isWaterExposureActivity(activity)) {
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

function sum(values) {
  return values.reduce((acc, value) => acc + firstFinite(value, 0), 0);
}

function getTimeDomainSummary(points) {
  const feels = points.map(p => firstFinite(p?.feels, p?.temp)).filter(isFiniteNumber);
  const temps = points.map(p => firstFinite(p?.temp, p?.feels)).filter(isFiniteNumber);
  const winds = points.map(p => firstFinite(p?.wind, 0)).filter(isFiniteNumber);
  const gusts = points.map(p => firstFinite(p?.gusts, p?.wind, 0)).filter(isFiniteNumber);
  const probs = points.map(p => firstFinite(p?.precipProb, 0)).filter(isFiniteNumber);
  const precips = points.map(p => firstFinite(p?.precip, 0)).filter(isFiniteNumber);
  const uvs = points.map(p => firstFinite(p?.uv, null)).filter(isFiniteNumber);
  return {
    meanFeels: feels.length ? sum(feels) / feels.length : null,
    minFeels: feels.length ? Math.min(...feels) : null,
    maxFeels: feels.length ? Math.max(...feels) : null,
    meanTemp: temps.length ? sum(temps) / temps.length : null,
    maxWind: winds.length ? Math.max(...winds) : null,
    meanWind: winds.length ? sum(winds) / winds.length : null,
    maxGust: gusts.length ? Math.max(...gusts) : null,
    maxPrecipProb: probs.length ? Math.max(...probs) : null,
    maxPrecip: precips.length ? Math.max(...precips) : null,
    totalPrecip: precips.length ? sum(precips) : null,
    maxUv: uvs.length ? Math.max(...uvs) : null,
    meanUv: uvs.length ? sum(uvs) / uvs.length : null,
    hasStorm: points.some(p => [95, 96, 99].includes(firstFinite(p?.code, -1))),
    daylightRatio: points.length ? points.filter(p => !!p?.isDay).length / points.length : 1
  };
}

function getWindComponents(travelBearing, windDir, windSpeed) {
  if (!isFiniteNumber(travelBearing) || !isFiniteNumber(windDir) || !isFiniteNumber(windSpeed)) return { headwind: 0, crosswind: 0, tailwind: 0 };
  const diff = Math.abs((((windDir - travelBearing) % 360) + 540) % 360 - 180);
  const rad = diff * Math.PI / 180;
  const headwind = Math.max(0, Math.cos(rad) * windSpeed);
  const tailwind = Math.max(0, -Math.cos(rad) * windSpeed);
  const crosswind = Math.abs(Math.sin(rad)) * windSpeed;
  return { headwind, crosswind, tailwind };
}

function evaluateBestWindowBaseCandidate(data, startTime, options) {
  const selection = getForecastSelection(data, startTime);
  const basePoint = getInterpolatedHourlyPoint(data, startTime);
  const point = applyCustomWeatherOverrides(basePoint, data);
  const summary = summarizePlannedConditions(selection, point);
  const light = describeLight(data, startTime, selection);
  const domain = getTimeDomainSummary(selection.points || []);
  const weather = {
    startTime,
    endTime: selection.endTime,
    selection,
    point,
    summary,
    light,
    domain,
    day: getDayRecord(data, startTime)
  };
  const scored = scoreBestWindowCandidate(weather, null, options);
  return { ...weather, ...scored };
}

function getCandidateRouteTimingModel(totalMinutes, activityKey) {
  if (!routeState?.points?.length || !isFiniteNumber(totalMinutes) || totalMinutes <= 0) return null;
  const cacheKey = `${activityKey || selectedActivity || 'casual'}:${Math.round(totalMinutes)}`;
  if (routeState.timingCache?.[cacheKey]) return routeState.timingCache[cacheKey];
  const previousActivity = selectedActivity;
  try {
    selectedActivity = activityKey || previousActivity;
    return buildRouteTimingModel(totalMinutes);
  } finally {
    selectedActivity = previousActivity;
  }
}

function getSmartCheckpointConfigFor(data, startTime, totalMinutes) {
  const baseInterval = totalMinutes <= 120 ? 30
    : totalMinutes <= 240 ? 45
    : totalMinutes <= 480 ? 60
    : totalMinutes <= 900 ? 75
    : totalMinutes <= 1440 ? 90
    : 180;
  let gapKm = selectedActivity === 'running' ? 8
    : (selectedActivity === 'road_trip' ? 70
    : (selectedActivity === 'camping' || selectedActivity === 'walk' || selectedActivity === 'casual') ? 16
    : isWaterDistanceActivity(selectedActivity) ? 10
    : (selectedActivity === 'triathlon' ? 22 : 28));
  if (totalMinutes >= 720) gapKm *= 1.15;
  if (totalMinutes >= 1440) gapKm *= 1.2;
  const volatility = Math.min(4, getTerrainVolatilityScore() + getWeatherVolatilityScore(data, startTime) + (totalMinutes >= 360 ? 1 : 0));
  let intervalMinutes = baseInterval - (volatility >= 1 ? 15 : 0) - (volatility >= 3 ? 15 : 0);
  intervalMinutes = Math.max(20, intervalMinutes);
  gapKm = clamp(gapKm * (volatility >= 2 ? 0.85 : 1), 5, 120);
  const targetMax = totalMinutes <= 180 ? 6
    : totalMinutes <= 360 ? 8
    : totalMinutes <= 720 ? 10
    : totalMinutes <= 1440 ? 12
    : 14;
  return { intervalMinutes, gapKm, volatility, targetMax };
}

function getSolarCheckpointEventsForData(data, startTime, totalMinutes) {
  if (!data?.daily?.length || !startTime || !isFiniteNumber(totalMinutes)) return [];
  const startMs = parseAnyTime(startTime);
  const endMs = startMs + (totalMinutes * 60000);
  const events = [];
  data.daily.forEach(day => {
    [['sunrise', 'Sunrise'], ['sunset', 'Sunset']].forEach(([key, label]) => {
      if (!day?.[key]) return;
      const ms = parseAnyTime(day[key]);
      if (!Number.isFinite(ms) || ms < startMs || ms > endMs) return;
      events.push({ kind: key, label, minuteFromStart: (ms - startMs) / 60000 });
    });
  });
  return events;
}

function buildCheckpointFromIndexForStart(pointIndex, reason, model, totalMinutes, startTime) {
  const p = routeState.points[pointIndex];
  const minuteFromStart = model?.cumulativeMinutes?.[pointIndex] ?? (routeState.totalKm > 0 ? (p.kmFromStart / routeState.totalKm) * totalMinutes : 0);
  return {
    id: `cp-best-${pointIndex}-${reason.kind}`,
    pointIndex,
    lat: p.lat,
    lon: p.lon,
    kmFromStart: p.kmFromStart,
    fraction: routeState.totalKm > 0 ? p.kmFromStart / routeState.totalKm : 0,
    minuteFromStart,
    eta: startTime ? addMinutesToLocalString(startTime, Math.round(minuteFromStart)) : null,
    reasons: [reason.kind],
    reasonLabels: [reason.label],
    bearing: getRouteBearingAtIndex(routeState.points, pointIndex),
    label: reason.label,
    markerShort: null,
    markerKind: 'mid'
  };
}

function applyCheckpointLabelsForModel(samples, modelName) {
  const sorted = [...samples].sort((a, b) => a.minuteFromStart - b.minuteFromStart);
  let genericIndex = 1;
  sorted.forEach(cp => {
    if (cp.reasons.includes('start')) {
      cp.label = 'Start';
      cp.markerShort = 'S';
      cp.markerKind = 'start';
    } else if (cp.reasons.includes('finish')) {
      cp.label = 'Finish';
      cp.markerShort = 'F';
      cp.markerKind = 'finish';
    } else if (modelName === 'smart' && cp.reasons.includes('sunrise')) {
      cp.label = 'Sunrise';
      cp.markerShort = '↑';
      cp.markerKind = 'event';
    } else if (modelName === 'smart' && cp.reasons.includes('sunset')) {
      cp.label = 'Sunset';
      cp.markerShort = '↓';
      cp.markerKind = 'event';
    } else {
      cp.label = modelName === 'smart' ? `Forecast checkpoint ${genericIndex}` : `Weather checkpoint ${genericIndex}`;
      cp.markerShort = `${genericIndex}`;
      cp.markerKind = 'mid';
      genericIndex++;
    }
  });
  return sorted;
}

function markSmartWeatherEventCheckpointsForModel(samples, modelName) {
  applyCheckpointLabelsForModel(samples, modelName);
  if (modelName !== 'smart') return samples;
  const mids = samples.filter(cp => !cp.reasons.includes('start') && !cp.reasons.includes('finish') && cp.weather);
  if (!mids.length) return samples;
  const coldest = [...mids].sort((a, b) => firstFinite(a.windowWeather?.feelsMin, a.weather?.feels, 999) - firstFinite(b.windowWeather?.feelsMin, b.weather?.feels, 999))[0];
  const windiest = [...mids].sort((a, b) => firstFinite(b.windowWeather?.maxWind, b.weather?.wind, 0) - firstFinite(a.windowWeather?.maxWind, a.weather?.wind, 0))[0];
  const wettest = [...mids].sort((a, b) => {
    const av = Math.max(firstFinite(a.windowWeather?.maxPrecipProb, a.weather?.precipProb, 0), firstFinite(a.windowWeather?.maxPrecip, a.weather?.precip, 0) * 100);
    const bv = Math.max(firstFinite(b.windowWeather?.maxPrecipProb, b.weather?.precipProb, 0), firstFinite(b.windowWeather?.maxPrecip, b.weather?.precip, 0) * 100);
    return bv - av;
  })[0];
  const uvPeak = [...mids].sort((a, b) => firstFinite(b.windowWeather?.maxUv, b.weather?.uv, 0) - firstFinite(a.windowWeather?.maxUv, a.weather?.uv, 0))[0];
  if (coldest && firstFinite(coldest.windowWeather?.feelsMin, coldest.weather?.feels, 99) <= 6 && !coldest.reasons.includes('coldest')) coldest.reasons.push('coldest');
  if (windiest && firstFinite(windiest.windowWeather?.maxWind, windiest.weather?.wind, 0) >= 25 && !windiest.reasons.includes('peakwind')) windiest.reasons.push('peakwind');
  if (wettest && (firstFinite(wettest.windowWeather?.maxPrecipProb, wettest.weather?.precipProb, 0) >= 45 || firstFinite(wettest.windowWeather?.maxPrecip, wettest.weather?.precip, 0) >= 0.3) && !wettest.reasons.includes('wettest')) wettest.reasons.push('wettest');
  if (uvPeak && isOutdoorUvRelevantActivity(selectedActivity) && firstFinite(uvPeak.windowWeather?.maxUv, uvPeak.weather?.uv, 0) >= 6 && !uvPeak.reasons.includes('uvpeak')) uvPeak.reasons.push('uvpeak');
  let genericIndex = 1;
  [...samples].sort((a, b) => a.minuteFromStart - b.minuteFromStart).forEach(cp => {
    if (cp.reasons.includes('start')) {
      cp.label = 'Start';
      cp.markerShort = 'S';
      cp.markerKind = 'start';
    } else if (cp.reasons.includes('finish')) {
      cp.label = 'Finish';
      cp.markerShort = 'F';
      cp.markerKind = 'finish';
    } else if (cp.reasons.includes('sunrise')) {
      cp.label = 'Sunrise';
      cp.markerShort = '↑';
      cp.markerKind = 'event';
    } else if (cp.reasons.includes('sunset')) {
      cp.label = 'Sunset';
      cp.markerShort = '↓';
      cp.markerKind = 'event';
    } else if (cp.reasons.includes('wettest')) {
      cp.label = 'Rain risk';
      cp.markerShort = '☔';
      cp.markerKind = 'event';
    } else if (cp.reasons.includes('uvpeak')) {
      cp.label = 'Peak UV';
      cp.markerShort = '☀';
      cp.markerKind = 'event';
    } else if (cp.reasons.includes('peakwind')) {
      cp.label = 'Peak wind';
      cp.markerShort = '↯';
      cp.markerKind = 'event';
    } else if (cp.reasons.includes('coldest')) {
      cp.label = 'Coldest';
      cp.markerShort = '❄';
      cp.markerKind = 'event';
    } else {
      cp.label = `Forecast checkpoint ${genericIndex}`;
      cp.markerShort = `${genericIndex}`;
      cp.markerKind = 'mid';
      genericIndex++;
    }
  });
  return samples;
}

function getRouteSamplesForStart(data, startTime, totalMinutes, modelName = checkpointModel) {
  if (!routeState?.points?.length || !isFiniteNumber(totalMinutes) || totalMinutes <= 0) return [];
  const samples = [];
  if (modelName === 'old') {
    const count = Math.max(2, getRouteSampleCount());
    for (let i = 0; i < count; i++) {
      const fraction = count === 1 ? 0 : i / (count - 1);
      const targetKm = routeState.totalKm * fraction;
      const pointIndex = findNearestPointIndexByKm(targetKm);
      const p = routeState.points[pointIndex];
      samples.push({
        id: `cp-old-best-${pointIndex}`,
        pointIndex,
        lat: p.lat,
        lon: p.lon,
        bearing: getRouteBearingAtIndex(routeState.points, pointIndex),
        fraction,
        kmFromStart: p.kmFromStart,
        minuteFromStart: totalMinutes * fraction,
        eta: addMinutesToLocalString(startTime, Math.round(totalMinutes * fraction)),
        reasons: [i === 0 ? 'start' : (i === count - 1 ? 'finish' : 'progress')],
        reasonLabels: [i === 0 ? 'Start' : (i === count - 1 ? 'Finish' : 'Progress')]
      });
    }
    return applyCheckpointLabelsForModel(samples, modelName);
  }

  const model = getCandidateRouteTimingModel(totalMinutes, selectedActivity);
  const config = getSmartCheckpointConfigFor(data, startTime, totalMinutes);
  mergeCheckpointCandidate(samples, buildCheckpointFromIndexForStart(0, { kind: 'start', label: 'Start' }, model, totalMinutes, startTime));
  mergeCheckpointCandidate(samples, buildCheckpointFromIndexForStart(routeState.points.length - 1, { kind: 'finish', label: 'Finish' }, model, totalMinutes, startTime));
  for (let minute = config.intervalMinutes; minute < totalMinutes; minute += config.intervalMinutes) {
    const pointIndex = findNearestPointIndexByMinute(model, minute);
    mergeCheckpointCandidate(samples, buildCheckpointFromIndexForStart(pointIndex, { kind: 'time', label: 'Time slice' }, model, totalMinutes, startTime));
  }
  for (let km = config.gapKm; km < routeState.totalKm; km += config.gapKm) {
    const pointIndex = findNearestPointIndexByKm(km);
    mergeCheckpointCandidate(samples, buildCheckpointFromIndexForStart(pointIndex, { kind: 'distance', label: 'Max distance gap' }, model, totalMinutes, startTime));
  }
  getSolarCheckpointEventsForData(data, startTime, totalMinutes).forEach(event => {
    const pointIndex = findNearestPointIndexByMinute(model, event.minuteFromStart);
    mergeCheckpointCandidate(samples, buildCheckpointFromIndexForStart(pointIndex, { kind: event.kind, label: event.label }, model, totalMinutes, startTime));
  });
  return applyCheckpointLabelsForModel(pruneCheckpointCandidates(samples, config.targetMax), modelName);
}

async function refineBestWindowCandidateWithRoute(data, candidate, options) {
  const totalMinutes = options.durationMinutes;
  const samples = getRouteSamplesForStart(data, candidate.startTime, totalMinutes, checkpointModel);
  await Promise.all(samples.map(async cp => {
    const cache = await fetchRouteCheckpointForecast(cp);
    cp.placeLabel = cache.label || 'Nearby area';
    cp.weather = cp.eta ? getInterpolatedForecastPointFromHourly(cache.hourly, cp.eta) : null;
    cp.windowWeather = cp.eta ? summarizeCheckpointWeatherWindow(cache.hourly, cp.eta, checkpointModel === 'smart' ? 15 : 10) : null;
    cp.relativeWind = cp.weather ? describeRelativeWind(cp.bearing, cp.weather.windDir, cp.weather.wind) : null;
  }));
  markSmartWeatherEventCheckpointsForModel(samples, checkpointModel);
  const routeMetrics = summarizeRouteCandidateSamples(samples);
  const scored = scoreBestWindowCandidate(candidate, routeMetrics, options);
  return { ...candidate, routeSamples: samples, routeMetrics, ...scored };
}

function summarizeRouteCandidateSamples(samples) {
  const ready = (samples || []).filter(cp => cp.weather);
  if (!ready.length) return null;
  const feels = ready.flatMap(cp => [firstFinite(cp.windowWeather?.feelsMin, cp.weather?.feels), firstFinite(cp.windowWeather?.feelsMax, cp.weather?.feels)]).filter(isFiniteNumber);
  const winds = ready.map(cp => firstFinite(cp.windowWeather?.maxWind, cp.weather?.wind)).filter(isFiniteNumber);
  const gusts = ready.map(cp => firstFinite(cp.windowWeather?.maxGust, cp.weather?.gusts, cp.weather?.wind)).filter(isFiniteNumber);
  const probs = ready.map(cp => firstFinite(cp.windowWeather?.maxPrecipProb, cp.weather?.precipProb)).filter(isFiniteNumber);
  const precips = ready.map(cp => firstFinite(cp.windowWeather?.maxPrecip, cp.weather?.precip)).filter(isFiniteNumber);
  const uvs = ready.map(cp => firstFinite(cp.windowWeather?.maxUv, cp.weather?.uv)).filter(isFiniteNumber);
  const components = ready.map(cp => getWindComponents(cp.bearing, cp.weather?.windDir, cp.weather?.wind));
  const headwind = components.length ? sum(components.map(c => c.headwind)) / components.length : 0;
  const crosswind = components.length ? sum(components.map(c => c.crosswind)) / components.length : 0;
  const tailwind = components.length ? sum(components.map(c => c.tailwind)) / components.length : 0;
  return {
    minFeels: feels.length ? Math.min(...feels) : null,
    maxFeels: feels.length ? Math.max(...feels) : null,
    maxWind: winds.length ? Math.max(...winds) : null,
    maxGust: gusts.length ? Math.max(...gusts) : null,
    maxPrecipProb: probs.length ? Math.max(...probs) : null,
    maxPrecip: precips.length ? Math.max(...precips) : null,
    maxUv: uvs.length ? Math.max(...uvs) : null,
    avgHeadwind: headwind,
    avgCrosswind: crosswind,
    avgTailwind: tailwind,
    hasEventCheckpoint: ready.some(cp => cp.markerKind === 'event')
  };
}

function scoreBestWindowCandidate(candidate, routeMetrics, options) {
  const priority = options.priority;
  const activity = options.activity;
  const weights = getBestWindowWeights(priority, activity);
  const band = getBestWindowComfortBand(activity);
  const domain = candidate.domain || {};
  const point = candidate.point || {};
  const light = candidate.light || {};
  const route = routeMetrics || candidate.routeMetrics || null;
  let score = 100;

  score -= weights.precipProb * clamp((firstFinite(route?.maxPrecipProb, domain.maxPrecipProb, 0) - 10) / 60, 0, 1.2);
  score -= weights.precipMm * clamp((firstFinite(route?.maxPrecip, domain.maxPrecip, 0) - 0.05) / 1.75, 0, 1.2);
  score -= weights.gust * clamp((firstFinite(route?.maxGust, domain.maxGust, 0) - 18) / 32, 0, 1.2);
  score -= weights.wind * clamp((firstFinite(route?.maxWind, domain.maxWind, 0) - 10) / 25, 0, 1.2);
  if (firstFinite(route?.avgHeadwind, 0) > 0) score -= weights.routeHeadwind * clamp(firstFinite(route?.avgHeadwind, 0) / 22, 0, 1.3);
  if (firstFinite(route?.avgCrosswind, 0) > 0) score -= weights.routeCrosswind * clamp(firstFinite(route?.avgCrosswind, 0) / 26, 0, 1.2);
  if (firstFinite(route?.avgTailwind, 0) > 0) score += weights.tailwindBonus * clamp(firstFinite(route?.avgTailwind, 0) / 18, 0, 1);

  const meanFeels = firstFinite(domain.meanFeels, point.feels, point.temp);
  const minFeels = firstFinite(route?.minFeels, domain.minFeels, meanFeels);
  const maxFeels = firstFinite(route?.maxFeels, domain.maxFeels, meanFeels);
  if (isFiniteNumber(meanFeels)) {
    if (meanFeels < band.low) score -= weights.comfort * clamp((band.low - meanFeels) / 12, 0, 1.25);
    if (meanFeels > band.high) score -= weights.comfort * clamp((meanFeels - band.high) / 12, 0, 1.25);
  }
  if (isFiniteNumber(minFeels) && minFeels < band.low - 2) score -= weights.comfort * 0.35 * clamp((band.low - minFeels) / 10, 0, 1);
  if (isFiniteNumber(maxFeels) && maxFeels > band.high + 2) score -= weights.comfort * 0.3 * clamp((maxFeels - band.high) / 10, 0, 1);

  const maxUv = firstFinite(route?.maxUv, domain.maxUv, point.uv, 0);
  if (maxUv >= 6 && isOutdoorUvRelevantActivity(activity)) score -= weights.uv * clamp((maxUv - 5) / 6, 0, 1.25);

  if (domain.hasStorm) score -= weights.storm;
  if (/mostly dark|starts after sunset|starts before sunrise/i.test(light.label || '')) score -= weights.daylight * 0.95;
  else if (/crosses sunset|crosses sunrise/i.test(light.label || '')) score -= weights.daylight * 0.45;

  if (priority === 'warmest' && isFiniteNumber(meanFeels)) score += clamp((meanFeels - band.low) / 8, 0, 1.4) * 12;
  if (priority === 'driest') score += clamp((25 - firstFinite(route?.maxPrecipProb, domain.maxPrecipProb, 25)) / 25, 0, 1.2) * 10;
  if (priority === 'calmest') score += clamp((24 - firstFinite(route?.maxGust, domain.maxGust, 24)) / 18, 0, 1.2) * 10;

  const waterTemp = firstFinite(point.waterTemp, null);
  if (isWaterExposureActivity(activity) && isFiniteNumber(waterTemp)) {
    if (waterTemp < 16) score -= weights.water * clamp((16 - waterTemp) / 8, 0, 1.2);
    else score += clamp((waterTemp - 16) / 8, 0, 1) * 6;
  }

  const constraints = options.constraints || {};
  let valid = true;
  if (isFiniteNumber(constraints.maxPrecipProb) && firstFinite(route?.maxPrecipProb, domain.maxPrecipProb, 0) > constraints.maxPrecipProb) valid = false;
  if (isFiniteNumber(constraints.maxGust) && firstFinite(route?.maxGust, domain.maxGust, 0) > constraints.maxGust) valid = false;
  if (isFiniteNumber(constraints.minTemp) && firstFinite(route?.minFeels, domain.minFeels, meanFeels) < constraints.minTemp) valid = false;
  if (isFiniteNumber(constraints.maxTemp) && firstFinite(route?.maxFeels, domain.maxFeels, meanFeels) > constraints.maxTemp) valid = false;
  if (isWaterExposureActivity(activity) && isFiniteNumber(constraints.minWaterTemp) && isFiniteNumber(waterTemp) && waterTemp < constraints.minWaterTemp) valid = false;
  if (constraints.finishBeforeSunset && /(mostly dark|crosses sunset|starts after sunset)/i.test(light.label || '')) valid = false;

  return {
    score: Math.max(0, Math.min(100, round1(score))),
    valid
  };
}

function buildBestWindowReasons(candidate, options) {
  return buildBestWindowReasonsFromModule(candidate, options);
}

function getBestWindowCondenseMinutes(stepMinutes, durationMinutes) {
  return getBestWindowCondenseMinutesFromModule(stepMinutes, durationMinutes);
}

function rankBestWindowCluster(cluster, index) {
  return rankBestWindowClusterFromModule(cluster, index);
}

function clusterBestWindowCandidates(candidates, stepMinutes, maxWindows = 6, minWindows = 3, durationMinutes = getBestWindowDurationMinutes()) {
  return clusterBestWindowCandidatesFromModule(candidates, stepMinutes, maxWindows, minWindows, durationMinutes, parseAnyTime);
}

function getBestWindowRankClass(index) {
  return getBestWindowRankClassFromModule(index);
}

function getBestWindowRankEmoji(index) {
  return getBestWindowRankEmojiFromModule(index);
}

function getBestWindowRankLabel(index, priority) {
  return getBestWindowRankLabelFromModule(index, priority);
}

function getBestWindowClusterStartRangeInfo(cluster, maxSpanMinutes = 30) {
  return getBestWindowClusterStartRangeInfoFromModule(cluster, maxSpanMinutes);
}

function getBestWindowActivityRange(startTime, durationMinutes) {
  return getBestWindowActivityRangeFromModule(startTime, durationMinutes);
}

function bestWindowRangeOverrunMinutes(activityRange, analysis) {
  return bestWindowRangeOverrunMinutesFromModule(activityRange, analysis);
}

function formatBestWindowOverrunWarning(minutes) {
  return formatBestWindowOverrunWarningFromModule(minutes);
}

function makeBestWindowClusterFromCandidate(candidate, index) {
  return makeBestWindowClusterFromCandidateFromModule(candidate, index);
}

function addMinimumBestWindowFallbacks(selected, validCandidates, minWindows, maxWindows, stepMinutes, condenseMinutes, durationMinutes) {
  return addMinimumBestWindowFallbacksFromModule(selected, validCandidates, minWindows, maxWindows, stepMinutes, condenseMinutes, durationMinutes, parseAnyTime);
}

function getBestWindowTimelineDayBoundaryTicks(startMs, endMs) {
  return getBestWindowTimelineDayBoundaryTicksFromModule(startMs, endMs);
}
function getBestWindowTimelineHtml(analysis) {
  return getBestWindowTimelineHtmlFromModule(analysis, bestWindowSelectedStart);
}

function renderBestWindowResults(analysis) {
  renderBestWindowResultsFromModule(analysis, bestWindowResults, bestWindowSelectedStart);
}

function setBestWindowPanelEnabled(enabled) {
  [
    bestWindowStartInput,
    bestWindowEndInput,
    bestWindowPrioritySelect,
    bestWindowStepSelect,
    bestWindowMaxPrecipInput,
    bestWindowMaxGustInput,
    bestWindowMinTempInput,
    bestWindowMaxTempInput,
    bestWindowMinWaterInput,
    bestWindowFinishDaylightInput
  ].forEach(el => {
    if (!el) return;
    el.disabled = !enabled;
  });
  setFlatpickrDisabledState(bestWindowStartPicker, !enabled);
  setFlatpickrDisabledState(bestWindowEndPicker, !enabled);
}

function configureBestWindowUi(data) {
  if (!bestWindowBox) return;
  const durationMinutes = getBestWindowDurationMinutes();
  const range = getValidLaterRange(data);
  const enabled = !!(data && isFiniteNumber(durationMinutes) && durationMinutes > 0);
  setBestWindowPanelEnabled(enabled);
  if (!enabled) {
    bestWindowStatus.textContent = data
      ? 'Choose a planned duration or custom duration first to search for a best weather window.'
      : 'Fetch a location and choose a duration to search for a best weather window.';
    bestWindowResults.innerHTML = '';
    bestWindowAnalysis = null;
    bestWindowAnalysisKey = '';
    return;
  }

  const autoStep = getBestWindowAutoStepMinutes(durationMinutes);
  const { start: startPicker, end: endPicker } = ensureBestWindowPickers();
  const minDate = range.minDate;
  const maxDate = range.maxDate;

  let seedStart = laterInput?.value ? parseLocalString(laterInput.value) : parseLocalString(String(data.currentTime).slice(0, 16));
  if (!seedStart || seedStart < minDate || seedStart > maxDate) seedStart = new Date(minDate.getTime());
  seedStart = roundUpDateToStep(seedStart, autoStep);
  if (seedStart < minDate) seedStart = new Date(minDate.getTime());
  if (seedStart > maxDate) seedStart = new Date(minDate.getTime());

  const sameDayEvening = parseLocalString(`${formatDateOnlyLocal(seedStart)}T18:00`);
  let preferredEnd = sameDayEvening && sameDayEvening > seedStart
    ? new Date(Math.min(maxDate.getTime(), sameDayEvening.getTime()))
    : new Date(Math.min(maxDate.getTime(), seedStart.getTime() + 6 * 3600000));
  if (preferredEnd <= seedStart) {
    preferredEnd = new Date(Math.min(maxDate.getTime(), seedStart.getTime() + 3 * 3600000));
  }

  let currentStart = parseLocalString(bestWindowStartInput?.value || '');
  let currentEnd = parseLocalString(bestWindowEndInput?.value || '');
  if (!currentStart || currentStart < minDate || currentStart > maxDate) currentStart = seedStart;
  if (!currentEnd || currentEnd < minDate || currentEnd > maxDate) currentEnd = preferredEnd;
  if (currentEnd <= currentStart) {
    currentEnd = new Date(Math.min(maxDate.getTime(), currentStart.getTime() + Math.max(180, autoStep) * 60000));
  }

  if (startPicker && endPicker) {
    startPicker.set('minDate', minDate);
    startPicker.set('maxDate', maxDate);
    startPicker.set('minuteIncrement', getLaterPickerMinuteIncrement());
    startPicker.setDate(currentStart, false, 'Y-m-d\TH:i');
    if (startPicker.altInput) startPicker.altInput.placeholder = 'Pick a search start date and time';

    endPicker.set('minDate', minDate);
    endPicker.set('maxDate', maxDate);
    endPicker.set('minuteIncrement', getLaterPickerMinuteIncrement());
    endPicker.setDate(currentEnd, false, 'Y-m-d\TH:i');
    if (endPicker.altInput) endPicker.altInput.placeholder = 'Pick a search end date and time';

    setFlatpickrDisabledState(startPicker, !enabled);
    setFlatpickrDisabledState(endPicker, !enabled);
  } else {
    bestWindowStartInput.type = 'datetime-local';
    bestWindowStartInput.min = formatDateTimeLocal(minDate).slice(0, 16);
    bestWindowStartInput.max = formatDateTimeLocal(maxDate).slice(0, 16);
    bestWindowStartInput.value = formatDateTimeLocal(currentStart).slice(0, 16);

    bestWindowEndInput.type = 'datetime-local';
    bestWindowEndInput.min = formatDateTimeLocal(minDate).slice(0, 16);
    bestWindowEndInput.max = formatDateTimeLocal(maxDate).slice(0, 16);
    bestWindowEndInput.value = formatDateTimeLocal(currentEnd).slice(0, 16);
  }

  if (bestWindowPrioritySelect && !bestWindowPrioritySelect.value) bestWindowPrioritySelect.value = 'best_overall';
  bestWindowNote.textContent = getBestWindowPrioritySummary(bestWindowPrioritySelect.value || 'best_overall', selectedActivity);

  const guardrailBits = [
    `Searches from ${formatShortDateTime(formatDateTimeLocal(currentStart).slice(0, 16))} to ${formatShortDateTime(formatDateTimeLocal(currentEnd).slice(0, 16))}.`,
    `Uses ${checkpointModel} route checkpoints when a route is loaded.`,
    `Auto step is ${autoStep} min for the current outing length.`
  ];
  bestWindowStatus.textContent = guardrailBits.join(' ');
  if (startMode === 'best') scheduleBestWindowAnalysis();
}

function applyBestWindowResult(startTime) {
  bestWindowSelectedStart = startTime;
  if (laterInput) laterInput.value = startTime;
  if (bestWindowAnalysis) renderBestWindowResults(bestWindowAnalysis);
  if (weatherData) renderAdvice(weatherData, selectedActivity);
  if (weatherData) refreshRouteWeatherIfPossible();
}
window.applyBestWindowResult = applyBestWindowResult;

// Debounced best-window analysis.
// UI changes can fire several events quickly (duration, priority, water limits),
// so this schedules one analysis pass instead of recomputing on every keystroke.
function scheduleBestWindowAnalysis(force = false) {
  if (!weatherData || startMode !== 'best') return;
  if (!hasPlannedDurationSelection()) return;
  clearTimeout(bestWindowDebounceTimer);
  bestWindowDebounceTimer = setTimeout(() => {
    runBestWindowAnalysis(force).catch(() => {
      if (bestWindowStatus) bestWindowStatus.textContent = 'Could not score weather windows right now.';
    });
  }, force ? 0 : 180);
}

async function runBestWindowAnalysis(force = false) {
  if (!weatherData || startMode !== 'best') return;
  const durationMinutes = getBestWindowDurationMinutes();
  if (!isFiniteNumber(durationMinutes) || durationMinutes <= 0) {
    bestWindowResults.innerHTML = '';
    bestWindowStatus.textContent = 'Choose a planned duration or custom duration first.';
    return;
  }
  const range = getBestWindowSearchRange(weatherData);
  if (!range) {
    bestWindowResults.innerHTML = '';
    bestWindowStatus.textContent = 'Choose a valid search range inside the available forecast window.';
    return;
  }
  const key = getBestWindowConfigKey(weatherData);
  if (!force && key === bestWindowAnalysisKey && bestWindowAnalysis?.topWindows?.length) {
    renderBestWindowResults(bestWindowAnalysis);
    return;
  }

  const token = ++bestWindowAnalysisToken;
  bestWindowStatus.textContent = 'Finding the best weather windows…';
  bestWindowResults.innerHTML = `<div class="best-window-empty">Scoring candidate start times across the allowed range…</div>`;

  const stepMinutes = getBestWindowStepMinutes();
  const durationState = getDurationState(getSelectedEvent());
  const options = {
    priority: bestWindowPrioritySelect?.value || 'best_overall',
    activity: selectedActivity || 'casual',
    constraints: getBestWindowConstraintValues(),
    durationMinutes,
    durationLabel: durationState?.label || formatDurationDisplay(durationMinutes),
    stepMinutes
  };

  const candidates = [];
  for (let cursor = new Date(range.startDate.getTime()); cursor <= range.endDate; cursor = new Date(cursor.getTime() + stepMinutes * 60000)) {
    const startTime = formatDateTimeLocal(cursor).slice(0, 16);
    candidates.push(evaluateBestWindowBaseCandidate(weatherData, startTime, options));
  }
  let validCandidates = candidates.filter(c => c.valid);
  if (!validCandidates.length) {
    bestWindowAnalysis = { range, options, topWindows: [] };
    bestWindowAnalysisKey = key;
    if (token !== bestWindowAnalysisToken) return;
    bestWindowStatus.textContent = 'No valid windows matched the current limits. Try widening the time range or loosening the advanced guardrails.';
    renderBestWindowResults(bestWindowAnalysis);
    return;
  }

  validCandidates.sort((a, b) => b.score - a.score);

  if (routeState?.points?.length) {
    const refineCount = Math.min(8, validCandidates.length);
    const refined = await Promise.all(validCandidates.slice(0, refineCount).map(candidate => refineBestWindowCandidateWithRoute(weatherData, candidate, options)));
    if (token !== bestWindowAnalysisToken) return;
    const refinedByStart = new Map(refined.map(item => [item.startTime, item]));
    validCandidates = validCandidates.map(candidate => refinedByStart.get(candidate.startTime) || candidate).filter(c => c.valid).sort((a, b) => b.score - a.score);
  }

  const topWindows = clusterBestWindowCandidates(validCandidates, stepMinutes, 6, 3, durationMinutes);
  bestWindowAnalysis = { range, options, topWindows, candidates: validCandidates };
  bestWindowAnalysisKey = key;

  if (token !== bestWindowAnalysisToken) return;

  if (!bestWindowSelectedStart || !validCandidates.some(candidate => candidate.startTime === bestWindowSelectedStart)) {
    bestWindowSelectedStart = topWindows[0]?.representative?.startTime || validCandidates[0]?.startTime || null;
    if (laterInput && bestWindowSelectedStart) laterInput.value = bestWindowSelectedStart;
  }

  const lead = topWindows[0]?.representative;
  const leadReasons = lead ? buildBestWindowReasons(lead, options) : [];
  const overrunCount = topWindows.filter(cluster => {
    const rangeInfo = getBestWindowActivityRange(cluster.representative?.startTime, options.durationMinutes);
    return bestWindowRangeOverrunMinutes(rangeInfo, bestWindowAnalysis) > 0;
  }).length;
  const optionLabel = topWindows.length === 1 ? '1 distinct option' : `${topWindows.length} distinct options`;
  const rangeCount = topWindows.filter(cluster => getBestWindowClusterStartRangeInfo(cluster)).length;
  const rangeNote = rangeCount
    ? ` ${rangeCount} option${rangeCount === 1 ? '' : 's'} show a compact good-start range.`
    : '';
  bestWindowStatus.textContent = lead
    ? `${getBestWindowPresetLabel(options.priority)}: best start ${formatShortTime(lead.startTime)}. ${leadReasons.join(' · ')}. Showing ${optionLabel}; nearby starts are condensed.${rangeNote}${overrunCount ? ` ${overrunCount} option${overrunCount === 1 ? '' : 's'} extend past the search end.` : ''}`
    : 'No valid windows found.';
  renderBestWindowResults(bestWindowAnalysis);
  if (weatherData) renderAdvice(weatherData, selectedActivity);
  if (weatherData) refreshRouteWeatherIfPossible();
}


function getDayRecord(data, timeStr) {
  const date = String(timeStr).slice(0,10);
  return data.daily.find(d => d.date === date) || null;
}

function describeLight(data, startTime, forecastSelection) {
  const day = getDayRecord(data, startTime);
  const startPoint = getHourlyPointForStart(data, startTime);
  const transitions = [];
  const hourlyPoints = forecastSelection.mode === 'hourly' ? forecastSelection.points : data.hourly.filter(h => h.time >= startTime && h.time <= addMinutesToLocalString(startTime, 12 * 60));
  for (let i = 1; i < hourlyPoints.length; i++) {
    if (hourlyPoints[i].isDay !== hourlyPoints[i - 1].isDay) transitions.push(hourlyPoints[i]);
  }
  let label = startPoint.isDay ? 'daylight start' : 'dark start';
  let tone = startPoint.isDay ? 'ok' : 'warn';
  if (transitions.length) {
    const first = transitions[0];
    label = first.isDay ? `crosses sunrise around ${formatShortTime(first.time)}` : `crosses sunset around ${formatShortTime(first.time)}`;
    tone = 'warn';
  } else if (!startPoint.isDay) {
    label = 'mostly dark / low light';
  } else if (day?.sunset && startTime > day.sunset) {
    label = `starts after sunset (${formatShortTime(day.sunset)})`;
    tone = 'warn';
  } else if (day?.sunrise && startTime < day.sunrise) {
    label = `starts before sunrise (${formatShortTime(day.sunrise)})`;
    tone = 'warn';
  }
  return { label, tone, sunrise: day?.sunrise || null, sunset: day?.sunset || null, isDay: !!startPoint.isDay };
}

function buildForecastChart(data, selection) {
  return buildForecastChartFromModule(data, selection, routeState?.samples || []);
}

function renderForecastBlock(data, startTime) {
  return renderForecastBlockFromModule(data, getForecastSelection(data, startTime), getDurationProfile(), selectedActivity, routeState?.samples || []);
}

function makeChoiceStep(title, help, options) {
  return { type: 'choice', title, help, options };
}
function makeListStep(title, help, items) {
  return { type: 'list', title, help, items };
}
function item(label, detail, tags = []) {
  return { label, detail, tags: Array.isArray(tags) ? tags : [tags].filter(Boolean) };
}
function option(label, detail, selected = false, tags = []) {
  return { label, detail, selected, tags: Array.isArray(tags) ? tags : [tags].filter(Boolean) };
}

function toChecklistTitle(str) {
  return String(str || '')
    .trim()
    .split(/(\s+|\/|·|\+|–|-|\(|\))/)
    .map(token => {
      if (!token || /^\s+$/.test(token)) return token;
      if (/^[\/+·()–-]$/.test(token)) return token;
      if (/^[0-9]/.test(token)) return token;
      if (/[A-Z]{2,}/.test(token) && !/[a-z]/.test(token)) return token;
      const lower = token.toLowerCase();
      return lower.replace(/(^|['’])([a-zà-ÿ])/g, (_, prefix, chr) => prefix + chr.toUpperCase());
    })
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Clothing decision engine.
 * Returns a compact 3-step wizard based on weather, duration, light, and activity.
 */
function buildWizard(data, activity) {
  const eventPreset = getSelectedEvent();
  const durationState = getDurationState(eventPreset);
  const distanceState = getDistanceState(eventPreset);
  const averageState = getAverageMetric();
  const profile = getDurationProfile();
  const startTime = getSelectedStartTime(data);
  const selection = getForecastSelection(data, startTime);
  const basePoint = startMode === 'now' ? { ...data.current, time: data.current.time } : getHourlyPointForStart(data, startTime);
  const point = applyCustomWeatherOverrides(basePoint, data);
  const light = describeLight(data, startTime, selection);
  const planned = summarizePlannedConditions(selection, point);
  const wet = planned.anyWet;
  const snowy = planned.anySnow;
  const veryWindy = planned.maxWind >= 30;
  const desc = wCodeToEmoji(point.code)[1].toLowerCase();
  const bias = profile.exposureBias;
  const tempPreferenceInfo = getTemperaturePreferenceInfo();
  const tempPreferenceOffset = getTemperaturePreferenceTempOffset();
  const effortInfo = getPlannedEffortInfo();
  const effortOffset = getPlannedEffortTempOffset(activity);
  const feels = isFiniteNumber(point.feels) ? point.feels : point.temp;
  const t = firstFinite(planned.minFeels, feels, point.temp) - bias + tempPreferenceOffset + effortOffset;
  const startLabel = startMode === 'now' ? 'now' : formatShortDateTime(startTime);
  const distanceText = distanceState.label;
  const eventLabel = eventPreset?.label || activityLabels[activity];
  const isRaceDay = raceDayMode;
  const distanceKmValue = isFiniteNumber(distanceState.km) ? distanceState.km : null;
  const chips = [
    { label: `🏁 ${eventLabel}`, tone: '' },
    { label: `📏 ${distanceText}`, tone: distanceState.source === 'derived' ? 'ok' : '' },
    { label: `⏱ ${durationState.label}`, tone: durationState.source === 'derived' ? 'ok' : '' },
    { label: `🕒 start ${startLabel}`, tone: '' },
    { label: `🌡 feels ${Math.round(feels)}°C`, tone: '' },
    { label: light.isDay ? `🌞 ${light.label}` : `🌙 ${light.label}`, tone: light.tone }
  ];
  if (routeState?.points?.length) chips.push({ label: `🗺 route ${distanceText}`, tone: '' });
  if (isRaceDay) chips.push({ label: '🏁 race day mode', tone: '' });
  if (temperaturePreference !== 0) chips.push({ label: tempPreferenceInfo.chip, tone: temperaturePreference < 0 ? 'warn' : '' });
  if (plannedEffort !== 'steady' && isEffortRelevantActivity(activity)) chips.push({ label: effortInfo.chip, tone: effortOffset < 0 ? 'warn' : '' });
  if (planned.precipitationWindowNote) chips.push({ label: `🌧 ${planned.precipitationWindowNote}`, tone: 'warn' });
  if (distanceState.source === 'custom') chips.push({ label: '✍ custom distance', tone: '' });
  if (distanceState.source === 'derived') chips.push({ label: '≈ distance from avg', tone: 'ok' });
  if (durationState.source === 'custom') chips.push({ label: '✍ custom duration', tone: '' });
  if (durationState.source === 'route') chips.push({ label: `🔒 route time ${formatMinutesShort(routeState.elapsedMinutes)}`, tone: '' });
  if (durationState.source === 'derived') chips.push({ label: '≈ duration from avg', tone: 'ok' });
  if (averageState?.valid) chips.push({ label: `⚡ ${averageState.label}`, tone: '' });
  if (getCustomWeatherOverride().active) chips.push({ label: '✍ manual weather', tone: 'warn' });
  if (light.sunrise) chips.push({ label: `⬆ sunrise ${formatShortTime(light.sunrise)}`, tone: '' });
  if (light.sunset) chips.push({ label: `⬇ sunset ${formatShortTime(light.sunset)}`, tone: '' });

  if (activity === 'running') {
    const mainOptions = t >= 18 ? [
      option('Singlet / tee + shorts', 'Warm-weather default.', true, ['main']),
      option('Race singlet + split shorts', 'Leaner race-day setup.', false, ['race']),
      option('Tee + light cap', 'A little more sun management.')
    ] : t >= 10 ? [
      option('Tee + shorts', 'Good once you warm up.', true, ['main']),
      option('Race tee + shorts', 'Works well for harder efforts.', false, ['race']),
      option('Thin long-sleeve + shorts', 'Good if you cool off easily.')
    ] : t >= 4 ? [
      option('Thin long-sleeve + shorts', 'Cool but still runnable.', true, ['main']),
      option('Tee + arm warmers + shorts', 'Easy to adapt as you warm up.', false, ['layered']),
      option('Light thermal base + shorts', 'Good if you run cold early.', false, ['base layer'])
    ] : t >= -2 ? [
      option('Thermal long-sleeve / light base + tights', 'This is proper cool-weather run kit.', true, ['cold']),
      option('Long-sleeve + shorts + gloves', 'Works if your legs do not care much.', false, ['cold']),
      option('Race-day singlet / shorts + arm warmers + gloves', 'Aggressive but plausible for hard efforts.', false, ['race'])
    ] : [
      option('Thermal base + mid-layer + tights', 'Cold-weather default.', true, ['winter']),
      option('Thermal top + jacket + tights', 'Good if wind bites more than the raw temp.', false, ['winter']),
      option('Lighter race setup only', 'Only reasonable if you know you run very warm.', false, ['nope'])
    ];
    const core = [
      item('Socks that match the wet / cold risk', wet ? 'Prioritize dry feet and grip.' : 'Standard running socks are fine.'),
      item('Visibility for traffic', !light.isDay || light.tone === 'warn' ? 'Front / rear reflectivity makes more sense here.' : 'Optional if it stays bright.', ['light']),
      item('Base layer when it is truly cool', t <= 6 ? 'Thin technical base layers help more than people think.' : 'Skip it once conditions stay warm enough.', ['base layer'])
    ];
    if (t <= 6) core.push(item('Light gloves (for example thin running gloves)', 'Small item, big comfort payoff.', ['cold']));
    if (t <= 0) core.push(item('Toque / ear cover', 'Very worthwhile once it is near freezing.', ['winter']));
    if (wet) core.push(item('Cap or light shell', 'Useful for rain and spray control.', ['wet']));
    const runningEyewear = getEyewearSuggestionItem('running', point, planned, light, wet, isRaceDay);
    if (runningEyewear) core.push(runningEyewear);
    const extras = [
      item('Packable shell (for example a light wind or rain shell)', 'Worth it for longer runs or swingy weather.', ['layer']),
      item('Hydration / fuel', profile.minutes >= 120 || (distanceKmValue != null && distanceKmValue >= 15) ? 'Longer runs justify bringing some.' : 'Usually not necessary yet.', ['long'])
    ];
    if (distanceKmValue != null && distanceKmValue >= 10) extras.push(item('Anti-chafe / race lube', 'Starts making more sense once the run gets longer or faster.', ['distance']));
    if (distanceKmValue != null && distanceKmValue >= 21) extras.push(item('Simple fuel carry plan', 'Half-marathon and up makes this more relevant.', ['distance']));
    if (isRaceDay) {
      const raceMainOptions = t >= 18 ? [
        option('Race singlet + split shorts', 'Fast, simple, and actually race-oriented.', true, ['race']),
        option('Race singlet + short shorts + arm sleeves', 'Useful if it is sunny but not brutally hot.', false, ['race']),
        option('Technical race tee + short shorts', 'A little more coverage without getting sloppy.', false, ['race'])
      ] : t >= 10 ? [
        option('Race singlet / race tee + shorts', 'Good all-round race setup once it is cool but not cold.', true, ['race']),
        option('Race singlet + arm sleeves + shorts', 'Great if the start is cool but the race should warm up.', false, ['race']),
        option('Thin long-sleeve race top + shorts', 'Safer when you hate chilly starts.', false, ['race'])
      ] : t >= 4 ? [
        option('Race singlet / tee + arm warmers + shorts', 'Classic cool-weather race compromise.', true, ['race']),
        option('Thin long-sleeve race top + shorts', 'Simpler if you do not want removable layers.', false, ['race']),
        option('Light base layer + race top + shorts', 'Works if you cool off easily before or after the gun.', false, ['race'])
      ] : t >= -2 ? [
        option('Race top + arm warmers + gloves + shorts or half-tights', 'Still race-first, but not stupid.', true, ['race']),
        option('Long-sleeve race top + gloves + shorts', 'Aggressive but workable if you run very warm.', false, ['race']),
        option('Thermal long-sleeve + shorts / half-tights', 'More conservative when cold matters more than pure speed.', false, ['race'])
      ] : [
        option('Thermal race layer + gloves + tights or half-tights', 'Cold-weather race kit with some realism.', true, ['race']),
        option('Thermal base + race top + tights', 'Better when the start is cold and exposed.', false, ['race']),
        option('Warm-up layers over race kit', 'Useful before the start, then ditch them.', false, ['race'])
      ];
      mainOptions.splice(0, mainOptions.length, ...raceMainOptions);
      core.unshift(
        item('Number bib plan (bib belt, pins, or magnets)', 'Decide this before race morning so you are not fighting paper and safety pins in the corral.', ['race day']),
        item('Timing chip / watch setup', 'Easy to forget once the nerves kick in.', ['race day'])
      );
      extras.unshift(
        item('Pre-race warm layer (for example throwaway hoodie or light track pants)', 'Helps a lot if you stand around before the gun.', ['race day']),
        item('Post-race dry clothes', 'Very worthwhile once the effort is over.', ['race day'])
      );
    }
    if (profile.minutes >= 240 || (distanceKmValue != null && distanceKmValue >= 30)) extras.push(item('Dry backup layer', 'Helpful when the weather could turn or the stop afterward is chilly.', ['long']));
    return { point, startTime, chips, activityLabel: activityLabels[activity], summary: `${eventLabel} setup around ${distanceText}, starting at ${Math.round(feels)}°C feels-like with ${desc}${wet ? ' and some precipitation risk' : ''}.`, steps: [ makeChoiceStep('Step 1 · Pick the main run kit', 'Choose the broad outfit first.', mainOptions), makeListStep('Step 2 · Add the important layers / accessories', 'These are the pieces that meaningfully change comfort.', core), makeListStep('Step 3 · Longer-distance / backup items', 'Worth more as the outing or event gets bigger.', extras) ], warning: point.code >= 95 ? 'Thunderstorms are more of a postpone problem than a clothing problem.' : null };
  }

  if (activity === 'cycling') {
    const effective = getCyclingEffectiveTemp(point) - bias + tempPreferenceOffset + effortOffset;
    const mainOptions = effective >= 18 ? [ option('Jersey + bibs', 'Warm-weather road default.', true, ['main']), option('Skinsuit / speedsuit', 'Racey option for faster or shorter efforts.', false, ['race']), option('Jersey + bibs + light base layer', 'Useful if the start is cooler than the day.', false, ['base layer']) ] : effective >= 10 ? [ option('Jersey + bibs + base layer', 'Great shoulder-season default.', true, ['main']), option('Skinsuit + warmers', 'Good if you want speed with adaptability.', false, ['race']), option('Jersey + bibs + gilet', 'Simple wind-control setup.') ] : effective >= 4 ? [ option('Thermal jersey / LS jersey + bibs + base layer', 'Now we are into cool-weather cycling.', true, ['cold']), option('Short-sleeve jersey + arm warmers + gilet', 'Flexible if the day improves.', false, ['layered']), option('Thermal skinsuit + gilet', 'Niche but real for colder fast rides.', false, ['race']) ] : effective >= -2 ? [ option('Thermal jersey / jacket + thermal base + tights', 'Cold-weather road default.', true, ['winter']), option('Softshell + thermal bibs', 'Very good once wind becomes the main enemy.'), option('Lighter summer setup only', 'Usually too light once wind or near-freezing temps show up.', false, ['nope']) ] : [ option('Winter jacket + thermal base + tights', 'Serious winter riding kit.', true, ['winter']), option('Softshell system + merino / thermal base', 'Layered answer if you prefer flexibility.', false, ['winter']), option('Indoor trainer instead', 'Not technically clothing, but still a valid idea.', false, ['wisdom']) ];
    const core = [ item('Cycling gloves (for example short-finger or light full-finger gloves)', effective <= 14 ? 'Below that, gloves stop being optional fast.' : 'Short gloves or no gloves if it is truly warm.'), item('Base layer choice', effective <= 12 ? 'A proper base layer matters a ton on the bike.' : 'Light mesh base is enough or optional.', ['base layer']), item('Visibility / lights', !light.isDay || light.tone === 'warn' || profile.minutes >= 240 ? 'Bring proper lights; the day can get away from you.' : 'Still nice for traffic, even in daylight.', ['light']) ];
    if (veryWindy) core.push(item('Gilet or wind shell (for example a packable cycling vest)', 'Wind can make the ride feel several degrees colder.', ['wind']));
    if (effective <= 10) core.push(item('Toe covers / overshoes', 'Huge comfort boost once it is cooler.', ['cold']));
    if (effective <= 4) core.push(item('Thermal cap / headband', 'Helmet airflow stops being cute.', ['winter']));
    if (wet) core.push(item('Weatherproof shell (for example a packable rain jacket)', 'Rain on a bike changes the math fast.', ['wet']));
    const cyclingEyewear = getEyewearSuggestionItem('cycling', point, planned, light, wet, isRaceDay);
    if (cyclingEyewear) core.push(cyclingEyewear);
    const extras = [ item('Arm / knee / leg warmers', 'Great if the start and finish differ a lot.', ['layered']), item('Dry backup gloves', profile.minutes >= 240 || wet ? 'Very worth it for long or wet days.' : 'Optional.'), item('Extra fuel / layers pocket plan', profile.minutes >= 240 || (distanceKmValue != null && distanceKmValue >= 80) ? 'Longer rides need an actual storage plan.' : 'Keep it light for shorter rides.', ['long']) ];
    if (distanceKmValue != null && distanceKmValue >= 100) extras.push(item('Second layer / gilet plan', 'Century-ish rides justify a cleaner layer strategy.', ['distance']));
    if (distanceKmValue != null && distanceKmValue >= 140) extras.push(item('Lights and backup battery plan', 'Very relevant once the ride can bleed into low light.', ['distance']));
    if (isRaceDay) {
      const raceMainOptions = effective >= 18 ? [
        option('Skinsuit / speedsuit', 'Actual race-first choice in warm conditions.', true, ['race']),
        option('Aero jersey + bib shorts', 'Slightly more forgiving without giving up much.', false, ['race']),
        option('Aero jersey + bibs + packable gilet in pocket', 'Useful if the start looks cool or windy.', false, ['race'])
      ] : effective >= 10 ? [
        option('Skinsuit + arm warmers', 'Fast and adaptable for cool starts.', true, ['race']),
        option('Aero jersey + bibs + light base layer', 'Good if you do not want to gamble on a chilly start.', false, ['race']),
        option('Aero jersey + bibs + gilet', 'Simple race-day wind control.', false, ['race'])
      ] : effective >= 4 ? [
        option('Thermal skinsuit / aero jersey + warmers + gilet', 'Race-oriented but still sensible.', true, ['race']),
        option('Long-sleeve aero jersey + bibs', 'Cleaner if the day stays cool.', false, ['race']),
        option('Thermal jersey + bibs + base layer', 'Safer if speed matters less than comfort.', false, ['race'])
      ] : [
        option('Thermal jersey / skinsuit + base + warmers + shell', 'Cold-weather race setup with some realism.', true, ['race']),
        option('Thermal jacket + bib tights', 'Better when survival starts competing with speed.', false, ['race']),
        option('Warm-up layers over race kit', 'Use before the start, then strip to the actual race setup.', false, ['race'])
      ];
      mainOptions.splice(0, mainOptions.length, ...raceMainOptions);
      core.unshift(item('Race number / number pins or plate plan', 'Know whether your number goes on the jersey, bars, or bike before race morning.', ['race day']));
      extras.unshift(
        item('Pre-race warm-up layer', 'Useful for roll-out, staging, or waiting around on the line.', ['race day']),
        item('Post-race dry top', 'Simple comfort upgrade once the race is over.', ['race day'])
      );
    }
    return { point, startTime, chips, activityLabel: activityLabels[activity], summary: `${eventLabel} around ${distanceText}, with bike-effective feel around ${Math.round(effective)}°C and ${desc}${wet ? ' with wet-road risk' : ''}.`, steps: [ makeChoiceStep('Step 1 · Pick the main bike kit', 'Choose the core on-bike clothing system.', mainOptions), makeListStep('Step 2 · Add the bike-specific essentials', 'These make the biggest difference on a ride.', core), makeListStep('Step 3 · Adapt for distance / swingy weather', 'Longer rides reward better layer planning.', extras) ], warning: point.code >= 95 ? 'Thunderstorms plus exposed roads are not a “dress around it” situation.' : null };
  }

  if (activity === 'triathlon') {
    const triLegSummary = getMultisportSummary('triathlon');
    const hasSwimLeg = customMultisportHasWaterLeg('triathlon');
    const wt = hasSwimLeg && isFiniteNumber(point.waterTemp) ? point.waterTemp : null;
    const mainOptions = wt != null && wt < 14 ? [ option('Trisuit + full wetsuit', 'This is the sensible race-day default here.', true, ['main']), option('Trisuit + full wetsuit + neoprene hood / gloves / booties', 'Even better if the water is seriously cold.', false, ['cold-water']), option('Anything lighter', 'That gets questionable fast.', false, ['nope']) ] : t >= 18 ? [ option('Trisuit only', 'Warm-weather triathlon answer.', true, ['main']), option('Speedsuit / short-sleeve trisuit', 'Aero-leaning option if you like coverage.', false, ['race']), option('Trisuit + optional arm coolers', 'Useful in sun or for long-course comfort.') ] : t >= 10 ? [ option('Trisuit + arm warmers', 'Very useful shoulder-season tri setup.', true, ['main']), option('Trisuit + gilet for bike leg', 'Great if the bike start will feel cold.', false, ['bike']), option('Short-sleeve trisuit', 'Good if you want more coverage all day.', false, ['race']) ] : [ option('Trisuit + arm warmers + gilet / light jacket', 'Cold-air multisport kit.', true, ['cold']), option('Trisuit + full wetsuit + bike extras', 'Very valid when both water and air are cool.', false, ['cold-water']), option('Aggressively minimal kit', 'Only if you already know you tolerate this well.', false, ['risky']) ];
    if (!hasSwimLeg) {
      const dryMultiMainOptions = t >= 18 ? [
        option('Light multisport kit for selected legs', 'Good for bike/run/gym-style multisport without a swim.', true, ['main']),
        option('Short-sleeve aero top + shorts / bibs', 'Useful if the bike leg matters most.', false, ['bike']),
        option('Run-first light kit + bike layer ready', 'Better if the run leg dominates the session.', false, ['run'])
      ] : t >= 10 ? [
        option('Light kit + arm warmers / gilet as needed', 'Good no-swim shoulder-season multisport setup.', true, ['main']),
        option('Bike-first kit + run layer plan', 'Useful when the bike leg will feel colder than the run.', false, ['bike']),
        option('Run-first top + light shell packed', 'Better if the run leg is the priority.', false, ['run'])
      ] : [
        option('Warm selected-leg kit + shell / gilet', 'Cold no-swim multisport needs practical layers, not wetsuit logic.', true, ['cold']),
        option('Bike thermal kit + run change ready', 'Good if bike wind is the limiting factor.', false, ['bike']),
        option('Shorten or move indoors if under-equipped', 'Cold multisport gets messy fast when you are between legs.', false, ['risky'])
      ];
      mainOptions.splice(0, mainOptions.length, ...dryMultiMainOptions);
    }
    const core = [ item('Planned legs', triLegSummary, ['custom']), item('Race belt / bib attachment plan', 'Small item, easy to forget.'), item('Bike/run visibility if the light is marginal', !light.isDay || light.tone === 'warn' ? 'Especially relevant for early starts or long-course days.' : 'Usually not central on a closed course.', ['light']), item('Base layer decision', t <= 10 ? 'A thin base or a short-sleeve trisuit can matter a lot in cool air.' : 'Usually skip heavy underlayers in warm conditions.', ['base layer']) ];
    if (hasSwimLeg && wt != null) core.push(item('Water-temp plan', wt >= 22 ? 'Probably warm enough for a lighter swim setup.' : wt >= 18 ? 'A sleeveless or flexible full suit can make sense.' : 'Plan for a full suit.', ['water']));
    if (hasSwimLeg) core.push(item('Safety buoy / tow float for training swims', 'Treat it as standard open-water kit outside race rules: visibility, a rest point, and a safer place to carry small essentials if the buoy is designed for it.', ['water', 'safety']));
    if (t <= 12) core.push(item('Arm warmers (for example cycling or tri arm warmers)', 'One of the highest-value tri additions for cool air.', ['bike']));
    if (t <= 8 || veryWindy) core.push(item('Gilet / packable shell for the bike', 'Aero-ish discomfort still counts as discomfort.', ['bike']));
    const triEyewear = getEyewearSuggestionItem('triathlon', point, planned, light, wet, isRaceDay);
    if (triEyewear) core.push(triEyewear);
    const extras = [ item('Pre-race warm layer (for example throwaway hoodie or light track pants)', 'Standing around before the start can be colder than the actual race.'), item('Post-race dry clothes (for example tee, hoodie, and dry socks)', 'Very nice once the effort ends.'), item('Socks decision', eventPreset?.key === 'tri_ss' || eventPreset?.key === 'tri_s' ? 'You might go without; otherwise think it through.' : 'Longer-course days often justify socks.', ['transition']) ];
    if (isRaceDay) {
      const raceMainOptions = wt != null && wt < 14 ? [
        option('Trisuit + full wetsuit', 'Most straightforward cold-water race answer.', true, ['race']),
        option('Trisuit + full wetsuit + neoprene hood / gloves / booties', 'Best if the swim is genuinely cold and exposed.', false, ['race']),
        option('Short-sleeve trisuit + full wetsuit', 'Useful if you want a bit more warmth and coverage all day.', false, ['race'])
      ] : t >= 18 ? [
        option('Sleeveless or short-sleeve trisuit', 'Clean race-day default once it is warm.', true, ['race']),
        option('Short-sleeve trisuit + dark glasses', 'Good if the bike/run legs will be bright and hot.', false, ['race']),
        option('Trisuit + arm coolers', 'Useful for sun management without changing the whole setup.', false, ['race'])
      ] : t >= 10 ? [
        option('Trisuit + arm warmers', 'Probably the best all-round cool-weather race compromise.', true, ['race']),
        option('Short-sleeve trisuit + gilet for the bike', 'Great if the bike start feels chilly.', false, ['race']),
        option('Longer-coverage trisuit', 'Simple one-piece answer if you dislike removable layers.', false, ['race'])
      ] : [
        option('Trisuit + arm warmers + gilet / shell for the bike', 'Race-first, but realistic in cold air.', true, ['race']),
        option('Trisuit + full wetsuit + warm bike extras', 'Makes more sense when both swim and bike feel cool.', false, ['race']),
        option('Thermal layers over race kit before the start', 'A real pre-race comfort move, not just fluff.', false, ['race'])
      ];
      mainOptions.splice(0, mainOptions.length, ...raceMainOptions);
      core.unshift(item('Race belt / number / timing chip check', 'Do the full pre-race check so you are not improvising in transition.', ['race day']));
      extras.unshift(item('Transition bag / post-race comfort plan', 'A real event day rewards a little extra organization.', ['race day']));
    }
    if (eventPreset?.key === 'tri_70' || eventPreset?.key === 'tri_full' || (distanceKmValue != null && distanceKmValue >= 80)) extras.push(item('Long-course fuel / carry plan', 'Clothing and storage choices start to overlap here.', ['long-course']));
    return { point, startTime, chips: hasSwimLeg ? [...chips, getWaterTemperatureChip(point, data), { label: `🏁 ${triLegSummary}` }] : [...chips, { label: `🏁 ${triLegSummary}` }], activityLabel: activityLabels[activity], summary: `${eventLabel} preset with ${distanceText}, planned as ${triLegSummary}, around ${Math.round(feels)}°C feels-like${wt != null ? ` and water near ${formatWaterTemperatureValue(point)}` : ''}.`, steps: [ makeChoiceStep('Step 1 · Pick the race-suit system', 'This is the main triathlon clothing decision.', mainOptions), makeListStep('Step 2 · Add the race-specific essentials', 'The small tri items matter more than they look.', core), makeListStep('Step 3 · Before / after / long-course extras', 'Useful once the event gets bigger.', extras) ], warning: hasSwimLeg && wt == null ? 'Water temperature was not available here. Check local swim conditions before locking your swim setup.' : null };
  }

  if (activity === 'swimming_open') {
    const wt = isFiniteNumber(point.waterTemp) ? point.waterTemp : null;
    const wave = isFiniteNumber(point.waveHeight) ? point.waveHeight : null;
    const suitOptions = wt == null ? [ option('Check the venue water temperature first', 'Do not guess cold-water clothing blind.', true, ['safety']), option('Full wetsuit if unsure', 'Safer default when the water data is missing.'), option('Sleeveless / no suit only with known warm water', 'Do not freestyle this one.') ] : wt >= 22 ? [ option('Regular swim kit / trisuit', 'Warm-water range.', true, ['main']), option('Trisuit under a light suit if rules or rehearsal require it', 'More niche, but plausible.', false, ['tri']), option('Full suit only if you genuinely want it', 'Usually not needed once it gets this warm.') ] : wt >= 18 ? [ option('Sleeveless wetsuit or flexible full suit', 'Good middle ground.', true, ['main']), option('Full wetsuit', 'More warmth and buoyancy.'), option('Trisuit under wetsuit', 'Good race-specific combo.', false, ['tri']) ] : wt >= 14 ? [ option('Full wetsuit', 'This is the normal answer here.', true, ['main']), option('Full wetsuit + trisuit underneath', 'Good race rehearsal setup.', false, ['tri']), option('Anything lighter', 'Only if you know you tolerate this well.', false, ['risky']) ] : [ option('Full cold-water swim setup', 'Full-sleeve wetsuit, neoprene hood/cap, gloves, booties, and a warm exit layer.', true, ['cold-water']), option('Full wetsuit with selective neoprene extras', 'Use the suit as the baseline; add hood/cap first, then gloves or booties as water, duration, and entry/exit demand.'), option('Shorten or postpone if under-equipped', 'This is not a good range for improvising with light kit.', false, ['nope']) ];
    const core = [ item('Safety buoy / tow float', 'Treat this as standard open-water swim kit: visibility, a rest point, and a safer way to carry small essentials if the buoy is designed for it.', ['safety']), item('Goggles for the actual light', light.isDay ? 'Tinted if it is bright, clear if it is gloomy.' : 'Clear lenses make more sense in low light.'), item('Bright cap', 'Visibility matters more than style.'), item('Warm clothes ready for after (for example hoodie, joggers, and dry socks)', 'You chill hardest once the swim stops.') ];
    if (wt != null && wt < 14) core.push(item('Cold-water safety check', 'Confirm the swim is allowed/sensible, the suit fits, and the exit plan is ready before you commit.', ['cold-water', 'safety']));
    if (wt != null && wt < 12) core.push(item('Shorter swim / buddy plan', 'At this temperature, duration, supervision, and exit timing matter more than trying to tough it out.', ['cold-water', 'safety']));
    if (!light.isDay || light.tone === 'warn') core.push(item('Extra visibility / shore spotter plan', 'The buoy is already assumed; low light also deserves brighter colours, a spotter, or a light if appropriate.', ['light','safety']));
    const extras = [ item('Changing poncho / towel robe', 'Makes cold exits much less miserable.'), item('Warm drink ready', wt != null && wt < 14 ? 'Very nice after colder water.' : 'Still good if the air is cool.'), item('Base layer / warm top for after', 'A dry thermal layer after the swim can feel magical.', ['base layer']) ];
    if (isRaceDay) extras.unshift(item('Event cap / timing chip / spare goggles', 'Open-water race mornings go a lot smoother when these are already sorted.', ['race day']));
    if (eventPreset?.key === 'ows3800' || eventPreset?.key === 'ows5000' || eventPreset?.key === 'ows10000') extras.push(item('Spare goggles + warm recovery layer', 'Longer open-water swims reward a better pre- and post-swim plan.', ['distance']));
    if (distanceKmValue != null && distanceKmValue >= 3) extras.push(item('Dry recovery layer', 'Longer open-water efforts make the post-swim warm-up more important.', ['distance']));
    if (wave != null && wave >= 1) extras.push(item('Plan for chop and awkward exits', `Wave height around ${wave} m can make everything feel rougher.`, ['water']));
    let warning = null;
    if (wt == null) warning = 'Water temperature was not available here. Verify it locally before committing to an open-water swim.';
    else if (wt < 10) warning = 'Very cold water: high-consequence conditions unless you are specifically equipped and experienced.';
    else if (wave != null && wave >= 1) warning = 'Surface chop can make the swim and especially the exit feel harsher than the air suggests.';
    return { point, startTime, chips: [...chips, getWaterTemperatureChip(point, data)], activityLabel: activityLabels[activity], summary: `${eventLabel} around ${distanceText}, with air around ${Math.round(feels)}°C feels-like${wt != null ? ` and water near ${formatWaterTemperatureValue(point)}` : ''}${wave != null ? `, waves around ${wave} m` : ''}.`, steps: [ makeChoiceStep('Step 1 · Pick the swim-suit system', 'For open water, this is the main clothing decision.', suitOptions), makeListStep('Step 2 · Add the safety / swim essentials', 'These are the items that make the session workable and visible.', core), makeListStep('Step 3 · Before / after extras', 'Open-water comfort often lives outside the actual swim.', extras) ], warning };
  }

  if (isWaterExposureActivity(activity) && activity !== 'swimming_open') {
    const wt = isFiniteNumber(point.waterTemp) ? point.waterTemp : null;
    const wave = isFiniteNumber(point.waveHeight) ? point.waveHeight : null;
    const waterName = activityLabels[activity] || 'water sport';
    const isImmersion = activity === 'surfing' || activity === 'snorkeling' || activity === 'water_sports';
    const isPaddle = activity === 'sup' || activity === 'kayaking';
    const coldAir = t <= 8 || veryWindy || wet;
    const suitOptions = wt == null ? [
      option('Check local water temperature first', 'Water exposure changes the answer too much to guess.', true, ['safety']),
      option(isImmersion ? 'Full wetsuit if unsure' : 'Quick-dry layers + splash protection', isImmersion ? 'Safer default when the water data is missing.' : 'Best generic paddle default when you might get sprayed.'),
      option('Warm dry change waiting at the exit', 'The after-session layer can matter as much as the on-water kit.')
    ] : wt >= 22 ? [
      option(isImmersion ? 'Swimwear / rashguard setup' : 'Quick-dry top + shorts / light paddle kit', 'Warm-water range; sun and wind still matter.', true, ['main']),
      option('Light neoprene top or spring suit', 'Useful if it is windy, cloudy, or you run cold.'),
      option('Full suit only if the session is long or windy', 'Usually not required when the water is this warm.')
    ] : wt >= 18 ? [
      option(isImmersion ? 'Spring suit or flexible full suit' : 'Quick-dry layers + optional neoprene top', 'Good middle ground for moderate water.', true, ['main']),
      option('Full wetsuit', 'More warmth, especially with wind or longer exposure.'),
      option('Wind shell / splash layer staged nearby', 'Useful for paddling or breaks between efforts.')
    ] : wt >= 14 ? [
      option(isImmersion ? 'Full wetsuit' : 'Neoprene or thermal paddle layers + shell', 'This is where cold-water planning starts to matter.', true, ['cold-water']),
      option('Full wetsuit + neoprene cap / booties', 'Sensible for longer exposure or repeated dunking.'),
      option('Minimal summer kit', 'Only if you know exactly what you are doing.', false, ['risky'])
    ] : [
      option('Cold-water exposure setup', 'Wetsuit or drysuit-style protection, neoprene head/hands/feet coverage as needed, and a warm exit plan.', true, ['cold-water']),
      option('Full suit + staged warm exit layer', 'More practical for paddling if immersion is possible but not guaranteed.'),
      option('Shorten or postpone if under-equipped', 'Light kit gets sketchy fast when cold water and wind stack up.', false, ['nope'])
    ];

    const core = [
      item(isPaddle ? 'PFD / flotation layer' : 'Bright visibility aid', isPaddle ? 'For SUP and kayak, this is basic kit, not an accessory.' : 'Helps other people see you in open water.', ['safety']),
      item('Water-appropriate footwear', activity === 'surfing' ? 'Booties if the water, rocks, or board feel harsh.' : 'Protects feet on launches, exits, rocks, and cold ground.'),
      item('Dry warm clothes ready for after', 'You cool off fast when the session ends, especially with wind.')
    ];
    if (activity === 'snorkeling') core.unshift(item('Mask / snorkel / fins check', 'Make sure the basic kit actually fits and seals before you commit.', ['gear']));
    if (activity === 'kayaking') core.unshift(item('Spray / splash management', 'A splash jacket or skirt can change the comfort level a lot.', ['paddle']));
    if (activity === 'sup') core.unshift(item('Leash and board safety check', 'Worth calling out separately for SUP.', ['paddle']));
    if (wt != null && wt < 14) core.push(item('Cold-water exposure check', 'Match the suit and accessories to immersion risk, not just the air temperature.', ['cold-water', 'safety']));
    if (wt != null && wt < 12) core.push(item('Bailout / shorter-session plan', 'Know how you get warm quickly if the session turns colder than expected.', ['cold-water', 'safety']));
    if (!light.isDay || light.tone === 'warn') core.push(item('High-visibility layer / light', 'Low light on or near water is not the place to be invisible.', ['light', 'safety']));
    if (veryWindy) core.push(item('Wind-aware plan', 'Wind can turn paddling and cold exits into the real problem.', ['wind']));

    const extras = [
      item('Changing poncho / towel robe', 'Makes the exit and parking-lot phase much less miserable.'),
      item('Dry bag for phone, keys, and warm layer', 'Especially useful for paddle sports and beach launches.'),
      item('Warm drink / recovery layer', coldAir || (wt != null && wt < 16) ? 'Very nice after colder water or wind.' : 'Optional comfort item.')
    ];
    if (profile.minutes >= 180) extras.push(item('Spare thermal layer', 'Longer water sessions deserve a real backup layer.', ['duration']));
    if (wave != null && wave >= 1) extras.push(item('Rough-water caution', `Wave height around ${wave} m can make the session and exit feel harsher.`, ['water']));
    let warning = null;
    if (wt == null) warning = 'Water temperature was not available here. Verify it locally before locking the setup.';
    else if (wt < 10) warning = 'Very cold water: treat this as high-consequence unless you are specifically equipped and experienced.';
    else if (wave != null && wave >= 1) warning = 'Surface chop can make water sports feel harsher than the air suggests.';
    return { point, startTime, chips: [...chips, getWaterTemperatureChip(point, data)], activityLabel: activityLabels[activity], summary: `${eventLabel} ${waterName} setup around ${distanceText}, with air around ${Math.round(feels)}°C feels-like${wt != null ? ` and water near ${formatWaterTemperatureValue(point)}` : ''}${wave != null ? `, waves around ${wave} m` : ''}.`, steps: [ makeChoiceStep('Step 1 · Pick the water setup', 'Start with warmth, immersion risk, and wind exposure.', suitOptions), makeListStep('Step 2 · Add the safety / practical pieces', 'These make the session workable rather than just technically dressed.', core), makeListStep('Step 3 · Exit / backup extras', 'A good dry exit plan matters a lot around water.', extras) ], warning };
  }

  if (isPoolSwimmingActivity(activity)) {
    let poolType = getPoolType();
    if (activity === 'swimming_pool_indoor') poolType = 'indoor_heated';
    if (activity === 'swimming_pool_outdoor' && poolType === 'indoor_heated') poolType = 'outdoor_unheated';
    const poolNeedsWaterTemp = poolType === 'outdoor_unheated' || poolType === 'unknown';
    const wt = poolNeedsWaterTemp && isFiniteNumber(point.waterTemp) ? point.waterTemp : null;
    const noLocationIndoor = !!data?.noLocationIndoor;
    const poolTypeLabel = ({
      indoor_heated: 'indoor / heated pool',
      outdoor_heated: 'outdoor / heated pool',
      outdoor_unheated: 'outdoor / unheated pool',
      unknown: 'unknown pool type'
    })[poolType] || 'pool';
    const mainOptions = poolNeedsWaterTemp && wt != null && wt < 20 ? [
      option('Regular swim kit + warmer deck plan', 'The swimming kit stays simple, but the water/exit may feel cold.', true, ['main']),
      option('Thin neoprene top / buoyancy shorts if allowed', 'Only if the pool rules and workout make it sensible.', false, ['cold-water']),
      option('Trisuit for rehearsal', 'Useful if you specifically want race feel.', false, ['tri'])
    ] : [
      option('Regular jammer / briefs + goggles + cap', 'Default pool setup.', true, ['main']),
      option('Trisuit for rehearsal', 'Useful if you specifically want race feel.', false, ['tri']),
      option('Drag / training extras', 'Only if the workout itself calls for them.', false, ['training'])
    ];
    const core = [
      item('Deck layer for before / after', noLocationIndoor ? 'Light hoodie, deck coat, or warm-up layer depending on the pool deck.' : (t <= 10 || (wt != null && wt < 20) ? 'A warm top / deck parka is far from stupid.' : 'Light hoodie / tee is enough for most pool sessions.')),
      item('Pool sandals / slides', 'Keeps the whole experience less gross.'),
      item('Dry change for after', noLocationIndoor ? 'Weather is not required here; the useful part is not sitting around in wet kit.' : (t <= 6 ? 'A dry thermal top after the session makes more sense in winter.' : 'Usually a normal change of clothes is enough.'), ['base layer'])
    ];
    if (poolNeedsWaterTemp && wt != null && wt < 18) core.push(item('Warm exit plan', 'Unheated outdoor water can make the post-swim phase matter a lot.', ['cold-water']));
    if (!light.isDay || light.tone === 'warn') core.push(item('Reflective / visible outer layer for the trip home', 'The pool may be warm; outside may not be.', ['light']));
    if (t <= 0) core.push(item('Warm hat / gloves for after', 'The wet-hair-to-cold-air combo is annoying fast.', ['winter']));
    const extras = [ item('Mesh bag / organized change kit', 'Makes pool sessions much smoother.'), item('Towel / absorbent layer', 'Obvious, but it belongs on the list.'), item('Nutrition / hot drink after', profile.minutes >= 120 ? 'A bigger session may justify it.' : 'Optional comfort item.') ];
    const poolChips = poolNeedsWaterTemp ? [...chips, { label: `🏊 ${poolTypeLabel}`, tone: '' }, getWaterTemperatureChip(point, data)] : [...chips, { label: `🏊 ${poolTypeLabel}`, tone: '' }];
    const waterSummary = poolNeedsWaterTemp && wt != null ? `, with water estimated around ${formatWaterTemperatureValue(point)}` : '';
    const warning = poolNeedsWaterTemp && wt == null ? 'Pool water temperature is unknown. For outdoor/unheated pools, verify locally before treating it like a normal heated pool.' : null;
    const poolSummary = noLocationIndoor
      ? `${eventLabel} around ${distanceText} in an ${poolTypeLabel}. Location is optional here; add one only if you want commute-weather layers.`
      : `${eventLabel} around ${distanceText} in an ${poolTypeLabel}${waterSummary}; outside still lines up with about ${Math.round(feels)}°C feels-like.`;
    return { point, startTime, chips: poolChips, activityLabel: activityLabels[activity], summary: poolSummary, steps: [ makeChoiceStep('Step 1 · Pick the swim kit', 'This part stays simple for pool swimming, unless the pool is outdoor and unheated.', mainOptions), makeListStep('Step 2 · Add the practical pool pieces', 'The useful bits are mostly before and after the water.', core), makeListStep('Step 3 · Session extras', 'These matter more on longer or more structured sessions.', extras) ], warning };
  }


  if (activity === 'gym' || activity === 'indoor_running' || activity === 'indoor_cycling' || activity === 'indoor_multisport') {
    const isIndoorRun = activity === 'indoor_running';
    const isIndoorBike = activity === 'indoor_cycling';
    const isIndoorMulti = activity === 'indoor_multisport';
    const indoorLabel = activityLabels[activity] || 'indoor training';
    const indoorMultiSummary = isIndoorMulti ? getMultisportSummary('indoor_multisport') : '';
    const noLocationIndoor = !!data?.noLocationIndoor;
    const commuteCold = !noLocationIndoor && t <= 4;
    const commuteWet = !noLocationIndoor && (wet || snowy);
    const mainOptions = isIndoorMulti ? [
      option('Light base kit + sport-specific swaps', 'Start with light kit, then swap shoes/shorts/towel between legs instead of overdressing.', true, ['main']),
      option('Tri-style indoor kit', 'Good for bike + run or swim + bike + run when you want one simple core outfit.', false, ['multisport']),
      option('Separate swim / bike / run kit bundle', 'More realistic for pool + trainer + track days, especially if there is any transition time.', false, ['checklist'])
    ] : isIndoorBike ? [
      option('Light indoor kit + strong fan / towel setup', 'Indoor cycling is mostly heat and sweat management.', true, ['main']),
      option('Bib shorts + sleeveless base / light jersey', 'Good if you prefer bike-specific kit indoors.'),
      option('Regular cycling kit + dry change ready', 'Useful if you are riding somewhere before or after.')
    ] : isIndoorRun ? [
      option('Light run top + shorts', 'Default treadmill or indoor track setup.', true, ['main']),
      option('Singlet + split shorts', 'Better for hot indoor intervals.', false, ['speed']),
      option('Light tee + half tights', 'A little more coverage without overheating.')
    ] : [
      option('Breathable gym top + shorts', 'Simple strength / gym default.', true, ['main']),
      option('Light tee + flexible training pants', 'Good if you want more coverage.'),
      option('Layered warm-up top over gym kit', 'Useful if the trip to the gym is cold.')
    ];
    const core = [
      item('Dry change of clothes', 'Indoor sessions can soak clothing even when the weather outside is irrelevant.'),
      item('Towel / sweat management', isIndoorMulti ? 'Plan one towel for sweat and another dry towel if a pool leg is involved.' : isIndoorBike ? 'A towel and fan matter as much as clothing on the trainer or spin bike; velodrome sessions may care more about dry warm-up layers.' : 'Keeps the workout and bag less gross.'),
      item('Outside layer for the commute', noLocationIndoor ? 'Optional until you add a location; pack it based on how you get there and back.' : (commuteCold ? 'Do not leave sweaty in cold air without a warm layer.' : commuteWet ? 'A rain shell or dry outer layer makes the trip home nicer.' : 'Light outer layer is enough for most indoor sessions.'), ['commute'])
    ];
    if (plannedEffort === 'hard' || plannedEffort === 'race') core.push(item('Extra cooling plan', 'Higher-intensity indoor work usually needs more fan, towel, bottle, and dry-change discipline.', ['effort']));
    if (plannedEffort === 'low' || plannedEffort === 'easy') core.push(item('Warm-up / between-effort layer', 'Lower-output sessions can feel cool before you are fully warmed up or between blocks.', ['effort']));
    if (isIndoorMulti) core.unshift(item('Planned indoor blocks', indoorMultiSummary, ['custom']));
    if (isIndoorBike || customMultisportHasLeg('indoor_multisport', 'indoor_bike')) core.push(item('Fan / hydration / track-layer check', 'Trainer and spin sessions need cooling; velodrome sessions often need a warm-up layer between efforts.', ['indoor']));
    if (isIndoorMulti) core.push(item('Transition bag / separate compartments', 'Keep wet swim pieces, cycling kit, run shoes, and dry clothes separated so the session does not become a damp pile.', ['multisport']));
    if (isIndoorMulti) core.push(item('Sport-specific shoes', 'Bike shoes, running shoes, pool sandals, or lifting shoes depend on the legs you actually include.', ['multisport']));
    if (isIndoorRun) core.push(item('Shoe / surface choice', 'Treadmill, track, and gym floor do not always want the same shoe.', ['indoor']));
    if (!noLocationIndoor && (!light.isDay || light.tone === 'warn')) core.push(item('Visibility for the trip there / back', 'The workout is indoors, but the commute may not be.', ['light']));
    const extras = [
      item('Post-workout warm layer', commuteCold ? 'Very useful after sweating indoors.' : 'Optional comfort item.'),
      item('Extra socks / underwear', 'Small bag item, big quality-of-life upgrade.'),
      item('Bottle / electrolytes', profile.minutes >= 90 ? 'Worth it once the indoor session gets longer or hotter.' : 'Usually simple water is fine.')
    ];
    if (isIndoorMulti) extras.push(item('Mini transition checklist', `Pack for: ${indoorMultiSummary}. Keep wet pool gear, bike kit, run shoes, and dry clothes separated.`, ['checklist']));
    const indoorSummary = noLocationIndoor
      ? `${eventLabel} setup for ${indoorLabel}${isIndoorMulti ? ` (${indoorMultiSummary})` : ''}. Location is optional here; add one only if you want commute-weather layers.`
      : `${eventLabel} setup for ${indoorLabel}${isIndoorMulti ? ` (${indoorMultiSummary})` : ''}, with outside conditions around ${Math.round(feels)}°C feels-like for the trip there and back.`;
    const indoorStepTitle = isIndoorMulti ? 'Step 1 · Pick the indoor multisport kit' : 'Step 1 · Pick the indoor training kit';
    const indoorStepHelp = isIndoorMulti
      ? 'Build around the indoor blocks you selected in the custom multisport picker.'
      : 'Dress for heat and sweat indoors, then add commute layers separately.';
    return { point, startTime, chips, activityLabel: indoorLabel, summary: indoorSummary, steps: [ makeChoiceStep(indoorStepTitle, indoorStepHelp, mainOptions), makeListStep('Step 2 · Add the indoor-session basics', 'These matter more than outdoor weather once you are inside.', core), makeListStep('Step 3 · Commute / post-workout extras', 'Mostly about not staying wet and cold after the session.', extras) ], warning: null };
  }

  if (activity === 'hiking' || activity === 'trail_running' || activity === 'mtb_gravel' || activity === 'ski_snowboard') {
    const isTrailRun = activity === 'trail_running';
    const isDirtBike = activity === 'mtb_gravel';
    const isSnowSport = activity === 'ski_snowboard';
    const isHike = activity === 'hiking';
    const exposureTemp = isDirtBike ? getCyclingEffectiveTemp(point) - bias + tempPreferenceOffset + effortOffset : t;
    const mountainLabel = activityLabels[activity] || 'trail / mountain sport';
    const mainOptions = isSnowSport ? (exposureTemp <= -8 ? [
      option('Thermal base + insulated mid-layer + ski shell + snow pants', 'Cold resort / mountain default.', true, ['winter']),
      option('Merino base + fleece + insulated jacket + shell pants', 'Layered and adjustable.'),
      option('Light shell-only setup', 'Too optimistic unless you know the hill will warm up.', false, ['risky'])
    ] : exposureTemp <= 2 ? [
      option('Base layer + mid-layer + shell + snow pants', 'Standard ski/snowboard layering.', true, ['winter']),
      option('Thermal base + light puffy + shell', 'Good if lift lines or wind get cold.'),
      option('Softshell / spring setup', 'Only if the hill is mild and dry.', false, ['spring'])
    ] : [
      option('Light base + shell / spring outerwear', 'Milder ski-day setup.', true, ['spring']),
      option('Base layer + vented shell', 'Good if you heat up easily.'),
      option('Heavy insulated setup', 'May be too warm unless wind or lift time is rough.')
    ]) : isTrailRun ? (exposureTemp >= 12 ? [
      option('Trail tee + shorts', 'Warm trail-run default.', true, ['main']),
      option('Singlet + shorts + light vest', 'Leaner but still trail-aware.'),
      option('Light long-sleeve + shorts', 'Good for sun, bugs, or brush.')
    ] : exposureTemp >= 4 ? [
      option('Long-sleeve trail top + shorts / half tights', 'Cool trail-run default.', true, ['main']),
      option('Tee + arm sleeves + light vest', 'Adaptable if climbing warms you up.'),
      option('Thin base + shorts', 'Better if you run cold.')
    ] : [
      option('Thermal top + tights + gloves', 'Cold trail-running default.', true, ['cold']),
      option('Base layer + shell + tights', 'Better for wet wind or exposed terrain.'),
      option('Road-race minimal kit', 'Too lean for most rough trails.', false, ['risky'])
    ]) : isDirtBike ? (exposureTemp >= 14 ? [
      option('Jersey + bibs / baggies + light gloves', 'Warm MTB/gravel default.', true, ['main']),
      option('Short-sleeve jersey + liner shorts + baggies', 'More trail-oriented.'),
      option('Light shell packed', 'Useful if weather or descents get weird.')
    ] : exposureTemp >= 6 ? [
      option('Long-sleeve jersey + bibs / baggies + gloves', 'Cool dirt-ride default.', true, ['main']),
      option('Base layer + jersey + gilet', 'Good for gravel wind or long descents.'),
      option('Thermal jersey + light shell', 'More conservative for wet or exposed riding.')
    ] : [
      option('Thermal jersey + base + tights / pants + gloves', 'Cold dirt-ride setup.', true, ['cold']),
      option('Softshell + thermal bibs / pants', 'Good if wind and mud matter.'),
      option('Short-sleeve kit only', 'Too light for cold dirt riding.', false, ['risky'])
    ]) : (exposureTemp >= 16 ? [
      option('Light hiking shirt + shorts / light pants', 'Warm hiking default.', true, ['main']),
      option('Sun hoodie + light pants', 'Good for sun, bugs, or brush.'),
      option('Light shell packed', 'Still smart if terrain or weather shifts.')
    ] : exposureTemp >= 6 ? [
      option('Base or hiking shirt + fleece / mid-layer + shell packed', 'Shoulder-season hiking default.', true, ['main']),
      option('Long-sleeve + softshell pants', 'Good if wind and brush matter.'),
      option('Tee + hoodie only', 'Fine for easy trails, lighter for exposed terrain.', false, ['light'])
    ] : [
      option('Thermal base + fleece + shell + hiking pants', 'Cold hiking default.', true, ['cold']),
      option('Base layer + light puffy + shell', 'Better if you stop often or climb high.'),
      option('Casual cotton layers', 'Bad idea once sweat, wind, or elevation shows up.', false, ['risky'])
    ]);
    const core = [
      item(isSnowSport ? 'Helmet / goggles / gloves' : isDirtBike ? 'Gloves + eye protection' : 'Footwear / traction that matches the terrain', isSnowSport ? 'Core hill kit, not optional.' : isDirtBike ? 'Dirt, wind, bugs, and spray make this matter.' : wet || snowy ? 'Grip matters more when trail surfaces get wet, muddy, icy, or snowy.' : 'Match shoes/boots to trail roughness.', ['terrain']),
      item('Shell or weather layer', wet || veryWindy ? 'Bring it; exposed terrain makes wet wind worse.' : 'Packable is fine if the forecast looks stable.', ['layer']),
      item('Hydration / fuel', profile.minutes >= 180 || (distanceKmValue != null && distanceKmValue >= 12) ? 'Longer outings need a real plan.' : 'Still worth having a small bottle or snack.', ['fuel'])
    ];
    if (isHike || isTrailRun) core.push(item('Navigation / phone battery', 'Trails punish low battery and vague route plans.', ['safety']));
    if (isDirtBike) core.push(item('Repair kit / pump / tube or plugs', 'Dirt rides need spares more than clean road loops.', ['repair']));
    if (isSnowSport) core.push(item('Neck warmer / face cover', exposureTemp <= -4 || veryWindy ? 'Very useful in cold wind and on lifts.' : 'Optional but easy to carry.', ['winter']));
    if (exposureTemp <= 5) core.push(item('Gloves / warm hand plan', 'Hands often go first in exposed terrain.', ['cold']));
    if (!light.isDay || light.tone === 'warn') core.push(item('Headlamp or lights', 'Low light plus trails is not the time to improvise.', ['light']));
    const extras = [
      item('Dry layer for the finish', 'Very nice once sweat meets wind or a car ride home.'),
      item('Emergency / sit layer', profile.minutes >= 240 || exposureTemp <= 4 ? 'Worth it when the outing gets longer, colder, or more remote.' : 'Optional for short local loops.', ['safety']),
      item('Sun / eye protection', light.isDay ? 'Useful at elevation, on snow, or exposed trails.' : 'Skip if it stays dark.', ['daylight'])
    ];
    if (snowy || isSnowSport) extras.push(item('Spare gloves / socks', 'Winter days are better with a dry backup.', ['winter']));
    return { point, startTime, chips, activityLabel: mountainLabel, summary: `${eventLabel} setup for ${mountainLabel}, with planning feel around ${Math.round(exposureTemp)}°C${wet ? ' and wet / mixed-surface risk' : ''}.`, steps: [ makeChoiceStep('Step 1 · Pick the main trail / mountain kit', 'Start with the clothing system for exposure, terrain, and effort level.', mainOptions), makeListStep('Step 2 · Add terrain-specific essentials', 'These are the things that keep the outing practical and safer.', core), makeListStep('Step 3 · Backup / exposure extras', 'Worth adding when the day gets longer, colder, higher, or more remote.', extras) ], warning: point.code >= 95 ? 'Storms and exposed terrain are a route/timing problem, not just a gear problem.' : null };
  }


  if (activity === 'fishing' || activity === 'hunting') {
    const isFishing = activity === 'fishing';
    const staticBias = profile.minutes >= 240 ? 3 : profile.minutes >= 120 ? 2 : 1;
    const planningTemp = t - staticBias;
    const fieldLabel = activityLabels[activity] || (isFishing ? 'fishing' : 'hunting');
    const waterOrFieldRisk = isFishing && shouldShowWaterTemperature(activity, point) ? (point.waterTempSource ? getWaterTemperatureChip(point, data) : null) : null;
    const mainOptions = planningTemp >= 16 ? [
      option(isFishing ? 'Sun shirt / light top + quick-dry pants' : 'Light field layers + quiet pants', isFishing ? 'Warm fishing default with sun and splash in mind.' : 'Warm-weather hunting/scouting default.', true, ['main']),
      option('Light hoodie / overshirt + pants', 'Better for bugs, brush, or a cooler start.'),
      option('Rain shell packed', 'Worth it if the session is long or exposed.', false, ['wet'])
    ] : planningTemp >= 7 ? [
      option(isFishing ? 'Base or long-sleeve + fleece/hoodie + shell packed' : 'Base layer + quiet mid-layer + shell packed', isFishing ? 'Good cool-weather fishing setup.' : 'Good for a cool blind, stand, or field outing.', true, ['layered']),
      option('Softshell jacket + pants', 'Good if wind matters more than rain.'),
      option('Light insulated vest + shell', 'Useful for static time without overbuilding the arms.')
    ] : planningTemp >= -3 ? [
      option(isFishing ? 'Thermal base + insulated jacket + waterproof/windproof shell' : 'Thermal base + insulated quiet jacket + warm pants', isFishing ? 'Cold fishing default, especially from shore or boat.' : 'Cold static hunting default.', true, ['cold']),
      option('Base + fleece + puffy + shell', 'Layered and adjustable when activity level changes.'),
      option('Minimal activewear setup', 'Too light once you stop moving.', false, ['risky'])
    ] : [
      option(isFishing ? 'Deep-cold insulated setup + serious boots/gloves' : 'Deep-cold stand setup + heavy insulation', isFishing ? 'Ice/shore/boat cold gets ugly fast.' : 'Static cold requires more warmth than hiking or running.', true, ['winter']),
      option('Thermal base + puffy + shell + insulated pants', 'More modular winter version.'),
      option('Light shell over normal clothes', 'Not enough for long static exposure.', false, ['risky'])
    ];
    const core = [
      item(isFishing ? 'PFD / flotation plan when near water' : 'Blaze orange / legal visibility where required', isFishing ? 'For boat, kayak, dock, riverbank, or sketchy shoreline situations, this is the safety item.' : 'Regulations vary, but visibility and legality should be handled before clothing details.', ['safety']),
      item(isFishing ? 'Waterproof footwear / grip' : 'Boots matched to terrain', wet || snowy ? 'Wet grass, mud, banks, snow, and docks punish bad footwear.' : 'Comfort matters more because there may be long standing or sitting.', ['footwear']),
      item('Warm hand plan', planningTemp <= 8 || veryWindy ? 'Hands get cold fast when you are mostly static.' : 'Still useful for early mornings.', ['cold']),
      item('Shell / rain layer', wet || veryWindy ? 'Bring it; exposed static time magnifies wet wind.' : 'Packable is usually enough if the forecast is stable.', ['layer'])
    ];
    if (isFishing) core.push(item('Dry bag / waterproof pouch', 'Phone, keys, license, and spare layers deserve dry storage.', ['water']));
    if (isFishing) core.push(item('Cold-water margin', 'Dress for falling in, spray, or handling wet gear when the water is cold — not just the air.', ['water']));
    if (!isFishing) core.push(item('Quiet / low-sheen outer layer', 'For hunting, fabric noise and visibility can matter as much as warmth.', ['field']));
    if (!light.isDay || light.tone === 'warn') core.push(item('Headlamp / small light', 'Early starts, late exits, and hands-full packing make this useful.', ['light']));
    if (planningTemp <= 2) core.push(item('Insulated hat / neck gaiter', 'Static exposure makes the head and neck feel the cold quickly.', ['winter']));
    const extras = [
      item('Sit pad / insulated seat layer', profile.minutes >= 180 || planningTemp <= 6 ? 'Huge comfort gain for shore, blind, stand, or ice time.' : 'Optional for short sessions.', ['static']),
      item('Spare dry socks / gloves', wet || planningTemp <= 4 || profile.minutes >= 240 ? 'Small backup, big rescue when things get wet or cold.' : 'Nice-to-have.'),
      item('Thermos / warm drink', planningTemp <= 6 || profile.minutes >= 240 ? 'Very useful for long static exposure.' : 'Optional comfort item.')
    ];
    if (isFishing && firstFinite(point.waveHeight, 0) >= 1) extras.push(item('Wave / wind caution', 'Boat, kayak, and shoreline fishing get sketchier when chop builds.', ['water']));
    const fieldChips = isFishing && waterOrFieldRisk ? [...chips, waterOrFieldRisk] : chips;
    const fieldSummary = isFishing && shouldShowWaterTemperature(activity, point) && point.waterTemp != null ? ` Water is around ${formatWaterTemperatureValue(point)}, so keep the cold-water margin in mind.` : '';
    return { point, startTime, chips: fieldChips, activityLabel: fieldLabel, summary: `${eventLabel} setup for ${fieldLabel}, with static-planning feel around ${Math.round(planningTemp)}°C and ${desc}${wet ? ' with wet-weather risk' : ''}.${fieldSummary}`, steps: [ makeChoiceStep(`Step 1 · Pick the main ${isFishing ? 'fishing' : 'hunting'} setup`, 'Static exposure, wind, and wet ground matter more than speed here.', mainOptions), makeListStep('Step 2 · Add the field essentials', 'Safety, footwear, hands, and weather protection are the big pieces.', core), makeListStep('Step 3 · Static-exposure extras', 'These make long sits, shore time, cold starts, or wet exits less miserable.', extras) ], warning: point.code >= 95 ? 'Storms and exposed water/field locations are a timing and safety problem, not just a clothing problem.' : null };
  }

  if (activity === 'walk') {
    const easyWalk = profile.minutes <= 60 && (!distanceKmValue || distanceKmValue <= 5);
    const mainOptions = t >= 20 ? [
      option('Breathable top + shorts / light pants', 'Warm-walk default; keep it easy and not overbuilt.', true, ['main']),
      option('Light sun shirt + light pants', 'Better for sun, bugs, or longer easy paths.'),
      option('Packable shell only', 'Only if the forecast could turn wet or windy.')
    ] : t >= 11 ? [
      option('Tee or light long-sleeve + light jacket', 'Good walking setup when effort stays moderate.', true, ['main']),
      option('Long-sleeve + vest / overshirt', 'Nice if wind matters more than raw temperature.'),
      option('Hoodie + regular pants', 'Comfortable, less sporty option for easy walking.')
    ] : t >= 3 ? [
      option('Base / long-sleeve + mid-layer + light shell', 'Best all-round cool-weather walk setup.', true, ['layered']),
      option('Warm hoodie / fleece + jacket', 'Good if pace is relaxed.'),
      option('Light insulated jacket + pants', 'Better if you stop often or walk slowly.')
    ] : t >= -6 ? [
      option('Thermal base + warm mid-layer + insulated jacket', 'Cold-walk default, especially if the pace is easy.', true, ['winter']),
      option('Parka + normal layers', 'Works well for slower walks or errands.'),
      option('Shell + fleece + thermal base', 'More adjustable if you heat up while moving.')
    ] : [
      option('Parka / winter coat + thermal layers', 'Deep-cold walking setup.', true, ['winter']),
      option('Insulated shell + fleece + base layer', 'Layered version if you dislike one huge coat.'),
      option('Light jacket setup', 'Too optimistic for a proper cold walk.', false, ['risky'])
    ];
    const core = [
      item('Comfortable walking shoes / boots', wet || snowy ? 'Prioritize grip and water resistance over speed.' : 'Comfort matters more than race feel here.', ['footwear']),
      item('Hat / cap / toque', t <= 1 ? 'Toque territory.' : light.isDay ? 'Cap or sunglasses can matter more than warmth.' : 'Optional unless it is windy.', ['headwear']),
      item('Small water / pocket snack', profile.minutes >= 90 || (distanceKmValue != null && distanceKmValue >= 6) ? 'Worth bringing once it is more than a short stroll.' : 'Optional for a short walk.', ['fuel'])
    ];
    if (wet) core.push(item('Rain shell or umbrella', 'For walking, an umbrella is actually a reasonable tool if wind is not stupid.', ['wet']));
    if (t <= 5) core.push(item('Gloves', 'Low effort can leave hands cold faster than you expect.', ['cold']));
    if (!light.isDay || light.tone === 'warn') core.push(item('Visibility near traffic', 'Reflective bits or a small light help on sidewalks and road edges.', ['light']));
    if (snowy || t <= -4) core.push(item('Warm socks / winter footwear', 'Cold ground and slush are usually the limiting factor.', ['winter']));
    const extras = [];
    if (profile.minutes >= 120 || (distanceKmValue != null && distanceKmValue >= 8)) extras.push(item('Packable backup layer', 'Long walks give the weather more time to change.', ['long']));
    if (veryWindy) extras.push(item('Wind-blocking outer layer', 'Walking speed is low, but wind can still chew through thin layers.', ['wind']));
    if (t <= -2) extras.push(item('Neck warmer / scarf', 'Small comfort boost in cold wind.', ['cold']));
    if (!easyWalk) extras.push(item('Phone / route / return plan', 'Useful once the walk is long enough to be more than a quick loop.', ['planning']));
    return { point, startTime, chips, activityLabel: activityLabels[activity], summary: `${eventLabel} setup for ${distanceText}, with about ${Math.round(feels)}°C feels-like at the planned start and ${desc}${wet ? ' with some precipitation risk' : ''}.`, steps: [ makeChoiceStep('Step 1 · Pick the main walking outfit', 'Choose the broad warmth level first, then tune footwear and small accessories.', mainOptions), makeListStep('Step 2 · Add the walking essentials', 'Simple items that matter more once you are outside for a while.', core), makeListStep('Step 3 · Longer-walk / bad-weather extras', 'Bring these when the walk gets longer, colder, windier, or darker.', extras) ], warning: point.code >= 95 ? 'Thunderstorms are a timing problem, not a walking-outfit problem.' : null };
  }

  if (activity === 'road_trip') {
    const routeWeather = getRouteWeatherExtremes();
    const coldestStopFeels = firstFinite(routeWeather?.coldestFeels, feels);
    const planningFeels = Math.min(feels, coldestStopFeels);
    const endDelta = routeWeather?.deltaFeels;
    const largeSwing = isFiniteNumber(endDelta) && Math.abs(endDelta) >= 8;
    if (routeWeather?.coldest) chips.push({ label: `🛣 coldest stop ${Math.round(routeWeather.coldestFeels)}°C`, tone: routeWeather.coldestFeels <= 5 ? 'warn' : '' });
    if (isFiniteNumber(endDelta)) chips.push({ label: `↕ end ${endDelta > 0 ? '+' : ''}${Math.round(endDelta)}°C vs start`, tone: Math.abs(endDelta) >= 8 ? 'warn' : '' });

    const mainOptions = planningFeels >= 18 ? [
      option('Tee / light top + easy pants or shorts', 'Comfort-first driving setup.', true, ['main']),
      option('Breathable layers + light shell packed in-cabin', 'Best if the route may cool off or get wet at stops.'),
      option('Travel tee + overshirt', 'A bit cleaner without getting fussy.')
    ] : planningFeels >= 8 ? [
      option('Tee / long-sleeve + overshirt or hoodie', 'Easy all-day travel answer.', true, ['main']),
      option('Light jacket + normal travel layers staged in the cabin', 'Good when checkpoint weather shifts a bit.'),
      option('Thin base layer + overshirt', 'Useful if the trip starts cool or ends colder.', false, ['base layer'])
    ] : planningFeels >= 0 ? [
      option('Warm mid-layer + jacket + comfortable pants', 'Cold-stop / cool-destination default.', true, ['cold']),
      option('Base layer + fleece / hoodie + shell', 'Smarter when the route swings between dry and wet stops.', false, ['base layer']),
      option('Insulated jacket + normal travel layers', 'Simpler if you want one obvious outer layer.')
    ] : [
      option('Winter jacket + warm base / mid-layer + pants', 'Cold-stop / cold-start default.', true, ['winter']),
      option('Thermal base + fleece + insulated shell', 'Layered answer for long winter travel.', false, ['base layer']),
      option('Lighter in-car-only setup', 'Only makes sense if nearly all of the day stays inside the vehicle.', false, ['nope'])
    ];

    const core = [
      item('Shoes that still work for fuel, food, and weather stops', routeWeather?.coldest ? `Dress for the roughest stop, not just the cabin — ${routeWeather.coldest.label} looks coolest.` : 'You are sitting a lot, but not teleporting door-to-door.'),
      item('Shell or rain layer within reach', routeWeather?.wettest && firstFinite(routeWeather.maxPrecipProb, 0) >= 40 ? `The wettest stop around ${routeWeather.wettest.label} looks meaningfully wetter than the start.` : (wet ? 'Useful once stops get wet.' : 'Still worth keeping handy for roadside or break stops.')),
      item('Base layer or easy mid-layer when the route cools off', planningFeels <= 6 || profile.minutes >= 360 || largeSwing ? 'Helps a lot when one stop or the destination is colder than the start.' : 'Usually optional.', ['base layer'])
    ];
    if (!light.isDay || light.tone === 'warn') core.push(item('Visibility / flashlight at stops', 'Very worthwhile for dark rest-area or roadside stops.', ['light']));
    if (planningFeels <= 3) core.push(item('Gloves + warm hat staged in the cabin (for example knit gloves and a beanie)', routeWeather?.coldest ? `The coldest stop is around ${Math.round(routeWeather.coldestFeels)}°C feels-like.` : 'Mostly for outside time, not for driving.', ['cold']));
    if (firstFinite(routeWeather?.maxWind, point.wind, 0) >= 30 || firstFinite(routeWeather?.maxPrecipProb, point.precipProb, 0) >= 45) core.push(item('Extra dry / windproof layer in the trunk', 'Stops can feel a lot rougher than the cabin suggests.', ['travel']));

    const extras = [
      item('Sunglasses', light.isDay ? 'Useful for glare and fatigue.' : 'Skip once it is dark.', ['daylight']),
      item('Water / snacks', profile.minutes >= 240 || (distanceKmValue != null && distanceKmValue >= 250) ? 'Makes the long drive feel less stupid.' : 'Optional.'),
      item('Blanket or spare warm layer', profile.minutes >= 360 || planningFeels <= 4 || (distanceKmValue != null && distanceKmValue >= 500) ? 'Great backup if you stop longer than expected or the destination is colder.' : 'Nice-to-have.'),
      item('Cabin-access change layer', largeSwing ? 'If the destination is much colder or warmer than the start, this is genuinely useful.' : 'Optional unless the route spans very different conditions.')
    ];

    const routeSummary = routeWeather?.coldest
      ? ` The route-loaded weather says the coldest stop is ${routeWeather.coldest.label} near ${routeWeather.coldest.placeLabel || 'the route'} at about ${Math.round(routeWeather.coldestFeels)}°C feels-like${isFiniteNumber(endDelta) ? `, with the finish running ${endDelta > 0 ? 'about ' + Math.round(endDelta) + '°C warmer' : 'about ' + Math.abs(Math.round(endDelta)) + '°C colder'} than the start` : ''}.`
      : '';

    return { point, startTime, chips, activityLabel: activityLabels[activity], summary: `${eventLabel} setup for ${distanceText}, with about ${Math.round(feels)}°C feels-like at the planned start and ${desc}${wet ? ' with some wet-stop risk' : ''}.${routeSummary}`.replace('..', '.'), steps: [ makeChoiceStep('Step 1 · Pick the main travel outfit', 'Focus on what still works when you get out of the car.', mainOptions), makeListStep('Step 2 · Add the stop / weather essentials', 'These matter most once you start opening the doors.', core), makeListStep('Step 3 · Long-drive extras', 'These start making more sense as the travel day grows.', extras) ], warning: point.code >= 95 ? 'Strong storms can change a road trip more than a clothing choice can.' : null };
  }

  if (activity === 'camping') {
    const overnight = getCampingOvernightSummary(data, startTime, profile);
    const overnightFeels = firstFinite(overnight?.overnightFeels, overnight?.overnightLow, t);
    const campPlanningTemp = Math.min(t, firstFinite(overnightFeels, t));
    const windyCamp = firstFinite(overnight?.windyCamp, point.wind, 0);
    const campWet = wet || firstFinite(overnight?.precipChance, 0) >= 40 || firstFinite(overnight?.precipSum, 0) >= 3;
    if (isFiniteNumber(overnightFeels)) chips.push({ label: `🌙 overnight ${Math.round(overnightFeels)}°C`, tone: overnightFeels <= 2 ? 'warn' : '' });
    if (windyCamp >= 30) chips.push({ label: `⛺ gusty camp ${Math.round(windyCamp)} km/h`, tone: 'warn' });

    const mainOptions = campPlanningTemp >= 14 ? [
      option('Light camp clothing + shell ready', 'Mild-weather camping.', true, ['main']),
      option('Hiking layers + evening insulation', 'Good if the day is warm but camp gets cooler.'),
      option('Base layer ready for sleeping', 'Still worth packing once the evening drops.', false, ['sleep'])
    ] : campPlanningTemp >= 6 ? [
      option('Layers + fleece / mid-layer + shell', 'Shoulder-season camping default.', true, ['main']),
      option('Base layer + mid-layer + shell', 'Better if you run cool or camp high / near water.', false, ['base layer']),
      option('Light insulated jacket + hiking layers', 'Good evening comfort.')
    ] : campPlanningTemp >= -2 ? [
      option('Thermal base + fleece + insulated jacket + shell', 'Cold-weather camp layering.', true, ['cold']),
      option('Merino / thermal sleep set + insulated outer layers', 'Good if the nights matter more than the daytime walking.', false, ['sleep']),
      option('Lighter daytime layers + a much warmer camp layer', 'Works if the main issue is sitting around camp.', false, ['camp'])
    ] : [
      option('Full cold-weather camp layering system', 'Insulation is the whole game now.', true, ['winter']),
      option('Thermal base + heavy puffy + shell + warm sleep setup', 'Layered but serious.'),
      option('Warm-weather camp kit only', 'Too light once the temperature really drops overnight.', false, ['nope'])
    ];

    const core = [
      item('Dry base layer / dedicated sleep layer (for example merino or synthetic long underwear)', 'One of the highest-value comfort upgrades in camp.', ['base layer','sleep']),
      item('Rain shell and real shelter plan (for example a waterproof shell and properly tensioned tent fly)', campWet ? 'The forecast looks damp enough that shelter and shell planning should be deliberate.' : 'Still a wise pack item for camp.'),
      item('Headlamp', !light.isDay || profile.mode === 'daily' ? 'Camp plus darkness equals headlamp.' : 'Still worth having in the bag.', ['light']),
      item('Sleeping bag rating', getSleepingBagGuidance(overnightFeels), ['sleep']),
      item('Sleeping pad / ground insulation (for example an insulated air pad or foam + air pad combo)', getSleepingPadGuidance(overnightFeels), ['sleep'])
    ];
    if (campPlanningTemp <= 8) core.push(item('Warm hat / toque (for example a merino beanie)', 'Evenings cool off faster than people pretend.', ['cold']));
    if (campPlanningTemp <= 4) core.push(item('Gloves', 'Useful around camp even before deep winter.', ['cold']));
    if (campPlanningTemp <= 0 || snowy) core.push(item('Warm socks + insulated footwear plan', 'Cold feet can ruin a camp fast.', ['winter']));
    if (windyCamp >= 25) core.push(item('Guy lines / stake plan', 'Windy camps punish lazy shelter setup.', ['shelter']));

    const extras = [
      item('Extra dry socks / underwear', 'Multi-day camp rewards redundancy.'),
      item('Insulated sit / camp layer', 'Great when you are no longer moving around much.'),
      item('Spare warm layer in a dry bag', 'Insurance against damp misery.', ['multi-day']),
      item('Tent ventilation / condensation plan', campWet ? 'Expect more dampness and condensation management to matter.' : 'Still worth thinking about if nights cool off.', ['shelter'])
    ];
    if (profile.mode === 'daily') extras.push(item('Check every overnight low, not just the daytime high', `This trip spans about ${overnight?.nightCount || 1} night${(overnight?.nightCount || 1) === 1 ? '' : 's'}, so the sleep system matters as much as the daytime clothing.`, ['sleep']));

    return { point, startTime, chips, activityLabel: activityLabels[activity], summary: `${eventLabel} setup for ${distanceText}, with outside conditions around ${Math.round(feels)}°C feels-like${campWet ? ' and some wet-weather risk' : ''}${isFiniteNumber(overnightFeels) ? `, and an overnight low around ${Math.round(overnightFeels)}°C feels-like` : ''}.`, steps: [ makeChoiceStep('Step 1 · Pick the camp clothing system', 'Think daytime movement, evening camp time, and the overnight drop.', mainOptions), makeListStep('Step 2 · Add the camp and shelter essentials', 'These matter more than a perfectly optimized daytime outfit.', core), makeListStep('Step 3 · Sleep-system and multi-day extras', 'Camping comfort usually lives in the overnight setup.', extras) ], warning: point.code >= 95 ? 'Thunderstorms and camping call for a plan, not just a different jacket.' : null };
  }

  const mainOptions = t >= 20 ? [ option('Light top + shorts or light pants', 'Warm-weather normal.', true, ['main']), option('Breathable shirt + light trousers', 'A little sharper without being hot.'), option('Light shell packed only', 'Only if the weather could turn later.') ] : t >= 11 ? [ option('Tee / long-sleeve + overshirt', 'Easy shoulder-season answer.', true, ['main']), option('Sweater / hoodie + regular pants', 'Cozier, especially later in the day.'), option('Light jacket over a tee', 'Good if wind matters more than raw temp.') ] : t >= 3 ? [ option('Sweater / hoodie + jacket + regular pants', 'Normal cool-weather setup.', true, ['main']), option('Light insulated jacket + pants', 'Better if you will be out longer.'), option('Shell over base layer + mid-layer', 'Works well when wet wind matters most.', false, ['base layer']) ] : t >= -6 ? [ option('Insulated jacket + warm layer + pants', 'This is proper cold-weather clothing now.', true, ['winter']), option('Parka + regular layers', 'Comfy if you are mostly standing or walking slowly.'), option('Shell + fleece + thermal base', 'Flexible layered approach.', false, ['base layer']) ] : [ option('Warm winter coat / parka + insulating layers', 'Deep winter default.', true, ['winter']), option('Insulated shell + fleece + thermal base', 'If you prefer layering over one huge coat.', false, ['base layer']), option('Lighter summer setup only', 'This is how you start hating the outing.', false, ['nope']) ];
  const core = [ item('Footwear that matches the ground', wet ? 'Prioritize puddles, slush, or wet sidewalks.' : 'Normal shoes are fine if it stays dry.'), item('Hat / toque depending on temperature', t <= 1 ? 'Toque territory.' : 'Cap if glare or drizzle matters.'), item('Base layer when the day gets cold or long', t <= 6 || profile.minutes >= 240 ? 'A thin thermal or merino base helps a lot for long cool days.' : 'Usually optional.', ['base layer']) ];
  if (t <= 4) core.push(item('Gloves', 'Big comfort boost for very little effort.', ['cold']));
  if (wet) core.push(item('Umbrella or weatherproof layer', 'Pick whichever is less annoying for the actual outing.', ['wet']));
  if (!light.isDay || light.tone === 'warn') core.push(item('A little visibility near traffic', 'Especially useful when it is dark or gloomy.', ['light']));
  if (t <= -4 || snowy) core.push(item('Winter boots or warmer footwear', 'Makes sense once cold, snow, or slush show up.', ['winter']));
  const extras = [];
  if (t <= 2) extras.push(item('Warm socks', 'Small thing, big comfort payoff.', ['cold']));
  if (t <= -2 || veryWindy) extras.push(item('Neck layer / scarf', 'Very worthwhile in cold wind.', ['cold']));
  if (profile.minutes >= 240 || profile.mode === 'daily' || (distanceKmValue != null && distanceKmValue >= 8)) extras.push(item('Packable extra layer', 'Longer time out means more chance the weather becomes annoying.', ['long']));
  return { point, startTime, chips, activityLabel: activityLabels[activity], summary: `${eventLabel} setup for ${distanceText}, with about ${Math.round(feels)}°C feels-like at the planned start and ${desc}${wet ? ' with some precipitation risk' : ''}.`, steps: [ makeChoiceStep('Step 1 · Pick the main everyday outfit', 'Choose the broad clothing level first.', mainOptions), makeListStep('Step 2 · Add the practical extras', 'Only the pieces that actually improve comfort.', core), makeListStep('Step 3 · Optional comfort / winter items', 'Bring these when the duration or cold justifies them.', extras) ], warning: point.code >= 95 ? 'Thunderstorms are much more a “go later” problem than a “dress better” problem.' : null };
}

function compactStepTitle(step, index) {
  if (index === 0) return 'Main pick';
  if (index === 1) return 'Add to the setup';
  if (index === 2) return 'Nice-to-have extras';
  return step.title?.replace(/^Step\s*\d+\s*·\s*/i, '').trim() || `Step ${index + 1}`;
}

function buildCompactSummary(point, desc, wizard) {
  const bits = [`Feels ${Math.round(point.feels)}°C`, desc];
  if ((point.wind || 0) >= 25) bits.push(`wind ${Math.round(point.wind)} km/h`);
  if ((point.precipProb || 0) >= 35 || (point.precip || 0) >= 0.2) bits.push('wet');
  const darkChip = wizard.chips.find(chip => /dark|night/i.test(chip.label));
  if (darkChip) bits.push('low light');
  if (isFiniteNumber(point.waterTemp)) bits.push(`water ${round1(point.waterTemp)}°C`);
  return bits.join(' · ');
}

function getClothingExamples(label, tags = [], activity = selectedActivity) {
  const text = `${label || ''} ${(tags || []).join(' ')}`.toLowerCase();
  const examples = [];
  const add = (...items) => items.forEach(item => { if (item && !examples.includes(item)) examples.push(item); });
  const waterColdText = /cold-water|neoprene|wetsuit|drysuit|booties|hood|cap/.test(text);
  if (waterColdText) {
    if (/swim/.test(text)) add('full-sleeve wetsuit', 'neoprene hood');
    else if (/cold-water|wetsuit|suit|drysuit/.test(text)) add('full-sleeve wetsuit', 'drysuit-style paddling layer');
    if (/cold-water|hood|cap|head/.test(text)) add('neoprene hood', 'neoprene swim cap');
    if (/cold-water|gloves|hands/.test(text)) add('neoprene swim gloves', 'paddle pogies');
    if (/cold-water|booties|feet|foot/.test(text)) add('neoprene booties', 'neoprene socks');
  }

  if (/singlet|race tee|tee|technical tee/.test(text)) add('light technical tee', 'race singlet');
  if (/split shorts|shorts/.test(text) && activity === 'running') add('5-inch run shorts', 'split shorts');
  if (/jersey/.test(text)) add(/thermal/.test(text) ? 'thermal jersey' : 'short-sleeve cycling jersey', 'long-sleeve jersey');
  if (/bibs?/.test(text)) add(/thermal/.test(text) ? 'thermal bib tights' : 'bib shorts');
  if (/gilet|wind vest/.test(text)) add('packable gilet', 'wind vest');
  if (/shell|rain layer|rain shell|weatherproof/.test(text)) add('packable rain shell', 'light wind shell');
  if (/base layer|merino/.test(text)) add('merino base layer', 'synthetic long-sleeve base layer');
  if (/fleece|hoodie|mid-layer/.test(text)) add('grid fleece', 'light fleece hoodie');
  if (/insulated jacket|puffy|parka/.test(text)) add('synthetic puffy', 'light insulated jacket');
  if (/gloves/.test(text) && !waterColdText) add(activity === 'cycling' ? 'full-finger cycling gloves' : 'thin liner gloves', 'insulated gloves');
  if (/tights/.test(text)) add('thermal tights', 'brushed tights');
  if (/toe covers|overshoes/.test(text)) add('neoprene toe covers', 'road overshoes');
  if (/toque|hat|ear cover/.test(text)) add('thin beanie', 'thermal headband');
  if (/wetsuit/.test(text)) add('full-sleeve wetsuit', 'sleeveless wetsuit');
  if (/booties/.test(text)) add('neoprene booties');
  if (/hood/.test(text) && /neoprene|cold-water/.test(text)) add('neoprene hood');
  if (/sleeping bag/.test(text)) add('0°C comfort sleeping bag', 'synthetic 3-season bag');
  if (/sleeping pad|ground insulation/.test(text)) add('insulated air pad', 'closed-cell foam pad');
  if (/sunglasses|glasses|eyewear|lenses/.test(text)) {
    if (/clear|low-light/.test(text)) add('clear-lens sports glasses', 'rose or yellow low-light lenses');
    else if (/photochromic|mid-tint/.test(text)) add('photochromic sunglasses', 'mid-tint wraparound glasses');
    else add('dark-tint sports sunglasses', 'wraparound sunglasses');
  }
  if (/number bib|bib belt|race number|number pins|magnets/.test(text)) add('bib belt', 'safety pins');
  if (/timing chip/.test(text)) add('timing chip strap');

  return examples.slice(0, 2);
}

function renderSteps(steps) {
  return steps.map((step, index) => {
    const resetButtons = `
      <div class="wizard-actions">
        <button type="button" class="reset-btn" data-reset-step>Reset step</button>
      </div>`;
    if (step.type === 'choice') {
      return `
        <div class="wizard-step" data-wizard-step="${index}" data-step-type="choice">
          <div class="wizard-head">
            <div class="wizard-num">${index + 1}</div>
            <div style="flex:1 1 auto">
              <div class="wizard-title-row">
                <div>
                  <h4>${escapeHtml(compactStepTitle(step, index))}</h4>
                  <div class="wizard-subtitle">${escapeHtml(step.help || 'Pick one clear base outfit, then fine-tune the rest below.')}</div>
                </div>
                ${resetButtons}
              </div>
            </div>
          </div>
          <div class="choice-list">
            ${step.options.map((opt, optIndex) => `
              <label class="choice-item ${opt.selected ? 'active' : ''}" data-choice-card>
                <input type="radio" name="wizard-step-${index}" ${opt.selected ? 'checked' : ''} data-default="${opt.selected ? '1' : '0'}" data-option-label="${escapeHtml(opt.label)}" data-option-tags="${escapeHtml((opt.tags || []).join('|'))}">
                <div class="choice-copy">
                  <strong>${escapeHtml(toChecklistTitle(opt.label))}</strong>
                  ${opt.detail ? `<span class="detail">${escapeHtml(opt.detail)}</span>` : ''}
                  ${getClothingExamples(opt.label, opt.tags || []).length ? `<span class="detail">Examples: ${escapeHtml(getClothingExamples(opt.label, opt.tags || []).join(' · '))}</span>` : ''}
                </div>
              </label>`).join('')}
          </div>
          <div class="pick-checklist" data-pick-checklist="${index}"></div>
        </div>`;
    }
    return `
      <div class="wizard-step" data-wizard-step="${index}" data-step-type="list">
        <div class="wizard-head">
          <div class="wizard-num">${index + 1}</div>
          <div style="flex:1 1 auto">
            <div class="wizard-title-row">
              <div>
                <h4>${escapeHtml(compactStepTitle(step, index))}</h4>
                <div class="wizard-subtitle">${escapeHtml(step.help || 'Click items to cross them off as you pack or dress.')}</div>
              </div>
              ${resetButtons}
            </div>
          </div>
        </div>
        <div class="simple-list">
          ${step.items.length ? step.items.map(it => `
            <button type="button" class="simple-item" data-check-item aria-pressed="false" data-tags="${escapeHtml((it.tags || []).join('|'))}">
              <div class="mark"></div>
              <div class="simple-copy">
                <strong>${escapeHtml(toChecklistTitle(it.label))}</strong>
                ${it.detail ? `<span class="detail">${escapeHtml(it.detail)}</span>` : ''}
                ${getClothingExamples(it.label, it.tags || []).length ? `<span class="detail">Examples: ${escapeHtml(getClothingExamples(it.label, it.tags || []).join(' · '))}</span>` : ''}
                ${it.tags?.length ? `<div class="tag-row">${it.tags.map(t => `<span class="item-tag">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
              </div>
            </button>`).join('') : `<button type="button" class="simple-item" data-check-item aria-pressed="false"><div class="mark"></div><div class="simple-copy"><strong>Nothing major to add</strong><span class="detail">This section is already pretty lean for these conditions.</span></div></button>`}
        </div>
      </div>`;
  }).join('');
}

function extractOptionPieces(label, tags = []) {
  const raw = String(label || '').trim();
  const lower = `${raw} ${(tags || []).join(' ')}`.toLowerCase();
  let pieces = raw
    .split(/\s+\+\s+|\s+with\s+|\s+over\s+/i)
    .map(part => part.trim())
    .filter(Boolean);

  if (/cold-water kit|head\s*\/\s*hands\s*\/\s*feet|neoprene hood|neoprene cap|booties/.test(lower)) {
    pieces = ['Thermal suit layer', 'Neoprene hood / cap', 'Neoprene gloves if cold enough', 'Neoprene booties / socks', 'Warm exit layer'];
  } else if (/wetsuit/.test(lower) && /neoprene/.test(lower)) {
    pieces = ['Full wetsuit', 'Neoprene head protection', 'Neoprene hand / foot protection', 'Warm clothes ready after'];
  } else if (/base layer/.test(lower) && /shell/.test(lower)) {
    pieces = [...pieces, 'Dry base layer', 'Weather shell'];
  } else if (/ski|snowboard|snow pants/.test(lower)) {
    pieces = ['Base layer', 'Mid-layer / insulation', 'Shell or ski jacket', 'Snow pants', 'Gloves / goggles'];
  }

  return [...new Set(pieces)].slice(0, 8);
}

function renderChoiceChecklist(slot) {
  const stepIndex = slot.getAttribute('data-pick-checklist');
  const selected = resultInner.querySelector(`input[name="wizard-step-${stepIndex}"]:checked`);
  if (!selected) { slot.innerHTML = ''; return; }
  const tags = String(selected.getAttribute('data-option-tags') || '').split('|').filter(Boolean);
  const pieces = extractOptionPieces(selected.getAttribute('data-option-label'), tags);
  if (!pieces.length) { slot.innerHTML = ''; return; }
  slot.innerHTML = `
    <div class="pick-title">Main pick breakdown</div>
    <div class="main-breakdown-list">
      ${pieces.map(piece => `<button type="button" class="main-breakdown-item" data-check-item aria-pressed="false">${escapeHtml(toChecklistTitle(piece))}</button>`).join('')}
    </div>`;
}

function syncInteractiveAdvice() {
  resultInner.querySelectorAll('[data-choice-card]').forEach(card => {
    const input = card.querySelector('input[type="radio"]');
    card.classList.toggle('active', !!input?.checked);
  });
  resultInner.querySelectorAll('[data-pick-checklist]').forEach(renderChoiceChecklist);
}
function clearDoneItems(root) {
  root.querySelectorAll('[data-check-item].done').forEach(item => {
    item.classList.remove('done');
    item.setAttribute('aria-pressed', 'false');
    const mark = item.querySelector('.mark');
    if (mark) mark.textContent = '';
  });
}

function resetWizardStep(stepEl) {
  if (!stepEl) return;
  const defaultRadio = stepEl.querySelector('input[type="radio"][data-default="1"]');
  if (defaultRadio) defaultRadio.checked = true;
  clearDoneItems(stepEl);
  syncInteractiveAdvice();
}

function resetAllWizard() {
  resultInner.querySelectorAll('.wizard-step').forEach(stepEl => resetWizardStep(stepEl));
}


// Wire the HTML tooltip after each render so the SVG itself can stay simple.
// The tooltip is rendered through a tiny body-level "portal" instead of staying
// inside the chart container. That avoids clipping from the forecast scroll box
// and also keeps hover working when the cursor is high in the SVG chart.
let chartTooltipGlobalDismissBound = false;

function getForecastChartTooltipPortal() {
  return getForecastChartTooltipPortalFromModule();
}

function bindForecastChartTooltips(root = resultInner) {
  return bindForecastChartTooltipsFromModule(root);
}
/**
 * Render an indoor-only clothing guide without requiring a location first.
 *
 * This keeps indoor activities from being blocked by the weather workflow. The
 * guide intentionally omits the weather card and forecast chart, because those
 * would imply that the app has fetched real local conditions. If the user later
 * adds a location, the normal weather-aware render path takes over and can add
 * commute/weather context back into the recommendation.
 */
function renderIndoorAdviceWithoutLocation() {
  if (!isNoLocationIndoorActivity(selectedActivity)) return false;
  const syntheticData = buildIndoorFallbackWeatherData(selectedActivity);
  const wizard = buildWizard(syntheticData, selectedActivity);

  resultCard.style.display = 'block';
  resultInner.innerHTML = `
    <div class="result-sections">
      <section class="result-panel">
        <div class="block-title">Indoor guide</div>
        <div class="route-callout">No location required for this activity. Add a location later if you want commute weather, daylight, or outdoor arrival/departure layers.</div>
        <div class="mini-chips">
          ${wizard.chips.map(chip => `<div class="mini-chip ${chip.tone || ''}">${escapeHtml(chip.label)}</div>`).join('')}
          <div class="mini-chip">🏷 ${escapeHtml(wizard.activityLabel)}</div>
          <div class="mini-chip">🏠 indoor / controlled setting</div>
        </div>
      </section>
      <section class="result-panel">
        <div class="block-title">Clothing & gear</div>
        <div class="summary-action-row">
          <p class="summary">${escapeHtml(buildCompactSummary(wizard.point, 'indoor / controlled setting', wizard))}</p>
          <div class="wizard-actions-inline">
            <button type="button" class="reset-btn" data-reset-all>Reset guide</button>
          </div>
        </div>
        <div class="wizard-grid">${renderSteps(wizard.steps)}</div>
        ${wizard.warning ? `<div class="warning-box"><span class="wi">⚠️</span><span>${escapeHtml(wizard.warning)}</span></div>` : ''}
      </section>
    </div>
  `;
  syncInteractiveAdvice();
  updateManualWeatherStatus();
  return true;
}

function refreshIndoorAdviceIfNeeded() {
  if (weatherData) return false;
  if (isNoLocationIndoorActivity(selectedActivity)) return renderIndoorAdviceWithoutLocation();
  return false;
}

// Final render pass that ties weather, forecast, route checkpoints, and clothing together.
/** 
 * Main render orchestrator for a selected weather/activity state.
 * It prepares the chosen forecast slice, applies water/manual overrides, builds
 * weather chips, renders the forecast chart/table, and builds the recommendation
 * wizard. Keep this function high-level; detailed rules live in helpers.
 */
function renderAdvice(data, activity) {
  resultCard.style.display = 'block';
  const startTime = getSelectedStartTime(data);
  const pointBase = startMode === 'now' ? { ...data.current, time: data.current.time } : getHourlyPointForStart(data, startTime);
  const point = applyCustomWeatherOverrides(pointBase, data);
  const [, desc] = wCodeToEmoji(point.code);
  const windSummary = formatWindTooltip(point.wind || data.current.wind, point.gusts || data.current.gusts, point.windDir || data.current.windDir);
  const metaLines = [
    `💧 Humidity <strong>${escapeHtml(data.current.humidity)}%</strong>`,
    `💨 Wind <strong>${escapeHtml(windSummary.speedText)}</strong> ${windSummary.dirHtml}`,
    `↯ Gusts <strong>${escapeHtml(windSummary.gustText)}</strong>`,
    `🌧 Precip <strong>${escapeHtml(round1(point.precip || 0))} mm</strong> · <strong>${escapeHtml(Math.round(firstFinite(point.precipProb, 0)))}%</strong>`
  ];
  const uvInfo = getUvRiskInfo(getUvDisplayValue(point, data));
  if (uvInfo) metaLines.push(`☀ ${renderUvBadge(uvInfo.value)}`);
  const aqiInfo = getAqiInfo(point.aqi ?? data.current.aqi);
  if (aqiInfo) metaLines.push(`💨 ${renderAqiBadge(aqiInfo.value)}`);

  const weatherMetaDay = getDayRecord(data, point.time || startTime || data.currentTime);
  if (weatherMetaDay?.sunrise || weatherMetaDay?.sunset) {
    const sunBits = [];
    if (weatherMetaDay.sunrise) sunBits.push(`⬆ Sunrise <strong>${escapeHtml(formatShortTime(weatherMetaDay.sunrise))}</strong>`);
    if (weatherMetaDay.sunset) sunBits.push(`⬇ Sunset <strong>${escapeHtml(formatShortTime(weatherMetaDay.sunset))}</strong>`);
    if (sunBits.length) metaLines.push(sunBits.join(' · '));
  }
  const waterMetaLine = renderWaterTemperatureMetaLine(point, data);
  const showWaterUi = shouldShowWaterTemperature(activity || selectedActivity, point);
  if (waterMetaLine) metaLines.push(waterMetaLine);
  if (isFiniteNumber(point.waveHeight)) metaLines.push(`〰️ Waves <strong>${escapeHtml(round1(point.waveHeight))} m</strong>`);

  const durationState = getDurationState(getSelectedEvent());
  if (!durationState) {
    resultInner.innerHTML = `
      <div class="result-sections">
        <section class="result-panel">
          <div class="location-name">📍 <span>${escapeHtml(data.locationName)}</span></div>
          <div class="weather-strip">
            ${weatherIconHtml(point.code, 'weather-icon')}
            <div class="weather-main">
              <div class="when">${escapeHtml(formatWeatherDateTime(point.time || startTime))}</div>
              <div class="temp">${escapeHtml(Math.round(point.temp))}°C</div>
              <div class="desc">${escapeHtml(desc)} · feels ${escapeHtml(Math.round(point.feels))}°C</div>
            </div>
            <div class="weather-meta">${metaLines.join('<br>')}</div>
          </div>
          ${showWaterUi ? `<div class="mini-chips">
            <div class="mini-chip ${point.waterTempSource === 'measured' ? 'ok' : point.waterTempSource === 'estimated' ? '' : 'warn'}">🌊 ${escapeHtml(getWaterTemperatureSourceLabel(point, data))}</div>
          </div>` : ''}
          ${showWaterUi ? renderWaterTempDisclaimer(point) : ''}
          <div class="block-title">Weather & forecast</div>
          <div class="route-callout">Choose a planned duration or enter a custom duration to render the forecast window and weather checkpoints.</div>
          ${routeState?.points?.length ? `<div id="route-weather-slot">${buildRouteWeatherHtml()}</div>` : ''}
        </section>
        <section class="result-panel">
          <div class="block-title">Clothing & gear</div>
          <p class="summary">Choose a planned duration to time the outing, then choose an activity to turn the weather into clothing and gear suggestions.</p>
        </section>
      </div>
    `;
    updateManualWeatherStatus();
    bindForecastChartTooltips();
    return;
  }

  if (!activity) {
    const selectionForWarnings = getForecastSelection(data, startTime);
    const weatherWarningsHtml = renderWeatherHazardWarnings(data, selectionForWarnings, point, activity);
    resultInner.innerHTML = `
      <div class="result-sections">
        <section class="result-panel">
          <div class="location-name">📍 <span>${escapeHtml(data.locationName)}</span></div>
          <div class="weather-strip">
            ${weatherIconHtml(point.code, 'weather-icon')}
            <div class="weather-main">
              <div class="when">${escapeHtml(formatWeatherDateTime(point.time || startTime))}</div>
              <div class="temp">${escapeHtml(Math.round(point.temp))}°C</div>
              <div class="desc">${escapeHtml(desc)} · feels ${escapeHtml(Math.round(point.feels))}°C</div>
            </div>
            <div class="weather-meta">${metaLines.join('<br>')}</div>
          </div>
          ${showWaterUi ? `<div class="mini-chips">
            <div class="mini-chip ${point.waterTempSource === 'measured' ? 'ok' : point.waterTempSource === 'estimated' ? '' : 'warn'}">🌊 ${escapeHtml(getWaterTemperatureSourceLabel(point, data))}</div>
          </div>` : ''}
          ${showWaterUi ? renderWaterTempDisclaimer(point) : ''}
          ${weatherWarningsHtml}
          <div class="block-title">Weather & forecast</div>
          ${renderForecastBlock(data, startTime)}
          ${routeState?.points?.length ? `<div id="route-weather-slot">${buildRouteWeatherHtml()}</div>` : ''}
        </section>
        <section class="result-panel">
          <div class="block-title">Clothing & gear</div>
          <p class="summary">Choose an activity to turn the weather into clothing and gear suggestions.</p>
        </section>
      </div>
    `;
    updateManualWeatherStatus();
    bindForecastChartTooltips();
    return;
  }

  const wizard = augmentWizardWithAqiContext(augmentWizardWithUvContext(buildWizard(data, activity), data, activity), data, activity);
  const selectionForWarnings = getForecastSelection(data, wizard.startTime);
  const weatherWarningsHtml = renderWeatherHazardWarnings(data, selectionForWarnings, point, activity);
  resultInner.innerHTML = `
    <div class="result-sections">
      <section class="result-panel">
        <div class="location-name">📍 <span>${escapeHtml(data.locationName)}</span></div>
        <div class="weather-strip">
          ${weatherIconHtml(point.code, 'weather-icon')}
          <div class="weather-main">
            <div class="when">${escapeHtml(formatWeatherDateTime(point.time || wizard.startTime))}</div>
            <div class="temp">${escapeHtml(Math.round(point.temp))}°C</div>
            <div class="desc">${escapeHtml(desc)} · feels ${escapeHtml(Math.round(point.feels))}°C</div>
          </div>
          <div class="weather-meta">${metaLines.join('<br>')}</div>
        </div>

        <div class="mini-chips">
          ${wizard.chips.map(chip => `<div class="mini-chip ${chip.tone || ''}">${escapeHtml(chip.label)}</div>`).join('')}
          <div class="mini-chip">🏷 ${escapeHtml(wizard.activityLabel)}</div>
          ${showWaterUi ? `<div class="mini-chip ${point.waterTempSource === 'measured' ? 'ok' : point.waterTempSource === 'unknown' ? 'warn' : ''}">🌊 ${escapeHtml(getWaterTemperatureSourceLabel(point, data))}</div>` : ''}
        </div>
        ${showWaterUi ? renderWaterTempDisclaimer(point) : ''}
        ${weatherWarningsHtml}

        <div class="block-title">Weather & forecast</div>
        ${renderForecastBlock(data, wizard.startTime)}
        ${routeState?.points?.length ? `<div id="route-weather-slot">${buildRouteWeatherHtml()}</div>` : ''}
      </section>

      <section class="result-panel">
        <div class="block-title">Clothing & gear</div>
        ${activity === 'road_trip' ? `<div id="itinerary-panel" class="itinerary-panel"></div>` : ''}
        <div class="summary-action-row">
          <p class="summary">${escapeHtml(buildCompactSummary(point, desc, wizard))}</p>
          <div class="wizard-actions-inline">
            <button type="button" class="reset-btn" data-reset-all>Reset guide</button>
          </div>
        </div>
        <div class="wizard-grid">${renderSteps(wizard.steps)}</div>
        ${wizard.warning ? `<div class="warning-box"><span class="wi">⚠️</span><span>${escapeHtml(wizard.warning)}</span></div>` : ''}
      </section>
    </div>
  `;
  syncInteractiveAdvice();
  bindForecastChartTooltips();
  updateManualWeatherStatus();
  if (activity === 'road_trip') triggerRoadTripItinerary();
}

// ── Road trip itinerary (OSM/Nominatim client-side) ───────────────────────
// The road-trip panel is intentionally lightweight and client-side: it reuses
// route weather checkpoints, adds midpoint break suggestions for very long
// segments, reverse-geocodes rough place names, and renders a scannable timeline.
// Because long GPX routes can generate many useful stops, v9.4 uses a dynamic
// display limit rather than a fixed ten-stop cap.

// Resolve a human-readable place name for itinerary stops.
// This is intentionally approximate (city/town/county/state) because the panel
// only needs a friendly location label, not a turn-by-turn navigation address.
async function reverseGeocodePlaceName(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    if (!res.ok) return null;
    const data = await res.json();
    const a = data.address || {};
    return a.city || a.town || a.village || a.municipality || a.county || a.state || null;
  } catch (_) { return null; }
}

// Compress a checkpoint's weather into one readable itinerary line.
function describeRoadTripWeather(cp) {
  if (!cp?.weather) return 'Weather pending';
  const [, desc] = wCodeToEmoji(cp.weather.code);
  return `${Math.round(cp.weather.temp)}°C / feels ${Math.round(cp.weather.feels)}°C · ${desc.toLowerCase()} · wind ${Math.round(cp.weather.wind || 0)} km/h`;
}

// Give each itinerary row a reason for existing.
// This keeps the road-trip output from becoming a plain list of timestamps.
function buildRoadTripRationale(cp, context = {}) {
  if (!cp?.weather) return 'Checkpoint on the loaded route.';
  const feels = firstFinite(cp.weather.feels, cp.weather.temp, 0);
  const precipProb = firstFinite(cp.weather.precipProb, 0);
  const wind = firstFinite(cp.weather.wind, 0);
  if (context.segmentMinutes >= 150) return 'Long segment ahead — a natural fuel, washroom, and stretch stop.';
  if (precipProb >= 55) return 'Wettest stretch nearby — a good place to layer up before getting out again.';
  if (wind >= 35) return 'Wind looks strongest here — worth a quick layer and comfort check.';
  if (feels <= 4) return 'This is one of the colder stops, so keep the warm layer easy to grab.';
  if (context.type === 'finish') return 'Good time to swap into something drier or warmer for after the drive.';
  return 'Useful checkpoint to reassess comfort, layers, and the next segment.';
}

// Find the route point nearest a 0..1 progress fraction.
// Suggested stops use this to place a midpoint on the actual loaded route.
function findNearestRoutePointForFraction(fraction) {
  if (!routeState?.points?.length) return null;
  const targetKm = (routeState.totalKm || 0) * Math.max(0, Math.min(1, fraction));
  let nearest = routeState.points[0];
  let best = Infinity;
  for (const point of routeState.points) {
    const diff = Math.abs((point.kmFromStart || 0) - targetKm);
    if (diff < best) {
      best = diff;
      nearest = point;
    }
  }
  return nearest;
}

// Insert extra break suggestions between generated weather checkpoints.
// Long segments get a midpoint suggestion so the itinerary can recommend
// practical fuel/washroom/stretch stops rather than only weather checkpoints.
async function buildSuggestedRoadTripStops(samples) {
  const suggested = [];
  for (let i = 1; i < samples.length; i++) {
    const prev = samples[i - 1];
    const next = samples[i];
    const prevEta = parseAnyTime(prev.eta);
    const nextEta = parseAnyTime(next.eta);
    const segmentMinutes = Number.isFinite(prevEta) && Number.isFinite(nextEta) ? Math.max(0, Math.round((nextEta - prevEta) / 60000)) : 0;
    const segmentKm = Math.max(0, (next.kmFromStart || 0) - (prev.kmFromStart || 0));
    const needsStop = segmentMinutes >= 150 || segmentKm >= 220;
    if (!needsStop) continue;
    const fraction = (prev.fraction + next.fraction) / 2;
    const point = findNearestRoutePointForFraction(fraction);
    if (!point) continue;
    const place = await reverseGeocodePlaceName(point.lat, point.lon);
    suggested.push({
      type: 'suggested',
      label: 'Suggested stop',
      place: place || `Between ${prev.placeLabel || prev.label} and ${next.placeLabel || next.label}`,
      eta: prev.eta && next.eta ? formatShortDateTime(addMinutesToLocalString(prev.eta, Math.round(segmentMinutes / 2))) : null,
      weather: next.weather ? `Before ${next.label.toLowerCase()}: ${describeRoadTripWeather(next)}` : 'Good midpoint stop for a break.',
      rationale: segmentMinutes >= 180 ? 'Long time in the car — break up the segment before it gets stale.' : 'Useful midpoint to reset before the next longer stretch.',
      fraction,
      kmFromStart: point.kmFromStart || ((prev.kmFromStart + next.kmFromStart) / 2)
    });
  }
  return suggested;
}

/** 
 * Decide how many road-trip stops/checkpoints should be rendered.
 *
 * Short drives stay compact. Longer drives and extra-long / multi-day routes get
 * more visible stops so the itinerary does not throw away useful checkpoints.
 * The cap still prevents a giant route file from creating a wall of timeline rows.
 */
function getMaxRenderedRoadTripStops(stops = []) {
  const durationState = getDurationState(getSelectedEvent());
  const routeMinutes = firstFinite(durationState?.minutes, routeState?.elapsedMinutes, 0);
  const routeKm = firstFinite(routeState?.totalKm, 0);

  let cap = 10;
  if (routeMinutes >= 360 || routeKm >= 300) cap = 14;
  if (routeMinutes >= 600 || routeKm >= 700) cap = 18;
  if (routeMinutes >= 1440 || routeKm >= 1200) cap = 24;

  return Math.min(Math.max(cap, 2), Math.max(2, stops.length));
}

/** 
 * Trim a long itinerary while preserving route context.
 *
 * The previous behaviour sliced the first N stops and then forced Finish into
 * the last slot, which overrepresented the beginning of long routes. This helper
 * always keeps Start + Finish and evenly samples the middle so the displayed
 * route remains representative from end to end.
 */
function trimRoadTripStopsForDisplay(stops, maxRenderedRoadTripStops) {
  if (!Array.isArray(stops) || stops.length <= maxRenderedRoadTripStops) return stops || [];
  if (maxRenderedRoadTripStops <= 2) return [stops[0], stops[stops.length - 1]].filter(Boolean);

  const first = stops[0];
  const last = stops[stops.length - 1];
  const middle = stops.slice(1, -1);
  const middleSlots = maxRenderedRoadTripStops - 2;
  if (middle.length <= middleSlots) return [first, ...middle, last];

  const selected = [];
  const usedIndexes = new Set();
  for (let slot = 0; slot < middleSlots; slot++) {
    const ratio = middleSlots === 1 ? 0.5 : slot / (middleSlots - 1);
    let index = Math.round(ratio * (middle.length - 1));

    // Avoid duplicate rounded indexes on small middle arrays. Walk forward first,
    // then backward, so the final list still stays roughly route-ordered.
    while (usedIndexes.has(index) && index < middle.length - 1) index++;
    while (usedIndexes.has(index) && index > 0) index--;

    usedIndexes.add(index);
    selected.push(middle[index]);
  }

  selected.sort((a, b) => firstFinite(a?.kmFromStart, 0) - firstFinite(b?.kmFromStart, 0));
  return [first, ...selected, last];
}

// Build and render the road-trip timeline after route checkpoint weather is ready.
// This function intentionally runs after the main weather render so it can reuse
// weather-enriched checkpoints instead of fetching a separate itinerary model.
async function triggerRoadTripItinerary() {
  const slot = document.getElementById('itinerary-panel');
  if (!slot || !weatherData) return;

  const samples = (routeState?.samples || []).filter(cp => cp.weather);
  if (!samples.length) {
    slot.innerHTML = `<div class="block-title" style="margin-top:0">Road trip itinerary</div>
      <p style="font-size:0.82rem;color:var(--text-muted);margin-top:8px">Load a GPX or GeoJSON route to build a stop-by-stop itinerary from checkpoint weather.</p>`;
    return;
  }

  slot.innerHTML = `
    <div class="block-title" style="margin-top:0;margin-bottom:12px">Road trip itinerary</div>
    <div class="ai-skeleton">
      <div class="sk" style="width:74%;height:44px;border-radius:10px"></div>
      <div class="sk" style="width:82%;height:44px;border-radius:10px;margin-top:10px"></div>
      <div class="sk" style="width:66%;height:44px;border-radius:10px;margin-top:10px"></div>
    </div>`;

  const named = await Promise.all(samples.map(async cp => ({
    ...cp,
    placeName: cp.placeLabel || await reverseGeocodePlaceName(cp.lat, cp.lon) || cp.label
  })));
  const suggestedStops = await buildSuggestedRoadTripStops(named);

  const stops = [];
  named.forEach((cp, index) => {
    const prev = named[index - 1] || null;
    const betweenStops = suggestedStops.filter(stop => prev && stop.fraction > prev.fraction && stop.fraction < cp.fraction);
    if (!index) {
      stops.push({
        type: 'checkpoint',
        label: 'Start',
        place: cp.placeName,
        eta: cp.eta ? formatShortDateTime(cp.eta) : null,
        weather: describeRoadTripWeather(cp),
        rationale: 'Start in the lightest comfortable setup, but keep the next layer inside the cabin.',
        kmFromStart: cp.kmFromStart || 0
      });
    } else {
      stops.push(...betweenStops);
      stops.push({
        type: 'checkpoint',
        label: index === named.length - 1 ? 'Finish' : cp.label,
        place: cp.placeName,
        eta: cp.eta ? formatShortDateTime(cp.eta) : null,
        weather: describeRoadTripWeather(cp),
        rationale: buildRoadTripRationale(cp, {
          segmentMinutes: prev && prev.eta && cp.eta ? Math.max(0, Math.round((parseAnyTime(cp.eta) - parseAnyTime(prev.eta)) / 60000)) : 0,
          type: index === named.length - 1 ? 'finish' : 'checkpoint'
        }),
        kmFromStart: cp.kmFromStart || 0
      });
    }
  });

  const maxRenderedRoadTripStops = getMaxRenderedRoadTripStops(stops);
  const trimmedStops = trimRoadTripStopsForDisplay(stops, maxRenderedRoadTripStops);
  const trimNote = stops.length > trimmedStops.length
    ? `Showing ${trimmedStops.length} of ${stops.length} generated stops, spaced across the route. Finish is preserved.`
    : `${trimmedStops.length} generated stop${trimmedStops.length === 1 ? '' : 's'} shown.`;

  slot.innerHTML = `
    <div class="block-title" style="margin-top:0;margin-bottom:12px">Road trip itinerary</div>
    <p class="status-line compact" style="margin-top:-4px;margin-bottom:10px">${escapeHtml(trimNote)}</p>
    <div>
      ${trimmedStops.map((stop, i) => {
        const isLast = i === trimmedStops.length - 1;
        const dotClass = stop.type === 'suggested' ? 'suggested' : (isLast ? 'finish' : '');
        const labelClass = stop.type === 'suggested' ? 'suggested' : (isLast ? 'finish' : '');
        return `
          <div class="itinerary-stop">
            <div class="stop-line">
              <div class="stop-dot ${dotClass}"></div>
              ${!isLast ? `<div class="stop-connector"></div>` : ''}
            </div>
            <div class="stop-body">
              <div class="stop-label ${labelClass}">${escapeHtml(stop.label)}${stop.type === 'suggested' ? ' · suggested' : ''}</div>
              <div class="stop-name">${escapeHtml(stop.place || stop.label)}</div>
              <div class="stop-meta">${stop.eta ? `🕒 ${escapeHtml(stop.eta)}` : ''}${isFiniteNumber(stop.kmFromStart) ? ` · ${escapeHtml(formatKmPrefix(stop.kmFromStart))}` : ''}${stop.weather ? ` · ${escapeHtml(stop.weather)}` : ''}</div>
              ${stop.rationale ? `<div class="stop-rationale">${escapeHtml(stop.rationale)}</div>` : ''}
            </div>
          </div>`;
      }).join('')}
    </div>`;
}
window.triggerRoadTripItinerary = triggerRoadTripItinerary;


// Quick-start helper overlay.
// ---------------------------------------------------------------------------
// This is intentionally a lightweight, contextual helper instead of a forced
// onboarding tour. It follows the page order, summarizes what each section does,
// and lets the user jump to the matching card/section. The helper reads the
// current app state so indoor activities, routes, fetched weather, and water
// activities get slightly different notes.
function helperState(label, tone = '') {
  return { label, tone };
}

function getQuickStartStateForLocation() {
  if (isNoLocationIndoorActivity(selectedActivity)) return helperState('optional', 'optional');
  if (weatherData || routeState?.points?.length) return helperState('active', 'done');
  return helperState('start here', '');
}

function getQuickStartSteps() {
  const indoorOnly = isNoLocationIndoorActivity(selectedActivity);
  const waterRelevant = isWaterRelevantActivity(selectedActivity);
  const routeLoaded = !!routeState?.points?.length;
  const locationReady = !!weatherData;
  const activityName = selectedActivity ? (activityLabels[selectedActivity] || selectedActivity) : null;
  const durationState = getDurationState(getSelectedEvent());
  const distanceState = getDistanceState(getSelectedEvent());

  return [
    {
      number: 1,
      target: 'location-card',
      title: 'Location & route',
      body: indoorOnly
        ? 'Optional for indoor guidance. Add a city or route only if you want commute weather, forecast charts, or route checkpoints.'
        : 'Search a city, use current location, or load a GPX/GeoJSON route. Routes can override distance and create weather checkpoints.',
      state: getQuickStartStateForLocation()
    },
    {
      number: 2,
      target: 'activity-section',
      title: 'Activity',
      body: activityName
        ? `Currently set to ${activityName}. This controls presets, gear logic, water-temperature handling, and route/weather priorities.`
        : 'Pick what you are doing. This is the biggest switch in the tool because it changes the recommendation logic.',
      state: selectedActivity ? helperState('selected', 'done') : helperState('required', '')
    },
    {
      number: 3,
      target: 'event-distance-section',
      title: 'Event / distance',
      body: routeLoaded
        ? 'A loaded route is controlling distance, so presets are mainly context. Custom distance is disabled while the route is active.'
        : distanceState?.source === 'custom'
          ? `Using a custom distance: ${distanceState.label}.`
          : 'Choose a preset distance or enter a custom distance. The app can also derive distance from duration + average speed when it makes sense.',
      state: routeLoaded ? helperState('route', 'done') : distanceState?.source === 'custom' ? helperState('custom', 'done') : helperState('preset', 'optional')
    },
    {
      number: 4,
      target: 'duration-section',
      title: 'Planned duration',
      body: routeHasDurationOverride()
        ? 'The uploaded route includes timing, so route time is controlling duration.'
        : durationState?.source === 'custom'
          ? `Using a custom duration: ${durationState.label}.`
          : 'Pick or enter how long you will be out. Duration changes exposure, forecast window, and what extras become worthwhile.',
      state: durationState?.source === 'custom' ? helperState('custom', 'done') : routeHasDurationOverride() ? helperState('route', 'done') : helperState('preset', 'optional')
    },
    {
      number: 5,
      target: 'planned-effort-section',
      title: 'Planned effort',
      body: plannedEffort === 'steady'
        ? 'Optional. Leave it on steady for the normal recommendation, or nudge warmer/lighter based on how hard the outing should feel.'
        : `${getPlannedEffortInfo().label} effort is selected. This changes clothing logic without changing the real weather.`,
      state: plannedEffort === 'steady' ? helperState('steady', 'optional') : helperState('adjusted', 'done')
    },
    {
      number: 6,
      target: 'temperature-preference-section',
      title: 'Temperature preference',
      body: 'Adjust if you usually dress warmer or cooler than the default. This nudges clothing logic; it does not change the real forecast.',
      state: temperaturePreference === 0 ? helperState('normal', 'optional') : helperState('adjusted', 'done')
    },
    {
      number: 7,
      target: 'start-time-section',
      title: 'Start time',
      body: locationReady
        ? 'Use current conditions, pick a later time, or let Best window rank possible start times by weather, daylight, and activity needs.'
        : indoorOnly
          ? 'Mostly optional for indoor-only guidance. Add a location first if you want commute weather or best-window planning.'
          : 'Fetch a location first to unlock later start times and best-window search.',
      state: locationReady ? helperState(startMode === 'best' ? 'best window' : startMode, 'done') : indoorOnly ? helperState('optional', 'optional') : helperState('locked', 'locked')
    },
    {
      number: 8,
      target: 'water-temp-section',
      title: 'Water temperature & override',
      body: waterRelevant
        ? 'Used for open water, outdoor/unheated pools, triathlon, and water sports. The app prefers measured data, then an estimated fallback, then unknown, with manual override available.'
        : 'Only matters for swimming, water sports, triathlon, or unheated outdoor pools. You can usually ignore it for dry-land activities.',
      state: waterRelevant ? helperState('relevant', 'done') : helperState('skip', 'locked')
    },
    {
      number: 9,
      target: 'checkpoint-model-section',
      title: 'Weather checkpoint model',
      body: routeLoaded
        ? 'Controls how route weather checkpoints are placed. Smart mode considers time, terrain, daylight, weather swings, and wind.'
        : 'Only matters when a route is loaded. Without a route, this section can be ignored.',
      state: routeLoaded ? helperState(checkpointModel, 'done') : helperState('route only', 'locked')
    },
    {
      number: 10,
      target: 'result-card',
      title: 'Results',
      body: resultCard?.style.display === 'block'
        ? 'Read the main pick first, then use the checklist sections to fine-tune what you actually bring or wear.'
        : 'Results appear after you select enough context. Indoor-only activities can generate results without a location.',
      state: resultCard?.style.display === 'block' ? helperState('ready', 'done') : helperState('waiting', '')
    }
  ];
}

function renderQuickStartGuide() {
  if (!quickStartSteps) return;
  quickStartSteps.innerHTML = getQuickStartSteps().map(step => `
    <button class="helper-step" type="button" data-helper-target="${escapeHtml(step.target)}">
      <span class="helper-step-num">${step.number}</span>
      <span>
        <span class="helper-step-title">${escapeHtml(step.title)}</span>
        <span class="helper-step-body">${escapeHtml(step.body)}</span>
      </span>
      <span class="helper-step-state ${escapeHtml(step.state.tone)}">${escapeHtml(step.state.label)}</span>
    </button>`).join('');
}

function openQuickStartGuide() {
  if (!quickStartOverlay) return;
  renderQuickStartGuide();
  quickStartOverlay.hidden = false;
  document.body.classList.add('helper-open');
  quickStartCloseBtn?.focus({ preventScroll: true });
}
window.openQuickStartGuide = openQuickStartGuide;

function closeQuickStartGuide() {
  if (!quickStartOverlay) return;
  quickStartOverlay.hidden = true;
  document.body.classList.remove('helper-open');
}
window.closeQuickStartGuide = closeQuickStartGuide;

function jumpToQuickStartTarget(targetId) {
  const target = document.getElementById(targetId);
  closeQuickStartGuide();
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  target.classList.add('helper-highlight');
  window.setTimeout(() => target.classList.remove('helper-highlight'), 1400);
}

quickStartOverlay?.addEventListener('click', event => {
  if (event.target.closest('[data-helper-close]')) {
    closeQuickStartGuide();
    return;
  }
  const step = event.target.closest('[data-helper-target]');
  if (step) jumpToQuickStartTarget(step.dataset.helperTarget);
});

quickStartCloseBtn?.addEventListener('click', closeQuickStartGuide);

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (stravaPickerOverlay && !stravaPickerOverlay.hidden) {
    closeStravaPicker();
    return;
  }
  if (quickStartOverlay && !quickStartOverlay.hidden) closeQuickStartGuide();
});

// Initial UI state and event wiring.
// The app is intentionally dependency-light, so most controls are plain DOM
// elements with direct listeners rather than a framework state store.
setCurrentLocationButtonState(false);
setupActivityGroupToggles();
renderPlannerState();

// The planner card uses a fade-in on page load, while Race day mode uses a
// separate animated party background. Mark the initial entry animation as done
// shortly after load so turning Race day mode off does not replay the fade-in.
window.setTimeout(() => {
  document.getElementById('planner-card')?.classList.add('entry-animation-done');
}, 900);

resultInner.addEventListener('click', event => {
  const resetAllBtn = event.target.closest('[data-reset-all]');
  if (resetAllBtn) {
    resetAllWizard();
    return;
  }
  const resetStepBtn = event.target.closest('[data-reset-step]');
  if (resetStepBtn) {
    resetWizardStep(resetStepBtn.closest('.wizard-step'));
    return;
  }
  const item = event.target.closest('[data-check-item]');
  if (item) {
    item.classList.toggle('done');
    item.setAttribute('aria-pressed', item.classList.contains('done') ? 'true' : 'false');
    const mark = item.querySelector('.mark');
    if (mark) mark.textContent = item.classList.contains('done') ? '✓' : '';
  }
});

resultInner.addEventListener('change', event => {
  if (event.target.matches('input[type="radio"][name^="wizard-step-"]')) {
    syncInteractiveAdvice();
  }
});

Object.assign(window, {
  nearestDurationKey,
  isNoLocationIndoorActivity,
  isCustomMultisportActivity,
  getMultisportDefinitions,
  getSelectedMultisportLegs,
  getSelectedMultisportLegDetails,
  getSelectedMultisportLegLabels,
  getMultisportSummary,
  customMultisportHasLeg,
  customMultisportHasWaterLeg,
  renderCustomMultisportControls,
  toggleCustomMultisportLeg,
  getPoolType,
  isPoolSwimmingActivity,
  isWaterRelevantActivity,
  shouldShowWaterTemperature,
  isWaterExposureActivity,
  isWaterDistanceActivity,
  isPaddleDistanceActivity,
  parsePositiveNumber,
  renderSelectOptions,
  getDistanceUnitOptions,
  getAverageUnitOptions,
  getPreferredAverageUnit,
  getTemperaturePreferenceInfo,
  getTemperaturePreferenceTempOffset,
  updateTemperaturePreferenceUi,
  isEffortRelevantActivity,
  getPlannedEffortInfo,
  getPlannedEffortTempOffset,
  updatePlannedEffortUi,
  selectPlannedEffort,
  renderAverageFieldMeta,
  renderDurationFieldMeta,
  renderCustomControlOptions,
  updateRaceDayModeUi,
  updateManualWeatherToggleUi,
  getCheckpointModelStatusText,
  updateCheckpointModelUi,
  selectCheckpointModel,
  getLocationCardSummaryText,
  updateLocationCardCollapseUi,
  updateRefreshWeatherButtonUi,
  forceRefreshWeather,
  toggleLocationCardCollapse,
  toggleRaceDayMode,
  toggleManualWeatherOverride,
  getVisibleEventPresets,
  formatDistanceLabel,
  formatDurationDisplay,
  formatMinutesShort,
  convertDistanceToKm,
  convertDurationToMinutes,
  getCustomDistanceState,
  parseFlexibleDurationMinutes,
  getCustomDurationMinutes,
  parseFlexiblePace,
  getAverageMetric,
  formatDerivedAverageLabel,
  getDerivedAverageMetric,
  getPresetDistanceKm,
  getBaseDistanceState,
  getDerivedDistanceState,
  getDistanceState,
  getDerivedDurationMinutesFromAverage,
  getDurationState,
  buildDurationProfile,
  getDurationProfile,
  getRouteDistanceLabel,
  getDisplayedDistanceText,
  getDisplayedDurationText,
  getEventPresets,
  getCustomWeatherOverride,
  parsePositiveOrNegativeNumber,
  getWaterModelSettings,
  updateWaterModelStatus,
  mapRange,
  averageNumbers,
  clampEstimate,
  getLatitudeBand,
  getSeasonInfo,
  getWaterBodyConfig,
  getRecentDailyRecordsForWater,
  getRecentHourlyRecordsForWater,
  estimatePseudoWaterTemperature,
  applyPseudoWaterEstimateToData,
  getWaterConfidenceLabel,
  getWaterSignalLevel,
  renderWaterSignal,
  formatWaterTemperatureValue,
  getWaterTemperatureSourceLabel,
  getWaterTemperatureChip,
  renderWaterTemperatureMetaLine,
  renderWaterTempDisclaimer,
  applyCustomWeatherOverrides,
  updateManualWeatherStatus,
  routeHasDurationOverride,
  hasPlannedDurationSelection,
  refreshSelectionNotes,
  getSelectedEvent,
  renderDurationButtons,
  renderEventButtons,
  syncDurationFromEvent,
  updateCustomInputLocks,
  updateCustomStatusTexts,
  renderPlannerState,
  formatKm,
  formatKmPrefix,
  prefersDarkTheme,
  getLeafletTileConfig,
  refreshRouteMapTheme,
  initRouteMap,
  clearRouteMapLayers,
  normalizeRoutePoints,
  parseGeoJsonRouteObject,
  parseXmlRouteDocument,
  parseRouteText,
  parseRouteFile,
  clamp,
  bearingDegrees,
  buildRouteState,
  getRouteTimingMinutes,
  getSegmentTimeFactor,
  buildRouteTimingModel,
  findNearestPointIndexByKm,
  findNearestPointIndexByMinute,
  getRouteBearingAtIndex,
  describeRelativeWind,
  getWeatherVolatilityScore,
  getTerrainVolatilityScore,
  getSmartCheckpointConfig,
  getSolarCheckpointEvents,
  buildCheckpointFromIndex,
  mergeCheckpointCandidate,
  pruneCheckpointCandidates,
  applyBaseCheckpointLabels,
  markSmartWeatherEventCheckpoints,
  sampleRouteCheckpointsOld,
  sampleRouteCheckpointsSmart,
  sampleRouteCheckpoints,
  getRouteSampleCount,
  buildRouteCheckpointMarker,
  renderRouteMap,
  getInterpolatedForecastPointFromHourly,
  summarizeCheckpointWeatherWindow,
  fetchRouteCheckpointForecast,
  refreshRouteWeatherIfPossible,
  handleRouteFileChange,
  clearRoute,
  resetLocationSection,
  clearAllTool,
  currentLocationIconHtml,
  setCurrentLocationButtonState,
  useCurrentLocation,
  countryFlag,
  escapeHtml,
  isFiniteNumber,
  round1,
  showError,
  hideError,
  showResultLoading,
  setLoading,
  distanceKm,
  wCodeToEmoji,
  weatherIconHtml,
  degreesToCompass,
  windDirectionHtml,
  formatWindTooltip,
  buildRouteCheckpointPopupHtml,
  buildRouteWeatherHtml,
  summarizePlannedConditions,
  isOutdoorUvRelevantActivity,
  getUvRiskInfo,
  formatUvValue,
  renderUvBadge,
  renderUvRatingBadge,
  renderUvValueBadge,
  getDailyUvForTime,
  getUvDisplayValue,
  getUvProtectionItem,
  addItemToWizardStep,
  augmentWizardWithUvContext,
  isProbablyCanadaPoint,
  shouldUseEcccAlertsForData,
  pointInRing,
  ecccFeatureContainsPoint,
  isActiveEcccAlertFeature,
  normalizeEcccAlertFeature,
  dedupeAlerts,
  fetchEcccWeatherAlertsForPoint,
  getEcccAlertWarningsForData,
  getEcccAlertWarningsForRoute,
  getUvHazardWarning,
  getRouteUvHazardWarning,
  getForecastHazardWarnings,
  renderGenericWarningList,
  renderWeatherHazardWarnings,
  getRouteCheckpointHazardWarnings,
  renderRouteCheckpointHazardWarnings,
  getEyewearSuggestionItem,
  isWet,
  isSnowy,
  getCyclingEffectiveTemp,
  parseLocalString,
  parseAnyTime,
  reverseGeocodeLabel,
  formatDateTimeLocal,
  buildIndoorFallbackWeatherData,
  roundUpToHour,
  addMinutesToLocalString,
  formatShortDateTime,
  formatShortTime,
  formatWeatherDateTime,
  formatWeekdayTime,
  formatBestWindowSpan,
  getBestWindowTimelineTickMinutes,
  getBestWindowTimelineTickConfig,
  ceilDateToStep,
  formatBestWindowTimelineTickLabel,
  getLaterPickerMinuteIncrement,
  ensureLaterPicker,
  createBestWindowPicker,
  ensureBestWindowPickers,
  setFlatpickrDisabledState,
  normalizeSearchResult,
  dedupeSearchResults,
  searchPlaces,
  getLocationPriorityScore,
  resolvePlaceQuery,
  fetchSuggestions,
  positionSuggestions,
  renderSuggestions,
  hideSuggestions,
  updateFocus,
  pickSuggestion,
  handleBestWindowInputChange,
  handlePlannerOverrideChange,
  clearPlannerCustomFields,
  cssEscapeIdent,
  getActivityGroupForActivity,
  updateActivityGroupVisibility,
  toggleActivityGroup,
  setupActivityGroupToggles,
  resetActivitySection,
  selectActivity,
  selectEventPreset,
  selectDurationKey,
  selectStartMode,
  fetchWeather,
  fetchWeatherFromResult,
  firstFinite,
  sanitizeMarineSource,
  buildMarinePayloadFromOpenMeteo,
  buildMarinePayloadFromEccc,
  buildMarinePayloadFromNdbcStation,
  textHasNoData,
  parseLooseNumber,
  fetchNdbcActiveStations,
  sortStationsByDistance,
  fetchNdbcStationObservation,
  parseEcccMarineHtml,
  fetchEcccMarineFallback,
  fetchNdbcMarineFallback,
  hasUsefulMarineSource,
  getNearestMarinePointFromSeries,
  getBestMarinePoint,
  describeMarineSource,
  fetchMarineDataWithFallback,
  getRouteWeatherExtremes,
  getCampingOvernightSummary,
  getSleepingBagGuidance,
  getSleepingPadGuidance,
  fetchWeatherCore,
  getValidLaterRange,
  configureLaterInput,
  getSelectedStartTime,
  getHourlyPointForStart,
  interpolateNumber,
  getInterpolatedHourlyPoint,
  getFineForecastStepMinutes,
  getForecastSelection,
  formatDateOnlyLocal,
  formatTimeOnlyLocal,
  combineLocalDateAndTime,
  roundUpDateToStep,
  getBestWindowAutoStepMinutes,
  getBestWindowActivityName,
  getBestWindowPresetLabel,
  getBestWindowPrioritySummary,
  getBestWindowDayRange,
  getBestWindowDurationMinutes,
  getBestWindowStepMinutes,
  getBestWindowSearchRange,
  getBestWindowConstraintValues,
  getBestWindowConfigKey,
  getBestWindowComfortBand,
  getBestWindowWeights,
  sum,
  getTimeDomainSummary,
  getWindComponents,
  evaluateBestWindowBaseCandidate,
  getCandidateRouteTimingModel,
  getSmartCheckpointConfigFor,
  getSolarCheckpointEventsForData,
  buildCheckpointFromIndexForStart,
  applyCheckpointLabelsForModel,
  markSmartWeatherEventCheckpointsForModel,
  getRouteSamplesForStart,
  refineBestWindowCandidateWithRoute,
  summarizeRouteCandidateSamples,
  scoreBestWindowCandidate,
  buildBestWindowReasons,
  getBestWindowCondenseMinutes,
  rankBestWindowCluster,
  clusterBestWindowCandidates,
  getBestWindowRankClass,
  getBestWindowRankEmoji,
  getBestWindowRankLabel,
  getBestWindowClusterStartRangeInfo,
  getBestWindowActivityRange,
  bestWindowRangeOverrunMinutes,
  formatBestWindowOverrunWarning,
  makeBestWindowClusterFromCandidate,
  addMinimumBestWindowFallbacks,
  getBestWindowTimelineDayBoundaryTicks,
  getBestWindowTimelineHtml,
  renderBestWindowResults,
  setBestWindowPanelEnabled,
  configureBestWindowUi,
  applyBestWindowResult,
  scheduleBestWindowAnalysis,
  runBestWindowAnalysis,
  getDayRecord,
  describeLight,
  buildForecastChart,
  renderForecastBlock,
  makeChoiceStep,
  makeListStep,
  item,
  option,
  toChecklistTitle,
  buildWizard,
  compactStepTitle,
  buildCompactSummary,
  getClothingExamples,
  renderSteps,
  extractOptionPieces,
  renderChoiceChecklist,
  syncInteractiveAdvice,
  clearDoneItems,
  resetWizardStep,
  resetAllWizard,
  getForecastChartTooltipPortal,
  bindForecastChartTooltips,
  renderIndoorAdviceWithoutLocation,
  refreshIndoorAdviceIfNeeded,
  renderAdvice,
  reverseGeocodePlaceName,
  describeRoadTripWeather,
  buildRoadTripRationale,
  findNearestRoutePointForFraction,
  buildSuggestedRoadTripStops,
  getMaxRenderedRoadTripStops,
  trimRoadTripStopsForDisplay,
  triggerRoadTripItinerary,
  helperState,
  getQuickStartStateForLocation,
  getQuickStartSteps,
  renderQuickStartGuide,
  openQuickStartGuide,
  closeQuickStartGuide,
  jumpToQuickStartTarget,
});


async function importStravaFirstRoute() {
  const routes = await fetchStravaRoutes(STRAVA_BACKEND_URL);
  if (!Array.isArray(routes) || !routes.length) throw new Error('No saved Strava routes found');
  const route = routes[0];
  let importedRoute;
  try {
    const gpxText = await fetchStravaRouteGpx(STRAVA_BACKEND_URL, route.id);
    importedRoute = stravaRouteGpxToImportedRoute(route, gpxText);
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const isMissingExport = /resource not found|strava request failed \(404\)/i.test(message);
    if (!isMissingExport) throw error;
    importedRoute = stravaRouteSummaryToImportedRoute(route);
  }
  routeState = buildRouteState(importedRoute.geometry, importedRoute.name || 'Strava route');
  locationCardCollapsed = true;
  updateLocationCardCollapseUi();
  clearRouteBtn.style.display = 'inline-block';
  renderPlannerState();
  clearRouteMapLayers();
  renderRouteMap();
  routeStatus.textContent = `${importedRoute.name} imported from Strava · ${formatKm(routeState.totalKm)} · ${routeState.points.length} points`;
  if (routeState?.points?.[0]) {
    await fetchWeatherFromResult({ latitude: routeState.points[0].lat, longitude: routeState.points[0].lon, name: importedRoute.name || 'Strava route', admin1: '', country: '', country_code: '' });
  }
}

function renderStravaConnectionState() {
  if (!stravaConnectPanel) return;
  const session = getStravaSession();
  if (!session) {
    stravaConnectPanel.innerHTML = `<button class="btn btn-secondary" type="button" data-action="connectStrava">Connect Strava</button>`;
    if (stravaStatus) stravaStatus.textContent = 'Import a saved route or recent activity.';
    return;
  }
  stravaConnectPanel.innerHTML = `<div class="inline-fields"><button class="btn btn-secondary" type="button" data-action="openStravaPicker">Import first saved route</button><button class="reset-btn clear-btn" type="button" data-action="disconnectStrava">Disconnect</button></div>`;
  if (stravaStatus) stravaStatus.textContent = `Connected: ${session.athleteName}`;
}

function handleConnectStrava() {
  window.location.href = `${STRAVA_BACKEND_URL}/api/strava/auth`;
}

function handleDisconnectStrava() {
  clearStravaSession();
  renderStravaConnectionState();
}

async function handleOpenStravaPicker() {
  if (stravaStatus) stravaStatus.textContent = 'Loading Strava routes…';
  try {
    await importStravaFirstRoute();
    renderStravaConnectionState();
  } catch (error) {
    if (stravaStatus) stravaStatus.textContent = error instanceof Error ? error.message : 'Unable to import Strava route';
  }
}

async function applyImportedStravaRoute(importedRoute, sourceLabel) {
  routeState = buildRouteState(importedRoute.geometry, importedRoute.name || 'Strava route');
  locationCardCollapsed = true;
  updateLocationCardCollapseUi();
  clearRouteBtn.style.display = 'inline-block';
  renderPlannerState();
  clearRouteMapLayers();
  renderRouteMap();
  routeStatus.textContent = `${importedRoute.name} imported from ${sourceLabel} · ${formatKm(routeState.totalKm)} · ${routeState.points.length} points`;
  if (routeState?.points?.[0]) {
    await fetchWeatherFromResult({ latitude: routeState.points[0].lat, longitude: routeState.points[0].lon, name: importedRoute.name || 'Strava route', admin1: '', country: '', country_code: '' });
  }
}

function getStravaPickerItems() {
  return stravaPickerTab === 'activities' ? stravaPickerActivities : stravaPickerRoutes;
}

function getStravaPickerCurrentError() {
  return stravaPickerTab === 'activities' ? stravaPickerActivityError : stravaPickerRouteError;
}

function formatStravaDate(value) {
  if (!value) return '';
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? formatShortDateTime(new Date(parsed).toISOString()) : '';
}

function describeStravaRoute(route) {
  const bits = [];
  if (Number.isFinite(Number(route?.distance)) && Number(route.distance) > 0) bits.push(formatKm(Number(route.distance) / 1000));
  if (Number.isFinite(Number(route?.elevation_gain)) && Number(route.elevation_gain) > 0) bits.push(`+${Math.round(Number(route.elevation_gain))} m`);
  if (Number.isFinite(Number(route?.estimated_moving_time)) && Number(route.estimated_moving_time) > 0) bits.push(`${formatMinutesShort(Math.round(Number(route.estimated_moving_time) / 60))} est.`);
  return bits.join(' · ');
}

function describeStravaActivity(activity) {
  const bits = [];
  const kind = activity?.sport_type || activity?.type;
  if (kind) bits.push(String(kind).replaceAll('_', ' '));
  if (Number.isFinite(Number(activity?.distance)) && Number(activity.distance) > 0) bits.push(formatKm(Number(activity.distance) / 1000));
  if (Number.isFinite(Number(activity?.moving_time)) && Number(activity.moving_time) > 0) bits.push(`${formatMinutesShort(Math.round(Number(activity.moving_time) / 60))} moving`);
  if (Number.isFinite(Number(activity?.total_elevation_gain)) && Number(activity.total_elevation_gain) > 0) bits.push(`+${Math.round(Number(activity.total_elevation_gain))} m`);
  if (activity?.trainer) bits.push('trainer');
  return bits.join(' · ');
}

function renderStravaPicker() {
  if (!stravaPickerTabs || !stravaPickerList || !stravaPickerStatus) return;

  const tabs = [
    { key: 'routes', label: `Routes${stravaPickerRoutes.length ? ` (${stravaPickerRoutes.length})` : ''}` },
    { key: 'activities', label: `Activities${stravaPickerActivities.length ? ` (${stravaPickerActivities.length})` : ''}` },
  ];

  stravaPickerTabs.innerHTML = tabs.map((tab) => `
    <button
      class="strava-picker-tab ${stravaPickerTab === tab.key ? 'active' : ''}"
      type="button"
      role="tab"
      aria-selected="${stravaPickerTab === tab.key ? 'true' : 'false'}"
      data-action="selectStravaTab"
      data-strava-tab="${tab.key}"
    >${escapeHtml(tab.label)}</button>`).join('');

  if (stravaPickerLoading) {
    stravaPickerStatus.textContent = 'Loading Strava items…';
  } else if (stravaPickerImporting) {
    stravaPickerStatus.textContent = stravaPickerTab === 'activities' ? 'Importing Strava activity…' : 'Importing Strava route…';
  } else {
    stravaPickerStatus.textContent = getStravaPickerCurrentError() || (stravaPickerTab === 'activities'
      ? 'Choose a recent activity with GPS data.'
      : 'Choose a saved route to import.');
  }

  const items = getStravaPickerItems();
  if (!items.length) {
    const emptyMessage = getStravaPickerCurrentError()
      ? 'Try reconnecting Strava, then reopen this importer.'
      : (stravaPickerTab === 'activities' ? 'No recent Strava activities were found.' : 'No saved Strava routes were found.');
    stravaPickerList.innerHTML = `<div class="strava-picker-empty">${escapeHtml(emptyMessage)}</div>`;
    return;
  }

  stravaPickerList.innerHTML = items.map((item) => {
    if (stravaPickerTab === 'activities') {
      const subtitle = describeStravaActivity(item);
      const dateLabel = formatStravaDate(item?.start_date_local || item?.start_date);
      return `
        <button class="strava-picker-item" type="button" data-action="importStravaActivity" data-strava-activity-id="${escapeHtml(String(item.id))}">
          <div class="strava-picker-item-head">
            <strong>${escapeHtml(item?.name || 'Strava activity')}</strong>
            <span class="strava-picker-item-kicker">${escapeHtml(item?.sport_type || item?.type || 'Activity')}</span>
          </div>
          <div class="strava-picker-item-sub">${escapeHtml(subtitle || 'Recorded activity')}</div>
          <div class="strava-picker-item-meta">
            <span>${escapeHtml(dateLabel || 'Recent activity')}</span>
            <span>Import activity</span>
          </div>
        </button>`;
    }

    const subtitle = describeStravaRoute(item);
    const dateLabel = formatStravaDate(item?.updated_at);
    return `
      <button class="strava-picker-item" type="button" data-action="importStravaRoute" data-strava-route-id="${escapeHtml(String(item.id))}">
        <div class="strava-picker-item-head">
          <strong>${escapeHtml(item?.name || 'Strava route')}</strong>
          <span class="strava-picker-item-kicker">Route</span>
        </div>
        <div class="strava-picker-item-sub">${escapeHtml(subtitle || 'Saved route')}</div>
        <div class="strava-picker-item-meta">
          <span>${escapeHtml(dateLabel ? `Updated ${dateLabel}` : 'Saved route')}</span>
          <span>Import route</span>
        </div>
      </button>`;
  }).join('');
}

async function ensureStravaPickerTabLoaded(tab) {
  if (tab !== 'routes' && tab !== 'activities') return;
  if (tab === 'routes' && (stravaPickerRoutesLoaded || stravaPickerLoading)) return;
  if (tab === 'activities' && (stravaPickerActivitiesLoaded || stravaPickerLoading)) return;

  stravaPickerLoading = true;
  if (tab === 'routes') stravaPickerRouteError = '';
  else stravaPickerActivityError = '';
  renderStravaPicker();

  try {
    if (tab === 'routes') {
      const routes = await fetchStravaRoutes(STRAVA_BACKEND_URL);
      stravaPickerRoutes = Array.isArray(routes) ? routes : [];
      stravaPickerRoutesLoaded = true;
    } else {
      const activities = await fetchStravaActivities(STRAVA_BACKEND_URL, 1);
      stravaPickerActivities = Array.isArray(activities) ? activities : [];
      stravaPickerActivitiesLoaded = true;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : (tab === 'routes' ? 'Unable to load Strava routes' : 'Unable to load Strava activities');
    if (tab === 'routes') stravaPickerRouteError = message;
    else stravaPickerActivityError = message;
  } finally {
    stravaPickerLoading = false;
    renderStravaPicker();
  }
}

function openStravaPicker() {
  if (!stravaPickerOverlay) return;
  stravaPickerOverlay.hidden = false;
  document.body.classList.add('helper-open');
  renderStravaPicker();
  stravaPickerCloseBtn?.focus({ preventScroll: true });
  void ensureStravaPickerTabLoaded(stravaPickerTab);
}

function closeStravaPicker() {
  if (!stravaPickerOverlay) return;
  stravaPickerOverlay.hidden = true;
  document.body.classList.remove('helper-open');
}

async function importStravaRouteById(routeId) {
  const route = stravaPickerRoutes.find((item) => String(item?.id) === String(routeId));
  if (!route) throw new Error('Selected Strava route was not found.');
  let importedRoute;
  try {
    const gpxText = await fetchStravaRouteGpx(STRAVA_BACKEND_URL, route.id);
    importedRoute = stravaRouteGpxToImportedRoute(route, gpxText);
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const isMissingExport = /resource not found|strava request failed \(404\)/i.test(message);
    if (!isMissingExport) throw error;
    importedRoute = stravaRouteSummaryToImportedRoute(route);
  }
  await applyImportedStravaRoute(importedRoute, 'Strava route');
}

async function importStravaActivityById(activityId) {
  const activity = stravaPickerActivities.find((item) => String(item?.id) === String(activityId));
  if (!activity) throw new Error('Selected Strava activity was not found.');
  const streams = await fetchStravaActivityStreams(STRAVA_BACKEND_URL, activity.id);
  const importedRoute = stravaActivityStreamsToImportedRoute(activity, streams);
  await applyImportedStravaRoute(importedRoute, 'Strava activity');
}

function renderStravaConnectionStateEnhanced() {
  if (!stravaConnectPanel) return;
  const session = getStravaSession();
  if (!session) {
    stravaConnectPanel.innerHTML = `<button class="btn btn-secondary" type="button" data-action="connectStrava">Connect Strava</button>`;
    if (stravaStatus) stravaStatus.textContent = getStravaAuthError() || 'Import a saved route or recent activity.';
    return;
  }
  stravaConnectPanel.innerHTML = `<div class="inline-fields" style="grid-template-columns:minmax(0,1fr)"><button class="btn btn-secondary" type="button" data-action="openStravaPicker">Browse Strava imports</button><button class="reset-btn clear-btn" type="button" data-action="disconnectStrava">Disconnect</button></div>`;
  if (stravaStatus) stravaStatus.textContent = `Connected: ${session.athleteName} · import a route or activity.`;
}

function handleConnectStravaEnhanced() {
  window.location.href = `${STRAVA_BACKEND_URL}/api/strava/auth`;
}

function handleDisconnectStravaEnhanced() {
  clearStravaSession();
  stravaPickerRoutes = [];
  stravaPickerActivities = [];
  stravaPickerRoutesLoaded = false;
  stravaPickerActivitiesLoaded = false;
  stravaPickerRouteError = '';
  stravaPickerActivityError = '';
  closeStravaPicker();
  renderStravaConnectionStateEnhanced();
}

async function handleOpenStravaPickerEnhanced() {
  openStravaPicker();
}

function handleSelectStravaTab(tab) {
  if (tab !== 'routes' && tab !== 'activities') return;
  stravaPickerTab = tab;
  renderStravaPicker();
  void ensureStravaPickerTabLoaded(tab);
}

async function handleImportStravaRoute(routeId) {
  stravaPickerTab = 'routes';
  stravaPickerImporting = true;
  renderStravaPicker();
  try {
    await importStravaRouteById(routeId);
    closeStravaPicker();
    renderStravaConnectionStateEnhanced();
  } catch (error) {
    stravaPickerRouteError = error instanceof Error ? error.message : 'Unable to import Strava route';
  } finally {
    stravaPickerImporting = false;
    renderStravaPicker();
  }
}

async function handleImportStravaActivity(activityId) {
  stravaPickerTab = 'activities';
  stravaPickerImporting = true;
  renderStravaPicker();
  try {
    await importStravaActivityById(activityId);
    closeStravaPicker();
    renderStravaConnectionStateEnhanced();
  } catch (error) {
    stravaPickerActivityError = error instanceof Error ? error.message : 'Unable to import Strava activity';
  } finally {
    stravaPickerImporting = false;
    renderStravaPicker();
  }
}

function bindDomActions() {
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const trigger = event.target.closest('[data-action]');
    if (!trigger) return;

    const action = trigger.dataset.action;
    if (action === 'openQuickStartGuide') openQuickStartGuide();
    else if (action === 'toggleLocationCardCollapse') toggleLocationCardCollapse();
    else if (action === 'togglePlannerCardCollapse') togglePlannerCardCollapse();
    else if (action === 'forceRefreshWeather') forceRefreshWeather();
    else if (action === 'resetLocationSection') resetLocationSection();
    else if (action === 'clearAllTool') clearAllTool();
    else if (action === 'useCurrentLocation') useCurrentLocation();
    else if (action === 'clearRoute') clearRoute();
    else if (action === 'connectStrava') handleConnectStravaEnhanced();
    else if (action === 'disconnectStrava') handleDisconnectStravaEnhanced();
    else if (action === 'openStravaPicker') handleOpenStravaPickerEnhanced();
    else if (action === 'closeStravaPicker') closeStravaPicker();
    else if (action === 'selectStravaTab') handleSelectStravaTab(trigger.dataset.stravaTab);
    else if (action === 'importStravaRoute') handleImportStravaRoute(trigger.dataset.stravaRouteId);
    else if (action === 'importStravaActivity') handleImportStravaActivity(trigger.dataset.stravaActivityId);
    else if (action === 'resetActivitySection') resetActivitySection();
    else if (action === 'toggleRaceDayMode') toggleRaceDayMode();
    else if (action === 'selectActivity') selectActivity(trigger);
    else if (action === 'selectPlannedEffort') selectPlannedEffort(trigger.dataset.plannedEffort);
    else if (action === 'selectStartMode') selectStartMode(trigger);
    else if (action === 'toggleManualWeatherOverride') toggleManualWeatherOverride();
    else if (action === 'selectCheckpointModel') selectCheckpointModel(trigger.dataset.checkpointModel);
    else if (action === 'toggleCustomMultisportLeg') toggleCustomMultisportLeg(trigger.dataset.legKey);
    else if (action === 'selectDurationKey') selectDurationKey(trigger.dataset.durationKey);
    else if (action === 'selectEventPreset') selectEventPreset(trigger.dataset.eventKey);
    else if (action === 'pickSuggestion') pickSuggestion(Number(trigger.dataset.index));
    else if (action === 'applyBestWindowResult') applyBestWindowResult(trigger.dataset.startTime);
  });
}

renderStravaConnectionStateEnhanced();
bindDomActions();
