import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Target } from 'lucide-react';

export default function HeroMap() {
  return (
    <motion.div 
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[1200px] mx-auto px-6 relative z-10"
    >
      {/* Subtle Atmospheric Glow Behind the Map */}
      <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full z-0 pointer-events-none"></div>

      {/* Main Map Container */}
      <div className="relative z-10 w-full aspect-[16/9] md:aspect-[21/9] bg-[#0A1128] rounded-2xl border border-white/10 shadow-2xl overflow-hidden ring-1 ring-black/5">
        
        {/* Base Terrain Texture (Simulated with CSS gradient for now) */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-[#0A1128] to-[#0A1128]"></div>

        {/* Heatmap Overlay (Static CSS simulation) */}
        <div className="absolute top-[30%] left-[40%] w-[40%] h-[50%] bg-danger/20 blur-[60px] rounded-full mix-blend-screen"></div>
        <div className="absolute top-[45%] left-[55%] w-[20%] h-[30%] bg-warning/30 blur-[40px] rounded-full mix-blend-screen"></div>

        {/* Animated Satellite Scanning Effect */}
        <motion.div 
          animate={{ top: ['-10%', '110%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-[2px] bg-info/50 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-20"
        />

        {/* Data Pins & Monitoring Circles */}
        
        {/* Primary Hotspot */}
        <div className="absolute top-[40%] left-[45%] z-30 flex flex-col items-center">
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-12 h-12 bg-danger/20 rounded-full"
          />
          <div className="w-3 h-3 bg-danger rounded-full shadow-[0_0_10px_rgba(239,68,68,1)] z-10 relative"></div>
          <div className="mt-2 px-2 py-1 bg-surface/90 backdrop-blur text-[10px] font-semibold text-text-primary rounded shadow border border-border">
            Zone A (High Risk)
          </div>
        </div>

        {/* Secondary Hotspot */}
        <div className="absolute top-[60%] left-[65%] z-30 flex flex-col items-center">
          <motion.div 
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute w-16 h-16 bg-warning/20 rounded-full"
          />
          <Target size={14} className="text-warning z-10 relative" />
        </div>

        {/* Community Report Pin */}
        <div className="absolute top-[35%] left-[60%] z-30 flex flex-col items-center">
          <MapPin size={16} className="text-info drop-shadow-md relative z-10 animate-bounce" style={{ animationDuration: '3s' }} />
          <div className="mt-1 px-2 py-0.5 bg-surface/90 backdrop-blur text-[9px] font-medium text-text-secondary rounded shadow border border-border">
            Recent Report
          </div>
        </div>

        {/* UI Overlay inside Map (Like a true SaaS dashboard preview) */}
        <div className="absolute top-4 left-4 flex gap-2 z-40">
          <div className="px-3 py-1.5 bg-surface/80 backdrop-blur-md rounded-md border border-white/20 text-xs font-medium text-text-primary shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success"></span>
            Live Data Feed Active
          </div>
        </div>

      </div>
    </motion.div>
  );
}
