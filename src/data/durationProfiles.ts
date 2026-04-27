export interface DurationProfile {
  key: string;
  label: string;
  minutes: number;
}

export const durationProfiles: DurationProfile[] = [
  { key: 'd30', label: '30 min', minutes: 30 },
  { key: 'h1', label: '1 hr', minutes: 60 },
  { key: 'd90', label: '90 min', minutes: 90 },
  { key: 'h2', label: '2 hr', minutes: 120 },
  { key: 'h3', label: '3 hr', minutes: 180 },
  { key: 'h4', label: '4 hr', minutes: 240 },
  { key: 'h6', label: '6 hr', minutes: 360 },
  { key: 'h8', label: '8 hr', minutes: 480 },
  { key: 'h10', label: '10 hr', minutes: 600 },
  { key: 'h12', label: '12 hr', minutes: 720 },
  { key: 'h18', label: '18 hr', minutes: 1080 },
  { key: 'd1', label: '1 day', minutes: 1440 },
  { key: 'd2', label: '2 days', minutes: 2880 },
  { key: 'd3', label: '3 days', minutes: 4320 },
  { key: 'd5', label: '5 days', minutes: 7200 },
];
