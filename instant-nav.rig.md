# Instant navigation production rig

Production Playwright rig for Partial Prefetching `instant()` tests.

## Build and server

- **Build:** `bun run build:e2e` (`EXPOSE_TESTING_API=1 next build`)
- **Start:** Playwright `webServer` runs `bun run start` with `EXPOSE_TESTING_API=1`
- **Port / base URL:** `http://127.0.0.1:3000` (override with `PORT` / `BASE_URL`)
- **Testing API:** `experimental.exposeTestingApiInProductionBuild` when `EXPOSE_TESTING_API=1` (build-time)

## Test command

```bash
bun run build:e2e
bun run test:e2e
```

Suite: `e2e/home-to-project-instant.spec.ts`  
Helper: `instant()` from `@next/playwright` (same release line as `next`)

## Test context

- `public; no authentication`
- Source: `/` project card `<a href="/project/dump-fun">` (`prefetch={true}`; Base UI Button chrome, locate by `href`)
- Destination: `/project/dump-fun`
- Prefetch UI contract: `project-title`, `project-description`
- Navigation-only (may stay in Suspense under lock): `project-image-grid-skeleton` (`ImageGrid` awaits `navigation()`)

## Drift

none known

## Iteration loop

1. Edit route / Link / cache structure
2. `bun run build:e2e`
3. `bun run test:e2e`
4. Repeat
