import { z } from "zod";

const contributionsMonthCookieValueSchema = z
  .string()
  .regex(/^(\d{2})-(\d{4})$/, "Expected MM-YYYY")
  .transform((value) => {
    const [, mm, yyyy] = value.match(/^(\d{2})-(\d{4})$/)!;
    return { month: Number(mm), year: Number(yyyy) };
  })
  .pipe(
    z.object({
      month: z.number().int().min(1).max(12),
      year: z.number().int(),
    }),
  );

export const contributionsMonthCookieSchema =
  contributionsMonthCookieValueSchema;

export type ContributionsYearMonth = z.infer<
  typeof contributionsMonthCookieSchema
>;
