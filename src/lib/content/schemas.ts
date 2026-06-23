import { z } from "zod";

const projectLinkSchema = z.object({
  name: z.string(),
  url: z.url(),
});

const projectImageSchema = z.object({
  alt: z.string(),
  width: z.number().int(),
  height: z.number().int(),
  src: z.string(),
});

export const projectFrontMatterSchema = z.object({
  name: z.string(),
  description: z.string(),
  coverImage: z.string(),
  status: z.enum(["Active", "Development"]),
  images: z.array(projectImageSchema),
  links: z.array(projectLinkSchema),
});

export type ProjectDetails = z.infer<typeof projectFrontMatterSchema> & {
  slug: string;
  content: string;
};
