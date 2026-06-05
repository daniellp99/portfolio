"use client";

import { useEffect } from "react";

import { capture } from "@/lib/analytics";

export default function PostHogProjectView({
  slug,
  projectName,
}: {
  slug: string;
  projectName: string;
}) {
  useEffect(() => {
    capture("project_viewed", {
      project_slug: slug,
      project_name: projectName,
    });
  }, [slug, projectName]);

  return null;
}
