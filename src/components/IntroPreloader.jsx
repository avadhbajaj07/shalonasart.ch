import React, { useState, useEffect } from 'react';

export default function IntroPreloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('loading'); // 'loading' | 'fading' | 'done'

  // Letters of "Shalona" for letter-by-letter ink bleed reveal
  const letters = ['S', 'h', 'a', 'l', 'o', 'n', 'a'];

  useEffect(() => {
    // Snappy, subtle 600ms entrance
    const startTime = performance.now();
    const duration = 600; // ms

    const updateTimer = (now) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 100) {
        requestAnimationFrame(updateTimer);
      } else {
        // Exit transition: fast gentle fade
        setPhase('fading');
        setTimeout(() => {
          setPhase('done');
          try {
            sessionStorage.setItem('shalona_intro_seen', 'true');
          } catch (e) {}
          if (onComplete) onComplete();
        }, 300);
      }
    };

    const animId = requestAnimationFrame(updateTimer);
    return () => cancelAnimationFrame(animId);
  }, [onComplete]);

  if (phase === 'done') return null;

  // Format percentage as three digits e.g. 000, 045, 100
  const formattedPct = String(progress).padStart(3, '0');

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F6F4EF] transition-opacity duration-700 ease-out ${
        phase === 'fading' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Subtle organic canvas paper grain texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.9) 0%, rgba(246, 244, 239, 0.4) 100%),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paperNoise)' opacity='0.04'/%3E%3C/svg%3E")
          `
        }}
      />

      {/* SVG Ink Bleed Filter */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <filter id="inkBleedFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* Centerpiece Content Box */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-6">
        
        {/* "Shalona" Brand Name with Left-to-Right Ink Bleed Reveal */}
        <div className="flex items-center justify-center select-none mb-6">
          {letters.map((char, i) => {
            // Sequential letter reveal thresholds: S (10%), h (22%), a (35%), l (50%), o (65%), n (80%), a (92%)
            const letterThreshold = 8 + i * 14;
            const isRevealed = progress >= letterThreshold;
            const letterProgress = Math.min(1, Math.max(0, (progress - letterThreshold) / 12));

            // Ink bleed calculation: starts blurry & diffused, expands slightly, then sharpens into canvas fibers
            const blurAmount = (1 - letterProgress) * 14; // from 14px blur down to 0
            const opacity = Math.min(1, letterProgress * 1.2);
            const scale = 1.08 - letterProgress * 0.08; // subtle ink spread shrinking to crisp form

            return (
              <span
                key={i}
                className="font-sans font-medium text-5xl sm:text-6xl text-[#2A2A2A] tracking-[-0.03em] inline-block transition-all duration-300"
                style={{
                  filter: `blur(${blurAmount}px)`,
                  opacity: opacity,
                  transform: `scale(${scale})`,
                  willChange: 'filter, opacity, transform',
                }}
              >
                {char}
              </span>
            );
          })}
        </div>

        {/* Loading Indicator: Minimal Hairline 1px bar (No numbers) */}
        <div className="w-56 sm:w-64 pt-2">
          {/* 1px Hairline Progress Bar */}
          <div className="relative w-full h-[1px] bg-[#D4D1C9] overflow-hidden">
            <div 
              className="absolute left-0 top-0 bottom-0 bg-[#2A2A2A] transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Subtle tagline indicator */}
        <div className="mt-8 text-center">
          <p className="font-sans text-[9px] uppercase tracking-[0.28em] text-[#7A7770]/70 select-none">
            Intuitive Mixed Media Art · Richterswil, Switzerland
          </p>
        </div>

      </div>

      {/* Skip Button (Accessibility & Speed) */}
      <button
        onClick={() => {
          setPhase('fading');
          setTimeout(() => {
            setPhase('done');
            if (onComplete) onComplete();
          }, 400);
        }}
        className="absolute bottom-8 text-[10px] font-sans uppercase tracking-[0.2em] text-[#7A7770]/50 hover:text-[#2A2A2A] transition-colors"
      >
        Skip Intro →
      </button>
    </div>
  );
}
