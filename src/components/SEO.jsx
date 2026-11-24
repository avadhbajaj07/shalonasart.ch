import React, { useEffect } from 'react';

export default function SEO({
  title = "SHALONA — Mixed Media Artist · Switzerland",
  description = "Official portfolio of Shalona. Intuitive mixed media artworks, paintings, and photographic layers exploring memory, emotion, and unseen movement in Richterswil, Switzerland.",
  image = "https://shalonasart.ch/wp-content/uploads/2026/02/shalonasart2.jpg",
  path = "",
  schema = null,
  type = "website"
}) {
  const canonicalUrl = `https://shalonasart.ch${path.startsWith('/') ? path : '/' + path}`;

  useEffect(() => {
    // 1. Title
    document.title = title;

    // 2. Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    // 3. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    // 4. OpenGraph Tags
    const setOgTag = (property, content) => {
      let og = document.querySelector(`meta[property="${property}"]`);
      if (!og) {
        og = document.createElement('meta');
        og.setAttribute('property', property);
        document.head.appendChild(og);
      }
      og.content = content;
    };

    setOgTag('og:title', title);
    setOgTag('og:description', description);
    setOgTag('og:image', image);
    setOgTag('og:url', canonicalUrl);
    setOgTag('og:type', type);

    // 5. Schema.org JSON-LD
    let scriptTag = document.getElementById('seo-json-ld');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'seo-json-ld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const defaultSchema = {
      "@context": "https://schema.org",
      "@type": "ArtGallery",
      "name": "Shalona's Art",
      "url": "https://shalonasart.ch",
      "description": description,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Richterswil",
        "addressRegion": "Zurich",
        "addressCountry": "CH"
      },
      "founder": {
        "@type": "Person",
        "name": "Shalona",
        "jobTitle": "Mixed Media Artist",
        "sameAs": [
          "https://www.instagram.com/shalonasart/",
          "https://www.facebook.com/shalonasart/"
        ]
      }
    };

    scriptTag.text = JSON.stringify(schema || defaultSchema);

    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [title, description, image, canonicalUrl, schema, type]);

  return null;
}
