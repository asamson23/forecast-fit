export interface DurationProfile {
  label: string;
  sublabel: string;
  minutes: number;
  hoursWindow?: number;
  daysWindow?: number;
  exposureBias: number;
  mode: 'hourly' | 'daily';
}

export const durationProfiles: Record<string, DurationProfile> = {
  d30: { label: '30 min', sublabel: 'Quick hit', minutes: 30, hoursWindow: 3, exposureBias: 0, mode: 'hourly' },
  d90: { label: '90 min\n(1.5 h)', sublabel: 'In between', minutes: 90, hoursWindow: 4, exposureBias: 0, mode: 'hourly' },
  h1: { label: '60 min\n(1 h)', sublabel: 'Short session', minutes: 60, hoursWindow: 4, exposureBias: 0, mode: 'hourly' },
  h2: { label: '120 min\n(2 h)', sublabel: 'Standard outing', minutes: 120, hoursWindow: 5, exposureBias: 1, mode: 'hourly' },
  h3: { label: '180 min\n(3 h)', sublabel: 'Extended outing', minutes: 180, hoursWindow: 6, exposureBias: 1, mode: 'hourly' },
  h4: { label: '4 h', sublabel: 'Long session', minutes: 240, hoursWindow: 8, exposureBias: 2, mode: 'hourly' },
  h6: { label: '6 h', sublabel: 'Big outing', minutes: 360, hoursWindow: 10, exposureBias: 2, mode: 'hourly' },
  h8: { label: '8 h', sublabel: 'All-day effort', minutes: 480, hoursWindow: 12, exposureBias: 3, mode: 'hourly' },
  h10: { label: '10 h', sublabel: 'Long day', minutes: 600, hoursWindow: 13, exposureBias: 4, mode: 'hourly' },
  h12: { label: '12 h', sublabel: 'Very long day', minutes: 720, hoursWindow: 14, exposureBias: 4, mode: 'hourly' },
  h18: { label: '18 h', sublabel: 'Ultra-long day', minutes: 1080, daysWindow: 2, exposureBias: 5, mode: 'daily' },
  d1: { label: '24 h', sublabel: 'Full day', minutes: 1440, hoursWindow: 24, exposureBias: 5, mode: 'hourly' },
  d2: { label: '2 days', sublabel: 'Weekend-ish', minutes: 2880, daysWindow: 2, exposureBias: 5, mode: 'daily' },
  d3: { label: '3 days', sublabel: 'Short expedition', minutes: 4320, daysWindow: 3, exposureBias: 6, mode: 'daily' },
  d5: { label: '4–7 days', sublabel: 'Multi-day', minutes: 7200, daysWindow: 5, exposureBias: 7, mode: 'daily' },
};

export const durationOrder = ['d30', 'h1', 'd90', 'h2', 'h3', 'h4', 'h6', 'h8', 'h10', 'h12', 'h18', 'd1', 'd2', 'd3', 'd5'];
