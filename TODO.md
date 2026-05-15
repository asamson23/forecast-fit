# Forecast Fit TODO

Planning and follow-up notes for future work.

## Forecast Mode UX

- Show a confirmation/warning when switching to `Forecast mode` if the current setup has unsaved or customized state, similar to the existing `Clear all` warning flow.
- Add a dedicated `Forecast mode` summary banner so users can immediately see which controls are intentionally disabled in that mode.
- In forecast mode, remove the `Activity parameters` column.
- In forecast mode, let the planner parameters section expand to use the freed width.
- Rework the duration preset grid in forecast mode so all presets fit on a single line.
- In forecast-only mode, remove the sub-labels from the duration preset buttons.
- In forecast mode, remove:
  - custom duration
  - average speed parameters
  - comfort adjustments
- Preserve and restore hidden custom settings when leaving forecast mode instead of clearing them silently.
- Add an empty-state message for forecast mode when required inputs are missing so the simplified layout still explains why results are absent.

## Water Temperature

- For water sports, if possible, show a forecasted water temperature line or range.
- Investigate whether water temperature can be estimated algorithmically from available forecast/provider inputs and current app parameters.
- In forecasted weather mode, when there is an air temperature forecast, also try to forecast water temperature if data or estimation is available.
- If water temperature is estimated rather than sourced directly, label it clearly as `estimated` and show a confidence band or range when possible.

## Route And Weather Refresh

- Validate that loading a route from GPX triggers a forced weather refresh.
- Validate that loading a route from a service import triggers a forced weather refresh.
- Apply the same forced refresh behavior when switching the forecast to a later date.
- Add a visible `weather last refreshed` timestamp or status near the forecast panel.
- Add a lightweight loading state when route or date changes trigger a weather refresh so the UI does not feel stale or ambiguous.

## Ride With GPS

- Begin implementation planning for `RideWithGPS`.
- Define scope for:
  - provider auth flow
  - backend/API responsibilities
  - frontend import UX
  - normalization into `ImportedRoute`
- Add a parity checklist against the current `Strava` flow so the `RideWithGPS` implementation stays behaviorally consistent where appropriate.

## Documentation

- Produce a UML diagram covering the app’s functions/modules and how they relate.
- Split the UML/documentation work into:
  - a high-level module diagram
  - a route/weather data flow diagram
  - a forecast mode state and interaction diagram
