import { expect, test } from "@playwright/test";
import { instant } from "@next/playwright";

/**
 * Regression lock for home → project Partial Prefetching:
 * title + description must commit from the per-link prefetch without the
 * broad ProjectDetailSkeleton. Image grid may still show its Suspense
 * fallback (awaits `navigation()`).
 *
 * Requires a production build with EXPOSE_TESTING_API=1
 * (`bun run build:e2e` then `bun run test:e2e`).
 */
test.describe("home → project instant navigation", () => {
  test("DumpFun title and description are prefetched before click", async ({
    page,
  }) => {
    await page.goto("/");

    // Card chrome is a Base UI Button rendering <Link>; role is button, not link.
    const projectLink = page.locator('a[href="/project/dump-fun"]');
    await expect(projectLink).toBeVisible({ timeout: 15_000 });
    // Let viewport `prefetch={true}` finish before acquiring the lock.
    await page.waitForLoadState("networkidle");

    await instant(page, async () => {
      await projectLink.click();
      await page.waitForURL((url) => url.pathname === "/project/dump-fun");

      await expect(page.getByTestId("project-title")).toHaveText("DumpFun");
      await expect(page.getByTestId("project-description")).toContainText(
        "Launch your coin with clear rules",
      );
      // navigation()-deferred image grid may still be in its fallback.
      await expect(
        page.getByTestId("project-image-grid-skeleton"),
      ).toBeVisible();
    });

    await expect(page.getByTestId("project-title")).toHaveText("DumpFun");
  });
});
