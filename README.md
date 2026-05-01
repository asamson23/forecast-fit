# Forecast Fit

Forecast Fit is a weather-aware planner for activities, routes, clothing, UV exposure, air quality, water conditions, and official or forecast-derived warnings. It is built as a static Vite + TypeScript frontend with vanilla DOM rendering, with an optional backend layer for provider integrations such as Strava.

## Current Scope

- Outdoor, indoor, water, trail, travel, fishing, and hunting planning
- Location search, current location, route upload, and Strava import
- Route-aware checkpoint weather instead of only a single-point forecast
- Clothing and gear guidance that adapts to activity, effort, temperature preference, precipitation, wind, exposure, and water context
- Best-window analysis with ranked start-time options
- Forecast-only mode for users who only want weather, water, and warning context

## Main Features

- Location lookup with Open-Meteo geocoding plus current-location support
- GPX and GeoJSON route import with Leaflet route rendering
- Strava route and activity import through backend endpoints only
- Hourly and daily forecast rendering with route checkpoint sampling
- UV index, AQI, marine conditions, and water-temperature context where relevant
- Environment and Climate Change Canada alert support for Canadian locations, with fallback hazard generation when official lookup fails
- Indoor activities that can work without a location
- Quick start helper overlay and forecast-only shortcut
- Custom multisport leg builder for triathlon and indoor multisport

## Activities

The app currently groups activities into:

- Performance & multisport
- Indoor training
- Outdoor swimming
- Paddling & board sports
- Trail & mountain
- Hunting & fishing
- Outdoor & travel

Examples include running, cycling, triathlon, gym, indoor running, indoor cycling, indoor multisport, indoor and outdoor pool swimming, open-water swim, snorkeling, paddleboarding, kayaking, surfing, hiking, trail running, MTB/gravel, ski/snowboard, fishing, hunting, walking, casual use, road trip, and camping.

## Tech Stack

- Vite
- TypeScript
- Vanilla DOM rendering
- Plain CSS
- Leaflet
- Flatpickr
- JSZip

## Visual Assets

The current icon and asset stack includes:

- `@bybas/weather-icons` for weather-condition icons
- `country-flag-icons` for SVG country flags
- `fluentui-emoji` / Microsoft Fluent UI Emoji modern assets, with native system-emoji fallback, for selected non-weather SVG icon surfaces
- DM Sans and DM Mono from Google Fonts

## Architecture

### Frontend

The frontend lives in `src/` and remains framework-free by design. The app shell is in `index.html`, while the TypeScript code is split across:

- `src/components`
- `src/data`
- `src/features`
- `src/styles`
- `src/types`
- `src/utils`

### Backend / Provider Integrations

The frontend must stay deployable as a static GitHub Pages app. Provider integrations that need secrets or OAuth flows are handled server-side.

In the current repo, the backend layer lives under `api/` and is used for:

- Strava OAuth callback handling
- Strava token exchange and refresh
- Strava API proxying
- Backend-only provider calls that should not happen in the browser

Do not put provider secrets, tokens, or server-only logic in `src/`.

## Data Sources

The app currently uses:

- Open-Meteo geocoding, forecast, marine, and air-quality APIs
- OpenStreetMap / Nominatim
- NOAA NDBC
- Environment and Climate Change Canada resources
- CARTO basemaps with OpenStreetMap data
- Strava through Forecast Fit backend endpoints only

## Local Development

Install dependencies:

```sh
npm install
```

Start the dev server:

```sh
npm run dev
```

Build:

```sh
npm run build
```

Validation commands used by this repo:

```sh
npm run typecheck
npm test
```

At the moment, `npm test` is a TypeScript validation pass rather than a separate unit/integration test suite.

## Environment Variables

See `.env.example`.

Common values include:

- `VITE_BASE_PATH`
- `VITE_APP_BACKEND_URL`
- `VITE_STRAVA_BACKEND_URL`
- `STRAVA_CLIENT_ID`
- `STRAVA_CLIENT_SECRET`
- `STRAVA_REDIRECT_URI`
- `FRONTEND_URL`

Never commit real secrets.

Example split-domain production setup:

```env
VITE_BASE_PATH=/
VITE_APP_BACKEND_URL=https://forecast-fit.asamson.ca
VITE_STRAVA_BACKEND_URL=https://forecast-fit.asamson.ca
STRAVA_REDIRECT_URI=https://forecast-fit.asamson.ca/api/strava/callback
FRONTEND_URL=https://forecast-fit.asamson.ca
```

## Deployment

### Static Frontend

The frontend is intended to remain deployable as a static Vite build.

For a GitHub project page:

```sh
npm run build -- --base=/forecast-fit/
```

For a custom domain or root deployment, use `/`.

If the frontend is published at `https://forecast-fit.asamson.ca`, the Pages build should use:

```sh
npm run build -- --base=/
```

`VITE_BASE_PATH` can also be used to control the base path.

### Backend Layer

If Strava import or other secret-backed providers are enabled, deploy the backend/API layer separately over HTTPS and point the frontend at it with `VITE_APP_BACKEND_URL` or `VITE_STRAVA_BACKEND_URL`.

If the same custom domain serves both the static app and the Vercel backend routes, keep these values on the same host:

- `FRONTEND_URL=https://forecast-fit.asamson.ca`
- `VITE_APP_BACKEND_URL=https://forecast-fit.asamson.ca`
- `VITE_STRAVA_BACKEND_URL=https://forecast-fit.asamson.ca`
- `STRAVA_REDIRECT_URI=https://forecast-fit.asamson.ca/api/strava/callback`

The Strava app's Authorization Callback Domain must match the host used by `STRAVA_REDIRECT_URI`, in this case `forecast-fit.asamson.ca`.

## Constraints

- Do not migrate the frontend to React, Vue, or Svelte without explicit direction
- Do not add provider secrets or tokens to frontend code
- Do not add Node/server-only logic to frontend modules
- Keep the app compatible with static frontend hosting

## Validation Expectations

Before shipping code changes, run:

- `npm run build`
- `npm run typecheck`
- `npm test`

Manual smoke checks are also expected for:

- app load with no console errors
- location input
- route upload
- best-window panel rendering
- forecast cell rendering
- route map rendering
