import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSwitcher({ isLight = false, compact = false }) {
  const { lang, changeLanguage, availableLangs } = useLanguage();

  const labels = {
    en: 'EN',
    de: 'DE',
    fr: 'FR',
    it: 'IT',
  };

  return (
    <div 
      className={`inline-flex items-center gap-0.5 rounded-full p-0.5 border transition-all ${
        isLight
          ? 'bg-black/20 border-white/20 text-white'
          : 'bg-[#2A2A2A]/06 border-[#DCD9D0] text-[#2A2A2A]'
      }`}
    >
      {availableLangs.map((code) => {
        const isActive = lang === code;
        return (
          <button
            key={code}
            onClick={() => changeLanguage(code)}
            className={`px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-wider transition-all duration-300 ${
              isActive
                ? isLight
                  ? 'bg-white text-[#2A2A2A] shadow-sm font-semibold'
                  : 'bg-[#2A2A2A] text-[#F6F4EF] shadow-sm font-semibold'
                : isLight
                ? 'text-white/60 hover:text-white'
                : 'text-[#7A7770] hover:text-[#2A2A2A]'
            }`}
            aria-label={`Switch language to ${code.toUpperCase()}`}
          >
            {labels[code]}
          </button>
        );
      })}
    </div>
  );
}
