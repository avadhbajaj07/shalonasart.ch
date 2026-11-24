import React from 'react';
import { ArrowUp, Mail, MapPin } from 'lucide-react';
import { InstagramIcon, FacebookIcon } from './Icons';
import { artistData } from '../data/artist';
import { Link } from 'react-router-dom';

export default function Footer({ onOpenInquire }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#F4F1EA] border-t border-[#1A1817]/08 pt-20 pb-12 px-6 sm:px-10 text-[#1A1817] overflow-hidden">
      
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Top: Brand & Call to Action */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 border-b border-[#1A1817]/08 pb-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 max-w-2xl">
            {/* Big Shalona Logo on Desktop & Mobile */}
            <Link to="/" className="group shrink-0 block" title="Shalona's Art">
              <div className="w-28 sm:w-36 md:w-44 aspect-square rounded-2xl bg-white p-3 border border-[#1A1817]/10 shadow-[0_8px_24px_-4px_rgba(42,42,42,0.08)] group-hover:border-[#A88B57] transition-all duration-300 overflow-hidden flex items-center justify-center">
                <img
                  src="/images/logo-shalona-art.jpg"
                  alt="Shalona's Art Logo"
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </Link>

            <div className="space-y-3">
              <Link to="/" className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-wide text-[#1A1817] hover:text-[#A88B57] transition-colors block leading-tight">
                Shalona
              </Link>
              <p className="font-sans text-xs sm:text-sm uppercase tracking-[0.2em] text-[#A88B57] font-medium">
                Mixed Media Artist · Richterswil, Switzerland
              </p>
              <p className="font-serif italic text-base sm:text-lg text-[#1A1817]/75 font-light leading-relaxed max-w-md">
                “Stillness is never empty—it is full of unseen movement.”
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-sans uppercase tracking-widest text-[#1A1817]/50">
              Private Studio Visits & Acquisitions
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="px-6 py-3 rounded-full bg-[#1A1817] text-[#FBF9F5] text-xs font-sans tracking-[0.16em] uppercase hover:bg-[#A88B57] transition-all duration-300 shadow-sm"
              >
                Inquire With Studio
              </Link>

              <button
                onClick={scrollToTop}
                className="p-3 rounded-full border border-[#1A1817]/15 hover:bg-white text-[#1A1817] transition-all"
                title="Return to top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Middle Navigation & Information Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-xs font-sans">
          
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#A88B57] font-semibold">
              Exhibitions & Works
            </p>
            <ul className="space-y-2 text-[#1A1817]/70">
              <li><Link to="/arts" className="hover:text-[#1A1817] transition-colors">All Artworks</Link></li>
              <li><Link to="/arts" className="hover:text-[#1A1817] transition-colors">Figurative Abstracts</Link></li>
              <li><Link to="/arts" className="hover:text-[#1A1817] transition-colors">Expressions Collection</Link></li>
              <li><Link to="/arts" className="hover:text-[#1A1817] transition-colors">Abstract Collection</Link></li>
              <li><Link to="/unfinished-works" className="hover:text-[#1A1817] transition-colors">Unfinished, Yet Alive</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#A88B57] font-semibold">
              The Artist
            </p>
            <ul className="space-y-2 text-[#1A1817]/70">
              <li><Link to="/biography" className="hover:text-[#1A1817] transition-colors">About Shalona</Link></li>
              <li><Link to="/biography" className="hover:text-[#1A1817] transition-colors">Creative Philosophy</Link></li>
              <li><Link to="/timeline" className="hover:text-[#1A1817] transition-colors">Artistic Timeline</Link></li>
              <li><Link to="/journal" className="hover:text-[#1A1817] transition-colors">Studio Journal (5 Essays)</Link></li>
              <li><Link to="/contact" className="hover:text-[#1A1817] transition-colors">Private Atelier Visits</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#A88B57] font-semibold">
              Studio & Atelier
            </p>
            <div className="space-y-1.5 text-[#1A1817]/70 leading-relaxed">
              <p>Richterswil, Canton of Zürich</p>
              <p>Switzerland</p>
              <p className="text-[10px] font-mono text-[#1A1817]/40 pt-1">
                47.2084° N, 8.7042° E
              </p>
              <p className="text-[11px] text-[#A88B57] pt-2">
                Visits by private appointment
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#A88B57] font-semibold">
              Connect & Follow
            </p>
            <div className="space-y-2 text-[#1A1817]/70">
              <a
                href={artistData.contact.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-[#A88B57] transition-colors"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>Instagram (@shalonasart)</span>
              </a>

              <a
                href={artistData.contact.social.facebook}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-[#A88B57] transition-colors"
              >
                <FacebookIcon className="w-3.5 h-3.5" />
                <span>Facebook</span>
              </a>

              <div className="pt-2">
                <Link
                  to="/contact"
                  className="flex items-center gap-2 hover:text-[#A88B57] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Direct Studio Email</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-[#1A1817]/08 flex flex-col sm:flex-row items-center justify-between text-[11px] font-sans text-[#1A1817]/50 gap-4">
          <div>
            © {new Date().getFullYear()} Shalona · All Rights Reserved. Richterswil, Lake Zurich, Switzerland.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] tracking-wider uppercase">
            <span>
              Designed & Developed by{' '}
              <a
                href="https://avadhbajaj.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#1A1817] hover:text-[#A88B57] underline decoration-[#A88B57]/50 hover:decoration-[#A88B57] transition-colors"
              >
                Avadh Bajaj
              </a>
            </span>
            <span>•</span>
            <span>Richterswil, Switzerland</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
