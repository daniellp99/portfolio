"use client";

import { CircleAlertIcon, RefreshCwIcon } from "lucide-react";
import { Geist, Geist_Mono } from "next/font/google";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { capture } from "@/lib/analytics";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const THEME_STORAGE_KEY = "theme";

function resolveDocumentTheme(): boolean {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "dark") return true;
    if (stored === "light") return false;
  } catch {
    /* ignore */
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const themeClassName =
    typeof window !== "undefined" && resolveDocumentTheme() ? "dark" : "";

  useEffect(() => {
    console.error(error);
    capture("global_error_encountered", {
      error_message: error.message,
      error_digest: error.digest,
    });
  }, [error]);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} ${themeClassName}`}
    >
      <body>
        <section className="flex min-h-screen items-center justify-center p-6">
          <Empty className="max-w-md border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CircleAlertIcon />
              </EmptyMedia>
              <EmptyTitle>Something went wrong</EmptyTitle>
              <EmptyDescription>
                An unexpected error occurred. You can try again, or refresh the
                page if the problem continues.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button type="button" onClick={() => unstable_retry()}>
                <RefreshCwIcon data-icon="inline-start" />
                Try again
              </Button>
            </EmptyContent>
          </Empty>
        </section>
      </body>
    </html>
  );
}
