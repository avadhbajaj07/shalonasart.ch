import React from 'react';
import { artistData } from '../data/artist';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Sparkles, MapPin, Calendar, Clock, Eye, Tag } from 'lucide-react';

export default function HeroBentoGrid({ artworks, onSelectArtwork, onOpenRoom, onOpenInquire }) {
  const { exhibition, pricing } = artistData;

  // Selected works for bento display
  const piece1 = artworks.find(a => a.slug === 'breaking-waves') || artworks[0];
  const piece2 = artworks.find(a => a.slug === 'birth-of-lotus') || artworks[1];
  const piece3 = artworks.find(a => a.slug === 'watery-dreams') || artworks[2];
  const piece4 = artworks.find(a => a.slug === 'solitude') || artworks[5];

  return (
    <section className="pt-24 sm:pt-32 pb-16 px-6 sm:px-10 max-w-7xl mx-auto">
      
      {/* Editorial Headline with "Words bleed into the page like ink" effect */}
      <div className="mb-12 space-y-4 max-w-4xl">
        
        {/* Tracked Micro Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#DCD9D0] bg-[#EBE8E0]/40 text-[#7A7770] text-[10px] font-sans uppercase tracking-[0.25em]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2A2A2A] animate-pulse" />
          <span>Intuitive Art · Richterswil, Switzerland</span>
        </div>

        {/* Monumental Title with Ink Bleed Diffusion */}
        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-light text-[#2A2A2A] tracking-[-0.02em] leading-[0.95] ink-bleed">
          Shalona
        </h1>

        {/* Poetic Sub-Theme & Mentorship Note */}
        <div className="space-y-2 pt-2">
          <p className="font-serif italic text-2xl sm:text-3xl text-[#2A2A2A]/90 font-light ink-bleed">
            “Float through the mystical — discover empowerment.”
          </p>
          <p className="font-sans text-xs sm:text-sm text-[#7A7770] max-w-2xl font-light leading-relaxed">
            I am an intuitive artist who worked with a few mentors: that's about it. My paintings move between memory, emotion, and unseen energy through raw pigments, photographic emulsion, and silence.
          </p>
        </div>

        {/* Direct Highlights Bar */}
        <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-sans text-[#7A7770]">
          <span className="flex items-center gap-1.5 text-[#2A2A2A] font-medium">
            <Tag className="w-3.5 h-3.5 text-[#A88B57]" />
            <span>All Arts Available ({pricing.range})</span>
          </span>
          <span className="text-[#DCD9D0]">•</span>
          <span className="text-[#2A2A2A]">Free Admission (No Vernissage)</span>
          <span className="text-[#DCD9D0]">•</span>
          <span>Ortsmuseum Bärenkeller (3.–6. Dez 2026)</span>
        </div>
      </div>

      {/* Spacious Modular Bento-Style Grid of Softly Rounded Cards (border-radius: 6px) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
        
        {/* Card 1: Main Visual Work (Span 7, Tall Bento - Borderless) */}
        <div 
          onClick={() => onSelectArtwork(piece1)}
          className="md:col-span-7 bento-card relative bg-[#FAF8F3] p-4 fine-art-shadow group cursor-pointer flex flex-col justify-between"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[4px] bg-[#ECE6DC]">
            <img
              src={piece1.localImage || piece1.image}
              alt={piece1.title}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              loading="eager"
            />
            <div className="absolute inset-0 bg-[#2A2A2A]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
              <span className="px-4 py-2 rounded-full bg-[#F6F4EF] text-[#2A2A2A] text-xs font-sans uppercase tracking-widest shadow-md">
                Inspect Artwork
              </span>
            </div>
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#F6F4EF]/95 backdrop-blur-sm text-[10px] font-sans font-medium text-[#2A2A2A] shadow-sm">
              {piece1.price}
            </div>
          </div>

          <div className="pt-4 flex items-baseline justify-between mt-1">
            <div>
              <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#7A7770]">
                {piece1.category} · {piece1.year}
              </span>
              <h3 className="font-serif text-2xl font-light text-[#2A2A2A] group-hover:text-[#A88B57] transition-colors">
                {piece1.title}
              </h3>
            </div>
            <span className="font-mono text-xs text-[#7A7770]">
              {piece1.dimensions}
            </span>
          </div>
        </div>

        {/* Card 2: High-Contrast Dark Charcoal Highlight Card (#2A2A2A background with #F6F4EF text) */}
        {/* Featured Announcement: Ortsmuseum Bärenkeller Exhibition */}
        <div className="md:col-span-5 bento-card bg-[#2A2A2A] text-[#F6F4EF] p-8 border border-[#2A2A2A] fine-art-shadow flex flex-col justify-between relative overflow-hidden group">
          
          {/* Subtle noise and glow */}
          <div 
            className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-white/5 blur-3xl pointer-events-none"
          />

          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#A88B57] font-semibold">
                Featured Exhibition
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-sans uppercase tracking-widest bg-white/10 text-white/90">
                Free Admission
              </span>
            </div>

            <div className="space-y-2">
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-white/60">
                {exhibition.venue} · Richterswil
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-white leading-tight">
                {exhibition.theme}
              </h2>
              <p className="font-serif italic text-base text-[#A88B57] font-light">
                “{exhibition.subtheme}”
              </p>
            </div>

            {/* Exhibition Details Box */}
            <div className="space-y-3 pt-2 text-xs font-sans text-white/80 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#A88B57] shrink-0" />
                <span className="font-semibold text-white">{exhibition.dates}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#A88B57] shrink-0" />
                <span>{exhibition.hours}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#A88B57] shrink-0" />
                <span>{exhibition.address}</span>
              </div>
            </div>

            <div className="p-3 bg-white/05 rounded border border-white/10 text-[11px] font-sans text-white/70 space-y-1">
              <p className="text-white font-medium">No Vernissage — Open Walk-In</p>
              <p>All artworks available for purchase ({pricing.range}).</p>
            </div>
          </div>

          <div className="pt-6 relative z-10 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={() => onOpenInquire(null)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F6F4EF] text-[#2A2A2A] text-xs font-sans tracking-[0.14em] uppercase hover:bg-[#A88B57] hover:text-white transition-colors"
            >
              <span>Exhibition Inquiry</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
              1 Previous Solo Show
            </span>
          </div>
        </div>

        {/* Card 3: Visual Work 2 (Span 4 - Borderless) */}
        <div 
          onClick={() => onSelectArtwork(piece2)}
          className="md:col-span-4 bento-card relative bg-[#FAF8F3] p-4 fine-art-shadow group cursor-pointer flex flex-col justify-between"
        >
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[4px] bg-[#ECE6DC]">
            <img
              src={piece2.localImage || piece2.image}
              alt={piece2.title}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#F6F4EF]/95 text-[10px] font-sans font-medium text-[#2A2A2A] shadow-sm">
              {piece2.price}
            </div>
          </div>

          <div className="pt-3 flex items-baseline justify-between mt-1">
            <h4 className="font-serif text-xl font-light text-[#2A2A2A] group-hover:text-[#A88B57] transition-colors">
              {piece2.title}
            </h4>
            <span className="font-mono text-[11px] text-[#7A7770]">
              {piece2.year}
            </span>
          </div>
        </div>

        {/* Card 4: Empty Warm-Stone Spacer Tile (#EBE8E0) with Minimalist Quote */}
        <div className="md:col-span-4 bento-card bg-[#EBE8E0] p-8 flex flex-col justify-between select-none">
          <div className="flex items-center justify-between text-[10px] font-sans uppercase tracking-[0.25em] text-[#7A7770]">
            <span>Atelier Stillness</span>
            <span className="font-mono">47.2084° N</span>
          </div>

          <div className="space-y-3 py-6">
            <p className="font-serif italic text-2xl text-[#2A2A2A]/85 font-light leading-relaxed">
              “Stillness is never empty — it is full of unseen movement.”
            </p>
            <p className="font-sans text-xs uppercase tracking-widest text-[#7A7770]">
              — Shalona
            </p>
          </div>

          <div className="flex items-center justify-between text-xs font-sans text-[#7A7770] border-t border-[#DCD9D0] pt-4">
            <span>Lake Zurich Studio</span>
            <span className="text-[#2A2A2A] font-medium">Free Entrance</span>
          </div>
        </div>

        {/* Card 5: Visual Work 3 (Span 4 - Borderless) */}
        <div 
          onClick={() => onSelectArtwork(piece3)}
          className="md:col-span-4 bento-card relative bg-[#FAF8F3] p-4 fine-art-shadow group cursor-pointer flex flex-col justify-between"
        >
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[4px] bg-[#ECE6DC]">
            <img
              src={piece3.localImage || piece3.image}
              alt={piece3.title}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#F6F4EF]/95 text-[10px] font-sans font-medium text-[#2A2A2A] shadow-sm">
              {piece3.price}
            </div>
          </div>

          <div className="pt-3 flex items-baseline justify-between mt-1">
            <h4 className="font-serif text-xl font-light text-[#2A2A2A] group-hover:text-[#A88B57] transition-colors">
              {piece3.title}
            </h4>
            <span className="font-mono text-[11px] text-[#7A7770]">
              {piece3.year}
            </span>
          </div>
        </div>

      </div>

      {/* Exhibition Poster Feature Banner */}
      <div className="mt-8 bento-card bg-[#FAF8F3] p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 fine-art-shadow">
        
        <div className="flex items-center gap-6">
          <div className="w-20 sm:w-24 aspect-[2/3] overflow-hidden rounded-[4px] bg-[#EBE8E0] shrink-0">
            <img
              src="/exhibitions/poster-baerenkeller.jpg"
              alt="Ortsmuseum Bärenkeller Exhibition Poster"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-sans uppercase tracking-[0.22em] text-[#A88B57] font-semibold">
              Official Exhibition Poster · Ortsmuseum Bärenkeller
            </span>
            <h4 className="font-serif text-2xl font-light text-[#2A2A2A]">
              Shalona's Art — 3.–6. Dezember 2026
            </h4>
            <p className="font-sans text-xs text-[#7A7770]">
              Dorfbachstrasse 12, 8805 Richterswil · Free admission, no vernissage.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 shrink-0">
          <Link
            to="/contact"
            className="px-6 py-2.5 rounded-full bg-[#2A2A2A] text-[#F6F4EF] text-xs font-sans tracking-[0.16em] uppercase hover:bg-[#A88B57] transition-colors"
          >
            Inquire About Works
          </Link>

          <Link
            to="/arts"
            className="px-6 py-2.5 rounded-full border border-[#DCD9D0] text-[#2A2A2A] text-xs font-sans tracking-[0.16em] uppercase hover:bg-white transition-colors"
          >
            All 57 Artworks →
          </Link>
        </div>

      </div>

    </section>
  );
}
