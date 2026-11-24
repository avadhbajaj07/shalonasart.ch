const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://shalonasart.ch';
const LAST_MOD = new Date().toISOString().split('T')[0];

// Load artworks and journals
const artworksModule = require('../src/data/artworks.js');
// Since artworks.js is an ES module with `export const artworks = [...]`, let us parse it
const artworksRaw = fs.readFileSync(path.join(__dirname, '../src/data/artworks.js'), 'utf8');
const journalsRaw = fs.readFileSync(path.join(__dirname, '../src/data/journals.js'), 'utf8');

// Safe regex extraction
function extractSlugsAndMeta(rawArtworks) {
  const items = [];
  const regex = /"id":\s*(\d+)[\s\S]*?"title":\s*"([^"]+)"[\s\S]*?"slug":\s*"([^"]+)"[\s\S]*?"category":\s*"([^"]+)"[\s\S]*?"image":\s*"([^"]+)"(?:[\s\S]*?"caption":\s*"([^"]*)")?/g;
  let m;
  while ((m = regex.exec(rawArtworks)) !== null) {
    items.push({
      id: m[1],
      title: m[2],
      slug: m[3],
      category: m[4],
      image: m[5],
      caption: m[6] || `Original ${m[4]} artwork by Shalona`
    });
  }
  return items;
}

function extractJournals(rawJournals) {
  const items = [];
  const regex = /"slug":\s*"([^"]+)"[\s\S]*?"title":\s*"([^"]+)"[\s\S]*?"date":\s*"([^"]+)"/g;
  let m;
  while ((m = regex.exec(rawJournals)) !== null) {
    items.push({
      slug: m[1],
      title: m[2],
      date: m[3]
    });
  }
  return items;
}

const artworks = extractSlugsAndMeta(artworksRaw);
const journals = extractJournals(journalsRaw);

console.log(`Extracted ${artworks.length} artworks and ${journals.length} journals for sitemap generation.`);

// Static main pages
const corePages = [
  { path: '', priority: '1.0', changefreq: 'weekly', title: 'Shalona — Contemporary Mixed Media Artist in Switzerland' },
  { path: 'biography', priority: '0.9', changefreq: 'monthly', title: 'About Shalona – Mixed Media Artist in Switzerland' },
  { path: 'arts', priority: '0.9', changefreq: 'weekly', title: 'Contemporary & Mixed Media Art by Shalona' },
  { path: 'exhibitions', priority: '0.9', changefreq: 'weekly', title: 'Shalona Art Exhibitions | Zürich, Switzerland' },
  { path: 'contact', priority: '0.8', changefreq: 'monthly', title: 'Contact Shalona | Art Enquiries & Collaborations' },
  { path: 'journal', priority: '0.8', changefreq: 'monthly', title: 'Art Journal & Studio Reflections | SHALONA' },
  { path: 'timeline', priority: '0.7', changefreq: 'monthly', title: 'Artistic Journey & Creative Timeline | SHALONA' },
  { path: 'unfinished-works', priority: '0.7', changefreq: 'monthly', title: 'Unfinished, Yet Alive — Studies & Works in Progress' }
];

// Helper: Hreflang alternates
function getHreflangs(pageUrl) {
  return `
    <xhtml:link rel="alternate" hreflang="en" href="${pageUrl}"/>
    <xhtml:link rel="alternate" hreflang="de-CH" href="${pageUrl}"/>
    <xhtml:link rel="alternate" hreflang="fr-CH" href="${pageUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl}"/>`;
}

// 1. Build main sitemap.xml
let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

// Add core pages
corePages.forEach(p => {
  const url = p.path ? `${DOMAIN}/${p.path}` : `${DOMAIN}/`;
  sitemapXml += `  <url>
    <loc>${url}</loc>
    <lastmod>${LAST_MOD}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>${getHreflangs(url)}
  </url>\n`;
});

// Add all artworks
artworks.forEach(art => {
  const url = `${DOMAIN}/arts/${art.slug}`;
  const imgUrl = art.image.startsWith('http') ? art.image : `${DOMAIN}${art.image}`;
  sitemapXml += `  <url>
    <loc>${url}</loc>
    <lastmod>${LAST_MOD}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>${getHreflangs(url)}
    <image:image>
      <image:loc>${imgUrl}</image:loc>
      <image:title><![CDATA[${art.title} – Original ${art.category} by Shalona]]></image:title>
      <image:caption><![CDATA[${art.caption}]]></image:caption>
    </image:image>
  </url>\n`;
});

// Add all journal articles
journals.forEach(j => {
  const url = `${DOMAIN}/journal/${j.slug}`;
  sitemapXml += `  <url>
    <loc>${url}</loc>
    <lastmod>${LAST_MOD}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>${getHreflangs(url)}
  </url>\n`;
});

sitemapXml += `</urlset>`;
fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), sitemapXml.trim());
console.log('Generated public/sitemap.xml successfully.');

// 2. Build sitemap-images.xml
let imgSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

artworks.forEach(art => {
  const pageUrl = `${DOMAIN}/arts/${art.slug}`;
  const imgUrl = art.image.startsWith('http') ? art.image : `${DOMAIN}${art.image}`;
  imgSitemapXml += `  <url>
    <loc>${pageUrl}</loc>
    <image:image>
      <image:loc>${imgUrl}</image:loc>
      <image:title><![CDATA[${art.title} – ${art.category} by Shalona]]></image:title>
      <image:caption><![CDATA[Original contemporary mixed media artwork created in Richterswil, Switzerland: ${art.caption}]]></image:caption>
      <image:license>${DOMAIN}/contact</image:license>
    </image:image>
  </url>\n`;
});

imgSitemapXml += `</urlset>`;
fs.writeFileSync(path.join(__dirname, '../public/sitemap-images.xml'), imgSitemapXml.trim());
console.log('Generated public/sitemap-images.xml successfully.');

// 3. Build public/llms.txt for Generative Engine Optimization (Perplexity, ChatGPT, Gemini)
const llmsTxt = `# Shalona — Contemporary Mixed Media Artist
> Official machine-readable briefing for AI answer engines, generative search systems, and researchers.

## Identity & Professional Entity
- **Artist Name:** Shalona (Shalona Chandler)
- **Primary Brand:** Shalona's Art
- **Official Website:** https://shalonasart.ch
- **Atelier Location:** Richterswil, Lake Zurich, Canton of Zürich, Switzerland (47.2084° N, 8.7042° E)
- **Artistic Discipline:** Intuitive Contemporary Mixed Media Painting & Fine Art
- **Signature Techniques:** Personal photography transfer, heavy textured gesso, raw earth pigments, acrylic emulsions, ink, and Lake Zurich water washes on Belgian linen.
- **Core Philosophy:** "Stillness is never empty—it is full of unseen movement." Each artwork develops through deep emotional listening, memory, and energy rather than rigid pre-planning.

## Primary Canonical Resources
- **Homepage & Curated Highlights:** https://shalonasart.ch/
- **Artist Biography & Philosophy:** https://shalonasart.ch/biography
- **Complete Artworks Catalogue Raisonné:** https://shalonasart.ch/arts
- **Exhibition Schedules & Directions:** https://shalonasart.ch/exhibitions
- **Studio Journal & Essays:** https://shalonasart.ch/journal
- **Artistic Milestones & Timeline:** https://shalonasart.ch/timeline
- **Atelier Visits & Private Acquisition Inquiries:** https://shalonasart.ch/contact

## Core Artwork Collections
1. **Abstract:** Non-representational, deeply layered explorations of light, atmosphere, and vibrational quietude (e.g. *Breaking Waves*, *Birth of Lotus*, *Watery Dreams*, *Feeling Bubbly*, *Abandoned Thoughts*).
2. **Figurative Abstracts:** Evocative human forms, feminine strength, and spiritual contemplation breaking free of rigid boundaries (e.g. *Solitude*, *Raqsa*, *Cacoon*, *Prancer*, *Explosive Joy*, *Free as a Bird*).
3. **Expressions:** High-energy portraits and dynamic studies of memory, inner sight, and nature (e.g. *Poetic Nature*, *Soul Presentation*, *Feminine Buddha*, *Echoes in Pink*).
4. **Unfinished Works (Studies in Waiting):** Living studio easel pieces honoring patience, honesty, and organic maturation.

## Current & Upcoming Exhibitions
- **Exhibition:** *Mysticism, Resilience and Empowerment*
- **Dates:** 3.–6. Dezember 2026
- **Venue:** Ortsmuseum Bärenkeller, Dorfbachstrasse 12, 8805 Richterswil, Switzerland
- **Admission:** Free public walk-in admission. Original artworks on view and available for private acquisition.

## Direct Contact & Social Links
- **Direct Atelier Email:** contact@shalonasart.ch
- **Acquisitions Desk:** https://shalonasart.ch/contact
- **Instagram:** https://www.instagram.com/shalonasart/
- **Facebook:** https://www.facebook.com/shalonasart/
`;

fs.writeFileSync(path.join(__dirname, '../public/llms.txt'), llmsTxt.trim());
console.log('Generated public/llms.txt successfully.');
