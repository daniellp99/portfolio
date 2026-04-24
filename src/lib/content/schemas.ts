import { z } from "zod";

export const ownerDataSchema = z.object({
  name: z.string(),
  email: z.email(),
  journeyStartAt: z.iso.datetime(),
  githubUser: z.string(),
  aboutMe: z.string(),
  avatar: z.string(),
  avatarMarker: z.string(),
  avatarMarkerHover: z.string(),
  avatarMarkerTooltip: z.string(),
});

export type OwnerData = z.infer<typeof ownerDataSchema>;

export const projectLinkSchema = z.object({
  name: z.string(),
  url: z.url(),
});

export const projectImageSchema = z.object({
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

export type ProjectFrontMatter = z.infer<typeof projectFrontMatterSchema>;

export type ProjectDetails = ProjectFrontMatter & {
  slug: string;
  content: string;
};
