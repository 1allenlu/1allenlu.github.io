import { Reveal } from './motion';
import { SectionHeader } from './SectionHeader';

export function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="container">
        <SectionHeader eyebrow="06 · Contact" title="Let's build something.">
          <p>Open to 2027 new grad SWE/MLE/QuantDev roles.</p>
        </SectionHeader>
        <Reveal className="contact-info">
          <div className="contact-item">
            <h4>Email</h4>
            <a href="mailto:allen930526@gmail.com">allen930526@gmail.com</a>
          </div>
          <div className="contact-item">
            <h4>LinkedIn</h4>
            <a href="https://www.linkedin.com/in/allen-lu526/" target="_blank" rel="noopener noreferrer" className="contact-social">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="assets/homepage/linkedin.png" alt="" className="contact-icon" />
              Connect with me
            </a>
          </div>
          <div className="contact-item">
            <h4>GitHub</h4>
            <a href="https://github.com/1allenlu" target="_blank" rel="noopener noreferrer" className="contact-social">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="assets/homepage/github.png" alt="" className="contact-icon" />
              View my projects
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
