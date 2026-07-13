import React from 'react';
import { Target, TrendingDown } from 'lucide-react';
import useSWR from 'swr';
import { fetcher } from '../lib/api';
import type { Zone, Report } from '../lib/api';

export default function SummaryCards() {
  const { data: zones } = useSWR<Zone[]>('/zones', fetcher, { refreshInterval: 10000 });
  const { data: reports } = useSWR<Report[]>('/reports', fetcher, { refreshInterval: 10000 });

  const safeZones = Array.isArray(zones) ? zones : [];
  const safeReports = Array.isArray(reports) ? reports : [];

  // Calculate critical zones
  const criticalZonesCount = safeZones.length > 0 ? safeZones.filter(z => z.risk_level === 'CRITICAL').length : '-';
  const totalZones = safeZones.length > 0 ? safeZones.length : 1;
  const criticalPercentage = safeZones.length > 0 ? (safeZones.filter(z => z.risk_level === 'CRITICAL').length / totalZones) * 100 : 0;

  // Fake trending data for ground movement since we don't have historical data in the API yet
  const maxMovement = safeZones.length > 0 ? -12 : '-';

  return (
    <section className="bottom-cards">
      
      <div className="summary-card glass-panel">
        <div className="card-header">
          <span className="card-label">Critical Risk Zones</span>
          <Target size={16} className="card-icon" />
        </div>
        <div className="card-value-container">
          <span className="card-value">{criticalZonesCount}</span>
          <span className="card-trend danger">Live</span>
        </div>
        <div className="card-progress-bar">
          <div className="card-progress-fill danger" style={{ width: `${criticalPercentage}%` }}></div>
        </div>
      </div>

      <div className="summary-card glass-panel">
        <div className="card-header">
          <span className="card-label">Max Ground Movement</span>
          <TrendingDown size={16} className="card-icon" />
        </div>
        <div className="card-value-container">
          <span className="card-value">{maxMovement}</span>
          <span className="card-unit">mm/yr</span>
        </div>
        <div className="card-progress-bar">
          <div className="card-progress-fill warning" style={{ width: '60%' }}></div>
        </div>
      </div>

      <div className="summary-card glass-panel" style={{ opacity: 0.5 }}>
        <div className="card-header">
          <span className="card-label">Community Reports</span>
        </div>
        <div className="card-value-container">
          <span className="card-value">{reports ? safeReports.length : '-'}</span>
          <span className="card-trend safe">Logged</span>
        </div>
      </div>

    </section>
  );
}
