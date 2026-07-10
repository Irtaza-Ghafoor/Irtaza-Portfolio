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
                <li>Dedicated AI/ML Engineer with a relentless focus on building accurate, production-grade predictive systems.</li>
                <li>Computer Science scholar specializing in machine learning, statistical modeling, and data-driven decision making.</li>
                <li>A proactive problem-solver driven by curiosity and the desire to turn raw data into real-world impact.</li>
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
                <li>Build end-to-end ML pipelines with Python, Scikit-Learn, XGBoost, and LightGBM for regression and classification tasks.</li>
                <li>Engineer features and preprocess data with Pandas and NumPy, ensuring clean, leak-free training pipelines.</li>
                <li>Train and fine-tune deep learning models with PyTorch and TensorFlow, and build LLM-powered apps with Hugging Face and LangChain.</li>
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
                <li>Deploy production-grade ML and GenAI systems that make measurable business impact.</li>
                <li>Contribute to open-source machine learning projects to give back to the ML community.</li>
                <li>Master MLOps and large-scale model deployment to build reliable, enterprise-ready AI products.</li>
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
                <li>A model is only as good as its data; I prioritize rigorous validation over leaderboard chasing.</li>
                <li>Reproducibility and honest evaluation metrics are not optional—they are fundamental to trustworthy ML.</li>
                <li>The best way to predict the future is to build the model that forecasts it; I bridge data and decisions.</li>
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
