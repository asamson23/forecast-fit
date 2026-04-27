export interface TimelineTickConfig {
  minutes: number;
  showDateTicks: boolean;
}

export function getTimelineTickConfig(totalMinutes: number): TimelineTickConfig {
  if (totalMinutes <= 6 * 60) return { minutes: 60, showDateTicks: false };
  if (totalMinutes <= 24 * 60) return { minutes: 3 * 60, showDateTicks: false };
  return { minutes: 6 * 60, showDateTicks: true };
}
