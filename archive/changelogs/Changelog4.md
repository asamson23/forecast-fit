# Forecast Fit — Comprehensive Changelog

This changelog covers the Forecast Fit versions created and revised in this conversation, starting from the uploaded baseline **v8.1.4** and continuing through **v9.8.2**.

## Versioning note

From **v9** onward, major/minor versions omit unnecessary trailing zeroes:

- `v9`, not `v9.0.0`
- `v9.1`, not `v9.1.0`
- Patch versions still use the full patch number, such as `v9.8.2`

---

## v8.1.4 — Uploaded baseline

Initial uploaded version used as the working file for this conversation.

### Baseline characteristics
- Single-file HTML/CSS/JS Forecast Fit tool.
- Weather-aware activity, clothing, and route planning.
- Location search and current-location support.
- GPX / GeoJSON route upload support.
- Weather checkpoint model.
- Start-time modes:
  - Now
  - Later
  - Best window
- Flatpickr date/time pickers.
- Leaflet route map.
- Activity presets for running, cycling, triathlon, swimming, camping, road trip, and casual use.
- Open-Meteo forecast and marine data integration.
- NOAA / ECCC marine reference support.
- Route checkpoint weather sampling.
- Race day mode.
- Manual water-temperature override.

---

## v8.2.0 — CSS overhaul and mobile cleanup

First cleanup pass focused on layout, mobile rendering, duplicate CSS, and obvious dead styles.

### CSS and layout
- Added a cleaner responsive/mobile CSS layer.
- Fixed mobile overflow risk around:
  - forecast charts
  - daily forecast cards
  - best-window strips
  - action rows
  - route checkpoint cards
- Improved general spacing, padding, and wrapping behaviour.
- Preserved the Strava/Zwift-inspired visual direction.

### Cleanup
- Removed obvious unused/dead styles:
  - old Claude / AI panel CSS
  - unused `.btn-row`
  - unused `.icon-row`
- Removed duplicate forecast table / daily forecast CSS conflicts.
- Removed duplicate `raceRainbowShift` keyframes.
- Fixed `var(--card)` in chart checkpoint dots to `var(--surface)`.

### Versioning
- Footer version updated from **v8.1.4** to **v8.2.0**.

---

## v8.2.1 — Flatpickr month/day visibility fixes

Focused on Flatpickr calendar readability.

### Flatpickr day colours
- `flatpickr-day.nextMonthDay` / `prevMonthDay` now use normal day text colours.
- `flatpickr-disabled` dates are now visible gray rather than appearing hidden.

### Flatpickr header
- Added explicit month/year header height and alignment.
- Fixed month label being hidden or overlapped by the weekday row.

### Versioning
- Footer version updated to **v8.2.1**.

---

## v8.2.2 — Flatpickr time picker spacing

Improved the time picker row at the bottom of the calendar.

### Flatpickr time picker
- Added more height and bottom padding to the time picker.
- Improved hour/minute input height and line-height.
- Improved AM/PM alignment.
- Kept the time separator visually aligned.

### Versioning
- Footer version updated to **v8.2.2**.

---

## v8.2.3 — Activity grid, labels, refresh weather, mobile safe area

Small UX patch for the activity setup and location/weather area.

### Activity layout
- Changed the activity setup grid to a balanced **1fr / 1fr** layout.
- Changed `.label` text size to **1em**.

### Weather refresh
- Added a **Refresh weather** button in the Location & route header.
- Refresh behaviour:
  - Uses already-resolved coordinates when available.
  - Falls back to route start when a route is loaded.
  - Falls back to typed city search when needed.

### Mobile layout
- Added more mobile top padding using `env(safe-area-inset-top)` so the title no longer hits the browser chrome.

### Versioning
- Footer version updated to **v8.2.3**.

---

## v8.2.4 — Water sports expansion and Location OR Route layout

Structural UI update for water activities and location/route selection.

### Activity icons
- Changed the triathlon icon to a single swimming emoji for consistency with one-emoji activity cards.

### Water activities
- Renamed the water area to **Swimming & water**.
- Added **Other water sports**:
  - Stand-up paddle
  - Surfing
  - Kayak
  - Snorkeling
  - Other water
- Added matching presets and basic gear logic for the new water activities.

### Location & route
- Reworked the section into a desktop side-by-side layout:
  - Location input
  - OR divider
  - Route file upload
- Mobile layout stacks cleanly with an OR divider.

### Versioning
- Footer version updated to **v8.2.4**.

---

## v9 — Global-ish water temperature fallback model

Major version bump because this added a new estimation model, new controls, new data inputs, and water-temperature fallback logic.

### Versioning policy
- Version displayed as **v9**, not `v9.0.0`.

### Water-temperature fallback model
- Added a pseudo water-temperature fallback model.
- Uses recent weather inputs via Open-Meteo `past_days=7`.
- Uses:
  - recent overnight lows
  - recent daytime highs
  - broad latitude bands
  - hemisphere-aware season handling
  - water body type
  - wind exposure
- Produces a conservative estimated range rather than fake-precise single-value output.

### Water-temperature source hierarchy
Implemented user-facing fallback flow:
1. Available measured/fetched water data when possible.
2. Pseudo-estimate fallback.
3. Unknown if not enough model inputs are available.
4. Manual override as an explicit user-entered fallback/override.

### Confidence display
- Added signal-strength style confidence bars.
- Confidence states:
  - high
  - medium
  - low
  - unknown
  - manual

### Water temperature controls
- Added controls for:
  - water body type
  - wind exposure
  - pool type

### Pool swimming
- Added outdoor/unheated pool handling for pool swimming.

### Location search
- Increased the number of location search candidates.
- Added prioritization for:
  - North America first
  - Western Europe second
  - other locations after that

### Versioning
- Footer version updated to **v9**.

---

## v9.1 — Water controls consolidation, indoor/trail/mountain activities, clearer recommendations

Large UI/content update around activity organization and water-temperature controls.

### Location layout
- In tablet layout, **Use current location** dropped under the location input while maintaining the two-column Location / OR / Route structure.

### Water temperature section
- Merged **Custom weather override** into the water-temperature section.
- Renamed the section to **Water temperature & override**.
- Added explainers for:
  - water body type
  - wind exposure
  - pool type

### New activity groups
Added broader sport coverage.

#### Indoor training
- Gym
- Indoor running
- Indoor cycling

#### Trail & mountain
- Hiking
- Trail running
- MTB / gravel
- Ski / snowboard

### Recommendation logic
- Added basic presets and recommendation logic for the new activity types.
- Improved indoor-specific guidance.

### Main pick output
- Made the main pick breakdown more itemized and checklist-like.
- Reworded unclear cold-water phrasing.
- Replaced vague labels like “Full Wetsuit + Cold-Water Accessories” with clearer wording such as:
  - full wetsuit
  - neoprene hood
  - neoprene gloves
  - neoprene booties

### Versioning
- Footer version updated to **v9.1**.

---

## v9.2 — Cold-water recommendation de-duplication and current-location icon

Patch focused on duplicated output and the current-location button.

### Cold-water recommendations
- Reworked repeated cold-water swim choices.
- Replaced near-duplicate wetsuit options with clearer alternatives.
- Added a distinct “shorten or postpone if under-equipped” option.

### Step 2 / checklist de-duplication
- Reduced repetition in section 2.
- Removed separate hood/gloves/booties repeats when those were already included in the main cold-water setup.
- Replaced duplicates with safety, exit, and buddy-plan checks.

### Cold-water examples
- Improved examples to focus on neoprene swim gear instead of unrelated cold-weather accessories.

### Current-location button
- Replaced the text label with a location-arrow-style icon button.

### Versioning
- Footer version updated to **v9.2**.

---

## v9.2.1 — OWS safety buoy / tow float

Quick open-water swim safety addition.

### Open-water swim safety
- Added **Safety buoy / tow float** as a default open-water swim essential.
- Changed the low-light duplicate into **Extra visibility / shore spotter plan**.

### Triathlon
- Added triathlon training note:
  - Safety buoy / tow float for training swims.
  - Race rules may not allow it.

### Versioning
- Footer version updated to **v9.2.1**.

---

## v9.2.2 — Current-location icon layout and icon swap

Small UI patch for the current-location button.

### Current-location button
- Put the current-location icon button back inline with the location input.
- Kept it inline in tablet/mobile layouts.
- Replaced the send-looking arrow with a target/crosshair location icon.

### Versioning
- Footer version updated to **v9.2.2**.

---

## v9.2.3 — Walk activity

Added walking as a first-class activity.

### New activity
- Added **Walk** under Outdoor & travel.

### Walk presets
- Short walk
- Normal walk
- Long walk
- Big walk

### Logic
- Added walking-specific clothing and gear logic.
- Added walking distance and average-speed input support.

### Versioning
- Footer version updated to **v9.2.3**.

---

## v9.2.4 — Hunting/fishing, pool split, velodrome, paddleboarding rename

Activity taxonomy and wording update.

### Hunting & fishing
Added a new section:
- Fishing
- Hunting

### Logic
- Added basic presets and gear logic for fishing and hunting.

### Indoor cycling
- Indoor cycling now explicitly includes **velodrome** cycling.

### Pool swimming
- Split pool swimming into:
  - Indoor pool swim
  - Outdoor pool swim
- Outdoor pool defaults more toward unheated/outdoor water-temperature fallback logic.

### Water sports wording
- Renamed **Stand-up paddle** to **Paddleboarding**.

### Versioning
- Footer version updated to **v9.2.4**.

---

## v9.3 — Temperature preference slider

Feature inspired by clothing guidance tools such as DressMyRun-style personal warmth preference.

### Temperature preference
- Added a **Temperature preference** slider.
- Initial options:
  - Much warmer
  - Warmer
  - Normal
  - Cooler
  - Much cooler

### Recommendation logic
- Warmer preference nudges recommendations toward more insulated/covered kit.
- Cooler preference nudges recommendations toward lighter kit.
- The slider does not change real weather readings or displayed temperatures.

### Output
- Added a preference chip in results when not set to Normal.

### Coverage
Applied to:
- running
- cycling
- MTB/gravel
- walking
- hiking
- casual
- camping
- water-adjacent recommendations
- other relevant outdoor activities

### Reset behaviour
- Reset section / Clear all returns preference to **Normal**.

### Versioning
- Footer version updated to **v9.3**.

---

## v9.3.1 — Car-style temperature slider redesign

Refined the temperature preference slider UI and scale.

### Slider scale
- Expanded to **9 total stops**:
  - 4 warmer
  - normal
  - 4 cooler

### Slider UI
- Changed slider track to a full **red → neutral → blue** gradient.
- Removed the native-looking progress fill inside the slider.
- Made the control feel more like a car temperature slider.

### Logic
- Updated labels, result chips, and internal offset logic for the expanded scale.

### Versioning
- Footer version updated to **v9.3.1**.

---

## v9.3.2 — Water model grid alignment

Small CSS alignment patch.

### CSS
- `.water-model-grid` now uses:
  - `align-items: start;`

### Versioning
- Footer version updated to **v9.3.2**.

---

## v9.4 — Dynamic road-trip itinerary cap and code comments

Road-trip itinerary behaviour and maintainability update.

### Road-trip itinerary rendering
- Replaced fixed `maxStops = 10` with a dynamic stop limit.
- Dynamic limits:
  - Short / normal routes: up to 10
  - Long routes: up to 14
  - Very long routes: up to 18
  - Extra-long / multi-day routes: up to 24

### Long-route behaviour
- Long and extra-long routes can show more itinerary stops/checkpoints.
- When trimming is still needed, the itinerary samples stops across the whole route instead of showing mostly the beginning.
- Start and Finish are preserved.

### Itinerary messaging
- Added a small itinerary note showing how many generated stops are displayed.

### Code clarity
- Renamed the internal logic to clearer names such as `maxRenderedRoadTripStops`.
- Added documentation comments around:
  - road-trip itinerary generation
  - route checkpoint models
  - water temperature fallback
  - temperature preference logic
  - custom distance/duration/average derivation
  - main render orchestration
  - initial event wiring

### Versioning
- Footer version updated to **v9.4**.

---

## v9.4.1 — Activity regrouping for indoor and water sports

Organization update for activity subsections.

### Indoor grouping
- Grouped **Indoor pool swim** with the other indoor sports.

### Water grouping
Reorganized water activities into clearer groups.

#### Outdoor swimming
- Open-water swim
- Outdoor pool swim
- Snorkeling

#### Paddling & board sports
- Paddleboarding
- Kayak
- Surfing
- Other water

### Code comments
- Added a small internal v9.4.1 note in the code comments.

### Versioning
- Footer version updated to **v9.4.1**.

---

## v9.4.2 — Indoor no-location mode

Allowed indoor-only activities to work without weather/location input.

### Indoor activity fallback
Indoor-only activities can now show recommendations without requiring a location:
- Gym
- Indoor running
- Indoor cycling / velodrome
- Indoor pool swim

### Output
- Shows an **Indoor guide** instead of a weather card or forecast chart.
- If a location is later added, the app switches back to normal weather-aware mode and adds commute/weather context.

### Wording
- Adjusted indoor and pool wording so it does not pretend fake weather is real.

### Comments
- Added code comments documenting the indoor no-location fallback.

### Versioning
- Footer version updated to **v9.4.2**.

---

## v9.5 — Quick start helper overlay

Added a user-facing helper overlay.

### Quick start button
- Added a **Quick start** button under the page title.
- Opens a helper overlay/modal.

### Guide order
The guide follows the actual page order:
1. Location & route
2. Activity
3. Event / distance
4. Planned duration
5. Temperature preference
6. Start time
7. Water temperature & override
8. Weather checkpoint model
9. Results

### Navigation
- Quick-start steps can be clicked to jump to the corresponding section.
- Added temporary section highlighting when jumping.

### Context-aware wording
The guide adapts labels based on current state:
- indoor activity selected
- location loaded
- route loaded
- water-temperature relevance
- results already shown

### Comments
- Added code comments documenting the helper overlay.

### Versioning
- Footer version updated to **v9.5**.

---

## v9.5.1 — Race day mode exit animation fix

Small animation bug fix.

### Race day mode
- Fixed accidental animation replay when leaving Race day mode.
- Planner card no longer replays its initial fade/slide animation when Race day mode is turned off.
- Race-party animation still works while Race day mode is active.

### Comments
- Added comments explaining the animation guard.

### Versioning
- Footer version updated to **v9.5.1**.

---

## v9.6 — Indoor multisport

Added indoor multisport as a first-class activity.

### New activity
- Added **Indoor multisport** under Indoor training.
- Works without location, like the other indoor activities.

### Presets
- Indoor brick
- Indoor tri-style
- Gym + cardio
- Indoor event

### Recommendations
Added indoor multisport-specific guidance:
- light base kit + sport-specific swaps
- tri-style indoor kit
- separate swim / bike / run kit bundle
- transition bag / separated compartments
- sport-specific shoes
- mini transition checklist

### Multisport builder discussion
- Identified that both triathlon and indoor multisport should eventually support manual sport selection.
- Deferred the full manual multisport builder to a later version.

### Versioning
- Footer version updated to **v9.6**.

---

## v9.7 — Planned effort

Added planned effort as a clothing logic input.

### New section
Added **Planned effort** with:
- Low / standing
- Easy
- Steady
- Hard
- Race

### Recommendation logic
- Low/easy nudges recommendations warmer.
- Hard/race nudges recommendations lighter.
- Effort does not change:
  - real forecast values
  - forecast charts
  - displayed temperatures

### Output
- Added result chips when effort is not Steady.

### Indoor guidance
- Added indoor-specific effort logic:
  - extra cooling for hard/race indoor sessions
  - warm-up/between-effort layer for low/easy indoor sessions

### Quick start
- Added Planned effort to the Quick start guide.

### Comments
- Added code comments explaining the Planned effort model.

### Versioning
- Footer version updated to **v9.7**.

---

## v9.8 — Custom multisport, collapsible activities, route-only checkpoint model, tooltip portal

Large feature and UI update.

### Custom multisport builder
Added custom multisport builder support for:
- Triathlon
- Indoor multisport

### Custom triathlon legs
Custom triathlon legs influence:
- checklist wording
- water-temperature relevance
- swim safety items
- no-swim multisport recommendations

### Custom indoor multisport blocks
Custom indoor blocks influence:
- indoor checklist
- packing / transition guidance
- fan logic
- pool logic
- run logic
- gym logic

### Weather checkpoint model visibility
- Weather checkpoint model section is now hidden unless a route is loaded.

### Activity subsections
- Activity subsections are now collapsible.
- Once an activity is selected, only its activity group stays open by default.

### Location & route
- Location & route auto-collapses after loading a location or route.
- Location & route header is forced into a one-line layout with horizontal overflow handling if needed.

### Forecast chart tooltip
- Attempted to move the chart tooltip to a viewport-positioned/body-level approach so it would not be clipped when hovering high in the chart.

### Versioning
- Footer version updated to **v9.8**.

---

## v9.8.1 — Activity toggle fix attempt, comfort grouping, precipitation chance, tooltip restoration attempt

Patch for issues noticed after v9.8.

### Activity subsection toggles
- Fixed activity subsection headers so they can open/close.
- Added click/interaction handling for collapsible sections.

### Layout
- `card-top-actions` stays aligned to `flex-end`.
- Added **Activity & parameters** label at the top of the planner card.

### Comfort controls
- Grouped:
  - Planned effort
  - Temperature preference
- New combined section: **Comfort adjustments**

### Forecast chart tooltip
- Attempted to restore forecast chart hover tooltip using a body-level tooltip portal so it would not clip.

### Precipitation chance
Added precipitation **chance %** alongside precipitation **amount mm** in:
- hourly forecast cards
- chart tooltip
- chart legend/header wording

### Versioning
- Footer version updated to **v9.8.1**.

---

## v9.8.2 — JS regression fix for activity toggles and chart tooltip

Regression fix after v9.8.1.

### Activity subsection toggles
- Activity subsection toggles now use delegated click/keyboard handling.
- Headers should reliably open/close.

### Forecast chart tooltip
- Forecast chart tooltip is bound directly to SVG hit zones again.
- Still uses a body-level tooltip portal to avoid clipping.

### Compatibility
- Added a small `CSS.escape` fallback for older embedded browsers/webviews.

### Versioning
- Footer version updated to **v9.8.2**.

---

# High-level evolution summary

Across this conversation, Forecast Fit evolved from a single-file weather/gear planner into a broader activity-aware planning tool with:

- Better mobile layout and responsive behaviour.
- Cleaner Flatpickr styling.
- More activity categories.
- Indoor no-location recommendation mode.
- Water temperature fallback estimation.
- Confidence bars and water-safety disclaimers.
- Outdoor pool and water-body handling.
- Safety buoy / tow float recommendations for OWS.
- Personal temperature preference.
- Planned effort influence.
- Custom multisport handling.
- Dynamic road-trip itinerary sizing.
- Route-aware weather checkpoints.
- Quick start helper overlay.
- Better code comments and maintainability improvements.
- Repeated passes on output de-duplication and clearer checklist-style recommendations.

# Validation notes

For each generated version, the extracted JavaScript was syntax-checked successfully.
