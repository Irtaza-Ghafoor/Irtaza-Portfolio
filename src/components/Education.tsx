import "./styles/Education.css";
import { LuGraduationCap } from "react-icons/lu";

const educationData = [
  {
    degree: "BS Computer Science (Lateral Entry)",
    institution: "Bahria University, Lahore Campus",
    duration: "2025 - 2027",
    detail: "Current CGPA: 3.60 / 4.00",
  },
  {
    degree: "Associate Degree in Computer Science",
    institution: "Bahria University, Lahore Campus",
    duration: "Graduated 2025",
    detail: "CGPA: 3.84 / 4.00 — Batch Rank 1st, Gold Medalist",
  },
  {
    degree: "F.Sc Pre-Engineering",
    institution: "Unique College",
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
                {edu.detail && <p className="honor">{edu.detail}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Education;
