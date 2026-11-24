import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    nav: {
      home: 'Home',
      works: 'Works',
      about: 'About & Philosophy',
      exhibitions: 'Exhibitions',
      unfinished: 'Unfinished Works',
      journal: 'Studio Journal',
      timeline: 'Artistic Timeline',
      contact: 'Contact & Inquire',
      admin: 'Studio Admin',
    },
    hero: {
      tag: 'Intuitive Mixed Media Art · Richterswil, Switzerland',
      quote: '“Stillness is never empty—it is full of unseen movement.”',
      author: '— Shalona',
      exploreBtn: 'Explore The Story',
      allWorksBtn: 'All Artworks',
    },
    artist: {
      name: 'Shalona',
      title: 'Mixed Media Artist in Switzerland',
      lead: 'a place where memory, emotion, and unseen energy start to move through colour, texture, and form.',
      quoteAccent: 'where the visible meets the unseen',
      bio1: 'I am an intuitive mixed-media artist creating from the quiet space between the visible and the unseen. Now based in Richterswil, Switzerland, my work blends personal photography, unconventional materials, layered textures, and expressive color to explore resilience, transformation, fragility, and hidden strength within the human experience.',
      bio2: 'Each painting grows through feeling rather than plan, guided by stillness, memory, and the subtle language of color and energy. Rather than offering fixed meanings, my art invites reflection—opening a space where imagination and personal truth can meet, and where every viewer discovers a story of their own.',
      readBio: 'Read Full Biography',
    },
    gallery: {
      catalogue: 'Exhibition Catalogue',
      badge: 'Original Pieces · True Scale Masonry',
      titleAccent: 'Curated Portfolio',
      title: 'Selected Works',
      quote: '“Each painting grows through feeling rather than plan, guided by stillness, memory, and the subtle language of color and energy.”',
      searchPlaceholder: 'Search title, medium...',
      all: 'All Works',
      figurative: 'Figurative Abstracts',
      expressions: 'Expressions',
      poetic: 'Poetic Nature',
      abstract: 'Abstract',
      unfinished: 'Unfinished Works',
      private: 'Private Collection',
      wallView: 'Wall View',
      lineView: 'Line View',
    },
    exhibitions: {
      tag: 'Exhibition & Atelier Showings',
      venueLoc: 'Richterswil, Lake Zurich',
      upcoming: 'Upcoming Exhibition',
      freeAdmission: 'Free Admission · Open Walk-In',
      directions: 'Get Directions (GPS)',
      inquiry: 'Private Atelier Inquiry',
    },
    contact: {
      title: 'Acquisition & Studio Visit',
      subtitle: 'Richterswil, Switzerland',
    }
  },
  de: {
    nav: {
      home: 'Startseite',
      works: 'Werke',
      about: 'Über & Philosophie',
      exhibitions: 'Ausstellungen',
      unfinished: 'Unvollendete Werke',
      journal: 'Atelier Journal',
      timeline: 'Künstlerische Chronik',
      contact: 'Kontakt & Anfrage',
      admin: 'Atelier Admin',
    },
    hero: {
      tag: 'Intuitive Mixed-Media-Kunst · Richterswil, Schweiz',
      quote: '„Stille ist niemals leer – sie ist erfüllt von ungesehener Bewegung.“',
      author: '— Shalona',
      exploreBtn: 'Die Geschichte entdecken',
      allWorksBtn: 'Alle Kunstwerke',
    },
    artist: {
      name: 'Shalona',
      title: 'Mixed-Media-Künstlerin in der Schweiz',
      lead: 'ein Ort, an dem Erinnerung, Emotion und ungesehene Energie sich durch Farbe, Textur und Form entfalten.',
      quoteAccent: 'wo das Sichtbare dem Ungesehenen begegnet',
      bio1: 'Ich bin eine intuitive Mixed-Media-Künstlerin, die aus dem stillen Raum zwischen dem Sichtbaren und dem Gefühlten schöpft. In Richterswil am Zürichsee verbinde ich Fotografie, unkonventionelle Materialien, geschichtete Texturen und expressive Farben.',
      bio2: 'Jedes Gemälde wächst aus dem Gefühl statt aus einem starren Plan, geleitet von Stille, Erinnerung und der Sprache von Farbe und Energie. Meine Kunst lädt zur Reflexion ein – ein Raum für persönliche Wahrheit.',
      readBio: 'Ganze Biografie lesen',
    },
    gallery: {
      catalogue: 'Ausstellungskatalog',
      badge: 'Originale Werke · Natürliche Proportionen',
      titleAccent: 'Kuratierte Sammlung',
      title: 'Ausgewählte Werke',
      quote: '„Jedes Gemälde wächst aus dem Gefühl, geleitet von Stille, Erinnerung und der feinen Sprache von Farbe und Energie.“',
      searchPlaceholder: 'Titel oder Technik suchen...',
      all: 'Alle Werke',
      figurative: 'Figurative Abstraktionen',
      expressions: 'Ausdrucke',
      poetic: 'Poetische Natur',
      abstract: 'Abstrakt',
      unfinished: 'Unvollendet',
      private: 'Privatsammlung',
      wallView: 'Wandansicht',
      lineView: 'Zeilenansicht',
    },
    exhibitions: {
      tag: 'Ausstellungen & Atelierbesuche',
      venueLoc: 'Richterswil, Zürichsee',
      upcoming: 'Kommende Ausstellung',
      freeAdmission: 'Freier Eintritt · Offene Ausstellung',
      directions: 'Route berechnen (GPS)',
      inquiry: 'Private Atelier-Anfrage',
    },
    contact: {
      title: 'Erwerb & Atelierbesuch',
      subtitle: 'Richterswil, Schweiz',
    }
  },
  fr: {
    nav: {
      home: 'Accueil',
      works: 'Œuvres',
      about: 'À Propos & Philosophie',
      exhibitions: 'Expositions',
      unfinished: 'Œuvres Inachevées',
      journal: 'Journal d’Atelier',
      timeline: 'Parcours Artistique',
      contact: 'Contact & Acquisition',
      admin: 'Admin Atelier',
    },
    hero: {
      tag: 'Art Mixte Intuitif · Richterswil, Suisse',
      quote: '« Le silence n’est jamais vide — il est empli d’un mouvement invisible. »',
      author: '— Shalona',
      exploreBtn: 'Explorer l’Histoire',
      allWorksBtn: 'Toutes les Œuvres',
    },
    artist: {
      name: 'Shalona',
      title: 'Artiste en Techniques Mixtes en Suisse',
      lead: 'un lieu où mémoire, émotion et énergie invisible commencent à se mouvoir à travers la couleur, la matière et la forme.',
      quoteAccent: 'où le visible rencontre l’invisible',
      bio1: 'Je suis une artiste intuitive créant depuis l’espace paisible entre ce qui est visible et ce qui est ressenti. Établie à Richterswil au bord du lac de Zurich, mon travail mêle photographie personnelle, matériaux non conventionnels et pigments bruts.',
      bio2: 'Chaque toile naît du ressenti plutôt que d’un plan rigide, guidée par la quiétude et la mémoire. Mon art invite à la contemplation et à la découverte de soi.',
      readBio: 'Lire la Biographie Complète',
    },
    gallery: {
      catalogue: 'Catalogue d’Exposition',
      badge: 'Pièces Originales · Proportions Naturelles',
      titleAccent: 'Portfolio Curaté',
      title: 'Œuvres Choisies',
      quote: '« Chaque peinture grandit par le sentiment plutôt que par un plan, guidée par le silence et l’énergie de la couleur. »',
      searchPlaceholder: 'Rechercher un titre, une technique...',
      all: 'Toutes les Œuvres',
      figurative: 'Abstractions Figuratives',
      expressions: 'Expressions',
      poetic: 'Nature Poétique',
      abstract: 'Abstrait',
      unfinished: 'Inachevées',
      private: 'Collection Privée',
      wallView: 'Vue Murale',
      lineView: 'Vue en Lignes',
    },
    exhibitions: {
      tag: 'Expositions & Visites Privées',
      venueLoc: 'Richterswil, Lac de Zurich',
      upcoming: 'Exposition Prochaine',
      freeAdmission: 'Entrée Libre · Visite Ouverte',
      directions: 'Itinéraire (GPS)',
      inquiry: 'Demande pour l’Atelier',
    },
    contact: {
      title: 'Acquisition & Visite d’Atelier',
      subtitle: 'Richterswil, Suisse',
    }
  },
  it: {
    nav: {
      home: 'Home',
      works: 'Opere',
      about: 'Biografia & Filosofia',
      exhibitions: 'Mostre',
      unfinished: 'Opere Non Finite',
      journal: 'Diario d’Atelier',
      timeline: 'Percorso Artistico',
      contact: 'Contatto & Acquisto',
      admin: 'Admin Atelier',
    },
    hero: {
      tag: 'Arte Mista Intuitiva · Richterswil, Svizzera',
      quote: '“La quiete non è mai vuota: è colma di movimento invisibile.”',
      author: '— Shalona',
      exploreBtn: 'Scopri la Storia',
      allWorksBtn: 'Tutte le Opere',
    },
    artist: {
      name: 'Shalona',
      title: 'Artista di Tecnica Mista in Svizzera',
      lead: 'un luogo dove memoria, emozione ed energia invisibile prendono forma attraverso colore, materia e silenzio.',
      quoteAccent: 'dove il visibile incontra l’invisibile',
      bio1: 'Sono un’artista intuitiva che crea dallo spazio quieto tra il visibile e il sentito. Con base a Richterswil sul lago di Zurigo, la mia opera unisce fotografia, materiali non convenzionali e strati cromatici.',
      bio2: 'Ogni dipinto nasce dall’intuizione, guidato dal silenzio e dal linguaggio profondo del colore. Un invito alla riflessione e alla scoperta personale.',
      readBio: 'Leggi la Biografia Completa',
    },
    gallery: {
      catalogue: 'Catalogo della Mostra',
      badge: 'Opere Originali · Proporzioni Naturali',
      titleAccent: 'Collezione Curata',
      title: 'Opere Selezionate',
      quote: '“Ogni dipinto cresce attraverso il sentire piuttosto che con un piano rigido.”',
      searchPlaceholder: 'Cerca titolo o tecnica...',
      all: 'Tutte le Opere',
      figurative: 'Astrazioni Figurative',
      expressions: 'Espressioni',
      poetic: 'Natura Poetica',
      abstract: 'Astratto',
      unfinished: 'Incompiute',
      private: 'Collezione Privata',
      wallView: 'Vista Parete',
      lineView: 'Vista a Linee',
    },
    exhibitions: {
      tag: 'Mostre & Atelier',
      venueLoc: 'Richterswil, Lago di Zurigo',
      upcoming: 'Prossima Mostra',
      freeAdmission: 'Ingresso Gratuito · Mostra Aperta',
      directions: 'Ottieni Indicazioni (GPS)',
      inquiry: 'Richiesta per l’Atelier',
    },
    contact: {
      title: 'Acquisto & Visita in Atelier',
      subtitle: 'Richterswil, Svizzera',
    }
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('shalona_lang') || 'en';
    } catch (e) {
      return 'en';
    }
  });

  const changeLanguage = (newLang) => {
    if (translations[newLang]) {
      setLang(newLang);
      try {
        localStorage.setItem('shalona_lang', newLang);
      } catch (e) {}
    }
  };

  const t = translations[lang] || translations.en;

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t, availableLangs: ['en', 'de', 'fr', 'it'] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
