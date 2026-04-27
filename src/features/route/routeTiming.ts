export function estimateRouteDurationMinutes(distanceKm: number, speedKmh: number): number | null {
  if (!Number.isFinite(distanceKm) || !Number.isFinite(speedKmh) || speedKmh <= 0) return null;
  return (distanceKm / speedKmh) * 60;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function getSegmentTimeFactor(activity: string | null | undefined, gradePct: number | null | undefined): number {
  const grade = clamp(Number.isFinite(Number(gradePct)) ? Number(gradePct) : 0, -18, 18);
  let factor = 1;
  if (activity === 'cycling' || activity === 'triathlon') {
    factor += grade > 0 ? grade * 0.07 : grade * 0.025;
  } else if (activity === 'running') {
    factor += grade > 0 ? grade * 0.085 : grade * 0.03;
  } else if (activity === 'road_trip') {
    factor += grade > 0 ? grade * 0.018 : grade * 0.01;
  } else if (activity === 'camping' || activity === 'walk' || activity === 'casual') {
    factor += grade > 0 ? grade * 0.07 : grade * 0.015;
  } else {
    factor += grade > 0 ? grade * 0.045 : grade * 0.02;
  }
  return clamp(factor, 0.58, 3.2);
}
