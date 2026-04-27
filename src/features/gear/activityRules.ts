import type { ActivityKey } from '../../types/activity';

export const noLocationIndoorActivities = new Set<ActivityKey>([
  'gym',
  'indoor_running',
  'indoor_cycling',
  'indoor_multisport',
  'swimming_pool_indoor',
]);

export const effortRelevantActivities = new Set<ActivityKey>([
  'running',
  'cycling',
  'triathlon',
  'swimming_open',
  'swimming_pool',
  'swimming_pool_indoor',
  'swimming_pool_outdoor',
  'gym',
  'indoor_running',
  'indoor_cycling',
  'indoor_multisport',
  'sup',
  'surfing',
  'kayaking',
  'snorkeling',
  'water_sports',
  'hiking',
  'trail_running',
  'mtb_gravel',
  'ski_snowboard',
  'walk',
  'fishing',
  'hunting',
  'camping',
]);

export function isIndoorActivity(activity: ActivityKey): boolean {
  return noLocationIndoorActivities.has(activity);
}
