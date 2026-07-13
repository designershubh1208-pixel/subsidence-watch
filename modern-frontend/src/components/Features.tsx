import React from 'react';
import { Satellite, Database, ActivitySquare, ShieldCheck, Map, Users } from 'lucide-react';

const features = [
  {
    icon: <Satellite className="text-primary" size={24} />,
    title: "Satellite Telemetry",
    description: "Continuous ground deformation tracking using high-resolution Google Earth Engine SAR datasets."
  },
  {
    icon: <Users className="text-info" size={24} />,
    title: "Community Reporting",
    description: "Empowering citizens to report localized cracks and structural anomalies directly from their devices."
  },
  {
    icon: <ActivitySquare className="text-warning" size={24} />,
    title: "Predictive Analytics",
    description: "Machine learning models trained to detect early warning signs of critical land subsidence."
  },
  {
    icon: <Map className="text-primary" size={24} />,
    title: "Geospatial Heatmaps",
    description: "Interactive risk visualization mapped against infrastructure, population density, and elevation."
  },
  {
    icon: <Database className="text-info" size={24} />,
    title: "Open Data API",
    description: "Exportable datasets and robust API endpoints for researchers and government planning agencies."
  },
  {
    icon: <ShieldCheck className="text-success" size={24} />,
    title: "Government-Grade Security",
    description: "End-to-end encryption and strict role-based access control for sensitive geographical intelligence."
  }
];

export default function Features() {
  return (
    <section id="features" className="w-full py-24 bg-surface border-y border-border">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-16 max-w-[600px]">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight mb-4">
            Advanced Monitoring Capabilities
          </h2>
          <p className="text-lg text-text-secondary">
            Built on a highly scalable architecture to process massive planetary-scale geospatial datasets in real-time.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-start">
              <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">
                {feature.title}
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
