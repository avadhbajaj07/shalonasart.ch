import React, { useState, useEffect, useRef } from 'react';
import { artistData } from '../data/artist';
import { ArrowDown, Flame, Sparkles } from 'lucide-react';

export default function Hero({ onTriggerSmoke, onSelectArtwork, featuredArtwork }) {
  const [scrollY, setScrollY] = useState(0);
  const candleRef = useRef(null);
  const [candleExtinguished, setCandleExtinguished] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Soft disappearing text calculation as user scrolls down
  // The text softly blurs and fades like smoke drifting into the canvas
  const scrollThreshold = 450;
  const progress = Math.min(1, Math.max(0, scrollY / scrollThreshold));
  const textBlur = progress * 8; // blurs up to 8px
  const textOpacity = Math.max(0, 1 - progress * 1.3); // fades to 0
  const textTranslateY = -progress * 30; // drifts upward like smoke

  const handleCandleClick = () => {
    setCandleExtinguished(true);
    if (candleRef.current && onTriggerSmoke) {
      const rect = candleRef.current.getBoundingClientRect();
      onTriggerSmoke(rect.left + rect.width / 2, rect.top);
    }
    setTimeout(() => setCandleExtinguished(false), 2400);
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between pt-28 sm:pt-36 pb-12 sm:pb-16 px-6 sm:px-10 max-w-7xl mx-auto overflow-hidden">
      
      {/* Top micro metadata header */}
      <div className="flex items-center justify-between border-b border-[#1A1817]/08 pb-4 text-[10px] sm:text-xs font-sans tracking-[0.22em] uppercase text-[#1A1817]/50">
        <div>Original Artworks · Portfolio Edition</div>
        <div className="hidden sm:block">Richterswil, Lake Zurich · Switzerland</div>
        <div>2026 Collection</div>
      </div>

      {/* Main Hero Centerpiece - Starts with name Shalona */}
      <div 
        className="my-auto py-10 transition-all duration-300 ease-out will-change-transform"
        style={{
          filter: `blur(${textBlur}px)`,
          opacity: textOpacity,
          transform: `translateY(${textTranslateY}px)`,
        }}
      >
        <div className="space-y-6 max-w-4xl">
          
          {/* Subtle artistic tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1A1817]/08 bg-[#F6F3EE]/60 text-[#1A1817]/70 text-[10px] sm:text-xs font-sans uppercase tracking-[0.25em]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A88B57] animate-pulse" />
            <span>Intuitive Mixed Media Art</span>
          </div>

          {/* Monumental Name: SHALONA */}
          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-[0.06em] text-[#1A1817] leading-[0.95] select-none">
            Shalona
          </h1>

          {/* Poetic Mantra & Geographic Anchor */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 pt-2">
            <p className="font-sans text-xs sm:text-sm uppercase tracking-[0.28em] text-[#A88B57] font-medium">
              {artistData.heroMantra}
            </p>
            <span className="hidden sm:inline text-[#1A1817]/20">/</span>
            <p className="font-sans text-xs sm:text-sm tracking-[0.18em] text-[#1A1817]/60 uppercase">
              Mixed Media Artist in Richterswil, Switzerland
            </p>
          </div>

          {/* Iconic Quote: Dissolving smoke philosophy */}
          <div className="pt-4 max-w-2xl">
            <blockquote className="font-serif italic text-xl sm:text-2xl md:text-3xl text-[#1A1817]/85 font-light leading-relaxed border-l border-[#A88B57]/40 pl-5">
              “{artistData.heroQuote}”
            </blockquote>
            <p className="font-sans text-xs tracking-[0.2em] uppercase text-[#1A1817]/40 mt-2 pl-5">
              — Shalona
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Unlit Candle / Smoke Motif */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pt-8 gap-8 border-t border-[#1A1817]/08">
        
        {/* Left: The Candle & Smoke Interactive Motif */}
        <div className="flex items-center gap-4">
          <button
            ref={candleRef}
            onClick={handleCandleClick}
            className="group relative flex items-center gap-3 px-4 py-2.5 rounded-full border border-[#1A1817]/12 hover:border-[#A88B57] bg-white/50 backdrop-blur-sm transition-all duration-500 text-left"
            title="Click to release candle smoke"
          >
            {/* Candle flame / ember icon */}
            <div className="relative w-6 h-6 flex items-center justify-center">
              <span className={`w-2 h-2 rounded-full transition-all duration-500 ${candleExtinguished ? 'bg-[#A88B57] scale-150 animate-ping' : 'bg-[#A88B57]/80 group-hover:bg-[#A88B57]'}`} />
              <Flame className="w-4 h-4 text-[#A88B57] absolute inset-0 m-auto opacity-70 group-hover:opacity-100 transition-opacity" />
            </div>

            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-[#1A1817]/80 font-medium">
                {candleExtinguished ? "Smoke Rising..." : "Candle & Smoke"}
              </p>
              <p className="font-serif italic text-xs text-[#1A1817]/50">
                Touch to awaken stillness
              </p>
            </div>
          </button>

          <span className="text-[11px] font-sans tracking-wide text-[#1A1817]/40 hidden lg:inline max-w-xs leading-relaxed">
            Wisps of smoke disperse as you scroll, echoing the unseen energy between silence and color.
          </span>
        </div>

        {/* Right: Featured Artwork Museum Floating Frame */}
        {featuredArtwork && (
          <div 
            onClick={() => onSelectArtwork(featuredArtwork)}
            className="group cursor-pointer flex items-center gap-4 p-2 sm:p-2.5 rounded-xl bg-white/50 hover:bg-white/80 backdrop-blur-sm transition-all duration-500 fine-art-shadow hover:-translate-y-1"
          >
            {/* Borderless thumbnail with shadow */}
            <div className="relative w-16 h-20 sm:w-20 sm:h-24 overflow-hidden rounded bg-[#EBE5DB]">
              <img
                src={featuredArtwork.thumbnail}
                alt={featuredArtwork.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="eager"
              />
            </div>

            <div className="pr-3">
              <span className="font-sans text-[9px] uppercase tracking-[0.22em] text-[#A88B57] block">
                Featured Artwork
              </span>
              <h3 className="font-serif text-lg font-normal text-[#1A1817] group-hover:text-[#A88B57] transition-colors">
                {featuredArtwork.title}
              </h3>
              <p className="font-sans text-[10px] text-[#1A1817]/50 uppercase tracking-widest mt-0.5">
                {featuredArtwork.dimensions} · {featuredArtwork.year}
              </p>
              <span className="inline-block mt-1 font-sans text-[9px] uppercase tracking-[0.18em] text-[#1A1817]/70 underline decoration-[#A88B57]">
                Inspect Detail →
              </span>
            </div>
          </div>
        )}

        {/* Scroll indicator prompt */}
        <div className="hidden xl:flex items-center gap-2 text-[10px] font-sans uppercase tracking-[0.25em] text-[#1A1817]/40">
          <span>Scroll to Explore</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#A88B57]" />
        </div>
      </div>
    </section>
  );
}
