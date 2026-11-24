import React from 'react';
import SEO from '../components/SEO';
import { artistData } from '../data/artist';
import { MapPin, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BiographyPage({ onOpenInquire }) {
  const { biography, media } = artistData;

  const bioSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": "Shalona",
      "alternateName": "Shalona",
      "jobTitle": "Mixed Media Artist",
      "image": media.portraits[0],
      "description": biography.lead,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Richterswil",
        "addressRegion": "Zurich",
        "addressCountry": "Switzerland"
      },
      "url": "https://shalonasart.ch/biography",
      "sameAs": [
        "https://www.instagram.com/shalonasart/",
        "https://www.facebook.com/shalonasart/"
      ]
    }
  };

  return (
    <div className="pt-28 sm:pt-36 pb-24 min-h-screen">
      <SEO
        title="Biography & Philosophy — Shalona | Mixed Media Artist, Switzerland"
        description="Biography of Shalona, mixed media artist based in Richterswil, Lake Zurich, Switzerland. Learn about her intuitive creative process blending photography, pigments, and silence."
        image={media.portraits[0]}
        path="/biography"
        schema={bioSchema}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Header */}
        <div className="space-y-3 mb-16 max-w-3xl pb-8 border-b border-[#1A1817]/08">
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-sans uppercase tracking-[0.25em] text-[#A88B57]">
            <span>The Artist</span>
            <span className="w-8 h-[1px] bg-[#A88B57]/40" />
            <span>Richterswil, Switzerland</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl font-light text-[#1A1817] tracking-tight">
            Where the Visible Meets the Unseen
          </h1>

          <p className="font-serif italic text-xl text-[#1A1817]/70 font-light max-w-2xl leading-relaxed">
            “My creative journey begins where words fall silent. Here, memories, emotions, and unseen energy find expression through color, texture, and imagery.”
          </p>
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-24">
          
          {/* Portrait with Museum Float Shadow */}
          <div className="lg:col-span-5 relative">
            <div className="p-3.5 bg-[#FAF8F3] fine-art-shadow rounded-[6px]">
              <div className="aspect-[3/4] overflow-hidden bg-[#ECE6DC] rounded-[4px]">
                <img
                  src={media.portraits[1]}
                  alt="Shalona seated in Richterswil studio"
                  className="w-full h-full object-cover object-top"
                  loading="eager"
                />
              </div>
              <div className="pt-3 flex items-center justify-between text-[10px] font-sans text-[#1A1817]/50 uppercase tracking-widest">
                <span>Shalona</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#A88B57]" />
                  <span>Lake Zurich, CH</span>
                </span>
              </div>
            </div>

            <div className="mt-6 p-6 bg-[#F6F3EE] rounded border border-[#1A1817]/08 space-y-2">
              <p className="text-[10px] uppercase font-sans tracking-widest text-[#A88B57]">Studio Location</p>
              <p className="font-serif text-lg text-[#1A1817]">Richterswil, Canton of Zürich</p>
              <p className="font-sans text-xs text-[#1A1817]/60 leading-relaxed font-light">
                Private viewing appointments and commission dialogues are held in the studio by arrangement.
              </p>
              <button
                onClick={() => onOpenInquire(null)}
                className="pt-2 text-xs font-sans uppercase tracking-widest text-[#1A1817] underline decoration-[#A88B57] flex items-center gap-1"
              >
                <span>Request Studio Visit</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Biographical Story */}
          <div className="lg:col-span-7 space-y-8 text-[#1A1817]">
            <div className="space-y-4">
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#1A1817] leading-tight">
                About Shalona
              </h2>
              <p className="font-sans text-base text-[#1A1817]/80 font-light leading-relaxed">
                {biography.lead}
              </p>
              <p className="font-sans text-base text-[#1A1817]/80 font-light leading-relaxed">
                {biography.journey}
              </p>
            </div>

            <div className="p-8 bg-[#FAF8F3] border-l-2 border-[#A88B57] rounded-sm space-y-2">
              <p className="font-serif italic text-2xl text-[#1A1817]/90 font-light leading-relaxed">
                “{biography.mysticalConnection}”
              </p>
              <p className="text-[10px] font-sans uppercase tracking-widest text-[#1A1817]/40">
                — Shalona
              </p>
            </div>

            {/* 3 Pillars */}
            <div className="space-y-6 pt-6">
              <h3 className="font-serif text-2xl font-light text-[#1A1817] border-b border-[#1A1817]/08 pb-3">
                Core Pillars of the Practice
              </h3>

              <div className="space-y-6">
                {biography.pillars.map((pillar, idx) => (
                  <div key={pillar.title} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[#A88B57]">0{idx + 1}.</span>
                      <h4 className="font-serif text-xl font-normal text-[#1A1817]">{pillar.title}</h4>
                    </div>
                    <p className="font-sans text-sm text-[#1A1817]/70 font-light leading-relaxed pl-6">
                      {pillar.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action */}
            <div className="pt-8 flex items-center gap-4">
              <Link
                to="/arts"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#1A1817] text-[#FBF9F5] text-xs font-sans tracking-[0.16em] uppercase hover:bg-[#A88B57] transition-all"
              >
                <span>View Selected Works</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

        {/* Secondary Studio Atmosphere Row: Shalona in Studio with Paintings */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-[#F6F3EE] p-8 sm:p-12 border border-[#1A1817]/08 rounded-sm">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#A88B57]">
              Richterswil Atelier
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#1A1817]">
              In Stillness, Art Awakes
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#1A1817]/75 font-light leading-relaxed">
              Surrounded by pigments, textures, and finished canvases in her Richterswil atelier, Shalona works intuitively. Every canvas is an intimate dialogue between emotion, memory, and spiritual stillness.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs font-sans tracking-widest text-[#1A1817]/50 uppercase">
              <span>Original Paintings</span>
              <span>•</span>
              <span>Lake Zurich, Switzerland</span>
            </div>
          </div>

          <div className="lg:col-span-7 relative aspect-[16/10] overflow-hidden bg-[#E2DBD0] rounded-[6px] fine-art-shadow">
            <img
              src={media.portraits[0]}
              alt="Shalona with her paintings in the Richterswil studio"
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
