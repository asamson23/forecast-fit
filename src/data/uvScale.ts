export type UvCategory = 'Low' | 'Moderate' | 'High' | 'Very high' | 'Extreme';

export function getUvCategory(value: number | null | undefined): UvCategory {
  const uv = Number(value) || 0;
  if (uv <= 2) return 'Low';
  if (uv <= 5) return 'Moderate';
  if (uv <= 7) return 'High';
  if (uv <= 10) return 'Very high';
  return 'Extreme';
}
