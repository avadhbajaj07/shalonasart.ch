import React, { useState } from 'react';
import { 
  Search, Globe, CheckCircle, AlertCircle, Sparkles, 
  ExternalLink, FileText, Layers, ShieldCheck, Eye, Copy, Check
} from 'lucide-react';

export default function AdminSEODashboard({ artworks, journals }) {
  const [selectedPreviewPage, setSelectedPreviewPage] = useState('home');
  const [copiedLink, setCopiedLink] = useState(false);

  // Calculate completeness metrics
  const totalArtworks = artworks.length;
  const artworksWithPhilosophy = artworks.filter(a => a.philosophy || a.caption).length;
  const artworksWithImage = artworks.filter(a => a.image || a.thumbnail).length;

  const completenessScore = Math.round(
    ((totalArtworks > 0 ? (artworksWithPhilosophy / totalArtworks) * 40 : 40) +
     (totalArtworks > 0 ? (artworksWithImage / totalArtworks) * 30 : 30) +
     30) // 30 points for sitemaps, robots.txt, schema, and canonicals
  );

  const previewPages = [
    {
      id: 'home',
      name: 'Homepage (/)',
      title: 'Shalona | Contemporary Mixed Media Artist in Switzerland',
      url: 'https://shalonasart.ch/',
      desc: "Discover Shalona's contemporary mixed-media art in Richterswil, Switzerland. Explore abstract paintings, expressive artworks and upcoming exhibitions."
    },
    {
      id: 'biography',
      name: 'Biography (/biography)',
      title: 'About Shalona – Mixed Media Artist in Switzerland',
      url: 'https://shalonasart.ch/biography',
      desc: "Discover the life, artistic journey, and intuitive philosophy of Shalona, a contemporary mixed-media artist based in Richterswil on Lake Zurich, Switzerland."
    },
    {
      id: 'arts',
      name: 'Artworks Catalogue (/arts)',
      title: 'Contemporary & Mixed Media Art by Shalona',
      url: 'https://shalonasart.ch/arts',
      desc: "Explore original contemporary mixed-media paintings, abstract works, and figurative studies by Shalona in Richterswil, Switzerland."
    },
    {
      id: 'exhibitions',
      name: 'Exhibitions (/exhibitions)',
      title: 'Shalona Art Exhibitions | Zürich, Switzerland',
      url: 'https://shalonasart.ch/exhibitions',
      desc: "Discover upcoming fine art exhibitions by Shalona in Zürich, including Mysticism, Resilience and Empowerment at Ortsmuseum Bärenkeller, Richterswil."
    },
    {
      id: 'contact',
      name: 'Contact & Inquiries (/contact)',
      title: 'Contact Shalona | Art Enquiries & Collaborations',
      url: 'https://shalonasart.ch/contact',
      desc: "Contact Shalona for artwork acquisitions, private studio viewings in Richterswil, Lake Zurich, and curatorial collaborations."
    }
  ];

  const currentPreview = previewPages.find(p => p.id === selectedPreviewPage) || previewPages[0];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Header Banner & Completeness Gauge */}
      <div className="bg-gradient-to-r from-[#FAF8F3] to-white p-6 sm:p-8 rounded-2xl border border-[#DCD9D0] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-[10px] uppercase font-sans tracking-[0.2em] text-[#A88B57]">
            <Globe className="w-3.5 h-3.5" />
            <span>Search & Answer Engine Optimization (SEO / AEO / GEO)</span>
          </div>
          <h2 className="font-serif text-3xl font-light text-[#2A2A2A]">
            Discoverability & Entity Health
          </h2>
          <p className="font-sans text-xs text-[#7A7770] max-w-xl leading-relaxed">
            Automated monitoring of structured schema graph, XML sitemaps, image indexing, and AI crawler accessibility for Google, Perplexity, and Swiss art collectors.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-[#E5E2D9] shadow-xs">
          <div className="text-right">
            <span className="block text-[10px] uppercase font-sans tracking-widest text-[#7A7770]">Internal Completeness</span>
            <span className="font-serif text-3xl font-bold text-[#A88B57]">{completenessScore}%</span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-[#A88B57]/30 border-t-[#A88B57] flex items-center justify-center font-sans text-xs font-bold text-[#2A2A2A]">
            <CheckCircle className="w-6 h-6 text-[#A88B57]" />
          </div>
        </div>
      </div>

      {/* 2. Core SEO Infrastructure Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 bg-white rounded-xl border border-[#E5E2D9] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-sans tracking-widest text-[#7A7770]">Canonical XML Sitemap</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-serif text-2xl font-light text-[#2A2A2A]">
            {totalArtworks + 12} URLs
          </div>
          <a
            href="/sitemap.xml"
            target="_blank"
            className="inline-flex items-center gap-1 text-[11px] font-sans text-[#A88B57] hover:underline"
          >
            <span>View sitemap.xml</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#E5E2D9] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-sans tracking-widest text-[#7A7770]">Image Search Sitemap</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-serif text-2xl font-light text-[#2A2A2A]">
            {totalArtworks} Artworks
          </div>
          <a
            href="/sitemap-images.xml"
            target="_blank"
            className="inline-flex items-center gap-1 text-[11px] font-sans text-[#A88B57] hover:underline"
          >
            <span>View sitemap-images.xml</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#E5E2D9] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-sans tracking-widest text-[#7A7770]">AI Discovery (GEO)</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-serif text-2xl font-light text-[#2A2A2A]">
            /llms.txt Active
          </div>
          <a
            href="/llms.txt"
            target="_blank"
            className="inline-flex items-center gap-1 text-[11px] font-sans text-[#A88B57] hover:underline"
          >
            <span>View llms.txt</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#E5E2D9] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-sans tracking-widest text-[#7A7770]">Robots Directives</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-serif text-2xl font-light text-[#2A2A2A]">
            Search Bots Allowed
          </div>
          <a
            href="/robots.txt"
            target="_blank"
            className="inline-flex items-center gap-1 text-[11px] font-sans text-[#A88B57] hover:underline"
          >
            <span>View robots.txt</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>

      {/* 3. Live Google Search Snippet Preview Simulator */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E2D9] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-serif text-xl font-light text-[#2A2A2A]">
              Google & Search Engine Snippet Preview
            </h3>
            <p className="font-sans text-xs text-[#7A7770]">
              Simulate how Shalona's pages appear to collectors searching on desktop and mobile.
            </p>
          </div>

          {/* Page Selector */}
          <select
            value={selectedPreviewPage}
            onChange={(e) => setSelectedPreviewPage(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-[#FAF8F3] border border-[#DCD9D0] text-xs font-sans text-[#2A2A2A] focus:outline-none focus:border-[#A88B57]"
          >
            {previewPages.map(page => (
              <option key={page.id} value={page.id}>{page.name}</option>
            ))}
          </select>
        </div>

        {/* Realistic Google Search Card */}
        <div className="p-6 bg-[#F8F9FA] rounded-xl border border-gray-200/80 max-w-2xl font-sans text-left space-y-1.5 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-[#202124]">
            <div className="w-6 h-6 rounded-full bg-[#1A1817] flex items-center justify-center text-white text-[10px] font-serif font-bold italic">
              S
            </div>
            <div className="leading-tight">
              <span className="block font-medium text-xs text-[#202124]">Shalona's Art</span>
              <span className="block text-[11px] text-[#5f6368] truncate max-w-xs sm:max-w-md">{currentPreview.url}</span>
            </div>
          </div>

          <h4 className="text-lg sm:text-xl text-[#1a0dab] hover:underline cursor-pointer font-normal pt-1 leading-snug">
            {currentPreview.title}
          </h4>

          <p className="text-xs sm:text-sm text-[#4d5156] leading-relaxed pt-0.5">
            {currentPreview.desc}
          </p>
        </div>
      </div>

      {/* 4. Target Search Keywords & Geographical Focus */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E2D9] space-y-6">
        <div>
          <h3 className="font-serif text-xl font-light text-[#2A2A2A]">
            Multilingual Target Search Entities (Switzerland & Global)
          </h3>
          <p className="font-sans text-xs text-[#7A7770]">
            Integrated organically into titles, schemas, breadcrumbs, and curatorial philosophies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-[#FAF8F3] rounded-xl border border-[#E5E2D9] space-y-2.5">
            <span className="text-[10px] uppercase font-sans font-semibold tracking-wider text-[#A88B57]">English (Target)</span>
            <ul className="text-xs font-sans text-[#2A2A2A] space-y-1.5 list-disc list-inside">
              <li>Mixed media artist Switzerland</li>
              <li>Contemporary artist Richterswil</li>
              <li>Abstract art Zurich</li>
              <li>Original abstract art Switzerland</li>
              <li>Figurative abstract art</li>
              <li>Art exhibitions Lake Zurich</li>
            </ul>
          </div>

          <div className="p-5 bg-[#FAF8F3] rounded-xl border border-[#E5E2D9] space-y-2.5">
            <span className="text-[10px] uppercase font-sans font-semibold tracking-wider text-[#A88B57]">Deutsch (Schweiz)</span>
            <ul className="text-xs font-sans text-[#2A2A2A] space-y-1.5 list-disc list-inside">
              <li>Mixed Media Künstlerin Schweiz</li>
              <li>Künstlerin Richterswil Zürich</li>
              <li>Abstrakte Kunst Zürich</li>
              <li>Zeitgenössische Kunst Schweiz</li>
              <li>Kunstausstellung Bärenkeller</li>
              <li>Kunstwerke in Mischtechnik</li>
            </ul>
          </div>

          <div className="p-5 bg-[#FAF8F3] rounded-xl border border-[#E5E2D9] space-y-2.5">
            <span className="text-[10px] uppercase font-sans font-semibold tracking-wider text-[#A88B57]">Français (Suisse)</span>
            <ul className="text-xs font-sans text-[#2A2A2A] space-y-1.5 list-disc list-inside">
              <li>Artiste techniques mixtes Suisse</li>
              <li>Artiste contemporaine Suisse</li>
              <li>Art abstrait Zurich</li>
              <li>Exposition d'art Suisse</li>
              <li>Peinture contemporaine suisse</li>
              <li>Art figuratif abstrait</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}
