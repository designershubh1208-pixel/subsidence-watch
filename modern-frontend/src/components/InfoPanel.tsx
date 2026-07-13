import React, { useState } from 'react';
import { AlertCircle, Activity, PlusCircle, X } from 'lucide-react';
import useSWR from 'swr';
import { fetcher, submitReport } from '../lib/api';
import type { Report } from '../lib/api';

export default function InfoPanel() {
  const { data: reports, mutate } = useSWR<Report[]>('/reports', fetcher, { refreshInterval: 10000 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [latitude, setLatitude] = useState('23.6');
  const [longitude, setLongitude] = useState('86.9');
  const [issueType, setIssueType] = useState('crack');

  const safeReports = Array.isArray(reports) ? reports : [];
  const latestReports = reports ? safeReports.slice(0, 2) : [];

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitReport({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        issue_type: issueType,
        phone_number: '555-0100' // mock phone for demo
      });
      await mutate(); // Re-fetch reports
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="info-panel glass-panel">
        {/* Latest Alerts Section */}
        <div className="panel-section">
          <div className="section-header">
            <AlertCircle size={18} className="icon-warning" />
            <h3>Latest Alerts</h3>
          </div>
          
          {!reports && <p className="status-desc">Loading alerts...</p>}
          {latestReports.map((report) => (
            <div key={report.id} className="alert-item">
              <div className={`alert-dot ${report.status === 'new' ? 'danger' : 'warning'}`}></div>
              <div className="alert-content">
                <span className="alert-title">{report.issue_type.replace('_', ' ').toUpperCase()}</span>
                <span className="alert-time">Live</span>
              </div>
            </div>
          ))}
          {reports && reports.length === 0 && <p className="status-desc">No active alerts.</p>}
        </div>

        <div className="panel-divider" />

        {/* Monitoring Status Section */}
        <div className="panel-section">
          <div className="section-header">
            <Activity size={18} className="icon-monitor" />
            <h3>Monitoring Status</h3>
          </div>
          <p className="status-desc">
            Sentinel-1 SAR telemetry actively scanning critical zones across the Raniganj coalbelt region.
          </p>
        </div>

        {/* Call to Action */}
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <PlusCircle size={18} />
          Report Concern
        </button>
      </div>

      {/* Report Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h3>Submit Community Report</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleReportSubmit} className="report-form">
              <div className="form-group">
                <label>Latitude</label>
                <input 
                  type="text" 
                  value={latitude} 
                  onChange={(e) => setLatitude(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Longitude</label>
                <input 
                  type="text" 
                  value={longitude} 
                  onChange={(e) => setLongitude(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Issue Type</label>
                <select value={issueType} onChange={(e) => setIssueType(e.target.value)}>
                  <option value="crack">Surface Crack</option>
                  <option value="uneven_ground">Uneven Ground</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
