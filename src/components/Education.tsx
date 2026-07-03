import "./styles/Education.css";
import { LuGraduationCap } from "react-icons/lu";

const educationData = [
  {
    degree: "BS Computer Science",
    institution: "Superior University, Gold Campus",
    duration: "2023 - 2027",
  },
  {
    degree: "F.Sc Pre-Engineering",
    institution: "Government Graduate College of Science",
    duration: "2021 - 2023",
  },
];

const Education = () => {
  return (
    <div className="education-section section-container" id="education">
      <div className="education-container">
        <h2 className="section-heading">
          Academic <span>Background</span>
        </h2>
        <div className="education-cards">
          {educationData.map((edu, index) => (
            <div className="education-card" key={index}>
              <div className="education-icon-wrapper">
                <LuGraduationCap className="education-icon" />
              </div>
              <div className="education-info">
                <h3>{edu.degree}</h3>
                <p className="institution">{edu.institution}</p>
                <p className="duration">{edu.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Education;
