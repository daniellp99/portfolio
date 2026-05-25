/**
 * Performance budget for the project listing path (`listProjectSlugs` +
 * `readAllProjectSummaries` against the real `src/content/projects` tree).
 *
 * Intended for local or preview measurement (`bun run measure:project-listing`).
 * Tune after you capture a baseline on your machine; CI does not gate on this by default.
 */
export const PROJECT_LISTING_LOCAL_BUDGET_MS = 75;
