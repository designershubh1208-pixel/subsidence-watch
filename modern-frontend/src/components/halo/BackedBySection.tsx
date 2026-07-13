import React from 'react';

// Tech stack & partners powering Subsidence Watch
const backers = [
  {
    name: 'Google Earth Engine',
    style: {
      fontFamily: "'Times New Roman', serif",
      fontWeight: 400,
      letterSpacing: '0.02em',
      fontSize: '14px',
    },
  },
  {
    name: 'SENTINEL-1',
    style: {
      fontFamily: "'Arial Black', sans-serif",
      fontWeight: 900,
      letterSpacing: '0.08em',
      fontSize: '16px',
    },
  },
  {
    name: 'ESA',
    style: {
      fontFamily: 'Impact, sans-serif',
      fontWeight: 700,
      letterSpacing: '0.05em',
      fontSize: '18px',
    },
  },
  {
    name: 'PostGIS',
    style: {
      fontFamily: 'Georgia, serif',
      fontWeight: 600,
      letterSpacing: '-0.02em',
      fontSize: '17px',
    },
  },
  {
    name: 'FastAPI',
    style: {
      fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
      fontWeight: 700,
      letterSpacing: '-0.01em',
      fontSize: '15px',
    },
  },
  {
    name: 'REACT LEAFLET',
    style: {
      fontFamily: 'Verdana, sans-serif',
      fontWeight: 700,
      letterSpacing: '0.06em',
      fontSize: '14px',
      textTransform: 'uppercase' as const,
    },
  },
  {
    name: 'FIREBASE',
    style: {
      fontFamily: "'Courier New', monospace",
      fontWeight: 700,
      letterSpacing: '0.18em',
      fontSize: '14px',
    },
  },
  {
    name: 'Render · Vercel',
    style: {
      fontFamily: "'Palatino Linotype', Palatino, serif",
      fontWeight: 500,
      letterSpacing: '0.03em',
      fontSize: '15px',
    },
  },
];

export default function BackedBySection() {
  return (
    <section className="bg-[#F5F5F5] px-6 py-16">
      <div className="max-w-[88rem] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
        {/* Left label */}
        <p className="text-black/70 text-base leading-relaxed md:col-span-1">
          Built with industry-standard tools
          <br />
          and trusted open-data sources.
        </p>

        {/* Marquee */}
        <div className="md:col-span-3 overflow-hidden">
          <div className="backers-track">
            {[...backers, ...backers].map((backer, i) => (
              <span
                key={i}
                className="mx-10 shrink-0 text-black/50 whitespace-nowrap"
                style={backer.style}
              >
                {backer.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
