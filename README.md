# Forecast Fit

Forecast Fit is a weather-aware activity, route, clothing, UV, and warning planner.

The current app is a Vite + TypeScript frontend using vanilla DOM rendering, plain CSS, Leaflet, Flatpickr, and JSZip. It is intentionally still frontend-only: no backend or external route-provider OAuth flow is included yet.

## Local Development

Install dependencies:

```sh
npm install
```

Start the dev server:

```sh
npm run dev
```

Build for local/static hosting at `/`:

```sh
npm run build
```

Run validation:

```sh
npm run typecheck
npm test
```

## GitHub Pages

This repo includes a GitHub Pages workflow at `.github/workflows/deploy.yml`.

For the project-page URL, the workflow builds with:

```sh
npm run build -- --base=/forecast-fit/
```

For a custom domain, use Vite base `/` instead.

## Route Providers

Manual GPX/GeoJSON upload is supported in the frontend.

Future Strava or Ride with GPS support must use a separate backend/API layer. Do not put OAuth secrets, refresh tokens, access tokens, or provider API keys in `src/`.
