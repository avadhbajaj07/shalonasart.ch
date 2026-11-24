import React from 'react';

export default function CanvasTexture() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
      {/* Off-white base with subtle warm museum vignette */}
      <div className="absolute inset-0 bg-[#FBF9F5]" />

      {/* Radial warm gallery illumination from top center */}
      <div 
        className="absolute inset-0 opacity-70"
        style={{
          background: 'radial-gradient(circle at 50% 12%, rgba(255, 255, 255, 0.9) 0%, rgba(247, 243, 236, 0.5) 50%, rgba(240, 234, 224, 0.7) 100%)'
        }}
      />

      {/* Ultra-fine linen canvas weave pattern */}
      <div 
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(26, 24, 23, 0.35) 3px, rgba(26, 24, 23, 0.35) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(26, 24, 23, 0.35) 3px, rgba(26, 24, 23, 0.35) 4px)
          `,
          backgroundSize: '4px 4px'
        }}
      />

      {/* Subtle gesso paper grain texture */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03] mix-blend-color-burn">
        <filter id="canvasGessoGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#canvasGessoGrain)" />
      </svg>
    </div>
  );
}
