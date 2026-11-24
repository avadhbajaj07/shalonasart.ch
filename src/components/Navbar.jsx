import React, { useState, useEffect } from 'react';
import SoundAmbiance from './SoundAmbiance';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ onOpenInquire, onTriggerSmoke }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Index', to: '/' },
    { label: 'Works', to: '/arts' },
    { label: 'Exhibitions', to: '/unfinished-works' },
    { label: 'About', to: '/biography' },
    { label: 'Journal', to: '/journal' },
    { label: 'Timeline', to: '/timeline' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'py-3 bg-[#F6F4EF]/92 backdrop-blur-md border-b border-[#DCD9D0] shadow-[0_2px_15px_-5px_rgba(42,42,42,0.03)]'
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
          
          {/* Left: Small "Shalona" wordmark + Tracked-out micro-text */}
          <Link
            to="/"
            className="group flex items-baseline gap-2.5 cursor-pointer select-none"
            onClick={(e) => {
              if (onTriggerSmoke) {
                const rect = e.currentTarget.getBoundingClientRect();
                onTriggerSmoke(rect.left + rect.width / 2, rect.bottom);
              }
            }}
          >
            <span className="font-sans font-medium text-xl sm:text-2xl text-[#2A2A2A] tracking-[-0.03em] group-hover:text-[#A88B57] transition-colors">
              Shalona
            </span>
            <span className="font-sans text-[8.5px] uppercase tracking-[0.25em] text-[#7A7770] hidden sm:inline">
              PORTFOLIO & CURATION · RICHTERSWIL
            </span>
          </Link>

          {/* Center: Clean text links (Index, Works, Exhibitions, About, Journal, Contact) */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`font-sans text-xs tracking-[0.12em] uppercase transition-colors relative py-1 ${
                    isActive 
                      ? 'text-[#2A2A2A] font-semibold after:w-full' 
                      : 'text-[#7A7770] hover:text-[#2A2A2A]'
                  } after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-[#2A2A2A] hover:after:w-full after:transition-all after:duration-300 ${
                    isActive ? 'after:w-full' : 'after:w-0'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Subtle location / time text + Sound Ambiance + Inquire */}
          <div className="hidden sm:flex items-center space-x-4">
            <span className="font-sans text-[10px] tracking-widest text-[#7A7770] uppercase">
              Richterswil, CH · 47.2084° N
            </span>

            <SoundAmbiance />

            <button
              onClick={() => onOpenInquire(null)}
              className="px-4 py-1.5 rounded-full bg-[#2A2A2A] text-[#F6F4EF] text-xs font-sans tracking-[0.14em] uppercase hover:bg-[#A88B57] transition-all shadow-sm"
            >
              Inquire
            </button>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <SoundAmbiance />
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#2A2A2A] hover:text-[#A88B57] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-[#F6F4EF]/98 backdrop-blur-xl lg:hidden pt-24 px-8 flex flex-col justify-between pb-10 transition-all">
          <div className="space-y-6">
            <p className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#7A7770]">
              Portfolio & Curation · Shalona
            </p>
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-serif text-3xl font-light tracking-wide text-[#2A2A2A] hover:text-[#A88B57] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-[#DCD9D0]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenInquire(null);
              }}
              className="w-full py-3 rounded-full bg-[#2A2A2A] text-[#F6F4EF] text-xs font-sans tracking-[0.16em] uppercase flex items-center justify-center gap-2 hover:bg-[#A88B57] transition-colors"
            >
              <span>Acquisition Inquiry</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <p className="text-center font-sans text-[10px] tracking-widest text-[#7A7770] uppercase">
              Richterswil, Switzerland · Lake Zurich
            </p>
          </div>
        </div>
      )}
    </>
  );
}
