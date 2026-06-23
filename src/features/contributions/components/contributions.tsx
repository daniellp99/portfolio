import { ContributionsBoundary } from "@/features/contributions/components/parts/boundary";
import { ContributionsCell } from "@/features/contributions/components/parts/cell";
import { ContributionsCells } from "@/features/contributions/components/parts/cells";
import { ContributionsCount } from "@/features/contributions/components/parts/count";
import { ContributionsDescription } from "@/features/contributions/components/parts/description";
import { ContributionsGrid } from "@/features/contributions/components/parts/grid";
import { ContributionsLegend } from "@/features/contributions/components/parts/legend";
import { ContributionsMonthCalendar } from "@/features/contributions/components/parts/month-calendar";
import { ContributionsOpenProfileLink } from "@/features/contributions/components/parts/open-profile-link";
import { ContributionsTitle } from "@/features/contributions/components/parts/title";
import { ContributionsWeeksHeader } from "@/features/contributions/components/parts/weeks-header";

export const Contributions = {
  Boundary: ContributionsBoundary,
  Title: ContributionsTitle,
  Description: ContributionsDescription,
  Count: ContributionsCount,
  WeeksHeader: ContributionsWeeksHeader,
  Grid: ContributionsGrid,
  Cell: ContributionsCell,
  Cells: ContributionsCells,
  Legend: ContributionsLegend,
  MonthCalendar: ContributionsMonthCalendar,
  OpenProfileLink: ContributionsOpenProfileLink,
};
