export interface BestWindowAnalysis {
  range: { start: unknown; end: unknown };
  options: { durationMinutes: number; priority: string; activity?: string | null };
  topWindows: unknown[];
  candidates?: unknown[];
}

export interface RouteState {
  points?: unknown[];
  samples?: unknown[];
  elapsedMinutes?: number;
  [key: string]: unknown;
}

export interface WeatherData {
  locationName: string;
  current: Record<string, unknown>;
  hourly?: unknown[];
  daily?: unknown[];
  currentTime?: unknown;
  [key: string]: unknown;
}

export interface AppState {
  selectedActivity: string | null;
  selectedDuration: string;
  startMode: 'now' | 'later' | 'best';
  selectedEventKey: string | null;
  checkpointModel: string;
  raceDayMode: boolean;
  temperaturePreference: number;
  plannedEffort: string;
  weatherData: WeatherData | null;
  routeState: RouteState | null;
  bestWindowAnalysis: BestWindowAnalysis | null;
  bestWindowAnalysisKey: string;
  bestWindowSelectedStart: string | null;
}

export const initialState: AppState = {
  selectedActivity: null,
  selectedDuration: 'h1',
  startMode: 'now',
  selectedEventKey: null,
  checkpointModel: 'smart',
  raceDayMode: false,
  temperaturePreference: 0,
  plannedEffort: 'steady',
  weatherData: null,
  routeState: null,
  bestWindowAnalysis: null,
  bestWindowAnalysisKey: '',
  bestWindowSelectedStart: null,
};
