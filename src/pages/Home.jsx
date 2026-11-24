import React from 'react';
import HeroBackgroundCarousel from '../components/HeroBackgroundCarousel';
import ArtistIntroSection from '../components/ArtistIntroSection';
import HomeExhibitionSection from '../components/HomeExhibitionSection';
import Gallery from '../components/Gallery';
import VideoReel from '../components/VideoReel';
import SEO from '../components/SEO';
import { artistData } from '../data/artist';
import { getLiveJournals } from '../utils/studioStore';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, MapPin, Tag, Calendar, Sparkles } from 'lucide-react';

export default function Home({
  artworks,
  onTriggerSmoke,
  onSelectArtwork,
  onOpenRoom,
  onOpenInquire
}) {
  const journals = getLiveJournals();
  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "ArtGallery",
    "name": "Shalona's Art",
    "url": "https://shalonasart.ch",
    "image": "https://shalonasart.ch/wp-content/uploads/2026/02/shalonasart2.jpg",
    "description": "Original mixed media artworks by Shalona. Free admission exhibition at Ortsmuseum Bärenkeller, Richterswil. Original artworks available for private acquisition.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Dorfbachstrasse 12",
      "addressLocality": "Richterswil",
      "postalCode": "8805",
      "addressRegion": "Zurich",
      "addressCountry": "CH"
    },
    "founder": {
      "@type": "Person",
      "name": "Shalona",
      "jobTitle": "Intuitive Mixed Media Artist",
      "sameAs": [
        "https://www.instagram.com/shalonas_art/",
        "https://www.facebook.com/shalonasart/"
      ]
    }
  };

  return (
    <>
      <SEO
        title="Shalona | Contemporary Mixed Media Artist in Switzerland"
        description="Discover Shalona's contemporary mixed-media art in Richterswil, Switzerland. Explore abstract paintings, expressive artworks and upcoming exhibitions."
        path="/"
        schema={homeSchema}
      />

      {/* 1. Hero Section: Panoramic Carousel with Heading & Button */}
      <HeroBackgroundCarousel />

      {/* 2. Artist Statement & Portrait Section (Just After Hero) */}
      <ArtistIntroSection />

      {/* 3. Upcoming Exhibition Feature (Richterswil Showing) */}
      <HomeExhibitionSection />

      {/* 4. Selected Works Gallery (True Natural Aspect Ratio Masonry & Line View) */}
      <div className="relative">
        <Gallery
          artworks={artworks}
          onSelectArtwork={onSelectArtwork}
          onOpenRoom={onOpenRoom}
        />
        
        {/* View All Works CTA */}
        <div className="text-center pb-20">
          <Link
            to="/arts"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#2A2A2A] text-[#F6F4EF] text-xs font-sans tracking-[0.18em] uppercase hover:bg-[#A88B57] transition-all duration-300 shadow-md"
          >
            <span>Explore All Works in True Masonry</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 4. Studio Journal Teaser */}
      <section className="py-24 sm:py-32 px-6 sm:px-10 max-w-7xl mx-auto border-t border-[#DCD9D0]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[10px] font-sans uppercase tracking-[0.25em] text-[#7A7770]">
              <span>Studio Reflections</span>
              <span className="w-8 h-[1px] bg-[#DCD9D0]" />
              <span>The Journal</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#2A2A2A] ink-bleed">
              Thoughts in Stillness
            </h2>

            <p className="font-serif italic text-lg text-[#7A7770] font-light">
              Essays written slowly from the easel in Richterswil, exploring color as language and the mystery of the unfinished.
            </p>
          </div>

          <Link
            to="/journal"
            className="inline-flex items-center gap-2 text-xs font-sans tracking-[0.16em] uppercase text-[#7A7770] hover:text-[#2A2A2A] transition-colors"
          >
            <span>View All 5 Essays</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {journals.slice(0, 3).map((entry) => (
            <Link
              key={entry.id}
              to={`/journal/${entry.slug}`}
              className="group p-8 bg-[#FAF8F3] border border-[#DCD9D0] rounded-[6px] fine-art-shadow hover:bg-white hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[10px] font-sans uppercase tracking-[0.2em] text-[#A88B57]">
                  <span>Entry 0{entry.entryNumber}</span>
                  <span className="text-[#7A7770]">{entry.dateFormatted}</span>
                </div>

                <h3 className="font-serif text-2xl font-light text-[#2A2A2A] group-hover:text-[#A88B57] transition-colors leading-snug">
                  {entry.title}
                </h3>

                <p className="font-sans text-xs text-[#7A7770] font-light leading-relaxed line-clamp-3">
                  {entry.excerpt}
                </p>
              </div>

              <div className="pt-6 border-t border-[#DCD9D0]/60 flex items-center justify-between text-[11px] font-sans tracking-[0.14em] uppercase text-[#7A7770] group-hover:text-[#2A2A2A] transition-colors">
                <span>Read Essay</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Studio Process Film */}
      <VideoReel />
    </>
  );
}
