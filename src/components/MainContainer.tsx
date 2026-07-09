import { lazy, PropsWithChildren, Suspense, useEffect, useState } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import GithubSection from "./GithubSection";
import Certificates from "./Certificates";
import Education from "./Education";
import setSplitText from "./utils/splitText";

const TechStack = lazy(() => import("./TechStack"));

const MainContainer = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    window.innerWidth > 1024
  );

  useEffect(() => {
    // Run once on mount to split the text and set the initial view.
    setSplitText();
    setIsDesktopView(window.innerWidth > 1024);

    // Only react to real WIDTH changes. Mobile browsers fire `resize` on every
    // scroll (the address bar collapsing changes viewport height); re-splitting
    // all headings on each of those events is what makes downward scrolling
    // stutter. Height-only resizes are ignored, and width changes are debounced.
    let lastWidth = window.innerWidth;
    let resizeTimer: number;
    const resizeHandler = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        setSplitText();
        setIsDesktopView(window.innerWidth > 1024);
      }, 200);
    };
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
      window.clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <div className="container-main">
      <Cursor />
      <Navbar />
      <SocialIcons />
      {isDesktopView && children}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="container-main">
            <Landing>{!isDesktopView && children}</Landing>
            <About />
            <WhatIDo />
            <Career />
            <Certificates />
            <Education />
            <Work />
            <Suspense fallback={<div>Loading....</div>}>
              <TechStack />
            </Suspense>
            <GithubSection />
            <Contact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
