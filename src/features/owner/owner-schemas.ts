import { z } from "zod";

import { SKILL_ICON_KEYS } from "@/lib/icons/stack-icon-keys";

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

export type OwnerData = z.infer<typeof ownerDataSchema>;
