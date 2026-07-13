import React from 'react';

export default function CenterVisual() {
  return (
    <div className="visual-container glass-panel">
      {/* Terrain Background Layer */}
      <div 
        className="visual-terrain"
        style={{ backgroundImage: `url('/light_heatmap.png')` }}
      />
      
      {/* Radar Sweep Animation Layer */}
      <div className="visual-radar-sweep" />
      
      {/* Grid Overlay for Technical Feel */}
      <div className="visual-grid-overlay" />
    </div>
  );
}
