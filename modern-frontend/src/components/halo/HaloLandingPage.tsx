import React from 'react';
import HaloNavbar from './HaloNavbar';
import HeroSection from './HeroSection';
import InfoSection from './InfoSection';
import BackedBySection from './BackedBySection';
import UseCasesSection from './UseCasesSection';

export default function HaloLandingPage() {
  return (
    <div className="flex flex-col bg-[#F5F5F5]">
      {/* ── First screen: Navbar + Hero (h-screen) ── */}
      <div className="h-screen flex flex-col overflow-hidden">
        <HaloNavbar />
        <HeroSection />
      </div>

      {/* ── Below-fold sections ── */}
      <InfoSection />
      <BackedBySection />
      <UseCasesSection />
    </div>
  );
}
