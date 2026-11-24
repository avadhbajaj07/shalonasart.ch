import React from 'react';
import SEO from '../components/SEO';
import { artistData } from '../data/artist';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

export default function TimelinePage() {
  const milestones = [
    {
      year: "2026",
      title: "The Richterswil Studio & Unfinished Works",
      location: "Richterswil, Lake Zurich, Switzerland",
      description: "Establishment of the dedicated Richterswil atelier on Lake Zurich. Development of the 'Unfinished, Yet Alive' series exploring the threshold where intuitive gestures pause to let the painting breathe.",
      medium: "Oil, Raw Pigments, Lake Water Emulsion"
    },
    {
      year: "2025 – 2026",
      title: "Figurative Abstracts & The Stillness Series",
      location: "Switzerland",
      description: "Creation of signature works including 'Stillness #1', 'Stillness #2', 'Stillness #3', and 'Breaking Waves'. Integration of personal photographic emulsions with heavy gesso and raw ochre pigments.",
      medium: "Mixed media, photographic transfer, oil & textured gesso on linen"
    },
    {
      year: "2024 – 2025",
      title: "Expressions & Poetic Nature Collections",
      location: "Switzerland",
      description: "Deepening of the emotional vocabulary exploring feminine resilience and inner transformations with works such as 'Feminine Buddha', 'Soul Presentation', and 'Echoes in Pink'.",
      medium: "Mixed media, original photography, graphite & impasto"
    },
    {
      year: "Origins",
      title: "Where Words Fall Silent",
      location: "Richterswil & International Studies",
      description: "The inception of Shalona's creative practice combining early photography with unconventional materials, seeking the quiet space between what is visible and what is felt.",
      medium: "Experimental mixed media & photographic exploration"
    }
  ];

  const timelineSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "Artistic Timeline — Shalona",
    "description": "Chronological evolution of mixed media artist Shalona.",
    "url": "https://shalonasart.ch/timeline"
  };

  return (
    <div className="pt-28 sm:pt-36 pb-24 min-h-screen">
      <SEO
        title="Artistic Timeline & Milestones | SHALONA — Switzerland"
        description="Chronological journey and milestone exhibitions of mixed media artist Shalona in Richterswil, Switzerland."
        path="/timeline"
        schema={timelineSchema}
      />

      <div className="max-w-4xl mx-auto px-6 sm:px-10">
        
        {/* Header */}
        <div className="space-y-4 mb-16 pb-8 border-b border-[#1A1817]/08">
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-sans uppercase tracking-[0.25em] text-[#A88B57]">
            <span>Chronology</span>
            <span className="w-8 h-[1px] bg-[#A88B57]/40" />
            <span>Creative Milestones</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl font-light text-[#1A1817] tracking-tight">
            Artistic Timeline
          </h1>

          <p className="font-serif italic text-xl text-[#1A1817]/70 font-light leading-relaxed">
            “Stillness is never static — it is an ongoing accumulation of feeling, risk, and transformation.”
          </p>
        </div>

        {/* Timeline list */}
        <div className="space-y-12 relative before:content-[''] before:absolute before:left-4 before:top-4 before:bottom-4 before:w-[1px] before:bg-[#1A1817]/10">
          {milestones.map((item, idx) => (
            <div key={idx} className="relative pl-12 space-y-3">
              {/* Bullet */}
              <div className="absolute left-[13px] top-1.5 w-2 h-2 rounded-full bg-[#A88B57] ring-4 ring-[#FBF9F5]" />

              <div className="flex items-center gap-3 text-xs font-sans text-[#A88B57] uppercase tracking-[0.2em]">
                <span className="font-semibold">{item.year}</span>
                <span>•</span>
                <span className="text-[#1A1817]/50">{item.location}</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#1A1817]">
                {item.title}
              </h2>

              <p className="font-sans text-sm sm:text-base text-[#1A1817]/75 font-light leading-relaxed">
                {item.description}
              </p>

              <div className="pt-2 text-xs font-sans text-[#1A1817]/50">
                <span className="text-[#A88B57] uppercase tracking-wider text-[10px] block">Key Medium</span>
                <span>{item.medium}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer link */}
        <div className="mt-16 pt-8 border-t border-[#1A1817]/08 text-center">
          <Link
            to="/arts"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#1A1817] text-[#FBF9F5] text-xs font-sans tracking-[0.16em] uppercase hover:bg-[#A88B57] transition-all"
          >
            <span>Explore Works From All Periods</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
