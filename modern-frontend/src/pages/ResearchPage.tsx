import React, { useState } from 'react';
import { BookOpen, Satellite, Database, ChevronDown, ChevronUp, ExternalLink, ArrowRight } from 'lucide-react';
import HaloLayout from '../components/halo/HaloLayout';

const STEPS = [
  { num: '01', title: 'Satellite Acquisition',       color: '#0EA5E9', body: 'Sentinel-1 satellites (operated by ESA) orbit Earth in a sun-synchronous orbit, passing over the Raniganj area every 6–12 days. The satellite emits C-band (5.6 cm wavelength) microwave pulses and records the return signal.' },
  { num: '02', title: 'SAR Processing & InSAR',       color: '#6366F1', body: 'Two SAR images taken at different times are combined (interfered) to produce a phase-difference map. Phase shifts encode millimetric changes in the ground-to-satellite distance, revealing surface displacement.' },
  { num: '03', title: 'Displacement Estimation',      color: '#8B5CF6', body: 'Phase unwrapping converts the cyclic phase signal into continuous displacement values. Processing is done via the Google Earth Engine Python API, referencing published InSAR studies of the Raniganj coalfield for validation.' },
  { num: '04', title: 'Risk Classification',          color: '#F97316', body: 'Plain threshold logic classifies zones: < −10 mm/yr → HIGH, −5 to −10 mm/yr → MEDIUM, > −5 mm/yr → LOW. Results are written to PostgreSQL+PostGIS and served via FastAPI.' },
  { num: '05', title: 'Human-in-the-Loop Review',     color: '#22C55E', body: 'Automated detection surfaces risk flags; a human administrator confirms or dismisses them. No algorithm auto-changes a risk colour — a government official must validate before any public alert is issued.' },
];

const SOURCES = [
  { name: 'Sentinel-1',          org: 'European Space Agency', desc: 'C-band SAR constellation. Free, open-access data. 6-day repeat cycle.',                     color: '#0EA5E9', link: 'https://sentinel.esa.int/web/sentinel/missions/sentinel-1' },
  { name: 'Google Earth Engine', org: 'Google',               desc: 'Cloud-based geospatial analysis. Used for SAR processing and InSAR pipeline.',                color: '#22C55E', link: 'https://earthengine.google.com/' },
  { name: 'PostGIS',             org: 'Open Source',          desc: 'Spatial extension for PostgreSQL. Enables geographic queries on zone boundaries.',            color: '#6366F1', link: 'https://postgis.net/' },
  { name: 'ISRO BHUVAN',         org: 'ISRO',                 desc: 'India-specific geospatial reference data for cross-validation of displacement values.',        color: '#F97316', link: 'https://bhuvan.nrsc.gov.in/' },
];

const PAPERS = [
  { title: 'Subsidence monitoring over Jharia coalfield using Sentinel-1 InSAR',       authors: 'Chatterjee et al., 2021', journal: 'International Journal of Remote Sensing'         },
  { title: 'Ground deformation in the Raniganj coal belt using DInSAR',                authors: 'Singh et al., 2020',      journal: 'Natural Hazards and Earth System Sciences'       },
  { title: 'Urban subsidence detection using Sentinel-1 SAR interferometry',           authors: 'Biswas et al., 2022',     journal: 'Remote Sensing of Environment'                  },
];

export default function ResearchPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <HaloLayout>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-10">
        <div className="max-w-[88rem] mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={12} className="text-sky-500" />
            <span className="text-sky-600 text-xs font-mono uppercase tracking-widest">Methodology & Data</span>
          </div>
          <h1 className="text-slate-900 text-4xl font-semibold mb-1" style={{ letterSpacing: '-0.03em' }}>Research</h1>
          <p className="text-slate-700 text-sm max-w-xl">
            How Subsidence Watch detects ground movement — from raw satellite pulses to risk classification.
          </p>
        </div>
      </div>

      <div className="max-w-[88rem] mx-auto w-full px-6 py-10">

        {/* InSAR accordion */}
        <div className="mb-14">
          <h2 className="text-slate-900 text-2xl font-semibold mb-6" style={{ letterSpacing: '-0.02em' }}>
            How InSAR Works
          </h2>
          <div className="flex flex-col gap-3">
            {STEPS.map((s, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border overflow-hidden transition-all duration-200"
                style={{
                  borderColor: open === i ? `${s.color}50` : '#E2E8F0',
                  boxShadow: open === i ? `0 0 0 3px ${s.color}12, 0 1px 4px rgba(0,0,0,0.05)` : '0 1px 4px rgba(0,0,0,0.04)',
                }}
              >
                <button
                  className="w-full flex items-center justify-between px-7 py-5 cursor-pointer"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="text-xs font-mono font-bold px-2 py-0.5 rounded-md"
                      style={{ backgroundColor: `${s.color}15`, color: s.color }}
                    >
                      {s.num}
                    </span>
                    <span className="text-slate-900 font-bold text-sm">{s.title}</span>
                  </div>
                  {open === i
                    ? <ChevronUp size={16} className="text-slate-400" />
                    : <ChevronDown size={16} className="text-slate-400" />}
                </button>
                {open === i && (
                  <div className="px-7 pb-6">
                    <div className="h-px mb-5 bg-slate-100" />
                    <p className="text-slate-800 text-base leading-relaxed max-w-3xl">{s.body}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Data sources */}
        <div className="mb-14">
          <h2 className="text-slate-900 text-2xl font-semibold mb-6" style={{ letterSpacing: '-0.02em' }}>Data Sources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SOURCES.map(s => (
              <a
                key={s.name}
                href={s.link}
                target="_blank"
                rel="noreferrer"
                className="bg-white rounded-2xl p-6 block no-underline border border-slate-200 hover:border-slate-300 transition-all duration-200 group"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${s.color}15` }}
                  >
                    <Database size={16} style={{ color: s.color }} />
                  </div>
                  <ExternalLink size={12} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
                </div>
                <p className="text-slate-900 font-semibold text-sm mb-0.5">{s.name}</p>
                <p className="text-slate-700 text-xs mb-3 font-semibold">{s.org}</p>
                <p className="text-slate-800 text-sm leading-relaxed">{s.desc}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Publications */}
        <div>
          <h2 className="text-slate-900 text-2xl font-semibold mb-6" style={{ letterSpacing: '-0.02em' }}>
            Reference Publications
          </h2>
          <div className="flex flex-col gap-3">
            {PAPERS.map((p, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl px-7 py-5 flex items-start justify-between gap-6 border border-slate-200 hover:border-slate-300 transition-colors group"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              >
                <div>
                  <p className="text-slate-900 font-bold text-sm mb-1 leading-snug">{p.title}</p>
                  <p className="text-slate-700 text-sm font-medium">{p.authors}</p>
                  <p className="text-slate-600 text-xs mt-1 font-mono font-semibold">{p.journal}</p>
                </div>
                <button className="shrink-0 flex items-center gap-1.5 text-sky-600 text-xs font-semibold no-underline hover:text-sky-700 transition-colors cursor-pointer">
                  View <ExternalLink size={11} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </HaloLayout>
  );
}
