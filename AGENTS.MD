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

## Route provider integrations

Forecast Fit may support external route providers through a backend/API layer.

### Supported provider targets
- Strava
- Ride with GPS

### Security rules
- Do not put OAuth client secrets in frontend code.
- Do not put API keys, refresh tokens, or access tokens in `src/`.
- OAuth callbacks, token exchange, token refresh, and provider API calls must happen server-side.
- Frontend code may only call Forecast Fit’s own backend endpoints.
- Use environment variables/secrets for provider credentials.
- Add `.env.example`, but never commit real `.env` files.

### Provider architecture
Normalize all imported routes into the shared `ImportedRoute` shape.

```ts
export type ImportedRoute = {
  provider: "manual" | "strava" | "ridewithgps";
  providerRouteId?: string;
  name: string;
  distanceMeters?: number;
  elevationGainMeters?: number;
  estimatedMovingTimeSeconds?: number;
  hasRealTimestamps: boolean;
  geometry: RoutePoint[];
  sourceUrl?: string;
};
```

### Deployment

The frontend must remain deployable to GitHub Pages as a static Vite build.

Do not add server-only code to `src/`.
Do not depend on Node APIs in frontend modules.
OAuth providers such as Strava and Ride with GPS must use a separate backend/API layer.
The GitHub Pages frontend may call that backend over HTTPS.

For project-page deployment, Vite `base` must match the repository path, e.g. `/forecast-fit/`.
For custom-domain deployment, Vite `base` should be `/`.