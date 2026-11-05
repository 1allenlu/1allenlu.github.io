import type { ReactNode } from 'react';
import { Reveal } from './motion';

export function SectionHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <Reveal className="section-header">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {children}
    </Reveal>
  );
}
