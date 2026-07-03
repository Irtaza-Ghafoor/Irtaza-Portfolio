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
}

const username = "Kashif-Khokhar";

// Shown when the GitHub API is unavailable (e.g. the 60 req/hour unauthenticated
// rate limit). Keeps the card looking right; the follower/repo counts are left
// out so we never display wrong numbers.
const fallbackProfile: UserProfile = {
  avatar_url: `https://github.com/${username}.png`,
  name: "Kashif Ali",
  login: username,
  bio: "Full Stack Developer | Building scalable web solutions.",
  html_url: `https://github.com/${username}`,
};

const GithubSection: React.FC = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [contribDays, setContribDays] = useState<ContribDay[]>([]);
  const [totalContributions, setTotalContributions] = useState<number>(0);

  useEffect(() => {
    // Fetch profile. A rate-limited/error response is still JSON (e.g.
    // { message: "..." }) but has no `login`, so only accept a real profile;
    // otherwise fall back to static details instead of an empty card.
    fetch(`https://api.github.com/users/${username}`)
      .then((res) => res.json())
      .then((data) => setProfile(data && data.login ? data : fallbackProfile))
      .catch(() => setProfile(fallbackProfile));

    // Contributions come from our own serverless function, which uses an
    // authenticated GitHub token to include PRIVATE-repo contributions (so the
    // total matches the profile). If that endpoint isn't available — e.g. the
    // Vite dev server has no serverless runtime — fall back to the public API
    // directly so the calendar still renders (public-only count).
    const applyData = (total: number, days: ContribDay[]) => {
      setTotalContributions(total > 0 ? total : days.length ? -1 : 0);
      setContribDays(days);
    };

    fetch("/api/github-contributions")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => applyData(data.total, data.days || []))
      .catch(() => {
        fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
          .then((res) => res.json())
          .then((data) => {
            const days: ContribDay[] = (data.contributions || []).map((d: any) => ({
              date: d.date,
              count: d.count,
              level: d.level ?? 0,
            }));
            applyData(data?.total?.lastYear ?? 0, days);
          })
          .catch((err) => {
            console.error("Contributions fetch error:", err);
            setTotalContributions(-1); // Indicator for "Recent contributions"
          });
      });

    // Fetch top 3 repos
    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`)
      .then((res) => res.json())
      .then((data: Repo[]) => {
        // A rate-limited response is an object, not an array — bail cleanly.
        if (!Array.isArray(data)) return;
        const preferred = ["Currency-Converter", "Chess", "ToDo-List", "Kashif-Portfolio"];
        let selected = data.filter(r => preferred.includes(r.name));
        if (selected.length < 3) {
           const others = data.filter(r => !preferred.includes(r.name));
           selected = [...selected, ...others].slice(0, 3);
        }
        setRepos(selected);
      })
      .catch(err => console.error("Repos fetch error:", err));
  }, []);

  // This section renders null until the profile fetch resolves, and the calendar
  // grid appears once contributions load — both change the total page height.
  // Refresh ScrollTriggers (nav active-state, hero timelines) so they
  // recalculate against the new layout.
  useEffect(() => {
    if (profile) ScrollTrigger.refresh();
  }, [profile, contribDays]);

  const weeks = useMemo(() => groupIntoWeeks(contribDays), [contribDays]);
  // Empty cells to pad the top of the first (partial) week column so every row
  // lines up with its weekday.
  const firstWeekOffset = weeks[0]?.length
    ? new Date(`${weeks[0][0].date}T00:00:00`).getDay()
    : 0;

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
               ? `${totalContributions} contributions in the last year`
               : totalContributions < 0
                 ? "Recent contributions"
                 : "Loading contributions..."}
           </span>
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
              <p>{profile.bio || "Full Stack Developer | Building scalable web solutions."}</p>
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
