import "./styles/About.css";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">About Me</h3>
        <p className="para">
          Hey there! 👋 I'm <span>Irtaza Ahmad</span>, a Gold Medalist and AI/ML Engineer
          with hands-on experience designing, benchmarking, and deploying
          end-to-end machine learning pipelines across healthcare, telecom,
          and drug discovery. I thrive on advanced feature engineering and
          building high-performance ensemble models to solve real-world
          problems.
        </p>
        <div className="about-pill">
          <span>🤖</span> I like to teach machines to solve real world problems
        </div>
      </div>
    </div>
  );
};

export default About;
