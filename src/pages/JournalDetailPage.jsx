import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLiveJournals } from '../utils/studioStore';
import { artistData } from '../data/artist';
import SEO from '../components/SEO';
import { ArrowLeft, ArrowRight, Feather, MapPin, Calendar } from 'lucide-react';

export default function JournalDetailPage() {
  const { slug } = useParams();
  const journals = getLiveJournals();

  const entry = journals.find((j) => j.slug === slug) || journals[0];
  const currentIndex = journals.findIndex((j) => j.id === entry.id);
  const prevEntry = journals[(currentIndex - 1 + journals.length) % journals.length];
  const nextEntry = journals[(currentIndex + 1) % journals.length];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": entry.title,
    "description": entry.excerpt,
    "articleBody": entry.paragraphs.join("\n\n"),
    "datePublished": entry.date,
    "author": {
      "@id": "https://shalonasart.ch/#artist"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Shalona's Art",
      "url": "https://shalonasart.ch"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://shalonasart.ch/journal/${entry.slug}`
    }
  };

  return (
    <article className="pt-28 sm:pt-36 pb-28 min-h-screen">
      <SEO
        title={`${entry.title} — Journal Entry 0${entry.entryNumber} | SHALONA`}
        description={entry.excerpt}
        path={`/journal/${entry.slug}`}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Studio Journal', path: '/journal' },
          { name: entry.title, path: `/journal/${entry.slug}` }
        ]}
        schema={articleSchema}
        type="article"
      />

      <div className="max-w-4xl mx-auto px-6 sm:px-10">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between pb-8 mb-10 border-b border-[#1A1817]/08 text-xs font-sans">
          <div className="flex items-center gap-2 text-[#1A1817]/60">
            <Link to="/" className="hover:text-[#1A1817] transition-colors">Home</Link>
            <span>/</span>
            <Link to="/journal" className="hover:text-[#1A1817] transition-colors">Journal</Link>
            <span>/</span>
            <span className="text-[#1A1817] font-medium">Entry 0{entry.entryNumber}</span>
          </div>

          <div className="flex items-center gap-4 text-[#1A1817]/60">
            <Link
              to={`/journal/${prevEntry.slug}`}
              className="flex items-center gap-1 hover:text-[#1A1817] transition-colors"
              title={`Previous: ${prevEntry.title}`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Prev</span>
            </Link>
            <span className="text-[#1A1817]/20">•</span>
            <Link
              to={`/journal/${nextEntry.slug}`}
              className="flex items-center gap-1 hover:text-[#1A1817] transition-colors"
              title={`Next: ${nextEntry.title}`}
            >
              <span className="hidden sm:inline">Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Essay Header */}
        <header className="space-y-4 pb-12 border-b border-[#1A1817]/08">
          <div className="flex items-center gap-4 text-xs font-sans text-[#A88B57] uppercase tracking-[0.2em]">
            <span>Journal Entry No. 0{entry.entryNumber}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#1A1817]/50">
              <Calendar className="w-3.5 h-3.5" />
              <span>{entry.dateFormatted}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#1A1817]/50">
              <MapPin className="w-3.5 h-3.5" />
              <span>{entry.location}</span>
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#1A1817] tracking-tight leading-tight">
            {entry.title}
          </h1>

          {entry.subtitle && (
            <p className="font-serif italic text-xl text-[#A88B57] font-light">
              {entry.subtitle}
            </p>
          )}
        </header>

        {/* Essay Body Typography */}
        <div className="py-12 space-y-6 font-serif text-lg sm:text-2xl text-[#1A1817]/85 font-light leading-relaxed">
          {entry.paragraphs.map((para, idx) => (
            <p key={idx} className="first-letter:text-4xl first-letter:font-light">
              {para}
            </p>
          ))}
        </div>

        {/* Author Signoff Card */}
        <footer className="mt-12 pt-8 border-t border-[#1A1817]/08 flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#FAF8F3] p-8 rounded-sm fine-art-shadow">
          <div className="flex items-center gap-4">
            <img
              src={artistData.media.portraits[1]}
              alt="Shalona"
              className="w-16 h-16 rounded-full object-cover object-top shadow-sm border border-[#1A1817]/10"
            />
            <div>
              <p className="font-serif text-xl font-light text-[#1A1817]">Shalona</p>
              <p className="font-sans text-xs uppercase tracking-widest text-[#1A1817]/50">
                Mixed Media Artist · Richterswil, Switzerland
              </p>
            </div>
          </div>

          <Link
            to="/arts"
            className="px-6 py-2.5 rounded-full bg-[#1A1817] text-[#FBF9F5] text-xs font-sans tracking-[0.16em] uppercase hover:bg-[#A88B57] transition-colors"
          >
            Explore Artworks
          </Link>
        </footer>

      </div>
    </article>
  );
}
