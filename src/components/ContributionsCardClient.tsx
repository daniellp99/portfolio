"use client";

import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  getMonth,
  getYear,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { AlertTriangleIcon, ArrowUpRightIcon } from "lucide-react";
import {
  Component,
  ReactNode,
  Suspense,
  use,
  useOptimistic,
  useState,
  useTransition,
  ViewTransition,
} from "react";
import { flattenError } from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  githubContributionMonthResponseSchema,
  type GithubContributionMonthResponse,
} from "@/lib/schemas/github-contributions";
import { cn } from "@/lib/utils";

type FetchErrorResponse = { error?: string; details?: string };

function intensityBucket(count: number, max: number) {
  if (count <= 0 || max <= 0) return 0;
  const ratio = count / max;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

function bucketClass(bucket: number) {
  switch (bucket) {
    case 0:
      return "bg-foreground/5";
    case 1:
      return "bg-foreground/20";
    case 2:
      return "bg-foreground/40";
    case 3:
      return "bg-foreground/60";
    default:
      return "bg-foreground/80";
  }
}

function formatTooltip(date: string, count: number) {
  const day = parseISO(date);
  const formatted = formatInTimeZone(day, TZ, "MMM d, yyyy");
  return `${count} contribution${count === 1 ? "" : "s"} on ${formatted}`;
}

class ErrorBoundary extends Component<
  {
    fallback: (args: { error: Error; reset: () => void }) => ReactNode;
    children: ReactNode;
    resetKey?: string | number;
  },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidUpdate(prevProps: Readonly<{ resetKey?: string | number }>) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error)
      return this.props.fallback({
        error: this.state.error,
        reset: () => this.setState({ error: null }),
      });
    return this.props.children;
  }
}

const contributionPromiseCache = new Map<
  string,
  Promise<GithubContributionMonthResponse>
>();

function keyFor(year: number, month: number) {
  return `${year}-${month}`;
}

function getContributionsPromise(year: number, month: number) {
  const key = keyFor(year, month);
  const existing = contributionPromiseCache.get(key);
  if (existing) return existing;

  const promise = fetch(
    `/api/github/contributions?year=${year}&month=${month}`,
    {
      cache: "no-store",
    },
  ).then(async (res) => {
    const json = (await res.json()) as unknown;
    if (!res.ok) {
      const maybeError = json as FetchErrorResponse;
      const message =
        maybeError?.details ||
        maybeError?.error ||
        "Failed to load contributions.";
      throw new Error(String(message));
    }

    const parsed = githubContributionMonthResponseSchema.safeParse(json);
    if (!parsed.success) {
      throw new Error(
        `Invalid contributions response: ${flattenError(parsed.error)}`,
      );
    }

    return parsed.data;
  });

  contributionPromiseCache.set(key, promise);
  return promise;
}

const TZ = "UTC";

function ContributionsErrorFallback({
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

function ContributionsHeatmapFallback() {
  return (
    <div className="relative flex flex-col gap-1 xl:gap-1.5">
      <Skeleton className="h-3.5 w-6 rounded not-xl:absolute not-xl:inset-e-0 not-xl:-top-5 xl:w-3/4" />
      <div className="grid grid-cols-7 place-items-stretch gap-1 xl:gap-2.5">
        {Array.from({ length: 35 }).map((_, idx) => (
          <Skeleton key={idx} className="aspect-square rounded" />
        ))}
      </div>
    </div>
  );
}

function ContributionsHeatmap({
  year,
  month,
}: {
  year: number;
  month: number; // 1-12
}) {
  const data = use(getContributionsPromise(year, month));
  const monthIndex = month - 1;

  const byDate = new Map<string, number>();
  for (const day of data.calendar.weeks.flatMap((w) => w.contributionDays)) {
    byDate.set(day.date, day.contributionCount);
  }

  const monthStart = startOfMonth(
    toZonedTime(new Date(Date.UTC(year, monthIndex, 1)), TZ),
  );
  const monthEnd = endOfMonth(monthStart);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const dates = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const max = Math.max(...Array.from(byDate.values()), 0);

  return (
    <div className="relative flex flex-col gap-1">
      <CardDescription className="absolute inset-e-0 -top-5 text-xs text-muted-foreground xl:static">
        {data.calendar.totalContributions}{" "}
        <span className="hidden xl:inline">
          contributions in {formatInTimeZone(monthStart, TZ, "MMMM yyyy")}
        </span>
      </CardDescription>
      <div className="grid grid-cols-7 place-items-stretch gap-1 xl:gap-2.5">
        {dates.map((d) => {
          const iso = formatInTimeZone(d, TZ, "yyyy-MM-dd");
          const isOutside = getMonth(d) !== getMonth(monthStart);
          const count = byDate.get(iso) ?? 0;
          const bucket = isOutside ? 0 : intensityBucket(count, max);
          const label = formatTooltip(iso, count);

          return (
            <Tooltip key={iso}>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    aria-label={label}
                    aria-hidden={isOutside || undefined}
                    tabIndex={isOutside ? -1 : 0}
                    disabled={isOutside}
                    className={cn(
                      "cancelDrag aspect-square rounded ring-1 ring-foreground/10",
                      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
                      isOutside
                        ? "bg-transparent ring-foreground/5"
                        : bucketClass(bucket),
                    )}
                  />
                }
              />
              <TooltipContent>{label}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}

export default function ContributionsCardClient({
  login,
  years,
  defaultYear,
}: {
  login: string;
  years: number[];
  defaultYear: number;
}) {
  const minYear = years[years.length - 1] ?? defaultYear;
  const maxYear = years[0] ?? defaultYear;
  const startMonth = toZonedTime(new Date(Date.UTC(minYear, 0, 1)), TZ);
  const endMonth = toZonedTime(new Date(Date.UTC(maxYear, 11, 1)), TZ);
  const initialMonth = startOfMonth(toZonedTime(new Date(), TZ));

  const [month, setMonth] = useState<Date>(initialMonth);
  const [optimisticMonth, setOptimisticMonth] = useOptimistic(month);
  const [, startTransition] = useTransition();
  const [retryNonce, setRetryNonce] = useState(0);
  const year = getYear(optimisticMonth);
  const monthNumber = getMonth(optimisticMonth) + 1;

  function setMonthFrom(next: Date) {
    startTransition(() => {
      const normalized = startOfMonth(toZonedTime(next, TZ));
      setOptimisticMonth(normalized);
      setMonth(normalized);
    });
  }

  function retry() {
    contributionPromiseCache.delete(keyFor(year, monthNumber));
    setRetryNonce((n) => n + 1);
  }

  return (
    <>
      <CardHeader className="px-6 text-center md:pt-2 md:text-left xl:pt-4">
        <CardTitle>
          GitHub <span className="hidden xl:inline">Contributions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 px-6">
        <ErrorBoundary
          resetKey={`${year}-${monthNumber}-${retryNonce}`}
          fallback={({ error, reset }) => (
            <ContributionsErrorFallback
              error={error}
              onRetry={() => {
                reset();
                retry();
              }}
            />
          )}
        >
          <Suspense
            fallback={
              <ViewTransition exit="slide-down">
                <ContributionsHeatmapFallback />
              </ViewTransition>
            }
          >
            <ViewTransition enter="slide-up" default="none">
              <ContributionsHeatmap year={year} month={monthNumber} />
            </ViewTransition>
          </Suspense>
        </ErrorBoundary>
      </CardContent>
      <CardFooter className="items-end justify-between px-2 pb-2">
        <a
          className={cn(
            "cancelDrag",
            buttonVariants({ variant: "projectLink", size: "icon-lg" }),
          )}
          href={`https://github.com/${login}`}
        >
          <ArrowUpRightIcon data-icon="inline-start" className="size-5" />
          <span className="sr-only">Open GitHub profile</span>
        </a>
        <Calendar
          buttonVariant="ghost"
          captionLayout="label"
          mode="single"
          month={optimisticMonth}
          onMonthChange={setMonthFrom}
          onNextClick={setMonthFrom}
          onPrevClick={setMonthFrom}
          startMonth={startMonth}
          endMonth={endMonth}
          classNames={{
            table: "hidden",
            weekdays: "hidden",
            week: "hidden",
            month: "gap-0",
            caption_label: "text-center leading-4",
          }}
          className="cancelDrag rounded-sm bg-input px-0 py-1"
        />
      </CardFooter>
    </>
  );
}
