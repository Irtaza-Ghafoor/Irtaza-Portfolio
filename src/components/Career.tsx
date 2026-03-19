import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
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
                <h4>Frontend Developer</h4>
                <h5>Previous Company</h5>
              </div>
              <h3>2020</h3>
            </div>
            <p>
              Developed responsive web interfaces and optimized user experiences. 
              Worked with modern frontend frameworks to build scalable components.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Full Stack Developer</h4>
                <h5>Current Company</h5>
              </div>
              <h3>2022</h3>
            </div>
            <p>
              Designing and implementing end-to-end solutions. Building robust APIs 
              and interactive frontends for complex web applications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
