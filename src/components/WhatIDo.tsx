import { useEffect, useRef } from "react";
import "./styles/WhatIDo.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiUser, FiCode, FiTarget, FiCpu } from "react-icons/fi";

const WhatIDo = () => {
  const containerRef = useRef<(HTMLDivElement | null)[]>([]);
  const setRef = (el: HTMLDivElement | null, index: number) => {
    containerRef.current[index] = el;
  };
  useEffect(() => {
    // Touch / no-hover devices get the tap-accordion. `ScrollTrigger.isTouch`
    // alone is unreliable at mount, so also check the pointer/hover media
    // queries (true on phones). Store the exact handlers so cleanup works.
    const isTouch =
      ScrollTrigger.isTouch === 1 ||
      window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (!isTouch) return;

    const cleanups: (() => void)[] = [];
    containerRef.current.forEach((container) => {
      if (!container) return;
      container.classList.remove("what-noTouch");
      const handler = () => handleClick(container);
      container.addEventListener("click", handler);
      cleanups.push(() => container.removeEventListener("click", handler));
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);
  return (
    <div className="whatIDO">
      <div className="what-box">
        <h2 className="title">
          W<span className="hat-h2">HAT</span>
          <div>
            I<span className="do-h2"> DO</span>
          </div>
        </h2>
      </div>
      <div className="what-box">
        <div className="what-box-in">
          <div className="what-border2">
            <svg width="100%">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
              <line
                x1="100%"
                y1="0"
                x2="100%"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
            </svg>
          </div>
          <div
            className="what-content what-noTouch"
            ref={(el) => setRef(el, 0)}
          >
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="0"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>

            <div className="what-content-in">
              <h3>WHO I AM</h3>
              <div className="what-icon user-icon"><FiUser /></div>
              <ul>
                <li>Dedicated Full-Stack Developer with a relentless focus on creating high-performance, user-centric software solutions.</li>
                <li>Computer Science scholar specializing in modern architectural patterns and robust system design.</li>
                <li>A proactive problem-solver driven by technical excellence and the desire to build products that scale.</li>
              </ul>
              <div className="what-arrow"></div>
            </div>
          </div>
          <div
            className="what-content what-noTouch"
            ref={(el) => setRef(el, 1)}
          >
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>
            <div className="what-content-in">
              <h3>WHAT I DO</h3>
              <div className="what-icon code-icon"><FiCode /></div>
              <ul>
                <li>Develop end-to-end web solutions using the MERN stack and Next.js for modern internal & public platforms.</li>
                <li>Design efficient database schemas in MySQL and MongoDB, ensuring data integrity and high-speed retrieval.</li>
                <li>Craft pixel-perfect, interactive user interfaces with Tailwind CSS and Framer Motion for a premium UX.</li>
              </ul>
              <div className="what-arrow"></div>
            </div>
          </div>
          <div
            className="what-content what-noTouch"
            ref={(el) => setRef(el, 2)}
          >
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>
            <div className="what-content-in">
              <h3>MY GOALS</h3>
              <div className="what-icon target-icon"><FiTarget /></div>
              <ul>
                <li>Integrate AI-driven features into web ecosystems to enhance user productivity and experience.</li>
                <li>Contribute to large-scale open-source projects to give back to the developer community.</li>
                <li>Master system architecture to build indestructible, enterprise-ready software products.</li>
              </ul>
              <div className="what-arrow"></div>
            </div>
          </div>
          <div
            className="what-content what-noTouch"
            ref={(el) => setRef(el, 3)}
          >
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>
            <div className="what-content-in">
              <h3>MY PHILOSOPHY</h3>
              <div className="what-icon bulb-icon"><FiCpu /></div>
              <ul>
                <li>Code is for humans to read and machines to execute; I prioritize clean, modular, and SOLID code.</li>
                <li>Security and performance are not features—they are fundamental requirements of every system I build.</li>
                <li>The best way to predict the future is to build it; I bridge ideas and reality through technology.</li>
              </ul>
              <div className="what-arrow"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIDo;

function handleClick(container: HTMLDivElement) {
  container.classList.toggle("what-content-active");
  container.classList.remove("what-sibling");
  if (container.parentElement) {
    const siblings = Array.from(container.parentElement.children);

    siblings.forEach((sibling) => {
      if (sibling !== container) {
        sibling.classList.remove("what-content-active");
        sibling.classList.toggle("what-sibling");
      }
    });
  }
}
