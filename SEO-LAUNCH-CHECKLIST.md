# SEO & Digital Discovery Launch Checklist
## Shalona's Art (`https://shalonasart.ch/`)

This comprehensive checklist guides the final deployment, verification, and ongoing search authority maintenance for Shalona's digital presence across Google, Bing, Apple, and modern Generative/Answer Engines (ChatGPT, Perplexity, Gemini, Copilot).

---

## Phase 1: Pre-Launch Technical Verification

- [x] **Primary Canonical Domain Consistency**
  - All canonical `<link rel="canonical">` tags resolve strictly to `https://shalonasart.ch/`.
  - Preview deployments (`*.vercel.app`) automatically inject `<meta name="robots" content="noindex, nofollow" />` unless serving the production domain.
- [x] **Dynamic Title & Meta Tag Engine**
  - Title formula: `Shalona | Contemporary Mixed Media Artist in Switzerland` (Home) and `[Title] – [Category] by Shalona` (Artworks).
  - High-conversion, character-calibrated meta descriptions across all 57 artworks, biography, timeline, exhibitions, journal, and contact pages.
- [x] **Combined Schema.org Entity Graph (JSON-LD)**
  - Unified node graph anchored at `https://shalonasart.ch/#artist` (`Person`).
  - WebSite node with SearchAction linked to `/arts`.
  - Rich collection and artwork nodes (`VisualArtwork`) referencing artist ID, materials, dimensions, and high-resolution local assets.
  - Rich `Event` node for the *Ortsmuseum Bärenkeller* solo exhibition in Zürich.
  - Interactive `FAQPage` node embedded in `/contact`.
- [x] **Robots.txt & AI Discovery Directives**
  - Clean `robots.txt` allowing Googlebot, Bingbot, Applebot, and PerplexityBot.
  - Disallows `/admin/` and destructive web scrapers (`GPTBot`, `CCBot`, `Bytespider`).
  - Sitemaps declared: `sitemap.xml` and `sitemap-images.xml`.
- [x] **Automated Sitemap Generation**
  - Node script `scripts/generate_sitemaps.cjs` executes automatically during `npm run build`.
  - Discovers all 57 canonical artworks and journal articles.
  - Generates XML image tags (`<image:loc>`, `<image:title>`, `<image:caption>`).
  - Generates `public/llms.txt` optimized for LLM answer retrieval.
- [x] **Image Accessibility & Contextual Alt Tags**
  - Contextual pattern applied: `[Artwork Title] – Original [Category] painting by Shalona`.
  - Zero layout shift (`CLS = 0`) with proportional aspect ratios and lazy loading.
- [x] **Privacy-First Analytics Engine**
  - GA4, Google Tag Manager, and Microsoft Clarity integration in `src/utils/analytics.js`.
  - Automatic suppression in local development and preview branches.
  - PII stripping on all form submission and lead generation events.

---

## Phase 2: Domain & DNS Configuration (Registrar / Cloudflare / Host)

- [ ] **Apex & WWW Canonicalization**
  - Ensure `http://shalonasart.ch` -> `301 Moved Permanently` -> `https://shalonasart.ch`.
  - Ensure `https://www.shalonasart.ch` -> `301 Moved Permanently` -> `https://shalonasart.ch`.
  - Set up DNS `A` records pointing to Vercel (`76.76.21.21`) or `CNAME` for `www`.
- [ ] **SSL / TLS Certificate**
  - Verify TLS 1.3 certificate status in Vercel Domains dashboard.
  - Ensure HSTS header is active (`max-age=63072000; includeSubDomains; preload`).

---

## Phase 3: Google Search Console (GSC) Activation

1. **Add Property**:
   - Access [Google Search Console](https://search.google.com/search-console).
   - Add Domain property: `shalonasart.ch` (or URL Prefix `https://shalonasart.ch/`).
2. **Verification**:
   - Recommended: DNS TXT record via your domain registrar.
   - Alternatively: Set `VITE_GSC_VERIFICATION` in Vercel Environment Variables.
3. **Submit XML Sitemaps**:
   - Navigate to **Sitemaps** in the left menu.
   - Enter `https://shalonasart.ch/sitemap.xml` and submit.
   - Enter `https://shalonasart.ch/sitemap-images.xml` and submit.
4. **URL Inspection & Live Test**:
   - Test `https://shalonasart.ch/`.
   - Verify Rich Results test passes for `Person`, `WebSite`, and `BreadcrumbList`.
   - Request initial indexing.

---

## Phase 4: Bing Webmaster Tools & IndexNow Activation

1. **Import from GSC**:
   - Access [Bing Webmaster Tools](https://www.bing.com/webmasters).
   - Sign in and select **Import from Google Search Console** for instant verification.
2. **Submit Sitemaps**:
   - Submit `https://shalonasart.ch/sitemap.xml`.
3. **IndexNow Setup**:
   - Bing and Perplexity utilize IndexNow for near-instant indexation of newly cataloged artworks.

---

## Phase 5: Google Business Profile (Local Art Studio SEO)

1. **Claim / Create Google Business Profile**:
   - Business Name: **Shalona’s Art – Contemporary Artist Studio**
   - Category: **Artist**, **Art Studio**, **Art Gallery**
   - Address / Service Area: **Richterswil, 8805 Zürich, Switzerland** (and Lake Zurich region: Horgen, Wädenswil, Zürich City).
   - Website: `https://shalonasart.ch`
   - Phone / Contact Email: `shalonalei@gmail.com`
2. **Visual Content**:
   - Upload high-resolution images of Shalona in the studio and select iconic artworks (*Scent of Jasmine*, *Raqsa*, *Solitude*).
3. **Exhibition Linking**:
   - Post updates regarding solo and group exhibitions (e.g. *Bärenkeller Ortsmuseum Richterswil*).

---

## Phase 6: Perplexity & AI Search Optimization (GEO)

- [x] `https://shalonasart.ch/llms.txt` active and accessible.
- [ ] Submit `shalonasart.ch` to Perplexity’s publisher/index crawler.
- [ ] Ensure public citations and art registry listings cite `Shalona` with current location (`Richterswil, Canton of Zürich, Switzerland`).

---

## Phase 7: Ongoing Monthly Cadence

| Frequency | Action Item | Tool / Platform |
| :--- | :--- | :--- |
| **Weekly** | Monitor GSC Coverage errors & 404 logs | Google Search Console |
| **Monthly** | Review top performing keywords & impressions | GSC Performance Tab |
| **Monthly** | Audit artwork inquiry conversion rate | GA4 & Studio Admin SEO Tab |
| **Quarterly** | Refresh `sitemap.xml` and add new exhibition dates | Studio Admin Portal (`/admin`) |
| **Bi-annually** | Review backlink profile & press mentions | Ahrefs / Moz / Bing Webmaster |
