export function describeWeatherCode(code: number | null | undefined): string {
  const value = Number(code);
  if (value === 0) return 'Clear';
  if ([1, 2, 3].includes(value)) return 'Clouds';
  if ([45, 48].includes(value)) return 'Fog';
  if ((value >= 51 && value <= 67) || (value >= 80 && value <= 82)) return 'Rain';
  if ((value >= 71 && value <= 77) || (value >= 85 && value <= 86)) return 'Snow';
  if (value >= 95) return 'Thunderstorm';
  return 'Weather';
}
