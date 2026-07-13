import React from 'react';
import { ArrowRight } from 'lucide-react';

const IMAGE_URL =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260423_164207_f243351d-ed59-48ec-83a0-a5e996bdbe3c.png&w=1280&q=85';

export default function InfoSection() {
  return (
    <section className="bg-[#F5F5F5] px-6 py-24">
      <div className="max-w-[88rem] mx-auto">

        {/* Row 1: heading + description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-start">
          {/* Left */}
          <div>
            <h2
              className="text-black text-4xl md:text-5xl font-medium leading-tight mb-8"
              style={{ letterSpacing: '-0.03em' }}
            >
              Meet Subsidence Watch.
            </h2>
            <button className="inline-flex items-center gap-3 bg-black text-white text-base font-medium pl-8 pr-2 py-2 rounded-full hover:bg-gray-800 transition-colors duration-200 cursor-pointer">
              Explore Data
              <span className="bg-white rounded-full p-2">
                <ArrowRight className="w-4 h-4 text-black" />
              </span>
            </button>
          </div>

          {/* Right */}
          <p className="text-black/70 text-2xl md:text-3xl leading-relaxed">
            Subsidence Watch is a real-time ground movement monitoring system
            that maps subsidence risk zones using satellite InSAR data from
            Raniganj coalfields.
          </p>
        </div>

        {/* Row 2: 4-col card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Card 1 — spans 2 cols on lg, image bg */}
          <div
            className="lg:col-span-2 rounded-2xl p-7 min-h-80 flex flex-col justify-between"
            style={{
              backgroundImage: `url('${IMAGE_URL}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <p
              className="text-black text-2xl font-medium leading-snug"
              style={{ letterSpacing: '-0.02em' }}
            >
              Risk zones at a glance
            </p>
            <p className="text-black/70 text-base max-w-xs">
              Visualise ground displacement across coalfields with colour-coded
              risk overlays updated directly from satellite measurements.
            </p>
          </div>

          {/* Card 2 */}
          <div
            className="rounded-2xl p-7 min-h-80 flex flex-col justify-between"
            style={{ backgroundColor: '#2B2644' }}
          >
            <p
              className="text-white text-2xl font-medium leading-snug"
              style={{ letterSpacing: '-0.02em' }}
            >
              Always live,
              <br />
              always precise.
            </p>
            <p className="text-white/60 text-base">
              Stay informed with continuously updated InSAR measurements — no
              manual field visits or guesswork required.
            </p>
          </div>

          {/* Card 3 */}
          <div
            className="rounded-2xl p-7 min-h-80 flex flex-col justify-between"
            style={{ backgroundColor: '#2B2644' }}
          >
            <p
              className="text-white text-2xl font-medium leading-snug"
              style={{ letterSpacing: '-0.02em' }}
            >
              Fully
              <br />
              automated
            </p>
            <p className="text-white/60 text-base">
              From satellite acquisition to risk classification, the pipeline
              runs end-to-end without any manual intervention.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
