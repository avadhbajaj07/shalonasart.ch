import React from 'react';
import { Eye, Home, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ArtworkCard({ artwork, onSelect, onOpenRoom }) {
  const isSold = artwork.status === 'Private Collection';
  const isWip = artwork.status === 'In Progress';

  return (
    <article 
      className="masonry-item group relative flex flex-col bg-[#FAF8F3] rounded-[6px] p-3 sm:p-4 fine-art-shadow transition-all duration-700 hover:-translate-y-1.5"
    >
      {/* Artwork Canvas Container - Exact Natural Aspect Ratio (True Masonry, Borderless) */}
      <div 
        onClick={() => onSelect(artwork)}
        className="relative w-full overflow-hidden bg-[#ECE6DC] cursor-pointer rounded-[3px]"
        style={{
          aspectRatio: artwork.aspectRatio ? `${artwork.aspectRatio}` : 'auto'
        }}
      >
        {/* Artwork Image with Exact Proportions */}
        <img
          src={artwork.localImage || artwork.thumbnail || artwork.image}
          alt={artwork.title}
          width={artwork.width}
          height={artwork.height}
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.035]"
          loading="lazy"
        />

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 bg-[#1A1817]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center gap-2 sm:gap-3 backdrop-blur-[2px] p-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(artwork);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FBF9F5] text-[#1A1817] text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.14em] hover:bg-[#A88B57] hover:text-white transition-colors shadow-lg"
            title="Inspect high-resolution details"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Inspect</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenRoom(artwork);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FBF9F5] text-[#1A1817] text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.14em] hover:bg-[#A88B57] hover:text-white transition-colors shadow-lg"
            title="View in Room (Wall Simulator)"
          >
            <Home className="w-3.5 h-3.5" />
            <span>In Room</span>
          </button>

          <Link
            to={`/arts/${artwork.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#1A1817] text-[#FBF9F5] text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.14em] hover:bg-[#A88B57] transition-colors shadow-lg"
            title="Go to dedicated page"
          >
            <span>Page</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Status Badge */}
        <div className="absolute top-2.5 right-2.5 pointer-events-none">
          {isSold ? (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-sans uppercase tracking-[0.2em] bg-[#1A1817]/80 text-white/90 backdrop-blur-sm">
              Private Collection
            </span>
          ) : isWip ? (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-sans uppercase tracking-[0.2em] bg-[#A88B57]/90 text-white backdrop-blur-sm">
              In Progress
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-sans uppercase tracking-[0.2em] bg-[#FBF9F5]/90 text-[#1A1817]/80 backdrop-blur-sm shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
              Available
            </span>
          )}
        </div>
      </div>

      {/* Museum Placard Underneath */}
      <div className="pt-3.5 pb-1 flex flex-col justify-between flex-grow">
        <div className="flex items-baseline justify-between gap-2 pb-1.5">
          <Link
            to={`/arts/${artwork.slug}`}
            className="font-serif text-xl sm:text-2xl font-light text-[#1A1817] group-hover:text-[#A88B57] transition-colors leading-tight"
          >
            {artwork.title}
          </Link>
          <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#1A1817]/40 shrink-0">
            {artwork.year}
          </span>
        </div>

        <div className="pt-1 flex items-center justify-between text-[11px] font-sans text-[#1A1817]/60">
          <span className="truncate pr-2 font-mono text-[10px]" title={artwork.dimensions}>
            {artwork.dimensions}
          </span>
          <span className="text-[10px] tracking-widest uppercase text-[#A88B57] font-medium shrink-0">
            {artwork.category}
          </span>
        </div>

        {/* Curatorial note if available */}
        {artwork.caption && artwork.caption !== 'Original artwork by Shalona, Richterswil, Switzerland.' && (
          <p className="font-serif italic text-xs text-[#1A1817]/65 mt-1 line-clamp-2">
            “{artwork.caption}”
          </p>
        )}
      </div>
    </article>
  );
}
