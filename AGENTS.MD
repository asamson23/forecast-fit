# Forecast Fit coding instructions

## Project goal
Forecast Fit is a weather-aware activity, route, clothing, UV, and warning planner. Preserve existing user-facing behaviour unless explicitly asked to change it.

## Priorities
1. Do not break the app startup.
2. Keep UI behaviour stable.
3. Keep route upload and weather fetching working.
4. Prefer small, testable modules over giant files.
5. Avoid unrelated visual redesigns.

## Tech
- Vite
- TypeScript
- Vanilla DOM rendering for now
- Plain CSS
- Leaflet for maps
- Flatpickr for date/time controls
- JSZip if needed for existing import/export behaviour

## Do not do without explicit instruction
- Do not migrate to React/Svelte/Vue.
- Do not add a backend.
- Do not add Strava/RideWithGPS/Garmin/Komoot integration yet.
- Do not change the visual theme.
- Do not remove existing activities, presets, or route logic.

## Validation before finishing
Run:
- npm run build
- npm run typecheck if available
- npm test if available

Also manually check:
- app loads with no console errors
- location input works
- route upload works
- best-window panel renders
- forecast cells render correctly
- route map renders