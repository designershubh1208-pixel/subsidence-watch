import React from 'react';
import { Map, ShieldCheck } from 'lucide-react';

export default function TopNav() {
  return (
    <header className="top-nav glass-panel">
      <div className="nav-container">
        
        {/* Left Side: Logo/Brand */}
        <div className="nav-brand">
          <div className="brand-icon-wrapper">
             <Map className="brand-icon" size={20} />
          </div>
          <span className="brand-text">SubsidenceWatch</span>
        </div>

        {/* Center: Main Navigation Links */}
        <nav className="nav-links">
          <a href="#" className="nav-link active">Explore Live Map</a>
          <a href="#" className="nav-link">Community Reports</a>
          <a href="#" className="nav-link">Earth Observation</a>
        </nav>

        {/* Right Side: Admin / Status */}
        <div className="nav-actions">
          <div className="system-status">
            <span className="status-dot safe"></span>
            <span className="status-text">System Online</span>
          </div>
          <button className="btn-admin">
            <ShieldCheck size={18} />
            <span>Admin Login</span>
          </button>
        </div>

      </div>
    </header>
  );
}
