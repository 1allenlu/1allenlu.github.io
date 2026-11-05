'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { roles } from '@/data/site';
import { EASE_OUT, GlowCard, Reveal } from './motion';

const NAME = 'Allen Lu';

function AnimatedName() {
  return (
    <h1 aria-label={NAME}>
      {NAME.split('').map((letter, i) => (
        <span key={i} className="name-letter-mask" aria-hidden>
          <motion.span
            className="name-letter"
            initial={{ y: '110%', rotate: 8, opacity: 0 }}
            animate={{ y: 0, rotate: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.15 + i * 0.045 }}
          >
            {letter === ' ' ? ' ' : letter}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

function RotatingRole() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % roles.length), 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="subtitle">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={roles[index]}
          style={{ display: 'inline-block' }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
        >
          {roles[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container">
        <div className="hero-bento">
          <Reveal className="hero-main-wrap" columns={1}>
            <GlowCard lift={false} className="hero-main">
              <div className="availability-badge">
                <span className="availability-dot" /> Open to 2027 new grad roles
              </div>
              <AnimatedName />
              <RotatingRole />
              <p className="hero-copy">
                M.Eng. Computer Science at Cornell Tech.
                <br />I build full-stack systems and ML-driven products.
              </p>
              <div className="cta-buttons">
                <a href="#contact" className="btn btn-primary">
                  Get in touch
                </a>
                <a href="#projects" className="btn btn-secondary">
                  View projects →
                </a>
              </div>
              <div className="hero-icon-links">
                <a href="info/Resume.pdf" target="_blank" rel="noopener noreferrer">
                  Resume ↓
                </a>
                <a href="https://github.com/1allenlu" target="_blank" rel="noopener noreferrer">
                  GitHub ↗
                </a>
              </div>
            </GlowCard>
          </Reveal>

          <Reveal className="hero-tile-wrap" index={1} columns={4}>
            <GlowCard className="hero-tile">
              <span className="tile-label">Now</span>
              <div className="tile-title">Cornell Tech</div>
              <p className="tile-copy">M.Eng. Computer Science, expected May 2027.</p>
            </GlowCard>
          </Reveal>

          <Reveal className="hero-tile-wrap" index={2} columns={4}>
            <a href="#projects" className="tile-link">
              <GlowCard className="hero-tile">
                <span className="tile-label">Latest project</span>
                <div className="tile-title">PolicyPilot →</div>
                <p className="tile-copy">An adaptive training coach for health-insurance reviewers.</p>
              </GlowCard>
            </a>
          </Reveal>

          <Reveal className="hero-tile-wrap" index={3} columns={4}>
            <GlowCard className="hero-tile">
              <span className="tile-label">Focus</span>
              <div className="tile-tags">
                <span className="tech-tag">Full-Stack</span>
                <span className="tech-tag">Backend</span>
                <span className="tech-tag">Machine Learning</span>
              </div>
            </GlowCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
