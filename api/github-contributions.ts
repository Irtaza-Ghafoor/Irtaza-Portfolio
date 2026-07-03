import type { VercelRequest, VercelResponse } from '@vercel/node';

const USERNAME = 'Kashif-Khokhar';

// GitHub buckets each contribution into a day using the account's timezone, so
// the year boundaries must be expressed in that same offset — otherwise a few
// contributions near midnight on Jan 1 fall outside a UTC window and the yearly
// total comes up short. Set this to your GitHub timezone (PKT = +05:00).
const TZ_OFFSET = '+05:00';

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
// way to match the count GitHub shows the owner. `from`/`to` scope it to a
// specific year; when null, GitHub returns the rolling last 12 months.
async function fromGraphQL(
  token: string,
  from: string | null,
  to: string | null
): Promise<{ total: number; days: Day[] }> {
  const query = `
    query($login: String!, $from: DateTime, $to: DateTime) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
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
    body: JSON.stringify({ query, variables: { login: USERNAME, from, to } }),
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

// Tokenless public source. Only sees PUBLIC contributions, used when no token is
// configured or as a last-ditch fallback so the calendar still renders. `year`
// is a 4-digit string or "last" (rolling 12 months).
async function fromPublic(year: string): Promise<{ total: number; days: Day[] }> {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=${year}`
  );
  if (!res.ok) throw new Error(`Public API HTTP ${res.status}`);
  const json = await res.json();
  const days: Day[] = (json.contributions || []).map((d: any) => ({
    date: d.date,
    count: d.count,
    level: d.level ?? 0,
  }));
  // This API keys the total by year ("2025") for a year, or "lastYear" for last.
  const total = json?.total?.[year] ?? json?.total?.lastYear ?? 0;
  return { total, days };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Accept ?year=2025 (4 digits). Anything else → rolling last 12 months.
  const rawYear = Array.isArray(req.query.year)
    ? req.query.year[0]
    : req.query.year;
  const isYear = typeof rawYear === 'string' && /^\d{4}$/.test(rawYear);

  let from: string | null = null;
  let to: string | null = null;
  if (isYear) {
    from = `${rawYear}-01-01T00:00:00${TZ_OFFSET}`;
    // Clamp the end to "now" for the current (in-progress) year so GitHub
    // doesn't reject a future `to`; full past years run to Dec 31.
    const endOfYear = new Date(`${rawYear}-12-31T23:59:59${TZ_OFFSET}`);
    const now = new Date();
    to = endOfYear > now ? now.toISOString() : `${rawYear}-12-31T23:59:59${TZ_OFFSET}`;
  }
  const publicYear = isYear ? (rawYear as string) : 'last';

  try {
    const token = process.env.GITHUB_TOKEN;
    const data = token
      ? await fromGraphQL(token, from, to)
      : await fromPublic(publicYear);

    // Short edge cache so today's contributions surface quickly (the previous
    // day-long stale window meant the graph could lag a full day behind GitHub).
    // Authenticated GraphQL allows 5000 req/hr, so a 5-minute cache is plenty
    // safe — at most ~10 min behind live.
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=300'
    );
    return res
      .status(200)
      .json({ source: token ? 'graphql' : 'public', ...data });
  } catch (err) {
    // If the authenticated path failed (bad/expired token, GitHub hiccup), still
    // try to return public data so the section isn't blank.
    try {
      const data = await fromPublic(publicYear);
      return res.status(200).json({ source: 'public-fallback', ...data });
    } catch {
      console.error('Contributions fetch failed:', err);
      return res.status(500).json({ message: 'Failed to load contributions' });
    }
  }
}
