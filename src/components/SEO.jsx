import React, { useEffect } from 'react';

const PRODUCTION_DOMAIN = 'https://shalonasart.ch';

export const PRIMARY_ARTIST_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${PRODUCTION_DOMAIN}/#artist`,
  "name": "Shalona",
  "alternateName": "Shalona Chandler",
  "jobTitle": "Contemporary Mixed-Media Artist",
  "url": PRODUCTION_DOMAIN,
  "image": `${PRODUCTION_DOMAIN}/images/shalona-portrait-closeup.jpg`,
  "description": "Intuitive contemporary mixed-media artist based in Richterswil, Switzerland. Blending personal photography, acrylic emulsions, ink, lake water wash, and raw earth pigments.",
  "birthPlace": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "CH"
    }
  },
  "workLocation": {
    "@type": "Place",
    "name": "Shalona Atelier & Private Studio",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Richterswil",
      "addressRegion": "Canton of Zürich",
      "addressCountry": "CH",
      "postalCode": "8805"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 47.2084,
      "longitude": 8.7042
    }
  },
  "sameAs": [
    "https://www.instagram.com/shalonasart/",
    "https://www.facebook.com/shalonasart/"
  ],
  "knowsAbout": [
    "Mixed Media Art",
    "Contemporary Painting",
    "Abstract Art",
    "Figurative Abstraction",
    "Fine Art Exhibitions in Switzerland",
    "Pigment & Emulsion Layering"
  ]
};

export default function SEO({
  title = "Shalona | Contemporary Mixed Media Artist in Switzerland",
  description = "Discover Shalona's contemporary mixed-media art in Richterswil, Switzerland. Explore abstract paintings, expressive artworks and upcoming exhibitions.",
  image = `${PRODUCTION_DOMAIN}/wp-content/uploads/2026/02/shalonasart2.jpg`,
  path = "",
  schema = null,
  type = "website",
  breadcrumbs = null,
  noindex = false
}) {
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  const canonicalUrl = `${PRODUCTION_DOMAIN}${cleanPath}`;

  useEffect(() => {
    // 1. Title
    document.title = title;

    // Helper: Meta tag updater
    const setMetaTag = (attribute, name, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attribute, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Helper: Link tag updater
    const setLinkTag = (rel, href, extraAttrs = {}) => {
      let el = document.querySelector(`link[rel="${rel}"]${extraAttrs.hreflang ? `[hreflang="${extraAttrs.hreflang}"]` : ''}`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        Object.entries(extraAttrs).forEach(([k, v]) => el.setAttribute(k, v));
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // 2. Standard Meta
    setMetaTag('name', 'description', description);

    // Environment-safe robots: if hostname is vercel preview, noindex it; otherwise index
    const isPreview = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');
    const robotsContent = noindex || isPreview 
      ? 'noindex, nofollow' 
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    setMetaTag('name', 'robots', robotsContent);

    // 3. Canonical Link (Always Production Domain)
    setLinkTag('canonical', canonicalUrl);

    // 4. Multilingual Hreflang Tags (en, de-CH, fr-CH, x-default)
    setLinkTag('alternate', canonicalUrl, { hreflang: 'en' });
    setLinkTag('alternate', canonicalUrl, { hreflang: 'de-CH' });
    setLinkTag('alternate', canonicalUrl, { hreflang: 'fr-CH' });
    setLinkTag('alternate', canonicalUrl, { hreflang: 'x-default' });

    // 5. OpenGraph Tags
    setMetaTag('property', 'og:site_name', "Shalona's Art");
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', image.startsWith('http') ? image : `${PRODUCTION_DOMAIN}${image}`);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:locale', 'en_US');
    setMetaTag('property', 'og:locale:alternate', 'de_CH');
    setMetaTag('property', 'og:locale:alternate', 'fr_CH');

    // 6. Twitter / X Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', image.startsWith('http') ? image : `${PRODUCTION_DOMAIN}${image}`);

    // 7. Schema.org JSON-LD (Combined Graph)
    let scriptTag = document.getElementById('seo-json-ld');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'seo-json-ld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const graph = [PRIMARY_ARTIST_SCHEMA];

    if (breadcrumbs && breadcrumbs.length > 0) {
      graph.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": crumb.name,
          "item": `${PRODUCTION_DOMAIN}${crumb.path}`
        }))
      });
    }

    if (schema) {
      if (Array.isArray(schema)) {
        graph.push(...schema);
      } else {
        graph.push(schema);
      }
    }

    scriptTag.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": graph
    });

  }, [title, description, image, canonicalUrl, type, noindex, schema, breadcrumbs]);

  return null;
}
