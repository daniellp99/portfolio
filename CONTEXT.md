# Domain context

Short glossary for architecture and import rules in this repo.

## Server content and owner data

- **Owner data** comes from `owner-data.yaml`, read by `readOwnerData` in `src/lib/content/owner.ts`. App routes and pages load it only through `src/lib/server/content-load.ts` and the cached getters in `src/lib/server/owner.ts` (`getOwnerData`, etc.).
- **Props-only rule:** Client Components (`"use client"`) must not fetch owner YAML or import **values** from `@/lib/server/*`. They receive owner-derived props from a parent Server Component (or call a **server action** that lives outside `@/lib/server`, e.g. under `src/lib/actions/`).

## Client / server import seam

- **`@/lib/server/*`** is for Next-facing loaders, cache tags, and server-only helpers. Client modules must not pull runtime code from there.
- **ESLint:** `boundary/no-server-value-imports-in-use-client` (see `eslint-plugins/client-server-boundary.mjs`) reports value imports from `@/lib/server/*` in files that start with the `"use client"` directive. `import type` from those paths is still allowed.
- **Server actions** that must be invoked from the client (e.g. persisting layout cookies) live under `src/lib/actions/` so they are not treated as `@/lib/server` imports.

## Content readers vs app entry

- **`src/lib/content/*`** holds read/parse logic. Direct imports of `@/lib/content/owner` and `@/lib/content/projects` are restricted outside the content modules and `content-load`; use the server stack instead.
- **`src/lib/server/content-load.ts`** is the single app seam for mapping I/O errors and calling readers; it uses `import "server-only"`.
