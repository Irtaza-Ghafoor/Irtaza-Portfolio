import React, { useEffect, useState } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { FaRegStar, FaCodeBranch } from "react-icons/fa";
import { MdArrowOutward } from "react-icons/md";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/GithubSection.css";

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
  const [totalContributions, setTotalContributions] = useState<number>(0);

  useEffect(() => {
    // Fetch profile. A rate-limited/error response is still JSON (e.g.
    // { message: "..." }) but has no `login`, so only accept a real profile;
    // otherwise fall back to static details instead of an empty card.
    fetch(`https://api.github.com/users/${username}`)
      .then((res) => res.json())
      .then((data) => setProfile(data && data.login ? data : fallbackProfile))
      .catch(() => setProfile(fallbackProfile));

    // Fetch total contributions
    const fetchContributions = async () => {
      try {
        const response = await fetch(`https://github-contributions-api.deno.dev/${username.toLowerCase()}.json`);
        if (!response.ok) throw new Error("Failed to fetch contributions");
        const data = await response.json();
        
        if (data.total && data.total.lastYear) {
          setTotalContributions(data.total.lastYear);
        } else {
          const allDays = data.contributions.flat();
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
          
          const total = allDays.reduce((sum: number, day: any) => {
            const date = new Date(day.date);
            return date >= oneYearAgo ? sum + day.count : sum;
          }, 0);
          setTotalContributions(total);
        }
      } catch (err) {
        console.error("Contributions fetch error:", err);
        setTotalContributions(-1); // Indicator for "Recent contributions"
      }
    };

    fetchContributions();

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

  // This section renders null until the profile fetch resolves, so mounting it
  // changes the total page height. Refresh ScrollTriggers (nav active-state,
  // hero timelines) so they recalculate against the new layout.
  useEffect(() => {
    if (profile) ScrollTrigger.refresh();
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
               ? `${totalContributions} contributions in the last year`
               : totalContributions < 0 
                 ? "Recent contributions" 
                 : "Loading contributions..."}
           </span>
        </div>
        <GitHubCalendar 
          username={username} 
          blockSize={14} 
          blockMargin={4} 
          fontSize={16}
          theme={{
            light: ['#161b22', '#0d2d2a', '#1b5c56', '#309b8f', '#5eead4'],
            dark: ['#161b22', '#0d2d2a', '#1b5c56', '#309b8f', '#5eead4'],
          }}
        />
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
