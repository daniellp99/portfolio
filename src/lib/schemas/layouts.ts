import * as z from "zod";
import { jsonCodec } from "./json";

const LayoutSchema = z.object({
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

const LogicalLayoutsSchema = z
  .object({
    lg: z.array(LayoutSchema).optional(),
    sm: z.array(LayoutSchema).optional(),
    xs: z.array(LayoutSchema).optional(),
  })
  .strict();

export const jsonToLogicalLayouts = jsonCodec(LogicalLayoutsSchema);

export type DecodedLayoutsItem = z.infer<typeof LayoutSchema>;
export type DecodedLayouts = Record<string, DecodedLayoutsItem[]>;
export type LogicalLayouts = z.infer<typeof LogicalLayoutsSchema>;
