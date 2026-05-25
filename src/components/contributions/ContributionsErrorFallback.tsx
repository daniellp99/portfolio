"use client";

import { AlertTriangleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function ContributionsErrorFallback({
  error,
  onRetry,
}: {
  error: Error;
  onRetry: () => void;
}) {
  const isProd = process.env.NODE_ENV === "production";

  return (
    <Empty className="gap-1 p-0 pt-2">
      <EmptyHeader className="gap-0">
        <EmptyMedia variant="icon">
          <AlertTriangleIcon />
        </EmptyMedia>
        <EmptyTitle>Couldn’t load data</EmptyTitle>
        <EmptyDescription>Please try again in a moment.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Retry
        </Button>
        {!isProd && (
          <details className="text-xs text-muted-foreground">
            <summary className="cursor-pointer select-none">
              Technical details
            </summary>
            <div className="mt-2 whitespace-pre-wrap">{error.message}</div>
          </details>
        )}
      </EmptyContent>
    </Empty>
  );
}
