export interface UnitOption {
  value: string;
  label: string;
}

export const distanceUnitOptionsByActivity = {
  running: [{ value: 'km', label: 'km' }, { value: 'mi', label: 'mi' }, { value: 'm', label: 'm' }, { value: 'yd', label: 'yd' }],
  cycling: [{ value: 'km', label: 'km' }, { value: 'mi', label: 'mi' }, { value: 'm', label: 'm' }, { value: 'yd', label: 'yd' }],
  triathlon: [{ value: 'km', label: 'km total' }, { value: 'mi', label: 'mi total' }, { value: 'm', label: 'm total' }, { value: 'yd', label: 'yd total' }],
  swimming_open: [{ value: 'm', label: 'm' }, { value: 'km', label: 'km' }, { value: 'mi', label: 'mi' }, { value: 'yd', label: 'yd' }],
  swimming_pool: [{ value: 'm', label: 'm' }, { value: 'km', label: 'km' }, { value: 'mi', label: 'mi' }, { value: 'yd', label: 'yd' }],
  swimming_pool_indoor: [{ value: 'm', label: 'm' }, { value: 'km', label: 'km' }, { value: 'mi', label: 'mi' }, { value: 'yd', label: 'yd' }],
  swimming_pool_outdoor: [{ value: 'm', label: 'm' }, { value: 'km', label: 'km' }, { value: 'mi', label: 'mi' }, { value: 'yd', label: 'yd' }],
  gym: [{ value: 'km', label: 'km' }, { value: 'mi', label: 'mi' }],
  indoor_running: [{ value: 'km', label: 'km' }, { value: 'mi', label: 'mi' }, { value: 'm', label: 'm' }, { value: 'yd', label: 'yd' }],
  indoor_cycling: [{ value: 'km', label: 'km' }, { value: 'mi', label: 'mi' }, { value: 'm', label: 'm' }, { value: 'yd', label: 'yd' }],
  indoor_multisport: [{ value: 'km', label: 'km total' }, { value: 'mi', label: 'mi total' }, { value: 'm', label: 'm total' }, { value: 'yd', label: 'yd total' }],
  sup: [{ value: 'km', label: 'km' }, { value: 'mi', label: 'mi' }, { value: 'm', label: 'm' }, { value: 'yd', label: 'yd' }],
  surfing: [{ value: 'km', label: 'km' }, { value: 'mi', label: 'mi' }, { value: 'm', label: 'm' }, { value: 'yd', label: 'yd' }],
  kayaking: [{ value: 'km', label: 'km' }, { value: 'mi', label: 'mi' }, { value: 'm', label: 'm' }, { value: 'yd', label: 'yd' }],
  snorkeling: [{ value: 'm', label: 'm' }, { value: 'km', label: 'km' }, { value: 'mi', label: 'mi' }, { value: 'yd', label: 'yd' }],
  water_sports: [{ value: 'km', label: 'km' }, { value: 'mi', label: 'mi' }, { value: 'm', label: 'm' }, { value: 'yd', label: 'yd' }],
  hiking: [{ value: 'km', label: 'km' }, { value: 'mi', label: 'mi' }, { value: 'm', label: 'm' }, { value: 'yd', label: 'yd' }],
  trail_running: [{ value: 'km', label: 'km' }, { value: 'mi', label: 'mi' }, { value: 'm', label: 'm' }, { value: 'yd', label: 'yd' }],
  mtb_gravel: [{ value: 'km', label: 'km' }, { value: 'mi', label: 'mi' }, { value: 'm', label: 'm' }, { value: 'yd', label: 'yd' }],
  ski_snowboard: [{ value: 'km', label: 'km' }, { value: 'mi', label: 'mi' }],
  camping: [{ value: 'nights', label: 'nights' }, { value: 'days', label: 'days' }],
  road_trip: [{ value: 'km', label: 'km' }, { value: 'mi', label: 'mi' }, { value: 'm', label: 'm' }, { value: 'yd', label: 'yd' }],
  walk: [{ value: 'km', label: 'km' }, { value: 'mi', label: 'mi' }, { value: 'm', label: 'm' }, { value: 'yd', label: 'yd' }],
  fishing: [{ value: 'km', label: 'km' }, { value: 'mi', label: 'mi' }, { value: 'm', label: 'm' }, { value: 'yd', label: 'yd' }],
  hunting: [{ value: 'km', label: 'km' }, { value: 'mi', label: 'mi' }, { value: 'm', label: 'm' }, { value: 'yd', label: 'yd' }],
  casual: [{ value: 'km', label: 'km' }, { value: 'mi', label: 'mi' }, { value: 'm', label: 'm' }, { value: 'yd', label: 'yd' }]
};

export const averageUnitOptionsByActivity = {
  running: [{ value: 'min_per_km', label: 'min/km' }, { value: 'kmh', label: 'km/h' }],
  cycling: [{ value: 'kmh', label: 'km/h' }, { value: 'min_per_km', label: 'min/km' }],
  triathlon: [{ value: 'kmh', label: 'km/h' }],
  swimming_open: [{ value: 'min_per_100m', label: 'min/100m' }, { value: 'kmh', label: 'km/h' }],
  swimming_pool: [{ value: 'min_per_100m', label: 'min/100m' }, { value: 'kmh', label: 'km/h' }],
  swimming_pool_indoor: [{ value: 'min_per_100m', label: 'min/100m' }, { value: 'kmh', label: 'km/h' }],
  swimming_pool_outdoor: [{ value: 'min_per_100m', label: 'min/100m' }, { value: 'kmh', label: 'km/h' }],
  gym: [{ value: 'kmh', label: 'km/h' }],
  indoor_running: [{ value: 'min_per_km', label: 'min/km' }, { value: 'kmh', label: 'km/h' }],
  indoor_cycling: [{ value: 'kmh', label: 'km/h' }, { value: 'min_per_km', label: 'min/km' }],
  indoor_multisport: [{ value: 'kmh', label: 'km/h' }],
  sup: [{ value: 'kmh', label: 'km/h' }, { value: 'min_per_km', label: 'min/km' }],
  surfing: [{ value: 'kmh', label: 'km/h' }],
  kayaking: [{ value: 'kmh', label: 'km/h' }, { value: 'min_per_km', label: 'min/km' }],
  snorkeling: [{ value: 'min_per_100m', label: 'min/100m' }, { value: 'kmh', label: 'km/h' }],
  water_sports: [{ value: 'kmh', label: 'km/h' }, { value: 'min_per_km', label: 'min/km' }],
  hiking: [{ value: 'kmh', label: 'km/h' }, { value: 'min_per_km', label: 'min/km' }],
  trail_running: [{ value: 'min_per_km', label: 'min/km' }, { value: 'kmh', label: 'km/h' }],
  mtb_gravel: [{ value: 'kmh', label: 'km/h' }, { value: 'min_per_km', label: 'min/km' }],
  ski_snowboard: [{ value: 'kmh', label: 'km/h' }],
  camping: [{ value: 'kmh', label: 'km/h' }],
  road_trip: [{ value: 'kmh', label: 'km/h' }],
  walk: [{ value: 'kmh', label: 'km/h' }, { value: 'min_per_km', label: 'min/km' }],
  fishing: [{ value: 'kmh', label: 'km/h' }],
  hunting: [{ value: 'kmh', label: 'km/h' }],
  casual: [{ value: 'kmh', label: 'km/h' }, { value: 'min_per_km', label: 'min/km' }]
};

export const avgDeriveActivities = new Set(['running', 'cycling', 'swimming_open', 'swimming_pool', 'swimming_pool_indoor', 'swimming_pool_outdoor', 'gym', 'indoor_running', 'indoor_cycling', 'indoor_multisport', 'sup', 'kayaking', 'snorkeling', 'water_sports', 'hiking', 'trail_running', 'mtb_gravel', 'ski_snowboard', 'road_trip', 'walk', 'fishing', 'hunting', 'casual']);
