import React, { useEffect, useMemo, useState } from "react";
import { FaRegStar, FaCodeBranch } from "react-icons/fa";
import { MdArrowOutward } from "react-icons/md";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/GithubSection.css";

// Teal palette, one colour per GitHub contribution level (index = level 0–4).
const LEVEL_COLORS = ["#161b22", "#0d2d2a", "#1b5c56", "#309b8f", "#5eead4"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface ContribDay {
  date: string;
  count: number;
  level: number;
}

// GitHub weeks run Sunday→Saturday. Group the flat day list into week columns,
// starting a new column on each Sunday (the first column may be partial).
const groupIntoWeeks = (days: ContribDay[]): ContribDay[][] => {
  const weeks: ContribDay[][] = [];
  let current: ContribDay[] = [];
  days.forEach((day) => {
    const dow = new Date(`${day.date}T00:00:00`).getDay();
    if (dow === 0 && current.length) {
      weeks.push(current);
      current = [];
    }
    current.push(day);
  });
  if (current.length) weeks.push(current);
  return weeks;
};

interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
}

interface UserProfile {
  avatar_url: string;
  name: string | null;
  login: string;
  bio: string | null;
  public_repos?: number;
  followers?: number;
  html_url: string;
  created_at?: string;
}

const username = "Irtaza-Ghafoor";

// The calendar defaults to the current year; the selector lets you page back
// through earlier years (down to the account's join year).
const CURRENT_YEAR = new Date().getFullYear();

// Shown when the GitHub API is unavailable (e.g. the 60 req/hour unauthenticated
// rate limit). Keeps the card looking right; the follower/repo counts are left
// out so we never display wrong numbers.
const fallbackProfile: UserProfile = {
  avatar_url: `https://github.com/${username}.png`,
  name: "Irtaza Ahmad",
  login: username,
  bio: "AI/ML Engineer | Building intelligent, data-driven solutions.",
  html_url: `https://github.com/${username}`,
};

const GithubSection: React.FC = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [contribDays, setContribDays] = useState<ContribDay[]>([]);
  const [totalContributions, setTotalContributions] = useState<number>(0);
  const [selectedYear, setSelectedYear] = useState<number>(CURRENT_YEAR);

  // Contributions are re-fetched whenever the selected year changes. They come
  // from our own serverless function, which uses an authenticated GitHub token
  // to include PRIVATE-repo contributions (so the total matches the profile). If
  // that endpoint isn't available — e.g. the Vite dev server has no serverless
  // runtime — fall back to the public API directly so the calendar still renders
  // (public-only count).
  useEffect(() => {
    let cancelled = false;
    // Reset to the loading state so switching years doesn't show stale squares.
    setContribDays([]);
    setTotalContributions(0);

    const applyData = (total: number, days: ContribDay[]) => {
      if (cancelled) return;
      setTotalContributions(total > 0 ? total : days.length ? -1 : 0);
      setContribDays(days);
    };

    fetch(`/api/github-contributions?year=${selectedYear}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => applyData(data.total, data.days || []))
      .catch(() => {
        fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=${selectedYear}`)
          .then((res) => res.json())
          .then((data) => {
            const days: ContribDay[] = (data.contributions || []).map((d: any) => ({
              date: d.date,
              count: d.count,
              level: d.level ?? 0,
            }));
            applyData(data?.total?.[selectedYear] ?? 0, days);
          })
          .catch((err) => {
            if (cancelled) return;
            console.error("Contributions fetch error:", err);
            setTotalContributions(-1); // Indicator for "Recent contributions"
          });
      });

    return () => {
      cancelled = true;
    };
  }, [selectedYear]);

  useEffect(() => {
    // Fetch profile. A rate-limited/error response is still JSON (e.g.
    // { message: "..." }) but has no `login`, so only accept a real profile;
    // otherwise fall back to static details instead of an empty card.
    fetch(`https://api.github.com/users/${username}`)
      .then((res) => res.json())
      .then((data) => setProfile(data && data.login ? data : fallbackProfile))
      .catch(() => setProfile(fallbackProfile));

    // Fetch the first 3 PINNED repos (via our serverless GraphQL endpoint —
    // pinned repos aren't available through the REST API). Falls back to recent
    // public repos when the endpoint isn't available, e.g. the Vite dev server.
    fetch("/api/github-repos")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: Repo[]) => {
        if (Array.isArray(data)) setRepos(data.slice(0, 3));
      })
      .catch(() => {
        fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`)
          .then((res) => res.json())
          .then((data: Repo[]) => {
            if (Array.isArray(data)) setRepos(data.slice(0, 3));
          })
          .catch((err) => console.error("Repos fetch error:", err));
      });
  }, []);

  // This section renders null until the profile fetch resolves, and the calendar
  // grid appears once contributions load — both change the total page height.
  // Refresh ScrollTriggers (nav active-state, hero timelines) so they
  // recalculate against the new layout.
  useEffect(() => {
    if (profile) ScrollTrigger.refresh();
  }, [profile, contribDays]);

  // Build the FULL selected year (Jan 1 → Dec 31) and overlay the fetched
  // counts, so the grid always spans the whole year with future/empty days shown
  // as blank cells — exactly like GitHub's own calendar. Stays empty while the
  // fetch is in flight so the "Loading…" header still shows.
  const weeks = useMemo(() => {
    if (!contribDays.length) return [];
    const byDate = new Map(contribDays.map((d) => [d.date, d]));
    const days: ContribDay[] = [];
    const cursor = new Date(Date.UTC(selectedYear, 0, 1));
    const end = new Date(Date.UTC(selectedYear, 11, 31));
    while (cursor <= end) {
      const iso = cursor.toISOString().slice(0, 10);
      days.push(byDate.get(iso) ?? { date: iso, count: 0, level: 0 });
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    return groupIntoWeeks(days);
  }, [contribDays, selectedYear]);

  // Empty cells to pad the top of the first (partial) week column so every row
  // lines up with its weekday.
  const firstWeekOffset = weeks[0]?.length
    ? new Date(`${weeks[0][0].date}T00:00:00`).getDay()
    : 0;

  // Year buttons: current year back to the account's join year (falling back to
  // a short recent range when the join date isn't known).
  const years = useMemo(() => {
    const startYear = profile?.created_at
      ? new Date(profile.created_at).getFullYear()
      : CURRENT_YEAR - 3;
    const list: number[] = [];
    for (let y = CURRENT_YEAR; y >= startYear; y--) list.push(y);
    return list;
  }, [profile]);

  if (!profile) return null;

  return (
    <section className="github-section section-container" id="github">
      <h2 className="section-heading">
        GitHub <span>Contributions</span>
      </h2>

      <div className="github-calendar-container">
        <div className="calendar-header">
           <span>
             {totalContributions > 0
               ? `${totalContributions} contributions in ${selectedYear}`
               : totalContributions < 0
                 ? `Contributions in ${selectedYear}`
                 : "Loading contributions..."}
           </span>
           <div className="year-selector">
             {years.map((year) => (
               <button
                 key={year}
                 type="button"
                 data-cursor="disable"
                 className={`year-btn${year === selectedYear ? " active" : ""}`}
                 onClick={() => setSelectedYear(year)}
               >
                 {year}
               </button>
             ))}
           </div>
        </div>

        {weeks.length > 0 && (
          <div className="contrib-calendar">
            <div className="contrib-months">
              {weeks.map((week, i) => {
                // Label a column when its month differs from the previous
                // column's; the text overflows to the right, GitHub-style.
                const month = new Date(`${week[0].date}T00:00:00`).getMonth();
                const prevMonth =
                  i > 0 ? new Date(`${weeks[i - 1][0].date}T00:00:00`).getMonth() : month;
                const label = i > 0 && month !== prevMonth ? MONTHS[month] : "";
                return (
                  <span className="contrib-month" key={week[0].date}>
                    {label}
                  </span>
                );
              })}
            </div>

            <div className="contrib-grid">
              {weeks.map((week, wi) => (
                <div className="contrib-week" key={week[0].date}>
                  {wi === 0 &&
                    Array.from({ length: firstWeekOffset }).map((_, p) => (
                      <div className="contrib-day empty" key={`pad-${p}`} />
                    ))}
                  {week.map((day) => (
                    <div
                      className="contrib-day"
                      key={day.date}
                      style={{ backgroundColor: LEVEL_COLORS[day.level] }}
                      title={`${day.count} contribution${day.count !== 1 ? "s" : ""} on ${day.date}`}
                    />
                  ))}
                </div>
              ))}
            </div>

            <div className="contrib-legend">
              <span>Less</span>
              {LEVEL_COLORS.map((color) => (
                <span
                  className="contrib-day"
                  key={color}
                  style={{ backgroundColor: color }}
                />
              ))}
              <span>More</span>
            </div>
          </div>
        )}
      </div>

      <div className="github-intro">
        <p>
          My GitHub contributions reflect my consistent commitment to open-source development and personal projects. 
          Explore my repositories to learn more about the projects I've worked on and the skills I bring to the table.
        </p>
      </div>

      <div className="repos-grid">
        {repos.map((repo) => (
          <a key={repo.id} href={repo.html_url} target="_blank" rel="noopener noreferrer" className="repo-card">
            <div className="repo-header">
              <h4>{repo.name}</h4>
              <p>{repo.description || "A professional project built with clean code and best practices."}</p>
            </div>
            <div className="repo-footer">
              <span className="repo-lang">{repo.language || "TypeScript"}</span>
              <div className="repo-stats">
                <span className="star"><FaRegStar /> {repo.stargazers_count}</span>
                <span className="fork"><FaCodeBranch /> {repo.forks_count}</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="github-profile-card">
        <div className="profile-info">
          {/* github.com/<user>.png always serves the avatar (no API / rate
              limit), so it never breaks like the API-provided URL can. */}
          <img
            src={`https://github.com/${username}.png?size=200`}
            alt={profile.name || username}
            className="profile-avatar"
            loading="lazy"
          />
          <div className="profile-text">
            <h4>{profile.name || username}</h4>
            <p className="profile-handle">@{profile.login}</p>
            <div className="profile-bio">
              <p>{profile.bio || "AI/ML Engineer | Building intelligent, data-driven solutions."}</p>
            </div>
          </div>
        </div>

        {/* Only shown when we have real counts — never fake numbers. */}
        {typeof profile.followers === "number" &&
          typeof profile.public_repos === "number" && (
            <div className="profile-stats">
              <span>{profile.followers} Followers</span>
              <span>{profile.public_repos} Repos</span>
            </div>
          )}

        <a href={profile.html_url} target="_blank" rel="noopener noreferrer" className="view-profile-btn">
          View Profile <MdArrowOutward />
        </a>
      </div>
    </section>
  );
};

export default GithubSection;
