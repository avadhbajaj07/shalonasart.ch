import React from 'react';
import Gallery from '../components/Gallery';
import SEO from '../components/SEO';

export default function ArtsPage({ artworks, onSelectArtwork, onOpenRoom }) {
  const artsSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Original Artworks Catalogue — SHALONA",
    "description": "Explore the complete collection of original mixed media artworks by Shalona in Richterswil, Switzerland.",
    "url": "https://shalonasart.ch/arts",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": artworks.length,
      "itemListElement": artworks.slice(0, 20).map((art, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://shalonasart.ch/arts/${art.slug}`,
        "name": art.title
      }))
    }
  };

  return (
    <div className="pt-28 sm:pt-36 min-h-screen">
      <SEO
        title="Original Artworks & Paintings Collection | SHALONA"
        description="Browse all original mixed media paintings by Swiss artist Shalona. Natural aspect ratio exhibition wall spanning Figurative Abstracts, Expressions, and Abstract works."
        path="/arts"
        schema={artsSchema}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 pb-8 border-b border-[#1A1817]/08">
        <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#A88B57]">
          Exhibition & Catalogue Raisonné
        </span>
        <h1 className="font-serif text-5xl sm:text-7xl font-light text-[#1A1817] mt-2 tracking-tight">
          Original Artworks
        </h1>
        <p className="font-serif italic text-xl text-[#1A1817]/70 font-light mt-3 max-w-2xl leading-relaxed">
          Presented in their natural proportions and scale — intuitive compositions of layered emulsion, lake water wash, raw earth pigments, and quiet force.
        </p>
      </div>

      <Gallery
        artworks={artworks}
        onSelectArtwork={onSelectArtwork}
        onOpenRoom={onOpenRoom}
        isStandalonePage={true}
      />
    </div>
  );
}
