import React from 'react';
import HaloNavbar from './HaloNavbar';

export default function HaloLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F8FAFC' }}>
      <HaloNavbar mode="solid" />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
