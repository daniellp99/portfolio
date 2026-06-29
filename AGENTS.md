# Architecture

Feature-sliced Next.js 16 App Router. Domain code lives under `src/features/`.

## Features

| Folder                    | Domain                                      |
| ------------------------- | ------------------------------------------- |
| `features/owner/`         | Owner profile, branding, about/skills cards |
| `features/projects/`      | Project content, cards, detail page         |
| `features/home/`          | Main grid, layouts, tab switching, map      |
| `features/contributions/` | GitHub contribution calendar                |

## Layout

```
app/           — route composition only (Suspense, ViewTransition)
features/      — domain queries, actions, components
components/    — ui/ primitives + app-shell singletons
lib/           — content I/O, metadata, OG, schemas, utils
content/       — static MDX + owner data
```

## Rules

- Pages never fetch data directly; they compose feature components with `<Suspense>`.
- Pages stay synchronous; use `params.then()` for dynamic segments.
- Queries: `features/<domain>/<domain>-queries.ts` with `import 'server-only'` and `cache()`.
- Owner Zod schema: `features/owner/owner-schemas.ts` (kept separate from project schemas to avoid module init cycles).
- Actions: `features/<domain>/<domain>-actions.ts` with `'use server'` at top.
- Skeletons export alongside their component from the same file.
- Client components import actions directly; never import `*-queries.ts`.
- Raw `@/lib/content/*` imports only inside feature query files and tests.

See [CONTEXT.md](./CONTEXT.md) for domain-specific notes.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

**Keep this block, including in commits.** It is part of the project's agent setup, maintained by `next dev` for every agent that works here. If it appears as an uncommitted change, that is intentional — commit it as-is. Do not remove it to clean up a diff; it will be regenerated.

<!-- END:nextjs-agent-rules -->
