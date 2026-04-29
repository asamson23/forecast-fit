# Plan: Strava Integration for Forecast Fit

## Context

Add the ability to import saved Strava routes and past activities into the weather/forecast pipeline. The user picks from their Strava library instead of uploading a GPX file manually.

The app is a static frontend (GitHub Pages). Strava's OAuth 2.0 requires a client secret server-side, so a Vercel serverless backend handles the OAuth exchange and proxies all Strava API calls. The frontend stores the returned tokens in `localStorage` and calls the backend proxy for all Strava data.

---

## Architecture

```
GitHub Pages (frontend)          Vercel (backend)               Strava API
  src/features/strava/   ──────▶  api/strava/*.ts  ──────────▶  strava.com
  Connect button
  Route picker UI
  stravaAuth.ts (localStorage)
```

The existing route pipeline is reused without changes: Strava data normalises into `ImportedRoute` → `buildRouteStateModel` → weather fetch → forecast.

---

## Step 1 — Update `ImportedRoute` to the AGENTS.md canonical shape

**File**: `src/types/route.ts`

Current shape uses `points`, `distanceKm`, `hasTimeData`, `durationMinutes`. AGENTS.md specifies a richer shape. Migrate to:

```typescript
export interface ImportedRoute {
  provider: 'manual' | 'strava' | 'ridewithgps';
  providerRouteId?: string;
  name: string;
  distanceMeters?: number;
  elevationGainMeters?: number;
  estimatedMovingTimeSeconds?: number;
  hasRealTimestamps: boolean;
  geometry: RoutePoint[];   // was: points
  sourceUrl?: string;
}
```

**File**: `src/features/route/routeMetrics.ts` — update `buildImportedRoute` to produce the new shape:
- `geometry` ← points
- `distanceMeters` ← `calculateRouteDistanceKm(points) * 1000`
- `hasRealTimestamps` ← `timed.length > 1`
- `estimatedMovingTimeSeconds` ← duration in seconds
- `provider: 'manual'`

`buildImportedRoute` is exported but not called from `main.ts` (which uses `buildRouteStateModel` directly), so this is a safe migration. After the change, run `npm run typecheck` to catch any consumers of the old field names.

---

## Step 2 — Vercel backend (`api/` directory)

Create at repo root (Vite ignores this directory, Vercel auto-discovers it):

```
api/
  strava/
    auth.ts             ← sets CSRF cookie, redirects to Strava OAuth URL
    callback.ts         ← exchanges code for tokens, redirects to frontend with tokens in hash
    refresh.ts          ← POST {refresh_token} → returns new access_token
    routes.ts           ← proxy: GET /athlete/routes
    route-gpx.ts        ← proxy: GET /routes/:id/export_gpx (returns GPX text)
    activities.ts       ← proxy: GET /athlete/activities
    activity-streams.ts ← proxy: GET /activities/:id/streams?keys=latlng,altitude,time
```

All proxy handlers extract `Authorization: Bearer <token>` from the frontend request and forward it to Strava. The client secret never leaves the server.

**Token return strategy**: After `callback.ts` exchanges the code for tokens, it redirects to:
```
https://<FRONTEND_URL>#strava_access_token=...&strava_refresh_token=...&strava_expires_at=...&strava_athlete_name=...
```
The frontend reads the hash, stores tokens in `localStorage`, and cleans the URL with `history.replaceState`. This is acceptable for read-only activity data over HTTPS.

**CORS**: All `/api/strava/*` endpoints must set `Access-Control-Allow-Origin: <FRONTEND_URL>` (not `*`, because requests carry `Authorization` headers).

**Install**: `npm install --save-dev @vercel/node` for TS types. Vercel uses Node 18+ with native `fetch`.

---

## Step 3 — Environment variables

**`.env.example`** (commit this):
```
STRAVA_CLIENT_ID=
STRAVA_CLIENT_SECRET=
STRAVA_REDIRECT_URI=https://forecast-fit.vercel.app/api/strava/callback
FRONTEND_URL=https://yourusername.github.io/forecast-fit
VITE_STRAVA_BACKEND_URL=https://forecast-fit.vercel.app
```

Set all five in Vercel dashboard → Project Settings → Environment Variables.
Set `VITE_STRAVA_BACKEND_URL` in the GitHub Actions build step for the frontend.

**`vercel.json`** at repo root:
```json
{
  "version": 2,
  "headers": [
    {
      "source": "/api/strava/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "https://yourusername.github.io" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,POST,OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Authorization,Content-Type" }
      ]
    }
  ]
}
```

**`src/data/constants.ts`** — add:
```typescript
export const STRAVA_BACKEND_URL = import.meta.env.VITE_STRAVA_BACKEND_URL ?? 'https://forecast-fit.vercel.app';
```

---

## Step 4 — Frontend Strava modules (`src/features/strava/`)

### `stravaAuth.ts`
- `getStravaSession()` — reads `localStorage`, returns `{ accessToken, refreshToken, expiresAt, athleteName }` or `null`
- `saveStravaSession(session)` — writes to `localStorage`
- `clearStravaSession()` — removes all Strava keys from `localStorage`
- `getValidAccessToken(backendUrl)` — returns a fresh token, calling `/api/strava/refresh` if within 5 min of expiry
- `consumeStravaOAuthCallback()` — reads the URL hash on page load, extracts tokens, calls `saveStravaSession`, cleans the URL; returns `true` if tokens were found

### `stravaClient.ts`
Typed `fetch` calls to the backend proxy (never directly to strava.com):
- `fetchStravaRoutes(backendUrl)` → `StravaRoute[]`
- `fetchStravaRouteGpx(backendUrl, routeId)` → GPX string
- `fetchStravaActivities(backendUrl, page)` → `StravaActivity[]`
- `fetchStravaActivityStreams(backendUrl, activityId)` → `StravaStream[]`

Each calls `getValidAccessToken` first and passes it as `Authorization: Bearer <token>`.

### `stravaRouteAdapter.ts`
Converts Strava data to `ImportedRoute`:
- `stravaRouteGpxToImportedRoute(route, gpxText)` — calls existing `parseGpx(gpxText)` for geometry
- `stravaStreamsToImportedRoute(activity, streams)` — maps `[lat, lon]` + altitude + time streams to `RoutePoint[]`; guard against missing `latlng` stream (indoor activities)

### `StravaPickerPanel.ts`
Renders an inline collapsible panel (two tabs: Saved Routes / Recent Activities) using the app's existing CSS class conventions (`.card`, `.toggle-btn`, `.status-line`). On item selection:
1. Fetches GPX (for routes) or streams (for activities) from the backend
2. Calls `stravaRouteGpxToImportedRoute` or `stravaStreamsToImportedRoute`
3. Calls the provided `onSelect(importedRoute)` callback

---

## Step 5 — Wire into `main.ts` (~40 lines added)

**On page load** (after `registerServiceWorker()`):
```typescript
if (consumeStravaOAuthCallback()) renderStravaConnectionState();
```

**New functions** (following existing patterns):
- `renderStravaConnectionState()` — shows "Connect Strava" or "Connected: {name} | Import | Disconnect"
- `handleConnectStrava()` — `window.location.href = STRAVA_BACKEND_URL + '/api/strava/auth'`
- `handleDisconnectStrava()` — calls `clearStravaSession()`, re-renders
- `handleOpenStravaPicker()` — calls `openStravaPickerPanel`, wires `onSelect` to the same route-loading pipeline used by GPX upload (`buildRouteStateModel` → `fetchWeather`)

**In `bindDomActions()`**, add three new action branches:
```typescript
else if (action === 'connectStrava') handleConnectStrava();
else if (action === 'disconnectStrava') handleDisconnectStrava();
else if (action === 'openStravaPicker') handleOpenStravaPicker();
```

Note: `main.ts` has `// @ts-nocheck`, so use `importedRoute.geometry` (not `.points`) carefully — typecheck won't catch this inside `main.ts`.

---

## Step 6 — Update `index.html`

Add a third panel to the location-route-choice grid (after the existing Route file panel):

```html
<div class="location-choice-or" aria-hidden="true">OR</div>
<div class="location-choice-panel">
  <label class="sub-label">Strava</label>
  <div id="strava-connect-panel">
    <button class="btn btn-secondary" type="button" data-action="connectStrava">
      Connect Strava
    </button>
  </div>
  <p class="status-line compact" id="strava-status">
    Import a saved route or recent activity.
  </p>
</div>
```

`renderStravaConnectionState()` swaps the button content when authenticated.

---

## Step 7 — Strava app registration (one-time manual setup)

Before any code works, you need to register at [strava.com/settings/api](https://www.strava.com/settings/api):
- **Authorization Callback Domain**: `forecast-fit.vercel.app`
- Copy the **Client ID** and **Client Secret** into Vercel env vars

---

## Files to create

| File | Purpose |
|---|---|
| `api/strava/auth.ts` | OAuth redirect initiator |
| `api/strava/callback.ts` | Token exchange + redirect to frontend |
| `api/strava/refresh.ts` | Token refresh proxy |
| `api/strava/routes.ts` | Route list proxy |
| `api/strava/route-gpx.ts` | Route GPX proxy |
| `api/strava/activities.ts` | Activity list proxy |
| `api/strava/activity-streams.ts` | GPS stream proxy |
| `src/features/strava/stravaAuth.ts` | localStorage session management |
| `src/features/strava/stravaClient.ts` | Backend API calls |
| `src/features/strava/stravaRouteAdapter.ts` | Strava → `ImportedRoute` normaliser |
| `src/features/strava/StravaPickerPanel.ts` | Route/activity picker UI |
| `vercel.json` | Vercel deployment config |
| `.env.example` | Env var template |

## Files to modify

| File | Change |
|---|---|
| `src/types/route.ts` | Migrate `ImportedRoute` to AGENTS.md canonical shape |
| `src/features/route/routeMetrics.ts` | Update `buildImportedRoute` to produce new shape |
| `src/data/constants.ts` | Add `STRAVA_BACKEND_URL` |
| `src/main.ts` | ~40 lines: imports, callback on load, 3 handlers, `renderStravaConnectionState`, action branches |
| `index.html` | Third panel in route-choice grid |
| `vite.config.ts` | Add `base: process.env.VITE_BASE_PATH ?? '/'` |

---

## Verification

1. `npm run build` — must succeed with no errors
2. `npm run typecheck` — catches any stale `ImportedRoute` field references (`.points`, `.distanceKm`, `.hasTimeData`)
3. Manual checks (as per AGENTS.md):
   - App loads with no console errors
   - GPX file upload still works end-to-end (existing pipeline unchanged)
   - "Connect Strava" button appears in the Location & Route card
   - OAuth flow completes and tokens appear in `localStorage`
   - Route picker lists Strava routes/activities
   - Selecting a route loads it onto the map and triggers weather fetch
   - "Disconnect" clears tokens and resets the button
   - Token refresh works silently when `expires_at` is within 5 minutes
