export interface EventPreset {
  key: string;
  label: string;
  distanceKm?: number;
  durationMinutes?: number;
}

export const eventPresets: EventPreset[] = [];
