import { useRef, useState } from "react";
import { MdArrowOutward, MdCopyright, MdSend } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  const form = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

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
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-left">
            <div className="contact-box">
              <h4>Email</h4>
              <p>
                <a href="mailto:kashifalikhokharofficial@gmail.com" data-cursor="disable">
                  kashifalikhokharofficial@gmail.com
                </a>
              </p>
              <h4>Education</h4>
              <p>BSc in Computer Science</p>
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
                <p className="status-msg success">Message sent successfully!</p>
              )}
              {status === "error" && (
                <p className="status-msg error">Failed to send message. Please try again.</p>
              )}
            </form>

            <div className="contact-box footer-info">
              <h2>
                Designed and Developed <br /> by <span>Kashif Ali</span>
              </h2>
              <h5>
                <MdCopyright /> {new Date().getFullYear()}
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
