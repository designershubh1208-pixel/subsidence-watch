import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, AlertTriangle } from 'lucide-react';

export default function HeroV2() {
  return (
    <section className="w-full max-w-[1200px] mx-auto pt-24 pb-16 px-6 text-center">
      
      {/* Badge */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-primary text-xs font-semibold uppercase tracking-wider mb-8"
      >
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
        Active Monitoring: West Bengal
      </motion.div>

      {/* Headline */}
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-5xl md:text-7xl font-bold text-text-primary tracking-tight leading-[1.1] mb-6"
      >
        Monitor Ground Stability <br className="hidden md:block" />
        Across West Bengal
      </motion.h1>

      {/* Subheadline */}
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-lg md:text-xl text-text-secondary max-w-[700px] mx-auto leading-relaxed mb-10"
      >
        AI-powered satellite monitoring combined with community reporting to detect and visualize potential land subsidence before it becomes a larger risk.
      </motion.p>

      {/* CTAs */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <button className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2">
          Explore Live Map
          <ArrowRight size={18} />
        </button>
        <button className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2">
          <AlertTriangle size={18} className="text-warning" />
          Report a Concern
        </button>
      </motion.div>

    </section>
  );
}
