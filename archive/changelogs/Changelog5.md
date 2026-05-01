# Forecast Fit changelog — v9.8.2 to v9.8.14

This changelog covers the Forecast Fit versions discussed and produced in this conversation, starting from the uploaded broken `v9.8.2` file and ending with the latest generated `v9.8.14` build.

## Summary table

| Version | Main theme | Key outcome |
|---|---|---|
| v9.8.2 | Baseline / broken JS | Uploaded version had a startup crash that prevented core UI wiring, including the location input. |
| v9.8.3 | Startup crash fix | Fixed the `activityGroupsLastAutoSyncedActivity` initialization error so the app could load again. |
| v9.8.4 | Comfort layout | Stacked comfort adjustments vertically instead of side by side. |
| v9.8.5 | Activity section controls | Moved the Activity & parameters reset button into the section heading row. |
| v9.8.6 | Precipitation chance in weather strip | Added precipitation probability beside precipitation amount in the weather strip. |
| v9.8.7 | Water fallback cleanup + best-window medals | Hid water fallback UI for non-water activities; expanded best-window output and timeline styling. |
| v9.8.8 | Best-window condensation and active layering | Condensed redundant nearby windows and brought selected timeline items visually forward. |
| v9.8.9 | Minimum options and adaptive ticks | Ensured at least two best-window options when possible and added adaptive timeline tick marks. |
| v9.8.10 | Minimum three options + clustered start ranges | Raised target minimum to three options and showed compact viable start-time ranges. |
| v9.8.11 | UV index + forecast-derived warnings | Added UV data, UV-aware clothing logic, route UV markers, and hazard warning panels. |
| v9.8.12 | ECCC UV scale + official Canadian alerts | Aligned UV categories with Canada.ca/ECCC guidance and added ECCC alert lookup for Canadian locations. |
| v9.8.13 | Forecast-cell UV simplification | Kept forecast-cell data but simplified UV display to rating/category and removed redundant sun icon. |
| v9.8.14 | Forecast-cell compact data cleanup | Changed UV forecast-cell bubble to numeric `UV X`, moved labels into hovers, and split feels-like temperature onto its own line. |

---

## v9.8.2 — Uploaded baseline

### Status
- User-provided latest version at the start of this conversation.
- JavaScript was broken badly enough that the location input did not work.

### Observed console error
```text
Uncaught ReferenceError: Cannot access 'activityGroupsLastAutoSyncedActivity' before initialization
    at updateActivityGroupVisibility
    at renderPlannerState
```

### Root cause
- `renderPlannerState()` ran before the activity accordion state variable was initialized.
- Because that state used `let`, the script hit JavaScript’s temporal-dead-zone error.
- Once the script crashed, later event listeners and UI wiring did not run.

### Impact
- Location input appeared dead.
- Startup path was fragile.
- Any later code depending on initialized planner state was blocked.

---

## v9.8.3 — Startup crash fix

### Main goal
Restore basic JavaScript startup and location-input wiring.

### Changes
- Fixed the initialization crash around:
  - `activityGroupsLastAutoSyncedActivity`
  - `activityGroupToggleDelegationBound`
- Changed the problematic accordion state declarations so they are available before the early `renderPlannerState()` call.
- Added an explanatory comment around the initialization-order fix.
- Bumped the footer/version note to `v9.8.3`.

### Validation
- Extracted inline JavaScript passed `node --check`.
- A mocked-DOM startup test reproduced the original v9.8.2 crash.
- The same startup test no longer crashed in v9.8.3.

### Result
- App startup was restored.
- Location input wiring could run again.

---

## v9.8.4 — Comfort adjustments stacked vertically

### Main goal
Make the Comfort adjustments section easier to scan.

### Changes
- Changed `.comfort-adjustments-grid` from a two-column layout to a single-column layout globally.
- Planned effort and Temperature preference now appear one above the other on all viewport sizes.
- Bumped the footer/version note to `v9.8.4`.

### Validation
- JavaScript syntax check passed.

### Result
- Comfort controls are no longer side by side.
- The section reads more naturally, especially as the controls grow in complexity.

---

## v9.8.5 — Activity reset button moved into heading row

### Main goal
Improve visual alignment of the Activity & parameters reset control.

### Changes
- Moved the `Reset section` button into the Activity & parameters heading row area.
- On desktop, the reset button now sits at the same height as the section title.
- On narrower screens, it can wrap onto the line below the title.
- Bumped the footer/version note to `v9.8.5`.

### Validation
- JavaScript syntax check passed.

### Result
- The reset control feels attached to the Activity & parameters section instead of floating above it.

---

## v9.8.6 — Precipitation chance added to weather strip

### Main goal
Show precipitation probability beside precipitation amount in the main weather strip.

### Changes
- Updated weather-strip precipitation display to include both amount and chance.
- Example display:
```text
🌧 Precip 0.0 mm · 35%
```
- Bumped the footer/version note to `v9.8.6`.

### Validation
- JavaScript syntax check passed.

### Result
- Weather strip now communicates both “how much” and “how likely,” which is more useful for activity planning.

---

## v9.8.7 — Water fallback cleanup and best-window medal styling

### Main goals
- Remove irrelevant water-temperature fallback UI from activities that do not involve water.
- Improve the Best window output and timeline readability.

### Changes — water relevance
- Non-water activities no longer show the water fallback/source chip.
- Non-water activities no longer show the water fallback warning note.
- Existing water-relevant activities still retain water temperature/fallback behaviour.

### Changes — Best window
- Best window can now show up to six options.
- Top three windows use medal labels:
  - `🥇`
  - `🥈`
  - `🥉`
- Top three windows use gold, silver, and bronze styling.
- Options four to six are treated as runner-ups.
- Timeline bands now represent the full activity duration, not just the start-time marker.
- Timeline and card styling were updated to reflect the ranked options.

### Versioning
- Bumped footer/version note to `v9.8.7`.

### Validation
- JavaScript syntax check passed.

### Result
- Water warnings became activity-aware.
- Best window became more useful for comparing several viable start times.

---

## v9.8.8 — Best-window condensation, selected layering, and range overflow warnings

### Main goals
- Avoid redundant best-window options when several good starts are very close together.
- Make the selected option visually rise above overlapping timeline windows.
- Warn when a selected start time causes the activity to extend beyond the search range.

### Changes — best-window condensation
- Added logic to condense nearby starts into distinct windows.
- The app no longer forces redundant runner-up options when the starts are essentially the same opportunity.
- The target output became adaptive: roughly two to six meaningful windows, depending on how many distinct clusters exist.

### Changes — timeline interactivity
- Timeline bands and markers became clickable.
- Clicking a card or timeline item selects that option.
- The selected option is brought visually forward on the timeline with stronger stacking/emphasis.

### Changes — search-end handling
- Search end is treated as the latest allowed start by default.
- If the full activity duration goes past the search end, the option is flagged.
- Example warning:
```text
⚠ extends 45 min past search end
```
- Bands that extend past the search end use a dashed border treatment.

### Versioning
- Bumped footer/version note to `v9.8.8`.

### Validation
- JavaScript syntax check passed.

### Result
- Best-window results became less redundant and more honest about whether the whole activity fits in the selected search range.

---

## v9.8.9 — At least two options and adaptive timeline ticks

### Main goals
- Avoid showing only one best-window option when at least two valid options exist.
- Improve timeline readability with adaptive tick marks.
- Add date ticks when windows cross into another day.

### Changes — option count
- Best window now keeps at least two options when enough candidate start times exist.
- Behaviour:
```text
0 valid candidates → 0 options
1 valid candidate  → 1 option
2+ valid candidates → 2 to 6 options
```

### Changes — adaptive ticks
- Timeline tick spacing now adapts to total range length.
- Shorter ranges can show finer timing, such as:
  - 30-minute major ticks
  - 15-minute minor ticks
- Longer ranges progressively widen tick spacing to avoid clutter.
- Minor ticks are lighter and unlabeled.
- Major ticks are labeled.

### Changes — day boundaries
- If a timeline crosses into another day, the timeline adds a date tick at midnight.

### Versioning
- Bumped footer/version note to `v9.8.9`.

### Validation
- JavaScript syntax check passed.

### Result
- Timeline scale became more readable and context-aware.
- Best-window output avoided a one-option result when more valid alternatives existed.

---

## v9.8.10 — Minimum three options and clustered start-time ranges

### Main goals
- Show at least three best-window options when enough candidates exist.
- Communicate when several nearby starts are effectively part of the same good window.

### Changes — option count
- Best window now targets three to six options.
- Behaviour:
```text
0 valid candidates → 0 options
1 valid candidate  → 1 option
2 valid candidates → 2 options
3+ valid candidates → 3 to 6 options
```

### Changes — clustered start ranges
- Added compact start-time ranges for clustered nearby starts.
- Example display:
```text
⏱ good starts Sat 10:15–10:45 · 3 slots
```
- Start ranges are limited to the densest 30-minute pocket so they stay precise instead of vague.
- Timeline hover titles mention the good-start range.

### Versioning
- Bumped footer/version note to `v9.8.10`.

### Validation
- JavaScript syntax check passed.

### Result
- Best-window cards can show both the selected best start and the nearby range of equivalent starts.

---

## v9.8.11 — UV index and forecast-derived warning panels

### Main goals
- Add UV index as a first-class planning signal.
- Use UV to influence clothing/gear recommendations.
- Add warning panels based on forecast-derived hazards.

### Changes — UV data
- Added UV index from Open-Meteo hourly/daily data.
- UV is displayed in:
  - weather strip
  - forecast table/cells
  - chart tooltip
  - route checkpoint cards
  - route checkpoint summary

### Changes — smart route checkpoints
- Smart route checkpoint logic can now mark peak UV along a route.
- Peak UV checkpoint marker uses a sun-style indicator.

### Changes — Best window scoring
- High UV adds a penalty for outdoor activities.
- UV is treated as one factor among weather comfort, wind, precipitation, and activity type.

### Changes — clothing/gear logic
- Added Sun / UV protection recommendations when UV is moderate or high enough to matter.
- UV can influence suggestions such as sunscreen, sunglasses, cap/visor, UPF coverage, and sun-exposure caution.

### Changes — forecast-derived warnings
- Added warning panels for hazards inferred from the forecast, including:
  - thunderstorms
  - strong wind/gusts
  - heavy or high-risk precipitation
  - snow/mixed winter precipitation
  - high or very high UV
- Added route checkpoint warning panels when hazards appear along the route.

### Important limitation
- These warnings were forecast-derived and not yet official government alert-feed warnings.

### Versioning
- Bumped footer/version note to `v9.8.11`.

### Validation
- JavaScript syntax check passed.

### Result
- UV became a useful planning dimension for both routes and clothing.
- The app gained early hazard awareness even before official alert integration.

---

## v9.8.12 — Canada.ca UV scale and ECCC alerts for Canadian locations

### Main goals
- Align UV categories with Canada/ECCC guidance.
- Use official Environment Canada/ECCC alerts for Canadian locations where possible.
- Keep forecast-derived warnings for non-Canadian locations.

### Changes — UV scale
- UV logic was aligned to the Canada.ca/ECCC UV Index scale:
```text
0–2   Low
3–5   Moderate
6–7   High
8–10  Very high
11+   Extreme
```

### Changes — UV colour ramp
- Added weather-app-style UV colour classes:
```text
Low        → green
Moderate   → yellow
High       → orange
Very high  → red
Extreme    → purple
```

### Changes — official Canadian weather alerts
- Canadian locations/checkpoints now try to use official Environment Canada/ECCC alerts through MSC GeoMet’s `weather-alerts` collection.
- Non-Canadian locations continue using forecast-derived warning panels.
- If the ECCC lookup fails for a Canadian location, the app falls back to forecast-derived warnings and notes the fallback.

### Versioning
- Bumped footer/version note to `v9.8.12`.

### Validation
- JavaScript syntax check passed.

### Result
- UV messaging follows Canadian public guidance.
- Canadian weather warnings now prefer official ECCC alert data over purely forecast-derived panels.

---

## v9.8.13 — Forecast-cell UV display simplified

### Main goal
Reduce redundancy in forecast cells while keeping the existing weather data visible.

### Changes
- Forecast cells keep their existing data, including:
  - temperature
  - feels-like temperature
  - wind
  - precipitation amount/chance
  - UV
- UV display in forecast cells was simplified to rating/category only.
- Removed the extra sun icon before the UV badge because it was redundant once UV was shown directly.

### Example forecast-cell direction
```text
💨 12 km/h
🌧 0.0 mm · 20%
UV Moderate
```

### Versioning
- Bumped footer/version note to `v9.8.13`.

### Validation
- JavaScript syntax check passed.

### Result
- Forecast cells became cleaner without removing useful weather fields.

---

## v9.8.14 — Forecast-cell compact value display and hover labels

### Main goal
Make hourly/daily forecast cells cleaner and more compact while preserving meaning through hover labels.

### Changes — UV display
- Removed UV rating/category text from the visible forecast-cell UV bubble.
- Forecast-cell UV now shows numeric value only:
```text
UV 4.2
```
- Chart hover tooltip was also adjusted to show numeric UV:
```text
UV 4.2
```

### Changes — forecast-cell labels
- Forecast-cell secondary data was made more compact.
- Visible values now prioritize the data itself.
- Descriptive labels were moved into hover/title text.

### Example wind display
```text
12 km/h
```
Hover/title:
```text
Wind speed
```

### Example precipitation display
```text
0.0 mm · 20%
```
Hover/title:
```text
Precipitation amount / chance
```

### Changes — temperature layout
- Feels-like temperature now appears on its own line in forecast cells.

### Versioning
- Bumped footer/version note to `v9.8.14`.

### Validation
- JavaScript syntax check passed.

### Result
- Forecast cells are more compact and readable.
- Labels remain available through hover text instead of repeating in every cell.

---

## Cross-version themes

### Stability and startup safety
- v9.8.3 fixed a script-stopping initialization-order bug.
- Subsequent versions were syntax-checked after edits.

### Activity-aware UI
- Water fallback UI became conditional instead of appearing for unrelated activities.
- Comfort controls were reorganized for readability.
- Activity reset controls were moved closer to their section title.

### Best-window evolution
The Best window feature changed significantly across the conversation:

1. Show more than three options.
2. Use medals and gold/silver/bronze for the top three.
3. Show full activity-duration bands on the timeline.
4. Condense redundant nearby start times.
5. Bring the selected option forward visually.
6. Warn when an activity extends beyond the search range.
7. Use adaptive major/minor timeline ticks.
8. Add date ticks when crossing into another day.
9. Target three to six options when enough candidates exist.
10. Show compact viable start ranges for clustered starts.

### Weather detail improvements
- Precipitation chance was added beside precipitation amount.
- UV was added across current weather, forecast cells, chart tooltip, best-window scoring, route checkpoints, and clothing logic.
- UV categories were later aligned with Canada.ca/ECCC guidance.

### Warning system evolution
- v9.8.11 introduced forecast-derived hazard panels.
- v9.8.12 added official ECCC alert lookup for Canadian locations and checkpoints, with fallback warnings elsewhere.

---

## Notes for future versions

Potential next work items discussed after v9.8.14:

- Refactor the single-file prototype into a Vite + TypeScript project.
- Keep vanilla DOM rendering initially instead of jumping directly to React/Svelte/Vue.
- Split logic into modules:
  - weather
  - route parsing
  - best-window scoring/clustering
  - timeline ticks
  - gear recommendations
  - warnings/alerts
  - UV scale
- Keep GitHub Pages deployment static for the frontend.
- Add a separate backend/serverless layer for Strava and Ride with GPS OAuth.
- Normalize imported provider routes into a shared `ImportedRoute` shape.
- Keep Garmin Connect and Komoot as manual GPX-export/import workflows unless explicit API access becomes practical.
