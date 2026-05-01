# Forecast Fit — Comprehensive changelog for this conversation

This changelog summarizes every version referenced or produced in this conversation, in chronological order.

## Notes
- Versions listed here include:
  - files uploaded as a starting point or branch point
  - versions generated in-chat
  - regression-fix versions
- A few versions were later superseded or partially reverted. Those are marked where relevant.
- Descriptions below reflect the requested / implemented changes as recorded in the conversation.

---

## Uploaded baseline / branch points

### v4 — `forecast-fit-weather-gear-planner-v4.html`
**Status:** uploaded baseline used for the main patch branch.

**What it was**
- Original HTML tool used as the clean base for the later `v5+` branch.
- Included:
  - location search
  - GPX / GeoJSON route loading
  - route checkpoints
  - activity / event / duration presets
  - weather forecast charts
  - clothing wizard

---

### v6 (Claude branch) — `forecast-fit-v6.html`
**Status:** uploaded later as a separate branch from Claude; became the base for the later `v7+` branch.

**What it already contained**
- Broader location search via Open-Meteo + Nominatim
- Flatpickr styling work
- richer route checkpoint cards with place labels
- marine fallback logic using MET Norway on top of Open-Meteo Marine
- stronger camping and road-trip logic
- split result panels
- AI / Anthropic-related UI bits
- itinerary panel scaffolding

**Important caveat noted at the time**
- The Anthropic / Claude browser-side calls were not viable as implemented in a static HTML page and were later removed.

---

## Early rebuilt branch before switching back to v4

### v6 (rebuilt branch) — `forecast-fit-weather-gear-planner-v6.html`
**Status:** generated before switching back to the uploaded `v4`; effectively superseded once the real `v4` file was patched.

**What changed**
- Nice-to-have extras adapted more to outing length / distance
- “Race kit” wording clarified
- explicit “Race day” options added
- activity reset button added
- weather / clothing sections split
- custom duration accepted `HH:mm`
- sub-10-hour outings used half-hour forecast slices
- route checkpoint labels changed to `km XX`
- map labels changed to `Weather checkpoint X`

---

## Main `v4 -> v5.x` branch

### v5 — `forecast-fit-weather-gear-planner-v5.html`
**Status:** first direct patch made from the uploaded `v4` base.

**What changed**
- Nice-to-have extras adapted more based on distance
- clearer “Race kit” wording
- “Race day” event presets added
- activity reset button added
- result area split into separate weather / forecast and clothing / gear sections
- custom duration accepted `HH:mm`
- sub-10-hour outings switched to 30-minute forecast slices
- route checkpoint labels changed from `XX km` to `km XX`
- map labels changed from `CP X` to `Weather checkpoint X`

---

### v5.2 — `forecast-fit-weather-gear-planner-v5.2.html`
**Status:** refinement of `v5`.

**What changed**
- Improved panel text fitting / overflow handling
- location input broadened again for non-city searches
- broader search support for areas, addresses, landmarks, and postal codes
- forecast slice rules changed to:
  - 10-minute slices up to 4 hours
  - 30-minute slices from 6 hours to under 10 hours
- date/time picker styling adjusted
- route checkpoints scaled more aggressively with route distance
- checkpoint location name added under each checkpoint in the route weather section

---

### v5.3 — `forecast-fit-weather-gear-planner-v5.3.html`
**Status:** feature expansion on the `v5.x` branch.

**What changed**
- Added a best-effort marine fallback path
  - Open-Meteo Marine remained primary
  - MET Norway Oceanforecast used as fallback
  - marine-source indicator chip added
- Camping wizard expanded with:
  - overnight low awareness
  - sleeping bag comfort guidance
  - sleeping pad / ground insulation guidance
  - shelter / guy-line / condensation logic
  - clearer separation between camp clothing and sleep-system logic
- Road-trip wizard expanded with:
  - loaded-route checkpoint awareness
  - colder / wetter / windier stop logic
  - start vs finish temperature swing notes
  - better in-cabin vs staged-for-stops recommendations

---

## Main `v6 (Claude branch) -> v7.x` branch

### v7 — `forecast-fit-v7.html`
**Status:** first major patch from the uploaded Claude `v6` file.

**What changed**
- Removed non-working browser-side Anthropic / Claude logic
- rebuilt the itinerary panel to be fully client-side from route checkpoints + OSM / Nominatim
- marine fallback stack reworked toward:
  - Open-Meteo Marine
  - ECCC buoy pages as best-effort Canada fallback
  - NOAA NDBC as broader fallback
- Flatpickr made closer to device theme
- clothing suggestions gained example item hints

---

### v7.1 — `forecast-fit-v7.1.html`
**Status:** forecast / input / preset refinement.

**What changed**
- Forecast legend lines better matched chart styles
- added horizontal 0°C reference line on the weather chart
- location field wording changed back to **city-only**
- average pace / speed placeholder improved and made unit-aware
- custom distance added metres and yards where applicable
- Triathlon got **T100**
- Open-water swim changes:
  - removed “Race day”
  - added 5 km swim
  - added 10 km swim
- added a **custom weather override** block with manual air temp / feels-like / water temp inputs

---

### v7.2 — `forecast-fit-v7.2.html`
**Status:** logic / UX refinement.

**What changed**
- Custom weather override hidden behind a toggle
- weather icons kept as emojis but gained descriptive hover / accessibility text
- miles restored in custom distance
- replaced per-event race-day presets with a **global Race day mode**
- precipitation handling changed so clothing logic looks across the **whole planned activity window**
- more concrete clothing examples added

**Important logic change**
- Clothing suggestions no longer keyed only off start conditions; wet / cold / wind checks were expanded to the whole selected forecast window.

---

### v7.3 — `forecast-fit-v7.3.html`
**Status:** Race mode expansion.

**What changed**
- Race day mode button got rainbow / party styling
- Race day mode began genuinely changing clothing logic, not just adding a couple of checklist items
- Added more race-specific checklist items:
  - number bib / bib belt / pins / magnets
  - timing chip / watch setup
  - pre-race warm layers
  - post-race dry clothes
  - transition / race organization items
- Added weather-based glasses suggestions:
  - dark lenses for bright sun
  - photochromic / mid-tint for mixed light
  - clear / low-light lenses for gloomy / wet / dark starts
  - wraparound bias for cycling / triathlon

---

### v7.4 — `forecast-fit-v7.4.html`
**Status:** large UI / data / attribution batch.

**What changed**
- First location / route card became collapsible after a city or route was loaded
- custom-weather legend / helper content stayed within the toggle area
- chart hover aimed to include wind gusts + wind-direction cue
- route checkpoint map popups aimed to include quick weather details
- credits / attributions section added
  - third-party libraries
  - data sources
  - your name
  - ChatGPT / Claude attribution context
- route-format support expanded toward:
  - TCX
  - KML
  - CSV
  - KMZ

**What happened next**
- Follow-up fixes were needed because some of the hover / popup / route behavior did not actually render correctly yet.

---

### v7.5 — `forecast-fit-v7.5.html`
**Status:** correction pass on `v7.4`.

**What changed**
- chart hover actually rendered:
  - wind gusts
  - wind direction
- route checkpoint popups refreshed with weather data instead of staying stale
- removed theme color-scheme override that was interfering with colors
- attribution section moved out of card styling
- parser expansion kept for:
  - TCX
  - KML
  - CSV
  - KMZ

---

### v7.5.1 — `forecast-fit-v7.5.1.html`
**Status:** regression fix.

**What changed**
- Fixed checkpoint weather being wiped when the map redraw recreated the sampled checkpoint list
- checkpoint sampling began preserving enriched checkpoint weather / place / ETA data
- map rendering reused existing enriched checkpoints instead of recreating blank ones

---

### v7.5.2 — `forecast-fit-v7.5.2.html`
**Status:** small UX polish pass.

**What changed**
- Added default collapsed-summary placeholder:
  - `No location / route loaded`
- Race day button got stronger party styling:
  - faster rainbow animation
  - glow effect
  - pulse effect
  - active label changed to `Race day mode on ✨`

---

### v7.5.3 — `forecast-fit-v7.5.3.html`
**Status:** styling cleanup.

**What changed**
- Removed pulse animation from Race day button
- removed emoji from active Race day button label
- kept rainbow animation and glow

---

### v7.5.4 — `forecast-fit-v7.5.4.html`
**Status:** larger planner-structure change.

**What changed**
- Removed default activity
- Activity section reorganized into grouped subsections:
  - Race & endurance
  - Swimming
  - Outdoor & travel
- activity reset could fully clear the activity selection
- location section gained:
  - Reset
  - Clear all
- Race day mode gained subtle rainbow treatment on the whole planner card
- weather strip became richer:
  - wind direction
  - wind gusts
  - humidity
  - precipitation
  - water temp / wave height when available
- custom duration input got smarter examples
- if no activity selected, weather / forecast still displayed but clothing panel asked user to choose an activity

---

### v7.5.5 — `forecast-fit-v7.5.5.html`
**Status:** duration-default experiment.

**What changed**
- Removed default planned duration
- no duration button selected on load
- Clear all cleared duration too
- planner asked the user to choose a duration instead of silently assuming one
- Leaflet popups better matched device theme
- base map switched to theme-aware light / dark raster map

**What happened next**
- This introduced route / city-picker regressions because too much of the shared planner flow still assumed a duration profile existed.

---

### v7.5.6 — `forecast-fit-v7.5.6.html`
**Status:** first regression fix attempt.

**What changed**
- route sampling allowed route rendering even when no duration was selected
- checkpoint weather waited until a duration existed
- footer began showing explicit version number:
  - `v7.5.6`

**What happened next**
- The route / city-picker issue was still not fully resolved.

---

### v7.5.7 — `forecast-fit-v7.5.7.html`
**Status:** stabilization fix.

**What changed**
- restored a default planned duration of **1 hour**
- Clear all reset duration back to that default
- footer updated to **v7.5.7**

**Why it mattered**
- Restoring a sane default stabilized the shared render / planning path used by both city selection and route loading.

---

### v7.5.8 — `forecast-fit-v7.5.8.html`
**Status:** popup / math / pace refinement.

**What changed**
- Leaflet popup styling improved further for theme consistency
- popup readability improved, especially for location and ETA
- checkpoint markers changed to themed markers:
  - `S` for start
  - numbered middle checkpoints
  - `F` for finish
- when distance and duration are both known, planner shows derived average in average status
- cycling regained **min/km** pace option

---

### v7.5.8.1 — `forecast-fit-v7.5.8.1.html`
**Status:** popup layout compacting.

**What changed**
- `Weather checkpoint X` and `km XX` moved onto the same line
- weather condition and temperature / feels-like moved onto the same line
- wind speed / direction and gusts moved onto the same line
- popup rows tightened into a denser info-card layout

---

### v7.5.8.2 — `forecast-fit-v7.5.8.2.html`
**Status:** weather-strip readability pass.

**What changed**
- right-side weather-strip stats gained labels:
  - Humidity
  - Wind
  - Gusts
  - Precip
  - Water
  - Waves

---

### v7.6.0 — `forecast-fit-v7.6.0.html`
**Status:** visual redesign pass.

**What changed**
- overall palette / aesthetics shifted toward **Strava / Zwift-inspired** styling
- stronger orange primary accent
- cooler blue secondary accent
- cleaner training-platform feel in light theme
- darker navy / charcoal feel in dark theme
- cards, forecast blocks, wizard panels, buttons, and active states restyled accordingly
- Race mode party treatment intentionally kept
- footer updated to **v7.6.0**

---

### v7.6.1 — `forecast-fit-v7.6.1.html`
**Status:** visual cleanup.

**What changed**
- removed repeated gradient-top-line pseudo-element treatment from:
  - `.card`
  - `.result-panel`
  - `.forecast-box`
  - `.weather-strip`
  - `.wizard-step`
- cleaned up the “line poking past rounded corners” issue
- footer updated to **v7.6.1**

---

## Summary by theme

### Major functional milestones
- Custom duration accepted `HH:mm`
- Forecast window logic expanded to look across the full planned duration
- Global Race day mode added and later made behaviorally meaningful
- Marine fallback stack reworked multiple times
- Route file support expanded beyond GPX / GeoJSON
- Collapsible location / route card added
- Route checkpoints gained richer detail cards and map popups

### Major styling milestones
- Flatpickr brought closer to device theme
- Leaflet popup theming improved
- base map made theme-aware
- Strava / Zwift-inspired aesthetic pass added
- redundant gradient accent lines removed
- Race mode party styling preserved throughout later redesigns

### Major regression / recovery points
- `v7.5.5` removing default duration broke parts of the shared planner flow
- `v7.5.6` partially addressed that
- `v7.5.7` restored a 1-hour default and stabilized city picker + route loading again

---

## Latest version in this conversation
**Current latest version mentioned:** `v7.6.1`
