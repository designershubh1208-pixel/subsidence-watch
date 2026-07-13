import React, { useState } from 'react';
import {
  Activity, AlertTriangle, Clock, TrendingDown,
  Satellite, Radio, Map, ArrowUpRight,
} from 'lucide-react';
import useSWR from 'swr';
import { fetcher } from '../lib/api';
import HaloLayout from '../components/halo/HaloLayout';

/* ─── Data ──────────────────────────────────────────── */
const STATS = [
  { label: 'Active Zones',      value: '5',    sub: 'being monitored',  Icon: Map,           accent: '#0EA5E9' },
  { label: 'High Risk',         value: '2',    sub: 'zones flagged',    Icon: AlertTriangle,  accent: '#EF4444' },
  { label: 'Reports (7 days)',  value: '8',    sub: 'citizen reports',  Icon: Radio,          accent: '#F97316' },
  { label: 'Last SAR Pass',     value: 'T-06', sub: '6 hours ago',      Icon: Satellite,      accent: '#22C55E' },
];

const ZONES = [
  { name: 'Raniganj Central', district: 'Paschim Bardhaman', risk: 'HIGH',   mm: '-18.4', trend: -2.1, lat: '23.62°N', lon: '87.12°E' },
  { name: 'Asansol North',    district: 'Paschim Bardhaman', risk: 'HIGH',   mm: '-12.1', trend: -0.8, lat: '23.68°N', lon: '87.01°E' },
  { name: 'Durgapur Fringe',  district: 'Paschim Bardhaman', risk: 'MEDIUM', mm: '-6.3',  trend: -0.3, lat: '23.53°N', lon: '87.32°E' },
  { name: 'Kolkata North',    district: 'North 24 Parganas', risk: 'MEDIUM', mm: '-4.2',  trend: +0.1, lat: '22.65°N', lon: '88.38°E' },
  { name: 'Siliguri Plains',  district: 'Darjeeling',        risk: 'LOW',    mm: '-2.3',  trend: +0.2, lat: '26.71°N', lon: '88.43°E' },
];

const ALERTS = [
  { time: '09:12', msg: 'Raniganj Central exceeded −18 mm/yr threshold', type: 'danger'  },
  { time: '07:44', msg: 'New citizen report filed — Asansol North zone', type: 'warning' },
  { time: '02:18', msg: 'SAR acquisition complete — Pass T-06',           type: 'info'   },
  { time: 'Yesterday', msg: 'Admin reviewed 3 pending reports',           type: 'success'},
  { time: 'Yesterday', msg: 'Durgapur Fringe upgraded to MEDIUM risk',   type: 'warning' },
];

const RISK_COLOR: Record<string, string> = { HIGH: '#EF4444', MEDIUM: '#F97316', LOW: '#22C55E' };
const RISK_BG:    Record<string, string> = { HIGH: '#FEF2F2', MEDIUM: '#FFF7ED', LOW: '#F0FDF4' };
const ALERT_DOT:  Record<string, string> = { danger:'#EF4444', warning:'#F97316', info:'#0EA5E9', success:'#22C55E' };

/* ─── Component ─────────────────────────────────────── */
export default function DashboardPage() {
  const [activeFilter, setActiveFilter] = useState('ALL');

  const { data: apiZones } = useSWR('/zones', fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false, // Don't spam if backend is down
  });

  const mapRisk = (color: string) => {
    if (color === 'red') return 'HIGH';
    if (color === 'yellow') return 'MEDIUM';
    if (color === 'green') return 'LOW';
    return 'LOW';
  };

  const currentZones = ZONES.map(z => {
    const backendZone = apiZones?.find((bz: any) => bz.name === z.name);
    if (backendZone) {
      return { ...z, risk: mapRisk(backendZone.risk_level) };
    }
    return z; // Fallback to static if backend fails
  });

  const filtered = activeFilter === 'ALL'
    ? currentZones
    : currentZones.filter(z => z.risk === activeFilter);

  return (
    <HaloLayout>
      {/* Page header */}
      <div className="bg-white border-b border-slate-200 px-6 py-10">
        <div className="max-w-[88rem] mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-700 text-xs font-semibold uppercase tracking-widest">Live Monitoring</span>
          </div>
          <h1 className="text-slate-900 text-4xl font-semibold mb-1" style={{ letterSpacing: '-0.03em' }}>
            Dashboard
          </h1>
          <p className="text-slate-700 text-sm">
            Ground subsidence overview — Raniganj Coalfield, West Bengal
          </p>
        </div>
      </div>

      <div className="px-6 py-8 max-w-[88rem] mx-auto w-full">

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map(({ label, value, sub, Icon, accent }) => (
            <div
              key={label}
              className="bg-white rounded-2xl p-6 border border-slate-200"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-700 text-sm font-medium">{label}</span>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accent}15` }}>
                  <Icon size={16} style={{ color: accent }} />
                </div>
              </div>
              <p className="text-slate-900 text-3xl font-bold mb-1" style={{ letterSpacing: '-0.04em' }}>{value}</p>
              <p className="text-slate-600 text-xs">{sub}</p>
            </div>
          ))}
        </div>

        {/* Main 2-col layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Zone table */}
          <div
            className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden"
            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
          >
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
              <h2 className="text-slate-900 font-bold text-sm">Zone Status</h2>
              <div className="flex gap-2">
                {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(f => {
                  const color = f === 'ALL' ? '#0EA5E9' : RISK_COLOR[f];
                  const active = activeFilter === f;
                  return (
                    <button
                      key={f}
                      onClick={() => setActiveFilter(f)}
                      className="text-xs px-3 py-1 rounded-full font-medium transition-all duration-150 cursor-pointer"
                      style={{
                        backgroundColor: active ? `${color}15` : '#F8FAFC',
                        color:           active ? color : '#94A3B8',
                        border:          `1px solid ${active ? `${color}40` : '#E2E8F0'}`,
                      }}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>

            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {['Zone', 'District', 'Risk', 'Displacement', 'Trend'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs text-slate-600 font-bold uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(z => (
                  <tr
                    key={z.name}
                    className="hover:bg-slate-50 transition-colors duration-100"
                  >
                    <td className="px-6 py-4">
                      <p className="text-slate-900 text-sm font-medium">{z.name}</p>
                      <p className="text-slate-600 text-xs font-mono">{z.lat} {z.lon}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-700 text-sm font-medium">{z.district}</td>
                    <td className="px-6 py-4">
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-semibold"
                        style={{
                          backgroundColor: RISK_BG[z.risk],
                          color: RISK_COLOR[z.risk],
                        }}
                      >
                        {z.risk}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm font-semibold" style={{ color: RISK_COLOR[z.risk] }}>
                      {z.mm} mm/yr
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="flex items-center gap-1 text-xs font-mono font-medium"
                        style={{ color: z.trend < 0 ? '#EF4444' : '#22C55E' }}
                      >
                        <TrendingDown size={11} />
                        {z.trend > 0 ? '+' : ''}{z.trend}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Activity + SAR */}
          <div className="flex flex-col gap-4">
            <div
              className="bg-white rounded-2xl border border-slate-200 flex-1"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                <Activity size={14} className="text-sky-500" />
                <h2 className="text-slate-900 font-semibold text-sm">Recent Activity</h2>
              </div>
              <div className="px-6 py-5 flex flex-col gap-4">
                {ALERTS.map((a, i) => (
                  <div key={i} className="flex gap-3">
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: ALERT_DOT[a.type] }}
                    />
                    <div>
                      <p className="text-slate-900 text-sm leading-snug font-medium">{a.msg}</p>
                      <p className="text-slate-600 text-xs mt-0.5 font-mono">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SAR Pass card */}
            <div
              className="bg-white rounded-2xl border border-sky-200 p-6"
              style={{ boxShadow: '0 1px 4px rgba(14,165,233,0.08)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Satellite size={14} className="text-sky-500" />
                <span className="text-sky-600 text-xs font-semibold uppercase tracking-wider">Next SAR Pass</span>
              </div>
              <p className="text-slate-900 text-2xl font-bold font-mono mb-1">18h 24m</p>
              <p className="text-slate-600 text-xs mb-4 font-medium">Sentinel-1 Ascending · T-07</p>
              <div className="h-1.5 rounded-full bg-sky-100">
                <div className="h-1.5 rounded-full bg-sky-500" style={{ width: '72%' }} />
              </div>
              <p className="text-sky-700 text-xs mt-2 font-semibold">72% coverage complete</p>
            </div>
          </div>
        </div>
      </div>
    </HaloLayout>
  );
}
