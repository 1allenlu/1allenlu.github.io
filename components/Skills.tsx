import { skills } from '@/data/site';
import { GlowCard, Reveal } from './motion';
import { SectionHeader } from './SectionHeader';
import { TagList } from './TagList';

export function Skills() {
  return (
    <section id="skills">
      <div className="container">
        <SectionHeader eyebrow="04 · Skills" title="Skills" />
        <div className="bento">
          {skills.map((group, i) => (
            <Reveal key={group.name} index={i} columns={2} className={`span-${group.span}`}>
              <GlowCard className="skill-category">
                <h3>{group.name}</h3>
                <TagList tags={group.tags} limit={group.tagLimit} listClass="skill-tags" tagClass="skill-tag" />
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
