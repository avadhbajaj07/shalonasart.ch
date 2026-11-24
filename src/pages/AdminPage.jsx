import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { 
  getCategories, 
  addCategory, 
  removeCategory,
  saveArtwork, 
  updateArtwork,
  deleteArtwork,
  resetToDefaultArtworks,
  saveJournal, 
  updateJournal,
  deleteJournal,
  resetToDefaultJournals,
  getJournalCategories, 
  addJournalCategory, 
  compressImageFile,
  getLiveArtworks,
  getLiveJournals,
  exportStudioBackup
} from '../utils/studioStore';
import { 
  Lock, 
  Unlock, 
  Upload, 
  Camera, 
  Image as ImageIcon, 
  Plus, 
  Check, 
  Trash2, 
  Edit3,
  ExternalLink, 
  Download, 
  Sparkles, 
  Search, 
  Filter, 
  Eye, 
  Palette, 
  BookOpen, 
  Tag, 
  Clock, 
  X,
  Maximize2,
  RefreshCw,
  AlertTriangle,
  Globe
} from 'lucide-react';
import AdminSEODashboard from '../components/AdminSEODashboard';

// Cryptographic SHA-256 hash for studio portal security.
// Plaintext password is never exposed in client bundles or UI.
const ADMIN_PASSWORD_HASH = '7ab1ab279bd7b73915a7819c5cd3dca1f15ad37905ce69615b5f663e57213753';

async function hashPassword(plainText) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('shalona_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab: 'artwork' | 'inventory' | 'journal' | 'categories'
  const [activeTab, setActiveTab] = useState('artwork');

  // Categories State
  const [categories, setCategories] = useState(getCategories());
  const [newCatInput, setNewCatInput] = useState('');
  const [showAddCat, setShowAddCat] = useState(false);

  // Journal Categories State
  const [journalCategories, setJournalCategories] = useState(getJournalCategories());
  const [newJournalCatInput, setNewJournalCatInput] = useState('');
  const [showAddJournalCat, setShowAddJournalCat] = useState(false);

  // Artwork Creation Form State
  const [artTitle, setArtTitle] = useState('');
  const [artCategory, setArtCategory] = useState('Abstract');
  const [artDimensions, setArtDimensions] = useState('120 × 90 cm');
  const [artMedium, setArtMedium] = useState('Mixed media, acrylic emulsions & raw pigments on linen');
  const [artYear, setArtYear] = useState('2026');
  const [artPhilosophy, setArtPhilosophy] = useState('');
  const [artStatus, setArtStatus] = useState('Available');
  const [artImage, setArtImage] = useState(null);
  const [artImageMeta, setArtImageMeta] = useState(null);
  const [isCompressingArt, setIsCompressingArt] = useState(false);

  // Journal Creation Form State
  const [journalTitle, setJournalTitle] = useState('');
  const [journalSubtitle, setJournalSubtitle] = useState('Richterswil Atelier');
  const [journalCategory, setJournalCategory] = useState(journalCategories[0] || 'Studio Reflections');
  const [journalExcerpt, setJournalExcerpt] = useState('');
  const [journalContent, setJournalContent] = useState('');
  const [journalImage, setJournalImage] = useState(null);
  const [isCompressingJournal, setIsCompressingJournal] = useState(false);

  // Inventory Table Filters & Search
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState('All');
  const [inventoryStatusFilter, setInventoryStatusFilter] = useState('All');

  // Data State
  const [allArtworks, setAllArtworks] = useState([]);
  const [allJournals, setAllJournals] = useState([]);

  // Modals State
  const [previewModalImg, setPreviewModalImg] = useState(null);
  const [editingArtwork, setEditingArtwork] = useState(null);
  const [editingJournal, setEditingJournal] = useState(null);

  // Edit Artwork Form State
  const [editArtTitle, setEditArtTitle] = useState('');
  const [editArtCategory, setEditArtCategory] = useState('Abstract');
  const [editArtDimensions, setEditArtDimensions] = useState('');
  const [editArtMedium, setEditArtMedium] = useState('');
  const [editArtYear, setEditArtYear] = useState('');
  const [editArtPhilosophy, setEditArtPhilosophy] = useState('');
  const [editArtStatus, setEditArtStatus] = useState('Available');
  const [editArtImage, setEditArtImage] = useState(null);
  const [isCompressingEditArt, setIsCompressingEditArt] = useState(false);

  // Edit Journal Form State
  const [editJournalTitle, setEditJournalTitle] = useState('');
  const [editJournalSubtitle, setEditJournalSubtitle] = useState('');
  const [editJournalCategory, setEditJournalCategory] = useState('Studio Reflections');
  const [editJournalExcerpt, setEditJournalExcerpt] = useState('');
  const [editJournalContent, setEditJournalContent] = useState('');
  const [editJournalImage, setEditJournalImage] = useState(null);
  const [isCompressingEditJournal, setIsCompressingEditJournal] = useState(false);

  // Success Feedback
  const [successMessage, setSuccessMessage] = useState(null);
  const [lastPublishedLink, setLastPublishedLink] = useState(null);

  const artFileInputRef = useRef(null);
  const journalFileInputRef = useRef(null);
  const editArtFileInputRef = useRef(null);
  const editJournalFileInputRef = useRef(null);

  // Reload master data
  const reloadData = () => {
    try {
      const arts = getLiveArtworks();
      const journs = getLiveJournals();
      setAllArtworks(arts);
      setAllJournals(journs);
      setCategories(getCategories());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      reloadData();
    }
  }, [isAuthenticated]);

  // Auth Submit
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setAuthError('Please enter the studio password.');
      return;
    }
    const computedHash = await hashPassword(passwordInput.trim());
    if (computedHash === ADMIN_PASSWORD_HASH) {
      setIsAuthenticated(true);
      localStorage.setItem('shalona_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Incorrect studio password. Access denied.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('shalona_admin_auth');
    setPasswordInput('');
  };

  // Add category handler
  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (newCatInput.trim()) {
      const updated = addCategory(newCatInput.trim());
      setCategories(updated);
      setArtCategory(newCatInput.trim());
      setNewCatInput('');
      setShowAddCat(false);
    }
  };

  // Remove custom category handler
  const handleRemoveCategory = (catName) => {
    if (window.confirm(`Remove category "${catName}"?`)) {
      const updated = removeCategory(catName);
      setCategories(updated);
      if (artCategory === catName) {
        setArtCategory('Abstract');
      }
    }
  };

  // Add journal category handler
  const handleCreateJournalCategory = (e) => {
    e.preventDefault();
    if (newJournalCatInput.trim()) {
      const updated = addJournalCategory(newJournalCatInput.trim());
      setJournalCategories(updated);
      setJournalCategory(newJournalCatInput.trim());
      setNewJournalCatInput('');
      setShowAddJournalCat(false);
    }
  };

  // Handle artwork category change - dynamically adjusts status for Unfinished Works
  const handleCategoryChange = (cat) => {
    setArtCategory(cat);
    if (cat === 'Unfinished Works') {
      setArtStatus('In Progress');
      if (!artTitle) {
        setArtTitle('Untitled Study');
      }
    } else if (artStatus === 'In Progress') {
      setArtStatus('Available');
    }
  };

  // Artwork Image Selection & Compression (Create Form)
  const handleArtImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressingArt(true);
      const compressed = await compressImageFile(file, 1600, 1600, 0.85);
      setArtImage(compressed.dataUrl);
      setArtImageMeta(compressed);
    } catch (err) {
      alert('Error processing image. Please try a different photo.');
      console.error(err);
    } finally {
      setIsCompressingArt(false);
    }
  };

  // Artwork Image Selection & Compression (Edit Form)
  const handleEditArtImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressingEditArt(true);
      const compressed = await compressImageFile(file, 1600, 1600, 0.85);
      setEditArtImage(compressed.dataUrl);
    } catch (err) {
      alert('Error processing image.');
    } finally {
      setIsCompressingEditArt(false);
    }
  };

  // Journal Image Selection (Create Form)
  const handleJournalImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressingJournal(true);
      const compressed = await compressImageFile(file, 1400, 1400, 0.82);
      setJournalImage(compressed.dataUrl);
    } catch (err) {
      alert('Error processing photo. Please try again.');
    } finally {
      setIsCompressingJournal(false);
    }
  };

  // Journal Image Selection (Edit Form)
  const handleEditJournalImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressingEditJournal(true);
      const compressed = await compressImageFile(file, 1400, 1400, 0.82);
      setEditJournalImage(compressed.dataUrl);
    } catch (err) {
      alert('Error processing photo.');
    } finally {
      setIsCompressingEditJournal(false);
    }
  };

  // Submit New Artwork
  const handleSubmitArtwork = (e) => {
    e.preventDefault();
    if (!artImage) {
      alert('Please upload an image of the artwork from your phone or device.');
      return;
    }

    try {
      const isUnfinished = artCategory === 'Unfinished Works';
      const title = artTitle.trim() || (isUnfinished ? 'Untitled Study' : 'Untitled Stillness');
      const status = isUnfinished ? 'In Progress' : artStatus;

      const newArt = saveArtwork({
        title,
        category: artCategory,
        dimensions: artDimensions.trim() || (isUnfinished ? 'Easel study' : '100 × 80 cm'),
        medium: artMedium.trim() || (isUnfinished ? 'Raw pigments, emulsion on linen' : 'Mixed media on linen'),
        year: artYear.trim() || new Date().getFullYear().toString(),
        philosophy: artPhilosophy.trim(),
        caption: artPhilosophy.trim() || (isUnfinished ? 'Study in waiting, Richterswil studio.' : 'Original artwork by Shalona, Richterswil.'),
        status,
        image: artImage,
        thumbnail: artImage,
        featured: false
      });

      setSuccessMessage(`Artwork "${newArt.title}" has been published and is now LIVE on the website!`);
      setLastPublishedLink(isUnfinished ? '/unfinished-works' : `/arts/${newArt.slug}`);
      reloadData();

      // Reset form
      setArtTitle('');
      setArtPhilosophy('');
      setArtImage(null);
      setArtImageMeta(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert('Failed to publish artwork. Storage may be full.');
      console.error(err);
    }
  };

  // Open Edit Modal for an Artwork
  const handleStartEditArtwork = (art) => {
    setEditingArtwork(art);
    setEditArtTitle(art.title || '');
    setEditArtCategory(art.category || 'Abstract');
    setEditArtDimensions(art.dimensions || '');
    setEditArtMedium(art.medium || '');
    setEditArtYear(art.year || '2026');
    setEditArtPhilosophy(art.philosophy || art.caption || '');
    setEditArtStatus(art.status || 'Available');
    setEditArtImage(art.image || null);
  };

  // Save Artwork Edits (Update Existing / Old Artworks)
  const handleSaveArtworkEdit = (e) => {
    e.preventDefault();
    if (!editingArtwork) return;

    try {
      const isUnfinished = editArtCategory === 'Unfinished Works';
      const status = isUnfinished && editArtStatus === 'Available' ? 'In Progress' : editArtStatus;

      const updated = updateArtwork(editingArtwork.id, {
        title: editArtTitle.trim() || 'Untitled Stillness',
        category: editArtCategory,
        dimensions: editArtDimensions.trim(),
        medium: editArtMedium.trim(),
        year: editArtYear.trim(),
        philosophy: editArtPhilosophy.trim(),
        caption: editArtPhilosophy.trim(),
        status,
        image: editArtImage
      });

      setSuccessMessage(`Updated "${updated.title}" successfully! Changes are now live on the website.`);
      setLastPublishedLink(isUnfinished ? '/unfinished-works' : `/arts/${updated.slug}`);
      setEditingArtwork(null);
      reloadData();
    } catch (err) {
      alert('Failed to update artwork.');
      console.error(err);
    }
  };

  // Delete Artwork (Works for ALL artworks: old and new)
  const handleDeleteArtwork = (id, title) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}" from the website? This will remove it from all gallery collections and pages.`)) {
      deleteArtwork(id);
      reloadData();
      setSuccessMessage(`"${title}" has been deleted from the website.`);
    }
  };

  // Reset to Original 57 Artworks
  const handleResetArtworks = () => {
    if (window.confirm('Reset all artworks back to the original 57 pieces? Any custom modifications will be restored to defaults.')) {
      resetToDefaultArtworks();
      reloadData();
      setSuccessMessage('Artworks restored to original 57 pieces.');
    }
  };

  // Submit New Journal
  const handleSubmitJournal = (e) => {
    e.preventDefault();
    if (!journalTitle.trim()) {
      alert('Please enter a journal title.');
      return;
    }
    if (!journalContent.trim()) {
      alert('Please write the essay or thoughts for this journal.');
      return;
    }

    try {
      const newJournal = saveJournal({
        title: journalTitle.trim(),
        subtitle: journalSubtitle.trim() || 'Richterswil Atelier',
        category: journalCategory,
        excerpt: journalExcerpt.trim(),
        content: journalContent.trim(),
        image: journalImage
      });

      setSuccessMessage(`Studio Journal "${newJournal.title}" is now published and live!`);
      setLastPublishedLink(`/journal/${newJournal.slug}`);
      reloadData();

      // Reset form
      setJournalTitle('');
      setJournalExcerpt('');
      setJournalContent('');
      setJournalImage(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert('Failed to publish journal.');
    }
  };

  // Open Edit Modal for a Journal
  const handleStartEditJournal = (j) => {
    setEditingJournal(j);
    setEditJournalTitle(j.title || '');
    setEditJournalSubtitle(j.subtitle || '');
    setEditJournalCategory(j.category || 'Studio Reflections');
    setEditJournalExcerpt(j.excerpt || '');
    setEditJournalContent(Array.isArray(j.paragraphs) ? j.paragraphs.join('\n\n') : (j.content || ''));
    setEditJournalImage(j.featuredImage || j.image || null);
  };

  // Save Journal Edits (Update Existing / Old Journals)
  const handleSaveJournalEdit = (e) => {
    e.preventDefault();
    if (!editingJournal) return;

    try {
      const updated = updateJournal(editingJournal.id, {
        title: editJournalTitle.trim(),
        subtitle: editJournalSubtitle.trim(),
        category: editJournalCategory,
        excerpt: editJournalExcerpt.trim(),
        content: editJournalContent.trim(),
        image: editJournalImage
      });

      setSuccessMessage(`Updated journal "${updated.title}" successfully!`);
      setLastPublishedLink(`/journal/${updated.slug}`);
      setEditingJournal(null);
      reloadData();
    } catch (err) {
      alert('Failed to update journal.');
      console.error(err);
    }
  };

  // Delete Journal (Works for ALL journals: old and new)
  const handleDeleteJournal = (id, title) => {
    if (window.confirm(`Are you sure you want to delete journal entry "${title}"?`)) {
      deleteJournal(id);
      reloadData();
      setSuccessMessage(`Journal "${title}" has been deleted.`);
    }
  };

  // Filtered Artworks for the Inventory Table
  const filteredInventoryArtworks = useMemo(() => {
    return allArtworks.filter((art) => {
      // Category Match
      let matchCat = true;
      if (inventoryCategoryFilter !== 'All') {
        matchCat = art.category === inventoryCategoryFilter;
      }

      // Status Match
      let matchStatus = true;
      if (inventoryStatusFilter !== 'All') {
        matchStatus = art.status === inventoryStatusFilter;
      }

      // Search Match
      let matchSearch = true;
      if (inventorySearch.trim()) {
        const q = inventorySearch.toLowerCase();
        matchSearch =
          art.title?.toLowerCase().includes(q) ||
          art.category?.toLowerCase().includes(q) ||
          art.medium?.toLowerCase().includes(q) ||
          art.dimensions?.toLowerCase().includes(q) ||
          art.year?.toLowerCase().includes(q);
      }

      return matchCat && matchStatus && matchSearch;
    });
  }, [allArtworks, inventoryCategoryFilter, inventoryStatusFilter, inventorySearch]);

  // Quick stats calculation
  const stats = useMemo(() => {
    const totalArts = allArtworks.length;
    const unfinishedCount = allArtworks.filter(a => a.category === 'Unfinished Works' || a.status === 'In Progress').length;
    const availableCount = allArtworks.filter(a => a.status === 'Available').length;
    const privateCount = allArtworks.filter(a => a.status === 'Private Collection').length;
    const journalCount = allJournals.length;
    return { totalArts, unfinishedCount, availableCount, privateCount, journalCount };
  }, [allArtworks, allJournals]);

  // Preset Dimensions & Mediums
  const dimensionPresets = ['60 × 40 cm', '80 × 60 cm', '100 × 80 cm', '120 × 90 cm', '150 × 120 cm', '200 × 150 cm'];
  const mediumPresets = [
    'Mixed media, acrylic emulsions & raw pigments on linen',
    'Oil, raw earth pigments & emulsion on Belgian linen',
    'Photographic emulsion, ink & linen study',
    'Acrylic glaze, ink & marble dust on canvas'
  ];

  // =========================================================================
  // VIEW 1: AUTHENTICATION GATE
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen py-20 px-4 sm:px-6 flex items-center justify-center bg-[#F6F4EF] text-[#2A2A2A]">
        <SEO title="Studio Admin — Shalona" description="Atelier administration portal" />
        
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-[0_20px_50px_rgba(42,42,42,0.08)] border border-[#E5E2D9] space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF8F3] border border-[#DCD9D0] flex items-center justify-center p-1 shadow-sm">
              <img
                src="/images/logo-shalona-art.jpg"
                alt="Shalona's Art"
                className="w-full h-full object-cover object-top rounded-full"
              />
            </div>
            <h1 className="font-serif text-3xl font-light text-[#2A2A2A]">
              Studio Portal
            </h1>
            <p className="font-sans text-xs uppercase tracking-widest text-[#7A7770]">
              Shalona · Richterswil, Switzerland
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-sans tracking-wider text-[#7A7770] mb-1.5 font-medium">
                Studio Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter studio password"
                  autoFocus
                  className="w-full px-4 py-3.5 rounded-xl border border-[#DCD9D0] bg-[#FAF8F3] text-base focus:outline-none focus:border-[#A88B57] focus:bg-white transition-all text-[#2A2A2A]"
                />
                <Lock className="w-4 h-4 text-[#A88B57] absolute right-4 top-1/2 -translate-y-1/2" />
              </div>
              {authError && (
                <p className="text-xs text-red-600 mt-2 font-sans">{authError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-[#2A2A2A] hover:bg-[#A88B57] text-white font-sans text-sm font-medium tracking-wider uppercase transition-all shadow-md active:scale-[0.99]"
            >
              Enter Studio
            </button>
          </form>

          <div className="text-center pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#7A7770] hover:text-[#2A2A2A] transition-colors font-sans"
            >
              <span>Back to Public Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: DEDICATED ATELIER ADMIN SUITE (NO PUBLIC HEADER / FOOTER)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#F6F4EF] text-[#2A2A2A] pb-24 font-sans selection:bg-[#EBE8E0]">
      <SEO title="Atelier Studio Manager — Shalona" description="Studio management suite" />

      {/* =====================================================================
          1. DEDICATED SELF-CONTAINED ADMIN TOP NAVIGATION
          ===================================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E2D9] px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left Brand Identity */}
          <div className="flex items-center gap-3">
            <img
              src="/images/logo-shalona-art.jpg"
              alt="Shalona"
              className="w-10 h-10 rounded-full object-cover object-top border border-[#DCD9D0] shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-script text-2xl text-[#2A2A2A] leading-none">
                  Shalona
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-sans font-bold uppercase tracking-widest border border-emerald-200">
                  Live
                </span>
              </div>
              <p className="text-[10px] uppercase font-sans tracking-[0.16em] text-[#7A7770]">
                Atelier Studio Administration · Richterswil
              </p>
            </div>
          </div>

          {/* Right Utility Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={exportStudioBackup}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F3] hover:bg-[#EAE6DE] text-xs font-sans text-[#2A2A2A] border border-[#DCD9D0] transition-colors"
              title="Download Full JSON backup"
            >
              <Download className="w-3.5 h-3.5 text-[#A88B57]" />
              <span>Backup</span>
            </button>

            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#2A2A2A] hover:bg-[#A88B57] text-white text-xs font-sans font-medium uppercase tracking-wider transition-colors shadow-sm"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans text-[#7A7770] hover:text-red-600 transition-colors flex items-center gap-1"
              title="Logout"
            >
              <Unlock className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* =====================================================================
          2. MAIN ADMIN CONTAINER & KPI STATS CARDS
          ===================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        
        {/* KPI Quick Overview Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-xl border border-[#E5E2D9] shadow-sm">
            <span className="text-[10px] uppercase font-sans tracking-widest text-[#7A7770] block">
              Total Artworks
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-serif text-3xl font-light text-[#2A2A2A]">
                {stats.totalArts}
              </span>
              <span className="text-xs text-[#A88B57] font-sans">
                Editable Live
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E5E2D9] shadow-sm">
            <span className="text-[10px] uppercase font-sans tracking-widest text-[#7A7770] block">
              Active Categories
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-serif text-3xl font-light text-[#2A2A2A]">
                {categories.length}
              </span>
              <span className="text-xs text-[#7A7770] font-sans">
                Collections
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E5E2D9] shadow-sm">
            <span className="text-[10px] uppercase font-sans tracking-widest text-[#7A7770] block">
              Unfinished Studies
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-serif text-3xl font-light text-amber-700">
                {stats.unfinishedCount}
              </span>
              <span className="text-xs text-amber-600 font-sans">
                On Easel
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E5E2D9] shadow-sm">
            <span className="text-[10px] uppercase font-sans tracking-widest text-[#7A7770] block">
              Studio Essays
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-serif text-3xl font-light text-[#2A2A2A]">
                {stats.journalCount}
              </span>
              <span className="text-xs text-[#7A7770] font-sans">
                Published
              </span>
            </div>
          </div>
        </div>

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="p-4 sm:p-5 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-emerald-900 shadow-sm animate-fade-in">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <span className="font-sans text-sm font-medium">{successMessage}</span>
            </div>

            {lastPublishedLink && (
              <Link
                to={lastPublishedLink}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-sans font-medium hover:bg-emerald-800 transition-colors shadow-sm"
              >
                <span>View Live Piece</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        )}

        {/* =====================================================================
            3. LUXURY TAB NAVIGATION BAR ("NICE TABS")
            ===================================================================== */}
        <div className="bg-[#FAF8F3] p-1.5 rounded-2xl border border-[#DCD9D0] flex overflow-x-auto no-scrollbar gap-1.5 shadow-sm">
          <button
            onClick={() => { setActiveTab('artwork'); setSuccessMessage(null); }}
            className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl font-sans text-xs font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'artwork'
                ? 'bg-white text-[#2A2A2A] shadow-sm font-semibold border border-[#DCD9D0]'
                : 'text-[#7A7770] hover:text-[#2A2A2A]'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-[#A88B57]" />
            <span>Add Artwork</span>
          </button>

          <button
            onClick={() => { setActiveTab('inventory'); setSuccessMessage(null); }}
            className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl font-sans text-xs font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'bg-white text-[#2A2A2A] shadow-sm font-semibold border border-[#DCD9D0]'
                : 'text-[#7A7770] hover:text-[#2A2A2A]'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-[#A88B57]" />
            <span>Inventory Table ({allArtworks.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('journal'); setSuccessMessage(null); }}
            className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl font-sans text-xs font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'journal'
                ? 'bg-white text-[#2A2A2A] shadow-sm font-semibold border border-[#DCD9D0]'
                : 'text-[#7A7770] hover:text-[#2A2A2A]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#A88B57]" />
            <span>Studio Journal ({allJournals.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('categories'); setSuccessMessage(null); }}
            className={`py-3 px-4 rounded-xl font-sans text-xs font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'categories'
                ? 'bg-white text-[#2A2A2A] shadow-sm font-semibold border border-[#DCD9D0]'
                : 'text-[#7A7770] hover:text-[#2A2A2A]'
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-[#A88B57]" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('seo'); setSuccessMessage(null); }}
            className={`py-3 px-4 rounded-xl font-sans text-xs font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'seo'
                ? 'bg-white text-[#2A2A2A] shadow-sm font-semibold border border-[#DCD9D0]'
                : 'text-[#7A7770] hover:text-[#2A2A2A]'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-[#A88B57]" />
            <span>SEO & Discovery</span>
          </button>
        </div>

        {/* =====================================================================
            TAB 1: ADD NEW ARTWORK
            ===================================================================== */}
        {activeTab === 'artwork' && (
          <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#E5E2D9] shadow-sm space-y-8">
            <div className="border-b border-gray-100 pb-5">
              <h2 className="font-serif text-3xl font-light text-[#2A2A2A]">
                Publish New Artwork
              </h2>
              <p className="font-sans text-xs text-[#7A7770] mt-1">
                Upload new paintings, studies, and unfinished works. They will appear live across the site immediately.
              </p>
            </div>

            <form onSubmit={handleSubmitArtwork} className="space-y-6">
              
              {/* Category Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs uppercase font-sans tracking-wider text-[#7A7770] font-semibold">
                    Category *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAddCat(!showAddCat)}
                    className="text-xs font-sans text-[#A88B57] hover:underline font-medium flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Category</span>
                  </button>
                </div>

                {showAddCat ? (
                  <div className="flex items-center gap-2 p-3 bg-[#FAF8F3] rounded-xl border border-[#A88B57]/30">
                    <input
                      type="text"
                      value={newCatInput}
                      onChange={(e) => setNewCatInput(e.target.value)}
                      placeholder="New category name"
                      className="flex-1 px-3 py-2 rounded-lg border border-[#DCD9D0] text-sm focus:outline-none focus:border-[#A88B57] bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleCreateCategory}
                      className="px-4 py-2 rounded-lg bg-[#A88B57] text-white text-xs font-sans font-medium uppercase tracking-wider"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddCat(false)}
                      className="px-2 py-2 text-xs text-[#7A7770]"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleCategoryChange(cat)}
                        className={`p-3 rounded-xl border text-xs font-sans font-medium transition-all text-center ${
                          artCategory === cat
                            ? 'bg-[#2A2A2A] text-white border-[#2A2A2A] shadow-sm font-semibold'
                            : 'bg-[#FAF8F3] text-[#7A7770] hover:text-[#2A2A2A] border-[#DCD9D0]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}

                {/* Dynamic Banner when "Unfinished Works" category is selected */}
                {artCategory === 'Unfinished Works' && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-900 text-xs font-sans animate-fade-in">
                    <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="font-semibold text-amber-950">
                        Unfinished Work Mode Active
                      </p>
                      <p className="text-amber-800 leading-relaxed">
                        This work will be featured in the <strong>Unfinished, Yet Alive</strong> easel collection (/unfinished-works). Status is automatically set to <em>In Progress</em>. Size and medium details are optional.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Photo Upload Zone */}
              <div className="space-y-2">
                <label className="block text-xs uppercase font-sans tracking-wider text-[#7A7770] font-semibold">
                  Artwork Photo * (Tap to snap with iPhone or pick from Library)
                </label>

                <input
                  ref={artFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleArtImageSelect}
                  className="hidden"
                />

                {!artImage ? (
                  <button
                    type="button"
                    onClick={() => artFileInputRef.current?.click()}
                    disabled={isCompressingArt}
                    className="w-full py-12 px-6 rounded-2xl border-2 border-dashed border-[#DCD9D0] hover:border-[#A88B57] bg-[#FAF8F3] hover:bg-[#F2EFE8] flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer group"
                  >
                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-[#A88B57] group-hover:scale-105 transition-transform border border-[#DCD9D0]">
                      {isCompressingArt ? (
                        <div className="w-6 h-6 border-2 border-[#A88B57] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Camera className="w-7 h-7" />
                      )}
                    </div>
                    <div className="text-center">
                      <p className="font-sans text-sm font-semibold text-[#2A2A2A]">
                        {isCompressingArt ? 'Compressing photo for web...' : 'Tap to Upload Photo or Use iPhone Camera'}
                      </p>
                      <p className="font-sans text-xs text-[#7A7770] mt-1">
                        High-resolution JPG, PNG, HEIC (Automatically compressed)
                      </p>
                    </div>
                  </button>
                ) : (
                  <div className="rounded-2xl border border-[#DCD9D0] bg-[#FAF8F3] p-3 space-y-3">
                    <div className="relative aspect-[4/3] max-h-80 w-full rounded-xl overflow-hidden bg-black/5 flex items-center justify-center">
                      <img
                        src={artImage}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => setPreviewModalImg(artImage)}
                        className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/60 text-white hover:bg-black transition-colors"
                        title="Zoom Image"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between px-2 text-xs font-sans text-[#7A7770]">
                      <span>
                        {artImageMeta ? `${artImageMeta.width} × ${artImageMeta.height} px · ${(artImageMeta.compressedSize / 1024).toFixed(0)} KB Web-Ready` : 'Photo ready'}
                      </span>
                      <button
                        type="button"
                        onClick={() => artFileInputRef.current?.click()}
                        className="text-[#A88B57] hover:underline font-semibold"
                      >
                        Change Photo
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs uppercase font-sans tracking-wider text-[#7A7770] font-semibold mb-1.5">
                  Artwork Title * {artCategory === 'Unfinished Works' && <span className="font-normal text-[#7A7770]/60">(Optional · Defaults to "Untitled Study")</span>}
                </label>
                <input
                  type="text"
                  required={artCategory !== 'Unfinished Works'}
                  value={artTitle}
                  onChange={(e) => setArtTitle(e.target.value)}
                  placeholder={artCategory === 'Unfinished Works' ? 'e.g. Untitled Study #5' : 'e.g. Whispers of Stillness'}
                  className="w-full px-4 py-3.5 rounded-xl border border-[#DCD9D0] bg-[#FAF8F3] text-sm focus:outline-none focus:border-[#A88B57] focus:bg-white transition-all text-[#2A2A2A]"
                />
              </div>

              {/* Dimensions Presets & Input */}
              <div className="space-y-2">
                <label className="block text-xs uppercase font-sans tracking-wider text-[#7A7770] font-semibold">
                  Dimensions / Canvas Size
                </label>
                <input
                  type="text"
                  value={artDimensions}
                  onChange={(e) => setArtDimensions(e.target.value)}
                  placeholder="e.g. 120 × 90 cm"
                  className="w-full px-4 py-3 rounded-xl border border-[#DCD9D0] bg-[#FAF8F3] text-sm focus:outline-none focus:border-[#A88B57] text-[#2A2A2A]"
                />

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {dimensionPresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setArtDimensions(preset)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-sans transition-colors ${
                        artDimensions === preset
                          ? 'bg-[#2A2A2A] text-white'
                          : 'bg-[#FAF8F3] text-[#7A7770] hover:text-[#2A2A2A] border border-[#DCD9D0]'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Medium Presets & Input */}
              <div className="space-y-2">
                <label className="block text-xs uppercase font-sans tracking-wider text-[#7A7770] font-semibold">
                  Medium & Technique
                </label>
                <input
                  type="text"
                  value={artMedium}
                  onChange={(e) => setArtMedium(e.target.value)}
                  placeholder="e.g. Mixed media, acrylic emulsions & raw pigments on linen"
                  className="w-full px-4 py-3 rounded-xl border border-[#DCD9D0] bg-[#FAF8F3] text-sm focus:outline-none focus:border-[#A88B57] text-[#2A2A2A]"
                />

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {mediumPresets.map((med) => (
                    <button
                      key={med}
                      type="button"
                      onClick={() => setArtMedium(med)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-sans truncate max-w-full transition-colors ${
                        artMedium === med
                          ? 'bg-[#2A2A2A] text-white'
                          : 'bg-[#FAF8F3] text-[#7A7770] hover:text-[#2A2A2A] border border-[#DCD9D0]'
                      }`}
                    >
                      {med}
                    </button>
                  ))}
                </div>
              </div>

              {/* Year & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-sans tracking-wider text-[#7A7770] font-semibold mb-1.5">
                    Year of Creation
                  </label>
                  <input
                    type="text"
                    value={artYear}
                    onChange={(e) => setArtYear(e.target.value)}
                    placeholder="2026"
                    className="w-full px-4 py-3 rounded-xl border border-[#DCD9D0] bg-[#FAF8F3] text-sm focus:outline-none focus:border-[#A88B57] text-[#2A2A2A]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-sans tracking-wider text-[#7A7770] font-semibold mb-1.5">
                    Availability Status
                  </label>
                  <select
                    value={artStatus}
                    onChange={(e) => setArtStatus(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#DCD9D0] bg-[#FAF8F3] text-sm focus:outline-none focus:border-[#A88B57] text-[#2A2A2A]"
                  >
                    <option value="Available">Available for Acquisition</option>
                    <option value="In Progress">In Progress (Unfinished Study)</option>
                    <option value="Private Collection">Private Collection (Acquired)</option>
                  </select>
                </div>
              </div>

              {/* Philosophy & Curatorial Story */}
              <div>
                <label className="block text-xs uppercase font-sans tracking-wider text-[#7A7770] font-semibold mb-1.5">
                  Philosophy & Curatorial Story
                </label>
                <textarea
                  rows={4}
                  value={artPhilosophy}
                  onChange={(e) => setArtPhilosophy(e.target.value)}
                  placeholder="Share the intimate thoughts, stillness, and intention behind this piece..."
                  className="w-full px-4 py-3.5 rounded-xl border border-[#DCD9D0] bg-[#FAF8F3] text-sm focus:outline-none focus:border-[#A88B57] text-[#2A2A2A] leading-relaxed"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-xl bg-[#2A2A2A] hover:bg-[#A88B57] text-white font-sans text-sm font-semibold tracking-wider uppercase transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#A88B57]" />
                  <span>Publish Artwork Live to Website</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* =====================================================================
            TAB 2: ADVANCED INVENTORY DATA TABLE WITH EDIT & DELETE ON ALL WORKS
            ===================================================================== */}
        {activeTab === 'inventory' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E2D9] shadow-sm space-y-6">
            
            {/* Table Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-serif text-2xl font-light text-[#2A2A2A]">
                    Artwork Catalogue Table
                  </h2>
                  <span className="text-xs bg-[#FAF8F3] border border-[#DCD9D0] text-[#7A7770] px-2.5 py-0.5 rounded-full font-mono">
                    {filteredInventoryArtworks.length} pieces
                  </span>
                </div>
                <p className="font-sans text-xs text-[#7A7770] mt-0.5">
                  Full CRUD enabled: click <strong>Edit</strong> or <strong>Delete</strong> on ANY artwork (old original works or new works).
                </p>
              </div>

              {/* Search Bar & Reset */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <input
                    type="text"
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    placeholder="Search by title, medium, year..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#DCD9D0] bg-[#FAF8F3] text-xs font-sans focus:outline-none focus:border-[#A88B57]"
                  />
                  <Search className="w-4 h-4 text-[#7A7770] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <button
                  onClick={handleResetArtworks}
                  className="p-2 rounded-xl border border-[#DCD9D0] bg-[#FAF8F3] hover:bg-stone-200 text-[#7A7770] hover:text-[#2A2A2A] transition-colors"
                  title="Reset catalogue to original 57 pieces"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category Filter Pills Bar */}
            <div className="flex flex-wrap items-center gap-2 pb-2">
              <span className="text-xs font-sans text-[#7A7770] mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Collection:</span>
              </span>

              {['All', ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setInventoryCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-sans transition-colors ${
                    inventoryCategoryFilter === cat
                      ? 'bg-[#2A2A2A] text-white font-medium shadow-sm'
                      : 'bg-[#FAF8F3] text-[#7A7770] hover:text-[#2A2A2A] border border-[#DCD9D0]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Advanced Responsive Table */}
            <div className="overflow-x-auto rounded-xl border border-[#E5E2D9]">
              <table className="w-full text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className="bg-[#FAF8F3] border-b border-[#E5E2D9] text-[#7A7770] uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4 font-semibold">Artwork</th>
                    <th className="py-3.5 px-4 font-semibold">Category</th>
                    <th className="py-3.5 px-4 font-semibold hidden md:table-cell">Dimensions & Medium</th>
                    <th className="py-3.5 px-3 font-semibold">Year</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E2D9]">
                  {filteredInventoryArtworks.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-[#7A7770]">
                        No artworks matched your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredInventoryArtworks.map((art) => {
                      return (
                        <tr 
                          key={art.id} 
                          className="hover:bg-[#FAF8F3]/70 transition-colors group"
                        >
                          {/* Image & Title */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div 
                                onClick={() => setPreviewModalImg(art.image)}
                                className="w-12 h-12 rounded-lg overflow-hidden bg-[#FAF8F3] border border-[#DCD9D0] shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                              >
                                <img
                                  src={art.image}
                                  alt={art.title}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                              <div>
                                <p className="font-serif text-sm font-medium text-[#2A2A2A] group-hover:text-[#A88B57] transition-colors">
                                  {art.title}
                                </p>
                                <p className="text-[10px] text-[#7A7770] font-mono mt-0.5">
                                  {art.accession || `SHA-${art.year}`}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Category Badge */}
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide ${
                              art.category === 'Unfinished Works'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : art.category === 'Abstract'
                                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                : art.category === 'Figurative Abstracts'
                                ? 'bg-purple-50 text-purple-800 border border-purple-200'
                                : 'bg-stone-100 text-stone-800 border border-stone-200'
                            }`}>
                              {art.category}
                            </span>
                          </td>

                          {/* Dimensions & Medium */}
                          <td className="py-3 px-4 hidden md:table-cell text-[#7A7770]">
                            <p className="font-medium text-[#2A2A2A]">{art.dimensions}</p>
                            <p className="text-[11px] truncate max-w-xs">{art.medium}</p>
                          </td>

                          {/* Year */}
                          <td className="py-3 px-3 text-[#7A7770] font-mono">
                            {art.year}
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                              art.status === 'Available'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : art.status === 'In Progress'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              <span>{art.status}</span>
                            </span>
                          </td>

                          {/* Full Actions (View, Edit, Delete for ALL artworks) */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* View on Site */}
                              <Link
                                to={art.category === 'Unfinished Works' ? '/unfinished-works' : `/arts/${art.slug}`}
                                target="_blank"
                                className="p-1.5 rounded-lg text-[#7A7770] hover:text-[#2A2A2A] hover:bg-[#FAF8F3] transition-colors"
                                title="View live on website"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>

                              {/* Edit Artwork */}
                              <button
                                onClick={() => handleStartEditArtwork(art)}
                                className="p-1.5 rounded-lg text-[#7A7770] hover:text-[#A88B57] hover:bg-[#FAF8F3] transition-colors"
                                title="Edit artwork details"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              {/* Delete Artwork */}
                              <button
                                onClick={() => handleDeleteArtwork(art.id, art.title)}
                                className="p-1.5 rounded-lg text-[#7A7770] hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Delete artwork"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-xs font-sans text-[#7A7770] px-1">
              <span>Showing {filteredInventoryArtworks.length} of {allArtworks.length} artworks</span>
              <span>All updates publish instantly to the public site</span>
            </div>

          </div>
        )}

        {/* =====================================================================
            TAB 3: STUDIO JOURNAL WITH FULL EDIT & DELETE ON ALL ESSAYS
            ===================================================================== */}
        {activeTab === 'journal' && (
          <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#E5E2D9] shadow-sm space-y-8">
            <div className="border-b border-gray-100 pb-5">
              <h2 className="font-serif text-3xl font-light text-[#2A2A2A]">
                Studio Journal Essays
              </h2>
              <p className="font-sans text-xs text-[#7A7770] mt-1">
                Write new essays or edit existing journal pieces. All updates go live immediately.
              </p>
            </div>

            {/* Create Form */}
            <form onSubmit={handleSubmitJournal} className="space-y-6">
              
              {/* Journal Title */}
              <div>
                <label className="block text-xs uppercase font-sans tracking-wider text-[#7A7770] font-semibold mb-1.5">
                  Journal Title *
                </label>
                <input
                  type="text"
                  required
                  value={journalTitle}
                  onChange={(e) => setJournalTitle(e.target.value)}
                  placeholder="e.g. On the Unseen Movement of Autumn"
                  className="w-full px-4 py-3.5 rounded-xl border border-[#DCD9D0] bg-[#FAF8F3] text-sm focus:outline-none focus:border-[#A88B57] text-[#2A2A2A]"
                />
              </div>

              {/* Subtitle & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-sans tracking-wider text-[#7A7770] font-semibold mb-1.5">
                    Subtitle / Atmosphere
                  </label>
                  <input
                    type="text"
                    value={journalSubtitle}
                    onChange={(e) => setJournalSubtitle(e.target.value)}
                    placeholder="e.g. Dawn by Lake Zurich"
                    className="w-full px-4 py-3 rounded-xl border border-[#DCD9D0] bg-[#FAF8F3] text-sm focus:outline-none focus:border-[#A88B57] text-[#2A2A2A]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs uppercase font-sans tracking-wider text-[#7A7770] font-semibold">
                      Category
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAddJournalCat(!showAddJournalCat)}
                      className="text-xs font-sans text-[#A88B57] hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>New</span>
                    </button>
                  </div>

                  {showAddJournalCat ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={newJournalCatInput}
                        onChange={(e) => setNewJournalCatInput(e.target.value)}
                        placeholder="Category name"
                        className="flex-1 px-3 py-2 rounded-lg border text-sm"
                      />
                      <button
                        type="button"
                        onClick={handleCreateJournalCategory}
                        className="px-3 py-2 rounded-lg bg-[#A88B57] text-white text-xs font-sans uppercase"
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    <select
                      value={journalCategory}
                      onChange={(e) => setJournalCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#DCD9D0] bg-[#FAF8F3] text-sm focus:outline-none focus:border-[#A88B57] text-[#2A2A2A]"
                    >
                      {journalCategories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Featured Image */}
              <div className="space-y-2">
                <label className="block text-xs uppercase font-sans tracking-wider text-[#7A7770] font-semibold">
                  Featured Studio Image (Optional)
                </label>

                <input
                  ref={journalFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleJournalImageSelect}
                  className="hidden"
                />

                {!journalImage ? (
                  <button
                    type="button"
                    onClick={() => journalFileInputRef.current?.click()}
                    className="w-full py-6 px-4 rounded-xl border border-dashed border-[#DCD9D0] hover:border-[#A88B57] bg-[#FAF8F3] flex items-center justify-center gap-2 text-xs font-sans text-[#7A7770] hover:text-[#2A2A2A]"
                  >
                    <Camera className="w-4 h-4 text-[#A88B57]" />
                    <span>{isCompressingJournal ? 'Compressing...' : 'Add Studio Photo / Sketch to Journal'}</span>
                  </button>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-[#DCD9D0] p-2 bg-[#FAF8F3] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={journalImage} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
                      <span className="text-xs font-sans text-[#7A7770]">Photo attached</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setJournalImage(null)}
                      className="text-xs text-red-600 font-sans hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs uppercase font-sans tracking-wider text-[#7A7770] font-semibold mb-1.5">
                  Short Description / Lead In
                </label>
                <textarea
                  rows={2}
                  value={journalExcerpt}
                  onChange={(e) => setJournalExcerpt(e.target.value)}
                  placeholder="A brief 1-2 sentence preview..."
                  className="w-full px-4 py-3 rounded-xl border border-[#DCD9D0] bg-[#FAF8F3] text-sm focus:outline-none focus:border-[#A88B57] text-[#2A2A2A]"
                />
              </div>

              {/* Full Content */}
              <div>
                <label className="block text-xs uppercase font-sans tracking-wider text-[#7A7770] font-semibold mb-1.5">
                  Full Journal Essay * (Separate paragraphs with double enter)
                </label>
                <textarea
                  rows={8}
                  required
                  value={journalContent}
                  onChange={(e) => setJournalContent(e.target.value)}
                  placeholder="Write freely..."
                  className="w-full px-4 py-3.5 rounded-xl border border-[#DCD9D0] bg-[#FAF8F3] text-sm focus:outline-none focus:border-[#A88B57] text-[#2A2A2A] leading-relaxed font-sans"
                />
              </div>

              {/* Submit */}
              <div className="pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-xl bg-[#2A2A2A] hover:bg-[#A88B57] text-white font-sans text-sm font-semibold tracking-wider uppercase transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#A88B57]" />
                  <span>Publish Journal Entry Live</span>
                </button>
              </div>

            </form>

            {/* Existing Journals List with Edit & Delete */}
            <div className="pt-8 border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-light text-[#2A2A2A]">
                  Published Journal Entries ({allJournals.length})
                </h3>
                <span className="text-xs text-[#7A7770]">Click Edit to update any entry</span>
              </div>

              <div className="divide-y divide-[#E5E2D9] border border-[#E5E2D9] rounded-xl overflow-hidden">
                {allJournals.map((j) => {
                  return (
                    <div key={j.id} className="p-4 bg-white hover:bg-[#FAF8F3] transition-colors flex items-center justify-between gap-4">
                      <div>
                        <p className="font-serif text-base font-medium text-[#2A2A2A]">
                          {j.title}
                        </p>
                        <p className="text-xs text-[#7A7770] font-sans mt-0.5">
                          {j.category} · {j.dateFormatted || j.subtitle}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/journal/${j.slug}`}
                          target="_blank"
                          className="p-2 text-[#7A7770] hover:text-[#2A2A2A] transition-colors"
                          title="View on site"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleStartEditJournal(j)}
                          className="p-2 text-[#7A7770] hover:text-[#A88B57] transition-colors"
                          title="Edit journal"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteJournal(j.id, j.title)}
                          className="p-2 text-[#7A7770] hover:text-red-600 transition-colors"
                          title="Delete journal"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* =====================================================================
            TAB 4: CATEGORIES MANAGER
            ===================================================================== */}
        {activeTab === 'categories' && (
          <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#E5E2D9] shadow-sm space-y-8">
            <div className="border-b border-gray-100 pb-5">
              <h2 className="font-serif text-3xl font-light text-[#2A2A2A]">
                Categories Hub
              </h2>
              <p className="font-sans text-xs text-[#7A7770] mt-1">
                Manage your gallery collections. Artworks automatically group under these categories on the website.
              </p>
            </div>

            {/* Add New Category Box */}
            <form onSubmit={handleCreateCategory} className="p-5 bg-[#FAF8F3] rounded-2xl border border-[#DCD9D0] flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                required
                value={newCatInput}
                onChange={(e) => setNewCatInput(e.target.value)}
                placeholder="Enter new category name..."
                className="w-full sm:flex-1 px-4 py-3 rounded-xl border border-[#DCD9D0] bg-white text-sm focus:outline-none focus:border-[#A88B57]"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2A2A2A] hover:bg-[#A88B57] text-white text-xs font-sans font-semibold uppercase tracking-wider transition-colors shadow-sm whitespace-nowrap"
              >
                + Add Category
              </button>
            </form>

            {/* Grid of Categories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat) => {
                const count = allArtworks.filter(a => a.category === cat).length;
                const isCore = ['Abstract', 'Figurative Abstracts', 'Expressions', 'Unfinished Works'].includes(cat);

                return (
                  <div
                    key={cat}
                    className="p-5 rounded-2xl border border-[#E5E2D9] bg-white hover:border-[#A88B57]/40 shadow-sm transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-serif text-xl font-normal text-[#2A2A2A]">
                        {cat}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FAF8F3] text-[#7A7770] text-xs font-mono font-medium border border-[#DCD9D0]">
                        {count} works
                      </span>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs font-sans text-[#7A7770] border-t border-gray-100">
                      <Link
                        to={cat === 'Unfinished Works' ? '/unfinished-works' : '/arts'}
                        target="_blank"
                        className="text-[#A88B57] hover:underline flex items-center gap-1"
                      >
                        <span>View in Gallery</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>

                      {!isCore && (
                        <button
                          onClick={() => handleRemoveCategory(cat)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Remove custom category"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 5: SEO & SEARCH DISCOVERABILITY (AEO / GEO / SITEMAPS)
            ===================================================================== */}
        {activeTab === 'seo' && (
          <AdminSEODashboard artworks={allArtworks} journals={allJournals} />
        )}

      </div>

      {/* =====================================================================
          EDIT ARTWORK MODAL (WORKS FOR ANY OLD OR NEW ARTWORK!)
          ===================================================================== */}
      {editingArtwork && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 overflow-y-auto flex items-center justify-center animate-fade-in">
          <div className="w-full max-w-2xl bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#DCD9D0] my-8 space-y-6">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-serif text-2xl font-light text-[#2A2A2A]">
                  Edit Artwork Details
                </h3>
                <p className="text-xs text-[#7A7770] mt-0.5">
                  ID: {editingArtwork.accession || editingArtwork.id} · Editing live catalogue piece
                </p>
              </div>
              <button
                onClick={() => setEditingArtwork(null)}
                className="p-2 text-[#7A7770] hover:text-[#2A2A2A] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArtworkEdit} className="space-y-4 text-xs font-sans">
              
              {/* Photo preview & replacement */}
              <div className="flex items-center gap-4 p-3 bg-[#FAF8F3] rounded-xl border border-[#DCD9D0]">
                <img
                  src={editArtImage}
                  alt={editArtTitle}
                  className="w-20 h-20 rounded-lg object-cover bg-white border border-[#DCD9D0]"
                />
                <div className="space-y-1.5 flex-1">
                  <p className="font-semibold text-[#2A2A2A]">Current Artwork Image</p>
                  <p className="text-[11px] text-[#7A7770]">Tap below to change this image with a new photo</p>
                  
                  <input
                    ref={editArtFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleEditArtImageSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => editArtFileInputRef.current?.click()}
                    className="text-[#A88B57] font-semibold hover:underline flex items-center gap-1 text-xs"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{isCompressingEditArt ? 'Processing...' : 'Replace Photo'}</span>
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#7A7770] font-semibold mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editArtTitle}
                  onChange={(e) => setEditArtTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-[#DCD9D0] bg-white text-sm text-[#2A2A2A] focus:outline-none focus:border-[#A88B57]"
                />
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#7A7770] font-semibold mb-1">
                    Category
                  </label>
                  <select
                    value={editArtCategory}
                    onChange={(e) => setEditArtCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-[#DCD9D0] bg-white text-sm text-[#2A2A2A] focus:outline-none focus:border-[#A88B57]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#7A7770] font-semibold mb-1">
                    Availability Status
                  </label>
                  <select
                    value={editArtStatus}
                    onChange={(e) => setEditArtStatus(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-[#DCD9D0] bg-white text-sm text-[#2A2A2A] focus:outline-none focus:border-[#A88B57]"
                  >
                    <option value="Available">Available for Acquisition</option>
                    <option value="In Progress">In Progress (Unfinished Study)</option>
                    <option value="Private Collection">Private Collection (Acquired)</option>
                  </select>
                </div>
              </div>

              {/* Dimensions & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#7A7770] font-semibold mb-1">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    value={editArtDimensions}
                    onChange={(e) => setEditArtDimensions(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-[#DCD9D0] bg-white text-sm text-[#2A2A2A] focus:outline-none focus:border-[#A88B57]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#7A7770] font-semibold mb-1">
                    Year
                  </label>
                  <input
                    type="text"
                    value={editArtYear}
                    onChange={(e) => setEditArtYear(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-[#DCD9D0] bg-white text-sm text-[#2A2A2A] focus:outline-none focus:border-[#A88B57]"
                  />
                </div>
              </div>

              {/* Medium */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#7A7770] font-semibold mb-1">
                  Medium
                </label>
                <input
                  type="text"
                  value={editArtMedium}
                  onChange={(e) => setEditArtMedium(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-[#DCD9D0] bg-white text-sm text-[#2A2A2A] focus:outline-none focus:border-[#A88B57]"
                />
              </div>

              {/* Philosophy / Story */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#7A7770] font-semibold mb-1">
                  Philosophy & Curatorial Story
                </label>
                <textarea
                  rows={3}
                  value={editArtPhilosophy}
                  onChange={(e) => setEditArtPhilosophy(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-[#DCD9D0] bg-white text-sm text-[#2A2A2A] focus:outline-none focus:border-[#A88B57]"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingArtwork(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#DCD9D0] text-xs font-semibold uppercase text-[#7A7770] hover:bg-[#FAF8F3]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#2A2A2A] hover:bg-[#A88B57] text-white text-xs font-semibold uppercase tracking-wider shadow-md transition-colors"
                >
                  Save Changes Live
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          EDIT JOURNAL MODAL (WORKS FOR ANY OLD OR NEW JOURNAL!)
          ===================================================================== */}
      {editingJournal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 overflow-y-auto flex items-center justify-center animate-fade-in">
          <div className="w-full max-w-2xl bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#DCD9D0] my-8 space-y-6">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-serif text-2xl font-light text-[#2A2A2A]">
                  Edit Journal Entry
                </h3>
                <p className="text-xs text-[#7A7770] mt-0.5">
                  Update essay content, title, or atmosphere
                </p>
              </div>
              <button
                onClick={() => setEditingJournal(null)}
                className="p-2 text-[#7A7770] hover:text-[#2A2A2A] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveJournalEdit} className="space-y-4 text-xs font-sans">
              
              {/* Title */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#7A7770] font-semibold mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editJournalTitle}
                  onChange={(e) => setEditJournalTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-[#DCD9D0] bg-white text-sm text-[#2A2A2A] focus:outline-none focus:border-[#A88B57]"
                />
              </div>

              {/* Subtitle & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#7A7770] font-semibold mb-1">
                    Subtitle / Atmosphere
                  </label>
                  <input
                    type="text"
                    value={editJournalSubtitle}
                    onChange={(e) => setEditJournalSubtitle(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-[#DCD9D0] bg-white text-sm text-[#2A2A2A] focus:outline-none focus:border-[#A88B57]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#7A7770] font-semibold mb-1">
                    Category
                  </label>
                  <select
                    value={editJournalCategory}
                    onChange={(e) => setEditJournalCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-[#DCD9D0] bg-white text-sm text-[#2A2A2A] focus:outline-none focus:border-[#A88B57]"
                  >
                    {journalCategories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#7A7770] font-semibold mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={editJournalExcerpt}
                  onChange={(e) => setEditJournalExcerpt(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-[#DCD9D0] bg-white text-sm text-[#2A2A2A] focus:outline-none focus:border-[#A88B57]"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#7A7770] font-semibold mb-1">
                  Full Essay (Separate paragraphs with double enter)
                </label>
                <textarea
                  rows={6}
                  required
                  value={editJournalContent}
                  onChange={(e) => setEditJournalContent(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-[#DCD9D0] bg-white text-sm text-[#2A2A2A] focus:outline-none focus:border-[#A88B57] leading-relaxed font-sans"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingJournal(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#DCD9D0] text-xs font-semibold uppercase text-[#7A7770] hover:bg-[#FAF8F3]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#2A2A2A] hover:bg-[#A88B57] text-white text-xs font-semibold uppercase tracking-wider shadow-md transition-colors"
                >
                  Save Journal Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          IMAGE PREVIEW MODAL
          ===================================================================== */}
      {previewModalImg && (
        <div 
          onClick={() => setPreviewModalImg(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center cursor-pointer animate-fade-in"
        >
          <div className="relative max-w-3xl max-h-[90vh] bg-white p-2 rounded-2xl shadow-2xl">
            <img src={previewModalImg} alt="Preview" className="max-w-full max-h-[85vh] object-contain rounded-xl" />
          </div>
        </div>
      )}

    </div>
  );
}
