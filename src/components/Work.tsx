import { useState, useCallback, useEffect } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

const projects = [
  {
    title: "Customer Segmentation Matrix",
    category: "Unsupervised Learning",
    tools: "Python, Scikit-Learn, K-Means++, Elbow Method, Silhouette Analysis",
    image: "https://opengraph.githubassets.com/1/Irtaza-Ghafoor/customer-segmentation-matrix-kmeans",
    link: "https://github.com/Irtaza-Ghafoor/customer-segmentation-matrix-kmeans",
  },
  {
    title: "Chronic Kidney Disease Prediction",
    category: "Healthcare Diagnostics",
    tools: "Python, Scikit-Learn, XGBoost, MICE Imputation — Soft-Voting Ensemble",
    image: "https://opengraph.githubassets.com/1/Irtaza-Ghafoor/chronic-kidney-disease-ensemble-prediction",
    link: "https://github.com/Irtaza-Ghafoor/chronic-kidney-disease-ensemble-prediction",
  },
  {
    title: "Telecom Customer Churn Prediction",
    category: "Ensemble Classification",
    tools: "Python, XGBoost, Random Forest, Scikit-Learn — ROC-AUC ≈ 0.844",
    image: "https://opengraph.githubassets.com/1/Irtaza-Ghafoor/telecom-customer-churn-prediction-ensemble",
    link: "https://github.com/Irtaza-Ghafoor/telecom-customer-churn-prediction-ensemble",
  },
  {
    title: "Used Car Price Prediction",
    category: "Ensemble Regression",
    tools: "Python, Random Forest, XGBoost, VotingRegressor — R² ≈ 0.9429",
    image: "https://opengraph.githubassets.com/1/Irtaza-Ghafoor/used-car-price-prediction-ensemble",
    link: "https://github.com/Irtaza-Ghafoor/used-car-price-prediction-ensemble",
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
        <h2 className="section-heading">
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
