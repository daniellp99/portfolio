import { formatInTimeZone } from "date-fns-tz";
import type { ReactNode } from "react";

import { CONTRIBUTIONS_TZ } from "@/lib/site/constants";

export function ContributionsDescription({
  monthStart,
  children,
}: {
  monthStart: Date;
  children: ReactNode;
}) {
  return (
    <>
      {children} contributions in{" "}
      <span className="hidden xl:inline">
        {formatInTimeZone(monthStart, CONTRIBUTIONS_TZ, "MMMM yyyy")}
      </span>
      <span className="inline xl:hidden">
        {formatInTimeZone(monthStart, CONTRIBUTIONS_TZ, "MMM")}
      </span>
    </>
  );
}
