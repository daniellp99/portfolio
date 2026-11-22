import type { OwnerData } from "@/features/owner/owner-schemas";
import type { ProjectDetails } from "./schemas";

export type Logo = OwnerData["skills"][number];

export type Project = {
  slug: string;
  name: string;
  coverImage: string;
};

export type ProjectSlugs = string[];

export type Images = ProjectDetails["images"];
