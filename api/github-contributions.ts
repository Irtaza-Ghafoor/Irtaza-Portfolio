import type { VercelRequest, VercelResponse } from '@vercel/node';

const USERNAME = 'Kashif-Khokhar';

// GitHub's 5 contribution levels → palette indices (0–4). The frontend maps
// these onto the teal theme, so we only pass the level, never a hex colour.
const LEVEL_MAP: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

interface Day {
  date: string;
  count: number;
  level: number;
}

// Authenticated GraphQL: because the token belongs to the profile owner, the
// contribution calendar includes PRIVATE-repo contributions — this is the only
// way to match the "703 in the last year" number GitHub shows the owner.
async function fromGraphQL(token: string): Promise<{ total: number; days: Day[] }> {
  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays { date contributionCount contributionLevel }
            }
          }
        }
      }
    }`;

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables: { login: USERNAME } }),
  });

  if (!res.ok) throw new Error(`GraphQL HTTP ${res.status}`);
  const json = await res.json();
  const cal = json?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!cal) throw new Error('GraphQL response had no contribution calendar');

  const days: Day[] = cal.weeks.flatMap((w: any) =>
    w.contributionDays.map((d: any) => ({
      date: d.date,
      count: d.contributionCount,
      level: LEVEL_MAP[d.contributionLevel] ?? 0,
    }))
  );
  return { total: cal.totalContributions, days };
}

// Tokenless public source. Only sees PUBLIC contributions (~322), used when no
// token is configured or as a last-ditch fallback so the calendar still renders.
async function fromPublic(): Promise<{ total: number; days: Day[] }> {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`
  );
  if (!res.ok) throw new Error(`Public API HTTP ${res.status}`);
  const json = await res.json();
  const days: Day[] = (json.contributions || []).map((d: any) => ({
    date: d.date,
    count: d.count,
    level: d.level ?? 0,
  }));
  return { total: json?.total?.lastYear ?? 0, days };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const token = process.env.GITHUB_TOKEN;
    const data = token ? await fromGraphQL(token) : await fromPublic();

    // Cache at the edge for an hour (contributions change at most once a day),
    // serving stale for a day while revalidating — keeps us well under any limit.
    res.setHeader(
      'Cache-Control',
      's-maxage=3600, stale-while-revalidate=86400'
    );
    return res
      .status(200)
      .json({ source: token ? 'graphql' : 'public', ...data });
  } catch (err) {
    // If the authenticated path failed (bad/expired token, GitHub hiccup), still
    // try to return public data so the section isn't blank.
    try {
      const data = await fromPublic();
      return res.status(200).json({ source: 'public-fallback', ...data });
    } catch {
      console.error('Contributions fetch failed:', err);
      return res.status(500).json({ message: 'Failed to load contributions' });
    }
  }
}
