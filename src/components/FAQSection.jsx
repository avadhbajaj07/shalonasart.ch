import React, { useState } from 'react';
import { ChevronDown, Sparkles, HelpCircle } from 'lucide-react';

export const FAQ_DATA = [
  {
    q: "Who is Shalona and where is her art studio located?",
    a: "Shalona is a contemporary intuitive mixed-media artist based in Richterswil on Lake Zurich, Canton of Zürich, Switzerland. Her work is celebrated for its ethereal depth, tactile textures, and evocative dialogues between memory, emotion, and stillness."
  },
  {
    q: "What techniques, materials, and mediums does Shalona use?",
    a: "Shalona works in complex mixed media on Belgian linen. Her process integrates personal photographic transfer layers, sculpted gesso, raw mineral earth pigments, acrylic emulsions, fine graphite, and Lake Zurich water washes, creating dimensional physical surfaces."
  },
  {
    q: "What is the core artistic philosophy behind her paintings?",
    a: "Her guiding conviction is that “Stillness is never empty—it is full of unseen movement.” Rather than executing rigid advance sketches, each piece unfolds intuitively through stillness, emotional resonance, and the spontaneous language of color and texture."
  },
  {
    q: "Where can visitors experience Shalona's original artworks in person?",
    a: "Her original paintings are presented at regional Swiss museum exhibitions, including the upcoming exhibition “Mysticism, Resilience and Empowerment” at Ortsmuseum Bärenkeller in Richterswil (3.–6. Dezember 2026, free admission). Private studio visits at the Richterswil atelier are also available by appointment."
  },
  {
    q: "How can art collectors inquire about acquiring an original artwork?",
    a: "Collectors may inquire through the private acquisition form on any artwork page or via info@shalonasart.ch. Every original painting is archived and accompanied by a signed Certificate of Authenticity cataloged in the studio archive."
  },
  {
    q: "Does Shalona accept bespoke art commissions or gallery collaborations?",
    a: "Yes. Shalona welcomes dialogues for site-specific commissions in residential and architectural interiors, as well as institutional curatorial partnerships that share an affinity for contemplative, transformative fine art."
  }
];

export const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": FAQ_DATA.map(item => ({
    "@type": "Question",
    "name": item.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.a
    }
  }))
};

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-20 border-t border-[#1A1817]/08" id="faq">
      <div className="max-w-4xl mx-auto px-6 sm:px-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center justify-center gap-2 text-[10px] sm:text-xs font-sans uppercase tracking-[0.25em] text-[#A88B57]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Collector & Atelier Inquiries</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1A1817]">
            Frequently Answered Questions
          </h2>
          <p className="font-serif italic text-base sm:text-lg text-[#1A1817]/70 font-light max-w-xl mx-auto leading-relaxed">
            Essential information regarding Shalona's artistic practice, studio viewings in Richterswil, and private acquisitions.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-4">
          {FAQ_DATA.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#FAF8F3] border border-[#1A1817]/08 rounded-lg overflow-hidden transition-all duration-300 hover:border-[#A88B57]/40"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full py-5 px-6 sm:px-8 flex items-center justify-between text-left gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-lg sm:text-xl text-[#1A1817] font-light">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#A88B57] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 sm:px-8 pb-6 pt-1 text-xs sm:text-sm font-sans text-[#1A1817]/75 font-light leading-relaxed border-t border-[#1A1817]/05">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
