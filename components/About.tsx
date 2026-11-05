import { Reveal } from './motion';
import { SectionHeader } from './SectionHeader';

export function About() {
  return (
    <section id="about">
      <div className="container">
        <SectionHeader eyebrow="01 · About" title="A bit about me." />
        <Reveal className="about-content">
          <div className="about-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="assets/homepage/about-pic.jpg" alt="Allen Lu" loading="lazy" />
          </div>
          <div className="about-text">
            <p className="lede">
              M.Eng. Computer Science student at Cornell Tech, into full-stack development and machine learning.
            </p>
            <p>
              Before this, I was a Research Assistant at the NYU Computation &amp; Cognition Lab and studied Math &amp;
              CS at NYU Tandon, working as a Student Product Analyst at NYU IT, Treasurer of NYU Theta Tau, and
              Secretary/Treasurer of the Tandon Applied Math Club.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
