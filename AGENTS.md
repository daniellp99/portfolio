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
- After making changes, run `bun run lint` and fix all errors.

See [CONTEXT.md](./CONTEXT.md) for domain-specific notes.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Ignore routine debugging and unverified changes. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Keep a qualifying candidate through the reporting pass even if you resolve or work around it. A successful fix changes the report outcome; it does not erase the friction that qualified it.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `node node_modules/next/dist/bin/next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->
