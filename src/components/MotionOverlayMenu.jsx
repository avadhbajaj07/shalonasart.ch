import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SoundAmbiance from './SoundAmbiance';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';
import { InstagramIcon, FacebookIcon } from './Icons';
import { ArrowUpRight, ShieldCheck, Lock } from 'lucide-react';
import { artistData } from '../data/artist';

export default function MotionOverlayMenu({ onOpenInquire }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [clipOrigin, setClipOrigin] = useState({ x: '50%', y: '50px' });
  const triggerBtnRef = useRef(null);
  const location = useLocation();
  const { t } = useLanguage();

  // Navigation Links - "Home" on the top as requested
  const navItems = [
    { label: t.nav.home, to: '/', subtitle: 'Richterswil Atelier · Stillness & Movement' },
    { label: t.nav.works, to: '/arts', subtitle: 'Original Paintings · True Masonry' },
    { label: t.nav.about, to: '/biography', subtitle: 'Where the Visible Meets the Unseen' },
    { label: t.nav.exhibitions, to: '/exhibitions', subtitle: 'Ortsmuseum Bärenkeller · Dec 2026' },
    { label: t.nav.unfinished, to: '/unfinished-works', subtitle: 'Studies & Works in Waiting' },
    { label: t.nav.journal, to: '/journal', subtitle: 'Studio Essays on Stillness' },
    { label: t.nav.timeline, to: '/timeline', subtitle: 'Creative Milestones & Periods' },
    { label: t.nav.contact, to: '/contact', subtitle: 'Richterswil Atelier · Private Inquiries' },
  ];

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Lock body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Open with exact radial origin calculation
  const handleOpen = () => {
    if (triggerBtnRef.current) {
      const rect = triggerBtnRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      setClipOrigin({ x: `${x}px`, y: `${y}px` });
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* =========================================================================
          1. FLOATING CAPSULE PILL HEADER (Closed State / In Viewport)
          ========================================================================= */}
      <header className="fixed top-4 sm:top-6 left-0 right-0 z-40 flex justify-end sm:justify-center px-4 sm:px-6 pointer-events-none">
        <div className="w-auto sm:w-full max-w-xl sm:max-w-2xl h-12 sm:h-14 rounded-full bg-[#F6F4EF]/90 backdrop-blur-xl border border-[#DCD9D0] shadow-[0_4px_24px_-4px_rgba(42,42,42,0.1),0_1px_3px_rgba(42,42,42,0.04)] px-3.5 sm:px-6 flex items-center gap-3 sm:justify-between pointer-events-auto transition-all duration-300">
          
          {/* Left: Brand Logo + Wordmark */}
          <Link
            to="/"
            className="group flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none"
          >
            {/* Shalona's Art Line-Sketch Logo */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-[#2A2A2A]/15 shadow-sm bg-white flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform duration-300">
              <img
                src="/images/logo-shalona-art.jpg"
                alt="Shalona's Art"
                className="w-full h-full object-cover object-top rounded-full"
              />
            </div>

            <div className="flex flex-col">
              <span className="font-script text-2xl sm:text-3xl text-[#2A2A2A] tracking-normal leading-none pt-0.5">
                Shalona
              </span>
              <span className="font-sans text-[8px] uppercase tracking-[0.22em] text-[#7A7770] hidden sm:block mt-0.5">
                Richterswil · Switzerland
              </span>
            </div>
          </Link>

          {/* Right: Language Switcher + Sound Ambiance + Clean Icon Menu Trigger Button */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <div className="hidden sm:block">
              <LanguageSwitcher isLight={false} />
            </div>
            <SoundAmbiance />

            {/* Menu Trigger Button: Clean circular icon with horizontal lines */}
            <button
              ref={triggerBtnRef}
              onClick={handleOpen}
              className="group flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2A2A2A] hover:bg-[#A88B57] text-[#F6F4EF] transition-all duration-300 shadow-sm"
              aria-label="Open navigation menu"
              title="Menu"
            >
              <div className="flex flex-col items-center justify-center gap-1 group-hover:scale-110 transition-transform">
                <span className="w-3.5 sm:w-4 h-[1.5px] bg-[#F6F4EF] rounded-full transition-all duration-300" />
                <span className="w-3.5 sm:w-4 h-[1.5px] bg-[#F6F4EF] rounded-full transition-all duration-300" />
              </div>
            </button>
          </div>

        </div>
      </header>

      {/* =========================================================================
          2. MOTION OVERLAY MENU (Open State - Radial Clip-Path Expansion)
          ========================================================================= */}
      <div
        className={`fixed inset-0 z-50 bg-[#0E0D0C]/97 backdrop-blur-2xl text-[#F6F4EF] flex flex-col justify-between transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] overflow-hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          clipPath: isOpen
            ? `circle(150% at ${clipOrigin.x} ${clipOrigin.y})`
            : `circle(0% at ${clipOrigin.x} ${clipOrigin.y})`,
        }}
      >
        {/* In-Overlay Floating Capsule Pill (Morphs into Dark Capsule with "Close") */}
        <div className="pt-4 sm:pt-6 px-4 flex justify-center w-full">
          <div className="w-full max-w-xl sm:max-w-2xl h-14 rounded-full bg-white/10 border border-white/15 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between shadow-2xl">
            
            {/* Brand on dark */}
            <Link
              to="/"
              onClick={handleClose}
              className="group flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/30 shadow-sm bg-white flex items-center justify-center p-0.5">
                <img
                  src="/images/logo-shalona-art.jpg"
                  alt="Shalona's Art"
                  className="w-full h-full object-cover object-top rounded-full"
                />
              </div>

              <span className="font-script text-3xl sm:text-4xl text-white tracking-normal pt-1">
                Shalona
              </span>
            </Link>

            {/* Language Switcher & Close Button */}
            <div className="flex items-center gap-2 sm:gap-3">
              <LanguageSwitcher isLight={true} />

              <button
                onClick={handleClose}
                className="group flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-full bg-white/15 hover:bg-white text-white hover:text-[#0E0D0C] transition-all duration-300"
                aria-label="Close navigation menu"
              >
                <span className="font-sans text-xs font-medium uppercase tracking-[0.14em] hidden sm:inline">
                  Close
                </span>

                {/* Circular button with animated X lines */}
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 group-hover:bg-[#0E0D0C] text-white flex items-center justify-center transition-colors">
                  <span className="relative w-3.5 h-3.5 flex items-center justify-center">
                    <span className="absolute w-3.5 h-[1.5px] bg-current rotate-45" />
                    <span className="absolute w-3.5 h-[1.5px] bg-current -rotate-45" />
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            3. MAIN NAVIGATION ITEMS (Staggered Entrance & Mutual Dimming)
            ========================================================================= */}
        <div className="max-w-4xl w-full mx-auto px-6 sm:px-12 my-auto py-8">
          <nav className="flex flex-col space-y-3 sm:space-y-4">
            {navItems.map((item, index) => {
              const isHovered = hoveredIndex === index;
              const isDimmed = hoveredIndex !== null && !isHovered;

              return (
                <div
                  key={item.label}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] transform ${
                    isOpen 
                      ? 'translate-y-0 opacity-100 filter-none' 
                      : 'translate-y-8 opacity-0 blur-sm'
                  }`}
                  style={{
                    transitionDelay: isOpen ? `${index * 55 + 120}ms` : '0ms',
                    opacity: isDimmed ? 0.28 : 1,
                  }}
                >
                  <Link
                    to={item.to}
                    onClick={handleClose}
                    className="group inline-flex items-baseline gap-3 sm:gap-5 cursor-pointer py-1 max-w-full"
                  >
                    {/* Main High-Contrast Text (Always Single Line) */}
                    <span className="font-serif text-[21px] xs:text-[25px] sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-[-0.015em] text-white group-hover:text-[#A88B57] transition-colors duration-300 whitespace-nowrap">
                      {item.label}
                    </span>

                    {/* Subtitle / Micro tag that slides in on hover */}
                    <span className="font-sans text-[10px] sm:text-xs uppercase tracking-widest text-white/40 hidden md:inline opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      {item.subtitle}
                    </span>
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>

        {/* =========================================================================
            4. SECONDARY FOOTER INSIDE OVERLAY (Underline sliding animation)
            ========================================================================= */}
        <div className="max-w-5xl w-full mx-auto px-6 sm:px-12 pb-6 sm:pb-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-white/60">
          
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-widest text-[#A88B57]">
              Free Exhibition
            </span>
            <span>•</span>
            <span>Ortsmuseum Bärenkeller, Richterswil (3.–6. Dez 2026)</span>
          </div>

          {/* Social Links with Left-to-Right Expanding Hairline Underline */}
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href={artistData.contact.social.instagram}
              target="_blank"
              rel="noreferrer"
              className="relative group hover:text-white transition-colors py-1"
            >
              <span>Instagram</span>
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
            </a>

            <a
              href={artistData.contact.social.facebook}
              target="_blank"
              rel="noreferrer"
              className="relative group hover:text-white transition-colors py-1"
            >
              <span>Facebook</span>
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
            </a>

            <button
              onClick={() => {
                handleClose();
                onOpenInquire(null);
              }}
              className="relative group text-[#A88B57] hover:text-white transition-colors py-1"
            >
              <span>Acquisition Inquiry</span>
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#A88B57] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
            </button>

            <Link
              to="/admin"
              onClick={handleClose}
              className="relative group text-white/40 hover:text-[#A88B57] transition-colors py-1 flex items-center gap-1"
              title="Studio Admin Portal"
            >
              <Lock className="w-3 h-3 text-[#A88B57]" />
              <span className="text-[11px] uppercase tracking-wider">Admin</span>
            </Link>
          </div>

        </div>

      </div>
    </>
  );
}
