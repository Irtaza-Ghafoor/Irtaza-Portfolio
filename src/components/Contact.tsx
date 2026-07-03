import { useRef, useState } from "react";
import { MdArrowOutward, MdCopyright, MdSend, MdCheckCircle, MdError, MdArrowUpward } from "react-icons/md";
import { FaGithub, FaLinkedinIn, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { smoother } from "./Navbar";
import "./styles/Contact.css";

const Contact = () => {
  const form = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const scrollToTop = () => {
    // Use ScrollSmoother when it's driving the page (desktop); fall back to a
    // native smooth scroll otherwise.
    if (smoother) {
      smoother.scrollTo(0, true);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ScrollSmoother owns the scroll, so native "#hash" anchor jumps don't work.
  // Route footer nav clicks through smoother.scrollTo() (same as the Navbar),
  // falling back to a native anchor scroll when the smoother isn't active.
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    if (smoother) {
      e.preventDefault();
      smoother.scrollTo(target, true, "top top");
    } else {
      const el = document.querySelector(target);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
    // Keep the address bar clean — scroll only, no hash (bare "#" makes
    // location.hash === "", so test the full href instead).
    if (window.location.href.includes("#")) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  };

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.current) return;

    setIsSending(true);
    setStatus("idle");

    const formData = new FormData(form.current);
    const data = Object.fromEntries(formData.entries());

    fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(async (res) => {
        if (res.ok) {
          setStatus("success");
          form.current?.reset();
        } else {
          const err = await res.json();
          console.error("FAILED...", err.message);
          setStatus("error");
        }
      })
      .catch((error) => {
        console.error("FAILED...", error);
        setStatus("error");
      })
      .finally(() => {
        setIsSending(false);
      });
  };
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3 className="section-heading">Contact <span>Me</span></h3>
        <div className="contact-flex">
          <div className="contact-left">
            <div className="contact-box">
              <h4>Email</h4>
              <p>
                <a href="mailto:kashifalikhokharofficial@gmail.com" data-cursor="disable">
                  kashifalikhokharofficial@gmail.com
                </a>
              </p>
            </div>
            <div className="contact-box">
              <h4>Social</h4>
              <a
                href="https://github.com/Kashif-Khokhar"
                target="_blank"
                data-cursor="disable"
                className="contact-social"
              >
                Github <MdArrowOutward />
              </a>
              <a
                href="https://www.linkedin.com/in/kashif-ali-khokhar/"
                target="_blank"
                data-cursor="disable"
                className="contact-social"
              >
                Linkedin <MdArrowOutward />
              </a>
              <a
                href="https://x.com/Kashif_Khokhar1"
                target="_blank"
                data-cursor="disable"
                className="contact-social"
              >
                Twitter <MdArrowOutward />
              </a>
              <a
                href="https://www.instagram.com/malik._.kashif_khokhar_/?hl=en"
                target="_blank"
                data-cursor="disable"
                className="contact-social"
              >
                Instagram <MdArrowOutward />
              </a>
            </div>
          </div>

          <div className="contact-right">
            <form ref={form} onSubmit={sendEmail} className="contact-form">
              <div className="form-group">
                <input type="text" name="user_name" placeholder="Name" required />
              </div>
              <div className="form-group">
                <input type="email" name="user_email" placeholder="Email" required />
              </div>
              <div className="form-group">
                <textarea name="message" placeholder="Message" rows={5} required></textarea>
              </div>
              <button type="submit" disabled={isSending} className="submit-btn">
                {isSending ? "Sending..." : "Send Message"} <MdSend />
              </button>
              {status === "success" && (
                <div className="status-alert success">
                  <MdCheckCircle className="alert-icon" />
                  <p>Message sent successfully!</p>
                </div>
              )}
              {status === "error" && (
                <div className="status-alert error">
                  <MdError className="alert-icon" />
                  <p>Failed to send message. Please try again.</p>
                </div>
              )}
            </form>

          </div>
        </div>

        <footer className="site-footer">
          <div className="footer-top">
            <div className="footer-brand">
              <a
                href="/"
                className="footer-logo"
                data-cursor="disable"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTop();
                }}
              >
                Kashif<span>Ali</span>
              </a>
              <p>
                Full-Stack Developer crafting fast, accessible and
                user-centric web experiences.
              </p>
            </div>

            <div className="footer-col">
              <h4>Navigate</h4>
              <a href="#about" data-cursor="disable" onClick={(e) => scrollToSection(e, "#about")}>About</a>
              <a href="#work" data-cursor="disable" onClick={(e) => scrollToSection(e, "#work")}>Work</a>
              <a href="#github" data-cursor="disable" onClick={(e) => scrollToSection(e, "#github")}>GitHub</a>
              <a href="#contact" data-cursor="disable" onClick={(e) => scrollToSection(e, "#contact")}>Contact</a>
            </div>

            <div className="footer-col">
              <h4>Connect</h4>
              <div className="footer-socials">
                <a href="https://github.com/Kashif-Khokhar" target="_blank" rel="noreferrer" aria-label="GitHub" data-cursor="disable">
                  <FaGithub />
                </a>
                <a href="https://www.linkedin.com/in/kashif-ali-khokhar/" target="_blank" rel="noreferrer" aria-label="LinkedIn" data-cursor="disable">
                  <FaLinkedinIn />
                </a>
                <a href="https://x.com/Kashif_Khokhar1" target="_blank" rel="noreferrer" aria-label="Twitter / X" data-cursor="disable">
                  <FaXTwitter />
                </a>
                <a href="https://www.instagram.com/malik._.kashif_khokhar_/?hl=en" target="_blank" rel="noreferrer" aria-label="Instagram" data-cursor="disable">
                  <FaInstagram />
                </a>
              </div>
              <a href="mailto:kashifalikhokharofficial@gmail.com" className="footer-mail" data-cursor="disable">
                kashifalikhokharofficial@gmail.com
              </a>
            </div>

            <button
              type="button"
              className="footer-top-btn"
              onClick={scrollToTop}
              aria-label="Back to top"
              data-cursor="disable"
            >
              <MdArrowUpward />
              <span>Top</span>
            </button>
          </div>

          <div className="footer-bottom">
            <p className="footer-copy">
              <MdCopyright /> {new Date().getFullYear()} Kashif Ali. All rights reserved.
            </p>
            <p className="footer-credit">
              Designed &amp; Developed by <span>Kashif Ali</span>
            </p>
            <p className="footer-built">Built with React · Three.js · GSAP</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Contact;
