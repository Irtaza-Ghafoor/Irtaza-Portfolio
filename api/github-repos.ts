import type { VercelRequest, VercelResponse } from '@vercel/node';

const USERNAME = 'Irtaza-Ghafoor';

interface RepoOut {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
}

// Pinned repositories are only available through the GraphQL API (REST has no
// concept of them), so this needs the authenticated token.
async function pinnedFromGraphQL(token: string): Promise<RepoOut[]> {
  const query = `
    query($login: String!) {
      user(login: $login) {
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              databaseId
              name
              description
              url
              stargazerCount
              forkCount
              primaryLanguage { name }
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
  const nodes = json?.data?.user?.pinnedItems?.nodes;
  // Empty/absent → let the caller fall back to recent repos instead of an
  // empty section.
  if (!Array.isArray(nodes) || nodes.length === 0)
    throw new Error('No pinned repositories');

  return nodes.map((n: any) => ({
    id: n.databaseId,
    name: n.name,
    description: n.description,
    html_url: n.url,
    stargazers_count: n.stargazerCount,
    forks_count: n.forkCount,
    language: n.primaryLanguage?.name ?? null,
  }));
}

// Fallback when no token is configured: REST can't return pinned repos, so use
// the most recently-updated public repos as an approximation.
async function recentFromREST(): Promise<RepoOut[]> {
  const res = await fetch(
    `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=6`
  );
  if (!res.ok) throw new Error(`REST HTTP ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error('REST response was not an array');
  return data.map((r: any) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    html_url: r.html_url,
    stargazers_count: r.stargazers_count,
    forks_count: r.forks_count,
    language: r.language,
  }));
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const token = process.env.GITHUB_TOKEN;
    const repos = token ? await pinnedFromGraphQL(token) : await recentFromREST();
    // Pinned repos change rarely — a longer edge cache is fine here.
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=3600'
    );
    return res.status(200).json(repos.slice(0, 3));
  } catch (err) {
    // If GraphQL failed (bad token, no pins), still return something useful.
    try {
      const repos = await recentFromREST();
      return res.status(200).json(repos.slice(0, 3));
    } catch {
      console.error('Repos fetch failed:', err);
      return res.status(500).json({ message: 'Failed to load repos' });
    }
  }
}
