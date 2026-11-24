# Comprehensive SEO, AEO, GEO & Technical Audit Report
**Website:** https://shalonasart.ch/  
**Staging / Development:** https://shalonasartch.vercel.app/  
**Brand:** Shalona's Art · Fine Art Atelier  
**Artist:** Shalona (Richterswil, Canton of Zürich, Switzerland)  
**Audit Date:** November 2026  
**Auditor:** Senior Technical SEO, AEO & Web Performance Specialist  

---

## 1. Executive Summary

This audit evaluates the organic search readiness, Answer Engine Optimization (AEO), Generative Engine Optimization (GEO), and technical web architecture for the contemporary mixed-media artist portfolio **SHALONA** (shalonasart.ch). 

The website possesses strong core visual assets, authentic curatorial philosophy, and responsive layouts. However, prior to this optimization, search engines and AI answer engines faced significant structural hurdles:
1. **Client-Side SPA Architecture**: Search crawlers, social share bots (WhatsApp, Facebook, LinkedIn, iMessage), and AI indexers that do not evaluate heavy JavaScript received an empty `<div id="root"></div>` without pre-rendered semantic HTML or structured data.
2. **Missing Crawl Infrastructure**: No `robots.txt`, no XML sitemap (`sitemap.xml`, `sitemap-images.xml`), and no `llms.txt` existed in the public web root.
3. **Incomplete Metadata Hierarchy**: Pages lacked the exact, search-intent-optimized title and description structures specified for Swiss art collectors and international galleries.
4. **Untracked Conversions**: Enquiries and artwork engagements had no structured analytics pipeline (GA4 / GTM) to measure lead generation and collection popularity.
5. **Admin Visibility**: The Studio Portal lacked an SEO overview dashboard to maintain metadata completeness as future artworks and exhibitions are added.

---

## 2. Issues Classification & Severity Breakdown

### 🔴 Critical Priority (Must Fix for Indexing & Search Discovery)
- [x] **Missing `robots.txt`**: No robots exclusion standard file existed in `public/`. Search engine bots could not verify crawling rules or sitemap location.
- [x] **Missing XML Sitemap Suite**: Neither `/sitemap.xml` nor `/sitemap-images.xml` existed. Search engines had to rely solely on internal client links to discover 57+ catalogued artworks.
- [x] **Empty Initial HTML Body**: React SPA architecture served only `<div id="root"></div>` with static default meta tags. Bots unable to execute client-side JS missed the rich artwork metadata.
- [x] **Preview Indexing Risk**: The Vercel staging deployment (`shalonasartch.vercel.app`) lacked environment-specific `noindex` headers, risking duplicate content penalty against `shalonasart.ch`.

### 🟠 High Priority (Rankings & Social Sharing)
- [x] **Discrepancy in SEO Titles**: Page titles were generic (`SHALONA — Mixed Media Artist · Switzerland`) across multiple routes instead of targeting specific search intents (e.g. *Contemporary Mixed Media Artist in Switzerland*, *Original Abstract Paintings by Shalona*).
- [x] **Missing AI Context File (`/llms.txt`)**: Generative search engines (Perplexity, ChatGPT Search, Gemini, Microsoft Copilot) lacked a structured machine-readable briefing on Shalona's entity, artistic techniques, location, and collections.
- [x] **Incomplete OpenGraph Tags**: Missing image dimensions, locale fallbacks, and Twitter/X card metadata on individual artwork pages.
- [x] **Schema Entity Fragmentation**: Structured data did not consistently anchor all artwork and exhibition entities back to a single primary artist node (`https://shalonasart.ch/#artist`).

### 🟡 Medium Priority (AEO & User Experience)
- [x] **Unanswered High-Intent Collector Questions**: No structured FAQ existed to answer common search queries (e.g., *“Who is Shalona?”, “What techniques are used?”, “Where is the atelier located?”, “How to acquire art or visit in Richterswil?”*).
- [x] **Unoptimized Image Alt Attributes**: Artwork images lacked rich contextual alt descriptions (only titles were used rather than artistic style and medium context).
- [x] **Absence of GA4 Custom Event Tracking**: No analytics tracking existed for `view_artwork`, `artwork_enquiry_click`, `generate_lead`, `exhibition_directions`, or `language_change`.

### 🟢 Low Priority & Enhancements
- [x] **Missing Admin SEO Completeness Dashboard**: The Studio Portal had no interface for Shalona to audit missing image alt text, descriptions, and preview Google search snippets before publishing new art.
- [x] **Legacy URL 301 Migration Map**: Outdated WordPress endpoints (`/my-arts/`, `/unfinished-works/`, `/wp-login.php`) needed clean 301 rewrites to new clean routes.

---

## 3. Detailed Page-by-Page Audit Findings

| Page / Route | Primary Target Keyword | Existing Title Status | Structured Data | Indexing Status |
| :--- | :--- | :--- | :--- | :--- |
| `/` (Homepage) | Mixed media artist Switzerland | Needs exact master title | ArtGallery (needs Person #artist) | Needs full prerender & meta |
| `/biography` | About Shalona Mixed Media Artist | Needs targeted format | Missing ProfilePage schema | Passed |
| `/arts` | Contemporary & Mixed Media Art | Generic title | ItemList basic | Needs CollectionPage enhancement |
| `/arts/:slug` | [Artwork] - [Style] by Shalona | Needs dynamic formula | VisualArtwork basic | Needs breadcrumbs & #artist link |
| `/exhibitions` | Shalona Art Exhibitions Zürich | Needs localized format | Event basic | Needs venue geo coordinates & status |
| `/contact` | Contact Shalona Art Enquiries | Basic | ContactPage basic | Needs FAQPage integration |
| `/journal` | Behind the Canvas / Studio Notes | Basic | BlogPosting basic | Needs author entity anchor |
| `/timeline` | Artistic Journey Shalona | Basic | BreadcrumbList missing | Passed |

---

## 4. Remediation Plan

1. **Build Static Crawlable HTML Pre-renderer**: Ensure Googlebot, Bingbot, Perplexity, and social bots receive complete HTML, meta tags, and JSON-LD out of the box.
2. **Deploy XML Sitemaps & robots.txt**:
   - `public/robots.txt` allowing legitimate search & AI bots while disallowing `/admin/`.
   - `public/sitemap.xml` listing all pages, collections, and 57+ artworks with `<image:image>` metadata.
   - `public/llms.txt` for Generative Engine Optimization.
3. **Upgrade Dynamic SEO Metadata & Schema**:
   - Implement the exact requested master titles and meta descriptions.
   - Standardize `https://shalonasart.ch/#artist` entity ID across all JSON-LD schemas.
4. **AEO FAQ & Knowledge Engine**:
   - Add structured answers for high-frequency queries in `/contact` and structured FAQPage schema.
5. **Analytics & Lead Tracking**:
   - Set up consent-ready GA4/GTM architecture tracking key business events (`generate_lead`, `view_artwork`, `view_exhibition`).
6. **Studio Portal SEO Dashboard**:
   - Add an SEO tab inside `/admin` to monitor completeness and simulate Google snippets.
