import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import HaloLandingPage from './components/halo/HaloLandingPage';
import DashboardPage   from './pages/DashboardPage';
import RiskZonesPage   from './pages/RiskZonesPage';
import ReportsPage     from './pages/ReportsPage';
import ResearchPage    from './pages/ResearchPage';
import AboutPage       from './pages/AboutPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<HaloLandingPage />} />
        <Route path="/dashboard"  element={<DashboardPage />}  />
        <Route path="/risk-zones" element={<RiskZonesPage />}  />
        <Route path="/reports"    element={<ReportsPage />}    />
        <Route path="/research"   element={<ResearchPage />}   />
        <Route path="/about"      element={<AboutPage />}      />
      </Routes>
    </BrowserRouter>
  );
}
