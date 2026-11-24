import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Home, ArrowUpRight, ZoomIn, ZoomOut } from 'lucide-react';

export default function Lightbox({ artwork, allArtworks, onClose, onOpenInquire, onOpenRoom }) {
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [artwork]);

  if (!artwork) return null;

  const currentIndex = allArtworks.findIndex((item) => item.id === artwork.id);

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % allArtworks.length;
    onClose(allArtworks[nextIdx]);
    setZoomed(false);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + allArtworks.length) % allArtworks.length;
    onClose(allArtworks[prevIdx]);
    setZoomed(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FBF9F5]/96 backdrop-blur-xl transition-all duration-500 overflow-hidden">
      
      {/* Top Header Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 px-6 sm:px-10 py-5 flex items-center justify-between border-b border-[#1A1817]/08 bg-[#FBF9F5]/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <span className="font-serif text-xl sm:text-2xl font-light tracking-wide text-[#1A1817]">
            {artwork.title}
          </span>
          <span className="text-xs font-mono text-[#1A1817]/40 hidden sm:inline">
            [{artwork.accession}]
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Zoom toggle */}
          <button
            onClick={() => setZoomed(!zoomed)}
            className="p-2 rounded-full border border-[#1A1817]/10 hover:border-[#1A1817]/30 text-[#1A1817] transition-colors"
            title={zoomed ? "Reset Zoom" : "Magnify Detail"}
          >
            {zoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
          </button>

          {/* View in Room */}
          <button
            onClick={() => onOpenRoom(artwork)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#1A1817]/10 hover:border-[#1A1817]/30 text-xs font-sans uppercase tracking-wider text-[#1A1817] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>View in Room</span>
          </button>

          {/* Close button */}
          <button
            onClick={() => onClose(null)}
            className="p-2 rounded-full border border-[#1A1817]/10 hover:bg-[#1A1817] hover:text-[#FBF9F5] transition-all"
            aria-label="Close lightbox"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area: Image + Metadata sidebar */}
      <div className="w-full h-full pt-20 pb-8 px-6 sm:px-12 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14 max-w-7xl mx-auto">
        
        {/* Left / Center: High-Res Canvas Display with Fine Shadow and Edge */}
        <div className="relative flex-1 w-full h-[60vh] lg:h-[75vh] flex items-center justify-center">
          
          {/* Prev Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/70 hover:bg-white text-[#1A1817] fine-art-shadow transition-all"
            aria-label="Previous artwork"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Artwork Image inside Museum Mount (Borderless) */}
          <div 
            onClick={() => setZoomed(!zoomed)}
            className={`relative max-h-full max-w-full overflow-hidden p-3 sm:p-4 bg-[#FAF8F3] rounded-[6px] fine-art-shadow cursor-pointer transition-all duration-700 ${
              zoomed ? 'scale-125 z-30' : 'scale-100'
            }`}
          >
            <img
              src={artwork.image}
              alt={artwork.title}
              className="max-h-[50vh] lg:max-h-[66vh] w-auto object-contain rounded-[3px]"
            />
          </div>

          {/* Next Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/70 hover:bg-white text-[#1A1817] fine-art-shadow transition-all"
            aria-label="Next artwork"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Right: Curatorial Metadata Panel */}
        <div className="w-full lg:w-80 space-y-6 border-t lg:border-t-0 lg:border-l border-[#1A1817]/08 lg:pl-10 text-[#1A1817]">
          
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#A88B57]">
              {artwork.category}
            </span>
            <h3 className="font-serif text-3xl font-light leading-snug">
              {artwork.title}
            </h3>
            <p className="font-sans text-xs text-[#1A1817]/50 tracking-wider">
              {artwork.year} · Richterswil, Switzerland
            </p>
          </div>

          <div className="space-y-2.5 py-4 border-y border-[#1A1817]/08 text-xs font-sans">
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] uppercase tracking-widest text-[#1A1817]/45">Size</span>
              <span className="font-medium text-[#1A1817]">{artwork.dimensions}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] uppercase tracking-widest text-[#1A1817]/45">Medium</span>
              <span className="font-medium text-[#1A1817] text-right max-w-[65%] leading-snug">{artwork.medium}</span>
            </div>
            {artwork.year && (
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] uppercase tracking-widest text-[#1A1817]/45">Year</span>
                <span className="font-medium text-[#1A1817]">{artwork.year}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] uppercase tracking-widest text-[#1A1817]/45">Status</span>
              <span className="font-medium text-[#A88B57]">{artwork.status}</span>
            </div>
          </div>

          {(artwork.philosophy || (artwork.caption && !artwork.caption.includes('Original artwork by Shalona, Richterswil'))) && (
            <div className="space-y-1.5 pt-1">
              <h4 className="text-[11px] font-sans uppercase tracking-[0.22em] text-[#A88B57] font-semibold">
                PHILOSOPHY
              </h4>
              <p className="font-serif italic text-sm text-[#1A1817]/90 leading-relaxed font-light">
                {artwork.philosophy || artwork.caption}
              </p>
            </div>
          )}

          {/* Actions: Inquire & In Room */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => {
                onClose(null);
                onOpenInquire(artwork);
              }}
              className="w-full py-3 rounded-full bg-[#1A1817] text-[#FBF9F5] text-xs font-sans tracking-[0.16em] uppercase flex items-center justify-center gap-2 hover:bg-[#A88B57] transition-colors shadow-sm"
            >
              <span>Acquisition Inquiry</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onOpenRoom(artwork)}
              className="w-full py-2.5 rounded-full border border-[#1A1817]/15 text-[#1A1817] text-xs font-sans tracking-[0.16em] uppercase flex items-center justify-center gap-2 hover:bg-white transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Simulate in Living Space</span>
            </button>
          </div>

          <div className="text-[10px] font-sans tracking-widest text-[#1A1817]/40 text-center uppercase">
            Artwork {currentIndex + 1} of {allArtworks.length}
          </div>
        </div>
      </div>
    </div>
  );
}
