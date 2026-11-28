import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import ArtworkCard from '../components/ArtworkCard';
import { 
  ArrowLeft, ArrowRight, ArrowUpRight, Home, Eye, 
  MapPin, ShieldCheck, Sparkles, CheckCircle, Send, Loader2
} from 'lucide-react';
import { artistData } from '../data/artist';
import { sendInquiry } from '../utils/sendInquiry';

export default function ArtworkDetailPage({ artworks, onOpenRoom, onOpenInquire }) {
  const { slug } = useParams();
  const navigate = useNavigate();

  const artwork = artworks.find((a) => a.slug === slug) || artworks[0];
  const isSold = artwork.isSold || artwork.status === 'Sold' || artwork.status === 'Private Collection' || artwork.status === 'not_for_sale' || (artwork.status || '').toLowerCase().includes('sold');
  const currentIndex = artworks.findIndex((a) => a.id === artwork.id);
  const prevArtwork = artworks[(currentIndex - 1 + artworks.length) % artworks.length];
  const nextArtwork = artworks[(currentIndex + 1) % artworks.length];

  // Related artworks in same category
  const relatedArtworks = artworks
    .filter((a) => a.id !== artwork.id && a.category === artwork.category)
    .slice(0, 3);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    phone: '',
    message: isSold
      ? `I admire "${artwork.title}" (Acquired) and would like to inquire about commissioning a related original work or visiting the Richterswil studio.`
      : `I am interested in acquiring or viewing "${artwork.title}" (${artwork.dimensions}, ${artwork.year}).`
  });
  const [inquirySent, setInquirySent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await sendInquiry({
      ...formData,
      artworkTitle: artwork.title,
      inquiryType: 'Artwork Acquisition',
    });
    setIsSubmitting(false);
    setInquirySent(true);
  };

  const artworkSeoTitle = `${artwork.title} – ${artwork.category} by Shalona`;
  const artworkSeoDesc = `Discover ${artwork.title}, an original ${artwork.category} artwork by Shalona, a contemporary mixed-media artist based in Richterswil, Switzerland. ${artwork.philosophy || artwork.caption || ''}`.trim();

  const artworkSchema = {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    "name": artwork.title,
    "alternateName": `${artwork.title} by Shalona`,
    "image": `https://shalonasart.ch${artwork.image}`,
    "description": artwork.caption || artwork.philosophy || `Original ${artwork.category} artwork by Shalona.`,
    "artform": artwork.category,
    "artMedium": artwork.medium,
    "creator": {
      "@id": "https://shalonasart.ch/#artist"
    },
    "width": artwork.dimensions,
    "dateCreated": artwork.year,
    "locationCreated": {
      "@type": "Place",
      "name": "Richterswil, Canton of Zürich, Switzerland"
    },
    "offers": {
      "@type": "Offer",
      "availability": artwork.status === 'Available' ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
      "price": "0",
      "priceCurrency": "CHF",
      "url": `https://shalonasart.ch/arts/${artwork.slug}`
    }
  };

  return (
    <div className="pt-28 sm:pt-36 pb-24 min-h-screen">
      <SEO
        title={artworkSeoTitle}
        description={artworkSeoDesc}
        image={artwork.image}
        path={`/arts/${artwork.slug}`}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Artworks', path: '/arts' },
          { name: artwork.title, path: `/arts/${artwork.slug}` }
        ]}
        schema={artworkSchema}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Top Breadcrumb & Next/Prev Controls */}
        <div className="flex items-center justify-between pb-8 mb-8 border-b border-[#1A1817]/08 text-xs font-sans">
          <div className="flex items-center gap-2 text-[#1A1817]/60">
            <Link to="/" className="hover:text-[#1A1817] transition-colors">Home</Link>
            <span>/</span>
            <Link to="/arts" className="hover:text-[#1A1817] transition-colors">Works</Link>
            <span>/</span>
            <span className="text-[#1A1817] font-medium truncate max-w-[180px] sm:max-w-none">
              {artwork.title}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[#1A1817]/60">
            <Link
              to={`/arts/${prevArtwork.slug}`}
              className="flex items-center gap-1 hover:text-[#1A1817] transition-colors"
              title={`Previous: ${prevArtwork.title}`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Prev</span>
            </Link>
            <span className="text-[#1A1817]/20">•</span>
            <Link
              to={`/arts/${nextArtwork.slug}`}
              className="flex items-center gap-1 hover:text-[#1A1817] transition-colors"
              title={`Next: ${nextArtwork.title}`}
            >
              <span className="hidden sm:inline">Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Main Artwork Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left: High-Res Natural Aspect Ratio Presentation with Museum Shadow (Borderless) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-3 sm:p-5 bg-[#FAF8F3] fine-art-shadow rounded-[6px]">
              <div 
                className="relative w-full overflow-hidden bg-[#ECE6DC] rounded-[3px]"
                style={{
                  aspectRatio: artwork.aspectRatio ? `${artwork.aspectRatio}` : 'auto'
                }}
              >
                <img
                  src={artwork.image || artwork.localImage}
                  alt={`${artwork.title} – Original ${artwork.category} artwork by Shalona, Richterswil, Switzerland`}
                  width={artwork.width}
                  height={artwork.height}
                  className="w-full h-full object-contain"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
            </div>

            {/* Quick Actions Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <button
                onClick={() => onOpenRoom(artwork)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#1A1817]/15 hover:border-[#1A1817] text-xs font-sans uppercase tracking-[0.16em] text-[#1A1817] bg-white/60 transition-all shadow-sm"
              >
                <Home className="w-4 h-4 text-[#A88B57]" />
                <span>Simulate on Gallery Wall</span>
              </button>

              <div className="flex items-center gap-3 text-xs font-sans text-[#1A1817]/50">
                <span className="font-mono">{artwork.accession}</span>
                <span>•</span>
                <span>Natural {artwork.aspectRatio > 1 ? 'Landscape' : 'Portrait'} Proportions</span>
              </div>
            </div>
          </div>

          {/* Right: Curatorial & Acquisition Information */}
          <div className="lg:col-span-5 space-y-8 text-[#1A1817]">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-[10px] uppercase font-sans tracking-[0.25em] text-[#A88B57]">
                <span>{artwork.category}</span>
                <span className="w-6 h-[1px] bg-[#A88B57]/40" />
                <span>{artwork.year}</span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="font-serif text-4xl sm:text-5xl font-light text-[#1A1817] tracking-tight">
                  {artwork.title}
                </h1>
                {isSold && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-sans uppercase tracking-[0.2em] font-semibold bg-[#1A1817] text-amber-200 border border-amber-300/40 shadow-sm shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    SOLD · PRIVATE COLLECTION
                  </span>
                )}
              </div>

              <p className="font-sans text-xs uppercase tracking-widest text-[#1A1817]/50">
                Shalona · Richterswil, Switzerland
              </p>
            </div>

            {/* Specifications Box */}
            <div className="p-6 bg-[#FAF8F3] border border-[#1A1817]/08 rounded-sm space-y-4 text-xs font-sans">
              <div className="flex justify-between border-b border-[#1A1817]/06 pb-2.5">
                <span className="text-[#1A1817]/50 uppercase tracking-widest text-[10px]">Size</span>
                <span className="font-medium text-[#1A1817]">{artwork.dimensions}</span>
              </div>

              <div className="flex justify-between border-b border-[#1A1817]/06 pb-2.5">
                <span className="text-[#1A1817]/50 uppercase tracking-widest text-[10px]">Medium</span>
                <span className="font-medium text-[#1A1817] text-right max-w-[65%] leading-relaxed">
                  {artwork.medium}
                </span>
              </div>

              {artwork.year && (
                <div className="flex justify-between border-b border-[#1A1817]/06 pb-2.5">
                  <span className="text-[#1A1817]/50 uppercase tracking-widest text-[10px]">Year</span>
                  <span className="font-medium text-[#1A1817]">{artwork.year}</span>
                </div>
              )}

              <div className="flex justify-between border-b border-[#1A1817]/06 pb-2.5">
                <span className="text-[#1A1817]/50 uppercase tracking-widest text-[10px]">Provenance</span>
                <span className="font-medium text-[#1A1817]">Direct from Atelier Shalona (CH)</span>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-[#1A1817]/50 uppercase tracking-widest text-[10px]">Status</span>
                <span className={`font-semibold uppercase tracking-wider text-[11px] ${
                  isSold
                    ? 'text-amber-900 bg-amber-100/80 px-2.5 py-0.5 rounded border border-amber-300/50'
                    : artwork.status === 'In Progress'
                    ? 'text-[#A88B57]'
                    : 'text-emerald-700'
                }`}>
                  {isSold ? 'Sold · Private Collection' : artwork.status}
                </span>
              </div>
            </div>

            {/* Shalona's Artwork Philosophy */}
            {(artwork.philosophy || (artwork.caption && !artwork.caption.includes('Original artwork by Shalona, Richterswil'))) && (
              <div className="p-6 bg-[#FAF8F3] rounded-[4px] border border-[#1A1817]/06 space-y-3">
                <span className="text-[11px] font-sans uppercase tracking-[0.22em] text-[#A88B57] font-semibold block">
                  PHILOSOPHY
                </span>
                <p className="font-serif italic text-lg sm:text-xl text-[#1A1817]/90 leading-relaxed font-light">
                  {artwork.philosophy || artwork.caption}
                </p>
                <p className="font-script text-2xl text-[#A88B57] pt-1">
                  — Shalona
                </p>
              </div>
            )}

            {/* Studio Provenance & Guarantee */}
            <div className="flex items-center gap-2 text-[11px] font-sans text-[#1A1817]/65">
              <ShieldCheck className="w-4 h-4 text-[#A88B57] shrink-0" />
              <span>Original artwork cataloged with signed Certificate of Authenticity</span>
            </div>

            {/* Direct Acquisition / Commission Inquiry Form */}
            <div className="pt-6 border-t border-[#1A1817]/08 space-y-4">
              <h3 className="font-serif text-2xl font-light text-[#1A1817]">
                {isSold ? 'Commission or Studio Viewing Inquiry' : 'Private Acquisition Inquiry'}
              </h3>
              <p className="text-xs font-sans text-[#1A1817]/60 leading-relaxed font-light">
                {isSold
                  ? 'This original piece has been acquired into a private collection. You are warmly welcome to inquire about commissioning a related original work or visiting the studio in Richterswil.'
                  : 'For price guidance, private studio viewing appointments in Richterswil, or international shipping quotes, contact the atelier directly.'}
              </p>

              {inquirySent ? (
                <div className="p-6 bg-[#F6F3EE] rounded-sm border border-[#A88B57]/30 text-center space-y-2">
                  <CheckCircle className="w-8 h-8 text-[#A88B57] mx-auto" />
                  <p className="font-serif text-lg font-light text-[#1A1817]">
                    Inquiry Received
                  </p>
                  <p className="font-sans text-xs text-[#1A1817]/70">
                    Shalona's studio will reply directly within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3 text-xs font-sans">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Your Name *"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="px-3.5 py-2.5 rounded bg-white/70 border border-[#1A1817]/12 text-sm focus:outline-none focus:border-[#A88B57] text-[#1A1817]"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="px-3.5 py-2.5 rounded bg-white/70 border border-[#1A1817]/12 text-sm focus:outline-none focus:border-[#A88B57] text-[#1A1817]"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Your City / Country"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded bg-white/70 border border-[#1A1817]/12 text-sm focus:outline-none focus:border-[#A88B57] text-[#1A1817]"
                  />

                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded bg-white/70 border border-[#1A1817]/12 text-sm focus:outline-none focus:border-[#A88B57] text-[#1A1817] resize-none"
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-full bg-[#1A1817] text-[#FBF9F5] text-xs font-sans tracking-[0.16em] uppercase flex items-center justify-center gap-2 hover:bg-[#A88B57] disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending to Shalona...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Atelier Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

        {/* Related Artworks from the same collection */}
        {relatedArtworks.length > 0 && (
          <div className="mt-28 pt-16 border-t border-[#1A1817]/08">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#A88B57]">
                  Related Works
                </span>
                <h3 className="font-serif text-3xl font-light text-[#1A1817] mt-1">
                  More from {artwork.category}
                </h3>
              </div>
              <Link
                to="/arts"
                className="text-xs font-sans uppercase tracking-[0.16em] text-[#1A1817]/70 hover:text-[#A88B57] transition-colors"
              >
                View Full Collection →
              </Link>
            </div>

            <div className="masonry-columns">
              {relatedArtworks.map((item) => (
                <ArtworkCard
                  key={item.id}
                  artwork={item}
                  onSelect={() => navigate(`/arts/${item.slug}`)}
                  onOpenRoom={onOpenRoom}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
