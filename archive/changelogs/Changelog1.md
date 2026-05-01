# CHANGELOG

All notable versions created in this conversation are listed here.

## `weather-clothing-advisor.html`
Original uploaded base file.  
[Open](sandbox:/mnt/data/weather-clothing-advisor.html)

### Notes
- Initial Claude-built version
- Browser-side AI dependency
- Foundation for all later revisions

---

## `weather-clothing-advisor-fixed.html`
First standalone repair pass.  
[Open](sandbox:/mnt/data/weather-clothing-advisor-fixed.html)

### Changes
- Removed fragile browser-side Anthropic dependency
- Switched clothing advice to local rule-based logic
- Fixed weather code handling
- Added first water-temperature lookup
- Improved autocomplete layering / z-index behavior

---

## `weather-clothing-advisor-duration.html`
Added duration-aware planning.  
[Open](sandbox:/mnt/data/weather-clothing-advisor-duration.html)

### Changes
- Added planned duration selector
- Expanded clothing suggestions
- Made recommendations depend more on outing length

---

## `weather-clothing-advisor-forecast-checklist.html`
Forecast + checklist phase.  
[Open](sandbox:/mnt/data/weather-clothing-advisor-forecast-checklist.html)

### Changes
- Added forecast tied to planned duration
- Added chart + horizontal forecast table
- Reworked clothing section into grouped sections
- Added checklist / radio-style interaction
- Added race clothing options
- Added winter wear logic

---

## `weather-clothing-advisor-todo-green.html`
Checklist restyle.  
[Open](sandbox:/mnt/data/weather-clothing-advisor-todo-green.html)

### Changes
- Replaced default checkboxes with custom green ones
- Clicking items crossed them out
- More todo-list / prep-list style presentation

---

## `weather-clothing-advisor-wizard.html`
Wizard-style rebuild.  
[Open](sandbox:/mnt/data/weather-clothing-advisor-wizard.html)

### Changes
- Simplified flow into wizard steps
- Added **Now / Later** start selection
- Restricted later date/time to forecast range
- Added sunrise / sunset day-vs-night logic
- Displayed feels-like temperature
- Kept water temperature / wave logic for swimming

---

## `weather-clothing-advisor-events.html`
Event and activity expansion.  
[Open](sandbox:/mnt/data/weather-clothing-advisor-events.html)

### Changes
- Added event / distance presets by activity
- Added more duration options
- Added multi-day support
- Split open-water swim vs pool swim
- Added camping
- Made triathlon its own activity
- Expanded base-layer logic
- Added daily forecast mode for multi-day outings

---

## `weather-clothing-advisor-route-override.html`
Route upload logic introduced.  
[Open](sandbox:/mnt/data/weather-clothing-advisor-route-override.html)

### Changes
- Added **Use current location**
- Made route upload optional
- Route distance overrides manual/preset distance
- Route duration overrides manual duration only if timing data exists
- Added / kept OSM route map
- Added sampled multi-checkpoint route weather
- Improved readability and contrast a bit

---

## `weather-clothing-advisor-route-checkpoints-interactive.html`
Route weather rendering + interaction fix.  
[Open](sandbox:/mnt/data/weather-clothing-advisor-route-checkpoints-interactive.html)

### Changes
- Actually rendered route checkpoint weather in results
- Route upload could auto-fetch from route start
- Removed redundant location check button
- Made clothing picks more interactive
- Clicked checklist items could be crossed out

---

## `weather-clothing-advisor-restyled.html`
Readability / theme cleanup.  
[Open](sandbox:/mnt/data/weather-clothing-advisor-restyled.html)

### Changes
- Cleaned checklist capitalization
- Improved dark-theme label readability
- Strengthened text hierarchy
- Improved card / button contrast and spacing
- General readability pass

---

## `weather-clothing-advisor-sober-custom.html`
Sober redesign + custom inputs.  
[Open](sandbox:/mnt/data/weather-clothing-advisor-sober-custom.html)

### Changes
- Made UI more sober / less gaudy
- Added custom distance
- Added custom duration
- Added average pace / speed input
- Added simple derivation logic for distance/duration when possible
- Disabled distance controls when route is loaded

### Known issues later fixed
- Missing helper functions caused JS errors

---

## `weather-clothing-advisor-sober-custom-fixed.html`
First bug-fix pass for the sober version.  
[Open](sandbox:/mnt/data/weather-clothing-advisor-sober-custom-fixed.html)

### Changes
- Fixed `getEventPresets is not defined`
- Fixed `routeHasDurationOverride is not defined`
- Enlarged distance / duration / pace inputs

---

## `weather-clothing-advisor-sober-custom-fixed-v2.html`
Selector and forecast refinement.  
[Open](sandbox:/mnt/data/weather-clothing-advisor-sober-custom-fixed-v2.html)

### Changes
- Custom distance now deselects preset distance
- Preset distance clears custom distance
- Finer short-event forecast slices
- Reworked later picker away from loose manual entry
- Avg pace / speed unit auto-switched by activity

---

## `weather-clothing-advisor-sober-custom-fixed-v3.html`
Bug fix + new duration presets.  
[Open](sandbox:/mnt/data/weather-clothing-advisor-sober-custom-fixed-v3.html)

### Changes
- Fixed `parseAnyTime is not defined`
- Added duration presets:
  - 90 min
  - 3 h
  - 6 h
  - 10 h
  - 18 h
- Made cards wider on desktop
- Added best-effort reverse geocode for current location

---

# Forecast Fit naming phase

## `forecast-fit-weather-gear-planner.html`
Rename to Forecast Fit + better charting.  
[Open](sandbox:/mnt/data/forecast-fit-weather-gear-planner.html)

### Changes
- Renamed tool to **Forecast Fit**
- Added chart-dot hover values
- 24 h events got a real chart
- Added sunrise / sunset markers
- Added precipitation chance line
- Added more inline code comments
- Added separate code notes file

---

## `forecast-fit-code-notes.md`
Supplementary code notes.  
[Open](sandbox:/mnt/data/forecast-fit-code-notes.md)

### Notes
- Manual tweak documentation
- Structure / behavior notes for later editing

---

## `forecast-fit-weather-gear-planner-v2.html`
Tooltip + picker + road trip pass.  
[Open](sandbox:/mnt/data/forecast-fit-weather-gear-planner-v2.html)

### Changes
- Added more inline code comments
- Switched chart values to HTML tooltip
- Made hover zone more permissive
- Added date/time to big weather card
- Added **Road trip** as an activity
- Replaced later dropdown with JS date/time picker

---

## `forecast-fit-weather-gear-planner-v3.html`
Chart hover bug fix.  
[Open](sandbox:/mnt/data/forecast-fit-weather-gear-planner-v3.html)

### Changes
- Fixed black hover rectangles covering chart
- Added proper floating tooltip CSS
- Fixed tooltip hide/show behavior
- Improved tooltip positioning and leave behavior

---

## `forecast-fit-weather-gear-planner-v4.html`
Later picker + clearer clothing wording.  
[Open](sandbox:/mnt/data/forecast-fit-weather-gear-planner-v4.html)

### Changes
- Fixed **Later** picker behavior
- Changed chart from precipitation % to precipitation in mm
- Made clothing wording clearer
- Added descriptions under clothing headers
- Added **Reset** per clothing section
- Added **Reset all**
- Moved **Use current location** onto same line as location input
- Made location placeholder more generic
- Improved current-location naming
- Kept **Road trip** activity

---

## `forecast-fit-weather-gear-planner-v5.html`
Route checkpoint map label cleanup.  
[Open](sandbox:/mnt/data/forecast-fit-weather-gear-planner-v5.html)

### Changes
- Changed route map marker labels from **CP** to **Checkpoint**
- Route markers now read:
  - **Start**
  - **Checkpoint 1, Checkpoint 2, ...**
  - **Finish**

---

# Progression Summary

## Phase 1 — Clothing advisor
- Standalone clothing/weather advisor
- Duration-aware logic
- Forecast integration
- Checklist experiments

## Phase 2 — Wizard / events
- Wizard-style flow
- Start time logic
- Daylight logic
- Event presets
- Triathlon / camping / pool swim / multi-day support

## Phase 3 — Route-aware planner
- Optional route upload
- Route distance / duration override behavior
- Route map
- Route checkpoint weather

## Phase 4 — UX cleanup
- Restyling
- Sober redesign
- Custom inputs
- Bug-fix passes
- Better pickers
- Better labels

## Phase 5 — Forecast Fit
- Tool renamed to **Forecast Fit**
- Better charts
- Tooltips
- More documentation
- Clearer route checkpoint naming

---

# Latest version

## Current file
[forecast-fit-weather-gear-planner-v5.html](sandbox:/mnt/data/forecast-fit-weather-gear-planner-v5.html)
