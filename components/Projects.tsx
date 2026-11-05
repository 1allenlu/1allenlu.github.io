'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { ArrowUpRight, Plus, X } from 'lucide-react';
import clsx from 'clsx';
import { projects, type Project } from '@/data/site';
import { EASE_OUT, GlowCard, Reveal } from './motion';
import { SectionHeader } from './SectionHeader';
import { TagList } from './TagList';

const LAYOUT_TRANSITION = { type: 'spring', stiffness: 260, damping: 30 } as const;

function ProjectBanner({ project }: { project: Project }) {
  const Icon = project.icon;
  return (
    <div className="project-banner">
      <Icon className="project-icon" aria-hidden strokeWidth={1.5} />
      <span className="project-category">{project.category}</span>
      {project.featured && <span className="featured-flag">Latest</span>}
    </div>
  );
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  // The whole card opens the details, except for its own links and buttons.
  function handleClick(e: MouseEvent) {
    if (!(e.target as Element).closest('a, button')) onOpen();
  }

  return (
    <GlowCard
      layoutId={`project-${project.slug}`}
      className={clsx('project-card', project.featured && 'featured')}
      onClick={handleClick}
      style={{ borderRadius: 20 }}
    >
      <ProjectBanner project={project} />
      <div className="project-title">{project.title}</div>
      <div className="project-description">{project.description}</div>
      <TagList tags={project.tech} limit={project.tagLimit} listClass="project-tech" tagClass="tech-tag" />
      <div className="project-links">
        <button type="button" className="project-details" onClick={onOpen}>
          <Plus aria-hidden size={15} /> Details
        </button>
        <a href={project.url} className="project-link" target="_blank" rel="noopener noreferrer">
          View Project →
        </a>
      </div>
    </GlowCard>
  );
}

function ProjectDialog({ project, onClose }: { project: Project; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = `project-${project.slug}-title`;

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus({ preventScroll: true });
    document.documentElement.classList.add('dialog-open');

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key !== 'Tab' || !dialogRef.current) return;

      // Keep keyboard focus inside the dialog while it's open.
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>('a[href], button');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === dialogRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.documentElement.classList.remove('dialog-open');
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, [onClose]);

  return (
    <div className="project-dialog-layer">
      <motion.div
        className="project-dialog-backdrop"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      />
      <motion.div
        ref={dialogRef}
        layoutId={`project-${project.slug}`}
        className="card project-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        style={{ borderRadius: 20 }}
        transition={LAYOUT_TRANSITION}
      >
        <button type="button" className="project-dialog-close" onClick={onClose} aria-label="Close">
          <X aria-hidden size={18} />
        </button>
        <motion.div
          className="project-dialog-scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          transition={{ duration: 0.3, ease: EASE_OUT, delay: 0.12 }}
        >
          <ProjectBanner project={project} />
          <div className="project-dialog-body">
            <h3 id={titleId}>{project.title}</h3>
            <p className="project-dialog-summary">{project.description}</p>
            <h4>Highlights</h4>
            <ul className="project-highlights">
              {project.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
            <h4>Built with</h4>
            <div className="project-tech">
              {project.tech.map((tag) => (
                <span key={tag} className="tech-tag">
                  {tag}
                </span>
              ))}
            </div>
            <a href={project.url} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
              View on GitHub <ArrowUpRight aria-hidden size={16} />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export function Projects() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const selected = projects.find((p) => p.slug === selectedSlug);

  return (
    <section id="projects">
      <div className="container">
        <SectionHeader eyebrow="05 · Projects" title="Projects" />
        <LayoutGroup>
          <div className="bento">
            {projects.map((project, i) => (
              <Reveal key={project.slug} index={i} className={`span-${project.span} ${project.featured ? 'featured-wrap' : ''}`}>
                <ProjectCard project={project} onOpen={() => setSelectedSlug(project.slug)} />
              </Reveal>
            ))}
          </div>
          <AnimatePresence>
            {selected && <ProjectDialog key={selected.slug} project={selected} onClose={() => setSelectedSlug(null)} />}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </section>
  );
}
