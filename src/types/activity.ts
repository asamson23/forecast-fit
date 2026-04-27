export type ActivityKey =
  | 'running'
  | 'cycling'
  | 'triathlon'
  | 'gym'
  | 'indoor_running'
  | 'indoor_cycling'
  | 'indoor_multisport'
  | 'swimming_pool_indoor'
  | 'swimming_open'
  | 'swimming_pool_outdoor'
  | 'snorkeling'
  | 'sup'
  | 'kayaking'
  | 'surfing'
  | 'water_sports'
  | 'hiking'
  | 'trail_running'
  | 'mtb_gravel'
  | 'ski_snowboard'
  | 'fishing'
  | 'hunting'
  | 'walk'
  | 'casual'
  | 'road_trip'
  | 'camping';

export interface Activity {
  key: ActivityKey;
  label: string;
  isIndoor?: boolean;
  isWaterRelevant?: boolean;
  isMultisport?: boolean;
}
