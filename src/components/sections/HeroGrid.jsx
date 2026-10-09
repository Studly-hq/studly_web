import React from 'react';

/*
 * Hero section using time.fyi's CSS grid-as-borders pattern.
 * gap: 1px + container background = visible dividers between white cells.
 * Empty containers — ready for content later.
 */
const gridStyle = {
  backgroundColor: 'oklab(0.191251 -7.45058e-9 0 / 0.08)',
};

const cellStyle = {
  backgroundColor: '#fff',
};

// 6-column layout for the hero area
const colDefs = 'repeat(6, 1fr)';

const HeroGrid = () => {
  return (
    <section style={{ backgroundColor: '#fff' }}>
      {/* Title row — spans full width, tall enough to show grid clearly */}
      <div className="grid-container" style={{ ...gridStyle, gridTemplateColumns: colDefs }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={cellStyle} className="hero-cell hero-title" />
        ))}
      </div>

      {/* Subtitle row */}
      <div className="grid-container" style={{ ...gridStyle, gridTemplateColumns: colDefs }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={cellStyle} className="hero-cell hero-subtitle" />
        ))}
      </div>

      {/* CTA row — narrower span on left */}
      <div className="grid-container" style={{ ...gridStyle, gridTemplateColumns: colDefs }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={cellStyle} className="hero-cell hero-cta" />
        ))}
        {/* Spacer for right side */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={`s-${i}`} style={cellStyle} className="hero-cell hero-cta-skip" />
        ))}
      </div>
    </section>
  );
};

export default HeroGrid;
