export function getCheckpointFractions(count: number): number[] {
  if (count <= 1) return [0];
  return Array.from({ length: count }, (_, index) => index / (count - 1));
}
