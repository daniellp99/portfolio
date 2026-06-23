import type { OwnerData } from "@/features/owner/owner-schemas";
import type { ProjectDetails } from "./schemas";

/** Skill / partner logo row (matches owner YAML `skills` items). */
export type Logo = OwnerData["skills"][number];

/** Project card / grid summary (subset of persisted project content). */
export type Project = {
  slug: string;
  name: string;
  coverImage: string;
};

export type ProjectSlugs = string[];

export type Images = ProjectDetails["images"];
