import React, { useState, useEffect } from 'react';
import { getLiveJournals } from '../utils/studioStore';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ArrowRight, Feather, Calendar, MapPin } from 'lucide-react';

export default function JournalPage() {
  const [journals, setJournals] = useState(() => getLiveJournals());

  useEffect(() => {
    const handleUpdate = () => {
      setJournals(getLiveJournals());
    };
    window.addEventListener('shalona_journals_updated', handleUpdate);
    return () => window.removeEventListener('shalona_journals_updated', handleUpdate);
  }, []);
  const journalSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Shalona's Studio Journal — Thoughts in Stillness",
    "description": "Studio essays and artistic reflections written in Richterswil, Switzerland by mixed media artist Shalona.",
    "url": "https://shalonasart.ch/journal",
    "blogPost": journals.map((j) => ({
      "@type": "BlogPosting",
      "headline": j.title,
      "url": `https://shalonasart.ch/journal/${j.slug}`,
      "datePublished": j.date,
      "author": {
        "@type": "Person",
        "name": "Shalona"
      }
    }))
  };

  return (
    <div className="pt-28 sm:pt-36 pb-24 min-h-screen">
      <SEO
        title="Studio Journal & Essays | SHALONA — Richterswil, Switzerland"
        description="Essays, philosophical reflections, and studio notes by Shalona. Explore writings on beginning, colour as language, and the beauty of the unfinished."
        path="/journal"
        schema={journalSchema}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Header */}
        <div className="space-y-4 mb-16 max-w-3xl pb-8 border-b border-[#1A1817]/08">
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-sans uppercase tracking-[0.25em] text-[#A88B57]">
            <span>Reflections from the Easel</span>
            <span className="w-8 h-[1px] bg-[#A88B57]/40" />
            <span>The Studio Journal</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl font-light text-[#1A1817] tracking-tight">
            Thoughts in Stillness
          </h1>

          <p className="font-serif italic text-xl text-[#1A1817]/70 font-light max-w-2xl leading-relaxed">
            “Writings from the studio in Richterswil, exploring the dialogue between colour, canvas, and the quiet presence of the human spirit.”
          </p>
        </div>

        {/* 5 Studio Essays Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {journals.map((entry) => (
            <Link
              key={entry.id}
              to={`/journal/${entry.slug}`}
              className="group p-8 bg-[#FAF8F3] border border-[#1A1817]/09 rounded-sm fine-art-shadow hover:bg-white hover:-translate-y-1.5 transition-all duration-700 flex flex-col justify-between"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between text-[10px] font-sans uppercase tracking-[0.2em] text-[#A88B57]">
                  <span>Entry No. 0{entry.entryNumber}</span>
                  <span className="text-[#1A1817]/40">{entry.dateFormatted}</span>
                </div>

                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#1A1817] group-hover:text-[#A88B57] transition-colors leading-snug">
                    {entry.title}
                  </h2>
                  {entry.subtitle && (
                    <p className="font-serif italic text-xs text-[#A88B57] mt-1.5">
                      {entry.subtitle}
                    </p>
                  )}
                </div>

                <p className="font-sans text-xs sm:text-sm text-[#1A1817]/70 font-light leading-relaxed line-clamp-4">
                  {entry.excerpt}
                </p>
              </div>

              <div className="pt-6 border-t border-[#1A1817]/06 flex items-center justify-between text-xs font-sans tracking-[0.14em] uppercase text-[#1A1817]/60 group-hover:text-[#A88B57] transition-colors">
                <span>Read Full Essay</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
