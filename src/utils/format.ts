export function formatNumber(value: number, digits = 0): string {
  return Number.isFinite(value) ? value.toFixed(digits) : '-';
}

export function formatTemperature(value: number | null | undefined): string {
  return value === null || value === undefined || Number.isNaN(Number(value))
    ? '--'
    : `${Math.round(Number(value))}°`;
}
