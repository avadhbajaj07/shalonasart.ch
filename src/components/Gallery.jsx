import React, { useState, useMemo } from 'react';
import ArtworkCard from './ArtworkCard';
import { LayoutGrid, List } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Gallery({ artworks, onSelectArtwork, onOpenRoom, isStandalonePage = false }) {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('wall'); // 'wall' | 'line'

  const categories = [
    { id: 'All', label: 'All Works' },
    { id: 'Figurative Abstracts', label: 'Figurative Abstracts' },
    { id: 'Expressions', label: 'Expressions' },
    { id: 'Abstract', label: 'Abstract' },
    { id: 'Unfinished Works', label: 'Unfinished Works' },
    { id: 'Private Collection', label: 'Private Collection' },
  ];

  // Filter artworks by category
  const filteredArtworks = useMemo(() => {
    return artworks.filter((item) => {
      if (selectedCategory === 'All') {
        // Exclude unfinished / untitled studies from the main exhibition collection
        return item.category !== 'Unfinished Works';
      } else if (selectedCategory === 'Private Collection') {
        return item.status === 'Private Collection';
      } else {
        return item.category === selectedCategory;
      }
    });
  }, [artworks, selectedCategory]);

  return (
    <section 
      id="gallery" 
      className={`px-6 sm:px-10 max-w-7xl mx-auto ${
        isStandalonePage ? 'py-12 sm:py-20' : 'py-24 sm:py-32 border-t border-[#1A1817]/08'
      }`}
    >
      
      {/* Curatorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-sans uppercase tracking-[0.25em] text-[#A88B57]">
            <span>Exhibition Catalogue</span>
            <span className="w-8 h-[1px] bg-[#A88B57]/40" />
            <span>Original Pieces · True Scale Masonry</span>
          </div>

          <div>
            <span className="font-script text-3xl sm:text-4xl text-[#A88B57] block mb-1">
              Curated Portfolio
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[#1A1817] tracking-tight">
              Selected Works
            </h2>
          </div>

          <p className="font-serif italic text-lg sm:text-xl text-[#1A1817]/70 leading-relaxed font-light">
            “Each painting grows through feeling rather than plan, guided by stillness, memory, and the subtle language of color and energy.”
          </p>
        </div>

        {/* View Mode Toggle: Wall vs Line View */}
        <div className="inline-flex items-center p-1 bg-white/60 border border-[#1A1817]/10 rounded-full shadow-xs shrink-0 self-start md:self-end">
          <button
            type="button"
            onClick={() => setViewMode('wall')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-sans uppercase tracking-[0.12em] transition-all duration-200 ${
              viewMode === 'wall'
                ? 'bg-[#1A1817] text-[#FBF9F5] shadow-xs font-medium'
                : 'text-[#1A1817]/60 hover:text-[#1A1817]'
            }`}
            title="Exhibition Wall View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>{t.gallery?.wallView || 'Wall'}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('line')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-sans uppercase tracking-[0.12em] transition-all duration-200 ${
              viewMode === 'line'
                ? 'bg-[#1A1817] text-[#FBF9F5] shadow-xs font-medium'
                : 'text-[#1A1817]/60 hover:text-[#1A1817]'
            }`}
            title="Line View"
          >
            <List className="w-3.5 h-3.5" />
            <span>{t.gallery?.lineView || 'Line View'}</span>
          </button>
        </div>
      </div>

      {/* Category Tabs (No Numbers) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none border-b border-[#1A1817]/06">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-sans tracking-[0.14em] uppercase whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? 'bg-[#1A1817] text-[#FBF9F5] shadow-sm'
                  : 'bg-white/30 text-[#1A1817]/65 hover:text-[#1A1817] hover:bg-white/70 border border-[#1A1817]/06'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Gallery Content Rendering: Wall View (Masonry) vs Line View */}
      {filteredArtworks.length === 0 ? (
        <div className="py-24 text-center space-y-3">
          <p className="font-serif italic text-2xl text-[#1A1817]/60">
            No artworks found in this category.
          </p>
          <button
            onClick={() => setSelectedCategory('All')}
            className="text-xs uppercase tracking-widest text-[#A88B57] underline underline-offset-4"
          >
            Show All Works
          </button>
        </div>
      ) : viewMode === 'line' ? (
        /* Line / Row View - Clean minimal catalogue list: Thumbnail, Category, Title, Philosophy only */
        <div className="space-y-3 sm:space-y-4">
          {filteredArtworks.map((artwork) => (
            <div
              key={artwork.id}
              onClick={() => onSelectArtwork(artwork)}
              className="group bg-[#FAF8F3] hover:bg-white border border-[#1A1817]/08 hover:border-[#A88B57]/40 rounded-xl p-3.5 sm:p-5 transition-all duration-300 shadow-xs hover:shadow-md flex items-center gap-4 sm:gap-6 cursor-pointer overflow-hidden"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectArtwork(artwork);
                }
              }}
            >
              {/* Left: Artwork Thumbnail */}
              <div className="w-16 h-20 sm:w-20 sm:h-24 bg-[#EAE6DE] rounded-md overflow-hidden shrink-0 fine-art-shadow">
                <img
                  src={artwork.thumbnail || artwork.image}
                  alt={artwork.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* Middle: Category, Title & Philosophy Only */}
              <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
                <div className="text-[10px] sm:text-xs uppercase font-sans tracking-[0.2em] text-[#A88B57] font-medium truncate">
                  {artwork.category}
                </div>
                <h3 className="font-serif text-lg sm:text-2xl font-light text-[#1A1817] group-hover:text-[#A88B57] transition-colors truncate">
                  {artwork.title}
                </h3>
                {(artwork.philosophy || artwork.caption) && (
                  <p className="font-serif italic text-xs sm:text-sm text-[#1A1817]/75 font-light leading-relaxed line-clamp-2 sm:line-clamp-3 break-words">
                    “{artwork.philosophy || artwork.caption}”
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Wall / Masonry View */
        <div className="masonry-columns">
          {filteredArtworks.map((artwork) => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              onSelect={onSelectArtwork}
              onOpenRoom={onOpenRoom}
            />
          ))}
        </div>
      )}

      {/* Footer note for catalogue */}
      <div className="mt-16 pt-8 border-t border-[#1A1817]/06 flex flex-col sm:flex-row items-center justify-between text-xs font-sans text-[#1A1817]/50 gap-4">
        <div className="italic font-serif text-sm">
          Natural aspect ratio presentation · Original mixed media, raw earth pigments & photographic emulsions. Richterswil, Switzerland.
        </div>
      </div>
    </section>
  );
}
