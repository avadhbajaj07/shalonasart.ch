import React, { useState } from 'react';
import SEO from '../components/SEO';
import { artistData } from '../data/artist';
import { InstagramIcon, FacebookIcon } from '../components/Icons';
import { Mail, MapPin, Phone, Send, CheckCircle, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import { sendInquiry } from '../utils/sendInquiry';
import FAQSection, { FAQ_SCHEMA } from '../components/FAQSection';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    inquiryType: 'Private Studio Viewing',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await sendInquiry({
      ...formData,
      artworkTitle: formData.inquiryType,
    });
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact & Private Inquiries — Shalona's Art",
    "description": "Contact Shalona for artwork acquisitions, private studio viewings in Richterswil, Switzerland, or curatorial collaborations.",
    "url": "https://shalonasart.ch/contact"
  };

  return (
    <div className="pt-28 sm:pt-36 pb-24 min-h-screen">
      <SEO
        title="Contact Shalona | Art Enquiries & Collaborations"
        description="Contact Shalona for artwork acquisitions, private studio viewings in Richterswil, Lake Zurich, and curatorial collaborations."
        path="/contact"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Contact & Inquiries', path: '/contact' }
        ]}
        schema={[contactSchema, FAQ_SCHEMA]}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Header */}
        <div className="space-y-4 mb-16 max-w-3xl pb-8 border-b border-[#1A1817]/08">
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-sans uppercase tracking-[0.25em] text-[#A88B57]">
            <span>Private Inquiries</span>
            <span className="w-8 h-[1px] bg-[#A88B57]/40" />
            <span>Richterswil Atelier</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl font-light text-[#1A1817] tracking-tight">
            Connect with the Atelier
          </h1>

          <p className="font-serif italic text-xl text-[#1A1817]/70 font-light max-w-2xl leading-relaxed">
            “For inquiries, collaborations, acquisitions, or simply to share a thought across the stillness.”
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left: Atelier Coordinates & Details */}
          <div className="lg:col-span-5 space-y-8 text-[#1A1817]">
            <div className="p-8 bg-[#FAF8F3] border border-[#1A1817]/09 fine-art-shadow space-y-6 rounded-sm">
              <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#1A1817]">
                Studio & Private Viewings
              </h2>

              <div className="space-y-4 text-xs font-sans text-[#1A1817]/75">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#A88B57] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#1A1817]">Richterswil, Canton of Zürich</p>
                    <p className="text-[#1A1817]/50 mt-0.5">Lake Zurich · Switzerland</p>
                    <p className="font-mono text-[10px] text-[#A88B57] mt-0.5">47.2084° N, 8.7042° E</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <Mail className="w-4 h-4 text-[#A88B57] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#1A1817]">Direct Studio Email</p>
                    <a href="mailto:contact@shalonasart.ch" className="text-[#1A1817]/70 hover:text-[#A88B57] transition-colors">
                      contact@shalonasart.ch
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#1A1817]/06 space-y-3">
                <p className="text-[10px] uppercase font-sans tracking-widest text-[#A88B57]">Social Archives</p>
                <div className="flex items-center gap-6 text-xs font-sans">
                  <a
                    href={artistData.contact.social.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 hover:text-[#A88B57] transition-colors"
                  >
                    <InstagramIcon className="w-4 h-4" />
                    <span>Instagram</span>
                  </a>
                  <a
                    href={artistData.contact.social.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 hover:text-[#A88B57] transition-colors"
                  >
                    <FacebookIcon className="w-4 h-4" />
                    <span>Facebook</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Guarantees */}
            <div className="p-6 bg-[#F6F3EE] rounded border border-[#1A1817]/08 space-y-3 text-xs font-sans text-[#1A1817]/70">
              <div className="flex items-center gap-2 font-medium text-[#1A1817]">
                <ShieldCheck className="w-4 h-4 text-[#A88B57]" />
                <span>Certificate of Authenticity</span>
              </div>
              <p className="font-light leading-relaxed">
                All original works arrive with a signed Certificate of Authenticity cataloged in the artist's studio archive.
              </p>
            </div>
          </div>

          {/* Right: The Form */}
          <div className="lg:col-span-7 bg-[#FAF8F3] p-8 sm:p-12 border border-[#1A1817]/09 fine-art-shadow rounded-sm">
            <h2 className="font-serif text-3xl font-light text-[#1A1817] mb-2">
              Send an Inquiry
            </h2>
            <p className="font-sans text-xs text-[#1A1817]/60 mb-8 font-light">
              Inquiries are read personally by Shalona. We endeavor to respond within 24 hours.
            </p>

            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle className="w-12 h-12 text-[#A88B57] mx-auto" />
                <h3 className="font-serif text-2xl font-light text-[#1A1817]">
                  Thank you for reaching out
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#1A1817]/70 max-w-md mx-auto leading-relaxed">
                  Your message has been received by the Richterswil studio. We will reply to your email shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-[#1A1817]/60">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Collector or Curator Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded bg-white/70 border border-[#1A1817]/12 text-sm focus:outline-none focus:border-[#A88B57] text-[#1A1817]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-[#1A1817]/60">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@gallery.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded bg-white/70 border border-[#1A1817]/12 text-sm focus:outline-none focus:border-[#A88B57] text-[#1A1817]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-[#1A1817]/60">City / Country</label>
                    <input
                      type="text"
                      placeholder="Zurich, Paris, New York"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-2.5 rounded bg-white/70 border border-[#1A1817]/12 text-sm focus:outline-none focus:border-[#A88B57] text-[#1A1817]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-[#1A1817]/60">Inquiry Purpose</label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full px-4 py-2.5 rounded bg-white/70 border border-[#1A1817]/12 text-sm focus:outline-none focus:border-[#A88B57] text-[#1A1817]"
                    >
                      <option value="Private Studio Viewing">Private Studio Viewing (Richterswil)</option>
                      <option value="Artwork Acquisition">Artwork Acquisition</option>
                      <option value="Commission">Commission Dialogue</option>
                      <option value="Curatorial & Press">Curatorial & Press</option>
                      <option value="General Thought">General Thought</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-[#1A1817]/60">Your Message *</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Share your interest, questions on availability, or viewing schedule..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded bg-white/70 border border-[#1A1817]/12 text-sm focus:outline-none focus:border-[#A88B57] text-[#1A1817] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#1A1817] text-[#FBF9F5] text-xs font-sans tracking-[0.16em] uppercase flex items-center justify-center gap-2 hover:bg-[#A88B57] disabled:opacity-50 transition-all shadow-md cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending to Shalona...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Studio Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>

      {/* Collector & Atelier Questions & Answers (AEO / GEO Engine) */}
      <FAQSection />
    </div>
  );
}
