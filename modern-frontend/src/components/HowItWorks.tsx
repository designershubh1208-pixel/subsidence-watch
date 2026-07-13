import React from 'react';

const steps = [
  {
    number: "01",
    title: "Data Ingestion",
    description: "Google Earth Engine continuously feeds multi-spectral and SAR satellite data into our processing pipeline."
  },
  {
    number: "02",
    title: "AI Analysis",
    description: "Our machine learning models detect sub-centimeter ground deformation and identify high-risk subsidence zones."
  },
  {
    number: "03",
    title: "Community Verification",
    description: "Citizens on the ground submit photographic evidence of structural cracks, cross-referencing our satellite data."
  },
  {
    number: "04",
    title: "Actionable Insights",
    description: "Government officials receive automated alerts and prioritized risk maps to direct emergency infrastructure interventions."
  }
];

export default function HowItWorks() {
  return (
    <section className="w-full py-24 bg-background">
      <div className="max-w-[1200px] mx-auto px-6">
        
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight mb-4">
            How Subsidence Watch Works
          </h2>
          <p className="text-lg text-text-secondary max-w-[600px] mx-auto">
            A seamless pipeline from planetary-scale observation to local, actionable intervention.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col">
              <div className="text-4xl font-bold text-primary/20 mb-4 font-mono">
                {step.number}
              </div>
              <div className="h-0.5 w-full bg-border mb-6 relative">
                {/* Simulated progress line */}
                <div className="absolute top-0 left-0 h-full w-1/3 bg-primary"></div>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">
                {step.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
