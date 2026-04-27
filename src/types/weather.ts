export interface WeatherPoint {
  time: string;
  temp: number;
  feelsLike?: number;
  wind?: number;
  windGust?: number;
  windDirection?: number;
  precipitation?: number;
  precipitationChance?: number;
  uv?: number;
  aqi?: number;
  weatherCode?: number;
  waterTemp?: number | null;
}

export interface WeatherAlert {
  id?: string;
  title: string;
  description?: string;
  severity?: string;
  urgency?: string;
  source?: 'eccc' | 'forecast';
}
