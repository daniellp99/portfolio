import { NextResponse } from "next/server";

import { CONTRIBUTIONS_TZ } from "@/lib/contributions/constants";
import { getGithubContributionsForMonth } from "@/lib/server/github-contributions";
import { getOwnerData } from "@/lib/server/owner";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const yearParam = searchParams.get("year");
  const year = Number(yearParam);
  const monthParam = searchParams.get("month");
  const month = Number(monthParam);
  const timeZone = searchParams.get("tz") ?? CONTRIBUTIONS_TZ;

  if (!Number.isInteger(year) || year < 2000 || year > 3000) {
    return NextResponse.json(
      { error: "Invalid `year` query param." },
      { status: 400 },
    );
  }

  if (!Number.isInteger(month) || month < 1 || month > 12) {
    return NextResponse.json(
      { error: "Invalid `month` query param. Use 1-12." },
      { status: 400 },
    );
  }

  const owner = await getOwnerData();
  const login = owner?.githubUser?.trim();
  if (!login) {
    return NextResponse.json(
      { error: "Missing GitHub username." },
      { status: 400 },
    );
  }

  try {
    const data = await getGithubContributionsForMonth(
      login,
      year,
      month,
      timeZone,
    );
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch contributions.", details: message },
      { status: 500 },
    );
  }
}
