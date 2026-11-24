import React, { useState } from 'react';
import { X, CheckCircle, Mail, MapPin, Send } from 'lucide-react';
import { InstagramIcon, FacebookIcon } from './Icons';
import { artistData } from '../data/artist';

export default function ContactModal({ isOpen, onClose, selectedArtwork, allArtworks }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    artworkTitle: selectedArtwork ? selectedArtwork.title : 'General Portfolio Inquiry',
    inquiryType: selectedArtwork ? 'Artwork Acquisition' : 'Studio Visit & Viewing',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate luxury studio dispatch
    setSubmitted(true);
    setTimeout(() => {
      // Keep submitted message for review
    }, 400);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FBF9F5] rounded-2xl overflow-hidden shadow-2xl border border-[#1A1817]/10 my-8">
        
        {/* Header */}
        <div className="px-8 py-6 flex items-center justify-between border-b border-[#1A1817]/08 bg-[#FAF8F3]">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#A88B57]">
              Private Inquiries · Richterswil, Switzerland
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#1A1817]">
              Acquisition & Studio Visit
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full border border-[#1A1817]/10 hover:bg-[#1A1817] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form or Confirmation */}
        <div className="p-8 sm:p-10">
          {submitted ? (
            <div className="py-12 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-[#A88B57]/15 text-[#A88B57] flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-3xl font-light text-[#1A1817]">
                Thank you for your inquiry
              </h4>
              <p className="font-sans text-sm text-[#1A1817]/70 max-w-md mx-auto leading-relaxed font-light">
                Your message regarding <span className="font-serif italic font-normal text-[#1A1817]">“{formData.artworkTitle}”</span> has been conveyed to Shalona's studio. We will contact you directly within 24 hours.
              </p>
              <div className="pt-4">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-full bg-[#1A1817] text-[#FBF9F5] text-xs font-sans tracking-widest uppercase hover:bg-[#A88B57] transition-colors"
                >
                  Return to Portfolio
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {selectedArtwork && (
                <div className="flex items-center gap-4 p-3 bg-[#F6F3EE] rounded-lg shadow-sm">
                  <img
                    src={selectedArtwork.thumbnail}
                    alt={selectedArtwork.title}
                    className="w-12 h-14 object-cover rounded shadow-sm"
                  />
                  <div>
                    <span className="text-[10px] uppercase font-sans tracking-widest text-[#A88B57]">
                      Artwork Inquired
                    </span>
                    <h5 className="font-serif text-lg font-light text-[#1A1817]">
                      {selectedArtwork.title}
                    </h5>
                    <p className="text-[11px] font-sans text-[#1A1817]/50">
                      {selectedArtwork.dimensions} · {selectedArtwork.year}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-sans uppercase tracking-widest text-[#1A1817]/60">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Collector or Curator Name"
                    className="w-full px-4 py-2.5 rounded-lg bg-white/70 border border-[#1A1817]/12 text-sm focus:outline-none focus:border-[#A88B57] text-[#1A1817]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-sans uppercase tracking-widest text-[#1A1817]/60">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@gallery.com"
                    className="w-full px-4 py-2.5 rounded-lg bg-white/70 border border-[#1A1817]/12 text-sm focus:outline-none focus:border-[#A88B57] text-[#1A1817]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-sans uppercase tracking-widest text-[#1A1817]/60">
                    Country / City
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Zurich, London, New York"
                    className="w-full px-4 py-2.5 rounded-lg bg-white/70 border border-[#1A1817]/12 text-sm focus:outline-none focus:border-[#A88B57] text-[#1A1817]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-sans uppercase tracking-widest text-[#1A1817]/60">
                    Inquiry Intent
                  </label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/70 border border-[#1A1817]/12 text-sm focus:outline-none focus:border-[#A88B57] text-[#1A1817]"
                  >
                    <option value="Artwork Acquisition">Artwork Acquisition</option>
                    <option value="Private Studio Viewing">Private Studio Viewing (Richterswil)</option>
                    <option value="Curatorial & Exhibition">Curatorial & Exhibition Invitation</option>
                    <option value="Commission Request">Commission Request</option>
                    <option value="General Question">General Inquiry</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-sans uppercase tracking-widest text-[#1A1817]/60">
                  Message / Thought
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share your inquiry, questions on dimensions, delivery, or viewing schedule..."
                  className="w-full px-4 py-2.5 rounded-lg bg-white/70 border border-[#1A1817]/12 text-sm focus:outline-none focus:border-[#A88B57] text-[#1A1817] resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[11px] font-sans text-[#1A1817]/50">
                  Direct reply from Shalona's studio.
                </p>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#1A1817] text-[#FBF9F5] text-xs font-sans tracking-[0.16em] uppercase flex items-center justify-center gap-2 hover:bg-[#A88B57] transition-all shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Studio Inquiry</span>
                </button>
              </div>
            </form>
          )}

          {/* Studio Location & Social Links Footer */}
          <div className="mt-8 pt-6 border-t border-[#1A1817]/08 flex flex-col sm:flex-row items-center justify-between text-xs font-sans text-[#1A1817]/60 gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#A88B57]" />
              <span>Richterswil, Lake Zurich, Switzerland</span>
            </div>

            <div className="flex items-center gap-4">
              <a
                href={artistData.contact.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-[#A88B57] transition-colors"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>Instagram</span>
              </a>
              <a
                href={artistData.contact.social.facebook}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-[#A88B57] transition-colors"
              >
                <FacebookIcon className="w-3.5 h-3.5" />
                <span>Facebook</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
