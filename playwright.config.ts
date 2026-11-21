import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PORT ?? 3000);
const baseURL = process.env.BASE_URL ?? `http://127.0.0.1:${port}`;

/**
 * Production `instant()` rig: prefetch runs under `next start`, and the
 * Instant Navigation testing API is exposed only when EXPOSE_TESTING_API=1
 * was set for `next build` (see next.config.js).
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `bun run start -- --port ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      ...process.env,
      EXPOSE_TESTING_API: "1",
      PORT: String(port),
      NEXT_PUBLIC_SITE_URL: baseURL,
      // Contributions card reads GITHUB_PAT; optional for this suite (error UI is fine).
      GITHUB_PAT: process.env.GITHUB_PAT ?? "",
    },
  },
});
