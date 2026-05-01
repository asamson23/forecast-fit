# Forecast Fit — Unified chronological changelog

This file merges the uploaded changelogs into one chronological development timeline.

## Version-order notes

- Some version labels were reused across different conversations or branches. Where that happened, the entry is kept in its original branch context rather than pretending every similarly named file was the same release.
- Early milestones used file names rather than semantic version numbers. Those are listed first as the pre-Forecast Fit / Weather Clothing Advisor era.
- From `v7.6.1` onward, the timeline becomes mostly linear through `v9.8.14`.
- From `v9` onward, the project convention omits unnecessary trailing zeroes: `v9`, `v9.1`, `v9.8.2`, etc.

---

# 1. Pre-Forecast Fit / Weather Clothing Advisor era

## `weather-clothing-advisor.html` — original uploaded base

- Initial Claude-built version.
- Used a fragile browser-side AI dependency.
- Became the foundation for the later weather/clothing planner.

## `weather-clothing-advisor-fixed.html` — first standalone repair pass

- Removed the browser-side Anthropic dependency.
- Switched clothing advice to local rule-based logic.
- Fixed weather-code handling.
- Added the first water-temperature lookup.
- Improved autocomplete layering and z-index behaviour.

## `weather-clothing-advisor-duration.html` — duration-aware planning

- Added planned-duration selector.
- Expanded clothing suggestions.
- Made recommendations depend more on outing length.

## `weather-clothing-advisor-forecast-checklist.html` — forecast + checklist phase

- Added forecast tied to planned duration.
- Added chart and horizontal forecast table.
- Reworked clothing into grouped sections.
- Added checklist / radio-style interaction.
- Added race clothing and winter wear logic.

## `weather-clothing-advisor-todo-green.html` — checklist restyle

- Replaced default checkboxes with custom green ones.
- Clicking items crossed them out.
- Shifted the output toward a todo/prep-list feel.

## `weather-clothing-advisor-wizard.html` — wizard-style rebuild

- Simplified the flow into wizard steps.
- Added **Now / Later** start selection.
- Restricted later date/time to the forecast range.
- Added sunrise/sunset and day/night logic.
- Displayed feels-like temperature.
- Kept water temperature / wave logic for swimming.

## `weather-clothing-advisor-events.html` — event and activity expansion

- Added event / distance presets by activity.
- Added more duration options.
- Added multi-day support.
- Split open-water swim vs pool swim.
- Added camping.
- Made triathlon its own activity.
- Expanded base-layer logic.
- Added daily forecast mode for multi-day outings.

## `weather-clothing-advisor-route-override.html` — route upload introduced

- Added **Use current location**.
- Made route upload optional.
- Route distance could override manual/preset distance.
- Route duration could override manual duration when timing data existed.
- Added / kept OSM route map.
- Added sampled multi-checkpoint route weather.
- Improved readability and contrast.

## `weather-clothing-advisor-route-checkpoints-interactive.html` — route weather rendering + interaction fix

- Actually rendered route checkpoint weather in results.
- Route upload could auto-fetch weather from the route start.
- Removed redundant location check button.
- Made clothing picks more interactive.
- Clicked checklist items could be crossed out.

## `weather-clothing-advisor-restyled.html` — readability / theme cleanup

- Cleaned checklist capitalization.
- Improved dark-theme label readability.
- Strengthened text hierarchy.
- Improved card/button contrast and spacing.

## `weather-clothing-advisor-sober-custom.html` — sober redesign + custom inputs

- Made UI more sober and less gaudy.
- Added custom distance.
- Added custom duration.
- Added average pace/speed input.
- Added simple derivation logic for distance/duration when possible.
- Disabled distance controls when a route was loaded.
- Later known issue: missing helpers caused JS errors.

## `weather-clothing-advisor-sober-custom-fixed.html` — first sober bug-fix pass

- Fixed `getEventPresets is not defined`.
- Fixed `routeHasDurationOverride is not defined`.
- Enlarged distance / duration / pace inputs.

## `weather-clothing-advisor-sober-custom-fixed-v2.html` — selector and forecast refinement

- Custom distance deselected preset distance.
- Preset distance cleared custom distance.
- Added finer short-event forecast slices.
- Reworked Later picker away from loose manual entry.
- Average pace/speed units became activity-aware.

## `weather-clothing-advisor-sober-custom-fixed-v3.html` — bug fix + duration presets

- Fixed `parseAnyTime is not defined`.
- Added duration presets: 90 min, 3 h, 6 h, 10 h, 18 h.
- Made cards wider on desktop.
- Added best-effort reverse geocode for current location.

---

# 2. Forecast Fit naming phase and early numbered files

## `forecast-fit-weather-gear-planner.html` — renamed to Forecast Fit

- Renamed the tool to **Forecast Fit**.
- Added chart-dot hover values.
- 24-hour events received a real chart.
- Added sunrise/sunset markers.
- Added precipitation chance line.
- Added more inline comments.
- Added separate code notes.

## `forecast-fit-code-notes.md` — supplementary code notes

- Captured manual tweak documentation.
- Recorded structure and behaviour notes for later editing.

## `forecast-fit-weather-gear-planner-v2.html` — tooltip + picker + road trip pass

- Switched chart values to an HTML tooltip.
- Made the hover zone more permissive.
- Added date/time to the big weather card.
- Added **Road trip** activity.
- Replaced the Later dropdown with a JS date/time picker.

## `forecast-fit-weather-gear-planner-v3.html` — chart hover bug fix

- Fixed black hover rectangles covering the chart.
- Added proper floating tooltip CSS.
- Fixed tooltip show/hide behaviour.
- Improved tooltip positioning and leave behaviour.

## `forecast-fit-weather-gear-planner-v4.html` — Later picker + clearer clothing wording

- Fixed **Later** picker behaviour.
- Changed the chart from precipitation percentage to precipitation amount in mm.
- Clarified clothing wording.
- Added descriptions under clothing headers.
- Added **Reset** per clothing section.
- Added **Reset all**.
- Moved **Use current location** onto the same line as the location input.
- Made location placeholder more generic.
- Improved current-location naming.
- Kept **Road trip** activity.

## `forecast-fit-weather-gear-planner-v5.html` — early route marker cleanup

- Changed route map marker labels from **CP** to **Checkpoint**.
- Route markers became **Start**, **Checkpoint 1/2/...**, and **Finish**.

---

# 3. v4/v5/v6 branch consolidation toward v7

## v4 — uploaded baseline / branch point

- Used as a clean base for later `v5+` work.
- Included location search, GPX/GeoJSON route loading, route checkpoints, activity/event/duration presets, forecast charts, and clothing wizard.

## v6 rebuilt branch — superseded branch before returning to v4

- Adapted nice-to-have extras more to outing length/distance.
- Clarified "Race kit".
- Added explicit "Race day" options.
- Added activity reset.
- Split weather and clothing sections.
- Added `HH:mm` custom duration.
- Used half-hour forecast slices for sub-10-hour outings.
- Changed route checkpoint labels to `km XX`.
- Changed map labels to `Weather checkpoint X`.
- Superseded once the uploaded v4 file became the patched base.

## v5 — direct patch from uploaded v4 base

- Adapted nice-to-have extras more based on distance.
- Clarified "Race kit".
- Added "Race day" event presets.
- Added activity reset.
- Split results into weather/forecast and clothing/gear sections.
- Added `HH:mm` custom duration.
- Switched sub-10-hour outings to 30-minute forecast slices.
- Changed route checkpoint labels from `XX km` to `km XX`.
- Changed map labels from `CP X` to `Weather checkpoint X`.

## v5.2 — panel/layout and location-search refinement

- Improved panel text fitting and overflow handling.
- Broadened location input again for non-city searches.
- Supported areas, addresses, landmarks, and postal codes.
- Changed forecast slice rules:
  - 10-minute slices up to 4 hours.
  - 30-minute slices from 6 hours to under 10 hours.
- Adjusted date/time picker styling.
- Scaled route checkpoints more aggressively with distance.
- Added checkpoint location names under route weather entries.

## v5.3 — marine fallback + camping/road-trip expansion

- Added best-effort marine fallback:
  - Open-Meteo Marine as primary.
  - MET Norway Oceanforecast as fallback.
  - Marine-source indicator chip.
- Expanded camping wizard with overnight low, sleeping bag, sleeping pad, shelter, guy-line, and condensation logic.
- Expanded road-trip wizard with route checkpoint awareness, start/finish temperature swings, and better in-cabin vs staged-for-stops recommendations.

## v6 Claude branch — uploaded branch point for v7+

- Broader location search through Open-Meteo and Nominatim.
- Flatpickr styling work.
- Richer route checkpoint cards with place labels.
- Marine fallback logic using MET Norway on top of Open-Meteo Marine.
- Stronger camping and road-trip logic.
- Split result panels.
- AI/Anthropic UI remnants.
- Itinerary panel scaffolding.
- Browser-side Claude/Anthropic calls were not viable in a static HTML page and were later removed.

## v7 — first major patch from Claude v6 branch

- Removed non-working browser-side Anthropic / Claude logic.
- Rebuilt itinerary panel as fully client-side from route checkpoints and OSM/Nominatim.
- Reworked marine fallback stack toward Open-Meteo Marine, ECCC buoy pages, and NOAA NDBC.
- Made Flatpickr closer to the device theme.
- Added example item hints to clothing suggestions.

## v7.1 — forecast/input/preset refinement

- Forecast legend lines matched chart styles better.
- Added horizontal 0°C reference line.
- Changed location field wording back to city-only.
- Improved average pace/speed placeholder and units.
- Added metres/yards for custom distance where applicable.
- Added T100 for triathlon.
- Removed Race day from open-water swim; added 5 km and 10 km swims.
- Added custom weather override for air temp, feels-like, and water temp.

## v7.2 — custom override toggle and whole-window clothing logic

- Hid custom weather override behind a toggle.
- Kept emoji weather icons but added hover/accessibility text.
- Restored miles in custom distance.
- Replaced per-event race-day presets with global **Race day mode**.
- Changed precipitation/clothing logic to examine the whole planned activity window instead of only start conditions.
- Added more concrete clothing examples.

## v7.3 — Race mode expansion

- Added rainbow/party styling to Race day mode.
- Made Race day mode affect actual clothing logic.
- Added race-specific checklist items: bib, timing chip/watch setup, warm layers, dry clothes, transition/race organization.
- Added weather-based glasses suggestions.

## v7.4 — UI/data/attribution batch

- Made the first location/route card collapsible after city or route load.
- Kept custom-weather legend/helper content inside the toggle area.
- Aimed chart hover at wind gusts and wind-direction cues.
- Aimed route checkpoint map popups at quick weather details.
- Added credits/attributions for libraries, data sources, user name, ChatGPT/Claude context.
- Expanded route parser support toward TCX, KML, CSV, and KMZ.
- Follow-up fixes were required for hover/popup/route rendering.

## v7.5 — correction pass on v7.4

- Chart hover actually rendered wind gusts and wind direction.
- Route checkpoint popups refreshed with weather data instead of staying stale.
- Removed a theme color-scheme override that interfered with colours.
- Moved attribution section out of card styling.
- Kept parser expansion for TCX, KML, CSV, and KMZ.

## v7.5.1 — checkpoint enrichment regression fix

- Fixed checkpoint weather being wiped when the map redraw recreated sampled checkpoints.
- Preserved enriched checkpoint weather/place/ETA data.
- Map rendering reused existing enriched checkpoints.

## v7.5.2 — small UX polish

- Added collapsed-summary placeholder: `No location / route loaded`.
- Strengthened Race day button party styling with faster rainbow animation, glow, pulse, and `Race day mode on ✨` label.

## v7.5.3 — Race button cleanup

- Removed pulse animation from Race day button.
- Removed emoji from active Race day button label.
- Kept rainbow animation and glow.

## v7.5.4 — planner structure change

- Removed default activity.
- Reorganized activity section into grouped subsections: Race & endurance, Swimming, Outdoor & travel.
- Activity reset could fully clear the selection.
- Location section gained Reset and Clear all.
- Race day mode gained subtle rainbow treatment on the whole planner card.
- Weather strip gained wind direction, gusts, humidity, precipitation, water temp, and waves.
- Custom duration input got smarter examples.
- If no activity was selected, weather/forecast still displayed but clothing asked for an activity.

## v7.5.5 — no-default-duration experiment

- Removed default planned duration.
- No duration button selected on load.
- Clear all cleared duration too.
- Planner asked the user to choose duration instead of silently assuming one.
- Leaflet popups matched device theme better.
- Base map switched to theme-aware light/dark raster map.
- This introduced route/city-picker regressions because shared flow assumed duration existed.

## v7.5.6 — first regression fix attempt

- Allowed route rendering without selected duration.
- Delayed checkpoint weather until duration existed.
- Footer began showing explicit version number.
- Route/city-picker issue was not fully resolved.

## v7.5.7 — stabilization fix

- Restored default planned duration of 1 hour.
- Clear all reset duration back to the default.
- Stabilized the shared render/planning path for city selection and route loading.

## v7.5.8 — popup/math/pace refinement

- Improved Leaflet popup styling and readability for location/ETA.
- Changed checkpoint markers to themed markers: `S`, numbered middle checkpoints, `F`.
- When distance and duration were both known, displayed derived average in the average status.
- Restored cycling **min/km** pace option.

## v7.5.8.1 — compact checkpoint popup layout

- Put `Weather checkpoint X` and `km XX` on the same line.
- Put weather condition and temperature/feels-like on the same line.
- Put wind speed/direction and gusts on the same line.
- Tightened popup rows into a denser info-card layout.

## v7.5.8.2 — weather-strip readability pass

- Added labels to right-side weather-strip stats: Humidity, Wind, Gusts, Precip, Water, Waves.

## v7.6.0 — Strava/Zwift-inspired visual redesign

- Shifted palette/aesthetics toward sport-platform styling.
- Added stronger orange primary accent and cooler blue secondary accent.
- Cleaned up training-platform feel in light theme.
- Dark theme moved toward navy/charcoal.
- Restyled cards, forecast blocks, wizard panels, buttons, and active states.
- Kept Race mode party treatment.

## v7.6.1 — gradient-line cleanup

- Removed repeated gradient-top-line pseudo-element treatment from cards, result panels, forecast boxes, weather strips, and wizard steps.
- Fixed the line poking past rounded corners.

---

# 4. Linear v7.6.1 → v8.1.4 development

## v7.6.2 — clothing & gear card cleanup

- Flattened clothing sections so they read more like sections than cards-inside-cards.
- Turned choices and checklist items into grouped rows.
- Replaced main-pick mini-card stack with compact pill-style items.
- Softened borders, spacing, and emphasis.

## v7.6.3 — manual weather override cleanup

- Removed manual air-temperature and feels-like overrides.
- Kept manual water-temperature override.
- Added clickable `seatemperature.info` link in the override/status area.
- Updated JS so manual override only affects water temperature.

## v7.6.4 — sea-temperature link styling

- Styled sea-temperature links.
- Added both `seatemperature.info` and `seatemperature.org`.
- Updated dynamic status text so both links appear styled.

## v7.6.5 — footer version sync

- Updated the footer version number to `v7.6.5`.

## v7.6.6 — route file format restriction

- Removed support for route formats beyond GPX and GeoJSON.
- Removed TCX, KML, KMZ, CSV, and other non-GPX/GeoJSON formats.
- Restricted file picker to `.gpx` and `.geojson`.
- Added clearer unsupported-format errors.

## v7.6.7 — sunrise/sunset in weather strip

- Added sunrise and sunset times to the weather-strip meta section.
- Showed them regardless of event length.
- Tied them to the selected start day.

## v7.6.8 — `nearestDurationKey` helper fix

- Fixed `nearestDurationKey is not defined`.
- Restored/added `nearestDurationKey()`.
- Kept sunrise/sunset weather-strip addition.

## v7.6.9 — `formatMinutesShort` helper fix

- Fixed `formatMinutesShort is not defined`.
- Restored/added `formatMinutesShort()`.

## v8.0.0 — smart checkpoint model and route-weather overhaul

- Introduced **Old model** and **Smart model** checkpoint modes.
- Added Old/Smart checkpoint toggle.
- Smart model added time-based checkpoints, max-distance gap logic, climb-aware ETA weighting, sunrise/sunset anchors, interpolated hourly weather, route-relative wind labels, event-style checkpoint promotion, and short weather-window summaries.
- Added checkpoint markers on the forecast chart.
- Added elevation parsing from GPX and GeoJSON.

## v8.0.1 — missing route renderer fix

- Fixed `buildRouteWeatherHtml is not defined`.
- Restored/added `buildRouteWeatherHtml()`.
- Made it work with both old and smart checkpoint models.
- Included smart-model extras in checkpoint cards.

## v8.0.2 — Flatpickr dark mode + Monday week start

- Fixed Flatpickr manual time input hover/focus styling in dark mode.
- Added explicit hover/focus styling for time inputs and AM/PM.
- Set date picker weeks to start on Monday.

## v8.0.3 — item tag styling

- Changed `.item-tag` to use the existing blue accent palette instead of neutral styling.

## v8.0.4 — credits/footer cleanup + field note

- Cleaned up credits and attributions.
- Added CARTO to map attribution.
- Clarified Nominatim/Open-Meteo geocoding and Open-Meteo forecast/marine usage.
- Moved version number onto the app-name line.
- Rewrote activity-card bottom field note.

## v8.0.5 — activity group rename + outdoor/travel reorder

- Reduced large bottom body padding.
- Renamed `Race & endurance` to `Performance & multisport`.
- Reordered Outdoor & travel to Road trip, Camping, Casual.

## v8.0.6 — outdoor/travel relabel

- Reordered Outdoor & travel to Casual, RT, Camping.
- Changed Road trip label to **RT**.

## v8.0.7 — reset/clear button cleanup

- Reduced visual clutter from Reset/Clear/Clear all buttons.
- Made Collapse quieter, Reset subtler, and Clear all / Remove route more prominent.
- Renamed actions for clarity: Reset section, Remove route, Reset guide, Reset step.
- Reordered top location-card actions.

## v8.0.8 — planner logic improvements + Road trip label revert

- Changed **RT** back to **Road trip**.
- Made Activity Reset section reset activity, event preset, planned duration, race day mode, custom distance, custom duration, and custom average.
- Made custom distance/duration/average a 3-way calculator.
- Clicking planned duration now clears custom planner fields first.

## v8.0.9 — planned duration ordering + reset placement

- Moved Reset section to the top right of the whole planner card.
- Kept Race day mode in activity controls.
- Reordered 90 min after 60 min / 1 h.
- Changed 1-hour tag to `60 min / 1 h`.

## v8.0.10 — Reset guide placement cleanup

- Fixed Reset section placement at top right.
- Moved Reset guide inline with clothing summary before guide sections.
- Kept Reset step inside each guide section.

## v8.0.11 — dual duration labels up to 3 hours

- Added dual minute/hour labels up to 3 hours: 60 min / 1 h, 90 min / 1.5 h, 120 min / 2 h, 180 min / 3 h.
- Kept longer presets hours-only.

## v8.0.12 — duration label shortening + alignment attempt

- Shortened labels to `m` format.
- Added duration-specific styling for alignment.
- Made duration numbers align more consistently.

## v8.0.13 — duration label revert + bullet separator

- Reverted `m` back to `min`.
- Replaced `/` with bullet separators in dual labels.

## v8.0.14 — two-line duration labels

- Changed dual-format duration labels to two lines, with hour equivalent on its own line.
- Updated duration label styling for line breaks.

## v8.0.15 — button label size reduction

- Reduced shared button label size to `0.8rem`.
- Helped keep **Triathlon** on one line.

## v8.1.0 — Best weather window finder

- Added third start-time mode: **Best window**.
- Added Weather window finder panel with date, earliest/latest start, priority, step size, and advanced limits.
- Made Best overall adapt to selected activity.
- Built top-3 best window results.
- Made results clickable to load that time and refresh forecast, route weather, and clothing logic.
- Added best-window timeline strip with highlighted windows, markers, and active recommendation marker.
- Used resolved outing duration from presets, custom duration, derived fields, or route timing.
- Made route-aware scoring respect old/smart checkpoint model.

## v8.1.1 — Best-window Flatpickr search range + 24-hour time

- Replaced Best-window search date and early/late time fields with two Flatpickr datetime boxes.
- Aligned them with Later picker rules: 24-hour time, Monday week start, minute increments, forecast-range constraints.
- Switched general weather time formatting to 24-hour time.

## v8.1.2 — richer best-window timeline + 5-minute granularity

- Put search start/end on the same desktop row.
- Added day-of-week to result times.
- Improved strip with a graduated timeline, automatic tick spacing, 15-minute to 24-hour scale, and better multi-day labels.
- Changed Flatpickr selectors to 5-minute increments.

## v8.1.3 — best-window rank colours + mobile weather strip

- Added distinct colours for #1, #2, and #3 best windows.
- Fixed mobile timeline overflow.
- Kept mobile weather icon inline with time/weather/feels block.

## v8.1.4 — mobile forecast section improvements

- Made Forecast over the planned duration more mobile-friendly.
- Wrapped chart/table area in a horizontal scroll container on narrow screens.
- Reduced mobile forecast header, chart, forecast cells, and daily cells.
- Tightened lateral padding on mobile cards and forecast boxes.

---

# 5. Linear v8.1.4 → v9.8.2 development

## v8.2.0 — CSS overhaul and mobile cleanup

- Added a cleaner responsive/mobile CSS layer.
- Fixed mobile overflow risk for charts, daily cards, best-window strips, action rows, and route checkpoint cards.
- Improved spacing, padding, and wrapping.
- Removed unused/dead CSS and duplicate forecast/daily styles.
- Removed duplicate `raceRainbowShift` keyframes.
- Fixed chart checkpoint dots from `var(--card)` to `var(--surface)`.

## v8.2.1 — Flatpickr month/day visibility fixes

- Fixed next/previous month day colours.
- Made disabled dates visible gray.
- Added explicit month/year header height and alignment.
- Fixed month label overlap/hiding.

## v8.2.2 — Flatpickr time picker spacing

- Added height and bottom padding to the time picker.
- Improved hour/minute input height and line-height.
- Improved AM/PM alignment and separator alignment.

## v8.2.3 — activity grid, labels, refresh weather, mobile safe area

- Changed activity setup grid to balanced 1fr / 1fr layout.
- Changed `.label` text size to `1em`.
- Added Refresh weather button in Location & route header.
- Refresh used resolved coordinates, route start, or typed city search.
- Added mobile safe-area top padding.

## v8.2.4 — water sports expansion and Location OR Route layout

- Changed triathlon icon to a single swimming emoji.
- Renamed water area to **Swimming & water**.
- Added Other water sports: paddleboarding, surfing, kayak, snorkeling, other water.
- Added matching presets and gear logic.
- Reworked Location & route into a Location / OR / Route upload layout.

## v9 — global-ish water-temperature fallback model

- Added pseudo water-temperature fallback model using recent Open-Meteo `past_days=7` weather.
- Used overnight lows, daytime highs, latitude bands, hemisphere-aware season handling, water body type, and wind exposure.
- Produced conservative estimated ranges.
- Implemented source hierarchy: measured/fetched data, pseudo-estimate, unknown, manual override.
- Added confidence bars and states: high, medium, low, unknown, manual.
- Added water body type, wind exposure, and pool type controls.
- Added outdoor/unheated pool handling.
- Improved location-search candidates and prioritized North America, Western Europe, then other regions.

## v9.1 — water controls consolidation and new activity groups

- Tablet layout moved Use current location under input while keeping Location / OR / Route structure.
- Merged Custom weather override into Water temperature & override.
- Added explainers for water body type, wind exposure, and pool type.
- Added Indoor training: gym, indoor running, indoor cycling.
- Added Trail & mountain: hiking, trail running, MTB/gravel, ski/snowboard.
- Added presets and recommendation logic for new activity types.
- Made main pick more itemized and checklist-like.
- Clarified cold-water wording with explicit neoprene hood/gloves/booties.

## v9.2 — cold-water de-duplication and current-location icon

- Reduced duplicate cold-water swim options.
- Added distinct "shorten or postpone if under-equipped" option.
- Reduced Step 2/checklist repetition.
- Replaced duplicates with safety, exit, and buddy-plan checks.
- Replaced current-location text label with location-arrow icon button.

## v9.2.1 — OWS safety buoy / tow float

- Added safety buoy/tow float as default open-water swim essential.
- Changed low-light duplicate into extra visibility / shore spotter plan.
- Added triathlon training note: tow float for training, race rules may disallow it.

## v9.2.2 — current-location icon layout and icon swap

- Put current-location icon button inline with location input across layouts.
- Replaced send-looking arrow with target/crosshair icon.

## v9.2.3 — Walk activity

- Added **Walk** under Outdoor & travel.
- Added walk presets: short, normal, long, big walk.
- Added walking-specific clothing/gear logic, distance, and average-speed support.

## v9.2.4 — hunting/fishing, pool split, velodrome, paddleboarding rename

- Added Fishing and Hunting section with presets/gear logic.
- Made indoor cycling explicitly include velodrome cycling.
- Split pool swimming into indoor pool and outdoor pool.
- Outdoor pool defaults more toward unheated/outdoor water-temperature fallback.
- Renamed Stand-up paddle to Paddleboarding.

## v9.3 — Temperature preference slider

- Added Temperature preference slider: much warmer, warmer, normal, cooler, much cooler.
- Warmer/cooler preferences nudge clothing recommendations without changing real weather readings.
- Added preference chip when not Normal.
- Applied to running, cycling, MTB/gravel, walking, hiking, casual, camping, water-adjacent, and other outdoor activities.
- Reset/Clear all returns preference to Normal.

## v9.3.1 — car-style temperature slider redesign

- Expanded slider to 9 stops: 4 warmer, normal, 4 cooler.
- Changed track to red → neutral → blue gradient.
- Removed native-looking progress fill.
- Updated labels, result chips, and internal offset logic.

## v9.3.2 — water model grid alignment

- Set `.water-model-grid` to `align-items: start`.

## v9.4 — dynamic road-trip itinerary cap and comments

- Replaced fixed `maxStops = 10` with dynamic stop limits up to 24.
- Long routes can show more itinerary stops/checkpoints.
- Sampling preserves Start and Finish and spreads stops across the route.
- Added itinerary note showing displayed stop count.
- Renamed internal variables and added code comments around itinerary, checkpoints, water fallback, temperature preference, custom derivation, render orchestration, and event wiring.

## v9.4.1 — indoor and water activity regrouping

- Grouped Indoor pool swim with other indoor sports.
- Reorganized water into Outdoor swimming and Paddling & board sports.
- Added internal v9.4.1 note in code comments.

## v9.4.2 — indoor no-location mode

- Allowed gym, indoor running, indoor cycling/velodrome, and indoor pool swim to work without location.
- Shows Indoor guide instead of weather card/forecast chart.
- If a location is added later, app switches back to weather-aware mode.
- Adjusted wording to avoid fake weather claims.

## v9.5 — Quick start helper overlay

- Added Quick start button and helper overlay.
- Guide follows page order: Location & route, Activity, Event/distance, Planned duration, Temperature preference, Start time, Water temperature & override, Weather checkpoint model, Results.
- Steps can jump to sections with temporary highlighting.
- Wording adapts to indoor activity, location/route state, water relevance, and results state.

## v9.5.1 — Race day mode exit animation fix

- Fixed accidental animation replay when leaving Race day mode.
- Planner card no longer replays initial fade/slide when Race mode turns off.
- Race-party animation remains while active.

## v9.6 — Indoor multisport

- Added Indoor multisport under Indoor training.
- Works without location.
- Added presets: Indoor brick, Indoor tri-style, Gym + cardio, Indoor event.
- Added guidance for sport-specific swaps, tri-style indoor kit, swim/bike/run bundle, transition bag, sport shoes, and mini transition checklist.
- Deferred full manual multisport builder.

## v9.7 — Planned effort

- Added Planned effort: Low/standing, Easy, Steady, Hard, Race.
- Low/easy nudges recommendations warmer; hard/race nudges lighter.
- Does not change real forecast values.
- Added result chips when effort is not Steady.
- Added indoor effort logic for cooling or warm-up/between-effort layers.
- Added Planned effort to Quick start.

## v9.8 — custom multisport, collapsible activities, route-only checkpoint model, tooltip portal

- Added custom multisport builder for Triathlon and Indoor multisport.
- Custom triathlon legs influence checklist wording, water relevance, swim safety, and no-swim recommendations.
- Custom indoor blocks influence checklist, packing/transition, fan, pool, run, and gym logic.
- Hid Weather checkpoint model unless a route is loaded.
- Made activity subsections collapsible.
- Once selected, only the selected group stays open by default.
- Location & route auto-collapses after loading location/route.
- Location & route header forced into one-line layout with overflow handling.
- Attempted to move chart tooltip to body-level positioning to avoid clipping.

## v9.8.1 — activity toggle fix attempt, comfort grouping, precipitation chance

- Fixed activity subsection headers so they can open/close.
- Added interaction handling for collapsible sections.
- Kept `card-top-actions` aligned to `flex-end`.
- Added Activity & parameters label at top of planner card.
- Grouped Planned effort and Temperature preference into Comfort adjustments.
- Attempted to restore chart hover tooltip through body-level portal.
- Added precipitation chance % beside amount in hourly forecast cards, chart tooltip, and chart legend/header wording.

## v9.8.2 — activity toggle and chart-tooltip regression fix, later broken baseline

- Activity subsection toggles now use delegated click/keyboard handling.
- Forecast chart tooltip is bound directly to SVG hit zones again while using a body-level portal.
- Added `CSS.escape` fallback for older embedded browsers/webviews.
- Later uploaded copy of v9.8.2 exposed a startup crash: `Cannot access 'activityGroupsLastAutoSyncedActivity' before initialization`, which blocked core UI wiring including the location input.

---

# 6. Linear v9.8.2 → v9.8.14 development

## v9.8.3 — startup crash fix

- Fixed initialization crash around `activityGroupsLastAutoSyncedActivity` and `activityGroupToggleDelegationBound`.
- Moved problematic accordion state declarations earlier so `renderPlannerState()` could run safely.
- Added comment explaining initialization-order fix.
- Restored app startup and location input wiring.

## v9.8.4 — Comfort adjustments stacked vertically

- Changed `.comfort-adjustments-grid` from two columns to one column globally.
- Planned effort and Temperature preference now appear vertically on all viewport sizes.

## v9.8.5 — Activity reset button moved into heading row

- Moved `Reset section` into the Activity & parameters heading row.
- On desktop it aligns with the section title.
- On narrow screens it can wrap below the title.

## v9.8.6 — precipitation chance added to weather strip

- Weather strip precipitation display now includes amount and chance.
- Example: `Precip 0.0 mm · 35%`.

## v9.8.7 — water fallback cleanup and best-window medals

- Hid water fallback/source chip and warning note for non-water activities.
- Kept water fallback behaviour for water-relevant activities.
- Best window can show up to six options.
- Top three options use medal labels and gold/silver/bronze styling.
- Timeline bands now represent full activity duration.

## v9.8.8 — best-window condensation, selected layering, range overflow warnings

- Condensed nearby starts into distinct windows.
- Avoided redundant runner-up options when starts are essentially the same opportunity.
- Made timeline bands/markers clickable.
- Selected option visually comes forward.
- Warns when the full activity extends past search end.
- Bands extending past search end use dashed border treatment.

## v9.8.9 — at least two options and adaptive timeline ticks

- Best window keeps at least two options when enough candidates exist.
- Added adaptive timeline tick spacing.
- Added lighter minor ticks and labeled major ticks.
- Added midnight/date ticks for cross-day timelines.

## v9.8.10 — minimum three options and clustered start-time ranges

- Best window targets three to six options when enough candidates exist.
- Added compact clustered good-start ranges.
- Start ranges are limited to the densest 30-minute pocket.
- Timeline hover titles mention good-start range.

## v9.8.11 — UV index and forecast-derived warning panels

- Added UV index from Open-Meteo hourly/daily data.
- Displayed UV in weather strip, forecast cells, chart tooltip, route checkpoint cards, and checkpoint summary.
- Smart route checkpoints can mark peak UV.
- High UV affects Best-window scoring for outdoor activities.
- Added UV-aware sun protection clothing/gear logic.
- Added forecast-derived hazard panels for thunderstorms, wind/gusts, heavy precipitation, snow/mix, and high UV.

## v9.8.12 — Canada.ca UV scale and ECCC alerts for Canadian locations

- Aligned UV categories with Canada/ECCC scale:
  - 0–2 Low
  - 3–5 Moderate
  - 6–7 High
  - 8–10 Very high
  - 11+ Extreme
- Added UV colour ramp: green, yellow, orange, red, purple.
- Canadian locations/checkpoints try official ECCC alerts through MSC GeoMet `weather-alerts`.
- Non-Canadian locations continue using forecast-derived warnings.
- Canadian ECCC lookup failure falls back to forecast-derived warnings with fallback note.

## v9.8.13 — forecast-cell UV display simplified

- Kept forecast-cell data: temperature, feels-like, wind, precipitation amount/chance, UV.
- Simplified UV display in forecast cells to rating/category only.
- Removed redundant sun icon before UV badge.

## v9.8.14 — forecast-cell compact value display and hover labels

- Removed UV rating/category text from visible forecast-cell UV bubble.
- Forecast-cell UV now shows numeric value only, e.g. `UV 4.2`.
- Chart tooltip also shows numeric UV.
- Forecast-cell secondary data made more compact.
- Visible values prioritize data; labels moved into hover/title text.
- Feels-like temperature now appears on its own line.

---

# 7. Linear v9.8.15 → v11 development

## v9.8.15 — Strava planner autofill

- Strava import now autofills sport, average pace/speed, and planned duration when the activity data supports it.

## v10.1.6 — running duration default to minutes

- Custom duration input for running activities now defaults to minutes instead of hours.

## v10.1.7 — Strava running duration default

- Strava-loaded running activities use the same minutes duration default as manual running selection.

## v10.2 — Best Window score explainer

- Added a score explainer below Best Window result cards.
- The chosen time shows the main scoring tradeoffs.

## v10.3 — route checkpoint callout copy and spacing

- Sharpened the route checkpoint callout copy.
- Added more breathing room below the route weather slot inside the forecast result.

## v10.4 — collapsible planner subsections

- Added collapsible subsections for duration, effort, temperature preference, and water controls.
- Moved Start time to the bottom of Activity & parameters.
- Planned effort promotes to Race when Race day mode is enabled.

## v10.5 — mobile Location & route fixes

- Fixed mobile Location & route action-button wrapping.
- Mirrors loaded route distance into the disabled custom-distance input.
- Moves and collapses Event / distance into the right planner column while a route is active.

## v10.6 — forecast-only shortcut

- Added a forecast-only shortcut that collapses the planner for weather-only use.
- Hides route/Strava import options while that shortcut is active.
- Renames the older checkpoint model to Standard.

## v10.7 — social sharing metadata

- Added Open Graph and Twitter Card meta tags to the app shell.
- Shared links now include a title, description, and image hint on platforms that read those tags.

## v10.8 — forecast-only mode toggle

- Makes forecast-only mode a real toggle.
- Gives the location chooser a single-column forecast-only layout.
- Removes leftover OR dividers in that mode.
- Surfaces water temperature in weather-only results as an at-a-glance signal.

## v10.9 — water controls hidden in forecast-only mode

- Hides water-temperature override controls while forecast-only mode is active.
- The at-a-glance water signal in results remains visible.

## v11 — forecast-only cleanup

- Hides the full water-settings section in forecast-only mode.
- Hides Best window in forecast-only mode.
- Restores a visible water-temperature signal in forecast-only results.
- Removes the empty Clothing & gear panel from forecast-only output.

---

# High-level merged progression

## Core evolution

1. **Weather Clothing Advisor prototype** — local rules replaced fragile browser AI; duration, forecast, checklist, wizard, route, and water-temperature logic appeared.
2. **Forecast Fit naming phase** — charts, route labels, date/time handling, and road-trip support matured.
3. **v5/v6/v7 branches** — Claude branch cleanup, client-side itinerary, marine fallback, Race day mode, richer popups, route weather, and sport-platform aesthetics.
4. **v8 route-weather intelligence** — Smart checkpoint model, elevation parsing, route-relative wind, and best weather window finder.
5. **v9 activity/weather intelligence** — water-temperature fallback model, indoor/no-location mode, wider activity taxonomy, temperature preference, planned effort, multisport logic.
6. **v9.8 refinement series** — collapsible activities, chart tooltip repairs, precipitation chance, best-window ranking/condensation, UV, Canadian alerts, and compact forecast-cell display.
7. **v9.8.15–v11** — Strava autofill, Best Window score explainer, collapsible planner subsections, forecast-only mode, social sharing metadata, and forecast-only output cleanup.

## Latest unified endpoint

Latest version: **v11**.
