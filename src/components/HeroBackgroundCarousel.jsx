import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const heroSlides = [
  {
    id: 1,
    image: '/hero/hero-blue-vision.jpg',
    title: 'Azure Movement',
    medium: 'Mixed media, raw pigments & gold leaf on canvas',
  },
  {
    id: 2,
    image: '/hero/hero-silver-gesso.jpg',
    title: 'Silent Reflection',
    medium: 'Textured gesso, charcoal & photographic layer',
  },
  {
    id: 3,
    image: '/hero/hero-contemplation.jpg',
    title: 'Solitude in Ochre',
    medium: 'Layered pigments, oil glaze & warm linen wash',
  },
];

export default function HeroBackgroundCarousel() {
  const { t } = useLanguage();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto-advance slides every 5.5s unless paused
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % heroSlides.length);
  };

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      handleNext();
    } else if (touchEndX.current - touchStartX.current > 50) {
      handlePrev();
    }
  };

  const scrollToNextSection = () => {
    const el = document.getElementById('artist-statement') || document.getElementById('gallery');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      className="relative w-full h-screen min-h-[640px] max-h-[1050px] overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* =========================================================================
          1. FULLSCREEN CAROUSEL BACKGROUND SLIDES
          ========================================================================= */}
      {heroSlides.map((slide, idx) => {
        const isActive = idx === currentIdx;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10'
            }`}
          >
            {/* Painting Image with gentle slow zoom effect & responsive focal centering */}
            <img
              src={slide.image}
              alt={slide.title}
              className={`w-full h-full object-cover hero-focal-${slide.id} transition-transform duration-[6500ms] ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
              loading={idx === 0 ? 'eager' : 'lazy'}
            />

            {/* Cinematic contrast overlay for text legibility */}
            <div className="absolute inset-0 bg-black/35 backdrop-blur-[0.5px]" />

            {/* Museum-Grade Continuous Dissolve into warm canvas (#F6F4EF) with zero hard line */}
            <div 
              className="absolute inset-x-0 bottom-0 h-64 sm:h-80 md:h-96 pointer-events-none"
              style={{
                background: 'linear-gradient(to top, #F6F4EF 0%, #F6F4EF 14%, rgba(246, 244, 239, 0.94) 26%, rgba(246, 244, 239, 0.82) 40%, rgba(246, 244, 239, 0.65) 54%, rgba(246, 244, 239, 0.44) 68%, rgba(246, 244, 239, 0.24) 80%, rgba(246, 244, 239, 0.08) 92%, rgba(246, 244, 239, 0) 100%)',
              }}
            />
          </div>
        );
      })}

      {/* Subtle paper grain texture across background */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-multiply z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* =========================================================================
          2. HERO CONTENT: HEADING WITH BUTTON
          “Stillness is never empty—it is full of unseen movement.” — Shalona
          ========================================================================= */}
      <div className="relative z-20 h-full flex flex-col justify-between pt-28 sm:pt-36 pb-12 sm:pb-16 px-6 sm:px-10 max-w-7xl mx-auto">
        
        {/* Top Micro Tag */}
        <div className="flex items-center justify-between text-white/80 text-[10px] sm:text-xs font-sans tracking-[0.24em] uppercase">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/25 backdrop-blur-md border border-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A88B57] animate-pulse" />
            <span>{t.hero?.tag || 'Intuitive Mixed Media Art · Richterswil, Switzerland'}</span>
          </div>
          
          <div className="hidden sm:block text-white/70 font-mono text-[11px]">
            {heroSlides[currentIdx].title}
          </div>
        </div>

        {/* Center: Monumental Heading & Author Quote with Button */}
        <div className="my-auto text-center max-w-4xl mx-auto space-y-6 sm:space-y-8">
          
          {/* Main Heading Quote */}
          <h1 className="font-serif italic text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white leading-[1.18] sm:leading-[1.15] tracking-[-0.015em] drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
            {t.hero?.quote || '“Stillness is never empty—it is full of unseen movement.”'}
          </h1>

          {/* Author Signature (Handwritten Script Font) */}
          <p className="font-script text-4xl sm:text-5xl md:text-6xl text-[#F6F4EF] font-normal tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] pt-1 select-none">
            {t.hero?.author || '— Shalona'}
          </p>

          {/* Buttons with refined handwritten script styling */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={scrollToNextSection}
              className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#F6F4EF] hover:bg-[#A88B57] text-[#2A2A2A] hover:text-white transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:scale-105"
            >
              <span className="font-script text-xl sm:text-2xl capitalize leading-none pt-0.5">
                {t.hero?.exploreBtn || 'Explore The Story'}
              </span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </button>

            <Link
              to="/arts"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md text-white transition-all duration-300 border border-white/30 hover:scale-105"
            >
              <span className="font-script text-xl sm:text-2xl capitalize leading-none pt-0.5">
                {t.hero?.allWorksBtn || 'All Artworks'}
              </span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

        {/* =========================================================================
            3. BOTTOM CONTROLS & SLIDE METADATA (Seamless Dissolve, Zero Border Line)
            ========================================================================= */}
        <div className="flex items-center justify-between text-xs font-sans text-white/80 pt-4">
          
          {/* Left: Minimal Slide Progress Indicators (No Numbers) */}
          <div className="flex items-center gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                className={`h-1.5 transition-all duration-500 rounded-full ${
                  i === currentIdx ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Center: Medium Note (desktop) */}
          <div className="hidden md:block text-[11px] text-white/70 font-light truncate max-w-sm">
            {heroSlides[currentIdx].medium}
          </div>

          {/* Right: Prev / Next Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full bg-black/25 hover:bg-white hover:text-[#2A2A2A] text-white border border-white/25 backdrop-blur-md transition-colors"
              aria-label="Previous artwork slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-black/25 hover:bg-white hover:text-[#2A2A2A] text-white border border-white/25 backdrop-blur-md transition-colors"
              aria-label="Next artwork slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}