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
                <h4>Frontend Developer</h4>
                <h5>Muasa Solutions</h5>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              Built responsive user interfaces and implemented interactive features using React 
              and modern frontend frameworks. Collaborated with design teams to create 
              seamless user experiences.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Full Stack Developer</h4>
                <h5>Infinitiv.ai</h5>
              </div>
              <h3>2026</h3>
            </div>
            <p>
              Developing and maintaining full-stack applications using modern technologies. 
              Working on AI-powered solutions, implementing new features, and optimizing 
              application performance for scalability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
