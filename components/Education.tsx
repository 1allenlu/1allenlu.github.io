import clsx from 'clsx';
import { education } from '@/data/site';
import { Reveal } from './motion';
import { SectionHeader } from './SectionHeader';

export function Education() {
  return (
    <section id="education">
      <div className="container">
        <SectionHeader eyebrow="02 · Education" title="Education" />
        <div className="education-content">
          <Reveal className="education-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="assets/homepage/profile-pic-web.jpg"
              alt="Allen Lu Professional Photo"
              className="professional-photo"
              loading="lazy"
            />
          </Reveal>
          <div className="timeline">
            {education.map((item, i) => (
              <Reveal key={item.degree} index={i} className={clsx('timeline-item', item.current && 'current')}>
                <div className="timeline-card">
                  <div className="timeline-card-head">
                    <h3>{item.degree}</h3>
                    {item.date && <div className="timeline-date">{item.date}</div>}
                  </div>
                  <div className="timeline-org">{item.school}</div>
                  <p>{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
