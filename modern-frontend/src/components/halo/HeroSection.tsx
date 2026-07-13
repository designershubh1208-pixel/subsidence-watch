import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroCanvasBg from './HeroCanvasBg';

const BRANDS = ['Sentinel-1', 'Earth Engine', 'InSAR', 'PostGIS', 'FastAPI', 'Raniganj', 'ISRO'];

export default function HeroSection() {
  return (
    <div className="flex-1 px-6 pt-24 pb-10 flex items-center justify-center min-h-[calc(100vh-80px)]">
      {/* Premium Hero Card */}
      <div
        className="relative w-full max-w-[88rem] rounded-[2rem] overflow-hidden border border-white/10"
        style={{
          height: '76vh',
          minHeight: '600px',
          background: 'radial-gradient(ellipse at 50% -20%, #1e293b 0%, #0f172a 40%, #020617 100%)',
          boxShadow: '0 20px 40px -20px rgba(0,0,0,0.5)',
        }}
      >
        {/* Background Canvas (Map Visuals) */}
        <div className="absolute inset-0" style={{ opacity: 0.15, mixBlendMode: 'screen' }}>
          <HeroCanvasBg />
        </div>

        {/* Soft radial glow at top */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at top, rgba(14,165,233,0.15) 0%, transparent 60%)',
          }}
        />

        {/* Overlay to ensure text readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(2,6,23,0) 0%, rgba(2,6,23,0.8) 100%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 md:p-12 text-center">
          
          {/* Subtle top badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold uppercase tracking-widest mb-8 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            Live Monitoring
          </div>

          {/* Headline */}
          <h1
            className="text-white text-5xl md:text-[5.5rem] font-bold leading-[1.05] max-w-4xl mb-6 tracking-tighter"
          >
            Your Ground,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400">
              Watched.
            </span>
          </h1>

          {/* Sub-copy */}
          <p
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
          >
            An automated, satellite-powered ground subsidence monitoring platform
            built for real-time risk detection and community safety in coal mining
            regions.
          </p>

          {/* Premium CTA */}
          <Link 
            to="/risk-zones" 
            className="inline-flex items-center gap-3 bg-white text-slate-900 text-sm md:text-base font-bold pl-7 pr-2.5 py-2.5 rounded-full hover:bg-slate-50 transition-all duration-300 shadow-[0_0_30px_rgba(14,165,233,0.15)] hover:shadow-[0_0_50px_rgba(14,165,233,0.3)] hover:-translate-y-0.5 no-underline group"
          >
            Explore Risk Zones
            <span className="bg-slate-900 rounded-full p-2 group-hover:bg-sky-600 transition-colors duration-300">
              <ArrowRight className="w-4 h-4 text-white" />
            </span>
          </Link>

          {/* Tech Stack Bar (Professional & Uniform) */}
          <div className="mt-auto pt-16 w-full max-w-3xl flex flex-col items-center gap-6 overflow-hidden">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Powered by open data & modern infrastructure
            </p>
            <div className="marquee-track">
              {[...BRANDS, ...BRANDS].map((brand, i) => (
                <span
                  key={i}
                  className="mx-8 shrink-0 text-slate-400 text-sm font-bold tracking-widest uppercase opacity-60 whitespace-nowrap"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
