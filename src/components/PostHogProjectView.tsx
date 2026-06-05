"use client";

import posthog from "posthog-js";
import { useEffect } from "react";

export default function PostHogProjectView({
  slug,
  projectName,
}: {
  slug: string;
  projectName: string;
}) {
  useEffect(() => {
    posthog.capture("project_viewed", {
      project_slug: slug,
      project_name: projectName,
    });
  }, [slug, projectName]);

  return null;
}
