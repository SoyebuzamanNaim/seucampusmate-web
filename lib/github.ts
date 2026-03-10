const GITHUB_API = "https://api.github.com/repos";
const CACHE_REVALIDATE = 3600;

export type GitHubContributor = {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  contributions: number;
};

export async function getContributors(
  repo: string
): Promise<GitHubContributor[]> {
  const res = await fetch(
    `${GITHUB_API}/${repo}/contributors?per_page=100`,
    {
      next: { revalidate: CACHE_REVALIDATE },
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        }),
      },
    }
  );

  if (!res.ok) return [];

  const data = (await res.json()) as GitHubContributor[];
  if (!Array.isArray(data)) return [];

  return data.map((c) => ({
    login: c.login,
    id: c.id,
    avatar_url: c.avatar_url,
    html_url: c.html_url,
    contributions: c.contributions,
  }));
}
