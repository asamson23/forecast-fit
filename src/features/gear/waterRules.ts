import type { ActivityKey } from '../../types/activity';

export const waterRelevantActivities = new Set<ActivityKey>([
  'swimming_open',
  'swimming_pool_indoor',
  'swimming_pool_outdoor',
  'snorkeling',
  'sup',
  'kayaking',
  'surfing',
  'water_sports',
  'triathlon',
]);

export function isWaterRelevantActivity(activity: ActivityKey): boolean {
  return waterRelevantActivities.has(activity);
}
