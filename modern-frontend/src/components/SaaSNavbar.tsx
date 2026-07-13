import React from 'react';
import { Map, Activity, FileText, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SaaSNavbar() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 w-full bg-surface/80 backdrop-blur-md border-b border-border"
    >
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center">
            <Activity size={18} />
          </div>
          <span className="font-semibold text-text-primary tracking-tight text-lg">
            Subsidence Watch
          </span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#map" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2">
            <Map size={16} />
            Live Map
          </a>
          <a href="#statistics" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2">
            <Activity size={16} />
            Statistics
          </a>
          <a href="#reports" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2">
            <FileText size={16} />
            Reports
          </a>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <button className="hidden lg:block text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
            Documentation
          </button>
          <button className="bg-text-primary hover:bg-black text-white text-sm font-medium px-4 py-2 rounded-md transition-colors flex items-center gap-2 shadow-sm">
            <LayoutDashboard size={16} />
            Gov Dashboard
          </button>
        </div>

      </div>
    </motion.nav>
  );
}
