'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import clsx from 'clsx';
import { experience } from '@/data/site';
import { GlowCard, Reveal } from './motion';
import { SectionHeader } from './SectionHeader';

export function Experience() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 70%', 'end 60%'],
  });
  const lineProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 });

  return (
    <section id="experience">
      <div className="container">
        <SectionHeader eyebrow="03 · Experience" title="Experience" />
        <div className="exp-timeline" ref={timelineRef}>
          <div className="exp-line" aria-hidden>
            <motion.div className="exp-line-progress" style={{ scaleY: lineProgress }} />
          </div>
          {experience.map((role, i) => (
            <div key={role.title} className={clsx('exp-row', i % 2 === 0 ? 'exp-row-left' : 'exp-row-right')}>
              <motion.span
                className="exp-dot"
                aria-hidden
                initial={{ scale: 0.6, opacity: 0.4 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: '0px 0px -35% 0px' }}
                transition={{ duration: 0.4 }}
              />
              <Reveal className="exp-card-wrap">
                <GlowCard className="timeline-card role-card">
                  <div className="timeline-card-head">
                    <h3>{role.title}</h3>
                    <div className="timeline-date">{role.date}</div>
                  </div>
                  <div className="timeline-org">{role.org}</div>
                  <p>{role.description}</p>
                </GlowCard>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
