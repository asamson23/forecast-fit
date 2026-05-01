# Forecast Fit

Forecast Fit is a weather-aware activity planner for choosing when to go, what to wear, and how conditions change across a route. It combines location search, route import, forecast sampling, clothing guidance, UV and air-quality context, marine and water data where relevant, and weather warnings in a single Vite + TypeScript app.

## Current Project State

- Frontend: Vite, TypeScript, vanilla DOM rendering, plain CSS, Leaflet, Flatpickr, JSZip
- Hosting target: static frontend deployment, including GitHub Pages
- Optional backend layer: Vercel serverless endpoints for Strava OAuth and Strava data proxying
- PWA support: manifest plus service worker for app-shell/static asset caching

## What The App Does

- Looks up locations with weather-aware planning focused on outdoor activities
- Supports current-location use, manual place search, and Strava route/activity import
- Imports GPX and GeoJSON routes and renders them on a Leaflet map
- Samples route checkpoint conditions instead of only showing a single point forecast
- Recommends clothing and gear based on activity, effort level, temperature preference, wind, and exposure
- Planned effort (Low/standing → Race) and a temperature preference slider nudge clothing picks without altering real forecast values
- Groups activities into: Outdoor & travel, Trail & mountain, Cycling, Swimming & water, Paddling & board sports, Indoor training, and Road trip
- Indoor activities (gym, indoor running, velodrome, indoor pool, indoor multisport) work without a location
- Custom multisport leg builder for Triathlon and Indoor multisport influences checklist wording, water relevance, and swim safety
- Shows best-window analysis with up to six ranked options (gold/silver/bronze top three) and a score explainer
- Includes UV index with hazard panels, air quality, marine data, and water-temperature context when relevant
- Shows Environment and Climate Change Canada alerts for Canadian locations via MSC GeoMet, with a forecast-derived fallback
- Includes a forecast-only mode that collapses the planner for weather-only use
- Quick start guide with contextual steps and temporary section highlighting
- Supports Strava import for saved routes and recent GPS activities through the backend/API layer

## Architecture

### Frontend

The main app lives in `src/` and is intentionally implemented with vanilla DOM rendering rather than a frontend framework. `index.html` preserves the app shell and visible version string. Feature logic is organized into TypeScript modules under `src/features`, `src/components`, `src/utils`, `src/app`, `src/data`, and `src/types`.

### Strava Integration

Strava is not called directly from `src/`. The frontend talks to Forecast Fit backend endpoints, and the backend handles OAuth redirects, token exchange, token refresh, and Strava API proxying under `api/strava/`.

This preserves the static frontend deployment model while keeping client secrets out of frontend code.

## Local Development

Install dependencies:

```sh
npm install
```

Start the Vite dev server:

```sh
npm run dev
```

Build the app:

```sh
npm run build
```

Validation commands used by this repo:

```sh
npm run typecheck
npm test
```

At the moment, `npm test` is a TypeScript validation pass rather than a separate test suite.

## Environment Variables

Frontend and Strava backend configuration use environment variables. See `.env.example`.

Relevant values include:

- `VITE_BASE_PATH` for Vite base-path control
- `VITE_STRAVA_BACKEND_URL` for pointing the frontend at the Strava backend
- `STRAVA_CLIENT_ID`
- `STRAVA_CLIENT_SECRET`
- `STRAVA_REDIRECT_URI`
- `FRONTEND_URL`

Do not commit real secrets or tokens.

## Deployment Notes

### GitHub Pages Frontend

The frontend remains deployable as a static Vite build. For a GitHub project page, build with a repository base path such as:

```sh
npm run build -- --base=/forecast-fit/
```

For a custom domain or root deployment, use `/`.

This repo also supports setting the base path through `VITE_BASE_PATH`.

### Strava Backend

The Strava integration expects a separate HTTPS backend deployment. In the current repo, that backend is implemented with Vercel serverless functions in `api/strava`.

If the frontend is hosted on GitHub Pages, point `VITE_STRAVA_BACKEND_URL` at the deployed backend origin.

## External Data Sources

The app currently uses external weather and mapping-related services including:

- Open-Meteo geocoding, forecast, marine, and air-quality APIs
- OpenStreetMap Nominatim search
- NOAA NDBC station/realtime data
- Environment and Climate Change Canada alerts
- Strava, through the backend layer only

## Constraints

- Do not move the frontend to React, Vue, or Svelte without explicit direction
- Do not add provider secrets or tokens to `src/`
- Do not add server-only code to frontend modules
- Keep the frontend compatible with static hosting

## Repo Validation Expectations

Before shipping code changes, the project instructions require:

- `npm run build`
- `npm run typecheck`
- `npm test`

And a manual smoke check for app load, location input, route upload, best-window rendering, forecast cells, and route map rendering.
