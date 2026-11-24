import React from 'react';
import { artistData } from '../data/artist';
import SEO from '../components/SEO';
import { Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UnfinishedPage({ artworks = [], onSelectArtwork }) {
  const { unfinishedStatement } = artistData;

  const unfinishedSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Unfinished, Yet Alive — In-Progress Artworks by Shalona",
    "description": "Studies and unfinished works by Swiss mixed media artist Shalona. Works in waiting that hold honest questions.",
    "url": "https://shalonasart.ch/unfinished-works"
  };

  return (
    <div className="pt-28 sm:pt-36 pb-24 min-h-screen">
      <SEO
        title="Unfinished, Yet Alive — Studies & Works in Progress | SHALONA"
        description="Explore the unfinished works of Shalona. Pieces in waiting that hold a question not yet answered, guided by patience and honesty."
        path="/unfinished-works"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Unfinished Works', path: '/unfinished-works' }
        ]}
        schema={unfinishedSchema}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Header */}
        <div className="space-y-4 mb-16 max-w-3xl pb-8 border-b border-[#1A1817]/08">
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-sans uppercase tracking-[0.25em] text-[#A88B57]">
            <span>In-Progress Collection</span>
            <span className="w-8 h-[1px] bg-[#A88B57]/40" />
            <span>Studio Easel Archive</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl font-light text-[#1A1817] tracking-tight">
            {unfinishedStatement.headline}
          </h1>

          <blockquote className="font-serif italic text-xl sm:text-2xl text-[#1A1817]/80 leading-relaxed font-light border-l-2 border-[#A88B57] pl-5 py-2">
            “{unfinishedStatement.quote}”
          </blockquote>
        </div>

        {/* Works in waiting */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-14">
          {unfinishedStatement.works.map((work) => (
            <div
              key={work.title}
              className="group flex flex-col sm:flex-row gap-6 p-6 bg-[#FAF8F3] fine-art-shadow hover:bg-white transition-all duration-700 rounded-[6px]"
            >
              <div className="w-full sm:w-56 aspect-[3/4] overflow-hidden bg-[#ECE6DC] shrink-0 rounded-[3px]">
                <img
                  src={work.image}
                  alt={work.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>

              <div className="flex flex-col justify-between py-1 flex-1">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-sans uppercase tracking-widest text-[#A88B57]">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      <span>In Waiting</span>
                    </span>
                    <span className="text-[#1A1817]/40">{work.year}</span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#1A1817]">
                    {work.title}
                  </h3>

                  <p className="font-serif italic text-sm sm:text-base text-[#1A1817]/75 font-light leading-relaxed">
                    “{work.note}”
                  </p>
                </div>

                <div className="pt-6 border-t border-[#1A1817]/06 flex items-center justify-between text-xs font-sans text-[#1A1817]/50">
                  <span>Richterswil Atelier</span>
                  <span className="text-[#A88B57] uppercase tracking-wider font-medium">
                    Oil & Mixed Media
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
