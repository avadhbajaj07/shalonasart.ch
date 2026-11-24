import React from 'react';
import { artistData } from '../data/artist';
import SEO from '../components/SEO';
import { 
  Calendar, Clock, MapPin, Sparkles, Navigation, Train, 
  ExternalLink, CheckCircle, ShieldCheck, Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ExhibitionsPage() {
  const { exhibition } = artistData;

  const exhibitionSchema = {
    "@context": "https://schema.org",
    "@type": "ExhibitionEvent",
    "name": "Mysticism, Resilience and Empowerment — Art Exhibition by Shalona",
    "description": "Solo intuitive mixed media art exhibition by Shalona at Ortsmuseum Bärenkeller, Richterswil, Zurich. Free admission, open quiet walk-in exhibition.",
    "startDate": "2026-12-03T17:00:00+01:00",
    "endDate": "2026-12-06T17:00:00+01:00",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": "Ortsmuseum Bärenkeller",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Dorfbachstrasse 12",
        "addressLocality": "Richterswil",
        "postalCode": "8805",
        "addressRegion": "Zurich",
        "addressCountry": "CH"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 47.2084,
        "longitude": 8.7042
      }
    },
    "image": [
      "https://shalonasart.ch/exhibitions/poster-baerenkeller.jpg",
      "https://shalonasart.ch/exhibitions/poster-empowerment.jpg"
    ],
    "performer": {
      "@type": "Person",
      "name": "Shalona",
      "jobTitle": "Intuitive Mixed Media Artist",
      "sameAs": "https://shalonasart.ch/biography"
    },
    "organizer": {
      "@type": "Organization",
      "name": "Shalona's Art Atelier",
      "url": "https://shalonasart.ch"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "CHF",
      "availability": "https://schema.org/InStock",
      "url": "https://shalonasart.ch/exhibitions"
    }
  };

  const mapEmbedUrl = "https://maps.google.com/maps?q=Ortsmuseum+B%C3%A4renkeller,+Dorfbachstrasse+12,+8805+Richterswil,+Switzerland&t=&z=16&ie=UTF8&iwloc=&output=embed";
  const googleMapsDirectionsUrl = "https://www.google.com/maps/dir/?api=1&destination=Ortsmuseum+B%C3%A4renkeller,+Dorfbachstrasse+12,+8805+Richterswil,+Switzerland";

  return (
    <div className="pt-28 sm:pt-36 pb-24 min-h-screen">
      <SEO
        title="Exhibitions — Mysticism, Resilience and Empowerment | SHALONA · Richterswil"
        description="Upcoming exhibition by Swiss artist Shalona at Ortsmuseum Bärenkeller, Richterswil (3.–6. Dez 2026). Free admission, open walk-in. Map, schedule & atelier directions."
        path="/exhibitions"
        schema={exhibitionSchema}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Curatorial Header */}
        <div className="space-y-4 mb-16 max-w-3xl pb-8 border-b border-[#1A1817]/08">
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-sans uppercase tracking-[0.25em] text-[#A88B57]">
            <span>Exhibition & Atelier Showings</span>
            <span className="w-8 h-[1px] bg-[#A88B57]/40" />
            <span>Richterswil, Lake Zurich</span>
          </div>

          <div>
            <span className="font-script text-3xl sm:text-4xl text-[#A88B57] block mb-1">
              Upcoming Exhibition
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-[#1A1817] tracking-tight">
              {exhibition.theme}
            </h1>
          </div>

          <p className="font-serif italic text-xl sm:text-2xl text-[#1A1817]/75 font-light leading-relaxed">
            “{exhibition.subtheme}”
          </p>
        </div>

        {/* =========================================================================
            FEATURED EXHIBITION HERO CARD
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-[#FAF8F3] fine-art-shadow rounded-[8px] p-6 sm:p-10 mb-16 border border-[#1A1817]/06">
          
          {/* Left: Posters Presentation */}
          <div className="lg:col-span-5 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] overflow-hidden rounded-[3px] shadow-md bg-[#EAE6DE]">
                <img
                  src={exhibition.posterBaerenkeller}
                  alt="Ortsmuseum Bärenkeller Exhibition Poster"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
              <div className="aspect-[3/4] overflow-hidden rounded-[3px] shadow-md bg-[#EAE6DE]">
                <img
                  src={exhibition.posterEmpowerment}
                  alt="Empowerment Exhibition Poster"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>

            <div className="p-4 bg-white/70 rounded-[3px] border border-[#1A1817]/06 text-xs font-sans space-y-2">
              <div className="flex items-center gap-2 text-[#A88B57] font-medium uppercase tracking-wider text-[10px]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Exhibition Format</span>
              </div>
              <p className="text-[#1A1817]/75 leading-relaxed">
                {exhibition.vernissage} · {exhibition.admission}
              </p>
              <p className="text-[11px] text-[#1A1817]/55 font-light">
                All exhibited artworks are available for private acquisition.
              </p>
            </div>
          </div>

          {/* Right: Curatorial Details & Schedule */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              
              <div className="space-y-2">
                <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#A88B57]">
                  Venue & Address
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#1A1817]">
                  {exhibition.venue}
                </h2>
                <p className="font-sans text-sm text-[#1A1817]/70 flex items-center gap-2 pt-1">
                  <MapPin className="w-4 h-4 text-[#A88B57] shrink-0" />
                  <span>{exhibition.address}</span>
                </p>
              </div>

              {/* Schedule Table */}
              <div className="p-6 bg-white/80 rounded-[4px] border border-[#1A1817]/08 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#1A1817]/06">
                  <Calendar className="w-4 h-4 text-[#A88B57]" />
                  <span className="font-sans text-xs uppercase tracking-widest text-[#1A1817] font-semibold">
                    {exhibition.dates}
                  </span>
                </div>

                <div className="space-y-3 text-xs font-sans">
                  <div className="flex justify-between border-b border-[#1A1817]/04 pb-2">
                    <span className="text-[#1A1817]/60">Donnerstag, 3. Dez & Freitag, 4. Dez</span>
                    <span className="font-mono text-[#1A1817] font-medium">17:00 – 21:00</span>
                  </div>
                  <div className="flex justify-between border-b border-[#1A1817]/04 pb-2">
                    <span className="text-[#1A1817]/60">Samstag, 5. Dezember</span>
                    <span className="font-mono text-[#1A1817] font-medium">12:00 – 15:00 & 17:00 – 21:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#1A1817]/60">Sonntag, 6. Dezember</span>
                    <span className="font-mono text-[#1A1817] font-medium">12:00 – 17:00</span>
                  </div>
                </div>
              </div>

              {/* Curatorial Note */}
              <p className="font-serif italic text-base sm:text-lg text-[#1A1817]/80 leading-relaxed font-light">
                “Float through the mystical and discover empowerment. An intuitive encounter with raw pigments, photographic emulsions, and layered textures created in silence.”
              </p>

            </div>

            {/* Quick Map Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#1A1817]/06">
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A1817] hover:bg-[#A88B57] text-[#FBF9F5] text-xs font-sans tracking-[0.16em] uppercase transition-all shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions (GPS)</span>
              </a>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#1A1817]/20 hover:border-[#1A1817] text-xs font-sans tracking-[0.16em] uppercase text-[#1A1817] bg-white/50 transition-all"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Private Atelier Inquiry</span>
              </Link>
            </div>

          </div>

        </div>

        {/* =========================================================================
            INTERACTIVE GEO MAP & ARRIVAL GUIDE (Local SEO Cornerstone)
            ========================================================================= */}
        <div className="space-y-8 mb-20">
          
          <div className="space-y-2">
            <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#A88B57]">
              Location & Travel Directions
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#1A1817]">
              Finding Ortsmuseum Bärenkeller
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#1A1817]/65 max-w-2xl font-light">
              Situated in the historic core of Richterswil along Lake Zurich, the Bärenkeller is within walking distance from both the railway station and lakeside piers.
            </p>
          </div>

          {/* Map Frame */}
          <div className="relative w-full h-80 sm:h-96 rounded-[6px] overflow-hidden fine-art-shadow border border-[#1A1817]/08 bg-[#FAF8F3]">
            <iframe
              title="Ortsmuseum Bärenkeller Location Map"
              src={mapEmbedUrl}
              className="w-full h-full border-0 filter saturate-[0.85] contrast-[1.05]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Transit Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans">
            <div className="p-5 bg-[#FAF8F3] rounded-[4px] border border-[#1A1817]/06 space-y-2">
              <div className="flex items-center gap-2 text-[#A88B57] font-semibold text-[11px] uppercase tracking-wider">
                <Train className="w-4 h-4" />
                <span>By Train (S-Bahn)</span>
              </div>
              <p className="text-[#1A1817]/70 leading-relaxed font-light">
                Lines S2 and S8 run directly from <strong>Zürich Hauptbahnhof</strong> (approx. 30 min) to <strong>Richterswil Bahnhof</strong>. The museum is a scenic 4-minute walk up Dorfbachstrasse.
              </p>
            </div>

            <div className="p-5 bg-[#FAF8F3] rounded-[4px] border border-[#1A1817]/06 space-y-2">
              <div className="flex items-center gap-2 text-[#A88B57] font-semibold text-[11px] uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>By Car & Parking</span>
              </div>
              <p className="text-[#1A1817]/70 leading-relaxed font-light">
                Motorway A3 exit Richterswil. Public parking is available at Parkhaus Zentrum and near Richterswil train station (350 meters on foot).
              </p>
            </div>

            <div className="p-5 bg-[#FAF8F3] rounded-[4px] border border-[#1A1817]/06 space-y-2">
              <div className="flex items-center gap-2 text-[#A88B57] font-semibold text-[11px] uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Previous Solo Shows</span>
              </div>
              <p className="text-[#1A1817]/70 leading-relaxed font-light">
                {exhibition.previousExhibitions}. Private appointments for studio visits can be scheduled directly with Shalona's Richterswil atelier.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
