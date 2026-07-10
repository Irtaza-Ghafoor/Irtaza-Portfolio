import "./styles/Certificates.css";
import { FiAward, FiExternalLink } from "react-icons/fi";

const certificates = [
  {
    title: "Machine Learning for Beginners",
    issuer: "Sololearn",
    date: "Jun 20, 2026",
    link: "https://www.sololearn.com/certificates/CC-I6XMVCAM",
  },
  {
    title: "Introduction to Python",
    issuer: "Sololearn",
    date: "Jun 26, 2026",
    link: "https://www.sololearn.com/certificates/CC-QVWCSKHQ",
  },
];

const Certificates = () => {
  return (
    <div className="certificates-section section-container" id="certificates">
      <div className="certificates-container">
        <h2 className="section-heading">
          Certifications <span>&</span>
          <br /> Achievements
        </h2>
        <div className="certificates-grid">
          {certificates.map((cert, index) => (
            <div className="certificate-card" key={index}>
              <a href={cert.link} className="certificate-link" target="_blank" rel="noopener noreferrer" aria-label={`View ${cert.title} certificate`}>
                <FiExternalLink />
              </a>
              <div className="certificate-content">
                <div className="certificate-icon">
                  <FiAward />
                </div>
                <div className="certificate-info">
                  <h4>{cert.title}</h4>
                  <h5>{cert.issuer}</h5>
                  <p>{cert.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Certificates;
