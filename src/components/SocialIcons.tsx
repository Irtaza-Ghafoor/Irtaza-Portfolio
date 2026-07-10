import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import { useEffect } from "react";
import HoverLinks from "./HoverLinks";
import { RESUME_URL } from "../constants";

const SocialIcons = () => {
  useEffect(() => {
    // The magnetic hover effect needs a real pointer — skip it on touch so
    // phones don't run a mousemove listener + rAF loop for nothing. The icons
    // fall back to their centered CSS position.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const social = document.getElementById("social") as HTMLElement;

    // One shared state array + one rAF loop for all icons, instead of a
    // perpetual loop + mousemove listener per icon.
    const icons = Array.from(social.querySelectorAll("span")).map((item) => {
      const elem = item as HTMLElement;
      const rect = elem.getBoundingClientRect();
      return {
        link: elem.querySelector("a") as HTMLElement,
        rect,
        targetX: rect.width / 2,
        targetY: rect.height / 2,
        currentX: rect.width / 2,
        currentY: rect.height / 2,
      };
    });

    let rafId = 0;
    let running = false;

    const tick = () => {
      let moving = false;
      for (const icon of icons) {
        const dx = icon.targetX - icon.currentX;
        const dy = icon.targetY - icon.currentY;
        if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
          moving = true;
          icon.currentX += dx * 0.1;
          icon.currentY += dy * 0.1;
          icon.link.style.setProperty("--siLeft", `${icon.currentX}px`);
          icon.link.style.setProperty("--siTop", `${icon.currentY}px`);
        }
      }
      if (moving) {
        rafId = requestAnimationFrame(tick);
      } else {
        running = false; // settle: stop burning frames until the next move
      }
    };

    const start = () => {
      if (!running) {
        running = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      for (const icon of icons) {
        const x = e.clientX - icon.rect.left;
        const y = e.clientY - icon.rect.top;
        if (x < 40 && x > 10 && y < 40 && y > 5) {
          icon.targetX = x;
          icon.targetY = y;
        } else {
          icon.targetX = icon.rect.width / 2;
          icon.targetY = icon.rect.height / 2;
        }
      }
      start();
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        <span>
          <a href="https://github.com/Kashif-Khokhar" target="_blank">
            <FaGithub />
          </a>
        </span>
        <span>
          <a href="https://www.linkedin.com/in/kashif-ali-khokhar/" target="_blank">
            <FaLinkedinIn />
          </a>
        </span>
        <span>
          <a href="https://x.com/Kashif_Khokhar1" target="_blank">
            <FaXTwitter />
          </a>
        </span>
        <span>
          <a href="https://www.instagram.com/malik._.kashif_khokhar_/?hl=en" target="_blank">
            <FaInstagram />
          </a>
        </span>
      </div>
      <a
        className="resume-button"
        href={RESUME_URL}
        target="_blank"
        rel="noreferrer"
      >
        <HoverLinks text="RESUME" />
        <span>
          <TbNotes />
        </span>
      </a>
    </div>
  );
};

export default SocialIcons;
