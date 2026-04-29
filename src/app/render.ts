import { renderForecastBlock } from '../components/ForecastCells';
import { bindForecastChartTooltips } from '../components/ForecastChart';
import { renderBestWindowResults } from '../components/BestWindowPanel';
import type { AppState, WeatherData } from './state';

export function mountStaticPrototype(): void {
  // The v9.8.14 DOM is preserved in index.html during this migration pass.
}

export function renderForecastSection(
  container: HTMLElement,
  data: WeatherData,
  state: Pick<AppState, 'selectedActivity' | 'routeState'>,
  selection: unknown,
  profile: { label: string; minutes: number },
): void {
  const routeSamples = (state.routeState as any)?.samples || [];
  container.innerHTML = renderForecastBlock(data, selection as any, profile, state.selectedActivity, routeSamples);
  bindForecastChartTooltips(container);
}

export function renderBestWindowSection(
  container: HTMLElement,
  state: Pick<AppState, 'bestWindowAnalysis' | 'bestWindowSelectedStart'>,
): void {
  renderBestWindowResults(state.bestWindowAnalysis, container, state.bestWindowSelectedStart);
}
