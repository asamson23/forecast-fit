export interface EventPreset {
  key: string;
  label: string;
  sublabel: string;
  distanceLabel?: string;
  detail?: string;
  defaultDuration?: string;
}

export const eventPresetsByActivity = {
  running: [
    { key: 'run_race_day', label: 'Race day', sublabel: 'Road race / event', distanceLabel: 'Race effort', detail: 'Race-day bias for lighter kit plus pre- and post-race items.', defaultDuration: 'h1' },
    { key: 'run5k', label: '5K', sublabel: '5 km', distanceLabel: '5 km', detail: 'Short race / sharper run.', defaultDuration: 'h1' },
    { key: 'run10k', label: '10K', sublabel: '10 km', distanceLabel: '10 km', detail: 'Classic road-race distance.', defaultDuration: 'h1' },
    { key: 'run21k', label: 'Half marathon', sublabel: '21.1 km', distanceLabel: '21.1 km', detail: 'Longer steady race / training.', defaultDuration: 'h2' },
    { key: 'run42k', label: 'Marathon', sublabel: '42.2 km', distanceLabel: '42.2 km', detail: 'Big-day road setup.', defaultDuration: 'h4' },
    { key: 'run50k', label: 'Ultra', sublabel: '50 km+', distanceLabel: '50 km+', detail: 'Long exposure and carry needs.', defaultDuration: 'h8' }
  ],
  cycling: [
    { key: 'ride_race_day', label: 'Race day', sublabel: 'Road event', distanceLabel: 'Race / fast event', detail: 'Race-day bias for lighter on-bike kit plus pre- and post-event items.', defaultDuration: 'h2' },
    { key: 'ride15', label: 'Commute', sublabel: '10–20 km', distanceLabel: '10–20 km', detail: 'Short functional ride.', defaultDuration: 'h1' },
    { key: 'ride50', label: 'Club ride', sublabel: '40–80 km', distanceLabel: '40–80 km', detail: 'Typical training / bunch ride.', defaultDuration: 'h2' },
    { key: 'ride100', label: 'Metric century', sublabel: '100 km', distanceLabel: '100 km', detail: 'Endurance ride / fondo-ish.', defaultDuration: 'h4' },
    { key: 'ride160', label: 'Century', sublabel: '160 km', distanceLabel: '160 km', detail: 'All-day road ride.', defaultDuration: 'h8' },
    { key: 'ride200', label: 'Brevet', sublabel: '200 km+', distanceLabel: '200 km+', detail: 'Big exposure, lights, and layers.', defaultDuration: 'h12' }
  ],
  triathlon: [
    { key: 'tri_race_day', label: 'Race day', sublabel: 'Multisport event', distanceLabel: 'Race / event', detail: 'Race-day bias with transition, pre-race, and post-race items.', defaultDuration: 'h2' },
    { key: 'tri_ss', label: 'Super sprint', sublabel: '250 / 10 / 2.5', distanceLabel: '250 m swim · 10 km bike · 2.5 km run', detail: 'Short fast multisport setup.', defaultDuration: 'h1' },
    { key: 'tri_s', label: 'Sprint', sublabel: '750 / 20 / 5', distanceLabel: '750 m swim · 20 km bike · 5 km run', detail: 'Typical sprint triathlon.', defaultDuration: 'h2' },
    { key: 'tri_o', label: 'Olympic', sublabel: '1.5 / 40 / 10', distanceLabel: '1.5 km swim · 40 km bike · 10 km run', detail: 'Standard Olympic-distance triathlon.', defaultDuration: 'h4' },
    { key: 'tri_t100', label: 'T100', sublabel: '2 / 80 / 18', distanceLabel: '2 km swim · 80 km bike · 18 km run', detail: 'T100 distance triathlon.', defaultDuration: 'h6' },
    { key: 'tri_70', label: '70.3', sublabel: '1.9 / 90 / 21.1', distanceLabel: '1.9 km swim · 90 km bike · 21.1 km run', detail: 'Half-distance endurance setup.', defaultDuration: 'h8' },
    { key: 'tri_full', label: 'Ironman', sublabel: '3.8 / 180 / 42.2', distanceLabel: '3.8 km swim · 180 km bike · 42.2 km run', detail: 'Massive exposure and all-day kit.', defaultDuration: 'h12' }
  ],
  swimming_open: [
    { key: 'ows750', label: 'Sprint swim', sublabel: '750 m', distanceLabel: '750 m', detail: 'Short open-water effort.', defaultDuration: 'h1' },
    { key: 'ows1500', label: 'Olympic swim', sublabel: '1.5 km', distanceLabel: '1.5 km', detail: 'Classic open-water session.', defaultDuration: 'h1' },
    { key: 'ows1900', label: '70.3 swim', sublabel: '1.9 km', distanceLabel: '1.9 km', detail: 'Half-distance race swim.', defaultDuration: 'h2' },
    { key: 'ows3800', label: 'Iron swim', sublabel: '3.8 km', distanceLabel: '3.8 km', detail: 'Longer exposure in the water.', defaultDuration: 'h2' },
    { key: 'ows5000', label: '5 km swim', sublabel: '5 km', distanceLabel: '5 km', detail: 'Long open-water day.', defaultDuration: 'h4' },
    { key: 'ows10000', label: '10 km swim', sublabel: '10 km', distanceLabel: '10 km', detail: 'Marathon swim distance.', defaultDuration: 'h8' }
  ],
  swimming_pool: [
    { key: 'pool1k', label: 'Short set', sublabel: '1 km', distanceLabel: '1 km', detail: 'Quick pool workout.', defaultDuration: 'h1' },
    { key: 'pool2k', label: 'Standard set', sublabel: '2 km', distanceLabel: '2 km', detail: 'Typical training swim.', defaultDuration: 'h1' },
    { key: 'pool3k', label: 'Long set', sublabel: '3 km', distanceLabel: '3 km', detail: 'Longer session / masters-ish.', defaultDuration: 'h2' },
    { key: 'pool4k', label: 'Masters', sublabel: '4 km', distanceLabel: '4 km', detail: 'Solid structured session.', defaultDuration: 'h2' },
    { key: 'pool5k', label: 'Endurance', sublabel: '5 km+', distanceLabel: '5 km+', detail: 'Big pool day.', defaultDuration: 'h4' }
  ],
  gym: [
    { key: 'gym_short', label: 'Short workout', sublabel: '30–60 min', distanceLabel: 'Indoor workout', detail: 'Strength, mobility, or quick fitness session.', defaultDuration: 'h1' },
    { key: 'gym_standard', label: 'Standard workout', sublabel: '60–90 min', distanceLabel: 'Indoor workout', detail: 'Typical gym session with warm-up and accessories.', defaultDuration: 'd90' },
    { key: 'gym_long', label: 'Long workout', sublabel: '2 h+', distanceLabel: 'Indoor workout', detail: 'Longer lift, class, or mixed training block.', defaultDuration: 'h2' }
  ],
  indoor_running: [
    { key: 'irun_short', label: 'Short run', sublabel: '30–45 min', distanceLabel: 'Indoor run', detail: 'Treadmill or indoor track session.', defaultDuration: 'h1' },
    { key: 'irun_workout', label: 'Workout', sublabel: 'intervals / tempo', distanceLabel: 'Indoor run workout', detail: 'Harder treadmill or track session.', defaultDuration: 'd90' },
    { key: 'irun_long', label: 'Long indoor run', sublabel: '90 min+', distanceLabel: 'Long indoor run', detail: 'Longer session where dry clothes matter after.', defaultDuration: 'h2' }
  ],
  indoor_cycling: [
    { key: 'icx_short', label: 'Short indoor ride', sublabel: '30–60 min', distanceLabel: 'Indoor ride', detail: 'Quick trainer, spin, or velodrome session.', defaultDuration: 'h1' },
    { key: 'icx_workout', label: 'Structured workout', sublabel: '60–90 min', distanceLabel: 'Indoor ride workout', detail: 'Intervals, tempo, Zwift-style workout, or track session.', defaultDuration: 'd90' },
    { key: 'icx_long', label: 'Long indoor ride', sublabel: '2 h+', distanceLabel: 'Long indoor ride', detail: 'Longer sweat-heavy trainer/spin session or extended track time.', defaultDuration: 'h2' }
  ],
  // Indoor multisport is intentionally a preset activity for now. The next
  // logical upgrade would be a true multisport builder where users select the
  // exact legs (for example swim + bike, bike + run, gym + treadmill, or track
  // + pool) and the app combines the relevant kit lists.
  indoor_multisport: [
    { key: 'ims_brick', label: 'Indoor brick', sublabel: 'bike + run', distanceLabel: 'Indoor bike + run', detail: 'Trainer/spin/velodrome plus treadmill or indoor track.', defaultDuration: 'h2' },
    { key: 'ims_tri', label: 'Indoor tri-style', sublabel: 'swim + bike + run', distanceLabel: 'Indoor swim · bike · run', detail: 'Pool, indoor bike, and indoor run in one session.', defaultDuration: 'h3' },
    { key: 'ims_gym_cardio', label: 'Gym + cardio', sublabel: 'strength + endurance', distanceLabel: 'Gym + cardio', detail: 'Strength work plus treadmill, spin, rowing, or similar cardio.', defaultDuration: 'd90' },
    { key: 'ims_event', label: 'Indoor event', sublabel: 'track / pool / bike', distanceLabel: 'Indoor multisport event', detail: 'Indoor race simulation, aquathlon-style day, or mixed facility event.', defaultDuration: 'h2' }
  ],
  sup: [
    { key: 'sup_short', label: 'Short paddle', sublabel: '2–5 km', distanceLabel: '3 km', detail: 'Quick flatwater or easy shoreline paddle.', defaultDuration: 'h1' },
    { key: 'sup_session', label: 'Paddle session', sublabel: '5–10 km', distanceLabel: '8 km', detail: 'Typical SUP outing where wind starts to matter.', defaultDuration: 'h2' },
    { key: 'sup_long', label: 'Long paddle', sublabel: '10 km+', distanceLabel: '12 km', detail: 'Longer exposure with more need for layers and safety kit.', defaultDuration: 'h3' }
  ],
  surfing: [
    { key: 'surf_quick', label: 'Quick surf', sublabel: 'short session', distanceLabel: 'Session', detail: 'Shorter water exposure near shore.', defaultDuration: 'h1' },
    { key: 'surf_standard', label: 'Surf session', sublabel: 'standard session', distanceLabel: 'Session', detail: 'Normal board session with temperature and wind exposure.', defaultDuration: 'h2' },
    { key: 'surf_long', label: 'Long surf', sublabel: 'extended session', distanceLabel: 'Long session', detail: 'Longer water time where warmth and post-session clothes matter more.', defaultDuration: 'h3' }
  ],
  kayaking: [
    { key: 'kayak_short', label: 'Short paddle', sublabel: '3–8 km', distanceLabel: '5 km', detail: 'Quick kayak outing.', defaultDuration: 'h1' },
    { key: 'kayak_tour', label: 'Touring paddle', sublabel: '10–20 km', distanceLabel: '15 km', detail: 'Longer paddle where wind and spray protection matter.', defaultDuration: 'h3' },
    { key: 'kayak_long', label: 'Long paddle', sublabel: '20 km+', distanceLabel: '25 km', detail: 'Bigger exposure and more safety / spare layer planning.', defaultDuration: 'h6' }
  ],
  snorkeling: [
    { key: 'snorkel_short', label: 'Short snorkel', sublabel: '250–500 m', distanceLabel: '400 m', detail: 'Short shore snorkel.', defaultDuration: 'h1' },
    { key: 'snorkel_session', label: 'Snorkel session', sublabel: '500 m–1 km', distanceLabel: '800 m', detail: 'Typical recreational snorkel.', defaultDuration: 'h2' },
    { key: 'snorkel_long', label: 'Long snorkel', sublabel: '1 km+', distanceLabel: '1.5 km', detail: 'Longer exposure in the water.', defaultDuration: 'h3' }
  ],
  water_sports: [
    { key: 'water_short', label: 'Short session', sublabel: 'quick exposure', distanceLabel: 'Session', detail: 'Generic short water activity.', defaultDuration: 'h1' },
    { key: 'water_standard', label: 'Standard session', sublabel: 'normal exposure', distanceLabel: 'Session', detail: 'Generic water setup when the exact sport is not listed.', defaultDuration: 'h2' },
    { key: 'water_long', label: 'Long exposure', sublabel: 'extended exposure', distanceLabel: 'Long session', detail: 'Longer water time where warmth, wind, and dry exit layers matter more.', defaultDuration: 'h4' }
  ],
  hiking: [
    { key: 'hike_short', label: 'Short hike', sublabel: '3–8 km', distanceLabel: '5 km', detail: 'Short day hike or local trail.', defaultDuration: 'h2' },
    { key: 'hike_day', label: 'Day hike', sublabel: '8–20 km', distanceLabel: '12 km', detail: 'Normal day hike with variable exposure.', defaultDuration: 'h4' },
    { key: 'hike_big', label: 'Big hike', sublabel: '20 km+', distanceLabel: '22 km', detail: 'Longer mountain or full-day hike.', defaultDuration: 'h8' }
  ],
  trail_running: [
    { key: 'trail_short', label: 'Short trail run', sublabel: '5–10 km', distanceLabel: '8 km', detail: 'Shorter trail loop.', defaultDuration: 'h1' },
    { key: 'trail_long', label: 'Long trail run', sublabel: '15–30 km', distanceLabel: '20 km', detail: 'Longer trail run where pack/layers matter.', defaultDuration: 'h3' },
    { key: 'trail_ultra', label: 'Ultra / mountain', sublabel: '30 km+', distanceLabel: '35 km+', detail: 'Big trail day with exposure and fuel needs.', defaultDuration: 'h6' }
  ],
  mtb_gravel: [
    { key: 'dirt_short', label: 'Short dirt ride', sublabel: '15–30 km', distanceLabel: '25 km', detail: 'Short MTB or gravel outing.', defaultDuration: 'h2' },
    { key: 'dirt_long', label: 'Long dirt ride', sublabel: '40–80 km', distanceLabel: '60 km', detail: 'Longer mixed-surface ride.', defaultDuration: 'h4' },
    { key: 'dirt_epic', label: 'Epic / adventure', sublabel: '80 km+', distanceLabel: '90 km+', detail: 'Big exposure, spares, and layer planning.', defaultDuration: 'h8' }
  ],
  ski_snowboard: [
    { key: 'ski_half', label: 'Half day', sublabel: '2–4 h', distanceLabel: 'Half day', detail: 'Shorter resort or hill session.', defaultDuration: 'h4' },
    { key: 'ski_day', label: 'Full day', sublabel: '5–8 h', distanceLabel: 'Full day', detail: 'Standard ski/snowboard day.', defaultDuration: 'h8' },
    { key: 'ski_cold', label: 'Cold / storm day', sublabel: 'exposed', distanceLabel: 'Cold ski day', detail: 'More conservative winter setup.', defaultDuration: 'h6' }
  ],
  camping: [
    { key: 'camp_over', label: 'Overnight', sublabel: '1 night', distanceLabel: '1 night', detail: 'Simple overnight camp.', defaultDuration: 'd1' },
    { key: 'camp_weekend', label: 'Weekend', sublabel: '2 nights', distanceLabel: '2 nights', detail: 'Classic weekend camping.', defaultDuration: 'd2' },
    { key: 'camp_3d', label: '3-day', sublabel: '3 nights', distanceLabel: '3 nights', detail: 'Short multi-day camp.', defaultDuration: 'd3' },
    { key: 'camp_long', label: 'Multi-day', sublabel: '4–7 nights', distanceLabel: '4–7 nights', detail: 'Extended camping / trek.', defaultDuration: 'd5' }
  ],
  road_trip: [
    { key: 'drive_short', label: 'Short drive', sublabel: '50–150 km', distanceLabel: '50–150 km', detail: 'Local or regional drive with a few stops.', defaultDuration: 'h2' },
    { key: 'drive_day', label: 'Day trip', sublabel: '200–500 km', distanceLabel: '200–500 km', detail: 'Longer drive where stops start to matter.', defaultDuration: 'h6' },
    { key: 'drive_long', label: 'Long haul', sublabel: '600–900 km', distanceLabel: '600–900 km', detail: 'Full travel day with lots of sitting and fuel stops.', defaultDuration: 'h10' },
    { key: 'drive_over', label: 'Overnight travel', sublabel: '1000 km+', distanceLabel: '1000 km+', detail: 'Very long trip or split over two days.', defaultDuration: 'd1' }
  ],
  walk: [
    { key: 'walk_short', label: 'Short walk', sublabel: '1–3 km', distanceLabel: '2 km', detail: 'Neighbourhood walk, errand walk, or quick leg-stretcher.', defaultDuration: 'd30' },
    { key: 'walk_normal', label: 'Normal walk', sublabel: '3–6 km', distanceLabel: '5 km', detail: 'Regular outdoor walk with enough time for weather to matter.', defaultDuration: 'h1' },
    { key: 'walk_long', label: 'Long walk', sublabel: '8–15 km', distanceLabel: '10 km', detail: 'Longer walk where footwear, layers, and water start to matter.', defaultDuration: 'h2' },
    { key: 'walk_big', label: 'Big walk', sublabel: '15 km+', distanceLabel: '18 km+', detail: 'Extended urban/path day with exposure and backup-layer needs.', defaultDuration: 'h4' }
  ],
  fishing: [
    { key: 'fish_short', label: 'Short session', sublabel: '1–2 h', distanceLabel: 'Fishing session', detail: 'Quick shoreline, dock, or easy-access outing.', defaultDuration: 'h2' },
    { key: 'fish_half', label: 'Half day', sublabel: '3–5 h', distanceLabel: 'Fishing session', detail: 'Longer shore or boat session where cold, wind, and rain matter.', defaultDuration: 'h4' },
    { key: 'fish_full', label: 'Full day', sublabel: '6–10 h', distanceLabel: 'Fishing session', detail: 'All-day exposure with a real dry/warm backup plan.', defaultDuration: 'h8' },
    { key: 'fish_ice', label: 'Ice fishing', sublabel: 'winter / exposed', distanceLabel: 'Ice fishing session', detail: 'Cold, static exposure where boots, hands, and wind protection dominate.', defaultDuration: 'h4' }
  ],
  hunting: [
    { key: 'hunt_scout', label: 'Scout / short sit', sublabel: '1–3 h', distanceLabel: 'Hunting outing', detail: 'Short scouting or blind/stand sit.', defaultDuration: 'h2' },
    { key: 'hunt_half', label: 'Half day', sublabel: '3–5 h', distanceLabel: 'Hunting outing', detail: 'Longer static exposure with low activity bursts.', defaultDuration: 'h4' },
    { key: 'hunt_full', label: 'Full day', sublabel: '6–10 h', distanceLabel: 'Hunting outing', detail: 'All-day field exposure with warmth, rain, and safety planning.', defaultDuration: 'h8' },
    { key: 'hunt_cold', label: 'Cold stand', sublabel: 'static / winter', distanceLabel: 'Cold hunting outing', detail: 'Low-output cold-weather sit where insulation matters most.', defaultDuration: 'h4' }
  ],
  casual: [
    { key: 'casual_errands', label: 'Errands', sublabel: 'Short outing', distanceLabel: 'Short outing', detail: 'In and out, not all-day.', defaultDuration: 'h1' },
    { key: 'casual_day', label: 'Day out', sublabel: 'Several hours', distanceLabel: 'Several hours', detail: 'A normal day outside.', defaultDuration: 'h4' },
    { key: 'casual_travel', label: 'Travel day', sublabel: 'Long day', distanceLabel: 'Travel / long day', detail: 'Comfort and packability matter.', defaultDuration: 'h8' },
    { key: 'casual_weekend', label: 'Weekend away', sublabel: '1–2 days', distanceLabel: '1–2 days', detail: 'Layer for swings in conditions.', defaultDuration: 'd2' }
  ]
};
