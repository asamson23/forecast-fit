# Forecast Fit Roadmap

Planning and follow-up notes for future work.

## Constraints

- Keep app startup stable.
- Preserve existing user-facing behavior unless a change is intentional.
- Keep route upload/import and weather fetching reliable.
- Keep the frontend deployable as a static GitHub Pages build.
- Do not put provider secrets or tokens in frontend code.
- Avoid unrelated visual redesigns while doing UX cleanup.

## Now

### Launch And Entry Behavior

- Add a PWA shortcut to launch directly into `Forecast-only mode`.
- Add a PWA shortcut to launch directly into the `Strava` importer flow.
- Evaluate adding a PWA shortcut to launch directly into `Current location`.
- Define the expected startup behavior for each shortcut so the app opens in a clear, stable state without requiring extra taps.
- Evaluate whether PWA shortcuts should support more launch targets beyond the initial shortlist, based on the most common user entry flows.
- Define a general deep-link and startup routing model for the app, not just PWA shortcuts.
- Review whether URL params and deep links can be used more effectively for launch behavior, preselected modes, import entry points, and shareable app state.
- Decide which startup states should be supported through:
  - PWA shortcuts
  - URL params or query flags
  - saved last-session state
  - installable launcher entries
- Add an `entry intent` state layer so launches into forecast-only mode, provider import, current location, and future flows are handled consistently.
- Define fallback behavior when a launch target cannot complete immediately, such as:
  - geolocation permission denied
  - provider auth expired
  - required prior state missing
- Review which launch entry points should also exist in-app so browser users get the same convenience as installed PWA users.
- Add validation coverage for launch-entry behavior so useful entry points can be confirmed and edge cases are exercised.

### State And Provenance

- Add a data provenance layer in the UI so key values can be labeled as live, cached, estimated, imported, or manually derived.
- Define state persistence rules for reloads and repeat visits, including whether selected activity, presets, imported route, forecast mode, location, and dismissed warnings should persist.

### Provider Browser UX

- In the `Strava` and future `RideWithGPS` route or activity browser, evaluate showing a lightweight `SVG`-style miniature route trace preview for each item.
- Keep provider-browser preview traces focused on route shape only unless there is a strong reason to add more detail later.

### Diagnostics

- Add support for exporting a readable diagnostics file such as `JSON` or `XML` covering cache status, last weather fetch, route source, and provider auth or import state.

### Route Timing And Refresh Follow-Up

- Review timezone handling and forecast-time assumptions, especially when switching to later forecast dates or calculating route timing against forecast windows.
- Review error-state recovery across provider import, GPX parsing, route loading, and weather refresh so failures do not leave the UI half-updated or internally inconsistent.

### Manual Validation

- Manually re-check route elevation profile interactions:
  - hover point / hover line visibility
  - click-to-load route-point forecast in the weather strip
  - `Back to start` restoring the route-start weather context cleanly
- Run the baseline manual review pass after the recent forecast-only and route-refresh changes:
  - keyboard flow through location search, dialogs, route controls, and forecast interactions
  - warning dialog readability and dismissal behavior
  - forecast cells and warnings without relying on color alone
  - touch-target sizing for header, planner, and route actions
- Re-check forecast-only mobile layout at:
  - `699px`
  - `560px`
  - `380px`

## Later

### Performance And Caching

- Evaluate caching forecast, route-derived, and computed planner data in browser storage where it is safe and worthwhile.
- Identify which expensive calculations or fetch results can be reused to reduce recomputing and improve repeat-load responsiveness.
- Define cache invalidation rules so saved weather, route, and derived planning state do not become stale or misleading.
- Use different cache lifetimes by data type, for example:
  - weather data on a short time window such as a few hours
  - imported service routes on a longer-lived window
  - uploaded routes only if there is a clear, privacy-safe, storage-safe local strategy
- Decide how uploaded GPX or manually imported routes should be cached locally, if at all, without creating storage bloat or unclear stale-state behavior.

### Offline And Resilience

- Define an explicit offline or degraded-mode plan for the PWA.
- Decide which parts of the app should still work with cached route, cached planner state, or stale weather when fresh network data is unavailable.

### Sharing

- Evaluate sharing of route, weather, and selected activity state.
- Define which parts of planner state are safe and useful to share through a link versus local-only state.
- Explore whether share links should use URL params alone, compressed encoded state, or a lightweight backend-backed share token.
- For route sharing, define a graceful caching or storage strategy that avoids excessive bandwidth or host storage usage.
- For shared routes, prefer deduplication, compact geometry storage, or expiring share records if backend persistence is introduced.
- Define privacy and permission expectations for shared state, especially for imported provider routes or location-derived plans.

### Export

- Review export and share parity so a shared plan can also be evaluated for export as a printable view or `PDF`.

### Internationalization And Formatting

- Add support for `12-hour` time formatting as an option where time is displayed.
- Add translation support across the app, starting with `French (Canada)`.
- Define how localized labels, units, date/time formatting, and forecast text should be managed so future translations do not require ad hoc string edits.

## Research

### Water Temperature

- For water sports, if possible, show a forecasted water temperature line or range.
- Investigate whether water temperature can be estimated algorithmically from available forecast/provider inputs and current app parameters.
- In forecasted weather mode, when there is an air temperature forecast, also try to forecast water temperature if data or estimation is available.
- If water temperature is estimated rather than sourced directly, label it clearly as `estimated` and show a confidence band or range when possible.

### RideWithGPS

- Begin implementation planning for `RideWithGPS`.
- Define scope for:
  - provider auth flow
  - backend/API responsibilities
  - frontend import UX
  - normalization into `ImportedRoute`
- Add a parity checklist against the current `Strava` flow so the `RideWithGPS` implementation stays behaviorally consistent where appropriate.
- Review whether the current `Strava` implementation already exposes the right provider-agnostic seams before `RideWithGPS` support expands the integration surface.
- Identify shared provider interfaces, normalization helpers, and import-state handling that should be standardized before multiple providers are fully supported.
- Add test coverage targets for provider import normalization.

### Documentation

- Produce a UML diagram covering the app’s functions/modules and how they relate.
- Split the UML/documentation work into:
  - a high-level module diagram
  - a route/weather data flow diagram
  - a forecast mode state and interaction diagram

### Future Testing

- Add test coverage targets for:
  - cache invalidation
  - deep-link and launch-intent behavior
