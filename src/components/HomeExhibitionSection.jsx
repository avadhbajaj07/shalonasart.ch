import React from 'react';
import { Calendar, MapPin, Sparkles, ArrowRight, Navigation, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { artistData } from '../data/artist';
import { useLanguage } from '../context/LanguageContext';

export default function HomeExhibitionSection() {
  const { exhibition } = artistData;
  const { t } = useLanguage();
  const googleMapsDirectionsUrl = "https://www.google.com/maps/dir/?api=1&destination=Ortsmuseum+B%C3%A4renkeller,+Dorfbachstrasse+12,+8805+Richterswil,+Switzerland";

  return (
    <section className="py-20 sm:py-28 px-6 sm:px-10 max-w-7xl mx-auto border-t border-[#DCD9D0]/70">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-sans uppercase tracking-[0.25em] text-[#A88B57]">
            <span>{t.exhibitions?.tag || 'Exhibition & Atelier Showings'}</span>
            <span className="w-8 h-[1px] bg-[#A88B57]/40" />
            <span>{t.exhibitions?.venueLoc || 'Richterswil, Lake Zurich'}</span>
          </div>

          <div>
            <span className="font-script text-3xl sm:text-4xl text-[#A88B57] block mb-1">
              {t.exhibitions?.upcoming || 'Upcoming Exhibition'}
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#2A2A2A] tracking-tight leading-snug">
              {exhibition.theme}
            </h2>
          </div>

          <p className="font-serif italic text-base sm:text-lg text-[#7A7770] font-light leading-relaxed">
            “{exhibition.subtheme}”
          </p>
        </div>

        <Link
          to="/exhibitions"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2A2A2A] text-[#FBF9F5] text-xs font-sans tracking-[0.16em] uppercase hover:bg-[#A88B57] transition-all duration-300 shadow-sm shrink-0"
        >
          <span>Exhibition & Map Guide</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Exhibition Showcase Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-[#FAF8F3] border border-[#DCD9D0] rounded-2xl p-6 sm:p-10 shadow-[0_8px_30px_rgba(42,42,42,0.06)]">
        
        {/* Posters Preview */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <div className="aspect-[3/4] overflow-hidden rounded-xl shadow-md bg-[#EAE6DE] border border-[#DCD9D0]/60 group">
            <img
              src={exhibition.posterBaerenkeller}
              alt="Ortsmuseum Bärenkeller Exhibition Poster"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
          <div className="aspect-[3/4] overflow-hidden rounded-xl shadow-md bg-[#EAE6DE] border border-[#DCD9D0]/60 group">
            <img
              src={exhibition.posterEmpowerment}
              alt="Empowerment Exhibition Poster"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        </div>

        {/* Schedule & Venue Details */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            
            <div className="space-y-1.5">
              <span className="text-[10px] font-sans uppercase tracking-[0.22em] text-[#A88B57] font-semibold">
                Venue & Atelier
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#2A2A2A]">
                {exhibition.venue}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#7A7770] flex items-center gap-1.5 pt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#A88B57] shrink-0" />
                <span>{exhibition.address}</span>
              </p>
            </div>

            {/* Quick Badges */}
            <div className="flex flex-wrap gap-2 text-[11px] font-sans">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#DCD9D0] text-[#2A2A2A]">
                <Calendar className="w-3 h-3 text-[#A88B57]" />
                <span className="font-medium">{exhibition.dates}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>{t.exhibitions?.freeAdmission || 'Free Admission · Open Walk-In'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#DCD9D0] text-[#7A7770]">
                <span>No Vernissage</span>
              </span>
            </div>

            {/* Hours Overview */}
            <div className="p-4 bg-white rounded-xl border border-[#DCD9D0]/80 space-y-2 text-xs font-sans">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#A88B57]">
                <Clock className="w-3.5 h-3.5" />
                <span>Exhibition Hours</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#7A7770] pt-1">
                <div>
                  <span className="font-medium text-[#2A2A2A]">Do / Fr: </span>
                  <span>17:00 – 21:00</span>
                </div>
                <div>
                  <span className="font-medium text-[#2A2A2A]">Sa: </span>
                  <span>12:00 – 15:00 & 17:00 – 21:00</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="font-medium text-[#2A2A2A]">So: </span>
                  <span>12:00 – 17:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/exhibitions"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1A1817] text-[#FBF9F5] text-xs font-sans uppercase tracking-[0.14em] hover:bg-[#A88B57] transition-colors"
            >
              <span>View Full Exhibition Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#1A1817]/20 hover:border-[#1A1817] text-xs font-sans uppercase tracking-[0.14em] text-[#1A1817] bg-white transition-all shadow-xs"
            >
              <Navigation className="w-3.5 h-3.5 text-[#A88B57]" />
              <span>{t.exhibitions?.directions || 'Get Directions (GPS)'}</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
