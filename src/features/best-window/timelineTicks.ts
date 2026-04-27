export interface TimelineTickConfig {
  major: number;
  minor: number;
}

export function getTimelineTickConfig(totalMinutes: number): TimelineTickConfig {
  const minutes = Math.max(1, Number(totalMinutes) || 1);
  if (minutes <= 360) return { major: 30, minor: 15 };
  if (minutes <= 720) return { major: 60, minor: 30 };
  if (minutes <= 1440) return { major: 120, minor: 60 };
  if (minutes <= 2880) return { major: 240, minor: 120 };
  if (minutes <= 4320) return { major: 360, minor: 180 };
  if (minutes <= 10080) return { major: 720, minor: 360 };
  return { major: 1440, minor: 720 };
}
