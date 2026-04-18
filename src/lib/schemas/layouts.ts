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

const LayoutsSchema = z.record(z.string(), z.array(LayoutSchema));

export const jsonToLayouts = jsonCodec(LayoutsSchema);
