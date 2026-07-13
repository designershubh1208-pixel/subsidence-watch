import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { label: 'Zones Monitored', value: '142' },
  { label: 'Community Reports', value: '1,204' },
  { label: 'Satellite Updates', value: 'Live' },
  { label: 'Risk Assessments', value: '48' },
];

export default function HeroStats() {
  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="w-full max-w-[1000px] mx-auto mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 px-6 pb-24"
    >
      {stats.map((stat, index) => (
        <div key={index} className="flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold text-text-primary mb-1">{stat.value}</div>
          <div className="text-sm font-medium text-text-muted">{stat.label}</div>
        </div>
      ))}
    </motion.div>
  );
}
