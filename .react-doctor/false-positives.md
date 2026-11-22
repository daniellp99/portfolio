# React Doctor false positives / waivers

## `react-doctor/server-auth-actions` on visitor cookie preference actions

**Outcome:** Waived with evidence (still visible in CLI; excluded from score / CI gate via `doctor.config.ts` surfaces).

**Locations:**

- `src/features/contributions/contributions-actions.ts` — `changeContributionsMonth`, `changeContributionsMonthFormAction`
- `src/features/home/home-actions.ts` — `setLayouts`, `switchMainGridTabFormAction`

**Predicates observed:**

1. This portfolio has no signed-in user product or auth SDK; visitors are anonymous by design.
2. Each action only mutates the **caller’s own** response cookies (month, active tab, grid layouts). There is no shared DB/file write for another user’s data.
3. Canonical rule guidance for `server-auth-actions` says to suppress **genuinely public actions** (contact form, newsletter, public search) and not to bolt on a no-op `auth()` call.
4. Inputs are schema-validated (`tabsTypeSchema`, `contributionsMonthIntentSchema`, layout cookie limits). `updateTag` for the current contributions month refreshes the owner’s public GitHub calendar cache only.

**Review / expiry:** Revisit if the site gains authenticated accounts, admin mutations, or non-cookie privileged side effects in these actions.
