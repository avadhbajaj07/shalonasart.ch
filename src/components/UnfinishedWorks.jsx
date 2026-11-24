import React from 'react';
import { artistData } from '../data/artist';
import { Clock, Eye, Sparkles } from 'lucide-react';

export default function UnfinishedWorks({ onSelectArtwork }) {
  const { unfinishedStatement } = artistData;

  return (
    <section id="unfinished" className="py-24 sm:py-32 px-6 sm:px-10 max-w-7xl mx-auto border-t border-[#1A1817]/08">
      
      {/* Header */}
      <div className="space-y-4 mb-16 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-sans uppercase tracking-[0.25em] text-[#A88B57]">
          <span>In-Progress Collection</span>
          <span className="w-8 h-[1px] bg-[#A88B57]/40" />
          <span>Work in Progress</span>
        </div>

        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[#1A1817] tracking-tight">
          {unfinishedStatement.headline}
        </h2>

        <blockquote className="font-serif italic text-lg sm:text-xl text-[#1A1817]/80 leading-relaxed font-light border-l border-[#A88B57] pl-5 py-1">
          “{unfinishedStatement.quote}”
        </blockquote>
      </div>

      {/* Grid of Unfinished Works with Shalona's Original Commentary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-14">
        {unfinishedStatement.works.map((work, idx) => (
          <div
            key={work.title}
            className="group flex flex-col sm:flex-row gap-6 p-5 sm:p-6 bg-[#FAF8F3] fine-art-shadow hover:bg-white transition-all duration-700 rounded-[6px]"
          >
            {/* Image with borderless presentation */}
            <div className="w-full sm:w-48 aspect-[3/4] overflow-hidden bg-[#ECE6DC] shrink-0 rounded-[3px]">
              <img
                src={work.image}
                alt={work.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>

            {/* Commentary & Info */}
            <div className="flex flex-col justify-between py-1 flex-1">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-sans uppercase tracking-widest text-[#A88B57]">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    <span>In Waiting</span>
                  </span>
                  <span className="text-[#1A1817]/40">{work.year}</span>
                </div>

                <h3 className="font-serif text-2xl font-light text-[#1A1817]">
                  {work.title}
                </h3>

                <p className="font-serif italic text-sm text-[#1A1817]/75 font-light leading-relaxed">
                  “{work.note}”
                </p>
              </div>

              <div className="pt-4 border-t border-[#1A1817]/06 flex items-center justify-between text-[11px] font-sans text-[#1A1817]/50">
                <span>Original Study</span>
                <span className="text-[#A88B57] font-medium uppercase tracking-wider">
                  Oil & Mixed Media
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
