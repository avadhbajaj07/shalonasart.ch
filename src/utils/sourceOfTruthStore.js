/**
 * src/utils/sourceOfTruthStore.js
 * Central Source-of-Truth Store for Shalona's Art
 * Enforces zero-invention, content verification audit logging, locked content protection,
 * CSV/JSON export, and info@shalonasart.ch email communication tracking.
 */

import initialSourceOfTruth from '../data/source_of_truth.json';

const SOT_KEY = 'shalona_source_of_truth_v2';
const REVISIONS_KEY = 'shalona_content_revisions_v2';
const EMAILS_KEY = 'shalona_studio_emails_v3';

// ---------------------------------------------------------------------------
// INITIALIZATION & STATE RECOVERY
// ---------------------------------------------------------------------------

function getInitialStore() {
  return {
    version: initialSourceOfTruth.version || '2.0.0',
    last_audited_at: initialSourceOfTruth.last_audited_at,
    source: initialSourceOfTruth.source,
    strict_mode: true,
    artworks: initialSourceOfTruth.artworks || [],
    site_content: initialSourceOfTruth.site_content || []
  };
}

export function getSourceOfTruth() {
  if (typeof window === 'undefined') return getInitialStore();
  try {
    const raw = localStorage.getItem(SOT_KEY);
    if (!raw) {
      const initial = getInitialStore();
      localStorage.setItem(SOT_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load Source of Truth store:', e);
    return getInitialStore();
  }
}

function saveSourceOfTruth(data) {
  if (typeof window === 'undefined') return;
  try {
    data.last_audited_at = new Date().toISOString();
    localStorage.setItem(SOT_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('shalona_source_of_truth_updated', { detail: data }));
  } catch (e) {
    console.error('Failed to save Source of Truth store:', e);
  }
}

// ---------------------------------------------------------------------------
// AUDIT REVISION LOGGING
// ---------------------------------------------------------------------------

export function getContentRevisions() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(REVISIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function logRevision(tableName, recordId, oldValue, newValue, changedBy = 'admin') {
  if (typeof window === 'undefined') return;
  try {
    const revisions = getContentRevisions();
    const entry = {
      id: 'rev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      table_name: tableName,
      record_id: String(recordId),
      old_value: oldValue,
      new_value: newValue,
      changed_by: changedBy,
      changed_at: new Date().toISOString()
    };
    revisions.unshift(entry); // newest first
    // Cap revisions to last 200 entries to maintain high performance
    if (revisions.length > 200) revisions.pop();
    localStorage.setItem(REVISIONS_KEY, JSON.stringify(revisions));
    window.dispatchEvent(new CustomEvent('shalona_revision_logged', { detail: entry }));
    return entry;
  } catch (e) {
    console.error('Failed to log content revision:', e);
  }
}

// ---------------------------------------------------------------------------
// ARTWORKS OPERATIONS
// ---------------------------------------------------------------------------

export function getAllArtworks(filter = {}) {
  const store = getSourceOfTruth();
  let list = store.artworks || [];

  if (filter.verification_status && filter.verification_status !== 'all') {
    list = list.filter(a => a.verification_status === filter.verification_status);
  }
  if (filter.category && filter.category !== 'all') {
    list = list.filter(a => a.category === filter.category);
  }
  if (filter.status && filter.status !== 'all') {
    list = list.filter(a => a.status === filter.status);
  }
  if (filter.locked !== undefined) {
    list = list.filter(a => a.is_locked === filter.locked);
  }
  if (filter.search) {
    const q = filter.search.toLowerCase();
    list = list.filter(a => 
      a.title_en?.toLowerCase().includes(q) || 
      a.slug?.toLowerCase().includes(q) ||
      a.id?.includes(q)
    );
  }
  return list;
}

export function getArtworkById(id) {
  const store = getSourceOfTruth();
  return (store.artworks || []).find(a => String(a.id) === String(id)) || null;
}

export function updateArtwork(id, updates, changedBy = 'admin') {
  const store = getSourceOfTruth();
  const idx = store.artworks.findIndex(a => String(a.id) === String(id));
  if (idx === -1) throw new Error(`Artwork ID ${id} not found.`);

  const oldItem = { ...store.artworks[idx] };

  // Protection Rule: If locked, disallow modifying content unless unlocking explicitly
  if (oldItem.is_locked && updates.is_locked !== false && updates.is_locked !== true) {
    const contentKeys = ['title_en', 'description_en', 'medium', 'dimensions', 'year'];
    const hasContentChanges = contentKeys.some(k => updates[k] !== undefined && updates[k] !== oldItem[k]);
    if (hasContentChanges) {
      throw new Error(`Artwork "${oldItem.title_en}" is locked. Unlock it first before modifying content.`);
    }
  }

  const updatedItem = {
    ...oldItem,
    ...updates,
    updated_at: new Date().toISOString()
  };

  store.artworks[idx] = updatedItem;
  saveSourceOfTruth(store);
  logRevision('artworks', id, oldItem, updatedItem, changedBy);
  return updatedItem;
}

export function markArtworkVerified(id, verifiedBy = 'Client (Shalona)') {
  return updateArtwork(id, {
    verification_status: 'verified',
    verified_by: verifiedBy,
    verified_at: new Date().toISOString()
  }, verifiedBy);
}

export function markArtworkNeedsReview(id, reason = 'Client review required') {
  return updateArtwork(id, {
    verification_status: 'needs_review',
    notes: reason
  });
}

export function toggleArtworkLock(id) {
  const item = getArtworkById(id);
  if (!item) return;
  return updateArtwork(id, {
    is_locked: !item.is_locked
  });
}

export function revertArtworkToOriginal(id) {
  const initial = (initialSourceOfTruth.artworks || []).find(a => String(a.id) === String(id));
  if (!initial) throw new Error(`Original artwork ${id} not found in baseline export.`);
  return updateArtwork(id, {
    title_en: initial.title_en,
    category: initial.category,
    status: initial.status,
    description_en: initial.description_en,
    image_url: initial.image_url,
    verification_status: 'unverified',
    verified_by: null,
    verified_at: null,
    is_locked: false
  }, 'revert_to_original');
}

// ---------------------------------------------------------------------------
// SITE CONTENT (PHILOSOPHY, BIOGRAPHY, STATEMENTS)
// ---------------------------------------------------------------------------

export function getAllSiteContent() {
  const store = getSourceOfTruth();
  return store.site_content || [];
}

export function getSiteContentByKey(key) {
  const store = getSourceOfTruth();
  return (store.site_content || []).find(c => c.key === key) || null;
}

export function updateSiteContent(key, updates, changedBy = 'admin') {
  const store = getSourceOfTruth();
  const idx = store.site_content.findIndex(c => c.key === key);
  if (idx === -1) throw new Error(`Site content with key "${key}" not found.`);

  const oldItem = { ...store.site_content[idx] };

  if (oldItem.is_locked && updates.is_locked !== false && updates.is_locked !== true) {
    if (updates.content_en !== undefined && updates.content_en !== oldItem.content_en) {
      throw new Error(`Content block "${oldItem.title || key}" is locked. Unlock it first.`);
    }
  }

  const updatedItem = {
    ...oldItem,
    ...updates,
    updated_at: new Date().toISOString()
  };

  store.site_content[idx] = updatedItem;
  saveSourceOfTruth(store);
  logRevision('site_content', key, oldItem, updatedItem, changedBy);
  return updatedItem;
}

export function markSiteContentVerified(key, verifiedBy = 'Client (Shalona)') {
  return updateSiteContent(key, {
    verification_status: 'verified',
    verified_by: verifiedBy,
    verified_at: new Date().toISOString()
  }, verifiedBy);
}

export function toggleSiteContentLock(key) {
  const item = getSiteContentByKey(key);
  if (!item) return;
  return updateSiteContent(key, {
    is_locked: !item.is_locked
  });
}

// ---------------------------------------------------------------------------
// VERIFICATION STATS
// ---------------------------------------------------------------------------

export function getVerificationStats() {
  const store = getSourceOfTruth();
  const artworks = store.artworks || [];
  const content = store.site_content || [];
  const total = artworks.length + content.length;

  const verifiedArtworks = artworks.filter(a => a.verification_status === 'verified').length;
  const verifiedContent = content.filter(c => c.verification_status === 'verified').length;
  const totalVerified = verifiedArtworks + verifiedContent;

  const needsReviewCount = artworks.filter(a => a.verification_status === 'needs_review').length +
                           content.filter(c => c.verification_status === 'needs_review').length;

  const unverifiedCount = artworks.filter(a => a.verification_status === 'unverified').length +
                          content.filter(c => c.verification_status === 'unverified').length;

  const lockedCount = artworks.filter(a => a.is_locked).length + content.filter(c => c.is_locked).length;

  return {
    totalItems: total,
    totalVerified,
    percentVerified: total > 0 ? Math.round((totalVerified / total) * 100) : 0,
    artworksTotal: artworks.length,
    artworksVerified: verifiedArtworks,
    contentTotal: content.length,
    contentVerified: verifiedContent,
    needsReviewCount,
    unverifiedCount,
    lockedCount
  };
}

// ---------------------------------------------------------------------------
// ONE-CLICK EXPORT (JSON & CSV BACKUPS)
// ---------------------------------------------------------------------------

export function exportSourceOfTruthJSON() {
  const store = getSourceOfTruth();
  const revisions = getContentRevisions();
  const fullBackup = {
    ...store,
    content_revisions: revisions,
    exported_at: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `shalonasart-source-of-truth-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportArtworksCSV() {
  const store = getSourceOfTruth();
  const artworks = store.artworks || [];

  const headers = [
    'ID',
    'Slug',
    'Title (EN)',
    'Category',
    'Status',
    'Availability',
    'Verification Status',
    'Verified By',
    'Verified At',
    'Source',
    'Is Locked',
    'Description (EN)',
    'Medium',
    'Dimensions',
    'Year',
    'Image URL'
  ];

  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '""';
    const s = String(val).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = artworks.map(a => [
    escapeCSV(a.id),
    escapeCSV(a.slug),
    escapeCSV(a.title_en),
    escapeCSV(a.category),
    escapeCSV(a.status),
    escapeCSV(a.availability),
    escapeCSV(a.verification_status),
    escapeCSV(a.verified_by),
    escapeCSV(a.verified_at),
    escapeCSV(a.source),
    escapeCSV(a.is_locked ? 'YES' : 'NO'),
    escapeCSV(a.description_en),
    escapeCSV(a.medium),
    escapeCSV(a.dimensions),
    escapeCSV(a.year),
    escapeCSV(a.image_url)
  ].join(','));

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `shalonasart-artworks-catalogue-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// STUDIO EMAIL SYSTEM (info@shalonasart.ch INBOX & OUTBOX)
// ---------------------------------------------------------------------------

function getInitialEmails() {
  return [
    {
      id: 'em-seed-3',
      direction: 'incoming',
      sender: 'Elena Rossi <elena.rossi@artcollector.ch>',
      senderName: 'Elena Rossi',
      senderEmail: 'elena.rossi@artcollector.ch',
      recipient: 'info@shalonasart.ch',
      subject: 'Acquisition Inquiry: "Breaking Waves"',
      body: 'Dear Shalona,\n\nI was captivated by your mixed-media painting "Breaking Waves" and would like to inquire about its availability, pricing, and a private studio viewing in Richterswil.\n\nCould you please send acquisition details and your studio viewing schedule?\n\nWarm regards,\nElena Rossi\nZürich, Switzerland\n+41 78 619 44 20',
      artworkTitle: 'Breaking Waves',
      phone: '+41 78 619 44 20',
      location: 'Zürich, Switzerland',
      status: 'unread',
      created_at: '2026-11-26T09:45:00.000Z'
    },
    {
      id: 'em-seed-1',
      direction: 'incoming',
      sender: 'Marcella Meier <m.meier@kunstzuerich.ch>',
      senderName: 'Marcella Meier',
      senderEmail: 'm.meier@kunstzuerich.ch',
      recipient: 'info@shalonasart.ch',
      subject: 'Inquiry regarding "Solitude" painting & studio visit',
      body: 'Dear Shalona,\n\nI was deeply moved by your figurative abstract artwork "Solitude" and would love to arrange a quiet studio visit in Richterswil to view it in person before your December exhibition.\n\nPlease let me know your availability.\n\nWarm regards,\nMarcella Meier\nZürich, Switzerland\n+41 79 402 11 88',
      artworkTitle: 'Solitude',
      phone: '+41 79 402 11 88',
      location: 'Zürich, Switzerland',
      status: 'unread',
      created_at: '2026-11-25T19:30:00.000Z'
    },
    {
      id: 'em-seed-2',
      direction: 'incoming',
      sender: 'Dr. Beat Wipf <beat.wipf@richterswil-art.ch>',
      senderName: 'Dr. Beat Wipf',
      senderEmail: 'beat.wipf@richterswil-art.ch',
      recipient: 'info@shalonasart.ch',
      subject: 'Ortsmuseum Bärenkeller Exhibition catalogue confirmation',
      body: 'Grüezi Shalona,\n\nConfirming our room setup and lighting arrangements for "Mysticism, Resilience and Empowerment" from 3.–6. Dezember 2026. The wall hanging panels in the Bärenkeller are ready for your linen pieces.\n\nBest regards,\nBeat Wipf\nOrtsmuseum Bärenkeller Richterswil',
      artworkTitle: 'Exhibition Setup',
      phone: '+41 44 787 12 00',
      location: 'Richterswil, Switzerland',
      status: 'replied',
      created_at: '2026-11-25T14:15:00.000Z'
    }
  ];
}

export function getStudioEmails(filter = {}) {
  if (typeof window === 'undefined') return getInitialEmails();
  try {
    const raw = localStorage.getItem(EMAILS_KEY);
    let list = raw ? JSON.parse(raw) : getInitialEmails();
    if (!raw) {
      localStorage.setItem(EMAILS_KEY, JSON.stringify(list));
    }

    if (filter.direction && filter.direction !== 'all') {
      list = list.filter(e => e.direction === filter.direction);
    }
    if (filter.status && filter.status !== 'all') {
      list = list.filter(e => e.status === filter.status);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(e => 
        e.sender?.toLowerCase().includes(q) ||
        e.recipient?.toLowerCase().includes(q) ||
        e.subject?.toLowerCase().includes(q) ||
        e.body?.toLowerCase().includes(q) ||
        e.artworkTitle?.toLowerCase().includes(q)
      );
    }
    return list;
  } catch (e) {
    console.error('Failed to load studio emails:', e);
    return getInitialEmails();
  }
}

export function recordIncomingInquiry(inquiryData) {
  if (typeof window === 'undefined') return;
  try {
    const emails = getStudioEmails();
    const entry = {
      id: 'inq_' + Date.now(),
      direction: 'incoming',
      sender: `${inquiryData.name} <${inquiryData.email}>`,
      senderName: inquiryData.name,
      senderEmail: inquiryData.email,
      recipient: 'info@shalonasart.ch',
      subject: `Acquisition Inquiry: ${inquiryData.artworkTitle || inquiryData.inquiryType || 'General'}`,
      body: inquiryData.message || 'Collector submitted acquisition inquiry via shalonasart.ch',
      artworkTitle: inquiryData.artworkTitle || 'General Inquiry',
      phone: inquiryData.phone || '',
      location: inquiryData.location || '',
      status: 'unread',
      created_at: new Date().toISOString()
    };
    emails.unshift(entry);
    localStorage.setItem(EMAILS_KEY, JSON.stringify(emails));
    window.dispatchEvent(new CustomEvent('shalona_new_inquiry_received', { detail: entry }));
    return entry;
  } catch (e) {
    console.error('Failed to record incoming inquiry:', e);
  }
}

export function updateStudioEmailStatus(id, newStatus) {
  if (typeof window === 'undefined') return;
  try {
    const emails = getStudioEmails();
    const target = emails.find(e => e.id === id);
    if (target) {
      target.status = newStatus;
      localStorage.setItem(EMAILS_KEY, JSON.stringify(emails));
      window.dispatchEvent(new CustomEvent('shalona_emails_updated', { detail: emails }));
    }
  } catch (e) {
    console.error('Failed to update email status:', e);
  }
}

export async function sendOutgoingStudioEmail(emailData) {
  const { recipient, subject, body, inReplyToId } = emailData;

  const outgoingEntry = {
    id: 'out_' + Date.now(),
    direction: 'outgoing',
    sender: "Shalona's Art <info@shalonasart.ch>",
    senderName: "Shalona's Art",
    senderEmail: 'info@shalonasart.ch',
    recipient,
    subject,
    body,
    status: 'sent',
    in_reply_to: inReplyToId || null,
    created_at: new Date().toISOString()
  };

  // Try dispatching via Vercel /api/send-email if available
  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'info@shalonasart.ch',
        to: recipient,
        subject,
        text: body
      })
    });
    if (!res.ok) {
      console.warn('API returned non-200, recording outgoing email locally in store.');
    }
  } catch (err) {
    console.warn('Network call failed, saving to local store:', err);
  }

  // Record in studio emails outbox
  const emails = getStudioEmails();
  emails.unshift(outgoingEntry);

  // If this was a reply to an existing inquiry, update that inquiry to 'replied'
  if (inReplyToId) {
    const orig = emails.find(e => e.id === inReplyToId);
    if (orig) orig.status = 'replied';
  }

  localStorage.setItem(EMAILS_KEY, JSON.stringify(emails));
  window.dispatchEvent(new CustomEvent('shalona_emails_updated', { detail: emails }));
  return outgoingEntry;
}
