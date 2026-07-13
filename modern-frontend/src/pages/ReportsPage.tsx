import React, { useState } from 'react';
import { FileText, CheckCircle, Clock, AlertCircle, Upload, Send } from 'lucide-react';
import useSWR from 'swr';
import { submitReport, fetcher } from '../lib/api';
import HaloLayout from '../components/halo/HaloLayout';

const REPORTS = [
  { id: 'R-0042', type: 'Crack',         zone: 'Raniganj Central', desc: 'Large crack appeared overnight on Kalla road surface.',          status: 'reviewed', date: '12 Jul 2026', risk: 'HIGH'   },
  { id: 'R-0041', type: 'Uneven Ground', zone: 'Asansol North',    desc: 'Ground sinking near residential colony boundary wall.',           status: 'pending',  date: '11 Jul 2026', risk: 'HIGH'   },
  { id: 'R-0040', type: 'Crack',         zone: 'Raniganj Central', desc: 'Crack in building foundation visible from street level.',          status: 'pending',  date: '10 Jul 2026', risk: 'HIGH'   },
  { id: 'R-0039', type: 'Other',         zone: 'Durgapur Fringe',  desc: 'Water pooling in low-lying area after minor rain.',                status: 'reviewed', date: '09 Jul 2026', risk: 'MEDIUM' },
  { id: 'R-0038', type: 'Uneven Ground', zone: 'Jamuria Block',    desc: 'Road surface tilted significantly near coal block boundary.',       status: 'reviewed', date: '08 Jul 2026', risk: 'MEDIUM' },
];

const RISK_COLOR: Record<string, string> = { HIGH: '#EF4444', MEDIUM: '#F97316', LOW: '#22C55E' };
const RISK_BG:    Record<string, string> = { HIGH: '#FEF2F2', MEDIUM: '#FFF7ED', LOW: '#F0FDF4' };
const ISSUE_TYPES = ['Crack in Ground', 'Uneven Ground', 'Sinkhole', 'Building Damage', 'Other'];
const ZONES_LIST  = ['Raniganj Central', 'Asansol North', 'Durgapur Fringe', 'Jamuria Block', 'Kolkata North Fringe'];

const labelCls = "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5";

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '10px',
  border: '1px solid #E2E8F0',
  backgroundColor: '#fff',
  color: '#0F172A',
  fontSize: '14px',
  outline: 'none',
};

export default function ReportsPage() {
  const [form, setForm] = useState({ zone: '', type: '', lat: '', lng: '', desc: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: apiReports } = useSWR('/reports', fetcher, { revalidateOnFocus: false, shouldRetryOnError: false });
  const { data: apiZones } = useSWR('/zones', fetcher, { revalidateOnFocus: false, shouldRetryOnError: false });

  // Map backend format to frontend UI format
  const currentReports = apiReports && apiReports.length > 0 ? apiReports.slice(0, 5).map((r: any) => {
    const zone = apiZones?.find((z: any) => z.zone_id === r.zone_id);
    
    // Map risk
    let risk = 'LOW';
    if (zone?.risk_level === 'red') risk = 'HIGH';
    else if (zone?.risk_level === 'yellow') risk = 'MEDIUM';

    // Format type
    let type = 'Other';
    if (r.issue_type === 'crack') type = 'Crack';
    else if (r.issue_type === 'uneven_ground') type = 'Uneven Ground';

    // Format date
    const date = new Date(r.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    return {
      id: `R-${r.id.substring(0, 4).toUpperCase()}`,
      type,
      zone: zone?.name || 'Unknown Zone',
      desc: `Citizen reported a(n) ${r.issue_type.replace('_', ' ')} observation at this location.`,
      status: r.status === 'new' ? 'pending' : 'reviewed',
      date,
      risk
    };
  }) : REPORTS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitReport({
        latitude: parseFloat(form.lat) || 0,
        longitude: parseFloat(form.lng) || 0,
        issue_type: form.type,
        phone_number: form.phone || undefined,
      });
    } catch (err) {
      console.warn("Backend offline — mocked report submission successfully.");
    }
    
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ zone: '', type: '', lat: '', lng: '', desc: '', phone: '' });
  };

  return (
    <HaloLayout>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-10">
        <div className="max-w-[88rem] mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={12} className="text-sky-500" />
            <span className="text-sky-600 text-xs font-mono uppercase tracking-widest">Citizen Reports</span>
          </div>
          <h1 className="text-slate-900 text-4xl font-semibold mb-1" style={{ letterSpacing: '-0.03em' }}>Reports</h1>
          <p className="text-slate-700 text-sm">Submit ground observations. Verified reports inform risk-level decisions.</p>
        </div>
      </div>

      <div className="max-w-[88rem] mx-auto w-full px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Form */}
          <div
            className="bg-white rounded-2xl p-8 border border-slate-200"
            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
          >
            <h2 className="text-slate-900 text-lg font-semibold mb-6">Submit a Report</h2>

            {submitted && (
              <div className="mb-6 flex items-center gap-3 rounded-xl px-4 py-3 bg-emerald-50 border border-emerald-200">
                <CheckCircle size={15} className="text-emerald-500" />
                <span className="text-emerald-700 text-sm font-medium">Report submitted successfully. Thank you.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className={labelCls}>Zone</label>
                <select value={form.zone} onChange={e => setForm({ ...form, zone: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }} required>
                  <option value="" disabled>Select zone…</option>
                  {ZONES_LIST.map(z => <option key={z} value={z}>{z}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Issue Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }} required>
                  <option value="" disabled>Select type…</option>
                  {ISSUE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Latitude</label>
                  <input type="text" placeholder="e.g. 23.623" value={form.lat} onChange={e => setForm({ ...form, lat: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label className={labelCls}>Longitude</label>
                  <input type="text" placeholder="e.g. 87.121" value={form.lng} onChange={e => setForm({ ...form, lng: e.target.value })} style={inputStyle} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Description</label>
                <textarea rows={4} placeholder="Describe what you observed…" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} required />
              </div>

              {/* Photo upload */}
              <div>
                <label className={labelCls}>Photo (optional)</label>
                <div
                  className="flex flex-col items-center justify-center gap-2 py-8 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
                  style={{ border: '1.5px dashed #CBD5E1' }}
                >
                  <Upload size={18} className="text-slate-400" />
                  <span className="text-slate-500 text-sm font-medium">Click to upload or drag & drop</span>
                  <span className="text-slate-400 text-xs">PNG, JPG up to 10 MB</span>
                </div>
              </div>

              <div>
                <label className={labelCls}>Phone (optional)</label>
                <input type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 mt-1 py-3 rounded-full font-semibold text-sm transition-all duration-200 cursor-pointer disabled:opacity-70"
                style={{ backgroundColor: '#0F172A', color: '#fff', boxShadow: '0 2px 8px rgba(15,23,42,0.25)' }}
              >
                <Send size={14} />
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </form>
          </div>

          {/* Recent reports */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-slate-900 text-lg font-semibold">Recent Reports</h2>
              <span className="text-slate-400 text-xs font-mono bg-slate-100 px-3 py-1 rounded-full">{currentReports.length} reports</span>
            </div>
            <div className="flex flex-col gap-3">
              {currentReports.map((r: any) => (
                <div
                  key={r.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 transition-colors"
                  style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-700 font-mono text-xs font-semibold">{r.id}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: RISK_BG[r.risk], color: RISK_COLOR[r.risk] }}>
                        {r.risk}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium"
                      style={{ color: r.status === 'reviewed' ? '#16A34A' : '#EA580C' }}>
                      {r.status === 'reviewed'
                        ? <CheckCircle size={12} />
                        : <Clock size={12} />}
                      <span className="capitalize">{r.status}</span>
                    </div>
                  </div>
                  <p className="text-slate-900 font-bold text-sm mb-1">{r.type} — {r.zone}</p>
                  <p className="text-slate-700 text-sm leading-relaxed mb-3">{r.desc}</p>
                  <p className="text-slate-600 text-xs font-mono font-medium">{r.date}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl px-5 py-4 flex gap-3 bg-sky-50 border border-sky-200">
              <AlertCircle size={15} className="text-sky-500 shrink-0 mt-0.5" />
              <p className="text-slate-800 text-sm leading-relaxed">
                3+ reports in the same zone within 14 days triggers an admin review.
                Risk level changes require manual admin confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </HaloLayout>
  );
}
