import type { ActivityKey } from '../../types/activity';

export const noLocationIndoorActivities = new Set<ActivityKey>([
  'gym',
  'indoor_running',
  'indoor_cycling',
  'indoor_multisport',
  'swimming_pool_indoor',
]);

export function isIndoorActivity(activity: ActivityKey): boolean {
  return noLocationIndoorActivities.has(activity);
}
