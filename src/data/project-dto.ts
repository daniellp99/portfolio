import "server-only";

import { reader } from "@/lib/reader";

export async function getProjectSlugsDTO() {
  const projects = await reader.collections.projects.list();

  return projects;
}
