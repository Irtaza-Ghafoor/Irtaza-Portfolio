import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2 className="section-heading">
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>AI/ML Intern</h4>
                <h5>Infinitiv.ai</h5>
              </div>
              <h3>2026 - Present</h3>
            </div>
            <p>
              Working on machine learning pipelines and predictive modeling, building
              and evaluating regression, classification, and ensemble models. Collaborating
              on data preprocessing, feature engineering, and model deployment for
              production-ready AI solutions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
