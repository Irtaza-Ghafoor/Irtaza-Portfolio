import "./styles/Certificates.css";
import { FiAward, FiExternalLink } from "react-icons/fi";

const certificates = [
  {
    title: "Fullstack Development Specialization",
    issuer: "Scrimba (via Coursera)",
    date: "Feb 22, 2026",
    link: "https://coursera.org/verify/specialization/8QG0TZM2SKF2",
  },
  {
    title: "Google AI Fundamentals",
    issuer: "Google (via Coursera)",
    date: "Feb 19, 2026",
    link: "https://coursera.org/verify/LKWQHNHD7Q21",
  },
  {
    title: "Angular",
    issuer: "Sololearn",
    date: "Feb 17, 2026",
    link: "https://www.sololearn.com/en/certificates/CC-HWYXEAP3",
  },
  {
    title: "HTML and CSS in depth",
    issuer: "Meta (via Coursera)",
    date: "Jul 18, 2024",
    link: "https://coursera.org/verify/4KK3BABP8SFV",
  },
  {
    title: "Introduction to JavaScript",
    issuer: "Sololearn",
    date: "Feb 19, 2026",
    link: "https://www.sololearn.com/en/certificates/CC-NIWJAZPF",
  },
  {
    title: "Prompt Engineering",
    issuer: "Sololearn",
    date: "Feb 18, 2026",
    link: "https://www.sololearn.com/en/certificates/CC-WZ04IYN3",
  },
  {
    title: "Introduction to SQL",
    issuer: "Sololearn",
    date: "Feb 18, 2026",
    link: "https://www.sololearn.com/en/certificates/CC-HDTH4LRG",
  },
  {
    title: "Coding Foundations",
    issuer: "Sololearn",
    date: "Feb 16, 2026",
    link: "https://www.sololearn.com/en/certificates/CC-HJZ8LPKO",
  },
  {
    title: "Introduction to Python",
    issuer: "Sololearn",
    date: "Feb 13, 2026",
    link: "https://www.sololearn.com/en/certificates/CC-0MW1DFXS",
  },
  {
    title: "Web Development",
    issuer: "Sololearn",
    date: "Feb 12, 2026",
    link: "https://www.sololearn.com/en/certificates/CC-H25INK7X",
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
