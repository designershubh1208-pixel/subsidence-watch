import React, { useRef, useEffect } from 'react';

/* ─── Configuration ──────────────────────────────────────────── */

interface Loc {
  x: number; y: number;
  risk: 'HIGH' | 'MEDIUM' | 'LOW';
  color: string;
  label: string;
  value: string;
}

const LOCS: Loc[] = [
  { x: 0.34, y: 0.55, risk: 'HIGH',   color: '#ef4444', label: 'RANIGANJ',   value: '−18.4 mm/yr' },
  { x: 0.39, y: 0.52, risk: 'HIGH',   color: '#f97316', label: 'ASANSOL',    value: '−12.1 mm/yr' },
  { x: 0.60, y: 0.74, risk: 'MEDIUM', color: '#eab308', label: 'KOLKATA',    value: '−4.2 mm/yr'  },
  { x: 0.49, y: 0.08, risk: 'LOW',    color: '#22c55e', label: 'DARJEELING', value: '−1.1 mm/yr'  },
  { x: 0.47, y: 0.27, risk: 'LOW',    color: '#22c55e', label: 'SILIGURI',   value: '−2.3 mm/yr'  },
];

/* rounded-rect helper (avoids browser compat issues with roundRect) */
function rrect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/* ─── Component ──────────────────────────────────────────────── */

export default function HeroCanvasBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0, frame = 0, animId = 0;

    /* Floating micro-particles */
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00015,
      vy: (Math.random() - 0.5) * 0.00015,
      r: Math.random() * 1.4 + 0.4,
      a: Math.random() * 0.35 + 0.08,
    }));

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    /* ─── Main draw loop ─── */
    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      /* 1 ── Fine geo grid ───────────────────────────────────── */
      ctx.save();
      ctx.strokeStyle = 'rgba(148,163,184,0.055)';
      ctx.lineWidth = 0.5;
      const cols = 22, rows = 14;
      for (let i = 0; i <= cols; i++) {
        ctx.beginPath(); ctx.moveTo((W / cols) * i, 0); ctx.lineTo((W / cols) * i, H); ctx.stroke();
      }
      for (let i = 0; i <= rows; i++) {
        ctx.beginPath(); ctx.moveTo(0, (H / rows) * i); ctx.lineTo(W, (H / rows) * i); ctx.stroke();
      }
      ctx.restore();

      /* 2 ── Topographic contour ellipses (centred on Raniganj) ─ */
      const cx0 = LOCS[0].x * W;
      const cy0 = LOCS[0].y * H;
      ctx.save();
      ctx.setLineDash([5, 10]);
      for (let ring = 1; ring <= 9; ring++) {
        const alpha = Math.max(0, 0.16 - ring * 0.015);
        ctx.strokeStyle = `rgba(239,68,68,${alpha})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.ellipse(cx0, cy0, ring * 58, ring * 36, -0.18, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.restore();

      /* 3 ── Subsidence ripple waves ─────────────────────────── */
      const rt = frame * 0.006;
      LOCS.filter(l => l.risk !== 'LOW').forEach(loc => {
        const lx = loc.x * W;
        const ly = loc.y * H;
        const rings = loc.risk === 'HIGH' ? 5 : 3;
        const maxR  = loc.risk === 'HIGH' ? 170 : 100;
        for (let i = 0; i < rings; i++) {
          const t = ((rt + i * (2 / rings)) % 2) / 2;
          const r = t * maxR;
          const a = (1 - t) * (loc.risk === 'HIGH' ? 0.52 : 0.32);
          ctx.beginPath();
          ctx.arc(lx, ly, r, 0, Math.PI * 2);
          ctx.strokeStyle = loc.color.replace(')', `,${a})`).replace('rgb', 'rgba');
          // Use raw rgba values
          const aMap: Record<string, [number,number,number]> = {
            '#ef4444': [239,68,68], '#f97316': [249,115,22], '#eab308': [234,179,8],
          };
          const rgb = aMap[loc.color] ?? [255,255,255];
          ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;
          ctx.lineWidth = 1.4 - t * 0.6;
          ctx.stroke();
        }
      });

      /* 4 ── Satellite orbit ellipse + moving dot ─────────────── */
      ctx.save();
      const OX = W * 0.5, OY = H * 0.22, ORX = W * 0.46, ORY = H * 0.20;
      ctx.strokeStyle = 'rgba(56,189,248,0.22)';
      ctx.lineWidth = 0.9;
      ctx.setLineDash([6, 12]);
      ctx.beginPath();
      ctx.ellipse(OX, OY, ORX, ORY, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      const satAngle = (frame * 0.004) % (Math.PI * 2);
      const satX = OX + Math.cos(satAngle) * ORX;
      const satY = OY + Math.sin(satAngle) * ORY;

      /* glow halo */
      const sg = ctx.createRadialGradient(satX, satY, 0, satX, satY, 18);
      sg.addColorStop(0, 'rgba(56,189,248,0.75)');
      sg.addColorStop(1, 'rgba(56,189,248,0)');
      ctx.fillStyle = sg;
      ctx.beginPath(); ctx.arc(satX, satY, 18, 0, Math.PI * 2); ctx.fill();

      /* sat body */
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath(); ctx.arc(satX, satY, 3.5, 0, Math.PI * 2); ctx.fill();

      /* SAR beam to Raniganj */
      const beamAlpha = 0.18 + 0.12 * Math.sin(frame * 0.04);
      ctx.strokeStyle = `rgba(56,189,248,${beamAlpha})`;
      ctx.lineWidth = 0.8;
      ctx.setLineDash([3, 7]);
      ctx.beginPath();
      ctx.moveTo(satX, satY);
      ctx.lineTo(cx0, cy0);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      /* 5 ── GIS crosshair + data chip per location ────────────── */
      LOCS.forEach((loc, idx) => {
        const lx = loc.x * W;
        const ly = loc.y * H;
        const blink = Math.sin(frame * 0.045 + idx * 1.3) > 0.25;
        const rgb: Record<string, [number,number,number]> = {
          '#ef4444': [239,68,68], '#f97316': [249,115,22],
          '#eab308': [234,179,8], '#22c55e': [34,197,94],
        };
        const [r, g, b] = rgb[loc.color] ?? [255,255,255];

        ctx.save();
        ctx.globalAlpha = 0.82;

        /* crosshair arms */
        const arm = 15;
        ctx.strokeStyle = loc.color;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(lx - arm, ly); ctx.lineTo(lx - 5, ly); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(lx + 5, ly);  ctx.lineTo(lx + arm, ly); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(lx, ly - arm); ctx.lineTo(lx, ly - 5); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(lx, ly + 5);  ctx.lineTo(lx, ly + arm); ctx.stroke();

        /* corner brackets */
        const bk = 6;
        ctx.lineWidth = 1.4;
        ([[-1,-1],[1,-1],[1,1],[-1,1]] as [number,number][]).forEach(([sx, sy]) => {
          ctx.beginPath();
          ctx.moveTo(lx + sx*(arm+bk), ly + sy*arm);
          ctx.lineTo(lx + sx*(arm+bk), ly + sy*(arm+bk));
          ctx.lineTo(lx + sx*arm,      ly + sy*(arm+bk));
          ctx.stroke();
        });

        /* blinking centre dot */
        ctx.fillStyle = blink ? loc.color : `rgba(${r},${g},${b},0.55)`;
        ctx.beginPath(); ctx.arc(lx, ly, 2.8, 0, Math.PI * 2); ctx.fill();

        if (blink) {
          ctx.strokeStyle = `rgba(${r},${g},${b},0.45)`;
          ctx.lineWidth = 0.8;
          ctx.beginPath(); ctx.arc(lx, ly, 10, 0, Math.PI * 2); ctx.stroke();
        }

        /* data chip */
        const chipX = lx + 24;
        const chipY = ly - 24;
        const cW = 92, cH = 30;
        ctx.globalAlpha = 0.78;

        ctx.fillStyle = 'rgba(10,12,30,0.88)';
        rrect(ctx, chipX, chipY, cW, cH, 3);
        ctx.fill();

        ctx.strokeStyle = `rgba(${r},${g},${b},0.65)`;
        ctx.lineWidth = 0.8;
        rrect(ctx, chipX, chipY, cW, cH, 3);
        ctx.stroke();

        /* risk badge */
        const badgeW = loc.risk === 'HIGH' ? 28 : loc.risk === 'MEDIUM' ? 40 : 24;
        ctx.fillStyle = `rgba(${r},${g},${b},0.18)`;
        rrect(ctx, chipX + 4, chipY + 4, badgeW, 9, 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${r},${g},${b},0.9)`;
        ctx.font = 'bold 6px "Courier New", monospace';
        ctx.fillText(loc.risk, chipX + 7, chipY + 11.5);

        /* name */
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.font = 'bold 8px "Courier New", monospace';
        ctx.fillText(loc.label, chipX + badgeW + 10, chipY + 12);

        /* value */
        ctx.fillStyle = loc.color;
        ctx.font = '8px "Courier New", monospace';
        ctx.fillText(loc.value, chipX + 6, chipY + 24);

        ctx.restore();
      });

      /* 6 ── Horizontal scan line ──────────────────────────────── */
      const scanY = ((frame * 0.75) % (H + 40)) - 20;
      const sg2 = ctx.createLinearGradient(0, scanY - 18, 0, scanY + 18);
      sg2.addColorStop(0,   'rgba(56,189,248,0)');
      sg2.addColorStop(0.5, 'rgba(56,189,248,0.10)');
      sg2.addColorStop(1,   'rgba(56,189,248,0)');
      ctx.fillStyle = sg2;
      ctx.fillRect(0, scanY - 18, W, 36);

      /* thin bright edge */
      ctx.fillStyle = 'rgba(56,189,248,0.22)';
      ctx.fillRect(0, scanY, W, 1);

      /* 7 ── Micro-particles ───────────────────────────────────── */
      particles.forEach(p => {
        p.x = (p.x + p.vx + 1) % 1;
        p.y = (p.y + p.vy + 1) % 1;
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148,163,184,${p.a})`;
        ctx.fill();
      });

      /* 8 ── HUD readouts (top-right) ──────────────────────────── */
      ctx.save();
      ctx.globalAlpha = 0.55;
      ctx.font = '9px "Courier New", monospace';
      const t0 = Math.floor(frame / 60);
      const readouts = [
        `▶ SAR ACQUISITION: PASS T-${String(t0 % 24).padStart(2, '0')}`,
        `▶ AOI: 21.5°N – 27.2°N | 85.8°E – 89.9°E`,
        `▶ BASELINE: ${(23.412 + Math.sin(frame * 0.01) * 0.008).toFixed(3)} m`,
        `▶ COHERENCE: 0.${72 + (frame % 10 < 5 ? 3 : 4)}`,
      ];
      readouts.forEach((line, i) => {
        ctx.fillStyle = i === 0 ? 'rgba(56,189,248,0.9)' : 'rgba(148,163,184,0.7)';
        ctx.fillText(line, W - 270, 28 + i * 16);
      });
      ctx.restore();

      /* 9 ── Vignette corners ──────────────────────────────────── */
      ctx.save();
      const vig = ctx.createRadialGradient(W/2, H/2, H*0.2, W/2, H/2, H*0.9);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(0,0,0,0.35)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      frame++;
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.85 }}
    />
  );
}
