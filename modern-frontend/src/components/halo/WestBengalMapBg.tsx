import React from 'react';

/**
 * Simplified West Bengal state outline
 * ViewBox: 0 0 290 580  (proportional to ~450km wide × ~770km tall)
 *
 * Key geographic features captured:
 *  • Wide northern section (North Bengal / Darjeeling plateau)
 *  • Narrow Siliguri corridor (~y 122–158)
 *  • Broadening South Bengal plains
 *  • Gangetic delta / Sundarbans coast at the bottom
 */
const WB_PATH = `
  M 40,10 L 260,10 L 278,38 L 268,68
  L 242,92 L 212,110 L 172,124 L 160,140
  L 158,158 L 172,176 L 198,208 L 218,245
  L 232,284 L 238,324 L 232,362 L 218,396
  L 198,422 L 172,442 L 148,455 L 122,455
  L 98,444  L 78,426  L 65,404  L 60,378
  L 52,346  L 48,314  L 50,280  L 60,246
  L 72,212  L 84,180  L 96,160  L 114,140
  L 116,124 L 88,110  L 62,90   L 42,68
  L 28,38 Z
`;

interface Location {
  label: string;
  cx: number;
  cy: number;
  r: number;
  primary: boolean;
  animDelay: string;
}

// Approximate lat/lon → viewBox coordinate mapping
// lon: 86.0°E → x=40,  89.8°E → x=260   (Δ3.8° → 220px)
// lat: 27.2°N → y=10,  21.5°N → y=455   (Δ5.7° → 445px)
const LOCATIONS: Location[] = [
  {
    label: 'Raniganj Coalfield',
    cx: 104, cy: 292,
    r: 6,
    primary: true,
    animDelay: '0s',
  },
  {
    label: 'Asansol',
    cx: 112, cy: 278,
    r: 3.5,
    primary: false,
    animDelay: '0.8s',
  },
  {
    label: 'Kolkata',
    cx: 180, cy: 376,
    r: 5,
    primary: false,
    animDelay: '1.2s',
  },
  {
    label: 'Darjeeling',
    cx: 154, cy: 26,
    r: 3.5,
    primary: false,
    animDelay: '2s',
  },
  {
    label: 'Siliguri',
    cx: 148, cy: 148,
    r: 3,
    primary: false,
    animDelay: '1.6s',
  },
];

export default function WestBengalMapBg() {
  return (
    /* 20% opacity container — positioned right of centre so it doesn't
       obscure the centred hero text */
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ opacity: 0.20 }}
    >
      {/* Outer positioning shell (right-aligned, vertically centred) */}
      <div
        style={{
          position: 'absolute',
          right: '6%',
          top: '50%',
          transform: 'translateY(-50%)',
          height: '88%',
          aspectRatio: '290 / 580',
        }}
      >
        {/* Inner shell that floats */}
        <div
          className="wb-floating"
          style={{ position: 'relative', width: '100%', height: '100%' }}
        >
          {/* ── Scan line ── */}
          <div
            className="wb-scanning"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: '2px',
              borderRadius: '2px',
              background:
                'linear-gradient(90deg, transparent 0%, rgba(139,148,255,0.95) 50%, transparent 100%)',
              zIndex: 10,
            }}
          />

          {/* ── SVG map ── */}
          <svg
            viewBox="0 0 290 580"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            <defs>
              {/* Outline glow */}
              <filter id="wb-glow" x="-25%" y="-25%" width="150%" height="150%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Dot glow */}
              <filter id="dot-glow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Clipping mask = same shape as state, for scanline masking */}
              <clipPath id="wb-clip">
                <path d={WB_PATH} />
              </clipPath>
            </defs>

            {/* ─── State outline ─── */}
            <path
              d={WB_PATH}
              fill="rgba(99,102,241,0.07)"
              stroke="rgba(139,148,255,0.95)"
              strokeWidth="1.4"
              strokeLinejoin="round"
              filter="url(#wb-glow)"
            />

            {/* ─── Interior grid lines (latitude lines) ─── */}
            {[120, 200, 280, 360].map((y) => (
              <line
                key={y}
                x1="0" y1={y} x2="290" y2={y}
                stroke="rgba(139,148,255,0.25)"
                strokeWidth="0.6"
                strokeDasharray="4 8"
                clipPath="url(#wb-clip)"
              />
            ))}
            {/* Interior grid lines (longitude lines) */}
            {[100, 160, 210].map((x) => (
              <line
                key={x}
                x1={x} y1="0" x2={x} y2="580"
                stroke="rgba(139,148,255,0.20)"
                strokeWidth="0.6"
                strokeDasharray="4 8"
                clipPath="url(#wb-clip)"
              />
            ))}

            {/* ─── Location markers ─── */}
            {LOCATIONS.map((loc) => (
              <g key={loc.label} filter="url(#dot-glow)">
                {/* Pulse ring 1 */}
                <circle
                  cx={loc.cx} cy={loc.cy}
                  r={loc.r}
                  fill="none"
                  stroke={loc.primary ? 'rgba(139,148,255,0.9)' : 'rgba(139,148,255,0.6)'}
                  strokeWidth="1"
                >
                  <animate
                    attributeName="r"
                    from={loc.r}
                    to={loc.r * 5}
                    dur="3s"
                    begin={loc.animDelay}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.8"
                    to="0"
                    dur="3s"
                    begin={loc.animDelay}
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Pulse ring 2 (staggered) */}
                <circle
                  cx={loc.cx} cy={loc.cy}
                  r={loc.r}
                  fill="none"
                  stroke={loc.primary ? 'rgba(139,148,255,0.5)' : 'rgba(139,148,255,0.3)'}
                  strokeWidth="0.8"
                >
                  <animate
                    attributeName="r"
                    from={loc.r}
                    to={loc.r * 8}
                    dur="3s"
                    begin={`${parseFloat(loc.animDelay) + 0.6}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.5"
                    to="0"
                    dur="3s"
                    begin={`${parseFloat(loc.animDelay) + 0.6}s`}
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Core dot */}
                <circle
                  cx={loc.cx} cy={loc.cy}
                  r={loc.r}
                  fill={
                    loc.primary
                      ? 'rgba(139,148,255,1)'
                      : 'rgba(139,148,255,0.75)'
                  }
                />
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
