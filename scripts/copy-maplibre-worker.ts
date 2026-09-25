/**
 * Vendors MapLibre GL worker + shared sibling into public/ for Next.js
 * (Turbopack/webpack do not emit the worker's relative import correctly).
 * Run via predev / prebuild.
 */
import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const dist = path.join(
  path.dirname(require.resolve("maplibre-gl/package.json")),
  "dist",
);
const dest = path.join(process.cwd(), "public", "maplibre");

mkdirSync(dest, { recursive: true });

for (const file of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"] as const) {
  copyFileSync(path.join(dist, file), path.join(dest, file));
}

console.log(`[maplibre] copied worker files → ${dest}`);
