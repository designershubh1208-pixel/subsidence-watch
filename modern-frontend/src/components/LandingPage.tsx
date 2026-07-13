import React from 'react';
import SaaSNavbar from './SaaSNavbar';
import HeroV2 from './HeroV2';
import HeroMap from './HeroMap';
import HeroStats from './HeroStats';
import Features from './Features';
import HowItWorks from './HowItWorks';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-primary/20 overflow-x-hidden">
      <SaaSNavbar />
      
      <main className="flex flex-col w-full relative">
        {/* Subtle background decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        
        <HeroV2 />
        <HeroMap />
        <HeroStats />
        <Features />
        <HowItWorks />
      </main>
      
    </div>
  );
}
