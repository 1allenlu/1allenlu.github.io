'use client';

import { useRef, type PointerEvent, type ReactNode } from 'react';
import { motion, MotionConfig, type HTMLMotionProps } from 'framer-motion';
import clsx from 'clsx';

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const REVEAL_VIEWPORT = { once: true, margin: '0px 0px -8% 0px' };

// Turns off transform animations for visitors who ask for reduced motion.
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

type RevealProps = HTMLMotionProps<'div'> & {
  // Position in its row. Items observe the viewport individually, so a tall
  // grid reveals as you reach each row instead of all at once.
  index?: number;
  columns?: number;
};

export function Reveal({ index = 0, columns = 3, children, ...props }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={REVEAL_VIEWPORT}
      transition={{ duration: 0.7, ease: EASE_OUT, delay: (index % columns) * 0.07 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type GlowCardProps = HTMLMotionProps<'div'> & {
  lift?: boolean;
};

// The shared tile: mouse-tracking glow, plus an optional hover lift.
export function GlowCard({ lift = true, className, onPointerMove, children, ...props }: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--glow-x', `${e.clientX - rect.left}px`);
      el.style.setProperty('--glow-y', `${e.clientY - rect.top}px`);
    }
    onPointerMove?.(e);
  }

  return (
    <motion.div
      ref={ref}
      className={clsx('card glow-card', lift && 'lift', className)}
      onPointerMove={handlePointerMove}
      whileHover={lift ? { scale: 1.02, y: -4 } : undefined}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
