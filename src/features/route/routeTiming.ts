export function estimateRouteDurationMinutes(distanceKm: number, speedKmh: number): number | null {
  if (!Number.isFinite(distanceKm) || !Number.isFinite(speedKmh) || speedKmh <= 0) return null;
  return (distanceKm / speedKmh) * 60;
}
