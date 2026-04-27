export interface ProviderLocation {
  name: string;
  latitude: number;
  longitude: number;
  countryCode?: string;
  timezone?: string;
}

export interface ForecastProvider {
  name: string;
  fetchForecast(location: ProviderLocation): Promise<unknown>;
}
