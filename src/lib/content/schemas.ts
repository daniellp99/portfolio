import { z } from "zod";

import { SKILL_ICON_KEYS } from "@/lib/icons/stack-icons.generated";

const logoSchema = z.object({
  key: z.enum(SKILL_ICON_KEYS),
  title: z.string(),
  href: z.url(),
});

export const ownerDataSchema = z.object({
  name: z.string(),
  email: z.email(),
  journeyStartAt: z.iso.datetime(),
  githubUser: z.string(),
  aboutMe: z.string(),
  avatarMarkerTooltip: z.string(),
  skills: z.array(logoSchema),
});

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
export type OwnerData = z.infer<typeof ownerDataSchema>;
