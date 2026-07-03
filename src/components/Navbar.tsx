import { useEffect, useState } from "react";
import { FiMenu, FiX, FiUser, FiBriefcase, FiMail } from "react-icons/fi";
import { FaGithub, FaLinkedinIn, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother;

const navLinks = [
  { id: "about", label: "ABOUT", icon: <FiUser /> },
  { id: "work", label: "WORK", icon: <FiBriefcase /> },
  { id: "github", label: "GITHUB", icon: <FaGithub /> },
  { id: "contact", label: "CONTACT", icon: <FiMail /> },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  useEffect(() => {
    // Highlight the nav link for whichever section is under the viewport
    // centre. On every scroll update we ask each section directly where it
    // currently sits on screen (getBoundingClientRect gives the live, already
    // transform-adjusted position) and pick the one covering the centre line.
    // No cached offsets or scroll math to drift out of sync, and it picks up
    // the GitHub section automatically once it mounts. Also flips the header
    // into its compact "glass pill" state once scrolled off the very top.
    let frame = 0;
    const updateActive = () => {
      // Cheap every frame: no layout read, no-op if unchanged.
      setScrolled((smoother ? smoother.scrollTop() : window.scrollY) > 60);
      // The section lookup reads layout (getBoundingClientRect), so throttle it
      // to every ~5th frame — highlighting doesn't need per-frame precision and
      // this keeps the reflow off the hot path during the heavy hero scroll.
      if (frame++ % 5 !== 0) return;
      const mid = window.innerHeight / 2;
      for (const link of navLinks) {
        const el = document.getElementById(link.id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) {
          // Setting the same value is a no-op in React, so this only
          // re-renders when the active section actually changes.
          setActiveSection(link.id);
          break;
        }
        // In a gap (an untracked section like Techstack) nothing covers the
        // centre, so we leave the last active link highlighted.
      }
    };

    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      // `smooth` is the lag between your real scroll and the smoothed position
      // that drives the hero's scrubbed 3D/text animations. Too high and a fast
      // reverse-scroll shows the character/text still in their "scrolled-away"
      // state until the smoothing catches up. 0.7 keeps it smooth but tracks
      // tightly enough that those elements stay in place. `speed` (page
      // traversal pacing) is left unchanged.
      smooth: 0.7,
      speed: 1.7,
      // No element uses data-speed/data-lag, so skip per-frame effect parsing.
      effects: false,
      autoResize: true,
      ignoreMobileResize: true,
      // Fires every frame the smoother updates, regardless of page height — so
      // nav highlighting keeps working even as late content grows the page.
      onUpdate: updateActive,
    });

    smoother.scrollTop(0);
    smoother.paused(true);
    updateActive();

    let links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      let element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        // ScrollSmoother owns the scroll on every screen size, so always route
        // through scrollTo (native #hash jumps misbehave under it) — this makes
        // the mobile menu links scroll correctly too.
        e.preventDefault();
        let elem = e.currentTarget as HTMLAnchorElement;
        let section = elem.getAttribute("data-href");
        smoother.scrollTo(section, true, "top top");
      });
    });
    // Only refresh on a real WIDTH change. On mobile, scrolling down hides the
    // address bar which fires a `resize` (height-only) event every frame — and
    // ScrollSmoother.refresh(true) is an expensive full recalculation that
    // freezes the scroll each time it runs. Ignoring height-only resizes (and
    // debouncing) is what keeps downward scrolling smooth on phones.
    let lastWidth = window.innerWidth;
    let resizeTimer: number;
    const onResize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        ScrollSmoother.refresh(true);
      }, 200);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(resizeTimer);
    };
  }, []);
  return (
    <>
      <div className={`header${scrolled ? " scrolled" : ""}`}>
        <a href="/#" className="navbar-title" data-cursor="disable">
          K<span>A</span>
        </a>

        {/* Mobile Toggle Button */}
        <button
          className="mobile-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          data-cursor="disable"
        >
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <ul className={isMenuOpen ? "nav-open" : ""}>
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                data-href={`#${link.id}`}
                href={`#${link.id}`}
                className={activeSection === link.id ? "nav-active" : ""}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="nav-link-icon">{link.icon}</span>
                <HoverLinks text={link.label} />
              </a>
            </li>
          ))}

          {/* Drawer footer (mobile only): socials + email. */}
          <li className="nav-drawer-footer">
            <div className="nav-drawer-socials">
              <a href="https://github.com/Kashif-Khokhar" target="_blank" rel="noreferrer" aria-label="GitHub">
                <FaGithub />
              </a>
              <a href="https://www.linkedin.com/in/kashif-ali-khokhar/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
              <a href="https://x.com/Kashif_Khokhar1" target="_blank" rel="noreferrer" aria-label="Twitter / X">
                <FaXTwitter />
              </a>
              <a href="https://www.instagram.com/malik._.kashif_khokhar_/?hl=en" target="_blank" rel="noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
            </div>
            <a className="nav-drawer-mail" href="mailto:kashifalikhokharofficial@gmail.com">
              kashifalikhokharofficial@gmail.com
            </a>
          </li>
        </ul>
      </div>

      {/* Dimmed backdrop behind the mobile drawer — tap to close. */}
      <div
        className={`nav-overlay${isMenuOpen ? " show" : ""}`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      ></div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
