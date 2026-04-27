import type { ActivityKey } from '../../types/activity';

export const waterRelevantActivities = new Set<ActivityKey>([
  'swimming_open',
  'swimming_pool',
  'swimming_pool_indoor',
  'swimming_pool_outdoor',
  'snorkeling',
  'sup',
  'kayaking',
  'surfing',
  'water_sports',
  'triathlon',
]);

export const waterExposureActivities = new Set<ActivityKey>([
  'swimming_open',
  'sup',
  'surfing',
  'kayaking',
  'snorkeling',
  'water_sports',
]);

export const waterDistanceActivities = new Set<ActivityKey>([
  'swimming_open',
  'swimming_pool',
  'swimming_pool_indoor',
  'swimming_pool_outdoor',
  'snorkeling',
]);

export const paddleDistanceActivities = new Set<ActivityKey>(['sup', 'kayaking']);

export function isWaterRelevantActivity(activity: ActivityKey): boolean {
  return waterRelevantActivities.has(activity);
}
