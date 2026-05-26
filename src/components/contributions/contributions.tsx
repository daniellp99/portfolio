import { ContributionsBoundary } from "@/components/contributions/parts/boundary";
import { ContributionsCell } from "@/components/contributions/parts/cell";
import { ContributionsCells } from "@/components/contributions/parts/cells";
import { ContributionsCount } from "@/components/contributions/parts/count";
import { ContributionsDescription } from "@/components/contributions/parts/description";
import { ContributionsGrid } from "@/components/contributions/parts/grid";
import { ContributionsLegend } from "@/components/contributions/parts/legend";
import { ContributionsMonthCalendar } from "@/components/contributions/parts/month-calendar";
import { ContributionsOpenProfileLink } from "@/components/contributions/parts/open-profile-link";
import { ContributionsTitle } from "@/components/contributions/parts/title";
import { ContributionsWeeksHeader } from "@/components/contributions/parts/weeks-header";

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
