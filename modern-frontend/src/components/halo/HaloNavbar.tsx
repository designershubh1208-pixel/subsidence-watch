import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import LogoIcon from './LogoIcon';

const NAV_LINKS = [
  { label: 'Dashboard',  to: '/dashboard'  },
  { label: 'Risk Zones', to: '/risk-zones'  },
  { label: 'Reports',    to: '/reports'     },
  { label: 'Research',   to: '/research'    },
  { label: 'About',      to: '/about'       },
];

export interface HaloNavbarProps {
  mode?: 'overlay' | 'solid';
}

export default function HaloNavbar({ mode = 'overlay' }: HaloNavbarProps) {
  const { pathname } = useLocation();

  /* Both modes now use dark text — the landing page bg is #F5F5F5 (light),
     inner pages are also white. Only the frosted border differs. */
  const isSolid = mode === 'solid';

  return (
    <nav
      className={`${isSolid ? 'sticky top-0 z-[9999]' : 'absolute top-0 left-0 right-0 z-[9999]'} px-6 py-4`}
      style={
        isSolid
          ? {
              backgroundColor: 'rgba(255,255,255,0.96)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderBottom: '1px solid #E2E8F0',
            }
          : {
              /* overlay: transparent over #F5F5F5 page bg */
              backgroundColor: 'rgba(245,245,245,0.85)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }
      }
    >
      <div className="flex items-center justify-between max-w-[88rem] mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <LogoIcon className="w-7 h-7 text-slate-900" />
          <span className="text-slate-900 text-2xl font-medium tracking-tight">
            Subsidence Watch
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, to }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className="text-sm font-medium transition-colors duration-200 no-underline"
                style={{ color: active ? '#0F172A' : '#64748B' }}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <Link
          to="/risk-zones"
          className="text-sm font-semibold px-6 py-2 rounded-full transition-all duration-200 no-underline"
          style={{
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          }}
        >
          View Risk Map
        </Link>
      </div>
    </nav>
  );
}
