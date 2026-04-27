export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function average(values: number[]): number | null {
  const clean = values.filter((value) => Number.isFinite(value));
  if (!clean.length) return null;
  return clean.reduce((sum, value) => sum + value, 0) / clean.length;
}

export function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function firstFinite(...values: unknown[]): number | null {
  for (const value of values) {
    if (isFiniteNumber(value)) return value;
  }
  return null;
}

export function round1(value: number): number {
  return Math.round(value * 10) / 10;
}
