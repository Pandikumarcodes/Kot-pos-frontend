# Deployment

## Production artifact

The application is a Vite-built static single-page application.

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

`npm run build` runs `vite build` and writes the deployable output to `dist/`. `npm run preview` serves that artifact locally for inspection; it is not the production server.

`vite.config.ts` currently enables only the React and Tailwind CSS plugins. There is no custom output directory, asset base, development proxy, or chunk configuration.

## Environment configuration

Set `VITE_API_URL` at build time to the backend origin, without `/api/v1`:

```text
VITE_API_URL=https://api.example.com
```

Vite embeds `VITE_*` values in client assets. They are public and must not contain keys, passwords, tokens, or other secrets. Changing the backend URL requires a new build.

The authenticated REST client and Socket.IO client send credentials across origins. A separately deployed compatible backend must therefore allow the exact frontend origin and credentialed requests and must issue cookies suitable for the deployment topology. These are backend deployment requirements inferred from the client's `withCredentials` configuration; backend settings are not present here.

## Vercel configuration

The checked-in `vercel.json` rewrites every request path to `/index.html`. This is required so direct visits to routes such as `/chef/kot` or `/menu/:tableId` reach React Router instead of returning a static-host 404.

A Vercel deployment should use:

| Setting | Value |
| --- | --- |
| Install | `npm ci` |
| Build | `npm run build` |
| Output | `dist` |
| Environment | `VITE_API_URL` set for the target deployment |

The repository does not contain a committed Vercel project identifier or live frontend URL.

## Other static hosts

`dist/` can be served by another static host, but that host needs an equivalent SPA fallback to `index.html`. No Netlify configuration, Dockerfile, server-side rendering setup, or custom Node production server exists in this repository.

## PWA files

Vite copies `public/manifest.json`, `public/sw.js`, `public/offline.html`, and icons into the build. The service worker is registered after window load from `index.html`.

- `/` and `/offline.html` are precached.
- static assets are cached on first request;
- navigations use the network with an offline fallback;
- non-GET traffic and same-origin `/api/` traffic are not handled by the worker.

Because the configured backend is normally a separate origin, its API requests are also outside the service worker's same-origin fetch scope. Production POS actions remain network-dependent.

## CI versus deployment

The GitHub Actions workflow verifies lint, types, unit tests, build, and credentialed Playwright scenarios on `main`/`master` changes. It does not deploy the frontend. Deployment automation, preview promotion, rollback, and environment ownership are not defined in this repository.

## Release checklist

1. Set the target environment's public `VITE_API_URL`.
2. Confirm backend CORS, cookies, REST `/api/v1`, and Socket.IO are compatible with the frontend origin.
3. Run typecheck, lint, unit tests, and build.
4. Run Playwright against representative seeded data when credentials and backend access are available.
5. Preview `dist/` and verify direct navigation to protected and public dynamic routes.
6. Deploy `dist/` with SPA rewrites and HTTPS.
7. Verify login/session refresh, role redirects, branch isolation, realtime updates, QR order status, and service-worker behavior in the deployed environment.
