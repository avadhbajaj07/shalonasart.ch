import React from 'react';
import { artistData } from '../data/artist';
import { MapPin, Compass, Sparkles } from 'lucide-react';

export default function Biography() {
  const { biography, media } = artistData;

  return (
    <section id="biography" className="py-24 sm:py-32 px-6 sm:px-10 max-w-7xl mx-auto border-t border-[#1A1817]/08">
      
      {/* Section Header */}
      <div className="space-y-3 mb-16 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-sans uppercase tracking-[0.25em] text-[#A88B57]">
          <span>Biography & Philosophy</span>
          <span className="w-8 h-[1px] bg-[#A88B57]/40" />
          <span>The Artist</span>
        </div>

        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[#1A1817] tracking-tight">
          Where the Visible Meets the Unseen
        </h2>

        <p className="font-sans text-xs sm:text-sm tracking-[0.16em] uppercase text-[#1A1817]/50">
          Shalona · Mixed Media Artist in Richterswil, Switzerland
        </p>
      </div>

      {/* Main Grid: Portrait and Core Statement */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24">
        
        {/* Left: Studio Portrait with Archival Framing and Floating Shadow */}
        <div className="lg:col-span-5 relative">
          <div className="relative p-3.5 bg-[#FAF8F3] fine-art-shadow rounded-[6px]">
            <div className="aspect-[3/4] overflow-hidden bg-[#ECE6DC] rounded-[4px]">
              <img
                src={media.portraits[1]}
                alt="Shalona seated in her Richterswil studio"
                className="w-full h-full object-cover object-top"
                loading="lazy"
              />
            </div>
            <div className="pt-3 flex items-center justify-between text-[10px] font-sans text-[#1A1817]/50 uppercase tracking-widest">
              <span>Shalona</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#A88B57]" />
                <span>Richterswil, CH</span>
              </span>
            </div>
          </div>

          {/* Floating artistic quote card */}
          <div className="absolute -bottom-6 -right-4 sm:-right-8 max-w-xs bg-[#FBF9F5]/95 backdrop-blur-md p-4 sm:p-5 border border-[#1A1817]/10 fine-art-shadow rounded-sm hidden sm:block">
            <p className="font-serif italic text-sm text-[#1A1817]/80 leading-relaxed">
              “My creative journey begins where words fall silent.”
            </p>
          </div>
        </div>

        {/* Right: Lead Statement and Philosophical Depth */}
        <div className="lg:col-span-7 space-y-6 text-[#1A1817]">
          <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#1A1817] leading-relaxed">
            I create from the quiet space between what is visible and what is felt.
          </h3>

          <div className="space-y-4 font-sans text-sm sm:text-base text-[#1A1817]/75 font-light leading-relaxed">
            <p>{biography.lead}</p>
            <p>{biography.journey}</p>
            <p className="font-serif italic text-lg sm:text-xl text-[#A88B57] pt-2">
              “{biography.mysticalConnection}”
            </p>
          </div>

          <div className="pt-4 flex items-center gap-6 text-xs font-sans tracking-widest text-[#1A1817]/50 uppercase">
            <div>Original Photography</div>
            <span className="text-[#1A1817]/20">•</span>
            <div>Unconventional Materials</div>
            <span className="text-[#1A1817]/20">•</span>
            <div>Expressive Pigments</div>
          </div>
        </div>
      </div>

      {/* 3 Pillars of Shalona's Practice */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-[#1A1817]/08">
        {biography.pillars.map((pillar, idx) => (
          <div 
            key={pillar.title} 
            className="p-8 bg-[#FAF8F3]/60 border border-[#1A1817]/06 fine-art-shadow hover:bg-white transition-all duration-500 rounded-sm space-y-4"
          >
            <div className="text-[10px] font-mono text-[#A88B57]">
              0{idx + 1} / 03
            </div>

            <h4 className="font-serif text-2xl font-normal text-[#1A1817]">
              {pillar.title}
            </h4>

            <p className="font-sans text-xs sm:text-sm text-[#1A1817]/70 font-light leading-relaxed">
              {pillar.description}
            </p>
          </div>
        ))}
      </div>

      {/* Secondary Studio Atmosphere Row */}
      <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 gap-8 items-center bg-[#F6F3EE] p-8 sm:p-12 border border-[#1A1817]/08 rounded-sm">
        <div className="space-y-3">
          <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#A88B57]">
            Richterswil Studio Context
          </span>
          <h4 className="font-serif text-3xl font-light text-[#1A1817]">
            The Lake Zurich Light
          </h4>
          <p className="font-sans text-xs sm:text-sm text-[#1A1817]/70 font-light leading-relaxed">
            In Richterswil, on the quiet shores of Lake Zurich, mornings unfold in stillness. The shifting light across the water enters the studio, illuminating raw linen canvases, vials of organic minerals, and photographic prints waiting to be dissolved and reborn into paint.
          </p>
        </div>

        <div className="relative aspect-[16/10] overflow-hidden bg-[#E2DBD0] rounded-[6px] fine-art-shadow">
          <img
            src={media.portraits[0]}
            alt="Shalona with her paintings in the Richterswil studio"
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
