import * as z from "zod";

export const layoutItemSchema = z.object({
  i: z.string(),
  x: z.number(),
  y: z.number(),
  w: z.number(),
  h: z.number(),
  minW: z.number().optional(),
  maxW: z.number().optional(),
  minH: z.number().optional(),
  maxH: z.number().optional(),
  isResizable: z.boolean().optional(),
});

const LayoutsSchema = z.record(z.string(), z.array(layoutItemSchema));

export type DecodedLayouts = z.infer<typeof LayoutsSchema>;
