'use client';

import { useState } from 'react';

// Long lists collapse behind "+N more". Hidden tags stay in the HTML.
export function TagList({
  tags,
  limit = 5,
  listClass,
  tagClass,
}: {
  tags: string[];
  limit?: number;
  listClass: string;
  tagClass: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const hiddenCount = tags.length - limit;

  return (
    <>
      <div className={listClass}>
        {tags.map((tag, i) => (
          <span key={tag} className={tagClass} hidden={!expanded && i >= limit}>
            {tag}
          </span>
        ))}
      </div>
      {hiddenCount > 0 && (
        <button type="button" className="tag-toggle" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Show less' : `+${hiddenCount} more`}
        </button>
      )}
    </>
  );
}
