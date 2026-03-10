import { NextRequest, NextResponse } from "next/server";
import { getContributors } from "@/lib/github";

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const repo =
    searchParams.get("repo") ??
    process.env.NEXT_PUBLIC_GITHUB_REPO ??
    "sayeedjoy/seucampusmate-web";

  if (!repo || !repo.includes("/")) {
    return NextResponse.json(
      { error: "Valid repo (owner/name) is required" },
      { status: 400 }
    );
  }

  try {
    const contributors = await getContributors(repo);
    return NextResponse.json({ contributors });
  } catch (err) {
    console.error("[api/github/contributors]", err);
    return NextResponse.json(
      { error: "Failed to fetch contributors", contributors: [] },
      { status: 500 }
    );
  }
}
