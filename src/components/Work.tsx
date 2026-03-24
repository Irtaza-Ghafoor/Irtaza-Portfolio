import { useState, useCallback, useEffect } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

const projects = [
  {
    title: "Timetable Generator",
    category: "Academic Tool",
    tools: "React, TypeScript, Vite",
    image: "/images/timetable.png",
    link: "https://timetable-generator-five.vercel.app/",
  },
  {
    title: "Superior GPA Calculator",
    category: "Academic Tool",
    tools: "React, TypeScript, Tailwind CSS, Vercel",
    image: "/images/gpa-calculator.png",
    link: "https://superior-gpa-calculator-phi.vercel.app/dashboard",
  },
  {
    title: "Currency PRO",
    category: "Financial Tool",
    tools: "React, TypeScript, Currency API, Vercel",
    image: "/images/currency-converter.png",
    link: "https://currency-converter-mu-ecru.vercel.app/",
  },
  {
    title: "Velora",
    category: "Event Invitation Studio",
    tools: "React, TypeScript, Tailwind CSS, Framer Motion",
    image: "/images/velora.png",
    link: "https://velora-studio-nu.vercel.app/",
  },
  {
    title: "PrismConvert",
    category: "Image & PDF Tools",
    tools: "Next.js, Tailwind CSS, Vercel",
    image: "/images/prism-convert.png",
    link: "https://prism-convert-six.vercel.app/",
  },
];

const Work = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + projects.length) % projects.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [goToNext]);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>

        <div className="carousel-wrapper">
          {/* Navigation Arrows */}
          <button
            className="carousel-arrow carousel-arrow-left"
            onClick={goToPrev}
            aria-label="Previous project"
            data-cursor="disable"
          >
            <MdArrowBack />
          </button>
          <button
            className="carousel-arrow carousel-arrow-right"
            onClick={goToNext}
            aria-label="Next project"
            data-cursor="disable"
          >
            <MdArrowForward />
          </button>

          {/* Slides */}
          <div className="carousel-track-container">
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {projects.map((project, index) => (
                <div className="carousel-slide" key={index}>
                  <div className="carousel-content">
                    <div className="carousel-info">
                      <div className="carousel-number">
                        <h3>0{index + 1}</h3>
                      </div>
                      <div className="carousel-details">
                        <h4>{project.title}</h4>
                        <p className="carousel-category">
                          {project.category}
                        </p>
                        <div className="carousel-tools">
                          <span className="tools-label">Tools & Features</span>
                          <p>{project.tools}</p>
                        </div>
                      </div>
                    </div>
                    <div className="carousel-image-wrapper">
                      <WorkImage image={project.image} alt={project.title} link={project.link} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="carousel-dots">
            {projects.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentIndex ? "carousel-dot-active" : ""
                  }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to project ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
