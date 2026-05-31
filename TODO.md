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

- Evaluate adding a PWA shortcut to launch directly into `Current location`.
- Evaluate whether PWA shortcuts should support more launch targets beyond the initial shortlist, based on the most common user entry flows.
- Review whether URL params and deep links can be used more effectively for launch behavior, preselected modes, import entry points, and shareable app state.
- Decide which startup states should be supported through:
  - PWA shortcuts
  - URL params or query flags
  - saved last-session state
  - installable launcher entries
- Extend fallback behavior for launch targets that cannot complete immediately, especially:
  - geolocation permission denied
  - provider auth expired
  - required prior state missing
- Review which launch entry points should also exist in-app so browser users get the same convenience as installed PWA users.
- Add validation coverage for launch-entry behavior so useful entry points can be confirmed and edge cases are exercised.

### State And Provenance

- Review whether warning-dismissal state should persist once warnings become individually dismissible in the UI.
- Review whether route persistence should keep the current storage-size guardrails or move to a more explicit user-controlled cache model.
- Thin out `src/main.ts` by moving cohesive function groups into smaller modules with clear, significant file names so route, weather, planner, rendering, and provider logic are easier to maintain independently.

### Provider Browser UX

- Keep provider-browser preview traces focused on route shape only unless there is a strong reason to add more detail later.
- Revisit whether future provider browsers such as `RideWithGPS` should use the same preview component and fallback behavior.



### Route Timing And Refresh Follow-Up

- [X] Review timezone handling and forecast-time assumptions, especially when switching to later forecast dates or calculating route timing against forecast windows.
- [X] Review error-state recovery across provider import, GPX parsing, route loading, and weather refresh so failures do not leave the UI half-updated or internally inconsistent.

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
- Review whether uploaded `GPX` / `GeoJSON` route-document caching should stay automatic or become a more explicit user-controlled cache policy.

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

- [X] For water sports, if possible, show a forecasted water temperature line or range.
- [X] Investigate whether water temperature can be estimated algorithmically from available forecast/provider inputs and current app parameters.
- [X] In forecasted weather mode, when there is an air temperature forecast, also try to forecast water temperature if data or estimation is available.
- [X] If water temperature is estimated rather than sourced directly, label it clearly as `estimated` and show a confidence band or range when possible.

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
