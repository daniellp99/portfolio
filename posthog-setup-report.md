<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js App Router portfolio site. PostHog is initialized via `src/instrumentation-client.ts` (the recommended pattern for Next.js 15.3+) with a reverse proxy configured in `next.config.js` so that events are routed through `/ingest` instead of directly to PostHog's servers — making them less likely to be blocked by ad blockers. Environment variables are set in `.env.local`. Error tracking (`capture_exceptions: true`) is also enabled globally.

Nine events were instrumented across eight files covering the main user interactions on the portfolio: viewing and navigating projects, toggling the theme, switching grid tabs, rearranging the layout, browsing the contributions calendar, clicking the GitHub profile link, and capturing global errors.

| Event                         | Description                                                       | File                                                                        |
| ----------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `project_card_clicked`        | User clicks a project card to navigate to the project detail page | `src/components/ProjectCardClient.tsx`                                      |
| `project_viewed`              | User lands on a project detail page (top of the portfolio funnel) | `src/components/PostHogProjectView.tsx` + `src/app/project/[slug]/page.tsx` |
| `back_to_home_clicked`        | User clicks the go-back button from a project page to return home | `src/components/GoBackButton.tsx`                                           |
| `theme_toggled`               | User toggles between light and dark themes                        | `src/components/ThemeToggle.tsx`                                            |
| `grid_tab_switched`           | User switches the main portfolio grid tab                         | `src/components/NavItems.tsx`                                               |
| `grid_layout_changed`         | User drags or resizes a grid item                                 | `src/components/GridResponsive.tsx`                                         |
| `contributions_month_changed` | User navigates to a different month on the contributions calendar | `src/components/contributions/parts/month-calendar.tsx`                     |
| `github_profile_link_clicked` | User clicks the external link to open the GitHub profile          | `src/components/contributions/parts/open-profile-link.tsx`                  |
| `global_error_encountered`    | An unhandled error is caught by the global error boundary         | `src/app/global-error.tsx`                                                  |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/66370/dashboard/1673629)
- [Project views over time](https://us.posthog.com/project/66370/insights/weIGY1GW)
- [Project card click → view funnel](https://us.posthog.com/project/66370/insights/AdkIEPlk)
- [Top projects by views](https://us.posthog.com/project/66370/insights/eogdzlg7)
- [GitHub profile link clicks](https://us.posthog.com/project/66370/insights/IIeq8okl)
- [Portfolio engagement events](https://us.posthog.com/project/66370/insights/quHvqc5z)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
