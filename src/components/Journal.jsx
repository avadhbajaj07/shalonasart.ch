import React, { useState } from 'react';
import { journals } from '../data/journals';
import { BookOpen, X, ArrowRight, Feather } from 'lucide-react';

export default function Journal() {
  const [selectedEntry, setSelectedEntry] = useState(null);

  return (
    <section id="journal" className="py-24 sm:py-32 px-6 sm:px-10 max-w-7xl mx-auto border-t border-[#1A1817]/08">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-sans uppercase tracking-[0.25em] text-[#A88B57]">
            <span>Studio Notes & Reflections</span>
            <span className="w-8 h-[1px] bg-[#A88B57]/40" />
            <span>The Journal</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[#1A1817] tracking-tight">
            Thoughts in Stillness
          </h2>

          <p className="font-serif italic text-lg text-[#1A1817]/70 font-light">
            Writings from the studio in Richterswil, exploring the dialogue between colour, canvas, and the human presence.
          </p>
        </div>

        <div className="text-xs font-sans uppercase tracking-widest text-[#1A1817]/40">
          5 Studio Essays
        </div>
      </div>

      {/* Journal Entries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {journals.map((entry) => (
          <article
            key={entry.id}
            onClick={() => setSelectedEntry(entry)}
            className="group cursor-pointer p-8 bg-[#FAF8F3]/60 border border-[#1A1817]/08 rounded-sm fine-art-shadow hover:bg-white hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] font-sans uppercase tracking-[0.2em] text-[#A88B57]">
                <span>Entry No. 0{entry.entryNumber}</span>
                <span className="text-[#1A1817]/40">{entry.dateFormatted}</span>
              </div>

              <h3 className="font-serif text-2xl font-light text-[#1A1817] group-hover:text-[#A88B57] transition-colors leading-snug">
                {entry.title}
              </h3>

              {entry.subtitle && (
                <p className="font-serif italic text-xs text-[#1A1817]/50">
                  {entry.subtitle}
                </p>
              )}

              <p className="font-sans text-xs sm:text-sm text-[#1A1817]/70 font-light leading-relaxed line-clamp-4">
                {entry.excerpt}
              </p>
            </div>

            <div className="pt-6 border-t border-[#1A1817]/06 flex items-center justify-between text-xs font-sans tracking-[0.15em] uppercase text-[#1A1817]/60 group-hover:text-[#A88B57] transition-colors">
              <span>Read Full Essay</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </article>
        ))}
      </div>

      {/* Reader Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 sm:p-8">
          <div className="relative w-full max-w-3xl max-h-[85vh] bg-[#FBF9F5] rounded-xl overflow-hidden shadow-2xl flex flex-col border border-[#1A1817]/10">
            
            {/* Modal Header */}
            <div className="px-8 py-6 flex items-center justify-between border-b border-[#1A1817]/08 bg-[#FAF8F3]">
              <div className="flex items-center gap-3">
                <Feather className="w-4 h-4 text-[#A88B57]" />
                <span className="text-xs uppercase font-sans tracking-[0.2em] text-[#A88B57]">
                  Journal Entry 0{selectedEntry.entryNumber}
                </span>
              </div>

              <button
                onClick={() => setSelectedEntry(null)}
                className="p-1.5 rounded-full border border-[#1A1817]/10 hover:bg-[#1A1817] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Poetic Reading Typography */}
            <div className="p-8 sm:p-14 overflow-y-auto space-y-6">
              <div className="space-y-2 border-b border-[#1A1817]/08 pb-6">
                <span className="text-xs font-sans uppercase tracking-widest text-[#1A1817]/40">
                  {selectedEntry.dateFormatted} · {selectedEntry.location}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#1A1817]">
                  {selectedEntry.title}
                </h2>
                {selectedEntry.subtitle && (
                  <p className="font-serif italic text-base text-[#A88B57]">
                    {selectedEntry.subtitle}
                  </p>
                )}
              </div>

              <div className="space-y-5 font-serif text-lg sm:text-xl text-[#1A1817]/85 font-light leading-relaxed">
                {selectedEntry.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div className="pt-8 border-t border-[#1A1817]/08 flex items-center justify-between">
                <span className="font-serif italic text-sm text-[#1A1817]/50">
                  — Shalona, Richterswil
                </span>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="px-5 py-2 rounded-full border border-[#1A1817]/15 text-xs font-sans tracking-widest uppercase hover:bg-[#1A1817] hover:text-white transition-colors"
                >
                  Close Essay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
