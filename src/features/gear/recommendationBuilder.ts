import type { GearRecommendation } from '../../types/gear';

export function buildRecommendation(label: string, items: string[]): GearRecommendation {
  return { label, items };
}
