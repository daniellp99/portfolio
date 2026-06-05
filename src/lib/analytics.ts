import { ErrorTrackingExtensions } from "posthog-js/dist/extension-bundles";
import posthog from "posthog-js/dist/module.slim";

export function initPostHog() {
  if (process.env.NODE_ENV !== "production") return;

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    defaults: "2026-01-30",
    capture_exceptions: true,
    autocapture: false,
    capture_pageview: false,
    capture_pageleave: false,
    capture_dead_clicks: false,
    disable_session_recording: true,
    disable_surveys: true,
    advanced_disable_flags: true,
    __extensionClasses: {
      ...ErrorTrackingExtensions,
    },
  });
}

export function capture(event: string, properties?: Record<string, unknown>) {
  posthog.capture(event, properties);
}
