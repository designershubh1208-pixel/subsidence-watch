import React, { useState, useEffect } from 'react';
import { MapPin, Filter } from 'lucide-react';
import useSWR from 'swr';
import { fetcher } from '../lib/api';
import HaloLayout from '../components/halo/HaloLayout';
import 'leaflet/dist/leaflet.css';

const ZONES = [
  { id: 1, name: 'Raniganj Central', district: 'Paschim Bardhaman', risk: 'HIGH',   mm: -18.4, area: '42 km²', lat: 23.623, lng: 87.121, desc: 'Primary high-risk zone. Active coal extraction causing significant land displacement.' },
  { id: 2, name: 'Asansol North',    district: 'Paschim Bardhaman', risk: 'HIGH',   mm: -12.1, area: '28 km²', lat: 23.681, lng: 87.013, desc: 'Secondary high-risk zone adjacent to Asansol city limits. Active sinkholes reported.' },
  { id: 3, name: 'Durgapur Fringe',  district: 'Paschim Bardhaman', risk: 'MEDIUM', mm: -6.3,  area: '35 km²', lat: 23.532, lng: 87.318, desc: 'Medium risk industrial fringe zone. Monitoring for escalation.' },
  { id: 4, name: 'Jamuria Block',    district: 'Paschim Bardhaman', risk: 'MEDIUM', mm: -4.7,  area: '19 km²', lat: 23.703, lng: 87.054, desc: 'Coal block area with moderate subsidence. Citizen reports pending review.' },
  { id: 5, name: 'Kolkata North Fringe', district: 'North 24 Parganas', risk: 'LOW', mm: -2.3, area: '61 km²', lat: 22.651, lng: 88.384, desc: 'Urban fringe area. Low risk but monitored for urban development impacts.' },
];

const RISK_COLOR:  Record<string, string> = { HIGH: '#EF4444', MEDIUM: '#F97316', LOW: '#22C55E' };
const RISK_BG:     Record<string, string> = { HIGH: '#FEF2F2', MEDIUM: '#FFF7ED', LOW: '#F0FDF4' };
const RISK_RADIUS: Record<string, number> = { HIGH: 6000, MEDIUM: 4000, LOW: 2500 };

export default function RiskZonesPage() {
  const [filter, setFilter]     = useState('ALL');
  const [selected, setSelected] = useState<number | null>(null);
  const [MapReady, setMapReady] = useState(false);

  useEffect(() => { setMapReady(true); }, []);

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

  const visible = filter === 'ALL' ? currentZones : currentZones.filter(z => z.risk === filter);

  return (
    <HaloLayout>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-10">
        <div className="max-w-[88rem] mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={12} className="text-sky-500" />
            <span className="text-sky-700 text-xs font-semibold uppercase tracking-widest">West Bengal · Raniganj Coalfield</span>
          </div>
          <h1 className="text-slate-900 text-4xl font-semibold mb-1" style={{ letterSpacing: '-0.03em' }}>
            Risk Zones
          </h1>
          <p className="text-slate-700 text-sm">
            Satellite-derived ground subsidence risk zones. Updated with each Sentinel-1 pass.
          </p>
        </div>
      </div>

      <div className="max-w-[88rem] mx-auto w-full px-6 py-8">

        {/* Filters */}
        <div className="flex items-center gap-3 mb-5">
          <Filter size={13} className="text-slate-400" />
          <span className="text-slate-400 text-sm">Filter:</span>
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(f => {
            const color = f === 'ALL' ? '#0EA5E9' : RISK_COLOR[f];
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="text-xs px-4 py-1.5 rounded-full font-semibold cursor-pointer transition-all duration-150"
                style={{
                  backgroundColor: active ? `${color}15` : '#fff',
                  color: active ? color : '#94A3B8',
                  border: `1px solid ${active ? `${color}40` : '#E2E8F0'}`,
                }}
              >
                {f}
              </button>
            );
          })}
          <span className="ml-auto text-slate-700 text-xs font-mono font-semibold">{visible.length} zones</span>
        </div>

        {/* Map */}
        <div
          className="bg-white rounded-2xl overflow-hidden mb-6 border border-slate-200 relative z-0"
          style={{ height: '440px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
        >
          {MapReady && (
            <LeafletMap zones={visible} selectedId={selected} onSelect={setSelected} />
          )}
        </div>

        {/* Zone cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map(z => (
            <div
              key={z.id}
              onClick={() => setSelected(z.id === selected ? null : z.id)}
              className="bg-white rounded-2xl p-6 cursor-pointer transition-all duration-200 border"
              style={{
                borderColor: selected === z.id ? RISK_COLOR[z.risk] : '#E2E8F0',
                boxShadow: selected === z.id
                  ? `0 0 0 3px ${RISK_COLOR[z.risk]}18, 0 1px 4px rgba(0,0,0,0.06)`
                  : '0 1px 4px rgba(0,0,0,0.05)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-bold"
                  style={{ backgroundColor: RISK_BG[z.risk], color: RISK_COLOR[z.risk] }}
                >
                  {z.risk}
                </span>
                <span className="text-slate-400 text-xs font-mono">{z.area}</span>
              </div>
              <h3 className="text-slate-900 font-semibold mb-0.5">{z.name}</h3>
              <p className="text-slate-700 text-xs mb-3 font-medium">{z.district}</p>
              <p className="text-slate-800 text-sm leading-relaxed mb-4">{z.desc}</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-slate-600 text-xs font-semibold">Displacement rate</span>
                <span className="font-mono text-sm font-bold" style={{ color: RISK_COLOR[z.risk] }}>
                  {z.mm} mm/yr
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </HaloLayout>
  );
}

/* ── Leaflet sub-component ───────────────────────────── */
function LeafletMap({
  zones, selectedId, onSelect,
}: { zones: typeof ZONES; selectedId: number | null; onSelect: (id: number) => void }) {
  const [Comps, setComps] = useState<any>(null);

  useEffect(() => {
    Promise.all([import('react-leaflet'), import('leaflet')]).then(([rl, L]) => {
      delete (L.default.Icon.Default.prototype as any)._getIconUrl;
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });
      setComps(rl);
    });
  }, []);

  if (!Comps) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-50">
        <span className="text-slate-400 text-sm">Loading map…</span>
      </div>
    );
  }

  const { MapContainer, TileLayer, Circle, Tooltip } = Comps;
  return (
    <MapContainer center={[23.5, 87.5]} zoom={9} style={{ width: '100%', height: '100%' }} zoomControl>
      {/* Light tiles */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />
      {zones.map(z => (
        <Circle
          key={z.id}
          center={[z.lat, z.lng]}
          radius={RISK_RADIUS[z.risk]}
          pathOptions={{
            color: RISK_COLOR[z.risk],
            fillColor: RISK_COLOR[z.risk],
            fillOpacity: selectedId === z.id ? 0.3 : 0.15,
            weight: selectedId === z.id ? 2.5 : 1.5,
          }}
          eventHandlers={{ click: () => onSelect(z.id) }}
        >
          <Tooltip permanent direction="top">
            <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: RISK_COLOR[z.risk] }}>
              {z.name}
            </span>
          </Tooltip>
        </Circle>
      ))}
    </MapContainer>
  );
}
