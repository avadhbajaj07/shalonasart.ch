import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  RotateCcw,
  Download,
  Upload,
  Search,
  Filter,
  FileSpreadsheet,
  FileCode,
  Check,
  Eye,
  Sparkles,
  ExternalLink,
  Info
} from 'lucide-react';
import {
  getSourceOfTruth,
  getAllArtworks,
  updateArtwork,
  markArtworkVerified,
  markArtworkNeedsReview,
  toggleArtworkLock,
  revertArtworkToOriginal,
  getAllSiteContent,
  updateSiteContent,
  markSiteContentVerified,
  toggleSiteContentLock,
  getVerificationStats,
  exportSourceOfTruthJSON,
  exportArtworksCSV
} from '../utils/sourceOfTruthStore';

export default function AdminContentVerification() {
  const [storeVersion, setStoreVersion] = useState(0);
  const [activeSection, setActiveSection] = useState('artworks'); // 'artworks' | 'site_content'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'unverified' | 'needs_review' | 'verified' | 'locked'
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const fileInputRef = useRef(null);

  // Handle WordPress XML WXR or JSON ACF Import
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        if (file.name.endsWith('.xml') || text.trim().startsWith('<?xml') || text.includes('<rss')) {
          // Parse WordPress WXR XML Export
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(text, 'text/xml');
          const items = xmlDoc.getElementsByTagName('item');
          let updatedCount = 0;

          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const postTypeElem = item.getElementsByTagName('wp:post_type')[0];
            const postType = postTypeElem ? postTypeElem.textContent : '';

            if (postType === 'arts' || postType === 'post' || !postType) {
              const postIdElem = item.getElementsByTagName('wp:post_id')[0];
              const titleElem = item.getElementsByTagName('title')[0];
              const id = postIdElem ? postIdElem.textContent.trim() : null;
              const title = titleElem ? titleElem.textContent.trim() : '';

              const postmetas = item.getElementsByTagName('wp:postmeta');
              let size = '';
              let yearCreated = '';
              let artworkDesc = '';
              let medium = '';

              for (let j = 0; j < postmetas.length; j++) {
                const keyElem = postmetas[j].getElementsByTagName('wp:meta_key')[0];
                const valElem = postmetas[j].getElementsByTagName('wp:meta_value')[0];
                const key = keyElem ? keyElem.textContent.trim() : '';
                const val = valElem ? valElem.textContent.trim() : '';

                if (key === 'size') size = val;
                if (key === 'year_created') yearCreated = val;
                if (key === 'artwork_description') artworkDesc = val;
                if (key === 'medium') medium = val;
              }

              if (id) {
                try {
                  const updates = {};
                  if (size) updates.dimensions = size;
                  if (yearCreated) updates.year = yearCreated;
                  if (artworkDesc) updates.description_en = artworkDesc;
                  if (medium) updates.medium = medium;

                  if (Object.keys(updates).length > 0) {
                    updates.verification_status = 'verified';
                    updates.verified_by = 'WordPress XML ACF Import';
                    updates.source = 'WordPress WXR Export (Postmeta)';
                    updateArtwork(id, updates, 'xml_import');
                    updatedCount++;
                  }
                } catch (err) {
                  console.warn(`Could not update artwork ID ${id}:`, err);
                }
              }
            }
          }
          showToast(`Successfully imported authentic ACF metadata for ${updatedCount} artworks!`);
        } else if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          // If Source of Truth format
          if (parsed.artworks && Array.isArray(parsed.artworks)) {
            let count = 0;
            parsed.artworks.forEach(art => {
              try {
                updateArtwork(art.id, art, 'json_backup_import');
                count++;
              } catch (err) {}
            });
            showToast(`Restored ${count} artworks from JSON backup.`);
          } else if (Array.isArray(parsed)) {
            // Check if array of posts with acf object
            let count = 0;
            parsed.forEach(p => {
              if (p.id && p.acf) {
                try {
                  const updates = {};
                  if (p.acf.size) updates.dimensions = p.acf.size;
                  if (p.acf.year_created) updates.year = p.acf.year_created;
                  if (p.acf.artwork_description) updates.description_en = p.acf.artwork_description;
                  if (p.acf.medium) updates.medium = p.acf.medium;
                  updates.verification_status = 'verified';
                  updates.verified_by = 'WordPress ACF JSON Import';
                  updateArtwork(p.id, updates, 'acf_json_import');
                  count++;
                } catch (err) {}
              }
            });
            showToast(`Imported ACF fields for ${count} artworks.`);
          }
        }
      } catch (err) {
        alert('Failed to parse file: ' + err.message);
      } finally {
        if (e.target) e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  // Re-read store whenever updated
  useEffect(() => {
    const handleUpdate = () => setStoreVersion(v => v + 1);
    window.addEventListener('shalona_source_of_truth_updated', handleUpdate);
    window.addEventListener('shalona_revision_logged', handleUpdate);
    return () => {
      window.removeEventListener('shalona_source_of_truth_updated', handleUpdate);
      window.removeEventListener('shalona_revision_logged', handleUpdate);
    };
  }, []);

  const stats = useMemo(() => getVerificationStats(), [storeVersion]);
  const allArtworks = useMemo(() => getAllArtworks(), [storeVersion]);
  const allContent = useMemo(() => getAllSiteContent(), [storeVersion]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter artworks
  const filteredArtworks = useMemo(() => {
    let list = allArtworks;
    if (statusFilter === 'locked') {
      list = list.filter(a => a.is_locked);
    } else if (statusFilter !== 'all') {
      list = list.filter(a => a.verification_status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a =>
        a.title_en?.toLowerCase().includes(q) ||
        a.slug?.toLowerCase().includes(q) ||
        a.id?.includes(q) ||
        a.category?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allArtworks, statusFilter, searchQuery]);

  // Filter site content
  const filteredContent = useMemo(() => {
    let list = allContent;
    if (statusFilter === 'locked') {
      list = list.filter(c => c.is_locked);
    } else if (statusFilter !== 'all') {
      list = list.filter(c => c.verification_status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c =>
        c.title?.toLowerCase().includes(q) ||
        c.key?.toLowerCase().includes(q) ||
        c.content_en?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allContent, statusFilter, searchQuery]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1817] text-[#FAF8F3] px-5 py-3.5 rounded-xl shadow-2xl border border-[#A88B57]/40 flex items-center gap-3 text-sm">
          <CheckCircle2 className="w-5 h-5 text-[#A88B57]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER: Source of Truth & Zero-Invention Rule */}
      <div className="bg-[#FAF8F3] border border-[#E5E2D9] rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1817] text-[#FAF8F3] text-xs font-mono uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#A88B57]" />
              <span>Content Source-of-Truth Engine</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#1A1817]">
              Content Verification & Client Review
            </h2>
            <p className="text-sm font-sans text-[#7A7770] leading-relaxed">
              Strict zero-invention protocol: every artwork title, description, and philosophy text is audited against authentic WordPress source exports (<code className="bg-[#EAE6DE] px-1.5 py-0.5 rounded text-xs text-[#2A2A2A]">data_dump/arts.json</code>). Unverified or AI-invented text cannot be published silently.
            </p>
          </div>

          {/* Quick Import & Export Actions */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              accept=".xml,.json"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#DCD9D0] text-xs font-sans font-medium uppercase tracking-wider text-[#2A2A2A] hover:border-[#A88B57] hover:text-[#A88B57] transition-all shadow-sm"
              title="Import authentic WordPress WXR export XML or ACF JSON file to restore custom fields"
            >
              <Upload className="w-4 h-4 text-[#A88B57]" />
              <span>Import WP (XML/JSON)</span>
            </button>

            <button
              onClick={() => {
                exportArtworksCSV();
                showToast('Artworks catalogue CSV backup downloaded.');
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#DCD9D0] text-xs font-sans font-medium uppercase tracking-wider text-[#2A2A2A] hover:border-[#A88B57] hover:text-[#A88B57] transition-all shadow-sm"
              title="Download CSV catalogue with all fields, verification statuses and lock state"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#A88B57]" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => {
                exportSourceOfTruthJSON();
                showToast('Full Source-of-Truth JSON backup downloaded.');
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1817] text-white text-xs font-sans font-medium uppercase tracking-wider hover:bg-[#2A2A2A] transition-all shadow-sm"
              title="Download complete JSON database backup including all revision history"
            >
              <Download className="w-4 h-4 text-[#A88B57]" />
              <span>Export JSON Backup</span>
            </button>
          </div>
        </div>

        {/* Verification Progress Bar */}
        <div className="mt-8 pt-6 border-t border-[#E5E2D9] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-sans">
            <span className="font-medium uppercase tracking-wider text-[#7A7770]">
              Overall Verification Progress
            </span>
            <span className="font-semibold text-[#1A1817]">
              {stats.totalVerified} of {stats.totalItems} Items Verified ({stats.percentVerified}%)
            </span>
          </div>

          <div className="w-full h-3 bg-[#EAE6DE] rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#A88B57] to-[#D4B982] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.max(stats.percentVerified, 4)}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white p-3 rounded-xl border border-[#E5E2D9] text-center">
              <div className="text-xl font-serif text-[#1A1817] font-normal">{stats.artworksVerified} / {stats.artworksTotal}</div>
              <div className="text-[11px] font-sans text-[#7A7770] uppercase tracking-wider mt-0.5">Artworks Verified</div>
            </div>
            <div className="bg-white p-3 rounded-xl border border-[#E5E2D9] text-center">
              <div className="text-xl font-serif text-[#C4841D] font-normal">{stats.needsReviewCount}</div>
              <div className="text-[11px] font-sans text-[#7A7770] uppercase tracking-wider mt-0.5">Needs Client Review</div>
            </div>
            <div className="bg-white p-3 rounded-xl border border-[#E5E2D9] text-center">
              <div className="text-xl font-serif text-[#7A7770] font-normal">{stats.unverifiedCount}</div>
              <div className="text-[11px] font-sans text-[#7A7770] uppercase tracking-wider mt-0.5">Unverified Baseline</div>
            </div>
            <div className="bg-white p-3 rounded-xl border border-[#E5E2D9] text-center">
              <div className="text-xl font-serif text-[#1A1817] font-normal">{stats.lockedCount}</div>
              <div className="text-[11px] font-sans text-[#7A7770] uppercase tracking-wider mt-0.5">Locked & Protected</div>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & NAVIGATION CONTROLS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Toggle between Artworks & Site Content */}
        <div className="flex bg-[#FAF8F3] p-1 rounded-xl border border-[#DCD9D0] shadow-sm">
          <button
            onClick={() => setActiveSection('artworks')}
            className={`px-4 py-2 rounded-lg text-xs font-sans font-medium uppercase tracking-wider transition-all ${
              activeSection === 'artworks'
                ? 'bg-white text-[#1A1817] shadow-sm font-semibold'
                : 'text-[#7A7770] hover:text-[#1A1817]'
            }`}
          >
            Artwork Catalogue ({allArtworks.length})
          </button>
          <button
            onClick={() => setActiveSection('site_content')}
            className={`px-4 py-2 rounded-lg text-xs font-sans font-medium uppercase tracking-wider transition-all ${
              activeSection === 'site_content'
                ? 'bg-white text-[#1A1817] shadow-sm font-semibold'
                : 'text-[#7A7770] hover:text-[#1A1817]'
            }`}
          >
            Site Philosophy & Bio ({allContent.length})
          </button>
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-[#7A7770] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, ID, slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#DCD9D0] rounded-xl text-xs font-sans focus:outline-none focus:border-[#A88B57]"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#FAF8F3] p-1 rounded-xl border border-[#DCD9D0]">
            {[
              { id: 'all', label: 'All' },
              { id: 'needs_review', label: 'Needs Review' },
              { id: 'unverified', label: 'Unverified' },
              { id: 'verified', label: 'Verified' },
              { id: 'locked', label: 'Locked' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-sans font-medium uppercase tracking-wider transition-all ${
                  statusFilter === f.id
                    ? 'bg-white text-[#1A1817] shadow-sm font-semibold'
                    : 'text-[#7A7770] hover:text-[#1A1817]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 1: ARTWORKS SIDE-BY-SIDE VERIFICATION */}
      {activeSection === 'artworks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-sans text-[#7A7770] px-1">
            <span>Showing {filteredArtworks.length} artworks matching filter</span>
            <span>Side-by-side: Source Dump vs Current Live State</span>
          </div>

          {filteredArtworks.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-[#E5E2D9] text-[#7A7770]">
              <Info className="w-8 h-8 text-[#A88B57] mx-auto mb-2 opacity-60" />
              <p className="font-serif text-lg text-[#2A2A2A]">No artworks match the current filter.</p>
              <button
                onClick={() => { setStatusFilter('all'); setSearchQuery(''); }}
                className="mt-3 text-xs uppercase tracking-wider text-[#A88B57] underline font-sans"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredArtworks.map((art) => (
              <div
                key={art.id}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm ${
                  art.is_locked
                    ? 'border-[#A88B57]/50 ring-1 ring-[#A88B57]/20'
                    : art.verification_status === 'verified'
                    ? 'border-emerald-200'
                    : art.verification_status === 'needs_review'
                    ? 'border-amber-300'
                    : 'border-[#E5E2D9]'
                }`}
              >
                {/* Header Strip */}
                <div className="px-5 py-3.5 bg-[#FAF8F3] border-b border-[#E5E2D9] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-white border border-[#DCD9D0] text-[#7A7770]">
                      #{art.id}
                    </span>
                    <h3 className="font-serif text-lg font-normal text-[#1A1817]">
                      {art.title_en}
                    </h3>
                    <span className="text-xs font-sans text-[#7A7770]">
                      ({art.category || 'Fine Art'})
                    </span>
                  </div>

                  {/* Status Badges */}
                  <div className="flex items-center gap-2">
                    {art.is_locked ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1A1817] text-[#FAF8F3] text-[11px] font-sans font-medium">
                        <Lock className="w-3 h-3 text-[#A88B57]" />
                        Locked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-[#7A7770] text-[11px] font-sans">
                        <Unlock className="w-3 h-3" />
                        Editable
                      </span>
                    )}

                    {art.verification_status === 'verified' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-sans font-medium">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified by {art.verified_by || 'Client'}
                      </span>
                    )}

                    {art.verification_status === 'needs_review' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-sans font-medium">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        Needs Review
                      </span>
                    )}

                    {art.verification_status === 'unverified' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-[#7A7770] text-[11px] font-sans">
                        Unverified
                      </span>
                    )}
                  </div>
                </div>

                {/* Side-by-side content comparison */}
                <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Thumbnail */}
                  <div className="md:col-span-2 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#FAF8F3] border border-[#E5E2D9] relative flex items-center justify-center">
                      {art.image_url ? (
                        <img
                          src={art.image_url}
                          alt={art.title_en}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-xs text-[#7A7770] font-sans">No Image</span>
                      )}
                    </div>
                    <span className="mt-2 text-[10px] font-mono text-[#7A7770] text-center truncate max-w-[100px]">
                      {art.slug}
                    </span>
                  </div>

                  {/* Left Column: Original WordPress Source (Baseline) */}
                  <div className="md:col-span-5 bg-[#FAF8F3] p-4 rounded-xl border border-[#E5E2D9] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#7A7770]">
                        Original Source (WordPress Export)
                      </span>
                      <span className="text-[10px] font-mono text-[#A88B57]">
                        {art.source}
                      </span>
                    </div>

                    <div className="text-xs font-sans space-y-1.5 text-[#2A2A2A]">
                      <div><strong>Title:</strong> {art.title_en}</div>
                      <div><strong>Year:</strong> {art.year || '2026'}</div>
                      <div><strong>Category:</strong> {art.category}</div>
                      <div>
                        <strong>Original Content:</strong>{' '}
                        {art.original_content_was_empty ? (
                          <span className="italic text-[#7A7770]">
                            (None in original dump — left empty on old site)
                          </span>
                        ) : (
                          art.description_en || 'None'
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Live Website State & Action Controls */}
                  <div className="md:col-span-5 space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#7A7770]">
                          Current Live Text / Description
                        </span>
                        {art.has_invented_text && (
                          <span className="text-[10px] font-sans font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                            AI-Invented Philosophy Flagged
                          </span>
                        )}
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-[#DCD9D0] text-xs font-sans text-[#1A1817]">
                        {art.description_en ? (
                          <p className="italic leading-relaxed">"{art.description_en}"</p>
                        ) : (
                          <p className="italic text-[#7A7770]">
                            No description published. Clean authentic state.
                          </p>
                        )}

                        <div className="mt-2.5 pt-2 border-t border-gray-100 flex flex-wrap items-center gap-3 text-[11px] text-[#7A7770]">
                          <span><strong>Medium:</strong> {art.medium || 'Mixed media on Belgian linen'}</span>
                          {art.dimensions && <span><strong>Dimensions:</strong> {art.dimensions}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {art.verification_status !== 'verified' ? (
                        <button
                          onClick={() => {
                            markArtworkVerified(art.id, 'Shalona (Client Admin)');
                            showToast(`"${art.title_en}" marked as VERIFIED.`);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-sans font-medium transition-all shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Mark as Verified</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            markArtworkNeedsReview(art.id, 'Pending client confirmation');
                            showToast(`"${art.title_en}" set to Needs Review.`);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-sans font-medium transition-all"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Flag for Review</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          toggleArtworkLock(art.id);
                          showToast(`"${art.title_en}" ${art.is_locked ? 'UNLOCKED' : 'LOCKED & PROTECTED'}.`);
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-all border ${
                          art.is_locked
                            ? 'bg-[#1A1817] text-[#FAF8F3] border-[#1A1817] hover:bg-[#2A2A2A]'
                            : 'bg-white text-[#2A2A2A] border-[#DCD9D0] hover:border-[#1A1817]'
                        }`}
                      >
                        {art.is_locked ? <Lock className="w-3.5 h-3.5 text-[#A88B57]" /> : <Unlock className="w-3.5 h-3.5" />}
                        <span>{art.is_locked ? 'Locked' : 'Lock Content'}</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Revert "${art.title_en}" strictly to original dump baseline? This removes any unverified text.`)) {
                            revertArtworkToOriginal(art.id);
                            showToast(`"${art.title_en}" reverted strictly to original export.`);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-sans text-[#7A7770] hover:text-red-700 hover:bg-red-50 transition-all ml-auto"
                        title="Revert to baseline export (clear any invented text)"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Revert</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* SECTION 2: SITE PHILOSOPHY & BIOGRAPHY VERIFICATION */}
      {activeSection === 'site_content' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-sans text-[#7A7770] px-1">
            <span>Showing {filteredContent.length} core site content statements</span>
            <span>Extracted directly from WordPress Pages (Page 24 & Page 26)</span>
          </div>

          {filteredContent.map((block) => (
            <div
              key={block.key}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm ${
                block.is_locked
                  ? 'border-[#A88B57]/50 ring-1 ring-[#A88B57]/20'
                  : block.verification_status === 'verified'
                  ? 'border-emerald-200'
                  : 'border-[#E5E2D9]'
              }`}
            >
              {/* Header */}
              <div className="px-5 py-3.5 bg-[#FAF8F3] border-b border-[#E5E2D9] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-white border border-[#DCD9D0] text-[#7A7770]">
                    {block.key}
                  </span>
                  <h3 className="font-serif text-lg font-normal text-[#1A1817]">
                    {block.title || block.key}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {block.is_locked && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1A1817] text-[#FAF8F3] text-[11px] font-sans font-medium">
                      <Lock className="w-3 h-3 text-[#A88B57]" />
                      Locked
                    </span>
                  )}
                  {block.verification_status === 'verified' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-sans font-medium">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 sm:p-6 space-y-4">
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-[#7A7770] uppercase tracking-wider flex items-center justify-between">
                    <span>Source: {block.source}</span>
                    <span>Verified By: {block.verified_by || 'WordPress Export'}</span>
                  </div>
                  <div className="p-4 bg-[#FAF8F3] rounded-xl border border-[#E5E2D9] font-serif text-sm sm:text-base text-[#1A1817] leading-relaxed">
                    {block.content_en}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {block.verification_status !== 'verified' ? (
                    <button
                      onClick={() => {
                        markSiteContentVerified(block.key, 'Shalona (Client Admin)');
                        showToast(`"${block.title}" verified.`);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-sans font-medium transition-all shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark as Verified</span>
                    </button>
                  ) : (
                    <span className="text-xs font-sans text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Verified & Active on Website
                    </span>
                  )}

                  <button
                    onClick={() => {
                      toggleSiteContentLock(block.key);
                      showToast(`"${block.title}" ${block.is_locked ? 'UNLOCKED' : 'LOCKED'}.`);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-all border ${
                      block.is_locked
                        ? 'bg-[#1A1817] text-[#FAF8F3] border-[#1A1817]'
                        : 'bg-white text-[#2A2A2A] border-[#DCD9D0]'
                    }`}
                  >
                    {block.is_locked ? <Lock className="w-3.5 h-3.5 text-[#A88B57]" /> : <Unlock className="w-3.5 h-3.5" />}
                    <span>{block.is_locked ? 'Locked' : 'Lock Statement'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
