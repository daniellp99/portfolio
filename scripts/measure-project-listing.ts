import { createContentPaths } from "@/lib/content/paths";
import { PROJECT_LISTING_LOCAL_BUDGET_MS } from "@/lib/content/project-listing-budget";
import { readAllProjectSummaries } from "@/lib/content/projects";

async function main(): Promise<void> {
  const paths = createContentPaths();

  const t0 = performance.now();
  const summaries = await readAllProjectSummaries(paths);
  const elapsedMs = performance.now() - t0;

  console.log(
    `readAllProjectSummaries: ${summaries.length} summaries in ${elapsedMs.toFixed(1)} ms (cwd: ${paths.projectsDir})`,
  );
  console.log(`Local budget: ${PROJECT_LISTING_LOCAL_BUDGET_MS} ms`);
  if (elapsedMs <= PROJECT_LISTING_LOCAL_BUDGET_MS) {
    console.log("Within local budget.");
  } else {
    console.warn(
      "Over local budget — profile before changing the constant; candidate-7 work may be justified.",
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
