import React, { useState } from 'react';
import { X, ArrowUpRight } from 'lucide-react';

export default function RoomSimulatorModal({ artwork, onClose, onOpenInquire }) {
  const [wallColor, setWallColor] = useState('alabaster'); // 'alabaster' | 'linen' | 'gallery'

  if (!artwork) return null;

  const wallColors = {
    alabaster: 'bg-[#F4F1EA]',
    linen: 'bg-[#EAE4D9]',
    gallery: 'bg-[#262422]',
  };

  const isDark = wallColor === 'gallery';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 sm:p-8">
      <div className="relative w-full max-w-5xl bg-[#FAF8F3] rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-white/20">
        
        {/* Top Control Bar */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-[#1A1817]/08 bg-[#FAF8F3] z-10">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-light text-[#1A1817]">
              View in Room · <span className="italic">{artwork.title}</span>
            </h3>
            <p className="font-sans text-[11px] text-[#1A1817]/50 uppercase tracking-widest mt-0.5">
              Simulated 1:1 Scale Preview · {artwork.dimensions}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Wall Color Selectors */}
            <div className="flex items-center gap-2 text-xs font-sans">
              <span className="text-[10px] uppercase tracking-widest text-[#1A1817]/50 hidden sm:inline">Wall:</span>
              <button
                onClick={() => setWallColor('alabaster')}
                className={`w-6 h-6 rounded-full border transition-all ${wallColor === 'alabaster' ? 'ring-2 ring-[#A88B57] scale-110' : 'opacity-70'} bg-[#F4F1EA] border-[#1A1817]/20`}
                title="Warm Alabaster"
              />
              <button
                onClick={() => setWallColor('linen')}
                className={`w-6 h-6 rounded-full border transition-all ${wallColor === 'linen' ? 'ring-2 ring-[#A88B57] scale-110' : 'opacity-70'} bg-[#EAE4D9] border-[#1A1817]/20`}
                title="Textured Linen"
              />
              <button
                onClick={() => setWallColor('gallery')}
                className={`w-6 h-6 rounded-full border transition-all ${wallColor === 'gallery' ? 'ring-2 ring-[#A88B57] scale-110' : 'opacity-70'} bg-[#262422] border-[#1A1817]/20`}
                title="Moody Gallery Noir"
              />
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full border border-[#1A1817]/10 hover:bg-[#1A1817] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3D Realistic Room Interior Stage */}
        <div className={`relative w-full h-[60vh] sm:h-[68vh] transition-colors duration-700 flex flex-col justify-between overflow-hidden ${wallColors[wallColor]}`}>
          
          {/* Ceiling Spotlight Beam */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-3/4 pointer-events-none opacity-40"
            style={{
              background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.7) 0%, transparent 70%)'
            }}
          />

          {/* Wall Space with Floating Artwork (Borderless Canvas) */}
          <div className="relative flex-1 flex items-center justify-center pt-8">
            <div 
              className="relative p-2.5 sm:p-3 bg-[#FAF8F3] rounded-[4px] transition-all duration-500"
              style={{
                boxShadow: isDark
                  ? '0 30px 60px -15px rgba(0,0,0,0.8), 0 10px 20px rgba(0,0,0,0.5)'
                  : '0 30px 60px -15px rgba(28,25,23,0.18), 0 10px 25px -5px rgba(28,25,23,0.1)'
              }}
            >
              <img
                src={artwork.image}
                alt={artwork.title}
                className="max-h-[36vh] sm:max-h-[44vh] w-auto object-contain rounded-[2px]"
              />
            </div>
          </div>

          {/* Hardwood Floor & Bench Element */}
          <div className="relative w-full h-24 sm:h-28 bg-[#C2B29D] border-t border-[#1A1817]/15 shadow-inner flex items-end justify-center pb-2">
            
            {/* Minimalist Gallery Bench */}
            <div className="relative w-64 sm:w-80 h-10 sm:h-12 bg-[#3A332C] rounded-sm shadow-2xl flex flex-col justify-between">
              <div className="h-2 bg-[#4A423A] rounded-t-sm" />
              <div className="flex justify-between px-6 pb-0">
                <div className="w-2.5 h-6 bg-[#25201B]" />
                <div className="w-2.5 h-6 bg-[#25201B]" />
              </div>
            </div>

            {/* Bench Shadow */}
            <div className="absolute bottom-1 w-72 sm:w-88 h-3 bg-black/25 blur-sm rounded-full" />
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FAF8F3] border-t border-[#1A1817]/08">
          <p className="font-serif italic text-sm text-[#1A1817]/70">
            Complimentary international shipping with custom archival crate for all original pieces.
          </p>

          <button
            onClick={() => {
              onClose();
              onOpenInquire(artwork);
            }}
            className="px-6 py-2.5 rounded-full bg-[#1A1817] text-[#FBF9F5] text-xs font-sans tracking-[0.16em] uppercase flex items-center gap-2 hover:bg-[#A88B57] transition-colors"
          >
            <span>Inquire About This Piece</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
