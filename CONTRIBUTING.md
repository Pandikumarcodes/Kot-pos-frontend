# Contributing

## Development setup

1. Install Node.js 20 or newer and run `npm ci`.
2. Copy `.env.example` to `.env`.
3. Set `VITE_API_URL` to the backend origin without `/api/v1`.
4. Run `npm run dev`.

Do not commit `.env` files, credentials, Playwright authentication state,
generated reports, or build output.

## Quality checks

Before opening a pull request, run:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Run `npm run e2e` when a compatible seeded backend and all documented
`E2E_*` credentials are available.

## Pull requests

- Keep changes focused and preserve existing product behavior unless the
  change is explicitly approved.
- Add or update tests for changed logic.
- Update the README and changelog when configuration, scripts, architecture,
  or operational behavior changes.
- Describe security, accessibility, and migration implications where relevant.
