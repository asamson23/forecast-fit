# Forecast Fit — Changelog

---

## `weather-clothing-advisor.html`

- Four activities: Running / Triathlon, Cycling, Open Water Swimming, Casual.
- Location input with manual text entry.
- Live weather via Open-Meteo (free, no API key).
- Geocoding via Open-Meteo geocoding API.
- Clothing recommendations generated via Claude AI (Anthropic API) based on conditions, activity, and duration.
- Auto/system dark mode via `prefers-color-scheme`.
- Skeleton loading states during fetch.
- Activity switching re-triggered clothing advice without re-fetching weather.
- Clothing items ordered head-to-toe, split into primary (essential) and secondary (optional) with colour-coded left border.
- Warning box for safety-relevant conditions (thunderstorms, extreme heat/cold, etc.).

## `weather-clothing-advisor.html` — autocomplete update

- Added debounced autocomplete on the location input (260 ms delay, min 2 characters).
- Up to 6 city suggestions from Open-Meteo geocoding API.
- Country flag emoji derived from ISO country code.
- Two-line suggestion layout: city name + region · country.
- Keyboard navigation: ↑ / ↓ to move, Enter to select, Escape to dismiss.
- Click outside closed the dropdown.
- Suggestion portal appended to `<body>` and positioned via `getBoundingClientRect()` — no card clipping.
- Selecting a suggestion skipped the second geocoding round-trip (coordinates already known).
- Fixed: model name corrected from `claude-sonnet-4-20250514` to `claude-sonnet-4-6`.
- Fixed: `overflow: visible` on `.card` so dropdown was not clipped underneath activity buttons.
- Fixed: `fetchWeatherFromResult` refactored into shared `fetchWeatherCore()` to eliminate double button-reset race condition between suggestion click and the manual Check button.

## `weather-clothing-advisor-fixed.html`

- Removed the browser-side Anthropic dependency.
- Switched clothing advice to local rule-based logic.
- Fixed weather-code handling.
- Added the first water-temperature lookup.
- Improved autocomplete layering and z-index behaviour.

## `weather-clothing-advisor-duration.html`

- Added planned-duration selector.
- Expanded clothing suggestions based on outing length.

## `weather-clothing-advisor-forecast-checklist.html`

- Added forecast tied to planned duration.
- Added chart and horizontal forecast table.
- Reworked clothing into grouped sections.
- Added checklist / radio-style interaction.
- Added race clothing and winter wear logic.

## `weather-clothing-advisor-todo-green.html`

- Replaced default checkboxes with custom green ones.
- Clicking items crossed them out.

## `weather-clothing-advisor-wizard.html`

- Simplified the flow into wizard steps.
- Added **Now / Later** start selection.
- Restricted later date/time to the forecast range.
- Added sunrise/sunset and day/night logic.
- Displayed feels-like temperature.
- Added water temperature / wave logic for swimming.

## `weather-clothing-advisor-events.html`

- Added event / distance presets by activity.
- Added more duration options.
- Added multi-day support.
- Split open-water swim vs pool swim.
- Added camping and triathlon activities.
- Expanded base-layer logic.
- Added daily forecast mode for multi-day outings.

## `weather-clothing-advisor-route-override.html`

- Added **Use current location**.
- Made route upload optional.
- Route distance and duration can override manual inputs.
- Added OSM route map and sampled multi-checkpoint route weather.
- Improved readability and contrast.

## `weather-clothing-advisor-route-checkpoints-interactive.html`

- Rendered route checkpoint weather in results.
- Route upload auto-fetches weather from the route start.
- Removed redundant location check button.
- Made clothing picks more interactive; clicked items can be crossed out.

## `weather-clothing-advisor-restyled.html`

- Cleaned checklist capitalization.
- Improved dark-theme label readability and text hierarchy.
- Improved card/button contrast and spacing.

## `weather-clothing-advisor-sober-custom.html`

- Redesigned UI toward a cleaner, less gaudy style.
- Added custom distance, duration, and average pace/speed inputs.
- Added derivation logic for distance/duration when possible.
- Disabled distance controls when a route was loaded.

## `weather-clothing-advisor-sober-custom-fixed.html`

- Fixed `getEventPresets is not defined`.
- Fixed `routeHasDurationOverride is not defined`.
- Enlarged distance / duration / pace inputs.

## `weather-clothing-advisor-sober-custom-fixed-v2.html`

- Custom distance deselects preset distance; preset distance clears custom.
- Added finer short-event forecast slices.
- Reworked Later picker away from loose manual entry.
- Average pace/speed units became activity-aware.

## `weather-clothing-advisor-sober-custom-fixed-v3.html`

- Fixed `parseAnyTime is not defined`.
- Added duration presets: 90 min, 3 h, 6 h, 10 h, 18 h.
- Made cards wider on desktop.
- Added best-effort reverse geocode for current location.

---

## `forecast-fit-weather-gear-planner.html`

- Renamed the tool to **Forecast Fit**.
- Added chart-dot hover values and a real chart for 24-hour events.
- Added sunrise/sunset markers and precipitation chance line.

## `forecast-fit-weather-gear-planner-v2.html`

- Switched chart values to an HTML tooltip with a more permissive hover zone.
- Added date/time to the big weather card.
- Added **Road trip** activity.
- Replaced the Later dropdown with a JS date/time picker.

## `forecast-fit-weather-gear-planner-v3.html`

- Fixed black hover rectangles covering the chart.
- Added proper floating tooltip CSS and fixed show/hide/positioning behaviour.

## `forecast-fit-weather-gear-planner-v4.html`

- Fixed **Later** picker behaviour.
- Changed the chart from precipitation percentage to precipitation amount in mm.
- Clarified clothing wording and added descriptions under clothing headers.
- Added **Reset** per clothing section and **Reset all**.
- Moved **Use current location** onto the same line as the location input.

## `forecast-fit-weather-gear-planner-v5.html`

- Changed route map marker labels from **CP** to **Checkpoint**.
- Route markers became **Start**, **Checkpoint 1/2/...**, and **Finish**.

---

## v4 — baseline

- Included location search, GPX/GeoJSON route loading, route checkpoints, activity/event/duration presets, forecast charts, and clothing wizard.

## v6 rebuilt branch

- Adapted recommendations more to outing length/distance.
- Added explicit Race day options and activity reset.
- Split weather and clothing sections.
- Added `HH:mm` custom duration.
- Used half-hour forecast slices for sub-10-hour outings.
- Changed route checkpoint labels to `km XX` and map labels to `Weather checkpoint X`.

## v5 — patch from v4 base

- Adapted recommendations more based on distance.
- Added Race day event presets and activity reset.
- Split results into weather/forecast and clothing/gear sections.
- Added `HH:mm` custom duration.
- Switched sub-10-hour outings to 30-minute forecast slices.
- Changed route checkpoint labels from `XX km` to `km XX`.

## v5.2

- Improved panel text fitting and overflow handling.
- Broadened location input to support areas, addresses, landmarks, and postal codes.
- Changed forecast slice rules: 10-minute slices up to 4 h, 30-minute slices from 6 h to under 10 h.
- Adjusted date/time picker styling.
- Scaled route checkpoints more aggressively with distance.
- Added checkpoint location names under route weather entries.

## v5.3

- Added marine fallback stack: Open-Meteo Marine as primary, MET Norway Oceanforecast as fallback, with a source indicator chip.
- Expanded camping wizard with overnight low, sleeping bag, sleeping pad, shelter, guy-line, and condensation logic.
- Expanded road-trip wizard with route checkpoint awareness, start/finish temperature swings, and better in-cabin vs staged-for-stops recommendations.

## v6 Claude branch

- Based on ChatGPT-iterated v5.3 (Leaflet map, SVG forecast chart, 8 activities, GPX/GeoJSON route upload with checkpoint weather).
- Added Claude's take panel above the clothing wizard; auto-fires on every render with full context (start conditions, up to 8 hourly forecast points, all route checkpoints with ETAs, duration, distance, pace, and current wizard picks); Refresh button for manual re-run; skeleton loading state; ~700 tokens in / ~350 tokens out per call.
- Added Road trip itinerary panel; reverse-geocoded all route checkpoints via Nominatim; sent checkpoint weather and ETAs to Claude; produced a timeline with suggested break stops between checkpoints two or more hours apart (fuel, meal, weather window, fatigue rationale); vertical timeline with colour-coded dots (orange = suggested, green = finish).
- Both AI panels degrade gracefully on API failure or missing route.

## v7

- Removed non-working browser-side Anthropic / Claude logic.
- Rebuilt itinerary panel as fully client-side from route checkpoints and OSM/Nominatim.
- Reworked marine fallback stack toward Open-Meteo Marine, ECCC buoy pages, and NOAA NDBC.
- Made Flatpickr closer to the device theme.
- Added example item hints to clothing suggestions.

## v7.1

- Improved forecast legend line styles and added a horizontal 0°C reference line.
- Changed location field wording back to city-only.
- Improved average pace/speed placeholder and units.
- Added metres/yards for custom distance where applicable.
- Added T100 for triathlon; removed Race day from open-water swim; added 5 km and 10 km swims.
- Added custom weather override for air temp, feels-like, and water temp.

## v7.2

- Hid custom weather override behind a toggle.
- Added hover/accessibility text to emoji weather icons.
- Restored miles in custom distance.
- Replaced per-event race-day presets with global **Race day mode**.
- Changed precipitation/clothing logic to examine the whole planned activity window.
- Added more concrete clothing examples.

## v7.3

- Added rainbow/party styling to Race day mode.
- Made Race day mode affect actual clothing logic.
- Added race-specific checklist items: bib, timing chip/watch setup, warm layers, dry clothes, transition/race organization.
- Added weather-based glasses suggestions.

## v7.4

- Made the location/route card collapsible after city or route load.
- Aimed chart hover at wind gusts and wind-direction cues.
- Aimed route checkpoint map popups at quick weather details.
- Added credits/attributions for libraries, data sources, and context.
- Expanded route parser support to TCX, KML, CSV, and KMZ.

## v7.5

- Fixed chart hover to render wind gusts and wind direction.
- Fixed route checkpoint popups not refreshing with weather data.
- Removed a theme color-scheme override that interfered with colours.
- Moved attribution section out of card styling.

## v7.5.1

- Fixed checkpoint weather being wiped when the map redraw recreated sampled checkpoints.
- Preserved enriched checkpoint weather/place/ETA data across redraws.

## v7.5.2

- Added collapsed-summary placeholder: `No location / route loaded`.
- Strengthened Race day button styling with faster rainbow animation, glow, and pulse.

## v7.5.3

- Removed pulse animation and emoji from the active Race day button label.

## v7.5.4

- Removed default activity; reorganized activity section into grouped subsections.
- Added Reset and Clear all to the location section.
- Added subtle rainbow treatment on the whole planner card in Race day mode.
- Added wind direction, gusts, humidity, precipitation, water temp, and waves to the weather strip.
- Weather/forecast now displays without an activity selected; clothing prompts for one.

## v7.5.5

- Removed default planned duration; planner now prompts the user to choose.
- Leaflet popups match device theme; base map switched to theme-aware light/dark raster.

## v7.5.6

- Allowed route rendering without a selected duration.
- Delayed checkpoint weather until duration exists.
- Added explicit version number to the footer.

## v7.5.7

- Restored default planned duration of 1 hour.
- Clear all resets duration back to the default.
- Stabilized the shared render/planning path for city selection and route loading.

## v7.5.8

- Improved Leaflet popup styling and readability for location/ETA.
- Changed checkpoint markers to themed markers: `S`, numbered middle checkpoints, `F`.
- Displayed derived average in the status when both distance and duration are known.
- Restored cycling **min/km** pace option.

## v7.5.8.1

- Tightened checkpoint popup layout: condition/temp/wind/gusts on single lines each.

## v7.5.8.2

- Added labels to weather-strip stats: Humidity, Wind, Gusts, Precip, Water, Waves.

## v7.6.0

- Shifted palette toward sport-platform styling (orange primary, blue secondary).
- Dark theme moved toward navy/charcoal.
- Restyled cards, forecast blocks, wizard panels, buttons, and active states.

## v7.6.1

- Removed repeated gradient-top-line pseudo-element from cards, result panels, forecast boxes, weather strips, and wizard steps.
- Fixed the line poking past rounded corners.

---

## v7.6.2

- Flattened clothing sections into grouped rows with compact pill-style items.
- Softened borders, spacing, and emphasis.

## v7.6.3

- Removed manual air-temperature and feels-like overrides.
- Added clickable `seatemperature.info` link in the water-temperature override area.

## v7.6.4

- Styled sea-temperature links; added both `seatemperature.info` and `seatemperature.org`.

## v7.6.5

- Updated the footer version number.

## v7.6.6

- Removed support for route formats beyond GPX and GeoJSON (TCX, KML, KMZ, CSV).
- Restricted file picker to `.gpx` and `.geojson`.
- Added clearer unsupported-format errors.

## v7.6.7

- Added sunrise and sunset times to the weather-strip meta section, tied to the selected start day.

## v7.6.8

- Fixed `nearestDurationKey is not defined`.

## v7.6.9

- Fixed `formatMinutesShort is not defined`.

## v8.0.0

- Added **Old model** and **Smart model** checkpoint modes with a toggle.
- Smart model: time-based checkpoints, max-distance gap logic, climb-aware ETA weighting, sunrise/sunset anchors, interpolated hourly weather, route-relative wind labels, event-style checkpoint promotion, and weather-window summaries.
- Added checkpoint markers on the forecast chart.
- Added elevation parsing from GPX and GeoJSON.

## v8.0.1

- Fixed `buildRouteWeatherHtml is not defined`; works with both checkpoint models.

## v8.0.2

- Fixed Flatpickr hover/focus styling in dark mode for manual time inputs.
- Set date picker weeks to start on Monday.

## v8.0.3

- Changed `.item-tag` to use the blue accent palette.

## v8.0.4

- Cleaned up credits and attributions; added CARTO to map attribution.
- Moved version number onto the app-name line.
- Rewrote activity-card bottom field note.

## v8.0.5

- Renamed `Race & endurance` to `Performance & multisport`.
- Reordered Outdoor & travel to Road trip, Camping, Casual.
- Reduced large bottom body padding.

## v8.0.6

- Changed Road trip label to **RT** and reordered Outdoor & travel to Casual, RT, Camping.

## v8.0.7

- Reduced visual clutter from Reset/Clear/Clear all buttons.
- Renamed actions: Reset section, Remove route, Reset guide, Reset step.
- Reordered top location-card actions.

## v8.0.8

- Changed **RT** back to **Road trip**.
- Activity Reset now clears activity, event preset, duration, race day mode, and custom distance/duration/average.
- Made custom distance/duration/average a 3-way calculator.
- Clicking a planned duration preset clears custom planner fields first.

## v8.0.9

- Moved Reset section to the top right of the planner card.
- Reordered 90 min after 60 min / 1 h; changed 1-hour tag to `60 min / 1 h`.

## v8.0.10

- Moved Reset guide inline with the clothing summary.

## v8.0.11

- Added dual minute/hour labels up to 3 hours: 60 min / 1 h, 90 min / 1.5 h, 120 min / 2 h, 180 min / 3 h.

## v8.0.12

- Shortened duration labels to `m` format with improved alignment styling.

## v8.0.13

- Reverted `m` back to `min`; replaced `/` with bullet separators in dual labels.

## v8.0.14

- Changed dual-format duration labels to two lines, with the hour equivalent on its own line.

## v8.0.15

- Reduced shared button label size to `0.8rem` to keep **Triathlon** on one line.

## v8.1.0

- Added **Best window** as a third start-time mode.
- Added Weather window finder panel: date, earliest/latest start, priority, step size, and advanced limits.
- Built top-3 best window results, clickable to load that time and refresh forecast and clothing logic.
- Added best-window timeline strip with highlighted windows and active recommendation marker.
- Best overall adapts to the selected activity; route-aware scoring uses the selected checkpoint model.

## v8.1.1

- Replaced best-window date/time fields with Flatpickr pickers (24-hour, Monday week start, forecast-range constrained).
- Switched general weather time formatting to 24-hour time.

## v8.1.2

- Put search start/end on the same desktop row; added day-of-week to result times.
- Improved timeline strip with graduated ticks, automatic spacing, 15-minute to 24-hour scale, and multi-day labels.
- Changed Flatpickr selectors to 5-minute increments.

## v8.1.3

- Added distinct colours for #1, #2, and #3 best windows.
- Fixed mobile timeline overflow.

## v8.1.4

- Made Forecast over the planned duration mobile-friendly with a horizontal scroll container.
- Reduced mobile forecast header, chart, forecast cells, and daily cells.
- Tightened lateral padding on mobile cards.

---

## v8.2.0

- Overhauled responsive/mobile CSS; fixed overflow risk for charts, daily cards, best-window strips, action rows, and route checkpoint cards.
- Removed unused/dead CSS, duplicate forecast/daily styles, and duplicate `raceRainbowShift` keyframes.
- Fixed chart checkpoint dot colour.

## v8.2.1

- Fixed Flatpickr next/previous month day colours and disabled-date visibility.
- Fixed month label overlap/hiding.

## v8.2.2

- Improved Flatpickr time picker height, padding, hour/minute input sizing, and AM/PM alignment.

## v8.2.3

- Changed activity setup grid to balanced `1fr / 1fr` layout.
- Added Refresh weather button in Location & route header.
- Added mobile safe-area top padding.

## v8.2.4

- Renamed water area to **Swimming & water**; added paddleboarding, surfing, kayak, snorkeling, and other water sports with matching presets and gear logic.
- Reworked Location & route into a Location / OR / Route upload layout.

## v9

- Added water-temperature fallback model using recent Open-Meteo weather, latitude bands, hemisphere-aware seasons, water body type, and wind exposure.
- Implemented source hierarchy: measured/fetched data → pseudo-estimate → unknown → manual override.
- Added confidence bars (high, medium, low, unknown, manual) and water body type, wind exposure, and pool type controls.
- Added outdoor/unheated pool handling.
- Improved location-search candidate prioritization.

## v9.1

- Moved Use current location under input on tablet while keeping Location / OR / Route structure.
- Merged Custom weather override into Water temperature & override.
- Added Indoor training group: gym, indoor running, indoor cycling.
- Added Trail & mountain group: hiking, trail running, MTB/gravel, ski/snowboard.
- Made main pick more itemized; clarified cold-water wording with explicit neoprene hood/gloves/booties.

## v9.2

- Reduced duplicate cold-water swim options; added distinct "shorten or postpone if under-equipped" option.
- Replaced duplicates with safety, exit, and buddy-plan checks.
- Replaced current-location text label with a location-arrow icon button.

## v9.2.1

- Added safety buoy/tow float as default open-water swim essential.
- Added triathlon training note: tow float for training, race rules may disallow it.

## v9.2.2

- Put current-location icon button inline with location input across layouts.
- Replaced send-arrow icon with target/crosshair icon.

## v9.2.3

- Added **Walk** under Outdoor & travel with presets (short, normal, long, big walk), clothing/gear logic, distance, and average-speed support.

## v9.2.4

- Added Fishing and Hunting section with presets and gear logic.
- Made indoor cycling explicitly include velodrome cycling.
- Split pool swimming into indoor pool and outdoor pool; outdoor pool defaults toward unheated water-temperature fallback.
- Renamed Stand-up paddle to Paddleboarding.

## v9.3

- Added Temperature preference slider: much warmer, warmer, normal, cooler, much cooler.
- Warmer/cooler preferences nudge clothing recommendations without changing real weather readings.
- Added preference chip when not Normal; applied across running, cycling, hiking, walking, casual, camping, and water-adjacent activities.

## v9.3.1

- Expanded slider to 9 stops: 4 warmer, normal, 4 cooler.
- Changed track to red → neutral → blue gradient; removed native progress fill.

## v9.3.2

- Set `.water-model-grid` to `align-items: start`.

## v9.4

- Replaced fixed `maxStops = 10` with dynamic road-trip itinerary cap (up to 24).
- Sampling preserves Start and Finish and spreads stops across the route.
- Added itinerary note showing the displayed stop count.

## v9.4.1

- Grouped Indoor pool swim with other indoor sports.
- Reorganized water into Outdoor swimming and Paddling & board sports.

## v9.4.2

- Allowed gym, indoor running, indoor cycling/velodrome, and indoor pool swim to work without a location.
- Shows an Indoor guide instead of weather card/forecast chart; switches back to weather-aware mode if a location is later added.

## v9.5

- Added Quick start button and helper overlay.
- Guide follows page order; steps jump to sections with temporary highlighting.
- Wording adapts to indoor activity, location/route state, water relevance, and results state.

## v9.5.1

- Fixed accidental animation replay when leaving Race day mode.

## v9.6

- Added Indoor multisport under Indoor training (works without location).
- Presets: Indoor brick, Indoor tri-style, Gym + cardio, Indoor event.
- Added guidance for sport-specific swaps, tri-style indoor kit, swim/bike/run bundle, transition bag, and mini transition checklist.

## v9.7

- Added Planned effort: Low/standing, Easy, Steady, Hard, Race.
- Low/easy nudges recommendations warmer; hard/race nudges lighter; does not change real forecast values.
- Added result chips when effort is not Steady.
- Added indoor effort logic for cooling or warm-up/between-effort layers.
- Added Planned effort to Quick start.

## v9.8

- Added custom multisport leg builder for Triathlon and Indoor multisport; legs influence checklist wording, water relevance, swim safety, and no-swim recommendations.
- Hid Weather checkpoint model unless a route is loaded.
- Made activity subsections collapsible; selected group stays open by default.
- Location & route auto-collapses after loading.
- Moved chart tooltip to body-level portal to avoid clipping.

## v9.8.1

- Fixed activity subsection headers to open/close correctly.
- Added Activity & parameters label at the top of the planner card.
- Grouped Planned effort and Temperature preference into Comfort adjustments.
- Added precipitation chance % beside amount in hourly forecast cards, chart tooltip, and legend.

## v9.8.2

- Activity subsection toggles now use delegated click/keyboard handling.
- Forecast chart tooltip bound directly to SVG hit zones while using a body-level portal.
- Added `CSS.escape` fallback for older embedded browsers/webviews.

## v9.8.3

- Fixed startup crash: moved accordion state declarations earlier so `renderPlannerState()` runs safely.

## v9.8.4

- Changed `.comfort-adjustments-grid` from two columns to one column; Planned effort and Temperature preference now stack vertically on all viewports.

## v9.8.5

- Moved `Reset section` into the Activity & parameters heading row.

## v9.8.6

- Weather strip precipitation now shows amount and chance, e.g. `Precip 0.0 mm · 35%`.

## v9.8.7

- Hid water fallback/source chip and warning note for non-water activities.
- Best window can show up to six options; top three use medal labels and gold/silver/bronze styling.
- Timeline bands now represent full activity duration.

## v9.8.8

- Condensed nearby best-window starts into distinct windows.
- Made timeline bands/markers clickable; selected option comes forward visually.
- Warns when the full activity extends past search end; bands use dashed border treatment.

## v9.8.9

- Best window keeps at least two options when enough candidates exist.
- Added adaptive timeline tick spacing with lighter minor ticks and midnight/date ticks for cross-day timelines.

## v9.8.10

- Best window targets three to six options when enough candidates exist.
- Added compact clustered good-start ranges limited to the densest 30-minute pocket.

## v9.8.11

- Added UV index from Open-Meteo hourly/daily data; displayed in weather strip, forecast cells, chart tooltip, route checkpoint cards, and checkpoint summary.
- Smart route checkpoints can mark peak UV; high UV affects Best-window scoring for outdoor activities.
- Added UV-aware sun protection clothing/gear logic.
- Added forecast-derived hazard panels for thunderstorms, wind/gusts, heavy precipitation, snow/mix, and high UV.

## v9.8.12

- Aligned UV categories with Canada/ECCC scale (0–2 Low, 3–5 Moderate, 6–7 High, 8–10 Very high, 11+ Extreme) with colour ramp: green, yellow, orange, red, purple.
- Canadian locations try official ECCC alerts through MSC GeoMet `weather-alerts`; falls back to forecast-derived warnings on failure.

## v9.8.13

- Simplified UV display in forecast cells to rating/category only.
- Removed redundant sun icon before UV badge.

## v9.8.14

- Forecast-cell UV now shows numeric value only, e.g. `UV 4.2`.
- Made forecast-cell secondary data more compact; labels moved into hover/title text.
- Feels-like temperature now appears on its own line.

---

## v9.8.15

- Strava import autofills sport, average pace/speed, and planned duration when the activity data supports it.

## v10.1.6

- Running activity custom duration now defaults to minutes instead of hours.

## v10.1.7

- Strava-loaded running activities use the same minutes duration default as manual running selection.

## v10.2

- Added a score explainer below Best Window result cards showing the main scoring tradeoffs.

## v10.3

- Sharpened route checkpoint callout copy.
- Added breathing room below the route weather slot inside the forecast result.

## v10.4

- Added collapsible subsections for duration, effort, temperature preference, and water controls.
- Moved Start time to the bottom of Activity & parameters.
- Planned effort promotes to Race when Race day mode is enabled.

## v10.5

- Fixed mobile Location & route action-button wrapping.
- Mirrors loaded route distance into the disabled custom-distance input.
- Moves and collapses Event / distance into the right planner column while a route is active.

## v10.6

- Added a forecast-only shortcut that collapses the planner for weather-only use.
- Hides route/Strava import options while that shortcut is active.
- Renamed the older checkpoint model to Standard.

## v10.7

- Added Open Graph and Twitter Card meta tags so shared links include a title, description, and image hint.

## v10.8

- Made forecast-only mode a real toggle with a single-column location layout.
- Removed leftover OR dividers in forecast-only mode.
- Surfaced water temperature in weather-only results.

## v10.9

- Hid water-temperature override controls in forecast-only mode; at-a-glance water signal in results remains visible.

## v11

- Hid the full water-settings section and Best window in forecast-only mode.
- Restored a visible water-temperature signal in forecast-only results.
- Removed the empty Clothing & gear panel from forecast-only output.

## v11.0.2

- Fixed: distance/event presets are now selectable while race day mode is active.

## v11.0.3

- Fixed: hourly humidity is now requested, mapped, and displayed in forecast cells and chart tooltips.
