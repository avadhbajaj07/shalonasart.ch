import React, { useRef, useEffect, useState, useCallback } from 'react';
import { artworks as defaultArtworks } from '../data/artworks';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroArtCarousel({
  artworks = defaultArtworks,
  bgArtworkSlug = 'birth-of-lotus',
  onSelectArtwork,
}) {
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  // 60fps GPU-accelerated motion state in refs to prevent React render churn
  const offsetRef = useRef(0);
  const halfWidthRef = useRef(0);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startOffsetRef = useRef(0);
  const dragDistanceRef = useRef(0);

  // Background artwork selection (configurable via bgArtworkSlug)
  const bgArtwork =
    artworks.find((a) => a.slug === bgArtworkSlug) ||
    artworks.find((a) => a.slug === 'explosive-spring') ||
    artworks[1] ||
    artworks[0];

  // Selected artworks for the inline editorial title capsules (inspired by the reference design)
  const pillArt1 = artworks.find((a) => a.slug === 'solitude') || artworks[5] || artworks[0];
  const pillArt2 = artworks.find((a) => a.slug === 'birth-of-lotus') || artworks[1] || artworks[2];

  // All 57 artworks duplicated once to achieve a continuous, mathematically seamless infinite loop
  const duplicatedArtworks = [...artworks, ...artworks];

  // Measure half-width of the track for seamless infinite wrapping
  const measureTrack = useCallback(() => {
    if (trackRef.current) {
      halfWidthRef.current = trackRef.current.scrollWidth / 2;
    }
  }, []);

  useEffect(() => {
    measureTrack();
    window.addEventListener('resize', measureTrack);
    return () => window.removeEventListener('resize', measureTrack);
  }, [measureTrack, artworks]);

  // Infinite RAF animation loop (scrolls smoothly from right to left)
  useEffect(() => {
    const scrollSpeed = 0.85; // Luxurious, steady museum viewing pace (~51px / sec)

    const animate = () => {
      if (!isHoveredRef.current && !isDraggingRef.current && halfWidthRef.current > 0) {
        offsetRef.current -= scrollSpeed;

        // When the first set of 57 items has scrolled past, seamlessly reset
        if (offsetRef.current <= -halfWidthRef.current) {
          offsetRef.current += halfWidthRef.current;
        } else if (offsetRef.current > 0) {
          offsetRef.current -= halfWidthRef.current;
        }

        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
        }
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Pointer / Touch drag handling for natural swipe support
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    startOffsetRef.current = offsetRef.current;
    dragDistanceRef.current = 0;
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const currentX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = currentX - startXRef.current;
    dragDistanceRef.current = Math.abs(deltaX);

    offsetRef.current = startOffsetRef.current + deltaX;

    // Wrap offset during manual swipe if necessary
    if (halfWidthRef.current > 0) {
      if (offsetRef.current <= -halfWidthRef.current) {
        offsetRef.current += halfWidthRef.current;
        startXRef.current = currentX;
        startOffsetRef.current = offsetRef.current;
      } else if (offsetRef.current > 0) {
        offsetRef.current -= halfWidthRef.current;
        startXRef.current = currentX;
        startOffsetRef.current = offsetRef.current;
      }
    }

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleArtworkClick = (artwork) => {
    // Only trigger select if user didn't perform an intentional swipe/drag gesture (>6px)
    if (dragDistanceRef.current < 6 && onSelectArtwork) {
      onSelectArtwork(artwork);
    }
  };

  const scrollToGallery = () => {
    const el = document.getElementById('gallery');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={containerRef}
      className="relative w-full overflow-hidden select-none pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 flex flex-col justify-between min-h-[92vh]"
      onMouseEnter={() => { isHoveredRef.current = true; }}
      onMouseLeave={() => { isHoveredRef.current = false; isDraggingRef.current = false; }}
    >
      {/* =========================================================================
          1. ARTISTIC STATIONARY BLURRED BACKGROUND
          Actual artwork from collection + Gaussian blur + translucent ivory overlay
          ========================================================================= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        {/* Colorful high-res artwork background scaled to fill entire hero */}
        {bgArtwork && (
          <img
            src={bgArtwork.image || bgArtwork.localImage}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover scale-110 filter blur-[55px] opacity-75 transition-opacity duration-1000"
            loading="eager"
          />
        )}

        {/* Soft, light ivory / warm-white translucent overlay (approx 85% opacity) */}
        <div className="absolute inset-0 bg-[#F6F4EF]/85 backdrop-blur-[35px]" />

        {/* Subtle fine gesso canvas grain overlay for tactile museum feel */}
        <div 
          className="absolute inset-0 opacity-[0.035] mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* =========================================================================
          2. EDITORIAL TYPOGRAPHY WITH INLINE ARTWORK CAPSULES
          Inspired by the luxury reference image design
          ========================================================================= */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mb-8 sm:mb-12">
        
        {/* Micro Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F3]/70 border border-[#DCD9D0]/60 text-[#7A7770] text-[10px] font-sans uppercase tracking-[0.24em] mb-4 sm:mb-6 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2A2A2A] animate-pulse" />
          <span>Shalona · Intuitive Art · Richterswil, Switzerland</span>
        </div>

        {/* Headline with Inline Rounded Artwork Capsules */}
        <h1 className="font-sans text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-[#2A2A2A] tracking-[-0.025em] leading-[1.2] sm:leading-[1.15]">
          Experience a world
          <span className="inline-block w-12 h-7 sm:w-16 sm:h-9 md:w-20 md:h-11 rounded-full overflow-hidden align-middle mx-2 sm:mx-3 shadow-[0_2px_10px_rgba(42,42,42,0.14)] bg-[#EAE6DE]">
            <img
              src={pillArt1.image || pillArt1.thumbnail || pillArt1.localImage}
              alt=""
              className="w-full h-full object-cover scale-110"
            />
          </span>
          where
          <br className="hidden sm:inline" />
          <span className="font-serif italic font-light text-[#2A2A2A] ml-2 sm:ml-0">
            Stillness knows no bounds
          </span>
          <span className="inline-block w-16 h-7 sm:w-22 sm:h-9 md:w-28 md:h-11 rounded-full overflow-hidden align-middle mx-2 sm:mx-3 shadow-[0_2px_10px_rgba(42,42,42,0.14)] bg-[#EAE6DE]">
            <img
              src={pillArt2.image || pillArt2.thumbnail || pillArt2.localImage}
              alt=""
              className="w-full h-full object-cover scale-110"
            />
          </span>
        </h1>

        {/* Editorial Sub-copy */}
        <p className="mt-4 sm:mt-6 font-sans text-xs sm:text-sm md:text-base text-[#7A7770] max-w-2xl mx-auto font-light leading-relaxed">
          Come into a world of intuition and stillness through our curated collection.
          Paintings moving between memory, emotion, and unseen energy on Lake Zurich.
        </p>

      </div>

      {/* =========================================================================
          3. SEAMLESS INFINITE HORIZONTAL ARTWORK CAROUSEL
          - Displays ALL 57 artworks from the collection
          - 4 artworks side by side on desktop, 2-3 on tablet, 1.5-2 on mobile
          - Equal-height rectangular panels with very small gaps (3px)
          - Borderless, original colors, 100% unblurred and sharp
          - Continuous right-to-left scroll, pauses on hover, touch-draggable
          ========================================================================= */}
      <div 
        className="relative z-10 w-full overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'pan-y' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          ref={trackRef}
          className="flex flex-row items-center gap-[3px] will-change-transform"
          style={{ transform: 'translate3d(0, 0, 0)' }}
        >
          {duplicatedArtworks.map((artwork, index) => (
            <div
              key={`${artwork.id}-${index}`}
              onClick={() => handleArtworkClick(artwork)}
              className="relative shrink-0 overflow-hidden bg-[#EAE6DE] cursor-pointer group
                w-[calc(60vw-2px)] sm:w-[calc(44vw-2.5px)] md:w-[calc(35vw-2.5px)] lg:w-[calc(25vw-2.25px)]
                h-[44vh] sm:h-[50vh] md:h-[56vh] lg:h-[62vh] min-h-[340px] max-h-[680px]
                transition-transform duration-500 ease-out"
            >
              {/* Sharp, vibrant, completely unblurred artwork image */}
              <img
                src={artwork.image || artwork.thumbnail || artwork.localImage}
                alt={artwork.title}
                className="w-full h-full object-cover object-center pointer-events-none select-none transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                loading={index < 8 ? 'eager' : 'lazy'}
                decoding="async"
              />

              {/* Ultra-subtle museum vignette on hover (borderless) */}
              <div className="absolute inset-0 bg-[#1A1817]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          4. BOTTOM BAR: CIRCULAR ROTATING BADGE + SECONDARY EXHIBITION LINKS
          Inspired directly by the reference image
          ========================================================================= */}
      <div className="relative z-20 max-w-7xl w-full mx-auto px-6 sm:px-10 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Left: Signature Circular Rotating Badge ("Art Like No Other / Shalona's Art") */}
        <div 
          onClick={scrollToGallery}
          className="group relative -mt-10 sm:-mt-14 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#1A1817] text-[#F6F4EF] shadow-2xl flex items-center justify-center cursor-pointer transition-transform duration-500 hover:scale-105 shrink-0"
          title="Explore Exhibition Works"
        >
          {/* Rotating Text around Circle SVG */}
          <svg className="w-full h-full animate-[spin_20s_linear_infinite]" viewBox="0 0 100 100">
            <defs>
              <path
                id="circlePathBadge"
                d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
              />
            </defs>
            <text className="font-sans text-[8.5px] uppercase tracking-[0.28em] fill-[#F6F4EF]">
              <textPath href="#circlePathBadge" startOffset="0%">
                • SHALONA'S ART • RICHTERSWIL • SWITZERLAND
              </textPath>
            </text>
          </svg>

          {/* Center Arrow Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5 text-[#F6F4EF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Right: Exhibition Notice & Secondary Links (Underlined style from reference) */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-6 text-xs font-sans text-[#2A2A2A]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A88B57]" />
            <span className="font-medium">Original Artworks Available</span>
          </div>

          <span className="text-[#DCD9D0] hidden sm:inline">•</span>

          <Link
            to="/unfinished-works"
            className="relative group font-medium hover:text-[#A88B57] transition-colors py-1"
          >
            <span>Ortsmuseum Bärenkeller (Dec 3–6, 2026)</span>
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#2A2A2A] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </Link>

          <span className="text-[#DCD9D0] hidden sm:inline">•</span>

          <Link
            to="/arts"
            className="relative group font-medium hover:text-[#A88B57] transition-colors py-1 underline underline-offset-4"
          >
            <span>Our Exhibitions →</span>
          </Link>
        </div>

      </div>

    </section>
  );
}