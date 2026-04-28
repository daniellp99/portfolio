import { z } from "zod";

const githubContributionDaySchema = z.object({
  date: z.string(),
  contributionCount: z.number().int().nonnegative(),
});

const githubContributionWeekSchema = z.object({
  contributionDays: z.array(githubContributionDaySchema),
});

const githubContributionCalendarSchema = z.object({
  totalContributions: z.number().int().nonnegative(),
  weeks: z.array(githubContributionWeekSchema),
});

export const githubContributionMonthResponseSchema = z.object({
  year: z.number().int(),
  month: z.number().int().min(1).max(12),
  calendar: githubContributionCalendarSchema,
  restrictedContributionsCount: z.number().int().nonnegative(),
});

export type GithubContributionCalendar = z.infer<
  typeof githubContributionCalendarSchema
>;
export type GithubContributionMonthResponse = z.infer<
  typeof githubContributionMonthResponseSchema
>;

export const githubContributionGraphqlResponseSchema = z.object({
  data: z
    .object({
      user: z
        .object({
          contributionsCollection: z.object({
            restrictedContributionsCount: z.number().int().nonnegative(),
            contributionCalendar: githubContributionCalendarSchema,
          }),
        })
        .nullable(),
    })
    .optional(),
  errors: z.array(z.object({ message: z.string().optional() })).optional(),
});
