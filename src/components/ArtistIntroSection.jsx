import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function ArtistIntroSection() {
  const { t } = useLanguage();
  const art = t.artist;

  return (
    <section 
      id="artist-statement" 
      className="py-16 sm:py-24 md:py-28 px-6 sm:px-10 max-w-6xl mx-auto text-[#2A2A2A] selection:bg-[#EBE8E0]"
    >
      {/* =========================================================================
          TWO-COLUMN EDITORIAL PRESENTATION
          Left: Shalona's Authentic Studio Portrait
          Right: Artist Statement & Bio with Refined Handwritten Accents
          ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 lg:gap-16 items-start">
        
        {/* Left Column: Shalona's Portrait */}
        <div className="md:col-span-6 relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[4px] shadow-[0_12px_36px_-8px_rgba(42,42,42,0.14)] bg-[#EAE6DE]">
            <img
              src="/images/shalona-portrait-closeup.jpg"
              alt="Shalona – Intuitive Mixed Media Artist in Richterswil, Switzerland"
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
          </div>
        </div>

        {/* Right Column: Text & Biography */}
        <div className="md:col-span-6 space-y-6 pt-1 sm:pt-2">
          
          {/* Main Heading */}
          <div>
            <span className="font-script text-3xl sm:text-4xl text-[#A88B57] block mb-1">
              {art.name}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-light text-[#2A2A2A] tracking-[-0.015em] leading-snug">
              {art.title}
            </h2>
          </div>

          {/* Sub-quote 1 (Italic Serif) */}
          <p className="font-serif italic text-base sm:text-lg text-[#2A2A2A]/85 font-light leading-relaxed">
            {art.lead}
          </p>

          {/* Sub-quote 2 (Handwritten Script Accent) */}
          <h3 className="font-script text-2xl sm:text-3xl text-[#A88B57] pt-1">
            {art.quoteAccent}
          </h3>

          {/* Body Paragraph 1 */}
          <p className="font-sans text-xs sm:text-[13px] text-[#7A7770] font-light leading-[1.8]">
            {art.bio1}
          </p>

          {/* Body Paragraph 2 */}
          <p className="font-sans text-xs sm:text-[13px] text-[#7A7770] font-light leading-[1.8]">
            {art.bio2}
          </p>

          {/* Read More Link */}
          <div className="pt-3">
            <Link
              to="/biography"
              className="group inline-flex items-center gap-2 text-xs font-sans text-[#2A2A2A] hover:text-[#A88B57] uppercase tracking-[0.16em] font-medium transition-colors"
            >
              <span>{art.readBio}</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

        </div>

      </div>

    </section>
  );
}