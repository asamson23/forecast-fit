# Forecast Fit — Comprehensive changelog
## Versions covered in this conversation: `v7.6.1` → `v8.1.4`

---

## v7.6.1
### Baseline
- Latest uploaded baseline acknowledged and used as the starting point for subsequent changes.

---

## v7.6.2
### Clothing & gear card cleanup
- Flattened the clothing sections so they read more like sections than cards-inside-cards.
- Turned the choice and checklist items into grouped rows inside one container per section.
- Replaced the “Break down the main pick” mini-card stack with compact pill-style items.
- Softened borders, spacing, and emphasis so the visual hierarchy felt less busy.

---

## v7.6.3
### Manual weather override cleanup
- Removed the manual **air temperature** and **feels-like temperature** override fields.
- Kept only **manual water temperature** override support.
- Added a clickable `seatemperature.info` link in the override/status area so water temperature can be checked and entered manually when fetch data is unavailable.
- Updated the JS so manual override only affects water temperature.

---

## v7.6.4
### Sea temperature links styling
- Styled the sea temperature links so they no longer looked like plain unstyled text.
- Added both:
  - `seatemperature.info`
  - `seatemperature.org`
- Updated the dynamic status text so both links appear there as styled links as well.

---

## v7.6.5
### Footer version sync
- Updated the footer version number to match the file version: `v7.6.5`.

---

## v7.6.6
### Route file format restriction
- Removed support for non-route formats beyond GPX and GeoJSON.
- Removed support for formats such as:
  - `TCX`
  - `KML`
  - `KMZ`
  - `CSV`
  - and other non-GPX / non-GeoJSON route formats
- Restricted the file picker to:
  - `.gpx`
  - `.geojson`
- Updated the route parser to accept only those formats.
- Added clearer error messaging for unsupported route formats.

---

## v7.6.7
### Sunrise / sunset in weather strip
- Added **sunrise** and **sunset** times to the weather strip meta section.
- Made them show regardless of event length.
- Kept them tied to the selected start day.

---

## v7.6.8
### Missing helper fix — `nearestDurationKey`
- Fixed the error: `nearestDurationKey is not defined`
- Restored / added the missing `nearestDurationKey()` helper function.
- Kept the sunrise / sunset weather-strip addition in place.

---

## v7.6.9
### Missing helper fix — `formatMinutesShort`
- Fixed the error: `formatMinutesShort is not defined`
- Restored / added the missing `formatMinutesShort()` helper function.

---

## v8.0.0
### Smart checkpoint model + best route-weather logic overhaul
- Major route-weather upgrade introducing two checkpoint models:
  - **Old model**
  - **Smart model**
- Added an **Old model / Smart model** checkpoint toggle.
- Kept the old model as simple evenly spaced route-progress logic.
- Added a **smart checkpoint model** with:
  - time-based checkpoints
  - max-distance gap logic
  - climb-aware ETA weighting when elevation is available
  - daylight anchors for **sunrise / sunset**
  - interpolated hourly weather instead of nearest-hour snapping
  - route-relative wind labels such as **headwind / tailwind / crosswind**
  - event-style checkpoint promotion such as **Rain risk / Peak wind / Coldest**
  - short weather-window summaries around checkpoints
- Added checkpoint markers as a visual aid on the forecast chart.
- Added elevation parsing from both **GPX** and **GeoJSON** when present.

---

## v8.0.1
### Missing route renderer fix
- Fixed the error: `buildRouteWeatherHtml is not defined`
- Restored / added `buildRouteWeatherHtml()`
- Made it work with both:
  - old checkpoint model
  - smart checkpoint model
- Included smart-model extras in checkpoint cards when available:
  - reason labels
  - route-relative wind note
  - short checkpoint window summary

---

## v8.0.2
### Flatpickr dark mode + Monday week start
- Fixed Flatpickr manual time input hover / focus styling in dark mode so inputs no longer turned white-on-white.
- Added explicit styling for:
  - `.flatpickr-time input:hover`
  - `.flatpickr-time .flatpickr-am-pm:hover`
  - `.flatpickr-time input:focus`
  - `.flatpickr-time .flatpickr-am-pm:focus`
- Set the date picker to start weeks on **Monday**.

---

## v8.0.3
### Item tag styling
- Made `.item-tag` use an existing accent color instead of neutral styling.
- Used the existing **blue accent** palette so it stands out without introducing a new color.

---

## v8.0.4
### Credits / footer cleanup + clearer field note
- Cleaned up **Credits & attributions** to better match what the app is actually using.
- Added **CARTO** to the map attribution line.
- Clarified geocoding attribution to **Nominatim** and **Open-Meteo**.
- Clarified that Open-Meteo is used for both **forecast** and **marine** APIs.
- Moved the version number onto the same line as the app name.
- Rewrote the activity-card bottom field note to be shorter and clearer.

---

## v8.0.5
### Activity group rename + outdoor/travel reorder + padding fix
- Reduced the large bottom body padding.
- Renamed the running / cycling / triathlon group from:
  - `Race & endurance`
  to:
  - `Performance & multisport`
- Reordered the **Outdoor & travel** section to:
  - Road trip
  - Camping
  - Casual

---

## v8.0.6
### Outdoor/travel relabel
- Reordered the **Outdoor & travel** section to:
  - Casual
  - RT
  - Camping
- Changed the road trip label from **Road trip** to **RT**.

---

## v8.0.7
### Reset / clear button cleanup
- Reduced visual clutter from the many **Reset / Clear / Clear all** buttons.
- Improved the action hierarchy so:
  - **Collapse** became quieter
  - **Reset** actions became subtler
  - **Clear all** and **Remove route** stood out a bit more
- Renamed actions for clarity:
  - `Reset` → `Reset section`
  - `Clear route` → `Remove route`
  - wizard buttons → `Reset guide` / `Reset step`
- Reordered top location-card actions to feel cleaner.

---

## v8.0.8
### Planner logic improvements + revert RT label
- Changed the road-trip label back from **RT** to **Road trip**
- Made **Reset section** in the activity area reset the whole planner section, including:
  - activity
  - event preset
  - planned duration
  - race day mode
  - custom distance
  - custom duration
  - custom average
- Made the custom planner fields behave like a 3-way calculator:
  - custom **distance + duration** → calculates average
  - custom **distance + average** → calculates duration
  - custom **duration + average** → calculates distance
- Updated status text to reflect that logic more clearly.
- Clicking a **planned duration** button now clears the custom planner fields first so the preset takes over cleanly.

---

## v8.0.9
### Planned duration ordering + reset button placement
- Moved **Reset section** to the top right of the whole planner card.
- Kept **Race day mode** in the activity section controls.
- Reordered **Planned duration** so **90 min** comes after **60 min / 1 h**
- Changed the 1-hour tag to **60 min / 1 h**

---

## v8.0.10
### Reset guide placement cleanup
- Fixed **Reset section** so it sits at the top right of the planner card.
- Moved **Reset guide** to be inline with the clothing summary, before the guide sections.
- Kept **Reset step** inside each guide section.

---

## v8.0.11
### Dual duration labels up to 3 hours
- Updated planned duration labels to show both minutes and hours up to 3 hours:
  - `60 min / 1 h`
  - `90 min / 1.5 h`
  - `120 min / 2 h`
  - `180 min / 3 h`
- Kept longer presets as hours-only.

---

## v8.0.12
### Duration label shortening + alignment attempt
- Shortened the short-duration labels:
  - `30 m`
  - `60 m / 1 h`
  - `90 m / 1.5 h`
  - `120 m / 2 h`
  - `180 m / 3 h`
- Added duration-specific styling so the duration labels line up better in the full grid.
- Made the duration text use more consistent numeric alignment.

---

## v8.0.13
### Duration label revert + bullet separator
- Reverted `m` back to `min`
- Replaced `/` with a bullet in dual labels:
  - `60 min • 1 h`
  - `90 min • 1.5 h`
  - `120 min • 2 h`
  - `180 min • 3 h`

---

## v8.0.14
### Two-line duration labels
- Changed dual-format duration labels to a 2-line layout:
  - `60 min`
    `(1 h)`
  - `90 min`
    `(1.5 h)`
  - `120 min`
    `(2 h)`
  - `180 min`
    `(3 h)`
- Kept the hour equivalent on its own line.
- Updated duration label styling so those line breaks render properly.

---

## v8.0.15
### Button label size reduction
- Reduced the shared button label size to **0.8rem**
- Helped keep **Triathlon** on one line instead of wrapping the final `n`.

---

## v8.1.0
### Best weather window finder
- Added a third **Start time** mode:
  - **Now**
  - **Later**
  - **Best window**
- Added a **Weather window finder** panel with:
  - date
  - earliest start
  - latest start
  - priority preset
  - step size: **Auto / 15 / 30 min**
  - advanced limits:
    - max precip risk
    - max gust
    - min / max air temp
    - min water temp
    - finish before sunset
- Made **Best overall** adapt to the selected activity.
- Kept triathlon usable, but clarified in note text that it is more useful for training or self-directed sessions than fixed-start races.
- Built a **top 3 best windows** result set.
- Made each result clickable so it loads that time into the planner and refreshes:
  - forecast
  - route weather
  - clothing logic
- Added a visual **best-window timeline strip** with:
  - highlighted best windows
  - top-3 markers
  - active selected recommendation marker
- Made the finder use the current resolved outing duration, including:
  - preset duration
  - custom duration
  - derived duration from the custom planner fields
  - route timing when present in the route file
- Made route-aware scoring respect the selected **Old / Smart** checkpoint model when refining best-window picks.

---

## v8.1.1
### Best-window Flatpickr search range + 24-hour weather time
- Replaced the Best window search date + early/late time fields with **2 Flatpickr datetime boxes**:
  - **Search range start**
  - **Search range end**
- Made those pickers follow the same core rules as **Later**:
  - Flatpickr UI
  - 24-hour time
  - Monday as first day of week
  - same minute increment logic
  - constrained to the valid forecast range
- Switched the general weather time formatting to **24-hour time** in weather conditions and related summaries.

---

## v8.1.2
### Better Best-window range layout + richer timeline + 5-minute picker granularity
- Put the **Best window** search **start** and **end** fields on the same line on desktop.
- Changed best-window result times to include the **day of week**, like:
  - `Sat 10:15`
  - `Sun 12:00`
- Improved the **best window strip** with a real graduated timeline:
  - automatic tick spacing based on the searched range
  - scales from **15 minutes** up to **24 hours**
  - clearer tick labels for multi-day ranges
- Changed the Flatpickr selectors to use **5-minute increments**.

---

## v8.1.3
### Best-window rank colors + mobile weather-strip improvement
- Gave the **best window strip** distinct colors for:
  - **#1** best window
  - **#2** second-best window
  - **#3** third-best window
- Fixed the mobile timeline overflow issue by handling edge-positioned strip and tick labels more gracefully.
- Adjusted the mobile **current weather card** so the **weather icon stays inline** with the time / weather / feels block, with the meta details below.

---

## v8.1.4
### Mobile forecast section improvements
- Made **Forecast over the planned duration** more mobile-friendly.
- Wrapped the forecast chart / table area in a **horizontal scroll container** for narrow screens.
- Reduced the mobile size of:
  - forecast header text
  - chart height
  - forecast cells
  - daily forecast cells
- Tightened the **lateral padding** on mobile cards and forecast boxes.
- Kept desktop behavior unchanged.

---

# Summary of major milestones

## `v7.6.x`
- Cleanup, override simplification, route-format restriction, sunrise/sunset addition, and helper bug fixes.

## `v8.0.x`
- Major route-weather intelligence upgrade:
  - old vs smart checkpoint models
  - better route rendering
  - UI cleanup
  - duration label refinements
  - planner / reset logic improvements

## `v8.1.x`
- Best weather window finder:
  - search-range optimization
  - top-3 recommended windows
  - clickable results
  - richer timeline visualization
  - better desktop/mobile UX
  - 24-hour time consistency
