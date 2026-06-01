// @ts-nocheck
import 'leaflet/dist/leaflet.css';
import 'flatpickr/dist/flatpickr.min.css';
import 'country-flag-icons/3x2/flags.css';
import changelogMarkdown from '../CHANGELOG.md?raw';
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
import {
  averageNumbers as averageNumbersFromWaterEstimator,
  clampEstimate as clampEstimateFromWaterEstimator,
  estimatePseudoWaterTemperature as estimatePseudoWaterTemperatureFromModule,
  getLatitudeBand as getLatitudeBandFromWaterEstimator,
  getRecentDailyRecordsForWater as getRecentDailyRecordsForWaterFromModule,
  getRecentHourlyRecordsForWater as getRecentHourlyRecordsForWaterFromModule,
  getSeasonInfo as getSeasonInfoFromWaterEstimator,
  getWaterBodyConfig as getWaterBodyConfigFromWaterEstimator,
  mapRange as mapRangeFromWaterEstimator,
  WATER_BODY_TYPE_DEFINITIONS,
  WIND_EXPOSURE_DEFINITIONS,
} from './features/weather/waterTemperatureEstimator';
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
import {
  countryFlag as countryFlagFromModule,
  normalizeDisplayText as normalizeDisplayTextFromModule,
  renderLeadingEmojiLabel as renderLeadingEmojiLabelFromModule,
  renderSymbolIconHtml as renderSymbolIconHtmlFromModule,
  replaceActivityEmojiIcons as replaceActivityEmojiIconsFromModule,
  weatherIconHtml as weatherIconHtmlFromModule,
} from './utils/format';
import { fetchAirQuality, matchAqiToHourlyTime } from './features/weather/airQualityClient';
import { getAqiInfo } from './data/aqiScale';
import {
  bindForecastChartTooltips as bindForecastChartTooltipsFromModule,
  buildForecastChart as buildForecastChartFromModule,
  getForecastChartTooltipPortal as getForecastChartTooltipPortalFromModule,
} from './components/ForecastChart';
import { renderForecastBlock as renderForecastBlockFromModule } from './components/ForecastCells';
import {
  getRouteElevationRenderablePoints,
  renderRouteElevationProfile,
  ROUTE_ELEVATION_PROFILE_METRICS,
} from './components/RouteElevationProfile';
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
import { fetchStravaActivities, fetchStravaActivity, fetchStravaActivityStreams, fetchStravaRoute, fetchStravaRouteGpx, fetchStravaRoutes } from './features/strava/stravaClient';
import { stravaActivityStreamsToImportedRoute, stravaRouteGpxToImportedRoute, stravaRouteSummaryToImportedRoute } from './features/strava/stravaRouteAdapter';
import { buildStravaPreviewSvg } from './features/strava/preview';
import type { RoutePoint } from './types/route';

Object.assign(window, { L, flatpickr, JSZip });
registerServiceWorker();
inject();
injectSpeedInsights();
replaceActivityEmojiIconsFromModule();
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
 * See CHANGELOG.md for full version history.
 */
const GEO_API = SHARED_GEO_API;
const NOMINATIM_SEARCH_API = SHARED_NOMINATIM_SEARCH_API;
const WEATHER_API = SHARED_WEATHER_API;
const MARINE_API = SHARED_MARINE_API;
const ECCC_ALERTS_API = SHARED_ECCC_ALERTS_API;
const NOAA_NDBC_ACTIVE_XML = SHARED_NOAA_NDBC_ACTIVE_XML;
const NOAA_NDBC_REALTIME_BASE = SHARED_NOAA_NDBC_REALTIME_BASE;
const ECCC_MARINE_STATIONS = SHARED_ECCC_MARINE_STATIONS;
const APP_VERSION = '12.5.2';
let ndbcActiveStationsCache = null;
const FORECAST_ONLY_DURATION_KEYS = ['h1', 'h3', 'h6', 'h8', 'h12', 'd1'];
const MOBILE_LAYOUT_MAX_WIDTH = 699;
const ENTRY_INTENT_STORAGE_KEY = 'forecast_fit_pending_entry_intent';
const APP_STATE_STORAGE_KEY = 'forecast_fit_app_state_v1';
const APP_STATE_SCHEMA_VERSION = 1;
const APP_STATE_MAX_WEATHER_AGE_MS = 6 * 60 * 60 * 1000;
const APP_STATE_MAX_ROUTE_POINTS = 2500;
const ROUTE_ELEVATION_TOUCH_HOVER_SUPPRESSION_MS = 900;

type EntryIntentKind = 'forecast-only' | 'strava' | 'current-location';
type EntryIntentSource = 'url' | 'resume';

interface EntryIntent {
  kind: EntryIntentKind;
  source: EntryIntentSource;
}

type SharedPlannerState = {
  selectedActivity: string | null;
  selectedEventKey: string | null;
  selectedDuration: string;
  checkpointModel: string;
  startMode: string;
  raceDayMode: boolean;
  manualWeatherPanelOpen: boolean;
  temperaturePreference: number;
  plannedEffort: string;
  forecastOnlyMode: boolean;
  customDistance: string;
  distanceUnit: string;
  customDuration: string;
  durationUnit: string;
  average: string;
  averageUnit: string;
  manualWaterTemp: string;
  waterBodyType: string;
  windExposure: string;
  poolType: string;
  laterInputValue: string;
  raceDayStart: string;
  raceDayEnd: string;
  bestWindowStart: string;
  bestWindowEnd: string;
  bestWindowPriority: string;
  bestWindowStep: string;
  bestWindowMaxPrecip: string;
  bestWindowMaxGust: string;
  bestWindowMinTemp: string;
  bestWindowMaxTemp: string;
  bestWindowMinWater: string;
  bestWindowFinishDaylight: boolean;
  customMultisportSelections: typeof customMultisportSelections;
};

type SharedPlanState = {
  version: number;
  sharedAt: string;
  place: {
    latitude: number;
    longitude: number;
    name: string;
    countryCode?: string;
  } | null;
  planner: SharedPlannerState;
};

type SharedPlanPackage = {
  version: number;
  kind: 'share_package';
  exportedAt: string;
  appVersion: string;
  snapshot: PersistedAppState;
};

type PersistedRouteSnapshot = {
  fileName: string;
  routeSource: any;
  points: RoutePoint[] | null;
  routeDocument: PersistedRouteDocumentSnapshot | null;
};

type PersistedRouteDocumentSnapshot = {
  format: 'gpx' | 'geojson';
  text: string;
  source: 'upload' | 'strava_gpx';
};

type PersistedWeatherSnapshot = {
  data: any;
  savedAt: string;
};

type PersistedAppState = {
  schemaVersion: number;
  appVersion: string;
  savedAt: string;
  inputValue: string;
  selectedActivity: string | null;
  selectedEventKey: string | null;
  selectedDuration: string;
  checkpointModel: string;
  startMode: string;
  raceDayMode: boolean;
  manualWeatherPanelOpen: boolean;
  temperaturePreference: number;
  plannedEffort: string;
  forecastOnlyMode: boolean;
  plannerCardCollapsed: boolean;
  locationCardCollapsed: boolean;
  customDistance: string;
  distanceUnit: string;
  customDuration: string;
  durationUnit: string;
  average: string;
  averageUnit: string;
  manualWaterTemp: string;
  waterBodyType: string;
  windExposure: string;
  poolType: string;
  laterInputValue: string;
  raceDayStart: string;
  raceDayEnd: string;
  bestWindowStart: string;
  bestWindowEnd: string;
  bestWindowPriority: string;
  bestWindowStep: string;
  bestWindowMaxPrecip: string;
  bestWindowMaxGust: string;
  bestWindowMinTemp: string;
  bestWindowMaxTemp: string;
  bestWindowMinWater: string;
  bestWindowFinishDaylight: boolean;
  customMultisportSelections: typeof customMultisportSelections;
  weatherRefreshStatus: typeof weatherRefreshStatus;
  weather: PersistedWeatherSnapshot | null;
  route: PersistedRouteSnapshot | null;
};

type PersistenceMeta = {
  lastSavedAt: string;
  restoredAt: string;
  routePersisted: boolean;
  weatherPersisted: boolean;
  restoredWeatherFromCache: boolean;
  restoredStaleWeatherOffline: boolean;
  restoredRouteFromCache: boolean;
  warningDismissalsSupported: boolean;
  lastSaveError: string;
};

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
let appStateSaveTimer = null;
let persistenceMeta: PersistenceMeta = {
  lastSavedAt: '',
  restoredAt: '',
  routePersisted: false,
  weatherPersisted: false,
  restoredWeatherFromCache: false,
  restoredStaleWeatherOffline: false,
  restoredRouteFromCache: false,
  warningDismissalsSupported: false,
  lastSaveError: ''
};

const input = document.getElementById('location-input');
const fetchBtn = document.getElementById('fetch-btn');
const currentLocationBtn = document.getElementById('current-location-btn');
const refreshWeatherBtn = document.getElementById('refresh-weather-btn');
const resultCard = document.getElementById('result-card');
const resultInner = document.getElementById('result-inner');
const suggestionsPortal = document.getElementById('suggestions-portal');
const laterBox = document.getElementById('later-box');
const laterInput = document.getElementById('later-input');
const raceDayTimingPanel = document.getElementById('race-day-timing-panel');
const raceDayStartInput = document.getElementById('race-day-start-input');
const raceDayEndInput = document.getElementById('race-day-end-input');
const raceDayTimingStatus = document.getElementById('race-day-timing-status');
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
const durationSummary = document.getElementById('duration-summary');
const durationStatus = document.getElementById('duration-status');
const averageInput = document.getElementById('average-input');
const averageUnitSelect = document.getElementById('average-unit-select');
const averageStatus = document.getElementById('average-status');
const averageLabel = document.getElementById('average-label');
const plannerAverageField = averageInput?.closest('div') || averageLabel?.closest('div') || null;
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
const waterModelGuide = document.getElementById('water-model-guide');
const checkpointModelStatus = document.getElementById('checkpoint-model-status');
const routeFileInput = document.getElementById('route-file-input');
const clearRouteBtn = document.getElementById('clear-route-btn');
const routeStatus = document.getElementById('route-status');
const stravaConnectPanel = document.getElementById('strava-connect-panel');
const stravaStatus = document.getElementById('strava-status');
const mapCard = document.getElementById('map-card');
const routeSummary = document.getElementById('route-summary');
const routeElevationProfile = document.getElementById('route-elevation-profile');
const routeOpenSourceBtn = document.getElementById('route-open-source-btn');
const routeDownloadGpxBtn = document.getElementById('route-download-gpx-btn');
const locationCardToggleBtn = document.getElementById('location-card-toggle-btn');
const locationCardBody = document.getElementById('location-card-body');
const locationCardSummary = document.getElementById('location-card-summary');
const locationRouteChoiceGrid = document.querySelector('.location-route-choice-grid');
const plannerCardToggleBtn = document.getElementById('planner-card-toggle-btn');
const plannerCardBody = document.getElementById('planner-card-body');
const plannerCard = document.getElementById('planner-card');
const forecastOnlyBtn = document.getElementById('forecast-only-btn');
const routeFilePanel = document.getElementById('route-file-panel');
const routeChoiceDivider = document.getElementById('route-choice-divider');
const stravaPanel = document.getElementById('strava-panel');
const stravaChoiceDivider = document.getElementById('strava-choice-divider');
const connectivityStatus = document.getElementById('connectivity-status');
const shareStatus = document.getElementById('share-status');
const shareOverlay = document.getElementById('share-overlay');
const shareCloseBtn = document.getElementById('share-close-btn');
const shareErrorMsg = document.getElementById('share-error-msg');
const shareParamsInput = document.getElementById('share-params-input') as HTMLTextAreaElement | null;
const shareImportFileInput = document.getElementById('share-import-file-input') as HTMLInputElement | null;
const quickStartOverlay = document.getElementById('quick-start-overlay');
const quickStartSteps = document.getElementById('quick-start-steps');
const quickStartCloseBtn = document.getElementById('quick-start-close-btn');
const changelogOverlay = document.getElementById('changelog-overlay');
const changelogTocToggleBtn = document.getElementById('changelog-toc-toggle-btn');
const changelogToc = document.getElementById('changelog-toc');
const changelogContent = document.getElementById('changelog-content');
const changelogCloseBtn = document.getElementById('changelog-close-btn');
const footerVersionLink = document.querySelector('.version-link');
const stravaPickerOverlay = document.getElementById('strava-picker-overlay');
const stravaPickerUrlInput = document.getElementById('strava-picker-url-input') as HTMLInputElement | null;
const stravaPickerTabs = document.getElementById('strava-picker-tabs');
const stravaPickerStatus = document.getElementById('strava-picker-status');
const stravaPickerList = document.getElementById('strava-picker-list');
const stravaPickerCloseBtn = document.getElementById('strava-picker-close-btn');
const forecastOnlyConfirmOverlay = document.getElementById('forecast-only-confirm-overlay');
const confirmForecastOnlyBtn = document.getElementById('confirm-forecast-only-btn');
const clearAllOverlay = document.getElementById('clear-all-overlay');
const confirmClearAllBtn = document.getElementById('confirm-clear-all-btn');
const startupSessionOverlay = document.getElementById('startup-session-overlay');
const startupSessionSummary = document.getElementById('startup-session-summary');
const resumeSessionBtn = document.getElementById('resume-session-btn');
const customMultisportSection = document.getElementById('custom-multisport-section');
const customMultisportSummary = document.getElementById('custom-multisport-summary');
const customMultisportStatus = document.getElementById('custom-multisport-status');
const customMultisportLegList = document.getElementById('custom-multisport-leg-list');
const activitySetupColumn = document.getElementById('activity-setup-column');
const plannerParametersColumn = document.getElementById('planner-parameters-column');
const eventDistanceSection = document.getElementById('event-distance-section');
const durationSection = document.getElementById('duration-section');
const plannerSetupGrid = plannerCardBody?.querySelector('.setup-grid') || null;
const plannerDurationCustomGrid = durationSection?.querySelector('.custom-grid') || null;
const comfortAdjustmentsSection = document.getElementById('comfort-adjustments-section');
const plannerWaterSection = document.getElementById('water-temp-section');
const forecastOnlySummaryBanner = document.getElementById('forecast-only-summary-banner');
const forecastOnlySummaryText = document.getElementById('forecast-only-summary-text');
const forecastOnlyEmptyState = document.getElementById('forecast-only-empty-state');

// Custom multisport builder state.
// Triathlon and indoor multisport still keep their fast presets, but these
// selections let the checklist follow the sports/legs the user actually plans.
const customMultisportDefinitions = {
  triathlon: [
    { key: 'swim_open', label: 'Open-water swim', detail: 'Lake, river, ocean, or standard outdoor race swim', water: true, waterTemperatureRelevant: true, outdoors: true },
    { key: 'swim_pool_indoor', label: 'Indoor pool swim', detail: 'Pool swim indoors before heading outside', water: true, indoors: true },
    { key: 'swim_pool_outdoor', label: 'Outdoor pool swim', detail: 'Outdoor pool or lido swim', water: true, outdoors: true },
    { key: 'bike', label: 'Outdoor bike', detail: 'Road or outdoor bike leg', outdoors: true },
    { key: 'indoor_bike', label: 'Indoor bike', detail: 'Trainer, spin bike, or velodrome leg', indoors: true },
    { key: 'run', label: 'Outdoor run', detail: 'Road, track, trail, or race run leg', outdoors: true },
    { key: 'indoor_run', label: 'Indoor run', detail: 'Treadmill or indoor-track run leg', indoors: true },
    { key: 'transition', label: 'Transition', detail: 'T1/T2 practice or transition rehearsal' },
    { key: 'strength', label: 'Strength', detail: 'Gym or activation block', indoors: true }
  ],
  swimrun: [
    { key: 'swim_open', label: 'Open-water swim', detail: 'Lake, river, ocean, or repeated open-water swim segments', water: true, waterTemperatureRelevant: true, outdoors: true },
    { key: 'swim_pool_outdoor', label: 'Outdoor pool swim', detail: 'Outdoor pool or lido swim', water: true, outdoors: true },
    { key: 'run', label: 'Road run', detail: 'Road, path, or shoreline run segment', outdoors: true },
    { key: 'trail_run', label: 'Trail run', detail: 'Trail or rough-terrain run segment', outdoors: true },
    { key: 'transition', label: 'Transition', detail: 'Repeated swim-run changes and small-gear management' }
  ],
  duathlon: [
    { key: 'bike', label: 'Outdoor bike', detail: 'Road or outdoor bike leg', outdoors: true },
    { key: 'indoor_bike', label: 'Indoor bike', detail: 'Trainer, spin bike, or velodrome leg', indoors: true },
    { key: 'run', label: 'Outdoor run', detail: 'Road, track, trail, or race run leg', outdoors: true },
    { key: 'indoor_run', label: 'Indoor run', detail: 'Treadmill or indoor-track run leg', indoors: true },
    { key: 'transition', label: 'Transition', detail: 'Run-bike-run transition practice or race flow' }
  ],
  aquathlon: [
    { key: 'swim_open', label: 'Open-water swim', detail: 'Lake, river, ocean, or standard outdoor race swim', water: true, waterTemperatureRelevant: true, outdoors: true },
    { key: 'swim_pool_indoor', label: 'Indoor pool swim', detail: 'Pool swim indoors before heading outside', water: true, indoors: true },
    { key: 'swim_pool_outdoor', label: 'Outdoor pool swim', detail: 'Outdoor pool or lido swim', water: true, outdoors: true },
    { key: 'run', label: 'Outdoor run', detail: 'Road, track, trail, or race run leg', outdoors: true },
    { key: 'indoor_run', label: 'Indoor run', detail: 'Treadmill or indoor-track run leg', indoors: true },
    { key: 'transition', label: 'Transition', detail: 'Swim-run transition rehearsal' }
  ],
  cross_triathlon: [
    { key: 'swim_open', label: 'Open-water swim', detail: 'Lake, river, or outdoor race swim', water: true, waterTemperatureRelevant: true, outdoors: true },
    { key: 'swim_pool_outdoor', label: 'Outdoor pool swim', detail: 'Outdoor pool or lido swim', water: true, outdoors: true },
    { key: 'mtb', label: 'MTB leg', detail: 'Off-road bike leg', outdoors: true },
    { key: 'trail_run', label: 'Trail run', detail: 'Off-road run leg', outdoors: true },
    { key: 'transition', label: 'Transition', detail: 'Off-road transition practice or race flow' }
  ],
  cross_duathlon: [
    { key: 'mtb', label: 'MTB leg', detail: 'Off-road bike leg', outdoors: true },
    { key: 'trail_run', label: 'Trail run', detail: 'Off-road run leg', outdoors: true },
    { key: 'transition', label: 'Transition', detail: 'Off-road transition practice or race flow' }
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
  triathlon: ['swim_open', 'bike', 'run'],
  swimrun: ['swim_open', 'run'],
  duathlon: ['run', 'bike', 'run'],
  aquathlon: ['swim_open', 'run'],
  cross_triathlon: ['swim_open', 'mtb', 'trail_run'],
  cross_duathlon: ['trail_run', 'mtb'],
  indoor_multisport: ['indoor_bike', 'indoor_run']
};
const customMultisportActivityKeys = Object.keys(customMultisportDefinitions);
let customMultisportSelections = Object.fromEntries(
  customMultisportActivityKeys.map((activity) => [activity, [...(defaultMultisportSelections[activity] || [])]])
);

let routeState = null;
let stravaPickerTab = 'routes';
let stravaPickerLoading = false;
let stravaPickerImporting = false;
let stravaPickerRoutes = [];
let stravaPickerActivities = [];
let stravaPickerRoutesLoaded = false;
let stravaPickerActivitiesLoaded = false;
let stravaPickerRoutesPage = 0;
let stravaPickerActivitiesPage = 0;
let stravaPickerRoutesHasMore = true;
let stravaPickerActivitiesHasMore = true;
let changelogRendered = false;
let changelogTocCollapsed = false;
let changelogSectionsCache = null;
let changelogMilestoneNameByVersion = null;
let stravaPickerRouteError = '';
let stravaPickerActivityError = '';
let routeMap = null;
let routeLayer = null;
let routeMarkersLayer = null;
let routeTileLayer = null;
let routeHoverLayer = null;
let routeMapBounds = null;
let routeFitControlButton = null;
let pendingStartupSnapshot: PersistedAppState | null = null;
let pendingChartSelectedStartTime = null;
let activeRoutePointForecast = null;
let laterPicker = null;
let raceDayStartPicker = null;
let raceDayEndPicker = null;
let bestWindowStartPicker = null;
let bestWindowEndPicker = null;
let locationCardCollapsed = false;
let plannerCardCollapsed = false;
let forecastOnlyMode = false;
let startupEntryIntentApplied = false;
let sharedPlanStateApplied = false;
const plannerSubsectionCollapsed: Record<string, boolean> = {
  duration: false,
  eventDistance: false,
  effort: true,
  temperature: true,
  water: true
};
let waterSectionAutoStateKey = '';
const STRAVA_ROUTE_PAGE_SIZE = 50;
const STRAVA_ACTIVITY_PAGE_SIZE = 25;
let routeDistanceInputSnapshot: null | { value: string; unit: string } = null;
type ForecastOnlyPlannerState = {
  selectedActivity: string | null;
  selectedEventKey: string | null;
  selectedDuration: string;
  startMode: string;
  raceDayMode: boolean;
  plannerCardCollapsed: boolean;
  manualWeatherPanelOpen: boolean;
  temperaturePreference: number;
  plannedEffort: string;
  customDistance: string;
  distanceUnit: string;
  customDuration: string;
  durationUnit: string;
  average: string;
  averageUnit: string;
  raceDayStart: string;
  raceDayEnd: string;
  laterInputValue: string;
  bestWindowStart: string;
  bestWindowEnd: string;
  bestWindowPriority: string;
  bestWindowStep: string;
  bestWindowMaxPrecip: string;
  bestWindowMaxGust: string;
  bestWindowMinTemp: string;
  bestWindowMaxTemp: string;
  bestWindowMinWater: string;
  bestWindowFinishDaylight: boolean;
  bestWindowAnalysis: any;
  bestWindowAnalysisKey: string;
  bestWindowSelectedStart: string | null;
  customMultisportSelections: typeof customMultisportSelections;
};
let bestWindowAnalysis = null;
let bestWindowAnalysisKey = '';
let bestWindowSelectedStart = null;
let bestWindowDebounceTimer = null;
let bestWindowAnalysisToken = 0;
let forecastOnlyPlannerState: ForecastOnlyPlannerState | null = null;
let weatherRefreshStatus = {
  state: 'idle',
  source: '',
  detail: '',
  error: '',
  lastAttemptAt: '',
  lastSuccessAt: ''
};

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
  return !!activity && customMultisportActivityKeys.includes(activity);
}

function getMultisportDefinitions(activity = selectedActivity) {
  return customMultisportDefinitions[activity] || [];
}

function normalizeMultisportSelectionKeys(activity, source = []) {
  const definitions = getMultisportDefinitions(activity);
  const validKeys = new Set(definitions.map(def => def.key));
  const legacyKeyMap = activity === 'triathlon' ? { swim: 'swim_open' } : {};
  const normalized = [];
  const seen = new Set();
  for (const rawKey of Array.isArray(source) ? source : []) {
    const nextKey = legacyKeyMap[rawKey] || rawKey;
    if (!validKeys.has(nextKey) || seen.has(nextKey)) continue;
    seen.add(nextKey);
    normalized.push(nextKey);
  }
  return normalized;
}

function getSelectedMultisportLegs(activity = selectedActivity) {
  if (!isCustomMultisportActivity(activity)) return [];
  const existing = normalizeMultisportSelectionKeys(activity, customMultisportSelections[activity]);
  if (existing.length) {
    customMultisportSelections[activity] = [...existing];
    return existing;
  }
  const fallback = normalizeMultisportSelectionKeys(activity, defaultMultisportSelections[activity] || []);
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
  return getSelectedMultisportLegDetails(activity).some(def => def.water);
}

function customMultisportHasWaterTemperatureLeg(activity = selectedActivity) {
  if (!isCustomMultisportActivity(activity)) return false;
  return getSelectedMultisportLegDetails(activity).some(def => def.waterTemperatureRelevant || (def.water && def.outdoors));
}

function renderCustomMultisportControls() {
  if (!customMultisportSection || !customMultisportLegList) return;
  const visible = isCustomMultisportActivity(selectedActivity);
  customMultisportSection.hidden = !visible;
  if (!visible) return;

  const definitions = getMultisportDefinitions(selectedActivity);
  const selected = new Set(getSelectedMultisportLegs(selectedActivity));
  customMultisportSummary.textContent = getMultisportSummary(selectedActivity);
  customMultisportStatus.textContent = ({
    triathlon: 'Select the legs you actually need, including indoor or outdoor swim, bike, and run blocks. Indoor swim variants hide open-water temperature assumptions; fully indoor sessions still fit better under Indoor multisport.',
    swimrun: 'Select the swim and run blocks you actually plan. This keeps repeated open-water transitions and trail-run variants aligned with the checklist and water guidance.',
    duathlon: 'Select the run and bike blocks you actually plan. Indoor bike or run variants keep the checklist realistic for hybrid sessions.',
    aquathlon: 'Select the swim and run blocks you actually plan. Indoor-pool variants hide open-water assumptions while outdoor swims still keep water guidance visible.',
    cross_triathlon: 'Select the off-road swim, MTB, and trail-run blocks you actually plan so the checklist follows the terrain mix.',
    cross_duathlon: 'Select the trail-run and MTB blocks you actually plan so the checklist follows the off-road session.',
    indoor_multisport: 'Select the indoor blocks you actually plan: pool, bike/velodrome, run, gym, or mobility. This changes the indoor checklist.'
  })[selectedActivity || ''] || 'Choose the sports/legs that are actually part of the session. This influences the checklist and water-temperature relevance.';
  customMultisportLegList.innerHTML = definitions.map(def => `
    <button class="pick-pill ${selected.has(def.key) ? 'active' : ''}" type="button" data-action="toggleCustomMultisportLeg" data-leg-key="${escapeHtml(def.key)}" title="${escapeHtml(def.detail)}">
      ${selected.has(def.key) ? 'âœ“ ' : ''}${escapeHtml(def.label)}
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
  if (isCustomMultisportActivity(activity)) return customMultisportHasWaterTemperatureLeg(activity);
  return activity === 'swimming_open' || isWaterExposureActivity(activity) || ((activity === 'swimming_pool' || activity === 'swimming_pool_outdoor') && getPoolType() !== 'indoor_heated');
}

function shouldShowWaterTemperature(activity = selectedActivity, point = null) {
  // Keep water-temperature fallback/source UI out of non-water activities.
  // A measured or estimated water value can still exist on the weather payload,
  // but it should only surface when the chosen activity actually uses water.
  return isWaterRelevantActivity(activity);
}

function shouldShowWaterTemperatureSignal(point, activity = selectedActivity) {
  if (forecastOnlyMode) {
    return !!point && (isFiniteNumber(point.waterTemp) || ['estimated', 'measured', 'manual', 'unknown'].includes(String(point.waterTempSource || '')));
  }
  return shouldShowWaterTemperature(activity, point);
}

function hasMeasuredMarineWaterData(data = weatherData) {
  if (!data) return false;
  if (isFiniteNumber(data?.current?.measuredWaterTemp)) return true;
  return (data?.hourly || []).some(point => isFiniteNumber(point?.measuredWaterTemp));
}

function updateWaterSectionAutoUi() {
  if (!plannerWaterSection) return;
  plannerWaterSection.hidden = false;
  const shouldAutoManage = forecastOnlyMode || shouldShowWaterTemperature(selectedActivity);
  if (!shouldAutoManage) {
    waterSectionAutoStateKey = 'inactive';
    return;
  }
  const autoKey = [
    selectedActivity || '',
    forecastOnlyMode ? 'forecast-only' : 'planner',
    hasMeasuredMarineWaterData(weatherData) ? 'measured' : 'missing'
  ].join('|');
  if (autoKey === waterSectionAutoStateKey) return;
  plannerSubsectionCollapsed.water = hasMeasuredMarineWaterData(weatherData);
  waterSectionAutoStateKey = autoKey;
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
    '-4': { label: 'Maximum warmth', shortLabel: 'warmth ++++', offset: -7, chip: 'ðŸ§£ max warmth preference' },
    '-3': { label: 'Much warmer', shortLabel: 'warmth +++', offset: -5, chip: 'ðŸ§£ much warmer preference' },
    '-2': { label: 'Warmer', shortLabel: 'warmth ++', offset: -3.5, chip: 'ðŸ§£ warmer preference' },
    '-1': { label: 'Slightly warmer', shortLabel: 'warmth +', offset: -1.75, chip: 'ðŸ§£ slightly warmer preference' },
    '0': { label: 'Normal', shortLabel: 'normal', offset: 0, chip: '' },
    '1': { label: 'Slightly cooler', shortLabel: 'cooler +', offset: 1.75, chip: 'ðŸŒ¬ slightly cooler preference' },
    '2': { label: 'Cooler', shortLabel: 'cooler ++', offset: 3.5, chip: 'ðŸŒ¬ cooler preference' },
    '3': { label: 'Much cooler', shortLabel: 'cooler +++', offset: 5, chip: 'ðŸŒ¬ much cooler preference' },
    '4': { label: 'Maximum cooling', shortLabel: 'cooler ++++', offset: 7, chip: 'ðŸŒ¬ max cooling preference' }
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
      : `${info.label} setting. The kit logic is nudged by about ${Math.abs(info.offset)}Â°C ${info.offset < 0 ? 'colder' : 'warmer'} so the recommendation lands ${info.offset < 0 ? 'more insulated' : 'lighter'}.`;
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
    low: { label: 'Low / standing', shortLabel: 'low effort', offset: -3.5, chip: 'ðŸ§ low-effort warmth' },
    easy: { label: 'Easy', shortLabel: 'easy effort', offset: -1.75, chip: 'ðŸš¶ easy-effort warmth' },
    steady: { label: 'Steady', shortLabel: 'steady', offset: 0, chip: '' },
    hard: { label: 'Hard', shortLabel: 'hard effort', offset: 2.5, chip: 'ðŸ”¥ hard-effort cooling' },
    race: { label: 'Race', shortLabel: 'race effort', offset: 4, chip: 'ðŸ race-effort cooling' }
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
        : `${info.label} setting. The clothing logic is nudged by about ${Math.abs(info.offset)}Â°C ${info.offset < 0 ? 'colder' : 'warmer'} to account for ${info.offset < 0 ? 'lower heat output' : 'higher heat output'}.`;
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

function getPreferredDurationUnit(activity = selectedActivity) {
  return ['running', 'indoor_running', 'trail_running'].includes(activity) ? 'min' : 'h';
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
  if (raceDayTimingPanel) raceDayTimingPanel.hidden = !shouldShowRaceDayTimingPanel();
}

function updateManualWeatherToggleUi() {
  const hideManualOverrideUi = false;
  if (manualWeatherPanel) manualWeatherPanel.hidden = hideManualOverrideUi || !manualWeatherPanelOpen;
  if (manualWeatherToggleBtn) {
    manualWeatherToggleBtn.hidden = hideManualOverrideUi;
    manualWeatherToggleBtn.classList.toggle('active', !!manualWeatherPanelOpen);
    manualWeatherToggleBtn.setAttribute('aria-pressed', manualWeatherPanelOpen ? 'true' : 'false');
    manualWeatherToggleBtn.textContent = manualWeatherPanelOpen ? 'Hide manual override' : 'Show manual override';
  }
}

function getCheckpointModelLabel(mode = checkpointModel) {
  return mode === 'smart' ? 'smart' : 'standard';
}

function getCheckpointModelStatusText() {
  return checkpointModel === 'smart'
    ? 'Smart = time-based, terrain/daylight/weather-aware checkpoints with route-aware wind notes. Standard = evenly spaced by route progress.'
    : 'Standard = evenly spaced route checkpoints by progress. Smart adds time, terrain, daylight, weather events, and route-aware wind notes.';
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

function updateForecastOnlyModeUi() {
  if (forecastOnlyMode && startMode === 'best') startMode = 'now';
  if (forecastOnlyBtn) {
    forecastOnlyBtn.classList.toggle('active', !!forecastOnlyMode);
    forecastOnlyBtn.setAttribute('aria-pressed', forecastOnlyMode ? 'true' : 'false');
    forecastOnlyBtn.textContent = forecastOnlyMode ? 'Exit forecast only' : 'Forecast only';
  }
  const startTimeSection = document.getElementById('start-time-section');
  if (plannerCard) plannerCard.classList.toggle('forecast-only-active', !!forecastOnlyMode);
  if (plannerCardBody) plannerCardBody.classList.toggle('forecast-only-active', !!forecastOnlyMode);
  if (plannerSetupGrid instanceof HTMLElement) plannerSetupGrid.classList.toggle('forecast-only-active', !!forecastOnlyMode);
  if (durationSection) durationSection.classList.toggle('forecast-only-active', !!forecastOnlyMode);
  if (startTimeSection) startTimeSection.classList.toggle('forecast-only-active', !!forecastOnlyMode);
  if (locationRouteChoiceGrid) locationRouteChoiceGrid.classList.toggle('forecast-only-active', !!forecastOnlyMode);
  if (routeFilePanel) routeFilePanel.hidden = !!forecastOnlyMode;
  if (routeChoiceDivider) routeChoiceDivider.hidden = !!forecastOnlyMode;
  if (stravaPanel) stravaPanel.hidden = !!forecastOnlyMode;
  if (stravaChoiceDivider) stravaChoiceDivider.hidden = !!forecastOnlyMode;
  if (activitySetupColumn instanceof HTMLElement) activitySetupColumn.hidden = !!forecastOnlyMode;
  if (eventDistanceSection instanceof HTMLElement) eventDistanceSection.hidden = !!forecastOnlyMode;
  if (plannerDurationCustomGrid instanceof HTMLElement) plannerDurationCustomGrid.hidden = false;
  if (plannerAverageField instanceof HTMLElement) plannerAverageField.hidden = !!forecastOnlyMode;
  if (comfortAdjustmentsSection instanceof HTMLElement) comfortAdjustmentsSection.hidden = !!forecastOnlyMode;
  if (plannerWaterSection) plannerWaterSection.hidden = false;
  const bestModeBtn = document.querySelector('[data-start-mode="best"]');
  if (bestModeBtn instanceof HTMLElement) bestModeBtn.hidden = !!forecastOnlyMode;
  if (forecastOnlySummaryBanner instanceof HTMLElement) forecastOnlySummaryBanner.hidden = !forecastOnlyMode;
  if (forecastOnlySummaryText) forecastOnlySummaryText.textContent = getForecastOnlySummaryText();
  if (forecastOnlyEmptyState instanceof HTMLElement) {
    forecastOnlyEmptyState.hidden = !(forecastOnlyMode && !weatherData);
    forecastOnlyEmptyState.textContent = getForecastOnlyEmptyStateText();
  }
  document.querySelectorAll('.toggle-btn[data-start-mode]').forEach(btn => {
    const active = btn.dataset.startMode === startMode;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
  laterBox?.classList.toggle('visible', startMode === 'later');
  bestWindowBox?.classList.toggle('visible', !forecastOnlyMode && startMode === 'best');
}

var eventDistanceLastRouteLoaded = false;

function captureRouteDistanceInputSnapshot() {
  if (routeDistanceInputSnapshot || routeState?.points?.length) return;
  routeDistanceInputSnapshot = {
    value: customDistanceInput?.value || '',
    unit: distanceUnitSelect?.value || 'km'
  };
}

function restoreRouteDistanceInputSnapshot() {
  if (!routeDistanceInputSnapshot) return;
  if (customDistanceInput) customDistanceInput.value = routeDistanceInputSnapshot.value;
  if (distanceUnitSelect) distanceUnitSelect.value = routeDistanceInputSnapshot.unit || 'km';
  routeDistanceInputSnapshot = null;
}

function updateEventDistancePlacementUi() {
  const routeLoaded = !!routeState?.points?.length;
  if (routeLoaded !== eventDistanceLastRouteLoaded) {
    plannerSubsectionCollapsed.eventDistance = routeLoaded;
    eventDistanceLastRouteLoaded = routeLoaded;
  }

  if (!eventDistanceSection || !durationSection) return;

  if (routeLoaded) {
    if (plannerParametersColumn && eventDistanceSection.parentElement !== plannerParametersColumn) {
      plannerParametersColumn.insertBefore(eventDistanceSection, durationSection);
    }
    return;
  }

  if (!activitySetupColumn) return;
  const insertBeforeNode = customMultisportSection?.nextElementSibling || null;
  if (eventDistanceSection.parentElement !== activitySetupColumn || eventDistanceSection.previousElementSibling !== customMultisportSection) {
    activitySetupColumn.insertBefore(eventDistanceSection, insertBeforeNode);
  }
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
  if (getWeatherDataProvenance(weatherData)?.kind === 'cached') bits.push('cached forecast');
  if (routeState?.points?.length) {
    const routeLabel = routeState?.routeSource?.provider === 'strava' ? 'imported route' : 'local route';
    bits.push(`${routeState.fileName} · ${formatKm(routeState.totalKm)} · ${routeLabel}`);
  }
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
  schedulePersistedAppStateSave();
}

function updateRefreshWeatherButtonUi(isLoading = false) {
  if (!refreshWeatherBtn) return;
  const hasRefreshTarget = !!(weatherData?.latitude && weatherData?.longitude) || !!routeState?.points?.length || !!input?.value?.trim();
  refreshWeatherBtn.disabled = isLoading || !hasRefreshTarget;
  refreshWeatherBtn.textContent = isLoading ? 'Refreshingâ€¦' : 'Refresh weather';
}

async function forceRefreshWeather() {
  hideSuggestions();
  try {
    if (await refreshWeatherForActiveTarget({ source: 'manual', detail: 'Refreshing weatherâ€¦', clearRouteCheckpointCache: true })) return;
  } catch (_) {
    return;
  }
  await fetchWeather();
}
window.forceRefreshWeather = forceRefreshWeather;

async function backToRouteStart() {
  if (!routeState?.points?.length) return;
  activeRoutePointForecast = null;
  pendingChartSelectedStartTime = null;
  await fetchWeatherFromResult({
    latitude: routeState.points[0].lat,
    longitude: routeState.points[0].lon,
    name: 'Route start',
    admin1: '',
    country: '',
    country_code: ''
  });
}

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

var plannerSubsectionToggleDelegationBound = false;

function updatePlannerSubsectionCollapseUi() {
  document.querySelectorAll('[data-planner-subsection]').forEach(section => {
    const key = section.dataset.plannerSubsection;
    const collapsed = !!plannerSubsectionCollapsed[key];
    const body = section.querySelector('[data-planner-subsection-body]');
    const toggle = section.querySelector('[data-planner-subsection-toggle]');
    section.classList.toggle('is-collapsed', collapsed);
    if (body) body.hidden = collapsed;
    if (toggle) {
      const label = section.dataset.plannerSubsectionTitle || toggle.textContent.trim();
      toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      toggle.setAttribute('aria-label', `${collapsed ? 'Expand' : 'Collapse'} ${label}`);
    }
  });
}

function togglePlannerSubsection(section: Element | null) {
  const key = section?.dataset?.plannerSubsection;
  if (!key || !(key in plannerSubsectionCollapsed)) return;
  plannerSubsectionCollapsed[key] = !plannerSubsectionCollapsed[key];
  updatePlannerSubsectionCollapseUi();
}

function isMobilePlannerLayout() {
  return window.matchMedia(`(max-width: ${MOBILE_LAYOUT_MAX_WIDTH}px)`).matches;
}

function isElementVisibleForScrollTarget(element: Element | null) {
  if (!(element instanceof HTMLElement)) return false;
  if (element.hidden) return false;
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && style.visibility !== 'hidden';
}

function scrollPlannerFlowToNextSection(fromKey: keyof typeof plannerSubsectionCollapsed) {
  if (!isMobilePlannerLayout()) return;
  const sections = Array.from(document.querySelectorAll('[data-planner-subsection]'));
  const currentIndex = sections.findIndex(section => section instanceof HTMLElement && section.dataset.plannerSubsection === fromKey);
  if (currentIndex < 0) return;

  let target: HTMLElement | null = null;
  for (const section of sections.slice(currentIndex + 1)) {
    const toggle = section.querySelector('[data-planner-subsection-toggle]');
    if (isElementVisibleForScrollTarget(section) && toggle instanceof HTMLElement && isElementVisibleForScrollTarget(toggle)) {
      target = toggle;
      break;
    }
  }

  if (!target) {
    const startTimeSection = document.getElementById('start-time-section');
    if (startTimeSection && isElementVisibleForScrollTarget(startTimeSection)) {
      const label = startTimeSection.querySelector('label');
      target = label instanceof HTMLElement ? label : startTimeSection;
    }
  }

  if (!target) return;
  const rect = target.getBoundingClientRect();
  if (rect.top >= 0 && rect.top <= 120) return;
  window.requestAnimationFrame(() => {
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function collapsePlannerSubsection(key: keyof typeof plannerSubsectionCollapsed, options: { scrollToNextOnMobile?: boolean } = {}) {
  if (plannerSubsectionCollapsed[key]) return;
  plannerSubsectionCollapsed[key] = true;
  updatePlannerSubsectionCollapseUi();
  if (options.scrollToNextOnMobile) scrollPlannerFlowToNextSection(key);
}

function setupPlannerSubsectionToggles() {
  document.querySelectorAll('[data-planner-subsection-toggle]').forEach(toggle => {
    toggle.setAttribute('role', 'button');
    toggle.setAttribute('tabindex', '0');
  });
  updatePlannerSubsectionCollapseUi();

  if (plannerSubsectionToggleDelegationBound) return;
  plannerSubsectionToggleDelegationBound = true;

  document.addEventListener('click', event => {
    const toggle = event.target.closest?.('[data-planner-subsection-toggle]');
    if (!toggle) return;
    event.preventDefault();
    togglePlannerSubsection(toggle.closest('[data-planner-subsection]'));
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const toggle = event.target.closest?.('[data-planner-subsection-toggle]');
    if (!toggle) return;
    event.preventDefault();
    togglePlannerSubsection(toggle.closest('[data-planner-subsection]'));
  });
}


function toggleRaceDayMode() {
  raceDayMode = !raceDayMode;
  if (!raceDayMode) clearRaceDayTimingFields();
  if (raceDayMode) plannedEffort = 'race';
  else plannedEffort = 'steady';
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

function resetWaterModelInputs() {
  if (waterBodyTypeSelect) waterBodyTypeSelect.value = 'auto';
  if (windExposureSelect) windExposureSelect.value = 'auto';
  if (poolTypeSelect) poolTypeSelect.value = 'indoor_heated';
  handlePlannerOverrideChange();
}
window.resetWaterModelInputs = resetWaterModelInputs;

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

function addMinutesToDate(date, minutes) {
  const d = new Date(date.getTime());
  d.setMinutes(d.getMinutes() + minutes);
  return d;
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
  if (['triathlon', 'swimrun', 'duathlon', 'aquathlon', 'cross_triathlon', 'cross_duathlon', 'indoor_multisport', 'camping', 'walk', 'casual'].includes(selectedActivity)) return null;
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

function shouldShowRaceDayTimingPanel() {
  return !!(raceDayMode && startMode === 'later' && !forecastOnlyMode);
}

function getRaceDayDurationState(eventPreset = getSelectedEvent()) {
  const durationState = getDurationState(eventPreset);
  return durationState && isFiniteNumber(durationState.minutes) && durationState.minutes > 0 ? durationState : null;
}

function getAbsoluteForecastRange(data) {
  const minDate = roundUpToHour(parseLocalString(data.currentTime));
  const lastHourlyPoint = data.hourly[data.hourly.length - 1];
  if (lastHourlyPoint) {
    const maxDate = parseLocalString(lastHourlyPoint.time);
    return { minDate, maxDate: maxDate < minDate ? minDate : maxDate };
  }
  const lastDaily = data.daily[data.daily.length - 1];
  if (lastDaily) {
    const maxDate = parseLocalString(`${lastDaily.date}T23:00`);
    return { minDate, maxDate: maxDate < minDate ? minDate : maxDate };
  }
  return { minDate, maxDate: minDate };
}

function clampDateToRange(date, minDate, maxDate) {
  if (!date) return new Date(minDate.getTime());
  const ms = date.getTime();
  if (ms < minDate.getTime()) return new Date(minDate.getTime());
  if (ms > maxDate.getTime()) return new Date(maxDate.getTime());
  return date;
}

function getRaceDayBufferMinutes(durationMinutes = 0) {
  if (durationMinutes >= 360) return 120;
  if (durationMinutes >= 180) return 90;
  if (durationMinutes >= 90) return 60;
  return 45;
}

function getRaceDayPlanningWindow(data, eventStartTime = null) {
  if (!data) return null;
  const durationState = getRaceDayDurationState();
  if (!durationState) return null;
  const eventStart = parseLocalString(eventStartTime || getSelectedStartTime(data));
  if (!eventStart) return null;
  const eventEnd = addMinutesToDate(eventStart, durationState.minutes);
  const absoluteRange = getAbsoluteForecastRange(data);
  const bufferMinutes = getRaceDayBufferMinutes(durationState.minutes);
  const defaultDayStart = clampDateToRange(addMinutesToDate(eventStart, -bufferMinutes), absoluteRange.minDate, eventStart);
  const defaultDayEnd = clampDateToRange(addMinutesToDate(eventEnd, bufferMinutes), eventEnd, absoluteRange.maxDate);
  const requestedDayStart = clampDateToRange(parseLocalString(raceDayStartInput?.value || '') || defaultDayStart, absoluteRange.minDate, absoluteRange.maxDate);
  const requestedDayEnd = clampDateToRange(parseLocalString(raceDayEndInput?.value || '') || defaultDayEnd, absoluteRange.minDate, absoluteRange.maxDate);
  const validationErrors = [];
  if (requestedDayStart > eventStart) validationErrors.push('Day start must be at or before the event start.');
  if (requestedDayEnd < eventEnd) validationErrors.push('Day end must be at or after the event end.');
  if (requestedDayStart >= requestedDayEnd) validationErrors.push('Day start must be earlier than day end.');
  const isValid = !validationErrors.length;
  const dayStart = isValid ? requestedDayStart : defaultDayStart;
  const dayEnd = isValid ? requestedDayEnd : defaultDayEnd;
  return {
    durationState,
    eventStart,
    eventEnd,
    dayStart,
    dayEnd,
    requestedDayStart,
    requestedDayEnd,
    absoluteRange,
    bufferMinutes,
    isValid,
    validationMessage: validationErrors.join(' '),
    usingFallbackWindow: !isValid,
    warmupMinutes: Math.max(0, Math.round((eventStart.getTime() - dayStart.getTime()) / 60000)),
    cooldownMinutes: Math.max(0, Math.round((dayEnd.getTime() - eventEnd.getTime()) / 60000)),
  };
}

function describeRaceDaySupportConditions(point, phase) {
  if (!point) return phase === 'warmup' ? 'Keep an easy layer for the build-up before the start.' : 'Have a dry layer ready for the finish.';
  const feels = firstFinite(point.feels, point.temp);
  const wet = firstFinite(point.precipProb, 0) >= 35 || firstFinite(point.precip, 0) > 0.1;
  const windy = firstFinite(point.wind, 0) >= 20;
  const bits = [];
  if (isFiniteNumber(feels)) {
    if (feels <= 4) bits.push('it will still feel cold');
    else if (feels >= 18) bits.push('it should stay fairly warm');
  }
  if (wet) bits.push('there is some rain risk');
  if (windy) bits.push('wind could bite while standing around');
  if (!bits.length) return phase === 'warmup' ? 'Keep an easy layer for the build-up before the start.' : 'Have a dry layer ready for the finish.';
  return `${bits.join(', ')}.`;
}

function getRaceDaySupportItems(data, raceDayWindow) {
  if (!raceDayMode || !raceDayWindow || !shouldShowRaceDayTimingPanel()) return [];
  const dayStartStr = formatDateTimeLocal(raceDayWindow.dayStart).slice(0, 16);
  const dayEndStr = formatDateTimeLocal(raceDayWindow.dayEnd).slice(0, 16);
  const warmupPoint = getHourlyPointForStart(data, dayStartStr);
  const cooldownPoint = getHourlyPointForStart(data, dayEndStr);
  const items = [];
  if (raceDayWindow.warmupMinutes > 0) {
    items.push(item(
      `Warm-up layer for ${formatShortTime(dayStartStr)}â€“${formatShortTime(formatDateTimeLocal(raceDayWindow.eventStart).slice(0, 16))}`,
      describeRaceDaySupportConditions(warmupPoint, 'warmup'),
      ['warmup']
    ));
  }
  if (raceDayWindow.cooldownMinutes > 0) {
    items.push(item(
      `Cooldown / finish layer for ${formatShortTime(formatDateTimeLocal(raceDayWindow.eventEnd).slice(0, 16))}â€“${formatShortTime(dayEndStr)}`,
      describeRaceDaySupportConditions(cooldownPoint, 'cooldown'),
      ['cooldown']
    ));
  }
  return items;
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

function getWaterBodyTypeDefinition(type) {
  return WATER_BODY_TYPE_DEFINITIONS.find(entry => entry.key === String(type || 'auto')) || WATER_BODY_TYPE_DEFINITIONS[0];
}

function getWindExposureDefinition(type) {
  return WIND_EXPOSURE_DEFINITIONS.find(entry => entry.key === String(type || 'auto')) || WIND_EXPOSURE_DEFINITIONS[0];
}

function renderWaterModelGuide() {
  if (!waterModelGuide) return;
  const settings = getWaterModelSettings();
  const bodyHtml = WATER_BODY_TYPE_DEFINITIONS.map(entry => `
    <li class="water-model-guide-item ${entry.key === settings.waterBodyType ? 'selected' : ''}">
      <strong>${escapeHtml(entry.label)}</strong> - ${escapeHtml(entry.summary)}
    </li>
  `).join('');
  const windHtml = WIND_EXPOSURE_DEFINITIONS.map(entry => `
    <li class="water-model-guide-item ${entry.key === settings.windExposure ? 'selected' : ''}">
      <strong>${escapeHtml(entry.label)}</strong> - ${escapeHtml(entry.summary)}
    </li>
  `).join('');
  waterModelGuide.innerHTML = `
    <div class="water-model-guide-block">
      <div class="water-model-guide-title">How to choose</div>
      <p class="control-help">Use the closest shoreline and water-body match you actually expect at the venue. When unsure, leave these on auto so the fallback stays conservative.</p>
      <div class="water-model-guide-grid">
        <div>
          <div class="water-model-guide-subtitle">Water body type</div>
          <ul class="water-model-guide-list">${bodyHtml}</ul>
        </div>
        <div>
          <div class="water-model-guide-subtitle">Wind exposure</div>
          <ul class="water-model-guide-list">${windHtml}</ul>
        </div>
      </div>
    </div>
  `;
}

function updateWaterModelStatus() {
  if (!waterModelStatus) return;
  const settings = getWaterModelSettings();
  const body = getWaterBodyTypeDefinition(settings.waterBodyType);
  const wind = getWindExposureDefinition(settings.windExposure);
  const bits = [`water body: ${body.label}`, `wind: ${wind.label}`];
  if (isPoolSwimmingActivity(selectedActivity)) bits.push(`pool: ${String(settings.poolType || '').replace(/_/g, ' ')}`);
  const seasonInfo = getSeasonInfo(weatherData?.currentTime || new Date().toISOString(), weatherData?.latitude);
  if (seasonInfo?.label) bits.push(`season: ${seasonInfo.label}`);
  waterModelStatus.textContent = `Measured marine data stays preferred. If unavailable, Forecast Fit estimates a conservative fallback from recent air temperatures, broad latitude band, season, wind, and ${bits.join(' · ')}.`;
}

function mapRange(value, inMin, inMax, outMin, outMax) {
  return mapRangeFromWaterEstimator(value, inMin, inMax, outMin, outMax);
}

function averageNumbers(values) {
  return averageNumbersFromWaterEstimator(values);
}

function clampEstimate(value, min, max) {
  return clampEstimateFromWaterEstimator(value, min, max);
}

function getLatitudeBand(latitude) {
  return getLatitudeBandFromWaterEstimator(latitude);
}

function getSeasonInfo(dateStr, latitude) {
  return getSeasonInfoFromWaterEstimator(dateStr, latitude);
}

function getWaterBodyConfig(type) {
  return getWaterBodyConfigFromWaterEstimator(type);
}

function getRecentDailyRecordsForWater(data) {
  return getRecentDailyRecordsForWaterFromModule(data);
}

function getRecentHourlyRecordsForWater(data) {
  return getRecentHourlyRecordsForWaterFromModule(data);
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
  return estimatePseudoWaterTemperatureFromModule(data, getWaterModelSettings());
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

function applyDailyWaterSummariesToData(data) {
  if (!data) return data;
  (data.daily || []).forEach(day => {
    const dayHourly = (data.hourly || []).filter(point => String(point?.time || '').startsWith(String(day?.date || '')));
    const waterPoints = dayHourly.filter(point => isFiniteNumber(point?.waterTemp));
    const estimatedLows = dayHourly.map(point => firstFinite(point?.waterTempRangeLow, null)).filter(isFiniteNumber);
    const estimatedHighs = dayHourly.map(point => firstFinite(point?.waterTempRangeHigh, null)).filter(isFiniteNumber);
    const temps = waterPoints.map(point => point.waterTemp);
    day.waterTemp = temps.length ? round1(averageNumbers(temps)) : null;
    day.waterTempMin = temps.length ? round1(Math.min(...temps)) : null;
    day.waterTempMax = temps.length ? round1(Math.max(...temps)) : null;
    day.waterTempSource = mergeWaterSourceLabels(...dayHourly.map(point => point?.waterTempSource));
    day.waterTempConfidence = mergeWaterConfidenceLabels(...dayHourly.map(point => point?.waterTempConfidence));
    day.waterTempRangeLow = estimatedLows.length ? round1(Math.min(...estimatedLows)) : null;
    day.waterTempRangeHigh = estimatedHighs.length ? round1(Math.max(...estimatedHighs)) : null;
    day.waterTempExplanation = dayHourly.find(point => point?.waterTempExplanation)?.waterTempExplanation || '';
  });
  return data;
}

function getWaterConfidenceLabel(confidence) {
  return ({ high: 'high', medium: 'medium', low: 'low', unknown: 'unknown', manual: 'manual' })[confidence] || 'unknown';
}

function getWaterSignalLevel(confidence) {
  return ({ high: 4, medium: 3, low: 2, unknown: 1, manual: 4 })[confidence] || 1;
}

function mergeWaterSourceLabels(...labels) {
  const normalized = labels
    .map(label => String(label || 'unknown'))
    .filter(label => label && label !== 'unknown');
  if (!normalized.length) return 'unknown';
  const unique = [...new Set(normalized)];
  return unique.length === 1 ? unique[0] : 'mixed';
}

function mergeWaterConfidenceLabels(...labels) {
  const normalized = labels
    .map(label => getWaterConfidenceLabel(label))
    .filter(label => label !== 'unknown');
  if (!normalized.length) return 'unknown';
  if (normalized.includes('manual')) return normalized.every(label => label === 'manual') ? 'manual' : 'low';
  if (normalized.includes('low')) return 'low';
  if (normalized.includes('medium')) return 'medium';
  if (normalized.includes('high')) return 'high';
  return 'unknown';
}

function renderWaterSignal(confidence) {
  const safe = getWaterConfidenceLabel(confidence);
  const level = getWaterSignalLevel(safe);
  return `<span class="water-signal ${escapeHtml(safe)}" title="${escapeHtml(`Water temperature confidence: ${safe}`)}" aria-label="Water temperature confidence: ${escapeHtml(safe)}">${[1,2,3,4].map(i => `<span class="bar ${i <= level ? 'fill' : ''}"></span>`).join('')}</span>`;
}

function formatWaterTemperatureValue(point) {
  if (!point || !isFiniteNumber(point.waterTemp)) return 'unknown';
  if (point.waterTempSource === 'estimated' && isFiniteNumber(point.waterTempRangeLow) && isFiniteNumber(point.waterTempRangeHigh)) {
    return `~${round1(point.waterTempRangeLow)}â€“${round1(point.waterTempRangeHigh)}Â°C`;
  }
  return `${round1(point.waterTemp)}Â°C`;
}

function getWaterTemperatureSourceLabel(point, data = weatherData) {
  if (point?.waterTempSource === 'manual') return 'manual';
  if (point?.waterTempSource === 'estimated') return `estimated fallback · ${getWaterConfidenceLabel(point.waterTempConfidence)}`;
  if (point?.waterTempSource === 'measured') return data?.marineSource || 'measured water data';
  if (point?.waterTempSource === 'mixed') return `mixed water sources - ${getWaterConfidenceLabel(point.waterTempConfidence)}`;
  return 'water temp unknown';
}

function getWaterTemperatureChip(point, data = weatherData) {
  if (!point || !isFiniteNumber(point.waterTemp)) return { label: 'ðŸŒŠ water unknown', tone: 'warn' };
  const confidence = getWaterConfidenceLabel(point.waterTempConfidence || point.waterTempSource);
  const source = getWaterTemperatureSourceLabel(point, data);
  const tempLabel = formatWaterTemperatureValue(point);
  return { label: `ðŸŒŠ water ${tempLabel} · ${source}`, tone: point.waterTemp < 14 || confidence === 'unknown' ? 'warn' : (confidence === 'high' ? 'ok' : '') };
}

function renderWaterTemperatureMetaLine(point, data = weatherData) {
  if (!point || !shouldShowWaterTemperatureSignal(point, selectedActivity)) return '';
  if (!isFiniteNumber(point.waterTemp)) {
    return `ðŸŒŠ Water <strong>unknown</strong> ${renderWaterSignal('unknown')} <span class="water-source-label">unknown</span>`;
  }
  const confidence = getWaterConfidenceLabel(point.waterTempConfidence || point.waterTempSource);
  const source = getWaterTemperatureSourceLabel(point, data);
  return `ðŸŒŠ Water <strong>${escapeHtml(formatWaterTemperatureValue(point))}</strong> ${renderWaterSignal(confidence)} <span class="water-source-label">${escapeHtml(source)}</span>`;
}

function renderWaterTempDisclaimer(point) {
  if (!point || !shouldShowWaterTemperatureSignal(point, selectedActivity) || !['estimated', 'manual'].includes(point.waterTempSource)) return '';
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
  manualWeatherStatus.innerHTML = `Manual water override active: ${round1(override.waterTemp)}Â°C. The result will be labelled as manual. Quick lookup:${seaTempLookup}`;
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

function getSelectedDurationPreset() {
  return selectedDuration && durationProfiles[selectedDuration] ? durationProfiles[selectedDuration] : null;
}

function refreshSelectionNotes() {
  updateCustomStatusTexts();
}

function getSelectedEvent() {
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
  const activeKey = locked ? (routeState.derivedDurationKey || selectedDuration) : (selectedDuration || null);
  const durationKeys = forecastOnlyMode ? FORECAST_ONLY_DURATION_KEYS : durationOrder;
  el.classList.toggle('forecast-only-active', !!forecastOnlyMode);
  if (forecastOnlyMode) {
    el.innerHTML = durationKeys.map(key => {
      const p = durationProfiles[key];
      return `<button class="duration-btn forecast-only-compact ${activeKey === key ? 'active' : ''} ${locked ? 'locked' : ''}" type="button" ${locked ? 'disabled' : ''} data-action="selectDurationKey" data-duration-key="${escapeHtml(key)}"><div class="label">${escapeHtml(p.label)}</div></button>`;
    }).join('');
    return;
  }
  el.innerHTML = durationKeys.map(key => {
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
    <button class="event-btn ${!customDistanceActive && selected?.key === p.key ? 'active' : ''} ${distanceLocked ? 'locked' : ''}" type="button" ${distanceLocked ? 'disabled' : ''} data-action="selectEventPreset" data-event-key="${escapeHtml(p.key)}">
      <div class="label">${escapeHtml(p.label)}</div>
      <div class="sublabel">${escapeHtml(p.sublabel)}</div>
    </button>`).join('');
  if (distanceLocked) {
    summary.textContent = `Route distance in use: ${getDisplayedDistanceText(selected)}.`;
  } else {
    const distanceState = getDistanceState(selected);
    const sourceText = distanceState.source === 'custom' ? 'custom distance' : distanceState.source === 'derived' ? 'estimated from duration + average' : selected.detail;
    const summaryLead = raceDayMode && getRaceDayEventPreset() ? `Race day mode · ${selected.label}` : selected.label;
    summary.textContent = distanceState.source === 'custom'
      ? `Custom distance · ${distanceState.label}`
      : `${selected.label} · ${distanceState.label}${sourceText ? ` â€” ${sourceText}` : ''}`;
  }
  if (!distanceLocked && raceDayMode && getRaceDayEventPreset()) {
    const distanceState = getDistanceState(selected);
    const sourceText = distanceState.source === 'custom' ? 'custom distance' : distanceState.source === 'derived' ? 'estimated from duration + average' : selected.detail;
    summary.textContent = distanceState.source === 'custom'
      ? `Custom distance · ${distanceState.label}`
      : `Race day mode · ${selected.label} · ${distanceState.label}${sourceText ? ` â€” ${sourceText}` : ''}`;
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
  if (distanceLocked) {
    if (distanceUnitSelect) distanceUnitSelect.value = 'km';
    if (customDistanceInput) customDistanceInput.value = isFiniteNumber(routeState?.totalKm) ? String(round1(routeState.totalKm)) : '';
  }
  customDistanceInput.disabled = distanceLocked;
  distanceUnitSelect.disabled = distanceLocked;
  const durationLocked = routeHasDurationOverride();
  customDurationInput.disabled = durationLocked;
  durationUnitSelect.disabled = durationLocked;
}

function getValueProvenanceLabel(source) {
  switch (source) {
    case 'route':
      return 'imported route';
    case 'custom':
      return 'manual';
    case 'derived':
      return 'derived';
    case 'preset':
      return 'preset';
    case 'none':
      return 'none';
    default:
      return source ? String(source) : 'unknown';
  }
}

// Keep the status copy below custom distance/duration/average inputs in sync.
// Any two of distance, duration, and average can derive the third for activities
// where that calculation makes sense.
function updateCustomStatusTexts() {
  const eventPreset = getSelectedEvent();
  const distanceState = getDistanceState(eventPreset);
  const durationState = getDurationState(eventPreset);
  const presetDuration = getSelectedDurationPreset();
  const avg = getAverageMetric();
  const derivedAvg = getDerivedAverageMetric(eventPreset);
  const rawDuration = String(customDurationInput?.value || '').trim();
  const parsedCustomDuration = rawDuration ? getCustomDurationMinutes() : null;
  const hasCustomDistance = !!getCustomDistanceState();
  const hasCustomDuration = isFiniteNumber(parsedCustomDuration);
  const hasCustomAverage = !!String(averageInput?.value || '').trim();

  distanceStatus.textContent = routeState?.points?.length
    ? `Route distance is active: ${distanceState.label}. Provenance: ${getValueProvenanceLabel(distanceState.source)}.`
    : distanceState.source === 'custom'
      ? `Using custom distance: ${distanceState.label}. Provenance: manual.`
      : distanceState.source === 'derived'
        ? `Calculated distance from custom duration + average: ${distanceState.label}. Provenance: derived.`
        : 'Preset distance is used. Provenance: preset.';

  if (durationSummary) {
    durationSummary.textContent = durationState.source === 'route'
      ? `Planned preset: ${presetDuration?.label || 'None'}. Route time active: ${durationState.label}.`
      : durationState.source === 'custom'
        ? `Planned preset: ${presetDuration?.label || 'None'}. Custom override: ${durationState.label}.`
        : durationState.source === 'derived'
          ? `Planned preset: ${presetDuration?.label || 'None'}. Calculated active duration: ${durationState.label}.`
          : `Planned preset: ${presetDuration?.label || 'None'}.`;
  }

  durationStatus.textContent = durationState.source === 'route'
    ? `Planned preset is ${presetDuration?.label || 'none'}. Route timing is active: ${durationState.label}. Provenance: imported route.`
    : durationState.source === 'custom'
      ? `Planned preset is ${presetDuration?.label || 'none'}. Custom duration is active: ${durationState.label}. Provenance: manual.`
      : durationState.source === 'derived'
        ? `Planned preset is ${presetDuration?.label || 'none'}. ${hasCustomDistance && hasCustomAverage ? 'Calculated' : 'Estimated'} duration from ${hasCustomDistance && hasCustomAverage ? 'custom distance + average' : 'distance + average'}: ${durationState.label}. Provenance: derived.`
        : `Using planned preset: ${presetDuration?.label || 'none'}. Provenance: preset.`;

  averageStatus.textContent = !hasCustomAverage
    ? (derivedAvg?.label
        ? `Calculated average from ${derivedAvg.source}: ${derivedAvg.label}. Provenance: derived.`
        : 'Optional. Any two custom fields can calculate the third when it makes sense.')
    : !avg?.valid
      ? 'Try a valid value for the selected unit.'
      : avg.canDerive
        ? `Using ${avg.label}${durationState.source === 'derived' || distanceState.source === 'derived' ? ' to calculate the missing side.' : ' as an optional planning aid.'} Provenance: manual.`
        : `${avg.label} is shown as an info tag only for this activity. Provenance: manual.`;
}

function renderPlannerState() {
  updateEventDistancePlacementUi();
  renderCustomControlOptions();
  updateCustomInputLocks();
  renderEventButtons();
  renderDurationButtons();
  updateCustomStatusTexts();
  updateWaterModelStatus();
  renderWaterModelGuide();
  updateWaterSectionAutoUi();
  updateCheckpointModelUi();
  updateTemperaturePreferenceUi();
  updatePlannedEffortUi();
  if (weatherData) syncRaceDayTimingInputs(weatherData);
  else if (raceDayTimingPanel) raceDayTimingPanel.hidden = !shouldShowRaceDayTimingPanel();
  renderCustomMultisportControls();
  updateActivityGroupVisibility();
  updatePlannerSubsectionCollapseUi();
  updateForecastOnlyModeUi();
  schedulePersistedAppStateSave();
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
  routeHoverLayer = L.layerGroup().addTo(routeMap);
  const FitRouteControl = L.Control.extend({
    options: { position: 'topleft' },
    onAdd() {
      const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control route-fit-control');
      const button = L.DomUtil.create('button', 'route-fit-control-btn', container);
      button.type = 'button';
      button.innerHTML = '<svg class="route-fit-control-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      button.setAttribute('aria-label', 'Fit map to route');
      button.title = 'Fit map to route';
      routeFitControlButton = button;
      L.DomEvent.disableClickPropagation(container);
      L.DomEvent.on(button, 'click', (event) => {
        L.DomEvent.stop(event);
        fitRouteMapToBounds();
      });
      updateRouteFitControlUi();
      return container;
    }
  });
  new FitRouteControl().addTo(routeMap);
  if (window.matchMedia) {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => refreshRouteMapTheme();
    if (typeof media.addEventListener === 'function') media.addEventListener('change', handler);
    else if (typeof media.addListener === 'function') media.addListener(handler);
  }
}

function updateRouteFitControlUi() {
  if (!routeFitControlButton) return;
  const disabled = !routeMapBounds;
  routeFitControlButton.disabled = disabled;
  routeFitControlButton.setAttribute('aria-disabled', disabled ? 'true' : 'false');
  routeFitControlButton.title = disabled ? 'Load a route to fit the map' : 'Fit map to route';
}

function fitRouteMapToBounds() {
  if (!routeMap || !routeMapBounds) return;
  routeMap.fitBounds(routeMapBounds, { padding: [24, 24] });
  setTimeout(() => routeMap.invalidateSize(), 0);
}

function clearRouteMapLayers() {
  if (routeLayer) routeLayer.clearLayers();
  if (routeMarkersLayer) routeMarkersLayer.clearLayers();
  if (routeHoverLayer) routeHoverLayer.clearLayers();
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

function buildImportedRouteSourceMeta(importedRoute, sourceLabel) {
  if (!importedRoute) return null;
  const normalizedSourceLabel = String(sourceLabel || '').toLowerCase();
  const providerRouteId = importedRoute.providerRouteId ? String(importedRoute.providerRouteId) : '';
  const kind = normalizedSourceLabel.includes('activity') ? 'activity' : 'route';
  const fallbackSourceUrl = importedRoute.provider === 'strava' && providerRouteId
    ? `https://www.strava.com/${kind === 'activity' ? 'activities' : 'routes'}/${encodeURIComponent(providerRouteId)}`
    : '';
  return {
    provider: importedRoute.provider || 'manual',
    kind,
    providerRouteId,
    sourceUrl: importedRoute.sourceUrl || fallbackSourceUrl,
    elevationGainMeters: Number(importedRoute.elevationGainMeters) || 0,
    estimatedMovingTimeSeconds: Number(importedRoute.estimatedMovingTimeSeconds) || 0,
    canDownloadGpx: importedRoute.provider === 'strava' && normalizedSourceLabel.includes('route') && !!importedRoute.providerRouteId,
  };
}

function detectPersistedRouteDocumentFormat(name, text) {
  const lower = String(name || '').toLowerCase();
  const trimmed = String(text || '').trim();
  if (!trimmed) return null;
  const looksLikeXml = trimmed.startsWith('<?xml') || trimmed.startsWith('<');
  const looksLikeJson = trimmed.startsWith('{') || trimmed.startsWith('[');
  if (lower.endsWith('.gpx') || (looksLikeXml && !lower.endsWith('.geojson'))) return 'gpx';
  if (lower.endsWith('.geojson') || looksLikeJson) return 'geojson';
  return null;
}

function buildPersistedRouteDocumentSnapshot(name, text, source = 'upload') {
  const format = detectPersistedRouteDocumentFormat(name, text);
  const trimmed = String(text || '').trim();
  if (!format || !trimmed) return null;
  return {
    format,
    text: trimmed,
    source
  };
}

function normalizePersistedRouteDocument(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') return null;
  const format = snapshot.format === 'gpx' || snapshot.format === 'geojson' ? snapshot.format : null;
  const source = snapshot.source === 'strava_gpx' ? 'strava_gpx' : 'upload';
  const text = typeof snapshot.text === 'string' ? snapshot.text.trim() : '';
  if (!format || !text) return null;
  return {
    format,
    text,
    source
  };
}

function parseVersionSegments(value) {
  const match = String(value || '').trim().match(/\d+(?:\.\d+)*/);
  if (!match) return [];
  return match[0].split('.').map((part) => Number(part)).filter((part) => Number.isFinite(part));
}

function getAppStateVersionFamily(value = APP_VERSION) {
  const segments = parseVersionSegments(value);
  if (!segments.length) return '';
  const major = segments[0];
  const minor = segments.length >= 2 ? segments[1] : 0;
  return `${major}.${minor}`;
}

function isPersistedAppStateVersionCompatible(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') return false;
  return getAppStateVersionFamily(snapshot.appVersion) === getAppStateVersionFamily(APP_VERSION);
}

function buildRouteStateWithSource(points, fileName, routeSource = null, routeDocument = null) {
  const nextState = buildRouteState(points, fileName);
  nextState.routeSource = routeSource;
  nextState.routeDocument = routeDocument;
  if ((!nextState.hasElevation || nextState.totalGain <= 0) && Number(routeSource?.elevationGainMeters) > 0) {
    nextState.totalGain = Number(routeSource.elevationGainMeters);
  }
  return nextState;
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
  if (!isFiniteNumber(travelBearing) || !isFiniteNumber(windDir)) return { label: 'wind relative to route unavailable', short: 'route wind â€”', tone: '' };
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
    : (['triathlon', 'swimrun', 'duathlon', 'aquathlon', 'cross_triathlon', 'cross_duathlon'].includes(selectedActivity) ? 22 : 28));
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
    ele: firstFinite(p.ele, null),
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
      cp.markerShort = 'â†‘';
      cp.markerKind = 'event';
      return;
    }
    if (checkpointModel === 'smart' && cp.reasons.includes('sunset')) {
      cp.label = 'Sunset';
      cp.markerShort = 'â†“';
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

function getCheckpointFeelsMin(cp) {
  return firstFinite(cp?.windowWeather?.feelsMin, cp?.weather?.feels, cp?.weather?.temp, null);
}

function getCheckpointFeelsMax(cp) {
  return firstFinite(cp?.windowWeather?.feelsMax, cp?.weather?.feels, cp?.weather?.temp, null);
}

function getCheckpointMaxWind(cp) {
  return firstFinite(cp?.windowWeather?.maxWind, cp?.weather?.wind, 0);
}

function getCheckpointWetScore(cp) {
  return Math.max(firstFinite(cp?.windowWeather?.maxPrecipProb, cp?.weather?.precipProb, 0), firstFinite(cp?.windowWeather?.maxPrecip, cp?.weather?.precip, 0) * 100);
}

function getCheckpointMaxUv(cp) {
  return firstFinite(cp?.windowWeather?.maxUv, cp?.weather?.uv, 0);
}

function getCheckpointMaxAqi(cp) {
  return firstFinite(cp?.windowWeather?.maxAqi, cp?.weather?.aqi, null);
}

function getCheckpointElevation(cp) {
  return firstFinite(cp?.ele, routeState?.points?.[cp?.pointIndex]?.ele, null);
}

function getVisibilityPenalty(cp) {
  const code = Number(firstFinite(cp?.weather?.code, -1));
  if ([45, 48].includes(code)) return 5;
  if ([95, 96, 99].includes(code)) return 4;
  if ([75, 77, 82, 86].includes(code)) return 3.5;
  if ([65, 67, 73, 81, 85].includes(code)) return 3;
  if ([55, 57, 63, 66].includes(code)) return 2;
  if ([51, 53, 56, 61, 71, 80].includes(code)) return 1;
  return 0;
}

function hasLowVisibilityConditions(cp) {
  return getVisibilityPenalty(cp) >= 3;
}

function addCheckpointReason(cp, kind, label) {
  if (!cp.reasons.includes(kind)) cp.reasons.push(kind);
  if (!cp.reasonLabels.includes(label)) cp.reasonLabels.push(label);
}

function decorateSmartCheckpointMarkers(samples) {
  (samples || []).forEach(cp => {
    if (cp.reasons.includes('start')) {
      cp.markerTone = 'start';
    } else if (cp.reasons.includes('finish')) {
      cp.markerTone = 'finish';
    } else if (cp.reasons.includes('sunrise')) {
      cp.label = 'Sunrise';
      cp.markerShort = 'ðŸŒ…';
      cp.markerKind = 'event';
      cp.markerTone = 'sunrise';
    } else if (cp.reasons.includes('sunset')) {
      cp.label = 'Sunset';
      cp.markerShort = 'ðŸŒ‡';
      cp.markerKind = 'event';
      cp.markerTone = 'sunset';
    } else if (cp.reasons.includes('pooraqi')) {
      cp.label = 'Poor AQI';
      cp.markerShort = 'ðŸ˜·';
      cp.markerKind = 'event';
      cp.markerTone = 'aqi';
    } else if (cp.reasons.includes('lowvis')) {
      cp.label = 'Low visibility';
      cp.markerShort = 'ðŸŒ«ï¸';
      cp.markerKind = 'event';
      cp.markerTone = 'lowvis';
    } else if (cp.reasons.includes('wettest')) {
      cp.label = 'Rain risk';
      cp.markerShort = 'â˜”';
      cp.markerKind = 'event';
      cp.markerTone = 'wet';
    } else if (cp.reasons.includes('uvpeak')) {
      cp.label = 'Peak UV';
      cp.markerShort = 'â˜€ï¸';
      cp.markerKind = 'event';
      cp.markerTone = 'uv';
    } else if (cp.reasons.includes('peakwind')) {
      cp.label = 'Peak wind';
      cp.markerShort = 'ðŸ’¨';
      cp.markerKind = 'event';
      cp.markerTone = 'wind';
    } else if (cp.reasons.includes('coldest')) {
      cp.label = 'Coldest';
      cp.markerShort = 'ðŸ¥¶';
      cp.markerKind = 'event';
      cp.markerTone = 'cold';
    } else if (cp.reasons.includes('hottest')) {
      cp.label = 'Hottest';
      cp.markerShort = 'ðŸ¥µ';
      cp.markerKind = 'event';
      cp.markerTone = 'hot';
    } else if (cp.reasons.includes('highpoint')) {
      cp.label = 'High point';
      cp.markerShort = 'â›°ï¸';
      cp.markerKind = 'event';
      cp.markerTone = 'high';
    } else if (cp.reasons.includes('lowpoint')) {
      cp.label = 'Low point';
      cp.markerShort = 'ðŸ•³ï¸';
      cp.markerKind = 'event';
      cp.markerTone = 'low';
    } else {
      cp.markerTone = cp.markerKind || 'mid';
    }
  });
  return samples;
}

function applySmartEventLabels(samples, modelName) {
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
      cp.markerShort = 'â†‘';
      cp.markerKind = 'event';
    } else if (cp.reasons.includes('sunset')) {
      cp.label = 'Sunset';
      cp.markerShort = 'â†“';
      cp.markerKind = 'event';
    } else if (cp.reasons.includes('lowvis')) {
      cp.label = 'Low visibility';
      cp.markerShort = 'Fg';
      cp.markerKind = 'event';
    } else if (cp.reasons.includes('wettest')) {
      cp.label = 'Rain risk';
      cp.markerShort = 'â˜”';
      cp.markerKind = 'event';
    } else if (cp.reasons.includes('uvpeak')) {
      cp.label = 'Peak UV';
      cp.markerShort = 'â˜€';
      cp.markerKind = 'event';
    } else if (cp.reasons.includes('peakwind')) {
      cp.label = 'Peak wind';
      cp.markerShort = 'â†¯';
      cp.markerKind = 'event';
    } else if (cp.reasons.includes('coldest')) {
      cp.label = 'Coldest';
      cp.markerShort = 'â„';
      cp.markerKind = 'event';
    } else if (cp.reasons.includes('hottest')) {
      cp.label = 'Hottest';
      cp.markerShort = 'Ht';
      cp.markerKind = 'event';
    } else if (cp.reasons.includes('highpoint')) {
      cp.label = 'High point';
      cp.markerShort = 'Hi';
      cp.markerKind = 'event';
    } else if (cp.reasons.includes('lowpoint')) {
      cp.label = 'Low point';
      cp.markerShort = 'Lo';
      cp.markerKind = 'event';
    } else {
      cp.label = modelName === 'smart' ? `Forecast checkpoint ${genericIndex}` : `Weather checkpoint ${genericIndex}`;
      cp.markerShort = `${genericIndex}`;
      cp.markerKind = 'mid';
      genericIndex++;
    }
  });
  return samples;
}

function promoteSmartCheckpointEvents(samples, modelName) {
  applyCheckpointLabelsForModel(samples, modelName);
  if (modelName !== 'smart') return samples;
  const mids = samples.filter(cp => !cp.reasons.includes('start') && !cp.reasons.includes('finish') && cp.weather);
  if (!mids.length) return samples;
  const coldest = [...mids].sort((a, b) => firstFinite(getCheckpointFeelsMin(a), 999) - firstFinite(getCheckpointFeelsMin(b), 999))[0];
  const hottest = [...mids].sort((a, b) => firstFinite(getCheckpointFeelsMax(b), -999) - firstFinite(getCheckpointFeelsMax(a), -999))[0];
  const windiest = [...mids].sort((a, b) => getCheckpointMaxWind(b) - getCheckpointMaxWind(a))[0];
  const wettest = [...mids].sort((a, b) => getCheckpointWetScore(b) - getCheckpointWetScore(a))[0];
  const uvPeak = [...mids].sort((a, b) => getCheckpointMaxUv(b) - getCheckpointMaxUv(a))[0];
  const worstAqi = [...mids].filter(cp => isFiniteNumber(getCheckpointMaxAqi(cp))).sort((a, b) => getCheckpointMaxAqi(b) - getCheckpointMaxAqi(a))[0];
  const highest = [...mids].filter(cp => isFiniteNumber(getCheckpointElevation(cp))).sort((a, b) => getCheckpointElevation(b) - getCheckpointElevation(a))[0];
  const lowest = [...mids].filter(cp => isFiniteNumber(getCheckpointElevation(cp))).sort((a, b) => getCheckpointElevation(a) - getCheckpointElevation(b))[0];
  const lowestVisibility = [...mids].sort((a, b) => getVisibilityPenalty(b) - getVisibilityPenalty(a))[0];
  if (coldest && firstFinite(getCheckpointFeelsMin(coldest), 99) <= 6) addCheckpointReason(coldest, 'coldest', 'Coldest feels-like');
  if (hottest && firstFinite(getCheckpointFeelsMax(hottest), -99) >= 28) addCheckpointReason(hottest, 'hottest', 'Hottest feels-like');
  if (windiest && getCheckpointMaxWind(windiest) >= 25) addCheckpointReason(windiest, 'peakwind', 'Peak wind');
  if (wettest && (firstFinite(wettest.windowWeather?.maxPrecipProb, wettest.weather?.precipProb, 0) >= 45 || firstFinite(wettest.windowWeather?.maxPrecip, wettest.weather?.precip, 0) >= 0.3)) addCheckpointReason(wettest, 'wettest', 'Rain risk');
  if (uvPeak && isOutdoorUvRelevantActivity(selectedActivity) && getCheckpointMaxUv(uvPeak) >= 6) addCheckpointReason(uvPeak, 'uvpeak', 'Peak UV');
  if (worstAqi && firstFinite(getCheckpointMaxAqi(worstAqi), 0) >= 51) addCheckpointReason(worstAqi, 'pooraqi', 'Worst AQI on route');
  const distinctAltitudeExtremes = highest && lowest && highest.pointIndex !== lowest.pointIndex;
  if (distinctAltitudeExtremes) addCheckpointReason(highest, 'highpoint', 'Highest sampled elevation');
  if (distinctAltitudeExtremes) addCheckpointReason(lowest, 'lowpoint', 'Lowest sampled elevation');
  if (lowestVisibility && hasLowVisibilityConditions(lowestVisibility)) addCheckpointReason(lowestVisibility, 'lowvis', 'Lowest visibility conditions');
  return decorateSmartCheckpointMarkers(applySmartEventLabels(samples, modelName));
}

function markSmartWeatherEventCheckpoints(samples) {
  return promoteSmartCheckpointEvents(samples, checkpointModel);
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
      cp.markerShort = 'â†‘';
      cp.markerKind = 'event';
    } else if (cp.reasons.includes('sunset')) {
      cp.label = 'Sunset';
      cp.markerShort = 'â†“';
      cp.markerKind = 'event';
    } else if (cp.reasons.includes('wettest')) {
      cp.label = 'Rain risk';
      cp.markerShort = 'â˜”';
      cp.markerKind = 'event';
    } else if (cp.reasons.includes('uvpeak')) {
      cp.label = 'Peak UV';
      cp.markerShort = 'â˜€';
      cp.markerKind = 'event';
    } else if (cp.reasons.includes('peakwind')) {
      cp.label = 'Peak wind';
      cp.markerShort = 'â†¯';
      cp.markerKind = 'event';
    } else if (cp.reasons.includes('coldest')) {
      cp.label = 'Coldest';
      cp.markerShort = 'â„';
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
  const toneClass = cp.markerTone ? ` ${cp.markerTone}` : '';
  const markerInner = kind === 'event'
    ? renderSymbolIconHtml(cp.markerShort, 'checkpoint-marker-icon', cp.label || cp.markerShort, true)
    : null;
  const shortLabel = cp.markerShort || (kind === 'start' ? 'S' : (kind === 'finish' ? 'F' : 'â€¢'));
  return L.marker([cp.lat, cp.lon], {
    icon: L.divIcon({
      className: 'route-checkpoint-marker-wrapper',
      html: `<span class="checkpoint-marker ${kind}${toneClass}" title="${escapeHtml(cp.label)}">${markerInner || escapeHtml(shortLabel)}</span>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
      popupAnchor: [0, -10]
    })
  });
}

function getRouteElevationTooltipPortal() {
  let tooltip = document.getElementById('route-elevation-tooltip-portal');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'route-elevation-tooltip-portal';
    tooltip.className = 'chart-tooltip chart-tooltip-portal route-elevation-tooltip';
    tooltip.setAttribute('role', 'tooltip');
    document.body.appendChild(tooltip);
  }
  return tooltip;
}

function hideRouteElevationHoverState() {
  const tooltip = document.getElementById('route-elevation-tooltip-portal');
  if (tooltip) tooltip.classList.remove('visible');
  if (routeElevationProfile) {
    const hoverGroup = routeElevationProfile.querySelector('[data-route-elevation-hover]');
    if (hoverGroup instanceof Element) hoverGroup.setAttribute('hidden', '');
  }
  if (routeHoverLayer) routeHoverLayer.clearLayers();
}

function positionFloatingTooltip(tooltip, event) {
  const margin = 12;
  const gap = 14;
  const width = tooltip.offsetWidth || 210;
  const height = tooltip.offsetHeight || 140;
  const clientX = Number.isFinite(event?.clientX) ? event.clientX : (window.innerWidth / 2);
  const clientY = Number.isFinite(event?.clientY) ? event.clientY : (window.innerHeight / 2);
  let x = clientX + gap;
  let y = clientY - height - gap;
  if (x + width > window.innerWidth - margin) x = clientX - width - gap;
  if (y < margin) y = clientY + gap;
  x = Math.max(margin, Math.min(window.innerWidth - width - margin, x));
  y = Math.max(margin, Math.min(window.innerHeight - height - margin, y));
  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y}px`;
}

function updateRouteHeaderActions() {
  const source = routeState?.routeSource || null;
  const cachedRouteDocument = normalizePersistedRouteDocument(routeState?.routeDocument);
  if (routeOpenSourceBtn instanceof HTMLButtonElement) {
    const canOpen = !!source?.sourceUrl;
    routeOpenSourceBtn.hidden = !canOpen;
    routeOpenSourceBtn.disabled = !canOpen;
    routeOpenSourceBtn.textContent = source?.provider === 'strava' ? 'Open in Strava' : 'Open source';
  }
  if (routeDownloadGpxBtn instanceof HTMLButtonElement) {
    const canDownload = cachedRouteDocument?.format === 'gpx' || !!source?.canDownloadGpx;
    routeDownloadGpxBtn.hidden = !canDownload;
    routeDownloadGpxBtn.disabled = !canDownload;
    routeDownloadGpxBtn.textContent = 'Download GPX';
  }
}

function formatRouteCoordinate(value) {
  return isFiniteNumber(value) ? Number(value).toFixed(5) : 'â€”';
}

function getRoutePointSelectedTime(pointIndex) {
  const fallbackStartTime = weatherData ? getSelectedStartTime(weatherData) : null;
  const totalMinutes = getRouteTimingMinutes();
  if (!isFiniteNumber(pointIndex) || pointIndex < 0 || !fallbackStartTime || !isFiniteNumber(totalMinutes) || totalMinutes <= 0) {
    return fallbackStartTime;
  }
  const timingModel = buildRouteTimingModel(totalMinutes);
  const offsetMinutes = timingModel?.cumulativeMinutes?.[pointIndex];
  if (!isFiniteNumber(offsetMinutes)) return fallbackStartTime;
  return addMinutesToLocalString(fallbackStartTime, Math.round(offsetMinutes));
}

async function refreshWeatherForRoutePointSelection({ latitude, longitude, label, timeValue }) {
  if (!isFiniteNumber(latitude) || !isFiniteNumber(longitude)) return;
  activeRoutePointForecast = {
    isRoutePoint: true,
    latitude,
    longitude,
    label: label || 'Route point',
    timeValue: timeValue || null,
  };
  await fetchWeatherFromResult({
    latitude,
    longitude,
    name: label || 'Route point',
    admin1: '',
    country: '',
    country_code: '',
  });
}

function getRouteElevationExtremes(points) {
  if (!Array.isArray(points) || !points.length) return { highPoint: null, lowPoint: null };
  const highPoint = points.reduce((best, point) => (!best || point.ele > best.ele ? point : best), null);
  const lowPoint = points.reduce((best, point) => (!best || point.ele < best.ele ? point : best), null);
  return { highPoint, lowPoint };
}

function getRouteElevationHoveredCheckpoint(point) {
  if (!point || !Array.isArray(routeState?.samples) || !routeState.samples.length) return null;
  const checkpointToleranceKm = Math.min(0.35, Math.max(0.08, firstFinite(routeState?.totalKm, 0) * 0.015));
  let nearestCheckpoint = null;
  let nearestDistance = Infinity;
  routeState.samples.forEach((checkpoint) => {
    if (!checkpoint) return;
    let distance = Infinity;
    if (isFiniteNumber(checkpoint.pointIndex) && checkpoint.pointIndex === point.index) {
      distance = 0;
    } else if (isFiniteNumber(checkpoint.kmFromStart)) {
      distance = Math.abs(Number(checkpoint.kmFromStart) - point.km);
    }
    if (distance < nearestDistance) {
      nearestCheckpoint = checkpoint;
      nearestDistance = distance;
    }
  });
  return nearestDistance <= checkpointToleranceKm ? nearestCheckpoint : null;
}

function getRouteElevationPointTypeLabel(point) {
  const checkpoint = getRouteElevationHoveredCheckpoint(point);
  if (checkpoint?.label) return checkpoint.label;
  const { highPoint, lowPoint } = getRouteElevationExtremes(routeState?.points || []);
  if (highPoint === routeState?.points?.[point.index]) return 'High point';
  if (lowPoint === routeState?.points?.[point.index]) return 'Low point';
  return 'Route point';
}

function bindRouteElevationProfileInteractions() {
  if (!routeElevationProfile) return;
  const svg = routeElevationProfile.querySelector('[data-route-elevation-chart]');
  if (!(svg instanceof SVGSVGElement) || !routeState?.points?.length) return;

  const elevationPoints = getRouteElevationRenderablePoints(routeState.points);
  if (elevationPoints.length < 2) return;

  const {
    chartWidth,
    chartHeight,
    padLeft,
    padRight,
    padTop,
    padBottom,
  } = ROUTE_ELEVATION_PROFILE_METRICS;
  const totalKm = Math.max(...elevationPoints.map((point) => point.km), 0);
  const elevations = elevationPoints.map((point) => point.ele);
  const minEle = Math.min(...elevations);
  const maxEle = Math.max(...elevations);
  const eleRange = Math.max(1, maxEle - minEle);
  const paddedMinEle = minEle - eleRange * 0.08;
  const paddedMaxEle = maxEle + eleRange * 0.08;
  const paddedRange = Math.max(1, paddedMaxEle - paddedMinEle);
  const plotWidth = chartWidth - padLeft - padRight;
  const plotHeight = chartHeight - padTop - padBottom;
  const xForKm = (km) => padLeft + (totalKm > 0 ? (km / totalKm) * plotWidth : 0);
  const yForEle = (ele) => padTop + ((paddedMaxEle - ele) / paddedRange) * plotHeight;
  const hoverGroup = svg.querySelector('[data-route-elevation-hover]');
  const hoverLine = svg.querySelector('[data-route-elevation-hover-line]');
  const hoverDot = svg.querySelector('[data-route-elevation-hover-dot]');
  const tooltip = getRouteElevationTooltipPortal();
  let lastTouchHoverAt = 0;

  const markTouchHover = () => {
    lastTouchHoverAt = Date.now();
  };

  const shouldSuppressMouseHover = () => (Date.now() - lastTouchHoverAt) < ROUTE_ELEVATION_TOUCH_HOVER_SUPPRESSION_MS;

  const showPoint = (point, event) => {
    const x = xForKm(point.km);
    const y = yForEle(point.ele);
    const pointEta = getRoutePointSelectedTime(point.index);
    const pointTypeLabel = getRouteElevationPointTypeLabel(point);
    if (hoverGroup instanceof Element) hoverGroup.removeAttribute('hidden');
    if (hoverLine instanceof SVGLineElement) {
      hoverLine.setAttribute('x1', x.toFixed(1));
      hoverLine.setAttribute('x2', x.toFixed(1));
    }
    if (hoverDot instanceof SVGCircleElement) {
      hoverDot.setAttribute('cx', x.toFixed(1));
      hoverDot.setAttribute('cy', y.toFixed(1));
    }

    tooltip.innerHTML = `
      <div class="tt-time">${escapeHtml(formatKm(point.km))} from start</div>
      <div class="tt-row"><span>Point type</span><strong>${escapeHtml(pointTypeLabel)}</strong></div>
      <div class="tt-row"><span>Elevation</span><strong>${escapeHtml(`${Math.round(point.ele)} m`)}</strong></div>
      ${pointEta ? `<div class="tt-row"><span>Selected time</span><strong>${escapeHtml(formatShortDateTime(pointEta))}</strong></div>` : ''}
      <div class="tt-row"><span>Current position</span><strong>${escapeHtml(`${formatRouteCoordinate(point.lat)}Â°, ${formatRouteCoordinate(point.lon)}Â°`)}</strong></div>
    `;
    tooltip.classList.add('visible');
    positionFloatingTooltip(tooltip, event);

    if (routeHoverLayer && isFiniteNumber(point.lat) && isFiniteNumber(point.lon)) {
      routeHoverLayer.clearLayers();
      L.circleMarker([point.lat, point.lon], {
        radius: 7,
        color: '#244e68',
        weight: 3,
        opacity: 1,
        fillColor: '#f6fbff',
        fillOpacity: 0.95,
      }).addTo(routeHoverLayer);
    }
  };

  const getNearestPointFromClientX = (clientX) => {
    const rect = svg.getBoundingClientRect();
    if (!rect.width || !rect.height) return elevationPoints[0];
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const svgX = ratio * chartWidth;
    let nearestPoint = elevationPoints[0];
    let nearestDistance = Math.abs(xForKm(nearestPoint.km) - svgX);
    for (let index = 1; index < elevationPoints.length; index += 1) {
      const point = elevationPoints[index];
      const distance = Math.abs(xForKm(point.km) - svgX);
      if (distance < nearestDistance) {
        nearestPoint = point;
        nearestDistance = distance;
      }
    }
    return nearestPoint;
  };

  const handlePointerMove = (event) => {
    if (event instanceof MouseEvent && shouldSuppressMouseHover()) return;
    const nearestPoint = getNearestPointFromClientX(event.clientX);
    showPoint(nearestPoint, event);
  };

  svg.onmouseenter = handlePointerMove;
  svg.onmousemove = handlePointerMove;
  svg.onmouseleave = hideRouteElevationHoverState;
  svg.onclick = (event) => {
    const nearestPoint = getNearestPointFromClientX(event.clientX);
    void refreshWeatherForRoutePointSelection({
      latitude: nearestPoint.lat,
      longitude: nearestPoint.lon,
      label: `Route point ${formatKm(nearestPoint.km)}`,
      timeValue: getRoutePointSelectedTime(nearestPoint.index),
    });
  };
  svg.ontouchstart = (event) => {
    markTouchHover();
    const touch = event.touches?.[0];
    if (!touch) return;
    handlePointerMove(touch);
  };
  svg.ontouchmove = (event) => {
    markTouchHover();
    const touch = event.touches?.[0];
    if (!touch) return;
    handlePointerMove(touch);
  };
  svg.ontouchend = () => {
    markTouchHover();
    hideRouteElevationHoverState();
  };
  svg.ontouchcancel = () => {
    markTouchHover();
    hideRouteElevationHoverState();
  };
  routeElevationProfile.querySelectorAll('[data-route-elevation-jump="checkpoint"]').forEach((el) => {
    const trigger = el;
    if (!(trigger instanceof HTMLButtonElement) || trigger.dataset.routeElevationJumpBound === '1') return;
    trigger.dataset.routeElevationJumpBound = '1';
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      void refreshWeatherForRoutePointSelection({
        latitude: Number(trigger.dataset.routeElevationLat),
        longitude: Number(trigger.dataset.routeElevationLon),
        label: trigger.dataset.routeElevationLabel || 'Route checkpoint',
        timeValue: trigger.dataset.routeElevationTimeValue || null,
      });
    });
  });
}

function renderRouteElevationProfilePanel() {
  if (!routeElevationProfile) return;
  if (!routeState?.points?.length) {
    routeElevationProfile.innerHTML = '';
    hideRouteElevationHoverState();
    return;
  }
  if (!routeState.hasElevation) {
    const totalGain = Number(routeState?.routeSource?.elevationGainMeters) > 0
      ? ` Strava still reports about +${Math.round(routeState.routeSource.elevationGainMeters)} m total climbing for this route.`
      : '';
    routeElevationProfile.innerHTML = `<p class="route-elevation-empty">No point-by-point elevation profile is available for this route.${totalGain}</p>`;
    hideRouteElevationHoverState();
    return;
  }
  const elevationCheckpoints = routeState.samples?.length ? routeState.samples : sampleRouteCheckpoints();
  const profileHtml = renderRouteElevationProfile(routeState.points, elevationCheckpoints);
  routeElevationProfile.innerHTML = profileHtml || '<p class="route-elevation-empty">No elevation data in this route.</p>';
  bindRouteElevationProfileInteractions();
}

function renderRouteMap() {
  if (!routeState?.points?.length) {
    routeMapBounds = null;
    updateRouteFitControlUi();
    if (routeElevationProfile) routeElevationProfile.innerHTML = '';
    updateRouteHeaderActions();
    hideRouteElevationHoverState();
    mapCard.style.display = 'none';
    return;
  }
  mapCard.style.display = 'block';
  updateRouteHeaderActions();
  renderRouteElevationProfilePanel();
  initRouteMap();
  clearRouteMapLayers();
  const latlngs = routeState.points.map(p => [p.lat, p.lon]);
  const poly = L.polyline(latlngs, { color: '#3a6b8a', weight: 4, opacity: 0.9 }).addTo(routeLayer);
  routeMapBounds = poly.getBounds();
  updateRouteFitControlUi();
  const checkpoints = routeState.samples?.length ? routeState.samples : sampleRouteCheckpoints();
  checkpoints.forEach(cp => {
    buildRouteCheckpointMarker(cp)
      .bindPopup(buildRouteCheckpointPopupHtml(cp))
      .addTo(routeMarkersLayer);
  });
  fitRouteMapToBounds();
  const gainText = routeState.totalGain >= 20 ? ` · +${Math.round(routeState.totalGain)} m` : '';
  const modelText = checkpointModel === 'smart' ? ' · smart checkpoints' : ' · standard checkpoints';
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
  const aqis = points.map(p => p.aqi).filter(isFiniteNumber);
  return {
    tempMin: temps.length ? Math.min(...temps) : null,
    tempMax: temps.length ? Math.max(...temps) : null,
    feelsMin: feels.length ? Math.min(...feels) : null,
    feelsMax: feels.length ? Math.max(...feels) : null,
    maxWind: winds.length ? Math.max(...winds) : null,
    maxGust: gusts.length ? Math.max(...gusts) : null,
    maxPrecip: precips.length ? Math.max(...precips) : null,
    maxPrecipProb: probs.length ? Math.max(...probs) : null,
    maxUv: uvs.length ? Math.max(...uvs) : null,
    maxAqi: aqis.length ? Math.max(...aqis) : null
  };
}

async function fetchRouteCheckpointForecast(cp) {
  const cacheKey = `${cp.lat.toFixed(4)},${cp.lon.toFixed(4)}`;
  const cache = routeState.weatherCache[cacheKey] || (routeState.weatherCache[cacheKey] = {});
  if (!cache.hourly) {
    const url = `${WEATHER_API}?latitude=${cp.lat}&longitude=${cp.lon}&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation_probability,precipitation,wind_speed_10m,wind_gusts_10m,wind_direction_10m,weather_code,is_day,uv_index&forecast_days=14&wind_speed_unit=kmh&timezone=auto`;
    const [res, aqiPayload] = await Promise.all([
      fetchWithTimeout(url, {}, 12000, 'Route checkpoint weather'),
      settleOptional(fetchAirQuality(cp.lat, cp.lon), null, 8000, 'Route checkpoint air quality')
    ]);
    if (!res.ok) throw new Error(`Route checkpoint weather HTTP ${res.status}`);
    const json = await res.json();
    cache.hourly = (json.hourly?.time || []).map((time, i) => ({
      time: normalizeLocalDateTimeString(time) || time,
      temp: json.hourly.temperature_2m?.[i],
      feels: json.hourly.apparent_temperature?.[i],
      humidity: json.hourly.relative_humidity_2m?.[i],
      precipProb: json.hourly.precipitation_probability?.[i],
      precip: json.hourly.precipitation?.[i],
      wind: json.hourly.wind_speed_10m?.[i],
      gusts: json.hourly.wind_gusts_10m?.[i],
      windDir: json.hourly.wind_direction_10m?.[i],
      uv: json.hourly.uv_index?.[i],
      aqi: matchAqiToHourlyTime(aqiPayload, normalizeLocalDateTimeString(time) || time),
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
  routeSummary.textContent = `${routeState.fileName} · loading checkpoint weatherâ€¦`;
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
  routeSummary.textContent = `${routeState.fileName} · ${formatKm(routeState.totalKm)}${routeHasDurationOverride() ? ` · route time ${formatMinutesShort(routeState.elapsedMinutes)}` : ''} · ${routeState.samples.length} ${getCheckpointModelLabel()} checkpoints`;
  if (slot) slot.innerHTML = buildRouteWeatherHtml();
}

function clearRouteCheckpointWeatherCache() {
  if (!routeState) return;
  routeState.weatherCache = {};
  if (Array.isArray(routeState.samples)) {
    routeState.samples.forEach(cp => {
      cp.weather = null;
      cp.windowWeather = null;
      cp.relativeWind = null;
      cp.ecccAlerts = [];
      cp.ecccAlertStatus = '';
    });
  }
}

function getActiveWeatherRefreshPlace() {
  if (activeRoutePointForecast?.isRoutePoint && isFiniteNumber(activeRoutePointForecast.latitude) && isFiniteNumber(activeRoutePointForecast.longitude)) {
    return {
      latitude: activeRoutePointForecast.latitude,
      longitude: activeRoutePointForecast.longitude,
      name: activeRoutePointForecast.label || 'Route point',
      admin1: '',
      country: '',
      country_code: ''
    };
  }
  if (weatherData && isFiniteNumber(weatherData.latitude) && isFiniteNumber(weatherData.longitude)) {
    return {
      latitude: weatherData.latitude,
      longitude: weatherData.longitude,
      name: weatherData.locationName || 'Current location',
      admin1: '',
      country: '',
      country_code: ''
    };
  }
  if (routeState?.points?.length) {
    return {
      latitude: routeState.points[0].lat,
      longitude: routeState.points[0].lon,
      name: routeState.fileName || 'Route start',
      admin1: '',
      country: '',
      country_code: ''
    };
  }
  return null;
}

async function refreshWeatherForActiveTarget({ source = 'manual', detail = 'Refreshing weatherâ€¦', clearRouteCheckpointCache: shouldClearRouteCheckpointCache = false, placeOverride = null } = {}) {
  const place = placeOverride || getActiveWeatherRefreshPlace();
  if (!place) return false;
  const previousRouteCheckpointState = shouldClearRouteCheckpointCache ? captureRouteCheckpointWeatherState() : null;
  if (shouldClearRouteCheckpointCache) clearRouteCheckpointWeatherCache();
  setWeatherRefreshStatus({
    state: 'loading',
    source,
    detail,
    error: '',
    lastAttemptAt: new Date().toISOString()
  });
  try {
    await fetchWeatherFromResult(place, { propagateError: true });
    setWeatherRefreshStatus({
      state: 'success',
      source,
      detail: '',
      error: '',
      lastSuccessAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    if (previousRouteCheckpointState) restoreRouteCheckpointWeatherState(previousRouteCheckpointState);
    setWeatherRefreshStatus({
      state: 'error',
      source,
      detail: '',
      error: error instanceof Error ? error.message : 'Unable to refresh weather.'
    });
    throw error;
  }
}

async function handleRouteFileChange(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const routeText = await file.text();
    const points = parseRouteText(file.name, routeText);
    if (!points.length) throw new Error('No route points found in that file.');
    captureRouteDistanceInputSnapshot();
    routeState = buildRouteStateWithSource(
      points,
      file.name,
      { provider: 'manual', kind: 'route' },
      buildPersistedRouteDocumentSnapshot(file.name, routeText, 'upload')
    );
    locationCardCollapsed = true;
    updateLocationCardCollapseUi();
    collapsePlannerSubsection('duration', { scrollToNextOnMobile: true });
    const routeLoadedMessage = `${file.name} loaded · ${formatKm(routeState.totalKm)}${routeState.totalGain >= 20 ? ` · +${Math.round(routeState.totalGain)} m` : ''}${routeHasDurationOverride() ? ` · route time ${formatMinutesShort(routeState.elapsedMinutes)} · duration locked` : ' · no timing found, so duration stays manual'} · ${routeState.points.length} points · ${getCheckpointModelLabel()} checkpoint model · provenance: local route file.`;
    routeStatus.textContent = routeLoadedMessage;
    clearRouteBtn.style.display = 'inline-block';
    renderPlannerState();
    if (weatherData) configureLaterInput(weatherData);
    renderRouteMap();
    routeStatus.textContent = `${routeLoadedMessage} · refreshing weatherâ€¦`;
    try {
      await refreshWeatherForActiveTarget({
        source: 'route_load',
        detail: `Refreshing weather for ${file.name}â€¦`,
        clearRouteCheckpointCache: true,
        placeOverride: { latitude: routeState.points[0].lat, longitude: routeState.points[0].lon, name: 'Route start', admin1: '', country: '', country_code: '' }
      });
      routeStatus.textContent = routeLoadedMessage;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to refresh weather.';
      routeStatus.textContent = `${routeLoadedMessage} · weather refresh failed: ${message}`;
    }
  } catch (err) {
    routeFileInput.value = '';
    routeStatus.textContent = err.message || 'Could not read that route file.';
  }
}

function clearRoute() {
  routeState = null;
  routeMapBounds = null;
  restoreRouteDistanceInputSnapshot();
  routeFileInput.value = '';
  clearRouteBtn.style.display = 'none';
  routeStatus.textContent = 'Optional GPX or GeoJSON only. If loaded, the app can sample route checkpoints automatically. Route distance always overrides presets; route duration also overrides it when timing data exists.';
  updateLocationCardCollapseUi();
  updateRouteFitControlUi();
  updateRouteHeaderActions();
  hideRouteElevationHoverState();
  mapCard.style.display = 'none';
  if (routeLayer) clearRouteMapLayers();
  const slot = document.getElementById('route-weather-slot');
  if (slot) slot.innerHTML = '';
  renderPlannerState();
  if (weatherData) configureLaterInput(weatherData);
  if (weatherData) renderAdvice(weatherData, selectedActivity);
  schedulePersistedAppStateSave();
}
window.clearRoute = clearRoute;

function resetLocationSection() {
  weatherData = null;
  setShareStatus('');
  setWeatherRefreshStatus({ state: 'idle', source: '', detail: '', error: '', lastAttemptAt: '', lastSuccessAt: '' });
  hideSuggestions();
  hideError();
  input.value = '';
  clearRoute();
  resultCard.style.display = 'none';
  mapCard.style.display = 'none';
  locationCardCollapsed = false;
  updateLocationCardCollapseUi();
  if (forecastOnlyMode) updateForecastOnlyModeUi();
  schedulePersistedAppStateSave();
}
window.resetLocationSection = resetLocationSection;

function performClearAllTool() {
  setShareStatus('');
  forecastOnlyMode = false;
  clearForecastOnlyPlannerState();
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
  customMultisportSelections = cloneMultisportSelections(defaultMultisportSelections);
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
  updateForecastOnlyModeUi();
  renderPlannerState();
  clearPersistedAppState();
}

function clearAllTool() {
  if (!clearAllOverlay) {
    performClearAllTool();
    return;
  }
  clearAllOverlay.hidden = false;
  document.body.classList.add('helper-open');
  confirmClearAllBtn?.focus({ preventScroll: true });
}

function closeClearAllConfirm() {
  if (!clearAllOverlay) return;
  clearAllOverlay.hidden = true;
  document.body.classList.remove('helper-open');
}

function confirmClearAll() {
  closeClearAllConfirm();
  performClearAllTool();
}
window.clearAllTool = clearAllTool;

function currentLocationIconHtml() {
  return '<span class="locate-icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="2.5" fill="currentColor"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></span>';
}

function setCurrentLocationButtonState(isLoading = false) {
  if (!currentLocationBtn) return;
  currentLocationBtn.innerHTML = isLoading ? '<span class="spinner locate-spinner" aria-hidden="true"></span>' : currentLocationIconHtml();
  currentLocationBtn.title = isLoading ? 'Locatingâ€¦' : 'Use current location';
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
  if (!code) return 'ðŸŒ';
  return code.toUpperCase().replace(/./g, c => String.fromCodePoint(0x1F1E6 - 65 + c.charCodeAt(0)));
}

function escapeHtml(value) {
  return normalizeDisplayTextFromModule(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderInlineMarkdown(text) {
  return String(text || '')
    .split(/(`[^`]*`)/g)
    .map((segment) => {
      if (segment.startsWith('`') && segment.endsWith('`')) {
        return `<code>${escapeHtml(segment.slice(1, -1))}</code>`;
      }

      return escapeHtml(segment)
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>');
    })
    .join('');
}

function renderMarkdownSection(markdown) {
  const lines = String(markdown || '').replace(/\r\n?/g, '\n').split('\n');
  const blocks = [];
  let paragraphLines = [];
  let listItems = [];

  const flushParagraph = () => {
    if (!paragraphLines.length) return;
    blocks.push(`<p>${paragraphLines.map(line => renderInlineMarkdown(line)).join(' ')}</p>`);
    paragraphLines = [];
  };
  const flushList = () => {
    if (!listItems.length) return;
    blocks.push(`<ul>${listItems.map(item => `<li>${renderInlineMarkdown(item)}</li>`).join('')}</ul>`);
    listItems = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      const level = Math.min(4, headingMatch[1].length + 1);
      blocks.push(`<h${level}>${renderInlineMarkdown(headingMatch[2])}</h${level}>`);
      continue;
    }

    if (/^-{3,}$/.test(line)) {
      flushParagraph();
      flushList();
      blocks.push('<hr>');
      continue;
    }

    const listMatch = line.match(/^- (.+)$/);
    if (listMatch) {
      flushParagraph();
      listItems.push(listMatch[1]);
      continue;
    }

    flushList();
    paragraphLines.push(line);
  }

  flushParagraph();
  flushList();
  return blocks.join('');
}

function slugifyChangelogHeading(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[`*_]+/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'version';
}

function parseVersionHeading(heading) {
  const match = String(heading || '').trim().match(/^v(\d+)(?:\.(\d+))?(?:\.(\d+))?(?:\.(\d+))?$/i);
  if (!match) return null;
  const segments = match
    .slice(1)
    .filter(segment => segment != null)
    .map(segment => Number(segment));
  if (!segments.length || segments.some(segment => !Number.isFinite(segment))) return null;
  return {
    segments,
    normalized: `v${segments.join('.')}`,
  };
}

function isMilestoneVersionHeading(heading) {
  const parsed = parseVersionHeading(heading);
  return Boolean(parsed && (parsed.segments.length === 1 || parsed.segments.length === 2));
}

function deriveMilestoneLabel(sourceLine) {
  let label = String(sourceLine || '')
    .replace(/^[*-]\s*/, '')
    .replace(/[`*_]+/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.;,:-]+$/, '');
  if (!label) return '';

  const nounPhraseMatch = label.match(/^(.+?)\s+(?:now\s+)?(?:adds?|added|fixes?|fixed|switches?|switched|extends?|extended|changes?|changed|makes?|made|updates?|updated|hides?|hid|removes?|removed|corrects?|corrected|keeps?|kept|relaxes?|relaxed|constrains?|constrained|limits?|limited|adapts?|adapted|surfaces?|surfaced|restores?|restored|refactors?|refactored)\b/i);
  if (nounPhraseMatch?.[1]) {
    label = nounPhraseMatch[1].trim();
  } else {
    label = label.replace(/^(?:adds?|added|fixes?|fixed|switches?|switched|extends?|extended|changes?|changed|makes?|made|updates?|updated|hides?|hid|removes?|removed|corrects?|corrected|keeps?|kept|relaxes?|relaxed|constrains?|constrained|limits?|limited|adapts?|adapted|surfaces?|surfaced|restores?|restored|refactors?|refactored)\s+/i, '');
  }

  label = label
    .replace(/\s+(?:so|while|instead of|through|via|alongside|inside)\b.*$/i, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.;,:-]+$/, '');

  if (!label) return '';
  if (label.length > 44) {
    const shortened = label.slice(0, 44).replace(/\s+\S*$/, '').trim();
    if (shortened) label = shortened;
  }
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function deriveMilestoneNameFromSection(section) {
  const body = String(section || '').replace(/^##\s+.+$/m, '').trim();
  if (!body) return '';
  const lines = body
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !/^-{3,}$/.test(line) && !/^#{1,4}\s+/.test(line));
  const bulletLine = lines.find(line => /^-\s+/.test(line));
  const candidate = bulletLine || lines[0] || '';
  return deriveMilestoneLabel(candidate);
}

function parseChangelogSections(markdown) {
  const normalized = String(markdown || '').replace(/\r\n?/g, '\n');
  const sectionStarts = [...normalized.matchAll(/^##\s+.+$/gm)].map(match => match.index ?? 0);
  const sections = sectionStarts.length
    ? sectionStarts.map((start, index) => normalized.slice(start, sectionStarts[index + 1] ?? normalized.length).trim()).filter(Boolean)
    : [normalized];
  return sections
    .map((section, index) => {
      const headingMatch = section.match(/^##\s+(.+)$/m);
      const heading = headingMatch?.[1]?.trim() || `Version ${index + 1}`;
      const versionInfo = parseVersionHeading(heading);
      const milestoneName = isMilestoneVersionHeading(heading) ? deriveMilestoneNameFromSection(section) : '';
      return {
        heading,
        id: `changelog-${slugifyChangelogHeading(heading)}`,
        html: renderMarkdownSection(section),
        version: versionInfo?.normalized || '',
        isMilestone: Boolean(versionInfo && milestoneName),
        milestoneName,
      };
    })
    .reverse();
}

function getChangelogSections() {
  if (!changelogSectionsCache) changelogSectionsCache = parseChangelogSections(changelogMarkdown);
  return changelogSectionsCache;
}

function getChangelogMilestoneNameByVersion() {
  if (!changelogMilestoneNameByVersion) {
    changelogMilestoneNameByVersion = new Map();
    getChangelogSections().forEach(section => {
      if (section.isMilestone && section.version && section.milestoneName && !changelogMilestoneNameByVersion.has(section.version)) {
        changelogMilestoneNameByVersion.set(section.version, section.milestoneName);
      }
    });
  }
  return changelogMilestoneNameByVersion;
}

function findMilestoneNameForVersion(versionLabel) {
  const parsed = parseVersionHeading(versionLabel);
  if (!parsed) return '';
  const milestoneMap = getChangelogMilestoneNameByVersion();
  if (parsed.segments.length >= 2) {
    const minorVersion = `v${parsed.segments.slice(0, 2).join('.')}`;
    const minorMilestone = milestoneMap.get(minorVersion);
    if (minorMilestone) return minorMilestone;
  }
  return milestoneMap.get(`v${parsed.segments[0]}`) || '';
}

function buildChangelogTocHtml(sections) {
  return sections
    .filter(section => /^v\d/i.test(section.heading))
    .map(section => {
      const milestoneHtml = section.isMilestone && section.milestoneName
        ? `<span class="changelog-milestone-name">${escapeHtml(section.milestoneName)}</span>`
        : '';
      return `<a class="changelog-toc-link" href="#${escapeHtml(section.id)}"><span class="changelog-version-label">${renderInlineMarkdown(section.heading)}</span>${milestoneHtml}</a>`;
    })
    .join('');
}

function buildChangelogHtml() {
  const sections = getChangelogSections();
  return {
    tocHtml: buildChangelogTocHtml(sections),
    bodyHtml: sections.map((section, index) => `
      <details class="changelog-entry" id="${escapeHtml(section.id)}" ${index === 0 ? 'open' : ''}>
        <summary>
          <span class="changelog-entry-summary-text"><span class="changelog-version-label">${renderInlineMarkdown(section.heading)}</span>${section.isMilestone && section.milestoneName ? `<span class="changelog-milestone-name">${escapeHtml(section.milestoneName)}</span>` : ''}</span>
          <span class="changelog-entry-summary-meta">
            ${index === 0 ? '<span class="changelog-entry-latest">latest</span>' : ''}
            <span class="changelog-entry-chevron" aria-hidden="true">â€º</span>
          </span>
        </summary>
        <div class="changelog-entry-body">${section.html}</div>
      </details>`).join(''),
  };
}

function renderChangelogTocVisibility() {
  if (changelogToc) changelogToc.hidden = changelogTocCollapsed;
  if (changelogTocToggleBtn) changelogTocToggleBtn.textContent = changelogTocCollapsed ? 'Show ToC' : 'Hide ToC';
}

function toggleChangelogToc() {
  changelogTocCollapsed = !changelogTocCollapsed;
  renderChangelogTocVisibility();
}

function setAllChangelogSectionsExpanded(expanded) {
  if (!changelogContent) return;
  changelogContent.querySelectorAll('details.changelog-entry').forEach((entry) => {
    if (entry instanceof HTMLDetailsElement) entry.open = expanded;
  });
}

function jumpToChangelogSection(hash) {
  const targetId = String(hash || '').replace(/^#/, '');
  if (!targetId || !changelogContent) return false;
  const target = changelogContent.querySelector(`#${CSS.escape(targetId)}`);
  if (!(target instanceof HTMLDetailsElement)) return false;
  target.open = true;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return true;
}

function decorateFooterVersionLink() {
  if (!(footerVersionLink instanceof HTMLButtonElement)) return;
  const rawVersionLabel = footerVersionLink.textContent?.trim() || '';
  footerVersionLink.textContent = rawVersionLabel;
  footerVersionLink.setAttribute('aria-label', `Open changelog for Forecast Fit version ${rawVersionLabel}`);
}

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function normalizeEntryIntentKind(value: unknown): EntryIntentKind | null {
  const normalized = String(value || '').trim().toLowerCase();
  switch (normalized) {
    case 'forecast-only':
    case 'forecast':
      return 'forecast-only';
    case 'strava':
    case 'strava-import':
    case 'import-strava':
      return 'strava';
    case 'current-location':
    case 'current':
    case 'locate':
    case 'location':
      return 'current-location';
    default:
      return null;
  }
}

function parseEntryIntentFromUrl(): EntryIntent | null {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('launch') || params.get('entry') || '';
  const kind = normalizeEntryIntentKind(raw);
  return kind ? { kind, source: 'url' } : null;
}

function readStoredEntryIntent(): EntryIntent | null {
  try {
    const raw = sessionStorage.getItem(ENTRY_INTENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { kind?: unknown };
    const kind = normalizeEntryIntentKind(parsed?.kind);
    return kind ? { kind, source: 'resume' } : null;
  } catch {
    return null;
  }
}

function storeEntryIntentForResume(intent: EntryIntent) {
  try {
    sessionStorage.setItem(ENTRY_INTENT_STORAGE_KEY, JSON.stringify({ kind: intent.kind }));
  } catch {
    // Ignore storage failures so startup keeps working in restricted contexts.
  }
}

function clearStoredEntryIntent() {
  try {
    sessionStorage.removeItem(ENTRY_INTENT_STORAGE_KEY);
  } catch {
    // Ignore storage failures so startup keeps working in restricted contexts.
  }
}

function base64UrlEncode(text) {
  const bytes = new TextEncoder().encode(String(text || ''));
  let binary = '';
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecode(value) {
  const normalized = String(value || '').replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function getShareablePlace() {
  if (!weatherData || !isFiniteNumber(weatherData.latitude) || !isFiniteNumber(weatherData.longitude)) return null;
  return {
    latitude: Number(weatherData.latitude),
    longitude: Number(weatherData.longitude),
    name: weatherData.locationName || 'Shared location',
    countryCode: weatherData.countryCode || ''
  };
}

function captureSharedPlannerState(): SharedPlannerState {
  return {
    selectedActivity,
    selectedEventKey,
    selectedDuration,
    checkpointModel,
    startMode,
    raceDayMode,
    manualWeatherPanelOpen,
    temperaturePreference,
    plannedEffort,
    forecastOnlyMode,
    customDistance: String(customDistanceInput?.value || ''),
    distanceUnit: String(distanceUnitSelect?.value || 'km'),
    customDuration: String(customDurationInput?.value || ''),
    durationUnit: String(durationUnitSelect?.value || 'h'),
    average: String(averageInput?.value || ''),
    averageUnit: String(averageUnitSelect?.value || ''),
    manualWaterTemp: String(manualWaterTempInput?.value || ''),
    waterBodyType: String(waterBodyTypeSelect?.value || 'auto'),
    windExposure: String(windExposureSelect?.value || 'auto'),
    poolType: String(poolTypeSelect?.value || 'indoor_heated'),
    laterInputValue: String(laterInput?.value || ''),
    raceDayStart: String(raceDayStartInput?.value || ''),
    raceDayEnd: String(raceDayEndInput?.value || ''),
    bestWindowStart: String(bestWindowStartInput?.value || ''),
    bestWindowEnd: String(bestWindowEndInput?.value || ''),
    bestWindowPriority: String(bestWindowPrioritySelect?.value || 'best_overall'),
    bestWindowStep: String(bestWindowStepSelect?.value || 'auto'),
    bestWindowMaxPrecip: String(bestWindowMaxPrecipInput?.value || ''),
    bestWindowMaxGust: String(bestWindowMaxGustInput?.value || ''),
    bestWindowMinTemp: String(bestWindowMinTempInput?.value || ''),
    bestWindowMaxTemp: String(bestWindowMaxTempInput?.value || ''),
    bestWindowMinWater: String(bestWindowMinWaterInput?.value || ''),
    bestWindowFinishDaylight: !!bestWindowFinishDaylightInput?.checked,
    customMultisportSelections: cloneMultisportSelections()
  };
}

function buildSharedPlanPayload(): SharedPlanState {
  return {
    version: 1,
    sharedAt: new Date().toISOString(),
    place: getShareablePlace(),
    planner: captureSharedPlannerState()
  };
}

function buildSharedPlanUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete('launch');
  url.searchParams.delete('entry');
  url.searchParams.set('share', base64UrlEncode(JSON.stringify(buildSharedPlanPayload())));
  return url.toString();
}

function buildSharedPlanPackage(): SharedPlanPackage {
  return {
    version: 1,
    kind: 'share_package',
    exportedAt: new Date().toISOString(),
    appVersion: APP_VERSION,
    snapshot: capturePersistedAppState({ includeRoute: true, includeWeather: true })
  };
}

function buildSharedPlanPackageText() {
  return JSON.stringify(buildSharedPlanPackage(), null, 2);
}

function setShareStatus(message, tone = '') {
  if (!shareStatus) return;
  shareStatus.textContent = message || '';
  shareStatus.hidden = !message;
  shareStatus.classList.toggle('error', tone === 'error');
}

function setSharePanelError(message = '') {
  if (!shareErrorMsg) return;
  shareErrorMsg.textContent = message || '';
  shareErrorMsg.hidden = !message;
}

function parseSharedPlanFromUrl(): SharedPlanState | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('share');
    if (!raw) return null;
    const parsed = JSON.parse(base64UrlDecode(raw));
    if (!parsed || Number(parsed.version) !== 1 || !parsed.planner) return null;
    return parsed as SharedPlanState;
  } catch {
    return null;
  }
}

function parseImportedShareSnapshot(rawText: string): PersistedAppState | null {
  try {
    const parsed = JSON.parse(String(rawText || ''));
    if (!parsed || typeof parsed !== 'object') return null;
    if (parsed.kind === 'share_package' && Number(parsed.version) === 1 && parsed.snapshot && typeof parsed.snapshot === 'object') {
      return parsed.snapshot as PersistedAppState;
    }
    if (Number((parsed as PersistedAppState).schemaVersion) === APP_STATE_SCHEMA_VERSION) {
      return parsed as PersistedAppState;
    }
    return null;
  } catch {
    return null;
  }
}

async function refreshImportedShareWeather(snapshot: PersistedAppState) {
  const cachedWeather = snapshot.weather?.data;
  const latitude = Number(cachedWeather?.latitude);
  const longitude = Number(cachedWeather?.longitude);
  if (!isFiniteNumber(latitude) || !isFiniteNumber(longitude) || isAppOffline()) return false;
  try {
    await fetchWeatherFromResult({
      latitude,
      longitude,
      name: String(cachedWeather?.locationName || snapshot.inputValue || 'Imported location'),
      admin1: '',
      country: '',
      country_code: String(cachedWeather?.countryCode || '')
    });
    return true;
  } catch {
    return false;
  }
}

async function applyImportedShareSnapshot(snapshot: PersistedAppState, sourceLabel = 'Imported share package') {
  if (!snapshot || Number(snapshot.schemaVersion) !== APP_STATE_SCHEMA_VERSION) {
    throw new Error('That JSON package does not match the current Forecast Fit share format.');
  }
  performClearAllTool();
  const restored = restorePersistedAppState(snapshot);
  if (!restored) {
    throw new Error('That JSON package could not be restored.');
  }
  let refreshedWeather = false;
  if (!weatherData) refreshedWeather = await refreshImportedShareWeather(snapshot);
  schedulePersistedAppStateSave();
  const routeSummary = snapshot.route ? ' Route data was included.' : ' No route data was included.';
  const weatherSummary = refreshedWeather
    ? ' Fresh weather was reloaded for the imported location.'
    : (weatherData ? ' Saved weather/state was restored.' : ' Weather was not available from the package.');
  setShareStatus(`${sourceLabel} loaded.${routeSummary}${weatherSummary}`);
}

function getStartupEntryIntent(): EntryIntent | null {
  return parseEntryIntentFromUrl() || readStoredEntryIntent();
}

async function applyStartupEntryIntent() {
  if (startupEntryIntentApplied) return;
  startupEntryIntentApplied = true;
  if (sharedPlanStateApplied || parseSharedPlanFromUrl()) return;

  const intent = getStartupEntryIntent();
  if (!intent) return;

  if (intent.kind !== 'strava') clearStoredEntryIntent();

  if (intent.kind === 'forecast-only') {
    if (!forecastOnlyMode) activateForecastOnlyMode();
    return;
  }

  if (intent.kind === 'current-location') {
    await useCurrentLocation();
    return;
  }

  const session = getStravaSession();
  const authError = getStravaAuthError();
  if (session) {
    clearStoredEntryIntent();
    openStravaPicker();
    return;
  }

  if (authError) {
    clearStoredEntryIntent();
    if (stravaStatus) stravaStatus.textContent = `${authError} Reconnect to continue the Strava launch.`;
    return;
  }

  if (intent.source === 'url') {
    storeEntryIntentForResume(intent);
    handleConnectStravaEnhanced();
    return;
  }

  clearStoredEntryIntent();
  if (stravaStatus) stravaStatus.textContent = 'Strava launch could not continue because the connection is no longer available.';
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

function isAppOffline() {
  return typeof navigator !== 'undefined' && navigator.onLine === false;
}

function getConnectivityStatusText() {
  if (!isAppOffline()) return '';
  const savedAt = getWeatherDataProvenance(weatherData)?.savedAt || weatherRefreshStatus.lastSuccessAt || '';
  const savedLabel = formatRefreshStatusDateTime(savedAt);
  if (getWeatherDataProvenance(weatherData)?.kind === 'cached_stale') {
    return savedLabel
      ? `Offline mode: showing saved forecast from ${savedLabel}. Planner state, cached route data, and export still work; fresh search, current location, Strava, alerts, and weather refresh need a connection.`
      : 'Offline mode: showing saved forecast. Planner state, cached route data, and export still work; fresh search, current location, Strava, alerts, and weather refresh need a connection.';
  }
  if (weatherData || routeState?.points?.length || selectedActivity) {
    return 'Offline mode: current planner state, cached route data, and export still work. Fresh search, current location, Strava, alerts, and weather refresh need a connection.';
  }
  return 'Offline mode: saved planner sessions and exported plans can still be used, but fresh location search, current location, route imports, Strava, and weather data need a connection.';
}

function updateConnectivityStatusUi() {
  if (!connectivityStatus) return;
  const nextText = getConnectivityStatusText();
  connectivityStatus.textContent = nextText;
  connectivityStatus.hidden = !nextText;
  connectivityStatus.classList.toggle('offline', isAppOffline());
}

function formatRefreshStatusDateTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
}

function getWeatherRefreshStatusText() {
  if (isAppOffline() && getWeatherDataProvenance(weatherData)?.kind === 'cached_stale') {
    const savedAt = formatRefreshStatusDateTime(getWeatherDataProvenance(weatherData)?.savedAt || weatherRefreshStatus.lastSuccessAt);
    return savedAt ? `Offline mode · showing saved forecast from ${savedAt}.` : 'Offline mode · showing saved forecast.';
  }
  if (weatherRefreshStatus.state === 'loading') {
    return weatherRefreshStatus.detail || 'Refreshing weatherâ€¦';
  }
  if (weatherRefreshStatus.state === 'error') {
    const attemptedAt = formatRefreshStatusDateTime(weatherRefreshStatus.lastAttemptAt);
    const prefix = attemptedAt ? `Weather refresh failed ${attemptedAt}` : 'Weather refresh failed';
    return weatherRefreshStatus.error ? `${prefix}: ${weatherRefreshStatus.error}` : prefix;
  }
  if (weatherRefreshStatus.lastSuccessAt) {
    const refreshedAt = formatRefreshStatusDateTime(weatherRefreshStatus.lastSuccessAt);
    if (refreshedAt) return `Weather last refreshed ${refreshedAt}.`;
  }
  return 'Weather refresh status will appear here after the first forecast fetch.';
}

function renderWeatherRefreshStatus() {
  const tone = weatherRefreshStatus.state === 'error'
    ? 'error'
    : weatherRefreshStatus.state === 'loading'
      ? 'loading'
      : '';
  return `<div class="weather-refresh-status ${tone}" data-weather-refresh-status>${escapeHtml(getWeatherRefreshStatusText())}</div>`;
}

function updateWeatherRefreshStatusUi() {
  const nextText = getWeatherRefreshStatusText();
  document.querySelectorAll('[data-weather-refresh-status]').forEach(node => {
    node.textContent = nextText;
    node.classList.toggle('loading', weatherRefreshStatus.state === 'loading');
    node.classList.toggle('error', weatherRefreshStatus.state === 'error');
  });
  updateConnectivityStatusUi();
}

function setWeatherRefreshStatus(patch) {
  weatherRefreshStatus = {
    ...weatherRefreshStatus,
    ...patch
  };
  updateWeatherRefreshStatusUi();
  schedulePersistedAppStateSave();
}

function getWeatherDataProvenance(data = weatherData) {
  return data && typeof data === 'object' ? data.provenance || null : null;
}

function setWeatherDataProvenance(data, patch = {}) {
  if (!data || typeof data !== 'object') return data;
  data.provenance = {
    ...(getWeatherDataProvenance(data) || {}),
    ...patch
  };
  return data;
}

function buildPlannerSourceDiagnostics() {
  const eventPreset = getSelectedEvent();
  const distanceState = getDistanceState(eventPreset);
  const durationState = getDurationState(eventPreset);
  const averageState = getAverageMetric();
  const derivedAverage = getDerivedAverageMetric(eventPreset);
  return {
    distance: {
      source: distanceState?.source || 'none',
      label: distanceState?.label || '',
      valueKm: distanceState?.km ?? null
    },
    duration: {
      source: durationState?.source || 'none',
      label: durationState?.label || '',
      valueMinutes: durationState?.minutes ?? null
    },
    average: {
      source: averageState?.valid ? 'manual' : (derivedAverage?.label ? 'derived' : 'none'),
      label: averageState?.label || derivedAverage?.label || '',
      unit: averageUnitSelect?.value || '',
      canDerive: !!averageState?.canDerive
    }
  };
}

function normalizePersistedRoutePoints(points: unknown): RoutePoint[] {
  if (!Array.isArray(points)) return [];
  return points
    .map((point) => {
      if (!point || typeof point !== 'object') return null;
      const record = point as Record<string, unknown>;
      const lat = Number(record.lat);
      const lon = Number(record.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
      return {
        lat,
        lon,
        ele: Number.isFinite(Number(record.ele)) ? Number(record.ele) : null,
        time: typeof record.time === 'string' && record.time ? record.time : null
      };
    })
    .filter(Boolean);
}

function capturePersistedRouteSnapshot(): PersistedRouteSnapshot | null {
  if (!routeState?.points?.length) return null;
  const routeDocument = normalizePersistedRouteDocument(routeState.routeDocument);
  const points = routeDocument ? null : (() => {
    if (routeState.points.length > APP_STATE_MAX_ROUTE_POINTS) return null;
    return routeState.points.map((point) => ({
      lat: point.lat,
      lon: point.lon,
      ele: Number.isFinite(Number(point.ele)) ? Number(point.ele) : null,
      time: point.time || null
    }));
  })();
  if (!routeDocument && !points?.length) return null;
  return {
    fileName: routeState.fileName || 'Route',
    routeSource: routeState.routeSource || null,
    points,
    routeDocument
  };
}

function capturePersistedWeatherSnapshot(): PersistedWeatherSnapshot | null {
  if (!weatherData) return null;
  const provenance = getWeatherDataProvenance(weatherData);
  return {
    data: {
      ...weatherData,
      provenance: {
        ...(provenance || {}),
        kind: provenance?.kind || 'live',
        savedAt: new Date().toISOString()
      }
    },
    savedAt: new Date().toISOString()
  };
}

function capturePersistedAppState(options: { includeRoute?: boolean; includeWeather?: boolean } = {}): PersistedAppState {
  const includeRoute = options.includeRoute !== false;
  const includeWeather = options.includeWeather !== false;
  return {
    schemaVersion: APP_STATE_SCHEMA_VERSION,
    appVersion: APP_VERSION,
    savedAt: new Date().toISOString(),
    inputValue: String(input?.value || ''),
    selectedActivity,
    selectedEventKey,
    selectedDuration,
    checkpointModel,
    startMode,
    raceDayMode,
    manualWeatherPanelOpen,
    temperaturePreference,
    plannedEffort,
    forecastOnlyMode,
    plannerCardCollapsed,
    locationCardCollapsed,
    customDistance: String(customDistanceInput?.value || ''),
    distanceUnit: String(distanceUnitSelect?.value || 'km'),
    customDuration: String(customDurationInput?.value || ''),
    durationUnit: String(durationUnitSelect?.value || 'h'),
    average: String(averageInput?.value || ''),
    averageUnit: String(averageUnitSelect?.value || ''),
    manualWaterTemp: String(manualWaterTempInput?.value || ''),
    waterBodyType: String(waterBodyTypeSelect?.value || 'auto'),
    windExposure: String(windExposureSelect?.value || 'auto'),
    poolType: String(poolTypeSelect?.value || 'indoor_heated'),
    laterInputValue: String(laterInput?.value || ''),
    raceDayStart: String(raceDayStartInput?.value || ''),
    raceDayEnd: String(raceDayEndInput?.value || ''),
    bestWindowStart: String(bestWindowStartInput?.value || ''),
    bestWindowEnd: String(bestWindowEndInput?.value || ''),
    bestWindowPriority: String(bestWindowPrioritySelect?.value || 'best_overall'),
    bestWindowStep: String(bestWindowStepSelect?.value || 'auto'),
    bestWindowMaxPrecip: String(bestWindowMaxPrecipInput?.value || ''),
    bestWindowMaxGust: String(bestWindowMaxGustInput?.value || ''),
    bestWindowMinTemp: String(bestWindowMinTempInput?.value || ''),
    bestWindowMaxTemp: String(bestWindowMaxTempInput?.value || ''),
    bestWindowMinWater: String(bestWindowMinWaterInput?.value || ''),
    bestWindowFinishDaylight: !!bestWindowFinishDaylightInput?.checked,
    customMultisportSelections: cloneMultisportSelections(),
    weatherRefreshStatus: { ...weatherRefreshStatus },
    weather: includeWeather ? capturePersistedWeatherSnapshot() : null,
    route: includeRoute ? capturePersistedRouteSnapshot() : null
  };
}

function clearPersistedAppState() {
  if (appStateSaveTimer) {
    window.clearTimeout(appStateSaveTimer);
    appStateSaveTimer = null;
  }
  try {
    localStorage.removeItem(APP_STATE_STORAGE_KEY);
  } catch {
    // Ignore storage cleanup failures.
  }
}

function savePersistedAppStateNow() {
  const attempts = [
    { includeRoute: true, includeWeather: true },
    { includeRoute: false, includeWeather: true },
    { includeRoute: false, includeWeather: false }
  ];

  for (const attempt of attempts) {
    try {
      const snapshot = capturePersistedAppState(attempt);
      localStorage.setItem(APP_STATE_STORAGE_KEY, JSON.stringify(snapshot));
      persistenceMeta = {
        ...persistenceMeta,
        lastSavedAt: snapshot.savedAt,
        routePersisted: !!snapshot.route,
        weatherPersisted: !!snapshot.weather,
        lastSaveError: ''
      };
      return;
    } catch (error) {
      persistenceMeta = {
        ...persistenceMeta,
        lastSaveError: error instanceof Error ? error.message : 'Unable to save app state'
      };
    }
  }
}

function schedulePersistedAppStateSave() {
  if (appStateSaveTimer) window.clearTimeout(appStateSaveTimer);
  appStateSaveTimer = window.setTimeout(() => {
    appStateSaveTimer = null;
    savePersistedAppStateNow();
  }, 180);
}

function readPersistedAppState(): PersistedAppState | null {
  try {
    const raw = localStorage.getItem(APP_STATE_STORAGE_KEY);
    if (!raw) return null;
    const snapshot = JSON.parse(raw) as PersistedAppState;
    if (!snapshot || snapshot.schemaVersion !== APP_STATE_SCHEMA_VERSION) return null;
    if (isPersistedAppStateVersionCompatible(snapshot)) return snapshot;
    clearPersistedAppState();
    return null;
  } catch {
    return null;
  }
}

function captureRouteCheckpointWeatherState() {
  if (!routeState) return null;
  return {
    weatherCache: cloneSerializable(routeState.weatherCache || {}),
    samples: (routeState.samples || []).map(cp => ({
      id: cp.id,
      pointIndex: cp.pointIndex,
      placeLabel: cp.placeLabel || '',
      weather: cloneSerializable(cp.weather),
      windowWeather: cloneSerializable(cp.windowWeather),
      relativeWind: cloneSerializable(cp.relativeWind),
      ecccAlerts: cloneSerializable(cp.ecccAlerts || []),
      ecccAlertStatus: cp.ecccAlertStatus || ''
    }))
  };
}

function restoreRouteCheckpointWeatherState(snapshot) {
  if (!routeState || !snapshot) return;
  routeState.weatherCache = cloneSerializable(snapshot.weatherCache || {});
  const previousByKey = new Map((snapshot.samples || []).map(cp => [`${cp.id}::${cp.pointIndex}`, cp]));
  (routeState.samples || []).forEach(cp => {
    const previous = previousByKey.get(`${cp.id}::${cp.pointIndex}`);
    if (!previous) return;
    cp.placeLabel = previous.placeLabel || cp.placeLabel;
    cp.weather = cloneSerializable(previous.weather);
    cp.windowWeather = cloneSerializable(previous.windowWeather);
    cp.relativeWind = cloneSerializable(previous.relativeWind);
    cp.ecccAlerts = cloneSerializable(previous.ecccAlerts || []);
    cp.ecccAlertStatus = previous.ecccAlertStatus || '';
  });
}

function restorePersistedAppState(snapshot: PersistedAppState | null = null) {
  const resolvedSnapshot = snapshot || readPersistedAppState();
  if (!resolvedSnapshot) return false;
  snapshot = resolvedSnapshot;
  input.value = String(snapshot.inputValue || '');
  selectedActivity = snapshot.selectedActivity || null;
  selectedEventKey = snapshot.selectedEventKey || null;
  selectedDuration = snapshot.selectedDuration || 'h1';
  checkpointModel = snapshot.checkpointModel === 'old' ? 'old' : 'smart';
  startMode = ['now', 'later', 'best'].includes(snapshot.startMode) ? snapshot.startMode : 'now';
  raceDayMode = !!snapshot.raceDayMode;
  manualWeatherPanelOpen = !!snapshot.manualWeatherPanelOpen;
  temperaturePreference = Number.isFinite(Number(snapshot.temperaturePreference)) ? Number(snapshot.temperaturePreference) : 0;
  plannedEffort = snapshot.plannedEffort || 'steady';
  forecastOnlyMode = !!snapshot.forecastOnlyMode;
  plannerCardCollapsed = !!snapshot.plannerCardCollapsed;
  locationCardCollapsed = !!snapshot.locationCardCollapsed;

  if (customDistanceInput) customDistanceInput.value = String(snapshot.customDistance || '');
  if (distanceUnitSelect) distanceUnitSelect.value = String(snapshot.distanceUnit || 'km');
  if (customDurationInput) customDurationInput.value = String(snapshot.customDuration || '');
  if (durationUnitSelect) durationUnitSelect.value = String(snapshot.durationUnit || 'h');
  if (averageInput) averageInput.value = String(snapshot.average || '');
  if (averageUnitSelect) averageUnitSelect.value = String(snapshot.averageUnit || averageUnitSelect.value || '');
  if (manualWaterTempInput) manualWaterTempInput.value = String(snapshot.manualWaterTemp || '');
  if (waterBodyTypeSelect) waterBodyTypeSelect.value = String(snapshot.waterBodyType || 'auto');
  if (windExposureSelect) windExposureSelect.value = String(snapshot.windExposure || 'auto');
  if (poolTypeSelect) poolTypeSelect.value = String(snapshot.poolType || 'indoor_heated');
  if (laterInput) laterInput.value = String(snapshot.laterInputValue || '');
  if (raceDayStartInput) raceDayStartInput.value = String(snapshot.raceDayStart || '');
  if (raceDayEndInput) raceDayEndInput.value = String(snapshot.raceDayEnd || '');
  if (bestWindowStartInput) bestWindowStartInput.value = String(snapshot.bestWindowStart || '');
  if (bestWindowEndInput) bestWindowEndInput.value = String(snapshot.bestWindowEnd || '');
  if (bestWindowPrioritySelect) bestWindowPrioritySelect.value = String(snapshot.bestWindowPriority || 'best_overall');
  if (bestWindowStepSelect) bestWindowStepSelect.value = String(snapshot.bestWindowStep || 'auto');
  if (bestWindowMaxPrecipInput) bestWindowMaxPrecipInput.value = String(snapshot.bestWindowMaxPrecip || '');
  if (bestWindowMaxGustInput) bestWindowMaxGustInput.value = String(snapshot.bestWindowMaxGust || '');
  if (bestWindowMinTempInput) bestWindowMinTempInput.value = String(snapshot.bestWindowMinTemp || '');
  if (bestWindowMaxTempInput) bestWindowMaxTempInput.value = String(snapshot.bestWindowMaxTemp || '');
  if (bestWindowMinWaterInput) bestWindowMinWaterInput.value = String(snapshot.bestWindowMinWater || '');
  if (bestWindowFinishDaylightInput) bestWindowFinishDaylightInput.checked = !!snapshot.bestWindowFinishDaylight;
  customMultisportSelections = cloneMultisportSelections(snapshot.customMultisportSelections);
  weatherRefreshStatus = {
    ...weatherRefreshStatus,
    ...(snapshot.weatherRefreshStatus || {})
  };

  const restoredRouteDocument = normalizePersistedRouteDocument(snapshot.route?.routeDocument);
  let restoredRoutePoints = [];
  if (restoredRouteDocument) {
    try {
      restoredRoutePoints = parseRouteText(snapshot.route?.fileName || `restored-route.${restoredRouteDocument.format}`, restoredRouteDocument.text);
    } catch {
      restoredRoutePoints = [];
    }
  }
  if (!restoredRoutePoints.length) restoredRoutePoints = normalizePersistedRoutePoints(snapshot.route?.points);
  if (restoredRoutePoints.length >= 2) {
    routeState = buildRouteStateWithSource(
      restoredRoutePoints,
      snapshot.route?.fileName || 'Restored route',
      snapshot.route?.routeSource || null,
      restoredRouteDocument
    );
    clearRouteBtn.style.display = 'inline-block';
    const restoredRouteKind = restoredRouteDocument ? `${restoredRouteDocument.format.toUpperCase()} cache` : 'local app state';
    routeStatus.textContent = `Restored ${routeState.fileName} from ${restoredRouteKind}.`;
    persistenceMeta.restoredRouteFromCache = true;
  }

  const savedAtMs = Date.parse(String(snapshot.weather?.savedAt || ''));
  const weatherAgeMs = Number.isFinite(savedAtMs) ? (Date.now() - savedAtMs) : Infinity;
  const restoreStaleWeatherOffline = !!(snapshot.weather?.data && Number.isFinite(savedAtMs) && weatherAgeMs > APP_STATE_MAX_WEATHER_AGE_MS && isAppOffline());
  if (snapshot.weather?.data && Number.isFinite(savedAtMs) && (weatherAgeMs <= APP_STATE_MAX_WEATHER_AGE_MS || restoreStaleWeatherOffline)) {
    weatherData = setWeatherDataProvenance(snapshot.weather.data, {
      kind: restoreStaleWeatherOffline ? 'cached_stale' : 'cached',
      savedAt: snapshot.weather.savedAt,
      restoredAt: new Date().toISOString()
    });
    setWeatherRefreshStatus({
      state: 'success',
      detail: '',
      error: '',
      lastSuccessAt: snapshot.weather.savedAt
    });
    persistenceMeta.restoredWeatherFromCache = true;
    persistenceMeta.restoredStaleWeatherOffline = restoreStaleWeatherOffline;
  }

  persistenceMeta = {
    ...persistenceMeta,
    restoredAt: new Date().toISOString()
  };

  setSelectedActivityButton(selectedActivity);
  renderCustomControlOptions(true);
  updateRaceDayModeUi();
  updatePlannerCardCollapseUi();
  renderPlannerState();
  updateLocationCardCollapseUi();
  updateWeatherRefreshStatusUi();

  if (routeState?.points?.length) renderRouteMap();
  if (weatherData) {
    configureLaterInput(weatherData);
    renderAdvice(weatherData, selectedActivity);
  }
  return true;
}

function formatSavedSessionSummary(snapshot: PersistedAppState | null) {
  if (!snapshot) return 'A saved planner session is available on this device.';
  const bits = [];
  const savedAt = formatRefreshStatusDateTime(snapshot.savedAt);
  if (savedAt) bits.push(`Saved ${savedAt}`);
  if (snapshot.inputValue) bits.push(`location: ${snapshot.inputValue}`);
  if (snapshot.route?.fileName) bits.push(`route: ${snapshot.route.fileName}`);
  if (snapshot.forecastOnlyMode) bits.push('Forecast only');
  if (snapshot.weather?.savedAt) bits.push('cached weather');
  return bits.length
    ? `${bits.join(' · ')}. Resume it or start with a blank planner.`
    : 'A saved planner session is available on this device. Resume it or start with a blank planner.';
}

function applySharedPlannerState(sharedPlanner) {
  if (!sharedPlanner || typeof sharedPlanner !== 'object') return;
  selectedActivity = typeof sharedPlanner.selectedActivity === 'string' ? sharedPlanner.selectedActivity : null;
  selectedEventKey = typeof sharedPlanner.selectedEventKey === 'string' ? sharedPlanner.selectedEventKey : null;
  selectedDuration = typeof sharedPlanner.selectedDuration === 'string' ? sharedPlanner.selectedDuration : 'h1';
  checkpointModel = sharedPlanner.checkpointModel === 'old' ? 'old' : 'smart';
  startMode = ['now', 'later', 'best'].includes(sharedPlanner.startMode) ? sharedPlanner.startMode : 'now';
  raceDayMode = !!sharedPlanner.raceDayMode;
  manualWeatherPanelOpen = !!sharedPlanner.manualWeatherPanelOpen;
  temperaturePreference = Number.isFinite(Number(sharedPlanner.temperaturePreference)) ? Number(sharedPlanner.temperaturePreference) : 0;
  plannedEffort = typeof sharedPlanner.plannedEffort === 'string' ? sharedPlanner.plannedEffort : 'steady';
  forecastOnlyMode = !!sharedPlanner.forecastOnlyMode;

  if (customDistanceInput) customDistanceInput.value = String(sharedPlanner.customDistance || '');
  if (distanceUnitSelect) distanceUnitSelect.value = String(sharedPlanner.distanceUnit || 'km');
  if (customDurationInput) customDurationInput.value = String(sharedPlanner.customDuration || '');
  if (durationUnitSelect) durationUnitSelect.value = String(sharedPlanner.durationUnit || 'h');
  if (averageInput) averageInput.value = String(sharedPlanner.average || '');
  if (averageUnitSelect) averageUnitSelect.value = String(sharedPlanner.averageUnit || averageUnitSelect.value || '');
  if (manualWaterTempInput) manualWaterTempInput.value = String(sharedPlanner.manualWaterTemp || '');
  if (waterBodyTypeSelect) waterBodyTypeSelect.value = String(sharedPlanner.waterBodyType || 'auto');
  if (windExposureSelect) windExposureSelect.value = String(sharedPlanner.windExposure || 'auto');
  if (poolTypeSelect) poolTypeSelect.value = String(sharedPlanner.poolType || 'indoor_heated');
  if (laterInput) laterInput.value = String(sharedPlanner.laterInputValue || '');
  if (raceDayStartInput) raceDayStartInput.value = String(sharedPlanner.raceDayStart || '');
  if (raceDayEndInput) raceDayEndInput.value = String(sharedPlanner.raceDayEnd || '');
  if (bestWindowStartInput) bestWindowStartInput.value = String(sharedPlanner.bestWindowStart || '');
  if (bestWindowEndInput) bestWindowEndInput.value = String(sharedPlanner.bestWindowEnd || '');
  if (bestWindowPrioritySelect) bestWindowPrioritySelect.value = String(sharedPlanner.bestWindowPriority || 'best_overall');
  if (bestWindowStepSelect) bestWindowStepSelect.value = String(sharedPlanner.bestWindowStep || 'auto');
  if (bestWindowMaxPrecipInput) bestWindowMaxPrecipInput.value = String(sharedPlanner.bestWindowMaxPrecip || '');
  if (bestWindowMaxGustInput) bestWindowMaxGustInput.value = String(sharedPlanner.bestWindowMaxGust || '');
  if (bestWindowMinTempInput) bestWindowMinTempInput.value = String(sharedPlanner.bestWindowMinTemp || '');
  if (bestWindowMaxTempInput) bestWindowMaxTempInput.value = String(sharedPlanner.bestWindowMaxTemp || '');
  if (bestWindowMinWaterInput) bestWindowMinWaterInput.value = String(sharedPlanner.bestWindowMinWater || '');
  if (bestWindowFinishDaylightInput) bestWindowFinishDaylightInput.checked = !!sharedPlanner.bestWindowFinishDaylight;
  customMultisportSelections = cloneMultisportSelections(sharedPlanner.customMultisportSelections);

  setSelectedActivityButton(selectedActivity);
  renderCustomControlOptions(true);
  updateRaceDayModeUi();
  updateManualWeatherToggleUi();
  updateManualWeatherStatus();
  updateCheckpointModelUi();
  updateForecastOnlyModeUi();
  renderPlannerState();
}

async function applySharedPlanFromUrl() {
  if (sharedPlanStateApplied) return false;
  const shared = parseSharedPlanFromUrl();
  if (!shared) return false;
  sharedPlanStateApplied = true;
  pendingStartupSnapshot = null;
  closeStartupSessionPrompt();
  clearStoredEntryIntent();
  clearRoute();
  input.value = shared.place?.name || '';
  applySharedPlannerState(shared.planner);

  if (!shared.place || !isFiniteNumber(shared.place.latitude) || !isFiniteNumber(shared.place.longitude)) {
    setShareStatus('Shared planner settings loaded. Uploaded routes and imported provider routes stay local-only, so no route data was included in this link.');
    if (!weatherData) refreshIndoorAdviceIfNeeded();
    return true;
  }

  try {
    await fetchWeatherFromResult({
      latitude: Number(shared.place.latitude),
      longitude: Number(shared.place.longitude),
      name: shared.place.name || 'Shared location',
      admin1: '',
      country: '',
      country_code: shared.place.countryCode || ''
    });
    applySharedPlannerState(shared.planner);
    setShareStatus('Shared planner link loaded. Route files and imported provider routes are intentionally excluded from share links to keep size, privacy, and provider permissions under control.');
  } catch (error) {
    applySharedPlannerState(shared.planner);
    setShareStatus(error instanceof Error ? `Shared planner settings loaded, but the weather refresh failed: ${error.message}` : 'Shared planner settings loaded, but the weather refresh failed.', 'error');
  }
  return true;
}

function openStartupSessionPrompt(snapshot: PersistedAppState) {
  pendingStartupSnapshot = snapshot;
  if (startupSessionSummary) startupSessionSummary.textContent = formatSavedSessionSummary(snapshot);
  if (!startupSessionOverlay) return;
  startupSessionOverlay.hidden = false;
  document.body.classList.add('helper-open');
  resumeSessionBtn?.focus({ preventScroll: true });
}

function closeStartupSessionPrompt() {
  if (!startupSessionOverlay) return;
  startupSessionOverlay.hidden = true;
  document.body.classList.remove('helper-open');
}

function resumePreviousSession() {
  const snapshot = pendingStartupSnapshot;
  pendingStartupSnapshot = null;
  closeStartupSessionPrompt();
  restorePersistedAppState(snapshot);
  renderStravaConnectionStateEnhanced();
  updateRouteHeaderActions();
}

function startFreshSession() {
  pendingStartupSnapshot = null;
  closeStartupSessionPrompt();
  clearPersistedAppState();
  setShareStatus('');
  persistenceMeta = {
    ...persistenceMeta,
    lastSavedAt: '',
    restoredAt: '',
    routePersisted: false,
    weatherPersisted: false,
    restoredWeatherFromCache: false,
    restoredStaleWeatherOffline: false,
    restoredRouteFromCache: false,
    lastSaveError: ''
  };
  updateConnectivityStatusUi();
}

function initializeStartupState() {
  if (parseSharedPlanFromUrl()) return;
  const snapshot = readPersistedAppState();
  const startupIntent = getStartupEntryIntent();
  if (snapshot && !startupIntent) {
    openStartupSessionPrompt(snapshot);
    return;
  }
  if (snapshot && startupIntent) {
    persistenceMeta = {
      ...persistenceMeta,
      lastSavedAt: snapshot.savedAt || '',
      routePersisted: !!snapshot.route,
      weatherPersisted: !!snapshot.weather
    };
  }
}

function triggerDiagnosticsExport() {
  const session = getStravaSession();
  const plannerDiagnostics = buildPlannerSourceDiagnostics();
  const payload = {
    exportedAt: new Date().toISOString(),
    appVersion: APP_VERSION,
    persistence: {
      ...persistenceMeta,
      activeEntryIntent: getStartupEntryIntent(),
    },
    weather: weatherData ? {
      locationName: weatherData.locationName,
      latitude: weatherData.latitude,
      longitude: weatherData.longitude,
      timezone: weatherData.timezone,
      currentTime: weatherData.currentTime,
      countryCode: weatherData.countryCode,
      marineSource: weatherData.marineSource,
      ecccAlertStatus: weatherData.ecccAlertStatus,
      alertCount: Array.isArray(weatherData.ecccAlerts) ? weatherData.ecccAlerts.length : 0,
      hourlyPoints: Array.isArray(weatherData.hourly) ? weatherData.hourly.length : 0,
      dailyPoints: Array.isArray(weatherData.daily) ? weatherData.daily.length : 0,
      provenance: getWeatherDataProvenance(weatherData),
      refreshStatus: weatherRefreshStatus
    } : null,
    route: routeState ? {
      cacheDocument: normalizePersistedRouteDocument(routeState.routeDocument) ? {
        format: routeState.routeDocument.format,
        source: routeState.routeDocument.source,
        length: routeState.routeDocument.text.length
      } : null,
      fileName: routeState.fileName,
      pointCount: routeState.points?.length || 0,
      totalKm: round1(routeState.totalKm || 0),
      totalGainMeters: Math.round(routeState.totalGain || 0),
      elapsedMinutes: routeState.elapsedMinutes,
      timedPointCount: routeState.timedPointCount,
      checkpointModel,
      checkpointCount: routeState.samples?.length || 0,
      weatherCacheEntries: Object.keys(routeState.weatherCache || {}).length,
      source: routeState.routeSource || { provider: 'manual', kind: 'route' }
    } : null,
    planner: {
      selectedActivity,
      selectedEventKey,
      selectedDuration,
      checkpointModel,
      startMode,
      raceDayMode,
      manualWeatherPanelOpen,
      temperaturePreference,
      plannedEffort,
      forecastOnlyMode,
      plannerCardCollapsed,
      locationCardCollapsed,
      customDistance: String(customDistanceInput?.value || ''),
      customDuration: String(customDurationInput?.value || ''),
      average: String(averageInput?.value || ''),
      manualWaterTemp: String(manualWaterTempInput?.value || ''),
      plannerSources: plannerDiagnostics
    },
    strava: {
      connected: !!session,
      athleteName: session?.athleteName || '',
      expiresAt: session?.expiresAt || null,
      authError: getStravaAuthError(),
      pickerTab: stravaPickerTab,
      cachedRoutes: stravaPickerRoutes.length,
      cachedActivities: stravaPickerActivities.length
    },
    warnings: {
      dismissedWarningStateSupported: false,
      dismissedWarningCount: 0
    }
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `forecast-fit-diagnostics-${new Date().toISOString().replace(/[:]/g, '-').slice(0, 19)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function openSharePanel() {
  if (!shareOverlay) return;
  setSharePanelError('');
  shareOverlay.hidden = false;
  document.body.classList.add('helper-open');
  shareCloseBtn?.focus({ preventScroll: true });
}

function closeSharePanel() {
  if (!shareOverlay) return;
  setSharePanelError('');
  shareOverlay.hidden = true;
  document.body.classList.remove('helper-open');
}

async function triggerSharePlan() {
  if (!selectedActivity && !weatherData && !resultInner?.innerHTML?.trim()) {
    setSharePanelError('Build a plan first, then share it.');
    return;
  }
  const shareUrl = buildSharedPlanUrl();
  const summary = getShareablePlace()
    ? 'Shared link copied. It includes planner state plus a re-fetchable location, but keeps uploaded routes, imported provider routes, and raw weather data local-only.'
    : 'Shared link copied. It includes planner state only; routes and provider-import data stay local-only and are not included.';
  setSharePanelError('');

  try {
    if (navigator.share) {
      await navigator.share({
        title: 'Forecast Fit plan',
        text: 'Forecast Fit shared planner link',
        url: shareUrl
      });
      setShareStatus(summary);
      return;
    }
  } catch (error) {
    if (error?.name === 'AbortError') return;
  }

  try {
    await navigator.clipboard.writeText(shareUrl);
    setShareStatus(summary);
  } catch {
    window.prompt('Copy this Forecast Fit share link:', shareUrl);
    setShareStatus('Share link generated. It was opened in a copy prompt because clipboard access was not available.');
  }
}

function triggerSharePackageExport() {
  if (!selectedActivity && !weatherData && !routeState?.points?.length && !resultInner?.innerHTML?.trim()) {
    setSharePanelError('Build a plan first, then export its share JSON.');
    return;
  }
  setSharePanelError('');
  const text = buildSharedPlanPackageText();
  if (shareParamsInput) shareParamsInput.value = text;
  const blob = new Blob([text], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `forecast-fit-share-${new Date().toISOString().replace(/[:]/g, '-').slice(0, 19)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  setShareStatus(routeState?.points?.length
    ? 'Share JSON exported. It can include planner state, route data, and any still-usable saved weather; the same JSON was also placed in the sharing panel for copy/paste.'
    : 'Share JSON exported. It can include planner state and any still-usable saved weather; the same JSON was also placed in the sharing panel for copy/paste.');
}

function triggerSharePackageImportPicker() {
  shareImportFileInput?.click();
}

async function applySharePackageText(rawText: string, sourceLabel = 'Imported share package') {
  const snapshot = parseImportedShareSnapshot(rawText);
  if (!snapshot) {
    throw new Error('That text is not a valid Forecast Fit share JSON package.');
  }
  await applyImportedShareSnapshot(snapshot, sourceLabel);
  closeSharePanel();
}

async function triggerSharePackageJsonImport() {
  try {
    await applySharePackageText(String(shareParamsInput?.value || '').trim(), 'Pasted share package');
  } catch (error) {
    setSharePanelError(error instanceof Error ? error.message : 'Unable to import that share JSON.');
    setShareStatus(error instanceof Error ? error.message : 'Unable to import that share JSON.', 'error');
  }
}

async function handleSharePackageFileInput(event: Event) {
  const inputNode = event.target as HTMLInputElement | null;
  const file = inputNode?.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    if (shareParamsInput) shareParamsInput.value = text;
    await applySharePackageText(text, `Imported ${file.name}`);
  } catch (error) {
    setSharePanelError(error instanceof Error ? error.message : 'Unable to import that JSON file.');
    setShareStatus(error instanceof Error ? error.message : 'Unable to import that JSON file.', 'error');
  } finally {
    if (inputNode) inputNode.value = '';
  }
}

function triggerPlanExport() {
  if (!resultInner?.innerHTML?.trim()) {
    showError('Load a forecast or plan first, then export it.');
    return;
  }
  const exportWindow = window.open('', '_blank', 'noopener');
  if (!exportWindow) {
    showError('The browser blocked the export window. Allow pop-ups for this site and try again.');
    return;
  }
  hideError();
  const activityLabel = selectedActivity ? activityLabels[selectedActivity] || selectedActivity : 'Activity not selected';
  const plannerDiagnostics = buildPlannerSourceDiagnostics();
  const routeSummaryText = routeState?.points?.length ? (routeSummary?.textContent || '') : '';
  const connectivityText = getConnectivityStatusText();
  const exportedAt = formatRefreshStatusDateTime(new Date().toISOString());
  const exportMarkup = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Forecast Fit plan export</title>
<style>
  :root { color-scheme: light; --bg:#f6f3eb; --surface:#fffdf8; --ink:#213547; --soft:#5a6978; --line:#d7d0c2; --accent:#3b4d65; --warn:#9d6b24; }
  * { box-sizing: border-box; }
  body { margin:0; padding:24px; background:var(--bg); color:var(--ink); font:16px/1.5 "DM Sans", system-ui, sans-serif; }
  .shell { max-width:980px; margin:0 auto; }
  .toolbar { display:flex; gap:12px; flex-wrap:wrap; margin:0 0 18px; }
  .toolbar button { border:1px solid var(--line); background:var(--surface); color:var(--ink); border-radius:999px; padding:10px 14px; font:600 14px/1 "DM Sans", system-ui, sans-serif; cursor:pointer; }
  .panel { background:var(--surface); border:1px solid var(--line); border-radius:18px; padding:18px; margin:0 0 16px; }
  h1 { margin:0 0 6px; font-size:2rem; }
  h2 { margin:0 0 10px; font-size:1.05rem; }
  p { margin:0 0 10px; }
  .muted { color:var(--soft); }
  .chips { display:flex; flex-wrap:wrap; gap:8px; margin:12px 0 0; }
  .chip { border:1px solid var(--line); border-radius:999px; padding:5px 10px; font:12px/1.3 "DM Mono", monospace; color:var(--soft); background:#fff; }
  .offline { color:var(--warn); }
  .export-content button, .export-content [role="button"], .export-content input, .export-content select { display:none !important; }
  .export-content .helper-overlay, .export-content .wizard-actions-inline, .export-content .summary-action-row .wizard-actions-inline { display:none !important; }
  @media print {
    body { background:#fff; padding:0; }
    .toolbar { display:none !important; }
    .panel { border:none; border-radius:0; padding:0; margin:0 0 14px; }
  }
</style>
</head>
<body>
  <div class="shell">
    <div class="toolbar">
      <button type="button" onclick="window.print()">Print / Save PDF</button>
      <button type="button" onclick="window.close()">Close</button>
    </div>
    <section class="panel">
      <h1>Forecast Fit plan export</h1>
      <p class="muted">Exported ${escapeHtml(exportedAt || new Date().toLocaleString())} · v${escapeHtml(APP_VERSION)}</p>
      ${connectivityText ? `<p class="offline"><strong>${escapeHtml(connectivityText)}</strong></p>` : ''}
      <div class="chips">
        <span class="chip">${escapeHtml(activityLabel)}</span>
        ${weatherData?.locationName ? `<span class="chip">${escapeHtml(weatherData.locationName)}</span>` : ''}
        ${plannerDiagnostics.distance?.label ? `<span class="chip">${escapeHtml(plannerDiagnostics.distance.label)}</span>` : ''}
        ${plannerDiagnostics.duration?.label ? `<span class="chip">${escapeHtml(plannerDiagnostics.duration.label)}</span>` : ''}
        ${routeSummaryText ? `<span class="chip">${escapeHtml(routeSummaryText)}</span>` : ''}
      </div>
    </section>
    <section class="panel">
      <h2>Current plan</h2>
      <div class="export-content">${resultInner.innerHTML}</div>
    </section>
  </div>
</body>
</html>`;
  exportWindow.document.open();
  exportWindow.document.write(exportMarkup);
  exportWindow.document.close();
}

function showResultLoading() {
  resultCard.style.display = 'block';
  resultInner.innerHTML = repairDisplayMarkup(`
    <div class="skeleton" style="width:42%;height:12px"></div>
    <div class="skeleton" style="width:72%;height:44px;margin-top:12px"></div>
    <div class="skeleton" style="width:100%;height:180px;margin-top:18px"></div>
    <div class="skeleton" style="width:100%;height:120px;margin-top:18px"></div>
    <div class="skeleton" style="width:100%;height:120px;margin-top:12px"></div>
  `);
}

function setLoading(isLoading) {
  if (fetchBtn) {
    fetchBtn.disabled = isLoading;
    fetchBtn.innerHTML = isLoading ? '<span class="spinner"></span>Fetchingâ€¦' : 'Refresh';
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

countryFlag = countryFlagFromModule;
weatherIconHtml = (code, className = 'icon') => weatherIconHtmlFromModule(code, className);
const renderSymbolIconHtml = (symbol, className = 'inline-symbol-icon', label, decorative = true) =>
  renderSymbolIconHtmlFromModule(symbol, className, label, decorative);
const renderLeadingEmojiLabel = (value, className = 'inline-symbol-icon') =>
  renderLeadingEmojiLabelFromModule(value, className);
const upgradeEmojiMarkup = (html) => {
  const replacements = [
    ['ðŸ· ', `${renderSymbolIconHtml('ðŸ·', 'inline-symbol-icon', 'Activity', true)} `],
    ['Ã°Å¸Â· ', `${renderSymbolIconHtml('ðŸ·', 'inline-symbol-icon', 'Activity', true)} `],
    ['ðŸ  ', `${renderSymbolIconHtml('ðŸ ', 'inline-symbol-icon', 'Indoor', true)} `],
    ['Ã°Å¸ÂÂ  ', `${renderSymbolIconHtml('ðŸ ', 'inline-symbol-icon', 'Indoor', true)} `],
    ['ðŸŒŠ ', `${renderSymbolIconHtml('ðŸŒŠ', 'inline-symbol-icon', 'Water', true)} `],
    ['Ã°Å¸Å’Å  ', `${renderSymbolIconHtml('ðŸŒŠ', 'inline-symbol-icon', 'Water', true)} `],
    ['âš ï¸', renderSymbolIconHtml('âš ï¸', 'wi', 'Warning', true)],
    ['Ã¢Å¡Â Ã¯Â¸Â', renderSymbolIconHtml('âš ï¸', 'wi', 'Warning', true)],
    ['ðŸ’§ ', `${renderSymbolIconHtml('ðŸ’¦', 'inline-symbol-icon', 'Humidity', true)} `],
    ['Ã°Å¸â€™Â§ ', `${renderSymbolIconHtml('ðŸ’¦', 'inline-symbol-icon', 'Humidity', true)} `],
    ['ðŸ’¨ ', `${renderSymbolIconHtml('ðŸ’¨', 'inline-symbol-icon', 'Wind', true)} `],
    ['Ã°Å¸â€™Â¨ ', `${renderSymbolIconHtml('ðŸ’¨', 'inline-symbol-icon', 'Wind', true)} `],
    ['ðŸŒ§ ', `${renderSymbolIconHtml('ðŸŒ§ï¸', 'inline-symbol-icon', 'Precipitation', true)} `],
    ['Ã°Å¸Å’Â§ ', `${renderSymbolIconHtml('ðŸŒ§ï¸', 'inline-symbol-icon', 'Precipitation', true)} `],
    ['â˜€ ', `${renderSymbolIconHtml('â˜€ï¸', 'inline-symbol-icon', 'UV', true)} `],
    ['Ã¢Ëœâ‚¬ ', `${renderSymbolIconHtml('â˜€ï¸', 'inline-symbol-icon', 'UV', true)} `],
    ['ðŸ“ ', `${renderSymbolIconHtml('ðŸŒ', 'inline-symbol-icon', 'Location', true)} `],
    ['Ã°Å¸â€œÂ ', `${renderSymbolIconHtml('ðŸŒ', 'inline-symbol-icon', 'Location', true)} `],
  ];
  let upgraded = String(html ?? '');
  for (const [needle, replacement] of replacements) {
    upgraded = upgraded.split(needle).join(replacement);
  }
  return upgraded;
};

const repairDisplayMarkup = (html) => {
  const replacements = [
    ['\u{1F3F7}\uFE0F ', `${renderSymbolIconHtml('\u{1F3F7}\uFE0F', 'inline-symbol-icon', 'Activity', true)} `],
    ['\u{1F3E0} ', `${renderSymbolIconHtml('\u{1F3E0}', 'inline-symbol-icon', 'Indoor', true)} `],
    ['\u{1F30A} ', `${renderSymbolIconHtml('\u{1F30A}', 'inline-symbol-icon', 'Water', true)} `],
    ['\u26A0\uFE0F', renderSymbolIconHtml('\u26A0\uFE0F', 'wi', 'Warning', true)],
    ['\u{1F4A6} ', `${renderSymbolIconHtml('\u{1F4A6}', 'inline-symbol-icon', 'Humidity', true)} `],
    ['\u{1F4A8} ', `${renderSymbolIconHtml('\u{1F4A8}', 'inline-symbol-icon', 'Wind', true)} `],
    ['\u{1F327}\uFE0F ', `${renderSymbolIconHtml('\u{1F327}\uFE0F', 'inline-symbol-icon', 'Precipitation', true)} `],
    ['\u2600\uFE0F ', `${renderSymbolIconHtml('\u2600\uFE0F', 'inline-symbol-icon', 'UV', true)} `],
    ['\u{1F4CD} ', `${renderSymbolIconHtml('\u{1F30D}', 'inline-symbol-icon', 'Location', true)} `],
    ['\u{1F30D} ', `${renderSymbolIconHtml('\u{1F30D}', 'inline-symbol-icon', 'Location', true)} `],
  ];
  let upgraded = normalizeDisplayTextFromModule(html);
  for (const [needle, replacement] of replacements) {
    upgraded = upgraded.split(needle).join(replacement);
  }
  return upgraded;
};

function normalizeElementTextAttributes(node) {
  if (!(node instanceof Element)) return;
  ['title', 'aria-label', 'placeholder'].forEach((attr) => {
    const value = node.getAttribute(attr);
    if (!value) return;
    const nextValue = normalizeDisplayTextFromModule(value);
    if (nextValue !== value) node.setAttribute(attr, nextValue);
  });
}

function normalizeVisibleText(root = document.body) {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ALL);
  let current = walker.currentNode;
  while (current) {
    if (current.nodeType === Node.TEXT_NODE) {
      const value = current.nodeValue || '';
      const nextValue = normalizeDisplayTextFromModule(value);
      if (nextValue !== value) current.nodeValue = nextValue;
    } else if (current.nodeType === Node.ELEMENT_NODE) {
      normalizeElementTextAttributes(current);
    }
    current = walker.nextNode();
  }
}

function installDisplayTextRepairObserver() {
  normalizeVisibleText(document.body);
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'characterData') {
        const value = mutation.target.nodeValue || '';
        const nextValue = normalizeDisplayTextFromModule(value);
        if (nextValue !== value) mutation.target.nodeValue = nextValue;
        continue;
      }
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const value = node.nodeValue || '';
          const nextValue = normalizeDisplayTextFromModule(value);
          if (nextValue !== value) node.nodeValue = nextValue;
          return;
        }
        if (node.nodeType === Node.ELEMENT_NODE) normalizeVisibleText(node);
      });
    }
  });
  observer.observe(document.body, { childList: true, characterData: true, subtree: true });
}

if (document.body) installDisplayTextRepairObserver();
else window.addEventListener('DOMContentLoaded', () => installDisplayTextRepairObserver(), { once: true });

function degreesToCompass(deg) {
  if (!isFiniteNumber(deg)) return 'Variable';
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  return dirs[Math.round((((deg % 360) + 360) % 360) / 22.5) % 16];
}

function windDirectionHtml(deg, className = 'wind-dir-inline', showText = true) {
  if (!isFiniteNumber(deg)) return `<span class="${escapeHtml(className)}" title="Variable wind" aria-label="Variable wind"><span class="wind-dir-arrow">â†»</span>${showText ? '<span>Var.</span>' : ''}</span>`;
  const compass = degreesToCompass(deg);
  const safeDeg = Math.round((((deg % 360) + 360) % 360));
  const label = `Wind direction ${compass} (${safeDeg}Â°)`;
  return `<span class="${escapeHtml(className)}" title="${escapeHtml(label)}" aria-label="${escapeHtml(label)}"><span class="wind-dir-arrow" style="transform: rotate(${safeDeg}deg)">â†‘</span>${showText ? `<span>${escapeHtml(compass)}</span>` : ''}</span>`;
}

function formatWindTooltip(speed, gusts, dir) {
  const speedText = isFiniteNumber(speed) ? `${Math.round(speed)} km/h` : 'â€”';
  const gustText = isFiniteNumber(gusts) ? `${Math.round(gusts)} km/h` : 'â€”';
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
    ? `${Math.round(firstFinite(cp.windowWeather.feelsMin, w.feels))}Â° to ${Math.round(firstFinite(cp.windowWeather.feelsMax, w.feels))}Â° feels · gusts up to ${Math.round(firstFinite(cp.windowWeather.maxGust, w.gusts, 0))} km/h`
    : null;
  const routeWind = cp.relativeWind?.short ? `<span class="popup-muted">${escapeHtml(cp.relativeWind.short)}</span>` : '';
  return `
    <div class="route-popup">
      <div class="popup-head"><strong>${escapeHtml(cp.label)}</strong><span class="popup-muted popup-km">${escapeHtml(formatKmPrefix(cp.kmFromStart))}</span></div>
      <span class="popup-place">${escapeHtml(place)}</span>
      ${cp.eta ? `<span class="popup-eta">ETA ${escapeHtml(formatShortDateTime(cp.eta))}</span>` : ''}
      ${reasonLine}
      <div class="popup-row"><span class="popup-row-left">${weatherIconHtml(w.code, 'cp-icon')} <span>${escapeHtml(desc)}</span></span><span class="popup-row-right"><span>${Math.round(w.temp)}Â°C</span><span class="popup-muted">feels ${Math.round(w.feels)}Â°C</span></span></div>
      <div class="popup-row"><span class="popup-row-left"><span>ðŸ’¨ ${windBits.speedText}</span>${windBits.dirHtml}</span><span class="popup-row-right"><span>â†¯ Gusts ${windBits.gustText}</span></span></div>
      <div class="popup-row"><span class="popup-row-left"><span>ðŸŒ§ ${Math.round(w.precipProb || 0)}%</span></span><span class="popup-row-right">${routeWind}</span></div>
      ${isFiniteNumber(w.aqi) ? `<div class="popup-row"><span class="popup-row-left"><span>ðŸ˜· ${renderAqiBadge(w.aqi, true)}</span></span></div>` : ''}
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
  const durationState = getDurationState(getSelectedEvent());
  const routeName = routeState.fileName || 'this route';
  const routeLabel = `${routeName}${routeState.totalKm > 0 ? ` (${formatKm(routeState.totalKm)})` : ''}`;
  const timingLabel = routeHasDurationOverride()
    ? `using the route's recorded ${formatMinutesShort(routeState.elapsedMinutes)}`
    : durationState?.label
      ? `for your planned ${durationState.label}`
      : '';
  if (!samples.length) return `<div class="route-callout">${escapeHtml(routeLabel)} is loaded. Add checkpoints to compare the start forecast with the weather farther along the route.</div>`;
  if (!hasPlannedDurationSelection()) return `<div class="route-callout">${escapeHtml(routeLabel)} is loaded. Set a planned duration so the checkpoints line up with when you expect to reach each part of the route.</div>`;

  const summary = ready.length ? (() => {
    const feels = ready
      .flatMap(cp => [firstFinite(cp.windowWeather?.feelsMin, cp.weather?.feels), firstFinite(cp.windowWeather?.feelsMax, cp.weather?.feels)])
      .filter(isFiniteNumber);
    const winds = ready.map(cp => firstFinite(cp.windowWeather?.maxWind, cp.weather?.wind)).filter(isFiniteNumber);
    const precips = ready.map(cp => firstFinite(cp.windowWeather?.maxPrecipProb, cp.weather?.precipProb)).filter(isFiniteNumber);
    const uvs = ready.map(cp => firstFinite(cp.windowWeather?.maxUv, cp.weather?.uv)).filter(isFiniteNumber);
    const bits = [];
    if (feels.length) bits.push(`lowest feels-like ${Math.round(Math.min(...feels))}Â°C`);
    if (winds.length) bits.push(`peak wind ${Math.round(Math.max(...winds))} km/h`);
    if (precips.length) bits.push(`max precip ${Math.round(Math.max(...precips))}%`);
    if (uvs.length) bits.push(`peak UV ${formatUvValue(Math.max(...uvs))}`);
    return bits.join(' · ');
  })() : 'Loading checkpoint weatherâ€¦';

  return `
    <div class="block-title">Route checkpoints</div>
    <div class="route-callout">${escapeHtml(routeLabel)} is being timed ${escapeHtml(timingLabel || 'along the route')}. These checkpoints are meant to catch where conditions drift away from the start forecast later in the outing.${summary ? `<br><strong>Along this route:</strong> ${summary}` : ''}</div>
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
            bits.push(`${Math.round(cp.windowWeather.feelsMin)}Â° to ${Math.round(cp.windowWeather.feelsMax)}Â° feels`);
          }
          if (isFiniteNumber(cp.windowWeather.maxGust)) bits.push(`gusts up to ${Math.round(cp.windowWeather.maxGust)} km/h`);
          if (isFiniteNumber(cp.windowWeather.maxPrecipProb) && cp.windowWeather.maxPrecipProb >= 10) bits.push(`precip up to ${Math.round(cp.windowWeather.maxPrecipProb)}%`);
          if (isFiniteNumber(cp.windowWeather.maxUv) && cp.windowWeather.maxUv >= 3) bits.push(`UV up to ${formatUvValue(cp.windowWeather.maxUv)}`);
          return bits.join(' · ');
        })() : '';
        return `
          <div class="route-weather-cell">
            <div class="cp">${escapeHtml(cp.label)}</div>
            <div class="cp-main">${escapeHtml(formatKmPrefix(cp.kmFromStart))} ${w ? weatherIconHtml(w.code, 'cp-icon') : '<span class="cp-icon" aria-hidden="true">â€¦</span>'}</div>
            <div class="cp-place">${escapeHtml(cp.placeLabel || 'Nearby area')}</div>
            <div class="cp-sub">ETA ${cp.eta ? escapeHtml(formatShortDateTime(cp.eta)) : 'â€”'}${reasonLine ? `<br>${escapeHtml(reasonLine)}` : ''}</div>
            ${w ? `
              <div class="cp-temp">${Math.round(w.temp)}Â° · feels ${Math.round(w.feels)}Â°</div>
              <div class="cp-humidity">${renderSymbolIconHtml('ðŸ’§', 'inline-symbol-icon', 'Humidity', true)} ${isFiniteNumber(w.humidity) ? `${Math.round(w.humidity)}% RH` : 'â€”'}</div>
              <div class="cp-meta">${renderSymbolIconHtml('ðŸ’¨', 'inline-symbol-icon', 'Wind', true)} ${Math.round(w.wind || 0)} km/h ${windDirectionHtml(w.windDir, 'wind-dir-inline', true)}${escapeHtml(routeWind)}<br>â†¯ gusts ${isFiniteNumber(w.gusts) ? Math.round(w.gusts) : 'â€”'} km/h${isFiniteNumber(w.uv) ? `<br>${renderSymbolIconHtml('â˜€ï¸', 'inline-symbol-icon', 'UV', true)} ${renderUvBadge(w.uv, true)}` : ''}${isFiniteNumber(w.aqi) ? `<br>${renderSymbolIconHtml('ðŸ˜·', 'inline-symbol-icon', 'AQI', true)} ${renderAqiBadge(w.aqi, true)}` : ''}<br>${renderSymbolIconHtml('ðŸŒ§ï¸', 'inline-symbol-icon', 'Precipitation', true)} ${Math.round(w.precipProb || 0)}%${windowBits ? `<br>${escapeHtml(windowBits)}` : ''}</div>
            ` : `<div class="cp-temp">Loadingâ€¦</div>`}
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
  return { value: uv, label: category, icon: 'â˜€ï¸', ...byCategory[category] };
}

function formatUvValue(value) {
  const uv = firstFinite(value, null);
  return isFiniteNumber(uv) ? round1(uv) : 'â€”';
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
    ? `Peak UV ${formatUvValue(info.value)} (${info.label.toLowerCase()}). ECCC guidance treats this as extra/full precautions territory: avoid the strongest sun around 11:00â€“15:00 when possible, use shade, sunglasses, sunscreen, and skin coverage.`
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
    if (!wizard.chips.some(chip => /^â˜€ï¸ UV/.test(String(chip.label || '')))) {
      wizard.chips.push({ label: `â˜€ï¸ UV ${formatUvValue(uvInfo.value)} · ${uvInfo.label}`, tone: `uv-${uvInfo.className}` });
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
  if (!wizard.chips.some(chip => /^ðŸ’¨ AQI/.test(String(chip.label || '')))) {
    wizard.chips.push({ label: `ðŸ’¨ AQI ${aqiInfo.value} · ${aqiInfo.category}`, tone: `aqi-${aqiInfo.className}` });
  }
  if (aqiInfo.value >= 101) {
    addItemToWizardStep(wizard, { label: 'Air quality mask', detail: `AQI ${aqiInfo.value} (${aqiInfo.category}) â€” consider an N95/KN95 mask for prolonged outdoor effort.` });
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
    return { level: 'purple', icon: 'ðŸ˜·', title: `${info.category} air quality`, detail: `Peak AQI around ${info.value}. Avoid prolonged outdoor exertion. N95/KN95 mask recommended if going out.` };
  }
  if (info.value >= 151) {
    return { level: 'red', icon: 'ðŸ˜·', title: 'Unhealthy air quality', detail: `Peak AQI around ${info.value}. Everyone may experience health effects. Reduce prolonged outdoor effort and consider a mask.` };
  }
  return { level: 'orange', icon: 'ðŸ˜·', title: 'Unhealthy for Sensitive Groups', detail: `Peak AQI around ${info.value}. Sensitive individuals (asthma, heart/lung conditions) should reduce prolonged outdoor exertion.` };
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
    return { level: info.className === 'extreme' ? 'purple' : 'red', icon: 'â˜€ï¸', title: `${info.label} UV exposure`, detail: `Peak UV around ${formatUvValue(maxUv)}. Follow ECCC sun-safety guidance: avoid the strongest sun around 11:00â€“15:00 when possible, seek shade, wear sunglasses, use sunscreen, and cover skin.` };
  }
  return { level: 'orange', icon: 'â˜€ï¸', title: 'High UV exposure', detail: `Peak UV around ${formatUvValue(maxUv)}. ECCC guidance says protection is required: reduce midday exposure, seek shade, cover up, wear sunglasses, and use sunscreen.` };
}

function getRouteUvHazardWarning(samples = []) {
  const ready = (samples || []).filter(cp => cp.weather);
  if (!ready.length || !isOutdoorUvRelevantActivity(selectedActivity)) return null;
  const maxUv = Math.max(...ready.map(cp => firstFinite(cp.windowWeather?.maxUv, cp.weather?.uv, 0)));
  const info = getUvRiskInfo(maxUv);
  if (!info || info.value < 6) return null;
  return {
    level: info.value >= 8 ? (info.className === 'extreme' ? 'purple' : 'red') : 'orange',
    icon: 'â˜€ï¸',
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
    warnings.push({ level: 'severe', icon: 'â›ˆï¸', title: 'Thunderstorm risk in the planned window', detail: 'Consider changing the timing or route rather than trying to solve this with clothing.' });
  }
  if (maxGust >= 55 || maxWind >= 40) {
    warnings.push({ level: 'severe', icon: 'ðŸ’¨', title: 'Strong wind / gust warning', detail: `Peak gusts around ${Math.round(maxGust)} km/h. Exposed cycling, paddling, swimming, and trail sections deserve extra caution.` });
  } else if (maxGust >= 38) {
    warnings.push({ level: 'warn', icon: 'ðŸ’¨', title: 'Gusty conditions', detail: `Gusts may reach about ${Math.round(maxGust)} km/h. Secure loose layers and expect colder-feeling exposed sections.` });
  }
  if (maxPrecipProb >= 75 || maxPrecip >= 3) {
    warnings.push({ level: 'warn', icon: 'ðŸŒ§ï¸', title: 'High precipitation risk', detail: `Rain risk peaks near ${Math.round(maxPrecipProb)}%${maxPrecip > 0 ? ` with up to ${round1(maxPrecip)} mm in a slice` : ''}. Waterproofing, traction, and dry backup layers matter.` });
  }
  if (codes.some(code => isSnowy(code))) {
    warnings.push({ level: 'warn', icon: 'â„ï¸', title: 'Snow / mixed winter precipitation possible', detail: 'Prioritize traction, visibility, hands, and a warmer backup layer.' });
  }
  return warnings;
}

function renderGenericWarningList(warnings, note, ariaLabel = 'Weather warnings') {
  if (!warnings.length) return '';
  return `
    <div class="forecast-warning-list" role="note" aria-label="${escapeHtml(ariaLabel)}">
      ${warnings.slice(0, 5).map(w => `
        <div class="forecast-warning-item ${escapeHtml(w.level === 'severe' ? 'severe' : (w.level || ''))}">
          ${renderSymbolIconHtml(w.icon, 'forecast-warning-icon', w.title, true)}
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
  if (hasStorm) warnings.push({ level: 'severe', icon: 'â›ˆï¸', title: 'Route checkpoint thunderstorm risk', detail: 'One or more checkpoints look stormy. Consider changing the route or timing.' });
  if (maxGust >= 55 || maxWind >= 40) warnings.push({ level: 'severe', icon: 'ðŸ’¨', title: 'Route checkpoint wind warning', detail: `A checkpoint may see gusts near ${Math.round(maxGust)} km/h.` });
  else if (maxGust >= 38) warnings.push({ level: 'warn', icon: 'ðŸ’¨', title: 'Route checkpoint gusts', detail: `Peak checkpoint gusts may reach about ${Math.round(maxGust)} km/h.` });
  if (maxPrecipProb >= 75 || maxPrecip >= 3) warnings.push({ level: 'warn', icon: 'ðŸŒ§ï¸', title: 'Route checkpoint precipitation risk', detail: `Checkpoint precip risk peaks near ${Math.round(maxPrecipProb)}%${maxPrecip > 0 ? ` with up to ${round1(maxPrecip)} mm in a slice` : ''}.` });
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
  const raceDayWindow = null;

  if (activity === 'cycling' || activity === 'triathlon' || activity === 'duathlon' || activity === 'cross_triathlon') {
    if (!light?.isDay) return item('Clear-lens cycling glasses', 'Best for dark starts, bugs, and keeping wind out without killing contrast.', ['eyewear']);
    if (wetWindow) return item('Clear or photochromic wraparound glasses', 'Skip dark lenses when it is wet or gloomy so road spray, potholes, and painted lines stay visible.', ['eyewear']);
    if (bright) return item('Dark wraparound sunglasses', 'Good call for bright sun, higher speed, and stronger glare.', ['eyewear']);
    if (windy || isRaceDay) return item('Photochromic or mid-tint wraparound sunglasses', 'Good all-round option when light changes and you still want proper wind protection.', ['eyewear']);
    return item('Photochromic sports glasses', 'Useful middle-ground choice when the light could swing a bit.', ['eyewear']);
  }

  if (raceDayWindow && shouldShowRaceDayTimingPanel()) {
    chips.push({ label: `🗓 day ${formatShortTime(formatDateTimeLocal(raceDayWindow.dayStart).slice(0, 16))}–${formatShortTime(formatDateTimeLocal(raceDayWindow.dayEnd).slice(0, 16))}`, tone: '' });
    chips.push({ label: `🔥 warmup ${formatMinutesShort(raceDayWindow.warmupMinutes)}`, tone: '' });
    chips.push({ label: `🧊 cooldown ${formatMinutesShort(raceDayWindow.cooldownMinutes)}`, tone: '' });
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

function getEyewearSuggestionItemLegacyBroken(activity, point, planned, light, wetLike, isRaceDay) {
  const windy = firstFinite(planned?.maxWind, point?.wind, 0) >= 25;
  const gloomy = !light?.isDay || light?.tone === 'warn' || firstFinite(point?.code, 3) >= 3;
  const wetWindow = !!wetLike || !!planned?.anyWet || firstFinite(planned?.maxPrecipProb, 0) >= 35;
  const bright = !!light?.isDay && !gloomy && !wetWindow && [0, 1].includes(firstFinite(point?.code, 0));

  if (activity === 'cycling' || activity === 'triathlon' || activity === 'duathlon' || activity === 'cross_triathlon') {
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

function normalizeLocalDateTimeString(value) {
  if (value == null) return '';
  const text = String(value).trim();
  if (!text) return '';
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?)?(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/);
  if (!match) return '';
  const [, year, month, day, hour = '00', minute = '00'] = match;
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

function cloneSerializable(value) {
  if (value == null) return value;
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function parseLocalString(str) {
  const normalized = normalizeLocalDateTimeString(str);
  if (!normalized) return null;
  const [datePart, timePart = '00:00'] = normalized.split('T');
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
  const local = parseLocalString(text);
  if (local) return local.getTime();
  const nativeParsed = Date.parse(text);
  return Number.isFinite(nativeParsed) ? nativeParsed : NaN;
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

function ensureRaceDayTimingPickers() {
  if (!raceDayStartPicker && raceDayStartInput) {
    raceDayStartPicker = createBestWindowPicker(
      raceDayStartInput,
      'Pick the day start date and time',
      () => {
        if (weatherData) syncRaceDayTimingInputs(weatherData, 'day-start');
        if (weatherData) renderAdvice(weatherData, selectedActivity);
        if (weatherData) refreshRouteWeatherIfPossible();
      }
    );
  }
  if (!raceDayEndPicker && raceDayEndInput) {
    raceDayEndPicker = createBestWindowPicker(
      raceDayEndInput,
      'Pick the day end date and time',
      () => {
        if (weatherData) syncRaceDayTimingInputs(weatherData, 'day-end');
        if (weatherData) renderAdvice(weatherData, selectedActivity);
        if (weatherData) refreshRouteWeatherIfPossible();
      }
    );
  }
  return { start: raceDayStartPicker, end: raceDayEndPicker };
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

function setFlatpickrInvalidState(picker, invalid) {
  if (!picker) return;
  if (picker.input) picker.input.classList.toggle('input-invalid', invalid);
  if (picker.altInput) picker.altInput.classList.toggle('input-invalid', invalid);
}

function syncRaceDayTimingInputs(data, changedField = null) {
  if (!raceDayStartInput || !raceDayEndInput) return;
  const visible = shouldShowRaceDayTimingPanel();
  if (raceDayTimingPanel) raceDayTimingPanel.hidden = !visible;
  ensureRaceDayTimingPickers();
  setFlatpickrDisabledState(raceDayStartPicker, !visible);
  setFlatpickrDisabledState(raceDayEndPicker, !visible);
  raceDayStartInput.disabled = !visible;
  raceDayEndInput.disabled = !visible;
  if (!visible || !data) return;

  const eventStart = parseLocalString(laterInput?.value || '') || getValidLaterRange(data).minDate;
  const raceDayWindow = getRaceDayPlanningWindow(data, formatDateTimeLocal(eventStart).slice(0, 16));
  if (!raceDayWindow) return;
  const { absoluteRange, requestedDayStart, requestedDayEnd } = raceDayWindow;
  const dayStartValue = changedField === 'day-start' || raceDayStartInput.value ? requestedDayStart : raceDayWindow.dayStart;
  const dayEndValue = changedField === 'day-end' || raceDayEndInput.value ? requestedDayEnd : raceDayWindow.dayEnd;

  if (raceDayStartPicker) {
    raceDayStartPicker.set('minDate', absoluteRange.minDate);
    raceDayStartPicker.set('maxDate', absoluteRange.maxDate);
    raceDayStartPicker.setDate(dayStartValue, false, 'Y-m-d\\TH:i');
  } else {
    raceDayStartInput.value = formatDateTimeLocal(dayStartValue).slice(0, 16);
  }

  if (raceDayEndPicker) {
    raceDayEndPicker.set('minDate', absoluteRange.minDate);
    raceDayEndPicker.set('maxDate', absoluteRange.maxDate);
    raceDayEndPicker.setDate(dayEndValue, false, 'Y-m-d\\TH:i');
  } else {
    raceDayEndInput.value = formatDateTimeLocal(dayEndValue).slice(0, 16);
  }

  const invalid = !raceDayWindow.isValid;
  setFlatpickrInvalidState(raceDayStartPicker, invalid);
  setFlatpickrInvalidState(raceDayEndPicker, invalid);
  raceDayStartInput.classList.toggle('input-invalid', invalid);
  raceDayEndInput.classList.toggle('input-invalid', invalid);
  if (raceDayTimingPanel) raceDayTimingPanel.classList.toggle('invalid', invalid);

  if (raceDayTimingStatus) {
    raceDayTimingStatus.classList.toggle('error', invalid);
    raceDayTimingStatus.textContent = invalid
      ? `${raceDayWindow.validationMessage} Showing the default race-day weather window until this is fixed.`
      : `Day ${formatShortDateTime(formatDateTimeLocal(raceDayWindow.dayStart).slice(0, 16))} to ${formatShortDateTime(formatDateTimeLocal(raceDayWindow.dayEnd).slice(0, 16))} · event ${formatShortTime(formatDateTimeLocal(raceDayWindow.eventStart).slice(0, 16))}-${formatShortTime(formatDateTimeLocal(raceDayWindow.eventEnd).slice(0, 16))} · warmup ${formatMinutesShort(raceDayWindow.warmupMinutes)} · cooldown ${formatMinutesShort(raceDayWindow.cooldownMinutes)}.`;
  }
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
updateForecastOnlyModeUi();
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
  if (weatherData) syncRaceDayTimingInputs(weatherData, 'event-start');
  if (!weatherData) return;
  void refreshWeatherForActiveTarget({
    source: 'later_date',
    detail: 'Refreshing weather for the selected forecast dateâ€¦',
    clearRouteCheckpointCache: true
  }).catch(() => {});
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
  const shouldCollapseDuration = !!String(customDurationInput?.value || '').trim() || !!String(averageInput?.value || '').trim();
  if (temperaturePreferenceInput) temperaturePreference = Number(temperaturePreferenceInput.value) || 0;
  if (weatherData) applyPseudoWaterEstimateToData(weatherData);
  bestWindowAnalysis = null;
  bestWindowAnalysisKey = '';
  bestWindowSelectedStart = null;
  if (shouldCollapseDuration) collapsePlannerSubsection('duration');
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

function clearRaceDayTimingFields() {
  if (raceDayStartInput) raceDayStartInput.value = '';
  if (raceDayEndInput) raceDayEndInput.value = '';
}

function hasPlannerStateThatForecastOnlyWillReset() {
  if (selectedActivity || selectedEventKey) return true;
  if (selectedDuration !== 'h1') return true;
  if (raceDayMode) return true;
  if ((raceDayStartInput?.value || '').trim() || (raceDayEndInput?.value || '').trim()) return true;
  if ((customDistanceInput?.value || '').trim()) return true;
  if ((customDurationInput?.value || '').trim()) return true;
  if ((averageInput?.value || '').trim()) return true;
  if (temperaturePreference !== 0) return true;
  if (plannedEffort !== 'steady') return true;
  return false;
}

function cloneMultisportSelections(source = customMultisportSelections) {
  return Object.fromEntries(
    customMultisportActivityKeys.map((activity) => [activity, [...(source?.[activity] || defaultMultisportSelections[activity] || [])]])
  );
}

function captureForecastOnlyPlannerState(): ForecastOnlyPlannerState {
  return {
    selectedActivity,
    selectedEventKey,
    selectedDuration,
    startMode,
    raceDayMode,
    plannerCardCollapsed,
    manualWeatherPanelOpen,
    temperaturePreference,
    plannedEffort,
    customDistance: customDistanceInput?.value || '',
    distanceUnit: distanceUnitSelect?.value || 'km',
    customDuration: customDurationInput?.value || '',
    durationUnit: durationUnitSelect?.value || 'h',
    average: averageInput?.value || '',
    averageUnit: averageUnitSelect?.value || getPreferredAverageUnit(selectedActivity),
    raceDayStart: raceDayStartInput?.value || '',
    raceDayEnd: raceDayEndInput?.value || '',
    laterInputValue: laterInput?.value || '',
    bestWindowStart: bestWindowStartInput?.value || '',
    bestWindowEnd: bestWindowEndInput?.value || '',
    bestWindowPriority: bestWindowPrioritySelect?.value || 'best_overall',
    bestWindowStep: bestWindowStepSelect?.value || 'auto',
    bestWindowMaxPrecip: bestWindowMaxPrecipInput?.value || '',
    bestWindowMaxGust: bestWindowMaxGustInput?.value || '',
    bestWindowMinTemp: bestWindowMinTempInput?.value || '',
    bestWindowMaxTemp: bestWindowMaxTempInput?.value || '',
    bestWindowMinWater: bestWindowMinWaterInput?.value || '',
    bestWindowFinishDaylight: !!bestWindowFinishDaylightInput?.checked,
    bestWindowAnalysis,
    bestWindowAnalysisKey,
    bestWindowSelectedStart,
    customMultisportSelections: cloneMultisportSelections()
  };
}

function restoreForecastOnlyPlannerState(state: ForecastOnlyPlannerState | null) {
  if (!state) return;
  selectedActivity = state.selectedActivity;
  selectedEventKey = state.selectedEventKey;
  selectedDuration = state.selectedDuration;
  startMode = state.startMode;
  raceDayMode = state.raceDayMode;
  plannerCardCollapsed = state.plannerCardCollapsed;
  manualWeatherPanelOpen = state.manualWeatherPanelOpen;
  temperaturePreference = state.temperaturePreference;
  plannedEffort = state.plannedEffort;
  customMultisportSelections = cloneMultisportSelections(state.customMultisportSelections);
  if (customDistanceInput) customDistanceInput.value = state.customDistance;
  if (distanceUnitSelect) distanceUnitSelect.value = state.distanceUnit || 'km';
  if (customDurationInput) customDurationInput.value = state.customDuration;
  if (durationUnitSelect) durationUnitSelect.value = state.durationUnit || 'h';
  if (averageInput) averageInput.value = state.average;
  if (averageUnitSelect) averageUnitSelect.value = state.averageUnit || getPreferredAverageUnit(state.selectedActivity);
  if (raceDayStartInput) raceDayStartInput.value = state.raceDayStart;
  if (raceDayEndInput) raceDayEndInput.value = state.raceDayEnd;
  if (laterInput) laterInput.value = state.laterInputValue;
  if (bestWindowStartInput) bestWindowStartInput.value = state.bestWindowStart;
  if (bestWindowEndInput) bestWindowEndInput.value = state.bestWindowEnd;
  if (bestWindowPrioritySelect) bestWindowPrioritySelect.value = state.bestWindowPriority || 'best_overall';
  if (bestWindowStepSelect) bestWindowStepSelect.value = state.bestWindowStep || 'auto';
  if (bestWindowMaxPrecipInput) bestWindowMaxPrecipInput.value = state.bestWindowMaxPrecip;
  if (bestWindowMaxGustInput) bestWindowMaxGustInput.value = state.bestWindowMaxGust;
  if (bestWindowMinTempInput) bestWindowMinTempInput.value = state.bestWindowMinTemp;
  if (bestWindowMaxTempInput) bestWindowMaxTempInput.value = state.bestWindowMaxTemp;
  if (bestWindowMinWaterInput) bestWindowMinWaterInput.value = state.bestWindowMinWater;
  if (bestWindowFinishDaylightInput) bestWindowFinishDaylightInput.checked = !!state.bestWindowFinishDaylight;
  bestWindowAnalysis = state.bestWindowAnalysis;
  bestWindowAnalysisKey = state.bestWindowAnalysisKey || '';
  bestWindowSelectedStart = state.bestWindowSelectedStart || null;
  setSelectedActivityButton(selectedActivity);
}

function clearForecastOnlyPlannerState() {
  forecastOnlyPlannerState = null;
}

function getForecastOnlySummaryText() {
  if (!forecastOnlyMode) return '';
  return forecastOnlyPlannerState
    ? 'Forecast only is active. Activity presets, route import, best-window search, and comfort adjustments are hidden here. Planned duration presets, custom duration, water temperature settings, and manual override stay available. Your previous planner setup will return when you exit.'
    : 'Forecast only is active. Activity presets, route import, best-window search, and comfort adjustments are hidden here. Planned duration presets, custom duration, water temperature settings, and manual override stay available.';
}

function getForecastOnlyEmptyStateText() {
  if (!forecastOnlyMode || weatherData) return '';
  if (routeState?.points?.length) {
    return 'Load weather to see forecast-only results. The existing route can still supply its route-start location even though route controls are hidden in this mode.';
  }
  if (input?.value?.trim()) {
    return `Press Refresh to load forecast-only results for ${input.value.trim()}.`;
  }
  return 'Search a city or use current location to load weather. Forecast-only keeps the planner simplified, then shows the forecast summary, warnings, and timing once data is available.';
}

function openForecastOnlyConfirm() {
  if (!forecastOnlyConfirmOverlay) {
    performActivateForecastOnlyMode();
    return;
  }
  forecastOnlyConfirmOverlay.hidden = false;
  document.body.classList.add('helper-open');
  confirmForecastOnlyBtn?.focus({ preventScroll: true });
}

function closeForecastOnlyConfirm() {
  if (!forecastOnlyConfirmOverlay) return;
  forecastOnlyConfirmOverlay.hidden = true;
  document.body.classList.remove('helper-open');
}

function confirmForecastOnlyMode() {
  closeForecastOnlyConfirm();
  performActivateForecastOnlyMode();
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

function reorderActivityGroups() {
  const sections = document.querySelector('.activity-sections');
  if (!sections) return;
  const groups = Array.from(sections.querySelectorAll('.activity-section-group'));
  const indoorGroup = groups.find(group => group.querySelector('.activity-group-title')?.textContent?.trim() === 'Indoor training');
  const outdoorSwimGroup = groups.find(group => group.querySelector('.activity-group-title')?.textContent?.trim() === 'Outdoor swimming');
  if (!indoorGroup || !outdoorSwimGroup) return;
  sections.insertBefore(outdoorSwimGroup, indoorGroup);
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
  forecastOnlyMode = false;
  clearForecastOnlyPlannerState();
  selectedActivity = null;
  selectedEventKey = null;
  customMultisportSelections = cloneMultisportSelections(defaultMultisportSelections);
  selectedDuration = 'h1';
  raceDayMode = false;
  temperaturePreference = 0;
  plannedEffort = 'steady';
  plannerCardCollapsed = false;
  clearPlannerCustomFields();
  clearRaceDayTimingFields();
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

function performActivateForecastOnlyMode() {
  if (forecastOnlyMode) {
    forecastOnlyMode = false;
    restoreForecastOnlyPlannerState(forecastOnlyPlannerState);
    clearForecastOnlyPlannerState();
    renderCustomControlOptions(true);
    updateRaceDayModeUi();
    updatePlannerCardCollapseUi();
    renderPlannerState();
    if (weatherData) {
      configureLaterInput(weatherData);
      renderAdvice(weatherData, selectedActivity);
      if (startMode === 'best') scheduleBestWindowAnalysis(true);
    }
    return;
  }

  forecastOnlyPlannerState = captureForecastOnlyPlannerState();
  forecastOnlyMode = true;
  selectedActivity = null;
  selectedEventKey = null;
  selectedDuration = 'h8';
  if (startMode === 'best') startMode = 'now';
  raceDayMode = false;
  manualWeatherPanelOpen = false;
  temperaturePreference = 0;
  plannedEffort = 'steady';
  clearPlannerCustomFields();
  clearRaceDayTimingFields();
  setSelectedActivityButton(null);
  plannerCardCollapsed = false;
  renderCustomControlOptions(true);
  updateRaceDayModeUi();
  updatePlannerCardCollapseUi();
  renderPlannerState();
  if (!weatherData) return;
  configureLaterInput(weatherData);
  renderAdvice(weatherData, selectedActivity);
  if (startMode === 'best') scheduleBestWindowAnalysis(true);
}

function activateForecastOnlyMode() {
  if (forecastOnlyMode) {
    performActivateForecastOnlyMode();
    return;
  }
  if (hasPlannerStateThatForecastOnlyWillReset()) {
    openForecastOnlyConfirm();
    return;
  }
  performActivateForecastOnlyMode();
}
window.activateForecastOnlyMode = activateForecastOnlyMode;

function selectActivity(btn) {
  clearForecastOnlyPlannerState();
  forecastOnlyMode = false;
  setSelectedActivityButton(btn.dataset.activity);
  selectedActivity = btn.dataset.activity;
  selectedEventKey = null;
  if (durationUnitSelect) durationUnitSelect.value = getPreferredDurationUnit(selectedActivity);
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
  if (selectedActivity) collapsePlannerSubsection('duration', { scrollToNextOnMobile: true });
  renderPlannerState();
  if (!weatherData) refreshIndoorAdviceIfNeeded();
  if (weatherData) configureLaterInput(weatherData);
  if (weatherData) renderAdvice(weatherData, selectedActivity);
  if (weatherData) refreshRouteWeatherIfPossible();
  if (weatherData && startMode === 'best') scheduleBestWindowAnalysis(true);
}
window.selectDurationKey = selectDurationKey;

function selectStartMode(btn) {
  if (forecastOnlyMode && btn.dataset.startMode === 'best') return;
  document.querySelectorAll('.toggle-btn[data-start-mode]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  updateCheckpointModelUi();
  startMode = btn.dataset.startMode;
  laterBox.classList.toggle('visible', startMode === 'later');
  bestWindowBox.classList.toggle('visible', !forecastOnlyMode && startMode === 'best');
  if (weatherData) syncRaceDayTimingInputs(weatherData);
  if (!weatherData) refreshIndoorAdviceIfNeeded();
  if (weatherData) configureLaterInput(weatherData);
  if (startMode === 'best' && weatherData) scheduleBestWindowAnalysis(true);
  if (weatherData) renderAdvice(weatherData, selectedActivity);
  if (weatherData) refreshRouteWeatherIfPossible();
}

async function fetchWeather() {
  hideSuggestions();
  activeRoutePointForecast = null;
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
    pendingChartSelectedStartTime = null;
    showError(e.message || 'Something went wrong.');
    resultCard.style.display = 'none';
  } finally {
    setLoading(false);
  }
}

async function fetchWeatherFromResult(place, options = {}) {
  hideError();
  setLoading(true);
  showResultLoading();
  const previousWeatherData = weatherData;
  const previousActiveRoutePointForecast = cloneSerializable(activeRoutePointForecast);
  const previousPendingChartSelectedStartTime = pendingChartSelectedStartTime;
  const previousLocationCardCollapsed = locationCardCollapsed;
  try {
    const placeLat = Number(place?.latitude);
    const placeLon = Number(place?.longitude);
    const isSameActiveRoutePoint =
      activeRoutePointForecast?.isRoutePoint &&
      isFiniteNumber(activeRoutePointForecast.latitude) &&
      isFiniteNumber(activeRoutePointForecast.longitude) &&
      isFiniteNumber(placeLat) &&
      isFiniteNumber(placeLon) &&
      Math.abs(activeRoutePointForecast.latitude - placeLat) < 0.000001 &&
      Math.abs(activeRoutePointForecast.longitude - placeLon) < 0.000001;
    if (!isSameActiveRoutePoint) activeRoutePointForecast = null;
    weatherData = setWeatherDataProvenance(await fetchWeatherCore(place), {
      kind: 'live',
      savedAt: new Date().toISOString()
    });
    locationCardCollapsed = true;
    updateLocationCardCollapseUi();
    configureLaterInput(weatherData);
    if (pendingChartSelectedStartTime) {
      applyLaterStartTimeSelection(pendingChartSelectedStartTime, weatherData);
      pendingChartSelectedStartTime = null;
    }
    renderAdvice(weatherData, selectedActivity);
    await refreshRouteWeatherIfPossible();
    setWeatherRefreshStatus({
      state: 'success',
      detail: '',
      error: '',
      lastAttemptAt: new Date().toISOString(),
      lastSuccessAt: new Date().toISOString()
    });
    schedulePersistedAppStateSave();
    return weatherData;
  } catch (e) {
    weatherData = previousWeatherData;
    activeRoutePointForecast = previousActiveRoutePointForecast;
    pendingChartSelectedStartTime = previousPendingChartSelectedStartTime;
    locationCardCollapsed = previousLocationCardCollapsed;
    updateLocationCardCollapseUi();
    if (weatherData) {
      configureLaterInput(weatherData);
      renderAdvice(weatherData, selectedActivity);
    } else {
      resultCard.style.display = 'none';
    }
    showError(e.message || 'Something went wrong.');
    setWeatherRefreshStatus({
      state: 'error',
      detail: '',
      error: e instanceof Error ? e.message : 'Something went wrong.',
      lastAttemptAt: new Date().toISOString()
    });
    schedulePersistedAppStateSave();
    if (options?.propagateError) throw e;
    return null;
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
  const waterMatch = text.match(/Water temperature\s*\(Â°C(?:[^)]*)?\)\s*([^<\n]+)/i);
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
  if (overnightFeels <= -8) return 'Aim for a sleeping bag with a comfort rating around -10Â°C or lower.';
  if (overnightFeels <= -2) return 'Aim for a sleeping bag with a comfort rating around -5Â°C.';
  if (overnightFeels <= 4) return 'Aim for a sleeping bag with a comfort rating around 0Â°C.';
  if (overnightFeels <= 10) return 'Aim for a sleeping bag with a comfort rating around 5Â°C.';
  return 'A 10Â°C-ish comfort-rated sleeping bag is usually enough unless the site runs damp or windy.';
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
    sunrise: normalizeLocalDateTimeString(weatherJson.daily.sunrise?.[i]) || weatherJson.daily.sunrise?.[i],
    sunset: normalizeLocalDateTimeString(weatherJson.daily.sunset?.[i]) || weatherJson.daily.sunset?.[i],
    daylightDuration: weatherJson.daily.daylight_duration?.[i],
    code: weatherJson.daily.weather_code?.[i],
    uvMax: weatherJson.daily.uv_index_max?.[i],
    aqiMax: undefined as number | undefined
  }));

  const hourly = (weatherJson.hourly?.time || []).map((time, i) => {
    const normalizedTime = normalizeLocalDateTimeString(time) || time;
    const marinePoint = getBestMarinePoint(marinePayload, normalizedTime);
    return {
      time: normalizedTime,
      temp: weatherJson.hourly.temperature_2m?.[i],
      feels: weatherJson.hourly.apparent_temperature?.[i],
      humidity: weatherJson.hourly.relative_humidity_2m?.[i],
      precipProb: weatherJson.hourly.precipitation_probability?.[i],
      precip: weatherJson.hourly.precipitation?.[i],
      wind: weatherJson.hourly.wind_speed_10m?.[i],
      gusts: weatherJson.hourly.wind_gusts_10m?.[i],
      windDir: weatherJson.hourly.wind_direction_10m?.[i],
      uv: weatherJson.hourly.uv_index?.[i],
      aqi: matchAqiToHourlyTime(aqiPayload, normalizedTime),
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

  const normalizedCurrentTime = normalizeLocalDateTimeString(c.time) || c.time;
  const currentMarine = getBestMarinePoint(marinePayload, normalizedCurrentTime);
  const currentHourlyPoint = hourly.find(h => h.time >= normalizedCurrentTime) || hourly[0] || {};

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
    currentTime: normalizedCurrentTime,
    marineSource: marinePayload?.sourceLabel || 'Marine data unavailable',
    current: {
      time: normalizedCurrentTime,
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
  applyDailyWaterSummariesToData(data);
  return data;
}

function getValidLaterRange(data) {
  return getAbsoluteForecastRange(data);
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
  syncRaceDayTimingInputs(data);
  configureBestWindowUi(data);
}

function applyLaterStartTimeSelection(timeValue, data = weatherData) {
  if (!data || !timeValue) return;
  startMode = 'later';
  document.querySelectorAll('.toggle-btn[data-start-mode]').forEach(btn => btn.classList.toggle('active', btn.dataset.startMode === 'later'));
  laterBox?.classList.toggle('visible', true);
  bestWindowBox?.classList.toggle('visible', false);
  bestWindowSelectedStart = null;
  configureLaterInput(data);
  const { minDate, maxDate } = getValidLaterRange(data);
  const target = clampDateToRange(parseLocalString(String(timeValue)), minDate, maxDate);
  if (laterPicker) laterPicker.setDate(target, false, 'Y-m-d\\TH:i');
  else if (laterInput) laterInput.value = formatDateTimeLocal(target).slice(0, 16);
}

function bindForecastChartInteractions(root = resultInner) {
  return root;
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

function getDisplayStartTime(data) {
  const routePointTime = activeRoutePointForecast?.isRoutePoint ? activeRoutePointForecast.timeValue : null;
  if (routePointTime) return routePointTime;
  return getSelectedStartTime(data);
}

function getHourlyPointForStart(data, startTime) {
  if (!data.hourly.length) return data.current;
  if (startTime === data.currentTime) return data.current;
  return getInterpolatedHourlyPoint(data, startTime);
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
    humidity: interpolateNumber(before, after, ratio, 'humidity', null),
    precipProb: interpolateNumber(before, after, ratio, 'precipProb'),
    precip: interpolateNumber(before, after, ratio, 'precip'),
    wind: interpolateNumber(before, after, ratio, 'wind'),
    gusts: interpolateNumber(before, after, ratio, 'gusts'),
    uv: interpolateNumber(before, after, ratio, 'uv', null),
    aqi: interpolateNumber(before, after, ratio, 'aqi', null),
    measuredWaterTemp: interpolateNumber(before, after, ratio, 'measuredWaterTemp', null),
    waterTemp: interpolateNumber(before, after, ratio, 'waterTemp', null),
    waterTempRangeLow: interpolateNumber(before, after, ratio, 'waterTempRangeLow', null),
    waterTempRangeHigh: interpolateNumber(before, after, ratio, 'waterTempRangeHigh', null),
    waveHeight: interpolateNumber(before, after, ratio, 'waveHeight', null),
    waterTempSource: mergeWaterSourceLabels(before.waterTempSource, after.waterTempSource),
    waterTempConfidence: mergeWaterConfidenceLabels(before.waterTempConfidence, after.waterTempConfidence),
    waterTempExplanation: ratio < 0.5 ? before.waterTempExplanation : after.waterTempExplanation,
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

function getMultiDayChartStepMinutes(totalMinutes) {
  if (totalMinutes <= 48 * 60) return 180;
  if (totalMinutes <= 72 * 60) return 240;
  return 360;
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
    const endTime = addMinutesToLocalString(startTime, profile.minutes);
    const chartStepMinutes = getMultiDayChartStepMinutes(profile.minutes);
    const chartPoints = [];
    for (let offset = 0; offset <= profile.minutes; offset += chartStepMinutes) {
      chartPoints.push(getInterpolatedHourlyPoint(data, addMinutesToLocalString(startTime, offset)));
    }
    if (chartPoints[chartPoints.length - 1]?.time !== endTime) {
      chartPoints.push(getInterpolatedHourlyPoint(data, endTime));
    }
    return {
      mode: 'daily',
      points,
      startTime,
      endTime: points[points.length - 1]?.date || startDate,
      chartMode: 'hourly',
      chartPoints,
      chartStartTime: startTime,
      chartEndTime: endTime,
      sliceMinutes: chartStepMinutes,
      interpolated: chartStepMinutes < 60,
    };
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

function getForecastSelectionForRange(data, startTime, endTime, extra = {}) {
  const startMs = parseAnyTime(startTime);
  const endMs = parseAnyTime(endTime);
  const totalMinutes = Math.max(0, Math.round((endMs - startMs) / 60000));
  const fineStep = getFineForecastStepMinutes(totalMinutes);
  if (fineStep) {
    const finePoints = [];
    for (let offset = 0; offset <= totalMinutes; offset += fineStep) {
      finePoints.push(getInterpolatedHourlyPoint(data, addMinutesToLocalString(startTime, offset)));
    }
    if (finePoints[finePoints.length - 1]?.time !== endTime) finePoints.push(getInterpolatedHourlyPoint(data, endTime));
    return { mode: 'hourly', points: finePoints, startTime, endTime, sliceMinutes: fineStep, interpolated: true, ...extra };
  }
  let points = data.hourly.filter(h => h.time >= startTime && h.time <= endTime);
  if (!points.length) points = [getInterpolatedHourlyPoint(data, startTime), getInterpolatedHourlyPoint(data, endTime)];
  else {
    if (points[0]?.time !== startTime) points.unshift(getInterpolatedHourlyPoint(data, startTime));
    if (points[points.length - 1]?.time !== endTime) points.push(getInterpolatedHourlyPoint(data, endTime));
  }
  return { mode: 'hourly', points, startTime, endTime, sliceMinutes: 60, interpolated: false, ...extra };
}

function getDisplayForecastSelection(data, startTime) {
  const selection = getForecastSelection(data, startTime);
  const baseSelection = { ...selection, chartLatitude: data?.latitude, chartLongitude: data?.longitude, chartLocationName: data?.locationName };
  const raceDayWindow = getRaceDayPlanningWindow(data, startTime);
  if (!raceDayWindow || selection.mode !== 'hourly' || !shouldShowRaceDayTimingPanel()) return baseSelection;
  return getForecastSelectionForRange(
    data,
    formatDateTimeLocal(raceDayWindow.dayStart).slice(0, 16),
    formatDateTimeLocal(raceDayWindow.dayEnd).slice(0, 16),
    {
      highlightStartTime: formatDateTimeLocal(raceDayWindow.eventStart).slice(0, 16),
      highlightEndTime: formatDateTimeLocal(raceDayWindow.eventEnd).slice(0, 16),
      headerTitle: 'Race-day weather timeline',
      chartLatitude: data?.latitude,
      chartLongitude: data?.longitude,
      chartLocationName: data?.locationName,
      headerMeta: `${formatShortTime(formatDateTimeLocal(raceDayWindow.dayStart).slice(0, 16))}â€“${formatShortTime(formatDateTimeLocal(raceDayWindow.dayEnd).slice(0, 16))} · main event highlighted`
    }
  );
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
    swimrun: 'swimrun',
    duathlon: 'duathlon',
    aquathlon: 'aquathlon',
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
    cross_country_skiing: 'cross-country skiing',
    biathlon: 'biathlon',
    cross_triathlon: 'cross triathlon',
    cross_duathlon: 'cross duathlon'
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
  } else if (activity === 'triathlon' || activity === 'duathlon' || activity === 'aquathlon') {
    base.routeHeadwind += 2;
    base.gust += 2;
    base.precipProb += 1;
  } else if (activity === 'swimrun' || activity === 'cross_triathlon') {
    base.water += 6;
    base.gust += 3;
    base.routeHeadwind += 2;
    base.daylight += 1;
  } else if (activity === 'cross_duathlon') {
    base.routeHeadwind += 2;
    base.routeCrosswind += 2;
    base.gust += 2;
    base.comfort += 1;
  } else if (activity === 'cross_country_skiing' || activity === 'biathlon') {
    base.comfort += 4;
    base.gust += 4;
    base.daylight += 2;
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
    : (['triathlon', 'swimrun', 'duathlon', 'aquathlon', 'cross_triathlon', 'cross_duathlon'].includes(selectedActivity) ? 22 : 28));
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
    ele: firstFinite(p.ele, null),
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
      cp.markerShort = 'â†‘';
      cp.markerKind = 'event';
    } else if (modelName === 'smart' && cp.reasons.includes('sunset')) {
      cp.label = 'Sunset';
      cp.markerShort = 'â†“';
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
  return promoteSmartCheckpointEvents(samples, modelName);
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
      cp.markerShort = 'â†‘';
      cp.markerKind = 'event';
    } else if (cp.reasons.includes('sunset')) {
      cp.label = 'Sunset';
      cp.markerShort = 'â†“';
      cp.markerKind = 'event';
    } else if (cp.reasons.includes('wettest')) {
      cp.label = 'Rain risk';
      cp.markerShort = 'â˜”';
      cp.markerKind = 'event';
    } else if (cp.reasons.includes('uvpeak')) {
      cp.label = 'Peak UV';
      cp.markerShort = 'â˜€';
      cp.markerKind = 'event';
    } else if (cp.reasons.includes('peakwind')) {
      cp.label = 'Peak wind';
      cp.markerShort = 'â†¯';
      cp.markerKind = 'event';
    } else if (cp.reasons.includes('coldest')) {
      cp.label = 'Coldest';
      cp.markerShort = 'â„';
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
    `Uses ${getCheckpointModelLabel()} route checkpoints when a route is loaded.`,
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
  bestWindowStatus.textContent = 'Finding the best weather windowsâ€¦';
  bestWindowResults.innerHTML = `<div class="best-window-empty">Scoring candidate start times across the allowed rangeâ€¦</div>`;

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
  return renderForecastBlockFromModule(
    data,
    getDisplayForecastSelection(data, startTime),
    getDurationProfile(),
    selectedActivity,
    routeState?.samples || [],
    shouldShowWaterTemperature(selectedActivity),
  );
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
    .split(/(\s+|\/|·|\+|â€“|-|\(|\))/)
    .map(token => {
      if (!token || /^\s+$/.test(token)) return token;
      if (/^[\/+·()â€“-]$/.test(token)) return token;
      if (/^[0-9]/.test(token)) return token;
      if (/[A-Z]{2,}/.test(token) && !/[a-z]/.test(token)) return token;
      const lower = token.toLowerCase();
      return lower.replace(/(^|['â€™])([a-zÃ -Ã¿])/g, (_, prefix, chr) => prefix + chr.toUpperCase());
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
  const startTime = getDisplayStartTime(data);
  const selection = getForecastSelection(data, startTime);
  const raceDayWindow = getRaceDayPlanningWindow(data, startTime);
  const raceDaySupportItems = getRaceDaySupportItems(data, raceDayWindow);
  const shouldUseCurrentPoint = !activeRoutePointForecast?.isRoutePoint && startMode === 'now';
  const basePoint = shouldUseCurrentPoint ? { ...data.current, time: data.current.time } : getHourlyPointForStart(data, startTime);
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
  const startLabel = shouldUseCurrentPoint ? 'now' : formatShortDateTime(startTime);
  const distanceText = distanceState.label;
  const eventLabel = eventPreset?.label || activityLabels[activity];
  const isRaceDay = raceDayMode;
  const distanceKmValue = isFiniteNumber(distanceState.km) ? distanceState.km : null;
  const chips = [
    { label: `ðŸ ${eventLabel}`, tone: '' },
    { label: `ðŸ“ ${distanceText}`, tone: distanceState.source === 'derived' ? 'ok' : '' },
    { label: `â± ${durationState.label}`, tone: durationState.source === 'derived' ? 'ok' : '' },
    { label: `ðŸ•’ start ${startLabel}`, tone: '' },
    { label: `ðŸŒ¡ feels ${Math.round(feels)}Â°C`, tone: '' },
    { label: light.isDay ? `ðŸŒž ${light.label}` : `ðŸŒ™ ${light.label}`, tone: light.tone }
  ];
  if (routeState?.points?.length) chips.push({ label: `ðŸ—º route ${distanceText}`, tone: '' });
  if (isRaceDay) chips.push({ label: 'ðŸ race day mode', tone: '' });
  if ((activity === 'triathlon' || activity === 'cross_triathlon') && isRaceDay) chips.push({ label: 'ðŸ” T1 / T2 live', tone: '' });
  if (raceDayWindow && shouldShowRaceDayTimingPanel()) {
    chips.push({ label: `ðŸ—“ day ${formatShortTime(formatDateTimeLocal(raceDayWindow.dayStart).slice(0, 16))}-${formatShortTime(formatDateTimeLocal(raceDayWindow.dayEnd).slice(0, 16))}`, tone: raceDayWindow.isValid ? '' : 'warn' });
    chips.push({ label: `ðŸ”¥ warmup ${formatMinutesShort(raceDayWindow.warmupMinutes)}`, tone: '' });
    chips.push({ label: `ðŸ§Š cooldown ${formatMinutesShort(raceDayWindow.cooldownMinutes)}`, tone: '' });
  }
  if (temperaturePreference !== 0) chips.push({ label: tempPreferenceInfo.chip, tone: temperaturePreference < 0 ? 'warn' : '' });
  if (plannedEffort !== 'steady' && isEffortRelevantActivity(activity)) chips.push({ label: effortInfo.chip, tone: effortOffset < 0 ? 'warn' : '' });
  if (planned.precipitationWindowNote) chips.push({ label: `ðŸŒ§ ${planned.precipitationWindowNote}`, tone: 'warn' });
  if (distanceState.source === 'custom') chips.push({ label: 'âœ custom distance', tone: '' });
  if (distanceState.source === 'derived') chips.push({ label: 'â‰ˆ distance from avg', tone: 'ok' });
  if (durationState.source === 'custom') chips.push({ label: 'âœ custom duration', tone: '' });
  if (durationState.source === 'route') chips.push({ label: `ðŸ”’ route time ${formatMinutesShort(routeState.elapsedMinutes)}`, tone: '' });
  if (durationState.source === 'derived') chips.push({ label: 'â‰ˆ duration from avg', tone: 'ok' });
  if (averageState?.valid) chips.push({ label: `âš¡ ${averageState.label}`, tone: '' });
  if (getCustomWeatherOverride().active) chips.push({ label: 'âœ manual weather', tone: 'warn' });
  if (light.sunrise) chips.push({ label: `â¬† sunrise ${formatShortTime(light.sunrise)}`, tone: '' });
  if (light.sunset) chips.push({ label: `â¬‡ sunset ${formatShortTime(light.sunset)}`, tone: '' });

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
      if (raceDaySupportItems.length) extras.unshift(...raceDaySupportItems);
    }
    if (profile.minutes >= 240 || (distanceKmValue != null && distanceKmValue >= 30)) extras.push(item('Dry backup layer', 'Helpful when the weather could turn or the stop afterward is chilly.', ['long']));
    return { point, startTime, chips, activityLabel: activityLabels[activity], summary: `${eventLabel} setup around ${distanceText}, starting at ${Math.round(feels)}Â°C feels-like with ${desc}${wet ? ' and some precipitation risk' : ''}.`, steps: [ makeChoiceStep('Step 1 · Pick the main run kit', 'Choose the broad outfit first.', mainOptions), makeListStep('Step 2 · Add the important layers / accessories', 'These are the pieces that meaningfully change comfort.', core), makeListStep('Step 3 · Longer-distance / backup items', 'Worth more as the outing or event gets bigger.', extras) ], warning: point.code >= 95 ? 'Thunderstorms are more of a postpone problem than a clothing problem.' : null };
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
      if (raceDaySupportItems.length) extras.unshift(...raceDaySupportItems);
    }
    return { point, startTime, chips, activityLabel: activityLabels[activity], summary: `${eventLabel} around ${distanceText}, with bike-effective feel around ${Math.round(effective)}Â°C and ${desc}${wet ? ' with wet-road risk' : ''}.`, steps: [ makeChoiceStep('Step 1 · Pick the main bike kit', 'Choose the core on-bike clothing system.', mainOptions), makeListStep('Step 2 · Add the bike-specific essentials', 'These make the biggest difference on a ride.', core), makeListStep('Step 3 · Adapt for distance / swingy weather', 'Longer rides reward better layer planning.', extras) ], warning: point.code >= 95 ? 'Thunderstorms plus exposed roads are not a â€œdress around itâ€ situation.' : null };
  }

  if (['triathlon', 'swimrun', 'duathlon', 'aquathlon', 'cross_triathlon', 'cross_duathlon'].includes(activity)) {
    const multisportActivity = activity;
    const multisportLabel = activityLabels[activity] || 'multisport';
    const multisportSummary = getMultisportSummary(multisportActivity);
    const multisportLegs = getSelectedMultisportLegDetails(multisportActivity);
    const hasSwimLeg = multisportLegs.some(def => def.water);
    const hasOutdoorSwimLeg = multisportLegs.some(def => def.waterTemperatureRelevant || (def.water && def.outdoors));
    const hasIndoorSwimLeg = multisportLegs.some(def => def.water && def.indoors);
    const isOffRoadMulti = multisportActivity === 'cross_triathlon' || multisportActivity === 'cross_duathlon';
    const isDryMulti = !hasSwimLeg;
    const wt = hasOutdoorSwimLeg && isFiniteNumber(point.waterTemp) ? point.waterTemp : null;
    const mainOptions = wt != null && wt < 14 ? [ option('Trisuit + full wetsuit', 'This is the sensible race-day default here.', true, ['main']), option('Trisuit + full wetsuit + neoprene hood / gloves / booties', 'Even better if the water is seriously cold.', false, ['cold-water']), option('Anything lighter', 'That gets questionable fast.', false, ['nope']) ] : t >= 18 ? [ option('Trisuit only', 'Warm-weather triathlon answer.', true, ['main']), option('Speedsuit / short-sleeve trisuit', 'Aero-leaning option if you like coverage.', false, ['race']), option('Trisuit + optional arm coolers', 'Useful in sun or for long-course comfort.') ] : t >= 10 ? [ option('Trisuit + arm warmers', 'Very useful shoulder-season tri setup.', true, ['main']), option('Trisuit + gilet for bike leg', 'Great if the bike start will feel cold.', false, ['bike']), option('Short-sleeve trisuit', 'Good if you want more coverage all day.', false, ['race']) ] : [ option('Trisuit + arm warmers + gilet / light jacket', 'Cold-air multisport kit.', true, ['cold']), option('Trisuit + full wetsuit + bike extras', 'Very valid when both water and air are cool.', false, ['cold-water']), option('Aggressively minimal kit', 'Only if you already know you tolerate this well.', false, ['risky']) ];
    if (hasSwimLeg && !hasOutdoorSwimLeg) {
      const hybridSwimMainOptions = t >= 18 ? [
        option('Trisuit or one-kit setup that works after the indoor swim', 'Best when you want to leave the pool and keep moving outside without a full change.', true, ['main']),
        option('Pool suit + quick bike/run change', 'Better if the swim is indoors but the outdoor legs need different kit.', false, ['transition']),
        option('Light outdoor kit staged after the swim', 'Useful when the swim is only a short opener and the outdoor legs dominate.', false, ['outdoor'])
      ] : t >= 10 ? [
        option('Indoor swim kit + arm warmers / gilet ready for outside', 'Good hybrid setup once the swim is sheltered but the bike/run are cooler.', true, ['main']),
        option('Trisuit + quick outer layer for the outdoor legs', 'Useful if you want one core race kit with small additions.', false, ['transition']),
        option('Pool swim change + bike-first layer plan', 'Best if the bike leg will feel colder than the run.', false, ['bike'])
      ] : [
        option('Indoor swim kit + warm outdoor change staged in transition', 'Cold-air hybrid multisport needs a deliberate post-swim plan.', true, ['cold']),
        option('Trisuit + thermal bike layer ready after the pool', 'Good when you want to stay race-oriented but the outdoor legs are cold.', false, ['bike']),
        option('Shorten or move more of it indoors if under-equipped', 'The swim may be controlled, but the outdoor segments still need proper layers.', false, ['risky'])
      ];
      mainOptions.splice(0, mainOptions.length, ...hybridSwimMainOptions);
    } else if (!hasSwimLeg) {
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
    const core = [ item('Planned legs', multisportSummary, ['custom']), item('Race belt / bib attachment plan', 'Small item, easy to forget.'), item('Bike/run visibility if the light is marginal', !light.isDay || light.tone === 'warn' ? 'Especially relevant for early starts or long-course days.' : 'Usually not central on a closed course.', ['light']), item('Base layer decision', t <= 10 ? 'A thin base or one-piece race layer can matter a lot in cool air.' : 'Usually skip heavy underlayers in warm conditions.', ['base layer']) ];
    if (hasOutdoorSwimLeg && wt != null) core.push(item('Water-temp plan', wt >= 22 ? 'Probably warm enough for a lighter swim setup.' : wt >= 18 ? 'A sleeveless or flexible full suit can make sense.' : 'Plan for a full suit.', ['water']));
    if (hasOutdoorSwimLeg) core.push(item('Safety buoy / tow float for training swims', 'Treat it as standard open-water kit outside race rules: visibility, a rest point, and a safer place to carry small essentials if the buoy is designed for it.', ['water', 'safety']));
    if (hasIndoorSwimLeg && !hasOutdoorSwimLeg) core.push(item('Indoor-swim exit plan', 'Stage a towel, dry layer, and the outdoor leg kit so you do not walk out of the pool soaked and underdressed.', ['transition', 'hybrid']));
    if (multisportActivity === 'triathlon' || multisportActivity === 'cross_triathlon') core.push(item('T1 / T2 plan', isRaceDay ? 'Treat transition flow as part of the race kit: swim exit, helmet/glasses order, bike mount line, and run-out sequence.' : 'If you are rehearsing the event, include the actual order for swim exit, bike setup, and run-out.', ['transition']));
    if (t <= 12) core.push(item('Arm warmers (for example cycling or tri arm warmers)', 'One of the highest-value tri additions for cool air.', ['bike']));
    if (t <= 8 || veryWindy) core.push(item('Gilet / packable shell for the bike', 'Aero-ish discomfort still counts as discomfort.', ['bike']));
    const multisportEyewear = getEyewearSuggestionItem(multisportActivity, point, planned, light, wet, isRaceDay);
    if (multisportEyewear) core.push(multisportEyewear);
    const extras = [ item('Pre-race warm layer (for example throwaway hoodie or light track pants)', 'Standing around before the start can be colder than the actual race.'), item('Post-race dry clothes (for example tee, hoodie, and dry socks)', 'Very nice once the effort ends.'), item('Socks decision', eventPreset?.key === 'tri_ss' || eventPreset?.key === 'tri_s' || eventPreset?.key === 'dua_short' || eventPreset?.key === 'dua_sprint' ? 'You might go without; otherwise think it through.' : 'Longer-course days often justify socks.', ['transition']) ];
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
      if (hasSwimLeg && !hasOutdoorSwimLeg) {
        const hybridRaceMainOptions = t >= 18 ? [
          option('Trisuit or one-kit setup across the indoor swim and outdoor legs', 'Simple hybrid race-day default when the swim is indoors.', true, ['race']),
          option('Pool swim kit + fast transition to outdoor race kit', 'Useful if the indoor swim and outdoor conditions want different clothing.', false, ['race']),
          option('Short-sleeve trisuit + outdoor add-ons staged after the swim', 'Good when the bike/run are the main exposure concern.', false, ['race'])
        ] : t >= 10 ? [
          option('Indoor swim kit + arm warmers / gilet ready for the outdoor legs', 'Balanced hybrid race-day setup for cooler air.', true, ['race']),
          option('Trisuit + quick outer layer after the swim', 'Keeps transitions simple without pretending the swim was open water.', false, ['race']),
          option('Bike-first outer layer plan staged in transition', 'Useful when the first outdoor minutes will feel cold.', false, ['race'])
        ] : [
          option('Indoor swim kit + warm outdoor change staged in transition', 'Cold-air hybrid events reward organization more than minimalism.', true, ['race']),
          option('Trisuit + thermal bike layer ready after the pool', 'Keeps the race kit simple while respecting the cold outdoor legs.', false, ['race']),
          option('Extra pre-start and post-swim warmth plan', 'The swim is sheltered, but the event still starts and continues in cold air.', false, ['race'])
        ];
        mainOptions.splice(0, mainOptions.length, ...hybridRaceMainOptions);
      } else if (isDryMulti) {
        const dryRaceMainOptions = t >= 18 ? [
          option(isOffRoadMulti ? 'Light off-road race kit' : 'Light race top + shorts / skinsuit', 'Simple dry multisport race-day default.', true, ['race']),
          option(isOffRoadMulti ? 'Run-first kit + MTB layer ready' : 'Bike-first kit + run layer ready', 'Useful when one leg clearly drives the exposure.', false, ['race']),
          option('Arm coolers / light shell packed', 'Useful when the start looks cool or the course stays exposed.', false, ['race'])
        ] : t >= 10 ? [
          option('Light race kit + arm warmers / gilet', 'Balanced cool-weather dry multisport setup.', true, ['race']),
          option(isOffRoadMulti ? 'Trail-first top + shell packed' : 'Bike-first outer layer plan', 'Useful when the first exposed minutes will feel cold.', false, ['race']),
          option('Longer-coverage top + shorts', 'Simple answer if you dislike removable layers.', false, ['race'])
        ] : [
          option('Thermal race kit + shell / gilet', 'Race-first, but realistic in cold air.', true, ['race']),
          option(isOffRoadMulti ? 'Warm trail / MTB split setup' : 'Warm bike/run split setup', 'Makes more sense when the air is genuinely cold.', false, ['race']),
          option('Extra pre-start warmth plan', 'Cold dry multisport rewards organization more than minimalism.', false, ['race'])
        ];
        mainOptions.splice(0, mainOptions.length, ...dryRaceMainOptions);
      } else {
        mainOptions.splice(0, mainOptions.length, ...raceMainOptions);
      }
      if (multisportActivity === 'triathlon' || multisportActivity === 'cross_triathlon') core.unshift(item('Transition layout walkthrough', 'Do a literal T1/T2 walkthrough: where the helmet, glasses, shoes, race belt, and run-out items sit, and what order they happen in.', ['race day', 'transition']));
      core.unshift(item('Race belt / number / timing chip check', 'Do the full pre-race check so you are not improvising in transition.', ['race day']));
      if (multisportActivity === 'triathlon' || multisportActivity === 'cross_triathlon') extras.unshift(item('Spare transition contingency', 'Bring a small backup plan for T1/T2: spare goggles, extra elastic, dry towel, or a quick wipe-down item if the venue allows it.', ['race day', 'transition']));
      extras.unshift(item('Transition bag / post-race comfort plan', 'A real event day rewards a little extra organization.', ['race day']));
      if (raceDaySupportItems.length) extras.unshift(...raceDaySupportItems);
    }
    if (eventPreset?.key === 'tri_70' || eventPreset?.key === 'tri_full' || eventPreset?.key === 'swimrun_long' || eventPreset?.key === 'xtri_long' || eventPreset?.key === 'xdu_long' || (distanceKmValue != null && distanceKmValue >= 80)) extras.push(item('Long-course fuel / carry plan', 'Clothing and storage choices start to overlap here.', ['long-course']));
    const hybridSwimSummary = hasIndoorSwimLeg && !hasOutdoorSwimLeg ? ' The swim block is indoors, so the kit leans toward transition organization and the outdoor legs instead of open-water temperature.' : '';
    return { point, startTime, chips: hasOutdoorSwimLeg ? [...chips, getWaterTemperatureChip(point, data), { label: `ðŸ ${multisportSummary}` }] : [...chips, { label: `ðŸ ${multisportSummary}` }], activityLabel: multisportLabel, summary: `${eventLabel} preset for ${multisportLabel}, planned as ${multisportSummary}, around ${Math.round(feels)}Â°C feels-like${wt != null ? ` and water near ${formatWaterTemperatureValue(point)}` : ''}.${hybridSwimSummary}`.replace('..', '.'), steps: [ makeChoiceStep('Step 1 · Pick the main multisport kit', `Build around the ${multisportLabel} legs you selected.`, mainOptions), makeListStep('Step 2 · Add the event-specific essentials', 'The small multisport details matter more than they look.', core), makeListStep('Step 3 · Before / after / long-course extras', 'Useful once the event gets bigger.', extras) ], warning: hasOutdoorSwimLeg && wt == null ? 'Water temperature was not available here. Check local swim conditions before locking your swim setup.' : null };
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
    return { point, startTime, chips: [...chips, getWaterTemperatureChip(point, data)], activityLabel: activityLabels[activity], summary: `${eventLabel} around ${distanceText}, with air around ${Math.round(feels)}Â°C feels-like${wt != null ? ` and water near ${formatWaterTemperatureValue(point)}` : ''}${wave != null ? `, waves around ${wave} m` : ''}.`, steps: [ makeChoiceStep('Step 1 · Pick the swim-suit system', 'For open water, this is the main clothing decision.', suitOptions), makeListStep('Step 2 · Add the safety / swim essentials', 'These are the items that make the session workable and visible.', core), makeListStep('Step 3 · Before / after extras', 'Open-water comfort often lives outside the actual swim.', extras) ], warning };
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
    return { point, startTime, chips: [...chips, getWaterTemperatureChip(point, data)], activityLabel: activityLabels[activity], summary: `${eventLabel} ${waterName} setup around ${distanceText}, with air around ${Math.round(feels)}Â°C feels-like${wt != null ? ` and water near ${formatWaterTemperatureValue(point)}` : ''}${wave != null ? `, waves around ${wave} m` : ''}.`, steps: [ makeChoiceStep('Step 1 · Pick the water setup', 'Start with warmth, immersion risk, and wind exposure.', suitOptions), makeListStep('Step 2 · Add the safety / practical pieces', 'These make the session workable rather than just technically dressed.', core), makeListStep('Step 3 · Exit / backup extras', 'A good dry exit plan matters a lot around water.', extras) ], warning };
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
    const poolChips = poolNeedsWaterTemp ? [...chips, { label: `ðŸŠ ${poolTypeLabel}`, tone: '' }, getWaterTemperatureChip(point, data)] : [...chips, { label: `ðŸŠ ${poolTypeLabel}`, tone: '' }];
    const waterSummary = poolNeedsWaterTemp && wt != null ? `, with water estimated around ${formatWaterTemperatureValue(point)}` : '';
    const warning = poolNeedsWaterTemp && wt == null ? 'Pool water temperature is unknown. For outdoor/unheated pools, verify locally before treating it like a normal heated pool.' : null;
    const poolSummary = noLocationIndoor
      ? `${eventLabel} around ${distanceText} in an ${poolTypeLabel}. Location is optional here; add one only if you want commute-weather layers.`
      : `${eventLabel} around ${distanceText} in an ${poolTypeLabel}${waterSummary}; outside still lines up with about ${Math.round(feels)}Â°C feels-like.`;
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
      : `${eventLabel} setup for ${indoorLabel}${isIndoorMulti ? ` (${indoorMultiSummary})` : ''}, with outside conditions around ${Math.round(feels)}Â°C feels-like for the trip there and back.`;
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
    return { point, startTime, chips, activityLabel: mountainLabel, summary: `${eventLabel} setup for ${mountainLabel}, with planning feel around ${Math.round(exposureTemp)}Â°C${wet ? ' and wet / mixed-surface risk' : ''}.`, steps: [ makeChoiceStep('Step 1 · Pick the main trail / mountain kit', 'Start with the clothing system for exposure, terrain, and effort level.', mainOptions), makeListStep('Step 2 · Add terrain-specific essentials', 'These are the things that keep the outing practical and safer.', core), makeListStep('Step 3 · Backup / exposure extras', 'Worth adding when the day gets longer, colder, higher, or more remote.', extras) ], warning: point.code >= 95 ? 'Storms and exposed terrain are a route/timing problem, not just a gear problem.' : null };
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
    if (isFishing) core.push(item('Cold-water margin', 'Dress for falling in, spray, or handling wet gear when the water is cold â€” not just the air.', ['water']));
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
    return { point, startTime, chips: fieldChips, activityLabel: fieldLabel, summary: `${eventLabel} setup for ${fieldLabel}, with static-planning feel around ${Math.round(planningTemp)}Â°C and ${desc}${wet ? ' with wet-weather risk' : ''}.${fieldSummary}`, steps: [ makeChoiceStep(`Step 1 · Pick the main ${isFishing ? 'fishing' : 'hunting'} setup`, 'Static exposure, wind, and wet ground matter more than speed here.', mainOptions), makeListStep('Step 2 · Add the field essentials', 'Safety, footwear, hands, and weather protection are the big pieces.', core), makeListStep('Step 3 · Static-exposure extras', 'These make long sits, shore time, cold starts, or wet exits less miserable.', extras) ], warning: point.code >= 95 ? 'Storms and exposed water/field locations are a timing and safety problem, not just a clothing problem.' : null };
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
    return { point, startTime, chips, activityLabel: activityLabels[activity], summary: `${eventLabel} setup for ${distanceText}, with about ${Math.round(feels)}Â°C feels-like at the planned start and ${desc}${wet ? ' with some precipitation risk' : ''}.`, steps: [ makeChoiceStep('Step 1 · Pick the main walking outfit', 'Choose the broad warmth level first, then tune footwear and small accessories.', mainOptions), makeListStep('Step 2 · Add the walking essentials', 'Simple items that matter more once you are outside for a while.', core), makeListStep('Step 3 · Longer-walk / bad-weather extras', 'Bring these when the walk gets longer, colder, windier, or darker.', extras) ], warning: point.code >= 95 ? 'Thunderstorms are a timing problem, not a walking-outfit problem.' : null };
  }

  if (activity === 'road_trip') {
    const routeWeather = getRouteWeatherExtremes();
    const coldestStopFeels = firstFinite(routeWeather?.coldestFeels, feels);
    const planningFeels = Math.min(feels, coldestStopFeels);
    const endDelta = routeWeather?.deltaFeels;
    const largeSwing = isFiniteNumber(endDelta) && Math.abs(endDelta) >= 8;
    if (routeWeather?.coldest) chips.push({ label: `ðŸ›£ coldest stop ${Math.round(routeWeather.coldestFeels)}Â°C`, tone: routeWeather.coldestFeels <= 5 ? 'warn' : '' });
    if (isFiniteNumber(endDelta)) chips.push({ label: `â†• end ${endDelta > 0 ? '+' : ''}${Math.round(endDelta)}Â°C vs start`, tone: Math.abs(endDelta) >= 8 ? 'warn' : '' });

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
      item('Shoes that still work for fuel, food, and weather stops', routeWeather?.coldest ? `Dress for the roughest stop, not just the cabin â€” ${routeWeather.coldest.label} looks coolest.` : 'You are sitting a lot, but not teleporting door-to-door.'),
      item('Shell or rain layer within reach', routeWeather?.wettest && firstFinite(routeWeather.maxPrecipProb, 0) >= 40 ? `The wettest stop around ${routeWeather.wettest.label} looks meaningfully wetter than the start.` : (wet ? 'Useful once stops get wet.' : 'Still worth keeping handy for roadside or break stops.')),
      item('Base layer or easy mid-layer when the route cools off', planningFeels <= 6 || profile.minutes >= 360 || largeSwing ? 'Helps a lot when one stop or the destination is colder than the start.' : 'Usually optional.', ['base layer'])
    ];
    if (!light.isDay || light.tone === 'warn') core.push(item('Visibility / flashlight at stops', 'Very worthwhile for dark rest-area or roadside stops.', ['light']));
    if (planningFeels <= 3) core.push(item('Gloves + warm hat staged in the cabin (for example knit gloves and a beanie)', routeWeather?.coldest ? `The coldest stop is around ${Math.round(routeWeather.coldestFeels)}Â°C feels-like.` : 'Mostly for outside time, not for driving.', ['cold']));
    if (firstFinite(routeWeather?.maxWind, point.wind, 0) >= 30 || firstFinite(routeWeather?.maxPrecipProb, point.precipProb, 0) >= 45) core.push(item('Extra dry / windproof layer in the trunk', 'Stops can feel a lot rougher than the cabin suggests.', ['travel']));

    const extras = [
      item('Sunglasses', light.isDay ? 'Useful for glare and fatigue.' : 'Skip once it is dark.', ['daylight']),
      item('Water / snacks', profile.minutes >= 240 || (distanceKmValue != null && distanceKmValue >= 250) ? 'Makes the long drive feel less stupid.' : 'Optional.'),
      item('Blanket or spare warm layer', profile.minutes >= 360 || planningFeels <= 4 || (distanceKmValue != null && distanceKmValue >= 500) ? 'Great backup if you stop longer than expected or the destination is colder.' : 'Nice-to-have.'),
      item('Cabin-access change layer', largeSwing ? 'If the destination is much colder or warmer than the start, this is genuinely useful.' : 'Optional unless the route spans very different conditions.')
    ];

    const routeSummary = routeWeather?.coldest
      ? ` The route-loaded weather says the coldest stop is ${routeWeather.coldest.label} near ${routeWeather.coldest.placeLabel || 'the route'} at about ${Math.round(routeWeather.coldestFeels)}Â°C feels-like${isFiniteNumber(endDelta) ? `, with the finish running ${endDelta > 0 ? 'about ' + Math.round(endDelta) + 'Â°C warmer' : 'about ' + Math.abs(Math.round(endDelta)) + 'Â°C colder'} than the start` : ''}.`
      : '';

    return { point, startTime, chips, activityLabel: activityLabels[activity], summary: `${eventLabel} setup for ${distanceText}, with about ${Math.round(feels)}Â°C feels-like at the planned start and ${desc}${wet ? ' with some wet-stop risk' : ''}.${routeSummary}`.replace('..', '.'), steps: [ makeChoiceStep('Step 1 · Pick the main travel outfit', 'Focus on what still works when you get out of the car.', mainOptions), makeListStep('Step 2 · Add the stop / weather essentials', 'These matter most once you start opening the doors.', core), makeListStep('Step 3 · Long-drive extras', 'These start making more sense as the travel day grows.', extras) ], warning: point.code >= 95 ? 'Strong storms can change a road trip more than a clothing choice can.' : null };
  }

  if (activity === 'camping') {
    const overnight = getCampingOvernightSummary(data, startTime, profile);
    const overnightFeels = firstFinite(overnight?.overnightFeels, overnight?.overnightLow, t);
    const campPlanningTemp = Math.min(t, firstFinite(overnightFeels, t));
    const windyCamp = firstFinite(overnight?.windyCamp, point.wind, 0);
    const campWet = wet || firstFinite(overnight?.precipChance, 0) >= 40 || firstFinite(overnight?.precipSum, 0) >= 3;
    if (isFiniteNumber(overnightFeels)) chips.push({ label: `ðŸŒ™ overnight ${Math.round(overnightFeels)}Â°C`, tone: overnightFeels <= 2 ? 'warn' : '' });
    if (windyCamp >= 30) chips.push({ label: `â›º gusty camp ${Math.round(windyCamp)} km/h`, tone: 'warn' });

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

    return { point, startTime, chips, activityLabel: activityLabels[activity], summary: `${eventLabel} setup for ${distanceText}, with outside conditions around ${Math.round(feels)}Â°C feels-like${campWet ? ' and some wet-weather risk' : ''}${isFiniteNumber(overnightFeels) ? `, and an overnight low around ${Math.round(overnightFeels)}Â°C feels-like` : ''}.`, steps: [ makeChoiceStep('Step 1 · Pick the camp clothing system', 'Think daytime movement, evening camp time, and the overnight drop.', mainOptions), makeListStep('Step 2 · Add the camp and shelter essentials', 'These matter more than a perfectly optimized daytime outfit.', core), makeListStep('Step 3 · Sleep-system and multi-day extras', 'Camping comfort usually lives in the overnight setup.', extras) ], warning: point.code >= 95 ? 'Thunderstorms and camping call for a plan, not just a different jacket.' : null };
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
  return { point, startTime, chips, activityLabel: activityLabels[activity], summary: `${eventLabel} setup for ${distanceText}, with about ${Math.round(feels)}Â°C feels-like at the planned start and ${desc}${wet ? ' with some precipitation risk' : ''}.`, steps: [ makeChoiceStep('Step 1 · Pick the main everyday outfit', 'Choose the broad clothing level first.', mainOptions), makeListStep('Step 2 · Add the practical extras', 'Only the pieces that actually improve comfort.', core), makeListStep('Step 3 · Optional comfort / winter items', 'Bring these when the duration or cold justifies them.', extras) ], warning: point.code >= 95 ? 'Thunderstorms are much more a â€œgo laterâ€ problem than a â€œdress betterâ€ problem.' : null };
}

function compactStepTitle(step, index) {
  if (index === 0) return 'Main pick';
  if (index === 1) return 'Add to the setup';
  if (index === 2) return 'Nice-to-have extras';
  return step.title?.replace(/^Step\s*\d+\s*·\s*/i, '').trim() || `Step ${index + 1}`;
}

function buildCompactSummary(point, desc, wizard) {
  const bits = [`Feels ${Math.round(point.feels)}Â°C`, desc];
  if ((point.wind || 0) >= 25) bits.push(`wind ${Math.round(point.wind)} km/h`);
  if ((point.precipProb || 0) >= 35 || (point.precip || 0) >= 0.2) bits.push('wet');
  const darkChip = wizard.chips.find(chip => /dark|night/i.test(chip.label));
  if (darkChip) bits.push('low light');
  if (isFiniteNumber(point.waterTemp)) bits.push(`water ${round1(point.waterTemp)}Â°C`);
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
  if (/sleeping bag/.test(text)) add('0Â°C comfort sleeping bag', 'synthetic 3-season bag');
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
          ${wizard.chips.map(chip => `<div class="mini-chip ${chip.tone || ''}">${renderLeadingEmojiLabel(chip.label)}</div>`).join('')}
          <div class="mini-chip">ðŸ· ${escapeHtml(wizard.activityLabel)}</div>
          <div class="mini-chip">ðŸ  indoor / controlled setting</div>
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
        ${wizard.warning ? `<div class="warning-box">${renderSymbolIconHtml('âš ï¸', 'wi', 'Warning', true)}<span>${escapeHtml(wizard.warning)}</span></div>` : ''}
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

function getWeatherProvenanceSummary(data = weatherData) {
  const provenance = getWeatherDataProvenance(data);
  const stamp = provenance?.savedAt || weatherRefreshStatus.lastSuccessAt || '';
  const formatted = formatRefreshStatusDateTime(stamp);
  if (provenance?.kind === 'cached') return formatted ? `cached forecast · ${formatted}` : 'cached forecast';
  if (provenance?.kind === 'cached_stale') return formatted ? `saved offline forecast · ${formatted}` : 'saved offline forecast';
  return formatted ? `live forecast · ${formatted}` : 'live forecast';
}

function getAlertsProvenanceSummary(data = weatherData) {
  if (!data) return '';
  if (data.ecccAlertStatus === 'ok') return 'official alerts';
  if (shouldUseEcccAlertsForWeatherData(data)) return 'forecast-derived alerts';
  return 'forecast-derived warnings';
}

function getRouteProvenanceSummary() {
  if (!routeState?.points?.length) return '';
  if (routeState?.routeSource?.provider === 'strava') {
    return routeState?.routeSource?.kind === 'activity' ? 'imported Strava activity' : 'imported Strava route';
  }
  return 'local route file';
}

function renderProvenanceChips(data, point) {
  const chips = [
    `<span class="provenance-chip">${escapeHtml(getWeatherProvenanceSummary(data))}</span>`,
    `<span class="provenance-chip">${escapeHtml(getAlertsProvenanceSummary(data))}</span>`
  ];
  const routeProvenance = getRouteProvenanceSummary();
  if (routeProvenance) chips.push(`<span class="provenance-chip">${escapeHtml(routeProvenance)}</span>`);

  const plannerSources = buildPlannerSourceDiagnostics();
  if (plannerSources.distance?.source && plannerSources.distance.source !== 'none') chips.push(`<span class="provenance-chip">distance: ${escapeHtml(getValueProvenanceLabel(plannerSources.distance.source))}</span>`);
  if (plannerSources.duration?.source && plannerSources.duration.source !== 'none') chips.push(`<span class="provenance-chip">duration: ${escapeHtml(getValueProvenanceLabel(plannerSources.duration.source))}</span>`);
  if (point?.waterTempSource && point.waterTempSource !== 'unknown') chips.push(`<span class="provenance-chip">water: ${escapeHtml(String(point.waterTempSource))}</span>`);

  return `<div class="provenance-strip">${chips.join('')}</div>`;
}

function renderResultLocationHeader(locationName, point = null) {
  const showBackToStart = !!(activeRoutePointForecast?.isRoutePoint && routeState?.points?.length);
  return `
    <div class="location-name-row">
      <div class="location-name">ðŸ“ <span>${escapeHtml(locationName)}</span></div>
      <div class="location-name-actions">
        ${showBackToStart ? `<button class="mode-toggle-btn result-refresh-btn" type="button" data-action="backToRouteStart">Back to start</button>` : ''}
        <button class="mode-toggle-btn result-refresh-btn" type="button" data-action="forceRefreshWeather">Refresh weather</button>
      </div>
    </div>
    ${renderWeatherRefreshStatus()}
    ${renderProvenanceChips(weatherData, point)}
  `;
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
  if (forecastOnlyMode) updateForecastOnlyModeUi();
  const startTime = getDisplayStartTime(data);
  const shouldUseCurrentPoint = !activeRoutePointForecast?.isRoutePoint && startMode === 'now';
  const pointBase = shouldUseCurrentPoint ? { ...data.current, time: data.current.time } : getHourlyPointForStart(data, startTime);
  const point = applyCustomWeatherOverrides(pointBase, data);
  const [, desc] = wCodeToEmoji(point.code);
  const windSummary = formatWindTooltip(point.wind || data.current.wind, point.gusts || data.current.gusts, point.windDir || data.current.windDir);
  const metaLines = [
    `${renderSymbolIconHtml('💦', 'inline-symbol-icon', 'Humidity', true)} Humidity <strong>${escapeHtml(data.current.humidity)}%</strong>`,
    `${renderSymbolIconHtml('💨', 'inline-symbol-icon', 'Wind', true)} Wind <strong>${escapeHtml(windSummary.speedText)}</strong> ${windSummary.dirHtml}`,
    `${renderSymbolIconHtml('↯', 'inline-symbol-icon', 'Gusts', true)} Gusts <strong>${escapeHtml(windSummary.gustText)}</strong>`,
    `${renderSymbolIconHtml('🌧️', 'inline-symbol-icon', 'Precip', true)} Precip <strong>${escapeHtml(round1(point.precip || 0))} mm</strong> · <strong>${escapeHtml(Math.round(firstFinite(point.precipProb, 0)))}%</strong>`
  ];
  const uvInfo = getUvRiskInfo(getUvDisplayValue(point, data));
  if (uvInfo) metaLines.push(`${renderSymbolIconHtml('☀️', 'inline-symbol-icon', 'UV', true)} ${renderUvBadge(uvInfo.value)}`);
  const aqiInfo = getAqiInfo(point.aqi ?? data.current.aqi);
  if (aqiInfo) metaLines.push(`${renderSymbolIconHtml('💨', 'inline-symbol-icon', 'Air quality', true)} ${renderAqiBadge(aqiInfo.value)}`);

  const weatherMetaDay = getDayRecord(data, point.time || startTime || data.currentTime);
  if (weatherMetaDay?.sunrise || weatherMetaDay?.sunset) {
    const sunBits = [];
    if (weatherMetaDay.sunrise) sunBits.push(`${renderSymbolIconHtml('🌅', 'inline-symbol-icon', 'Sunrise', true)} Sunrise <strong>${escapeHtml(formatShortTime(weatherMetaDay.sunrise))}</strong>`);
    if (weatherMetaDay.sunset) sunBits.push(`${renderSymbolIconHtml('🌇', 'inline-symbol-icon', 'Sunset', true)} Sunset <strong>${escapeHtml(formatShortTime(weatherMetaDay.sunset))}</strong>`);
    if (sunBits.length) metaLines.push(sunBits.join(' · '));
  }
  const waterMetaLine = renderWaterTemperatureMetaLine(point, data);
  const showWaterUi = shouldShowWaterTemperatureSignal(point, activity || selectedActivity);
  if (waterMetaLine) metaLines.push(waterMetaLine);
  if (isFiniteNumber(point.waveHeight)) metaLines.push(`${renderSymbolIconHtml('🌊', 'inline-symbol-icon', 'Waves', true)} Waves <strong>${escapeHtml(round1(point.waveHeight))} m</strong>`);

  const durationState = getDurationState(getSelectedEvent());
  if (!durationState) {
      resultInner.innerHTML = repairDisplayMarkup(`
        <div class="result-sections">
          <section class="result-panel">
          ${renderResultLocationHeader(data.locationName, point)}
          <div class="weather-strip">
            ${weatherIconHtml(point.code, 'weather-icon')}
            <div class="weather-main">
              <div class="when">${escapeHtml(formatWeatherDateTime(point.time || startTime))}</div>
              <div class="temp">${escapeHtml(Math.round(point.temp))}Â°C</div>
              <div class="desc">${escapeHtml(desc)} · feels ${escapeHtml(Math.round(point.feels))}Â°C</div>
            </div>
            <div class="weather-meta">${metaLines.join('<br>')}</div>
          </div>
          ${showWaterUi ? `<div class="mini-chips">
            <div class="mini-chip ${point.waterTempSource === 'measured' ? 'ok' : point.waterTempSource === 'estimated' ? '' : 'warn'}">${renderSymbolIconHtml('ðŸŒŠ', 'inline-symbol-icon', 'Water', true)} ${escapeHtml(getWaterTemperatureSourceLabel(point, data))}</div>
          </div>` : ''}
          ${showWaterUi ? renderWaterTempDisclaimer(point) : ''}
          <div class="block-title">Weather & forecast</div>
          <div class="route-callout">With a route loaded, set a planned duration to time both the forecast window and the route checkpoints.</div>
          ${routeState?.points?.length ? `<div id="route-weather-slot">${buildRouteWeatherHtml()}</div>` : ''}
        </section>
        ${forecastOnlyMode ? '' : `<section class="result-panel">
          <div class="block-title">Clothing & gear</div>
          <p class="summary">Choose a planned duration to time the outing, then choose an activity to turn the weather into clothing and gear suggestions.</p>
        </section>`}
      </div>
    `);
    updateManualWeatherStatus();
    bindForecastChartTooltips();
    bindForecastChartInteractions();
    return;
  }

  if (!activity) {
    const selectionForWarnings = getForecastSelection(data, startTime);
    const weatherWarningsHtml = renderWeatherHazardWarnings(data, selectionForWarnings, point, activity);
    resultInner.innerHTML = repairDisplayMarkup(`
      <div class="result-sections">
        <section class="result-panel">
          ${renderResultLocationHeader(data.locationName, point)}
          <div class="weather-strip">
            ${weatherIconHtml(point.code, 'weather-icon')}
            <div class="weather-main">
              <div class="when">${escapeHtml(formatWeatherDateTime(point.time || startTime))}</div>
              <div class="temp">${escapeHtml(Math.round(point.temp))}Â°C</div>
              <div class="desc">${escapeHtml(desc)} · feels ${escapeHtml(Math.round(point.feels))}Â°C</div>
            </div>
            <div class="weather-meta">${metaLines.join('<br>')}</div>
          </div>
          ${showWaterUi ? `<div class="mini-chips">
            <div class="mini-chip ${point.waterTempSource === 'measured' ? 'ok' : point.waterTempSource === 'estimated' ? '' : 'warn'}">${renderSymbolIconHtml('ðŸŒŠ', 'inline-symbol-icon', 'Water', true)} ${escapeHtml(getWaterTemperatureSourceLabel(point, data))}</div>
          </div>` : ''}
          ${showWaterUi ? renderWaterTempDisclaimer(point) : ''}
          ${weatherWarningsHtml}
          <div class="block-title">Weather & forecast</div>
          ${renderForecastBlock(data, startTime)}
          ${routeState?.points?.length ? `<div id="route-weather-slot">${buildRouteWeatherHtml()}</div>` : ''}
        </section>
        ${forecastOnlyMode ? '' : `<section class="result-panel">
          <div class="block-title">Clothing & gear</div>
          <p class="summary">Choose an activity to turn the weather into clothing and gear suggestions.</p>
        </section>`}
      </div>
    `);
    updateManualWeatherStatus();
    bindForecastChartTooltips();
    bindForecastChartInteractions();
    return;
  }

  const wizard = augmentWizardWithAqiContext(augmentWizardWithUvContext(buildWizard(data, activity), data, activity), data, activity);
  const selectionForWarnings = getForecastSelection(data, wizard.startTime);
  const weatherWarningsHtml = renderWeatherHazardWarnings(data, selectionForWarnings, point, activity);
  resultInner.innerHTML = repairDisplayMarkup(`
    <div class="result-sections">
      <section class="result-panel">
        ${renderResultLocationHeader(data.locationName, point)}
        <div class="weather-strip">
          ${weatherIconHtml(point.code, 'weather-icon')}
          <div class="weather-main">
            <div class="when">${escapeHtml(formatWeatherDateTime(point.time || wizard.startTime))}</div>
            <div class="temp">${escapeHtml(Math.round(point.temp))}Â°C</div>
            <div class="desc">${escapeHtml(desc)} · feels ${escapeHtml(Math.round(point.feels))}Â°C</div>
          </div>
          <div class="weather-meta">${metaLines.join('<br>')}</div>
        </div>

        <div class="mini-chips">
          ${wizard.chips.map(chip => `<div class="mini-chip ${chip.tone || ''}">${renderLeadingEmojiLabel(chip.label)}</div>`).join('')}
          <div class="mini-chip">ðŸ· ${escapeHtml(wizard.activityLabel)}</div>
          ${showWaterUi ? `<div class="mini-chip ${point.waterTempSource === 'measured' ? 'ok' : point.waterTempSource === 'unknown' ? 'warn' : ''}">${renderSymbolIconHtml('ðŸŒŠ', 'inline-symbol-icon', 'Water', true)} ${escapeHtml(getWaterTemperatureSourceLabel(point, data))}</div>` : ''}
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
        ${wizard.warning ? `<div class="warning-box">${renderSymbolIconHtml('âš ï¸', 'wi', 'Warning', true)}<span>${escapeHtml(wizard.warning)}</span></div>` : ''}
      </section>
    </div>
  `);
  syncInteractiveAdvice();
  bindForecastChartTooltips();
  bindForecastChartInteractions();
  updateManualWeatherStatus();
  if (activity === 'road_trip') triggerRoadTripItinerary();
}

// â”€â”€ Road trip itinerary (OSM/Nominatim client-side) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
  return `${Math.round(cp.weather.temp)}Â°C / feels ${Math.round(cp.weather.feels)}Â°C · ${desc.toLowerCase()} · wind ${Math.round(cp.weather.wind || 0)} km/h`;
}

// Give each itinerary row a reason for existing.
// This keeps the road-trip output from becoming a plain list of timestamps.
function buildRoadTripRationale(cp, context = {}) {
  if (!cp?.weather) return 'Checkpoint on the loaded route.';
  const feels = firstFinite(cp.weather.feels, cp.weather.temp, 0);
  const precipProb = firstFinite(cp.weather.precipProb, 0);
  const wind = firstFinite(cp.weather.wind, 0);
  if (context.segmentMinutes >= 150) return 'Long segment ahead â€” a natural fuel, washroom, and stretch stop.';
  if (precipProb >= 55) return 'Wettest stretch nearby â€” a good place to layer up before getting out again.';
  if (wind >= 35) return 'Wind looks strongest here â€” worth a quick layer and comfort check.';
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
      rationale: segmentMinutes >= 180 ? 'Long time in the car â€” break up the segment before it gets stale.' : 'Useful midpoint to reset before the next longer stretch.',
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
              <div class="stop-meta">${stop.eta ? `ðŸ•’ ${escapeHtml(stop.eta)}` : ''}${isFiniteNumber(stop.kmFromStart) ? ` · ${escapeHtml(formatKmPrefix(stop.kmFromStart))}` : ''}${stop.weather ? ` · ${escapeHtml(stop.weather)}` : ''}</div>
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

  if (forecastOnlyMode) {
    return [
      {
        number: 1,
        target: 'location-card',
        title: 'Location',
        body: locationReady
          ? 'Weather is loaded for the current place. Change the city or use current location whenever you want a different forecast.'
          : 'Search a city or use current location to load the forecast. Route upload and Strava import are hidden in Forecast-only mode.',
        state: locationReady ? helperState('active', 'done') : helperState('start here', '')
      },
      {
        number: 2,
        target: 'duration-section',
        title: 'Planned duration',
        body: durationState?.source === 'custom'
          ? `Planned preset ${getSelectedDurationPreset()?.label || 'none'} with a custom override of ${durationState.label}.`
          : durationState?.source === 'derived'
            ? `Planned preset ${getSelectedDurationPreset()?.label || 'none'} with a calculated active duration of ${durationState.label}.`
          : 'Pick a forecast scale preset or enter a custom duration. Duration controls how much forecast time and hazard context the results summarize.',
        state: durationState?.source === 'custom' ? helperState('custom', 'done') : helperState('preset', 'optional')
      },
      {
        number: 3,
        target: 'start-time-section',
        title: 'Start time',
        body: locationReady
          ? 'Choose Now or Later to time the forecast. Best window search is hidden in Forecast-only mode.'
          : 'Fetch a location first to unlock start-time planning.',
        state: locationReady ? helperState(startMode, 'done') : helperState('locked', 'locked')
      },
      {
        number: 4,
        target: 'result-card',
        title: 'Results',
        body: resultCard?.style.display === 'block'
          ? 'Use this panel for the forecast summary, warnings, water signal when available, and forecast cells for the selected window.'
          : 'Results appear after you load a location. Forecast-only mode skips clothing guidance and focuses on weather, timing, and hazards.',
        state: resultCard?.style.display === 'block' ? helperState('ready', 'done') : helperState('waiting', '')
      }
    ];
  }

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
      body: forecastOnlyMode
        ? 'Forecast-only mode is active. Leave activity empty to focus on weather, timing, and hazards without clothing guidance.'
        : activityName
          ? `Currently set to ${activityName}. This controls presets, gear logic, water-temperature handling, and route/weather priorities.`
          : 'Pick what you are doing. This is the biggest switch in the tool because it changes the recommendation logic.',
      state: forecastOnlyMode ? helperState('forecast only', 'optional') : selectedActivity ? helperState('selected', 'done') : helperState('required', '')
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
          ? `Planned preset ${getSelectedDurationPreset()?.label || 'none'} with a custom override of ${durationState.label}.`
          : durationState?.source === 'derived'
            ? `Planned preset ${getSelectedDurationPreset()?.label || 'none'} with a calculated active duration of ${durationState.label}.`
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
      target: 'water-temp-section',
      title: 'Water temperature & override',
      body: waterRelevant
        ? 'Used for open water, outdoor/unheated pools, triathlon, and water sports. The app prefers measured data, then an estimated fallback, then unknown, with manual override available.'
        : 'Only matters for swimming, water sports, triathlon, or unheated outdoor pools. You can usually ignore it for dry-land activities.',
      state: waterRelevant ? helperState('relevant', 'done') : helperState('skip', 'locked')
    },
    {
      number: 8,
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
      number: 9,
      target: 'checkpoint-model-section',
      title: 'Weather checkpoint model',
      body: routeLoaded
        ? 'Controls how route weather checkpoints are placed. Smart mode considers time, terrain, daylight, weather swings, and wind.'
        : 'Only matters when a route is loaded. Without a route, this section can be ignored.',
      state: routeLoaded ? helperState(getCheckpointModelLabel(), 'done') : helperState('route only', 'locked')
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

function renderChangelog() {
  if (!changelogContent || !changelogToc || changelogRendered) return;
  const { tocHtml, bodyHtml } = buildChangelogHtml();
  changelogToc.innerHTML = tocHtml;
  changelogContent.innerHTML = bodyHtml;
  changelogRendered = true;
  renderChangelogTocVisibility();
}

function openChangelog() {
  if (!changelogOverlay) return;
  renderChangelog();
  renderChangelogTocVisibility();
  changelogOverlay.hidden = false;
  document.body.classList.add('helper-open');
  changelogCloseBtn?.focus({ preventScroll: true });
}

function closeChangelog() {
  if (!changelogOverlay) return;
  changelogOverlay.hidden = true;
  document.body.classList.remove('helper-open');
}

changelogOverlay?.addEventListener('click', event => {
  if (!(event.target instanceof Element)) return;
  const tocLink = event.target.closest('.changelog-toc-link');
  if (tocLink instanceof HTMLAnchorElement) {
    event.preventDefault();
    jumpToChangelogSection(tocLink.hash);
  }
});

shareOverlay?.addEventListener('click', event => {
  if (!(event.target instanceof Element)) return;
  if (event.target.closest('[data-action="closeSharePanel"]')) closeSharePanel();
});

shareCloseBtn?.addEventListener('click', closeSharePanel);
shareImportFileInput?.addEventListener('change', event => {
  void handleSharePackageFileInput(event);
});

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
  if (startupSessionOverlay && !startupSessionOverlay.hidden) return;
  if (forecastOnlyConfirmOverlay && !forecastOnlyConfirmOverlay.hidden) {
    closeForecastOnlyConfirm();
    return;
  }
  if (clearAllOverlay && !clearAllOverlay.hidden) {
    closeClearAllConfirm();
    return;
  }
  if (shareOverlay && !shareOverlay.hidden) {
    closeSharePanel();
    return;
  }
  if (stravaPickerOverlay && !stravaPickerOverlay.hidden) {
    closeStravaPicker();
    return;
  }
  if (changelogOverlay && !changelogOverlay.hidden) {
    closeChangelog();
    return;
  }
  if (quickStartOverlay && !quickStartOverlay.hidden) closeQuickStartGuide();
});

// Initial UI state and event wiring.
// The app is intentionally dependency-light, so most controls are plain DOM
// elements with direct listeners rather than a framework state store.
decorateFooterVersionLink();
setCurrentLocationButtonState(false);
reorderActivityGroups();
setupActivityGroupToggles();
setupPlannerSubsectionToggles();
const startTimeSection = document.getElementById('start-time-section');
const waterTempSection = document.getElementById('water-temp-section');
if (startTimeSection && waterTempSection) waterTempSection.after(startTimeSection);
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
    if (mark) mark.textContent = item.classList.contains('done') ? 'âœ“' : '';
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


function setSelectedActivityButton(activityKey) {
  document.querySelectorAll('.activity-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.activity === activityKey);
  });
}

function mapStravaActivityToPlannerActivity(activity) {
  const sport = String(activity?.sport_type || activity?.type || '').trim();
  if (!sport) return null;

  const directMap = {
    Run: 'running',
    TrailRun: 'trail_running',
    Ride: 'cycling',
    VirtualRide: 'indoor_cycling',
    MountainBikeRide: 'mtb_gravel',
    GravelRide: 'mtb_gravel',
    EMountainBikeRide: 'mtb_gravel',
    EBikeRide: 'cycling',
    Hike: 'hiking',
    Walk: 'walk',
    Swim: 'swimming_open',
    Surfing: 'surfing',
    Kayaking: 'kayaking',
    Canoeing: 'kayaking',
    StandUpPaddling: 'sup',
    Kitesurf: 'water_sports',
    Windsurf: 'water_sports',
    Sail: 'water_sports',
    Workout: 'gym',
    WeightTraining: 'gym',
    HighIntensityIntervalTraining: 'gym',
    Crossfit: 'gym',
    Elliptical: 'gym',
    StairStepper: 'gym',
    Pilates: 'gym',
    Yoga: 'gym',
    VirtualRun: 'indoor_running',
  };

  return directMap[sport] || null;
}

function mapStravaRouteToPlannerActivity(route) {
  const routeType = Number(route?.type);
  const routeSubtype = Number(route?.sub_type);
  if (routeType === 2) return routeSubtype === 4 ? 'trail_running' : 'running';
  if (routeType === 1) return [2, 3, 4, 5].includes(routeSubtype) ? 'mtb_gravel' : 'cycling';
  return null;
}

function formatStravaAverageForPlanner(kmh, activityKey) {
  if (!isFiniteNumber(kmh) || kmh <= 0) return null;
  const preferredUnit = getPreferredAverageUnit(activityKey);

  if (preferredUnit === 'kmh') {
    return { unit: 'kmh', value: round1(kmh).toFixed(1).replace(/\.0$/, '') };
  }

  const paceMinutes = preferredUnit === 'min_per_100m' ? (6 / kmh) : (60 / kmh);
  const wholeMinutes = Math.floor(paceMinutes);
  const seconds = Math.round((paceMinutes - wholeMinutes) * 60);
  const safeMinutes = seconds === 60 ? wholeMinutes + 1 : wholeMinutes;
  const safeSeconds = seconds === 60 ? 0 : seconds;

  return {
    unit: preferredUnit,
    value: `${safeMinutes}:${String(safeSeconds).padStart(2, '0')}`,
  };
}

function formatMinutesForPlannerInput(minutes) {
  if (!isFiniteNumber(minutes) || minutes <= 0) return '';
  const rounded = Math.round(minutes);
  const hours = Math.floor(rounded / 60);
  const mins = rounded % 60;
  return hours > 0 ? `${hours}:${String(mins).padStart(2, '0')}` : String(rounded);
}

function applyStravaPlannerAutofill(details) {
  const activityKey = details?.activityKey || null;
  if (activityKey) {
    selectedActivity = activityKey;
    selectedEventKey = null;
    if (durationUnitSelect) durationUnitSelect.value = getPreferredDurationUnit(activityKey);
    if (poolTypeSelect && activityKey === 'swimming_pool_indoor') poolTypeSelect.value = 'indoor_heated';
    setSelectedActivityButton(activityKey);
  }

  renderCustomControlOptions(true);

  const average = activityKey ? formatStravaAverageForPlanner(Number(details?.averageKmh), activityKey) : null;
  if (averageUnitSelect && average?.unit) averageUnitSelect.value = average.unit;
  if (averageInput) averageInput.value = average?.value || '';

  if (customDurationInput) {
    customDurationInput.value = details?.shouldSetDuration
      ? formatMinutesForPlannerInput(Number(details?.durationMinutes))
      : '';
    if (details?.shouldSetDuration && durationUnitSelect) {
      durationUnitSelect.value = getPreferredDurationUnit(activityKey);
    }
  }

  syncDurationFromEvent(getSelectedEvent());
  if (activityKey || details?.shouldSetDuration) collapsePlannerSubsection('duration', { scrollToNextOnMobile: true });
  renderPlannerState();
}

async function importStravaFirstRoute() {
  const routes = await fetchStravaRoutes(STRAVA_BACKEND_URL);
  if (!Array.isArray(routes) || !routes.length) throw new Error('No saved Strava routes found');
  const route = routes[0];
  let importedRoute;
  let routeDocument = null;
  try {
    const gpxText = await fetchStravaRouteGpx(STRAVA_BACKEND_URL, route.id);
    importedRoute = stravaRouteGpxToImportedRoute(route, gpxText);
    routeDocument = buildPersistedRouteDocumentSnapshot(`${route?.name || 'strava-route'}.gpx`, gpxText, 'strava_gpx');
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const isMissingExport = /resource not found|strava request failed \(404\)/i.test(message);
    if (!isMissingExport) throw error;
    importedRoute = stravaRouteSummaryToImportedRoute(route);
  }
  await applyImportedStravaRoute(importedRoute, 'Strava route', {
    activityKey: mapStravaRouteToPlannerActivity(route),
    averageKmh: Number(route?.distance) > 0 && Number(route?.estimated_moving_time) > 0
      ? (Number(route.distance) / 1000) / (Number(route.estimated_moving_time) / 3600)
      : null,
    durationMinutes: Number(route?.estimated_moving_time) > 0 ? Number(route.estimated_moving_time) / 60 : null,
    shouldSetDuration: !importedRoute?.hasRealTimestamps,
  }, routeDocument);
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
  if (stravaStatus) stravaStatus.textContent = 'Loading Strava routesâ€¦';
  try {
    await importStravaFirstRoute();
    renderStravaConnectionState();
  } catch (error) {
    if (stravaStatus) stravaStatus.textContent = error instanceof Error ? error.message : 'Unable to import Strava route';
  }
}

async function applyImportedStravaRoute(importedRoute, sourceLabel, plannerAutofill = null, routeDocument = null) {
  const nextRouteState = buildRouteStateWithSource(
    importedRoute.geometry,
    importedRoute.name || 'Strava route',
    buildImportedRouteSourceMeta(importedRoute, sourceLabel),
    routeDocument
  );
  applyStravaPlannerAutofill(plannerAutofill);
  captureRouteDistanceInputSnapshot();
  routeState = nextRouteState;
  locationCardCollapsed = true;
  updateLocationCardCollapseUi();
  collapsePlannerSubsection('duration', { scrollToNextOnMobile: true });
  clearRouteBtn.style.display = 'inline-block';
  renderPlannerState();
  clearRouteMapLayers();
  renderRouteMap();
  const routeLoadedMessage = `${importedRoute.name} imported from ${sourceLabel} · ${formatKm(routeState.totalKm)}${routeState.totalGain >= 20 ? ` · +${Math.round(routeState.totalGain)} m` : ''} · ${routeState.points.length} points · provenance: imported route`;
  routeStatus.textContent = routeLoadedMessage;
  if (routeState?.points?.[0]) {
    routeStatus.textContent = `${routeLoadedMessage} · refreshing weatherâ€¦`;
    try {
      await refreshWeatherForActiveTarget({
        source: 'service_import',
        detail: `Refreshing weather for ${importedRoute.name || 'imported route'}â€¦`,
        clearRouteCheckpointCache: true,
        placeOverride: { latitude: routeState.points[0].lat, longitude: routeState.points[0].lon, name: importedRoute.name || 'Strava route', admin1: '', country: '', country_code: '' }
      });
      routeStatus.textContent = routeLoadedMessage;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to refresh weather.';
      routeStatus.textContent = `${routeLoadedMessage} · weather refresh failed: ${message}`;
    }
  }
}

function getStravaPickerItems() {
  return stravaPickerTab === 'activities' ? stravaPickerActivities : stravaPickerRoutes;
}

function getStravaPickerCurrentPage() {
  return stravaPickerTab === 'activities' ? stravaPickerActivitiesPage : stravaPickerRoutesPage;
}

function getStravaPickerHasMore() {
  return stravaPickerTab === 'activities' ? stravaPickerActivitiesHasMore : stravaPickerRoutesHasMore;
}

function getStravaPickerCurrentError() {
  return stravaPickerTab === 'activities' ? stravaPickerActivityError : stravaPickerRouteError;
}

function addUniqueStravaItem(list, item) {
  if (!item?.id) return list;
  const itemId = String(item.id);
  if (list.some((entry) => String(entry?.id) === itemId)) return list;
  return [item, ...list];
}

function parseStravaUrlInput(rawValue) {
  const value = String(rawValue || '').trim();
  if (!value) throw new Error('Paste a Strava route or activity URL first.');

  const routeMatch = value.match(/(?:https?:\/\/)?(?:www\.)?strava\.com\/routes\/(\d+)/i);
  if (routeMatch) return { type: 'routes', id: routeMatch[1] };

  const activityMatch = value.match(/(?:https?:\/\/)?(?:www\.)?strava\.com\/activities\/(\d+)/i);
  if (activityMatch) return { type: 'activities', id: activityMatch[1] };

  const numericIdMatch = value.match(/^\d+$/);
  if (numericIdMatch) return { type: stravaPickerTab, id: numericIdMatch[0] };

  throw new Error('That does not look like a Strava route or activity URL.');
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

function getStravaPreviewMarkup(item) {
  const polyline = item?.map?.summary_polyline || item?.map?.polyline || '';
  const svg = buildStravaPreviewSvg(polyline);
  if (svg) return `<div class="strava-picker-preview">${svg}</div>`;
  return `<div class="strava-picker-preview strava-picker-preview-empty"><span>No map preview</span></div>`;
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
    stravaPickerStatus.textContent = 'Loading Strava itemsâ€¦';
  } else if (stravaPickerImporting) {
    stravaPickerStatus.textContent = stravaPickerTab === 'activities' ? 'Importing Strava activityâ€¦' : 'Importing Strava routeâ€¦';
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

  const itemsMarkup = items.map((item) => {
    if (stravaPickerTab === 'activities') {
      const subtitle = describeStravaActivity(item);
      const dateLabel = formatStravaDate(item?.start_date_local || item?.start_date);
      return `
        <button class="strava-picker-item" type="button" data-action="importStravaActivity" data-strava-activity-id="${escapeHtml(String(item.id))}">
          <div class="strava-picker-item-main">
            <div class="strava-picker-item-head">
              <strong>${escapeHtml(item?.name || 'Strava activity')}</strong>
              <span class="strava-picker-item-kicker">${escapeHtml(item?.sport_type || item?.type || 'Activity')}</span>
            </div>
            <div class="strava-picker-item-sub">${escapeHtml(subtitle || 'Recorded activity')}</div>
            <div class="strava-picker-item-meta">
              <span>${escapeHtml(dateLabel || 'Recent activity')}</span>
              <span>Import activity</span>
            </div>
          </div>
          ${getStravaPreviewMarkup(item)}
        </button>`;
    }

    const subtitle = describeStravaRoute(item);
    const dateLabel = formatStravaDate(item?.updated_at);
    return `
      <button class="strava-picker-item" type="button" data-action="importStravaRoute" data-strava-route-id="${escapeHtml(String(item.id))}">
        <div class="strava-picker-item-main">
          <div class="strava-picker-item-head">
            <strong>${escapeHtml(item?.name || 'Strava route')}</strong>
            <span class="strava-picker-item-kicker">Route</span>
          </div>
          <div class="strava-picker-item-sub">${escapeHtml(subtitle || 'Saved route')}</div>
          <div class="strava-picker-item-meta">
            <span>${escapeHtml(dateLabel ? `Updated ${dateLabel}` : 'Saved route')}</span>
            <span>Import route</span>
          </div>
        </div>
        ${getStravaPreviewMarkup(item)}
      </button>`;
  }).join('');

  const loadMoreMarkup = getStravaPickerHasMore() ? `
    <button class="btn btn-secondary strava-picker-load-more" type="button" data-action="loadMoreStravaItems">
      Load more ${escapeHtml(stravaPickerTab)}
    </button>` : '';

  stravaPickerList.innerHTML = `${itemsMarkup}${loadMoreMarkup}`;
}

async function ensureStravaPickerTabLoaded(tab, forceNextPage = false) {
  if (tab !== 'routes' && tab !== 'activities') return;
  if (stravaPickerLoading) return;
  if (tab === 'routes' && !forceNextPage && stravaPickerRoutesLoaded) return;
  if (tab === 'activities' && !forceNextPage && stravaPickerActivitiesLoaded) return;
  if (tab === 'routes' && forceNextPage && !stravaPickerRoutesHasMore) return;
  if (tab === 'activities' && forceNextPage && !stravaPickerActivitiesHasMore) return;

  stravaPickerLoading = true;
  if (tab === 'routes') stravaPickerRouteError = '';
  else stravaPickerActivityError = '';
  renderStravaPicker();

  try {
    if (tab === 'routes') {
      const nextPage = forceNextPage ? (stravaPickerRoutesPage + 1) : 1;
      const routes = await fetchStravaRoutes(STRAVA_BACKEND_URL, nextPage);
      const nextRoutes = Array.isArray(routes) ? routes : [];
      stravaPickerRoutes = forceNextPage ? [...stravaPickerRoutes, ...nextRoutes] : nextRoutes;
      stravaPickerRoutesPage = nextPage;
      stravaPickerRoutesLoaded = true;
      stravaPickerRoutesHasMore = nextRoutes.length >= STRAVA_ROUTE_PAGE_SIZE;
    } else {
      const nextPage = forceNextPage ? (stravaPickerActivitiesPage + 1) : 1;
      const activities = await fetchStravaActivities(STRAVA_BACKEND_URL, nextPage);
      const nextActivities = Array.isArray(activities) ? activities : [];
      stravaPickerActivities = forceNextPage ? [...stravaPickerActivities, ...nextActivities] : nextActivities;
      stravaPickerActivitiesPage = nextPage;
      stravaPickerActivitiesLoaded = true;
      stravaPickerActivitiesHasMore = nextActivities.length >= STRAVA_ACTIVITY_PAGE_SIZE;
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
  if (stravaPickerUrlInput) stravaPickerUrlInput.value = '';
  if (!isMobilePlannerLayout()) stravaPickerUrlInput?.focus({ preventScroll: true });
  void ensureStravaPickerTabLoaded(stravaPickerTab);
}

function closeStravaPicker() {
  if (!stravaPickerOverlay) return;
  stravaPickerOverlay.hidden = true;
  document.body.classList.remove('helper-open');
}

async function findStravaRouteById(routeId) {
  const targetId = String(routeId);
  const cachedRoute = stravaPickerRoutes.find((item) => String(item?.id) === targetId);
  if (cachedRoute) return cachedRoute;

  let nextPage = stravaPickerRoutesPage > 0 ? (stravaPickerRoutesPage + 1) : 1;
  let hasMore = stravaPickerRoutesPage > 0 ? stravaPickerRoutesHasMore : true;

  while (hasMore) {
    const routes = await fetchStravaRoutes(STRAVA_BACKEND_URL, nextPage);
    const nextRoutes = Array.isArray(routes) ? routes : [];
    stravaPickerRoutes = [...stravaPickerRoutes, ...nextRoutes];
    stravaPickerRoutesPage = nextPage;
    stravaPickerRoutesLoaded = true;
    stravaPickerRoutesHasMore = nextRoutes.length >= STRAVA_ROUTE_PAGE_SIZE;
    const matchedRoute = nextRoutes.find((item) => String(item?.id) === targetId);
    if (matchedRoute) return matchedRoute;
    hasMore = stravaPickerRoutesHasMore;
    nextPage += 1;
  }

  return null;
}

async function importStravaRouteById(routeId) {
  let route = stravaPickerRoutes.find((item) => String(item?.id) === String(routeId)) || null;
  if (!route) {
    try {
      route = await fetchStravaRoute(STRAVA_BACKEND_URL, routeId);
    } catch {
      route = await findStravaRouteById(routeId);
    }
  }
  const fallbackRoute = route || {
    id: String(routeId),
    name: 'Strava route',
    permalink_url: `https://www.strava.com/routes/${encodeURIComponent(String(routeId))}`,
  };
  if (route) stravaPickerRoutes = addUniqueStravaItem(stravaPickerRoutes, route);
  let importedRoute;
  let routeDocument = null;
  try {
    const gpxText = await fetchStravaRouteGpx(STRAVA_BACKEND_URL, fallbackRoute.id);
    importedRoute = stravaRouteGpxToImportedRoute(fallbackRoute, gpxText);
    routeDocument = buildPersistedRouteDocumentSnapshot(`${fallbackRoute?.name || 'strava-route'}.gpx`, gpxText, 'strava_gpx');
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const isMissingExport = /resource not found|strava request failed \(404\)/i.test(message);
    if (!isMissingExport) throw error;
    if (!route) throw new Error('Unable to import that Strava route from its URL. Try loading it from the Routes tab first.');
    importedRoute = stravaRouteSummaryToImportedRoute(route);
  }
  await applyImportedStravaRoute(importedRoute, 'Strava route', {
    activityKey: mapStravaRouteToPlannerActivity(fallbackRoute),
    averageKmh: Number(fallbackRoute?.distance) > 0 && Number(fallbackRoute?.estimated_moving_time) > 0
      ? (Number(fallbackRoute.distance) / 1000) / (Number(fallbackRoute.estimated_moving_time) / 3600)
      : null,
    durationMinutes: Number(fallbackRoute?.estimated_moving_time) > 0 ? Number(fallbackRoute.estimated_moving_time) / 60 : null,
    shouldSetDuration: !importedRoute?.hasRealTimestamps,
  }, routeDocument);
}

async function importStravaActivityById(activityId) {
  const activity = stravaPickerActivities.find((item) => String(item?.id) === String(activityId)) || await fetchStravaActivity(STRAVA_BACKEND_URL, activityId);
  if (!activity) throw new Error('Selected Strava activity was not found.');
  stravaPickerActivities = addUniqueStravaItem(stravaPickerActivities, activity);
  const streams = await fetchStravaActivityStreams(STRAVA_BACKEND_URL, activity.id);
  const importedRoute = stravaActivityStreamsToImportedRoute(activity, streams);
  await applyImportedStravaRoute(importedRoute, 'Strava activity', {
    activityKey: mapStravaActivityToPlannerActivity(activity),
    averageKmh: Number(activity?.average_speed) > 0 ? Number(activity.average_speed) * 3.6 : null,
    durationMinutes: Number(activity?.moving_time) > 0 ? Number(activity.moving_time) / 60 : null,
    shouldSetDuration: !importedRoute?.hasRealTimestamps,
  });
}

function handleOpenRouteSource() {
  const sourceUrl = routeState?.routeSource?.sourceUrl;
  if (!sourceUrl) return;
  window.open(sourceUrl, '_blank', 'noopener,noreferrer');
}

function sanitizeRouteDownloadFileName(name) {
  return String(name || 'strava-route')
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001F]+/g, '-')
    .replace(/\s+/g, ' ')
    .replace(/\.+$/g, '')
    || 'strava-route';
}

async function handleDownloadRouteGpx() {
  const source = routeState?.routeSource;
  if (!(routeDownloadGpxBtn instanceof HTMLButtonElement)) return;
  const cachedRouteDocument = normalizePersistedRouteDocument(routeState?.routeDocument);
  if (cachedRouteDocument?.format !== 'gpx' && (!source?.canDownloadGpx || !source.providerRouteId)) return;

  const originalLabel = routeDownloadGpxBtn.textContent || 'Download GPX';
  routeDownloadGpxBtn.disabled = true;
  routeDownloadGpxBtn.textContent = 'Preparing GPX...';

  try {
    const gpxText = cachedRouteDocument?.format === 'gpx'
      ? cachedRouteDocument.text
      : await fetchStravaRouteGpx(STRAVA_BACKEND_URL, source.providerRouteId);
    const blob = new Blob([gpxText], { type: 'application/gpx+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `${sanitizeRouteDownloadFileName(routeState?.fileName || 'strava-route')}.gpx`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    URL.revokeObjectURL(url);
  } catch (error) {
    routeStatus.textContent = error instanceof Error ? error.message : 'Unable to download GPX for this Strava route.';
  } finally {
    routeDownloadGpxBtn.disabled = !(cachedRouteDocument?.format === 'gpx' || source?.canDownloadGpx);
    routeDownloadGpxBtn.textContent = originalLabel;
  }
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
  stravaPickerRoutesPage = 0;
  stravaPickerActivitiesPage = 0;
  stravaPickerRoutesHasMore = true;
  stravaPickerActivitiesHasMore = true;
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

async function handleLoadMoreStravaItems() {
  await ensureStravaPickerTabLoaded(stravaPickerTab, true);
}

async function handleImportStravaUrl() {
  const parsed = parseStravaUrlInput(stravaPickerUrlInput?.value || '');
  stravaPickerTab = parsed.type;
  stravaPickerImporting = true;
  if (parsed.type === 'routes') stravaPickerRouteError = '';
  else stravaPickerActivityError = '';
  renderStravaPicker();
  try {
    if (parsed.type === 'routes') await importStravaRouteById(parsed.id);
    else await importStravaActivityById(parsed.id);
    closeStravaPicker();
    renderStravaConnectionStateEnhanced();
  } catch (error) {
    const message = error instanceof Error ? error.message : `Unable to import Strava ${parsed.type === 'routes' ? 'route' : 'activity'}`;
    if (parsed.type === 'routes') stravaPickerRouteError = message;
    else stravaPickerActivityError = message;
  } finally {
    stravaPickerImporting = false;
    renderStravaPicker();
  }
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
    switch (action) {
      case 'openChangelog':
        openChangelog();
        break;
      case 'closeChangelog':
        closeChangelog();
        break;
      case 'toggleChangelogToc':
        toggleChangelogToc();
        break;
      case 'expandAllChangelog':
        setAllChangelogSectionsExpanded(true);
        break;
      case 'collapseAllChangelog':
        setAllChangelogSectionsExpanded(false);
        break;
      case 'openQuickStartGuide':
        openQuickStartGuide();
        break;
      case 'activateForecastOnlyMode':
        activateForecastOnlyMode();
        break;
      case 'closeForecastOnlyConfirm':
        closeForecastOnlyConfirm();
        break;
      case 'confirmForecastOnlyMode':
        confirmForecastOnlyMode();
        break;
      case 'toggleLocationCardCollapse':
        toggleLocationCardCollapse();
        break;
      case 'togglePlannerCardCollapse':
        togglePlannerCardCollapse();
        break;
      case 'forceRefreshWeather':
        forceRefreshWeather();
        break;
      case 'backToRouteStart':
        backToRouteStart();
        break;
      case 'resetLocationSection':
        resetLocationSection();
        break;
      case 'clearAllTool':
        clearAllTool();
        break;
      case 'closeClearAllConfirm':
        closeClearAllConfirm();
        break;
      case 'confirmClearAll':
        confirmClearAll();
        break;
      case 'resumePreviousSession':
        resumePreviousSession();
        break;
      case 'startFreshSession':
        startFreshSession();
        break;
      case 'exportDiagnostics':
        triggerDiagnosticsExport();
        break;
      case 'openSharePanel':
        openSharePanel();
        break;
      case 'closeSharePanel':
        closeSharePanel();
        break;
      case 'sharePlan':
        void triggerSharePlan();
        break;
      case 'shareCopyLink':
        void triggerSharePlan();
        break;
      case 'exportSharePackage':
        triggerSharePackageExport();
        break;
      case 'importSharePackageFile':
        triggerSharePackageImportPicker();
        break;
      case 'applySharePackageJson':
        void triggerSharePackageJsonImport();
        break;
      case 'exportPlan':
        triggerPlanExport();
        break;
      case 'useCurrentLocation':
        useCurrentLocation();
        break;
      case 'clearRoute':
        clearRoute();
        break;
      case 'openRouteSource':
        handleOpenRouteSource();
        break;
      case 'downloadRouteGpx':
        void handleDownloadRouteGpx();
        break;
      case 'connectStrava':
        handleConnectStravaEnhanced();
        break;
      case 'disconnectStrava':
        handleDisconnectStravaEnhanced();
        break;
      case 'openStravaPicker':
        handleOpenStravaPickerEnhanced();
        break;
      case 'closeStravaPicker':
        closeStravaPicker();
        break;
      case 'selectStravaTab':
        handleSelectStravaTab(trigger.dataset.stravaTab);
        break;
      case 'loadMoreStravaItems':
        void handleLoadMoreStravaItems();
        break;
      case 'importStravaUrl':
        void handleImportStravaUrl();
        break;
      case 'importStravaRoute':
        handleImportStravaRoute(trigger.dataset.stravaRouteId);
        break;
      case 'importStravaActivity':
        handleImportStravaActivity(trigger.dataset.stravaActivityId);
        break;
      case 'resetActivitySection':
        resetActivitySection();
        break;
      case 'toggleRaceDayMode':
        toggleRaceDayMode();
        break;
      case 'selectActivity':
        selectActivity(trigger);
        break;
      case 'selectPlannedEffort':
        selectPlannedEffort(trigger.dataset.plannedEffort);
        break;
      case 'selectStartMode':
        selectStartMode(trigger);
        break;
      case 'toggleManualWeatherOverride':
        toggleManualWeatherOverride();
        break;
      case 'resetWaterModelInputs':
        resetWaterModelInputs();
        break;
      case 'selectCheckpointModel':
        selectCheckpointModel(trigger.dataset.checkpointModel);
        break;
      case 'toggleCustomMultisportLeg':
        toggleCustomMultisportLeg(trigger.dataset.legKey);
        break;
      case 'selectDurationKey':
        selectDurationKey(trigger.dataset.durationKey);
        break;
      case 'selectEventPreset':
        selectEventPreset(trigger.dataset.eventKey);
        break;
      case 'pickSuggestion':
        pickSuggestion(Number(trigger.dataset.index));
        break;
      case 'applyBestWindowResult':
        applyBestWindowResult(trigger.dataset.startTime);
        break;
      default:
        break;
    }
  });
}

stravaPickerUrlInput?.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') return;
  event.preventDefault();
  void handleImportStravaUrl();
});

window.addEventListener('online', updateConnectivityStatusUi);
window.addEventListener('offline', updateConnectivityStatusUi);

initializeStartupState();
renderStravaConnectionStateEnhanced();
updateRouteHeaderActions();
bindDomActions();
void applySharedPlanFromUrl();
updateConnectivityStatusUi();
void applyStartupEntryIntent();

