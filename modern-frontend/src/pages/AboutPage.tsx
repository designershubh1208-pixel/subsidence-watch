import React from 'react';
import { Info, GitBranch, Globe, Mail, ExternalLink, Layers, Shield, Cpu, Map } from 'lucide-react';
import HaloLayout from '../components/halo/HaloLayout';

const STACK = [
  { layer: 'Satellite Data', tech: 'Google Earth Engine + Sentinel-1 InSAR', color: '#0EA5E9', Icon: Globe  },
  { layer: 'Backend API',    tech: 'FastAPI (Python) · Async · REST',         color: '#6366F1', Icon: Cpu    },
  { layer: 'Database',       tech: 'PostgreSQL + PostGIS · Spatial queries',  color: '#8B5CF6', Icon: Layers },
  { layer: 'Frontend',       tech: 'React · TypeScript · Vite · Tailwind',   color: '#22C55E', Icon: Globe  },
  { layer: 'Maps',           tech: 'React-Leaflet · CartoDB Positron tiles',  color: '#F97316', Icon: Map    },
  { layer: 'Auth',           tech: 'Firebase Auth · Admin-only access',       color: '#EAB308', Icon: Shield },
  { layer: 'Scheduling',     tech: 'APScheduler · Monthly SAR ingestion',     color: '#14B8A6', Icon: Cpu    },
  { layer: 'Hosting',        tech: 'Vercel (frontend) · Render (backend)',    color: '#EC4899', Icon: Globe  },
];

const PRINCIPLES = [
  { title: 'Automation for detection',           body: 'The satellite pipeline and risk classification run end-to-end without human intervention — acquiring, processing and classifying InSAR data on schedule.' },
  { title: 'Human judgment for action',          body: 'No risk level changes automatically. An administrator reviews flagged zones and confirms or dismisses alerts. A false alarm has real social costs.' },
  { title: 'Explainability over sophistication', body: 'Plain threshold logic over ML black-boxes. A government official trusting a red flag needs "why" in one sentence — not "the model decided".' },
  { title: 'Open data first',                   body: 'Sentinel-1 and Earth Engine are free and public, so results can be independently validated against published InSAR studies of Raniganj.' },
];

export default function AboutPage() {
  return (
    <HaloLayout>
      {/* Hero header */}
      <div className="bg-white border-b border-slate-200 px-6 py-14">
        <div className="max-w-[88rem] mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <Info size={12} className="text-sky-500" />
            <span className="text-sky-600 text-xs font-mono uppercase tracking-widest">About the Project</span>
          </div>
          <h1 className="text-slate-900 text-5xl font-bold mb-4 max-w-2xl" style={{ letterSpacing: '-0.04em' }}>
            Subsidence Watch
          </h1>
          <p className="text-slate-700 text-base leading-relaxed max-w-lg">
            An open-data ground subsidence monitoring platform for the Raniganj Coalfield,
            West Bengal — built to protect communities from land-sink hazards using satellite
            radar and real-time risk analytics.
          </p>
        </div>
      </div>

      <div className="max-w-[88rem] mx-auto w-full px-6 py-10">

        {/* Problem + Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          <div
            className="bg-white rounded-2xl p-8 border border-slate-200"
            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
          >
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-5">
              <span className="text-red-500 text-lg font-bold">!</span>
            </div>
            <h2 className="text-slate-900 text-xl font-semibold mb-4" style={{ letterSpacing: '-0.02em' }}>
              The Problem
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-3">
              The Raniganj Coalfield — one of India's oldest and largest — spans Paschim
              Bardhaman district in West Bengal. Decades of underground coal extraction have
              left large voids that cause the surface to slowly sink, cracking roads, damaging
              buildings, and displacing communities.
            </p>
            <p className="text-slate-800 text-sm leading-relaxed">
              Published InSAR studies document displacement rates of up to −20 mm/year in
              active mining zones — yet no accessible real-time monitoring tool exists for
              local authorities and residents.
            </p>
          </div>

          <div
            className="bg-white rounded-2xl p-8 border border-slate-200"
            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center mb-5">
              <span className="text-sky-500 text-lg font-bold">→</span>
            </div>
            <h2 className="text-slate-900 text-xl font-semibold mb-4" style={{ letterSpacing: '-0.02em' }}>
              Our Solution
            </h2>
            <p className="text-slate-800 text-sm leading-relaxed mb-3">
              Subsidence Watch ingests freely available Sentinel-1 SAR imagery via Google
              Earth Engine, applies InSAR displacement estimation, and classifies risk zones
              with an explainable threshold model.
            </p>
            <p className="text-slate-800 text-sm leading-relaxed">
              Citizens can file ground-level reports through the web app. When reports cluster
              in a zone, an admin review is triggered — keeping humans responsible for any
              official risk escalation.
            </p>
          </div>
        </div>

        {/* Design principles */}
        <div className="mb-14">
          <h2 className="text-slate-900 text-2xl font-semibold mb-6" style={{ letterSpacing: '-0.02em' }}>
            Design Principles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PRINCIPLES.map((p, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-7 border border-slate-200 hover:border-slate-300 transition-colors"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              >
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center mb-4">
                  <span className="text-slate-500 text-xs font-bold font-mono">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <p className="text-slate-900 font-semibold text-base mb-2 leading-snug">{p.title}</p>
                <p className="text-slate-800 text-sm leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div className="mb-14">
          <h2 className="text-slate-900 text-2xl font-semibold mb-6" style={{ letterSpacing: '-0.02em' }}>
            Tech Stack
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STACK.map(({ layer, tech, color, Icon }) => (
              <div
                key={layer}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 transition-all duration-150"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <Icon size={16} style={{ color }} />
                </div>
                <p className="text-slate-700 text-xs font-bold uppercase tracking-wider mb-1">{layer}</p>
                <p className="text-slate-900 text-sm font-medium leading-snug">{tech}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Links banner */}
        <div
          className="bg-slate-900 rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          style={{ boxShadow: '0 4px 20px rgba(15,23,42,0.15)' }}
        >
          <div>
            <h3 className="text-white font-semibold text-lg mb-1">Open Source</h3>
            <p className="text-slate-400 text-sm">
              Source code, data and methodology are publicly available.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full no-underline text-sm font-semibold transition-all duration-200 border border-white/20 text-white hover:bg-white/10"
            >
              <GitBranch size={14} />
              GitHub
              <ExternalLink size={11} className="opacity-50" />
            </a>
            <a
              href="mailto:contact@subsidencewatch.in"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full no-underline text-sm font-semibold bg-white text-slate-900"
            >
              <Mail size={14} />
              Contact
            </a>
          </div>
        </div>
      </div>
    </HaloLayout>
  );
}
