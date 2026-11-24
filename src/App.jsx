import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import SmokeCanvas from './components/SmokeCanvas';
import CanvasTexture from './components/CanvasTexture';
import MotionOverlayMenu from './components/MotionOverlayMenu';
import Footer from './components/Footer';
import Lightbox from './components/Lightbox';
import RoomSimulatorModal from './components/RoomSimulatorModal';
import ContactModal from './components/ContactModal';
import IntroPreloader from './components/IntroPreloader';

// Pages
import Home from './pages/Home';
import ArtsPage from './pages/ArtsPage';
import ArtworkDetailPage from './pages/ArtworkDetailPage';
import BiographyPage from './pages/BiographyPage';
import JournalPage from './pages/JournalPage';
import JournalDetailPage from './pages/JournalDetailPage';
import UnfinishedPage from './pages/UnfinishedPage';
import ExhibitionsPage from './pages/ExhibitionsPage';
import TimelinePage from './pages/TimelinePage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';

import { getLiveArtworks } from './utils/studioStore';
import { trackPageView } from './utils/analytics';

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </LanguageProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  // Track page views on route changes and reset scroll
  useEffect(() => {
    trackPageView(location.pathname);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const [artworkList, setArtworkList] = useState(() => getLiveArtworks());

  // Listen for live studio updates from Admin Portal
  useEffect(() => {
    const handleArtworksUpdate = () => {
      setArtworkList(getLiveArtworks());
    };
    window.addEventListener('shalona_artworks_updated', handleArtworksUpdate);
    return () => window.removeEventListener('shalona_artworks_updated', handleArtworksUpdate);
  }, []);

  const [introFinished, setIntroFinished] = useState(() => {
    try {
      return typeof window !== 'undefined' && sessionStorage.getItem('shalona_intro_seen') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [activeArtwork, setActiveArtwork] = useState(null); // Lightbox
  const [roomArtwork, setRoomArtwork] = useState(null); // View in Room
  const [inquireArtwork, setInquireArtwork] = useState(null); // Contact Modal
  const [isInquireOpen, setIsInquireOpen] = useState(false);

  // Smoke burst trigger when clicking candle or elements
  const [smokePuff, setSmokePuff] = useState(null);

  const handleTriggerSmoke = (x, y) => {
    setSmokePuff({
      active: true,
      x: x || window.innerWidth / 2,
      y: y || window.innerHeight / 2,
    });
  };

  const handleOpenInquire = (artwork = null) => {
    setInquireArtwork(artwork);
    setIsInquireOpen(true);
  };

  return (
    <div className="relative min-h-screen text-[#2A2A2A] selection:bg-[#EBE8E0] selection:text-[#2A2A2A] overflow-x-hidden bg-[#F6F4EF]">
      {/* 0. Preloader & Intro Animation (Public pages only) */}
      {!isAdmin && !introFinished && (
        <IntroPreloader onComplete={() => setIntroFinished(true)} />
      )}

      {/* 1. Procedural Fine Art Canvas Linen Texture Base */}
      <CanvasTexture />

      {/* 2. Interactive Real-Time Candle Smoke & Vapor (Public pages only) */}
      {!isAdmin && (
        <SmokeCanvas
          triggerPuff={smokePuff}
          onPuffComplete={() => setSmokePuff(null)}
        />
      )}

      {/* 3. Framer-Style Floating Pill Header & Motion Menu (Public pages only - Hidden on Admin) */}
      {!isAdmin && (
        <MotionOverlayMenu
          onOpenInquire={() => handleOpenInquire(null)}
        />
      )}

      {/* 4. Multi-Page Routes */}
      <main className="relative z-10">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                artworks={artworkList}
                onTriggerSmoke={handleTriggerSmoke}
                onSelectArtwork={(art) => setActiveArtwork(art)}
                onOpenRoom={(art) => setRoomArtwork(art)}
                onOpenInquire={(art) => handleOpenInquire(art)}
              />
            }
          />

          <Route
            path="/arts"
            element={
              <ArtsPage
                artworks={artworkList}
                onSelectArtwork={(art) => setActiveArtwork(art)}
                onOpenRoom={(art) => setRoomArtwork(art)}
              />
            }
          />

          <Route
            path="/arts/:slug"
            element={
              <ArtworkDetailPage
                artworks={artworkList}
                onOpenRoom={(art) => setRoomArtwork(art)}
                onOpenInquire={(art) => handleOpenInquire(art)}
              />
            }
          />

          <Route
            path="/biography"
            element={
              <BiographyPage
                onOpenInquire={(art) => handleOpenInquire(art)}
              />
            }
          />

          <Route
            path="/journal"
            element={<JournalPage />}
          />

          <Route
            path="/journal/:slug"
            element={<JournalDetailPage />}
          />

          <Route
            path="/exhibitions"
            element={<ExhibitionsPage />}
          />

          <Route
            path="/unfinished-works"
            element={
              <UnfinishedPage
                artworks={artworkList}
                onSelectArtwork={(art) => setActiveArtwork(art)}
              />
            }
          />

          <Route
            path="/timeline"
            element={<TimelinePage />}
          />

          <Route
            path="/contact"
            element={<ContactPage />}
          />

          {/* 5. Mobile-First Atelier Administration Portal (Self-Contained) */}
          <Route
            path="/admin"
            element={<AdminPage />}
          />
        </Routes>
      </main>

      {/* 5. Minimalist Swiss Atelier Footer (Public pages only - Hidden on Admin) */}
      {!isAdmin && (
        <Footer
          onOpenInquire={() => handleOpenInquire(null)}
        />
      )}

      {/* Modals & Overlays */}
      {/* A. Museum High-Res Lightbox */}
      {activeArtwork && (
        <Lightbox
          artwork={activeArtwork}
          allArtworks={artworkList}
          onClose={(nextArt) => setActiveArtwork(nextArt)}
          onOpenInquire={(art) => handleOpenInquire(art)}
          onOpenRoom={(art) => setRoomArtwork(art)}
        />
      )}

      {/* B. View in Room Simulator */}
      {roomArtwork && (
        <RoomSimulatorModal
          artwork={roomArtwork}
          onClose={() => setRoomArtwork(null)}
          onOpenInquire={(art) => handleOpenInquire(art)}
        />
      )}

      {/* C. Private Acquisition Inquiry & Contact Modal */}
      <ContactModal
        isOpen={isInquireOpen}
        onClose={() => {
          setIsInquireOpen(false);
          setInquireArtwork(null);
        }}
        selectedArtwork={inquireArtwork}
        allArtworks={artworkList}
      />
    </div>
  );
}
