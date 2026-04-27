export function getLayerHint(feelsLikeC: number): string {
  if (feelsLikeC <= 0) return 'insulated layers';
  if (feelsLikeC <= 10) return 'warm layers';
  if (feelsLikeC <= 18) return 'light layers';
  return 'light kit';
}
