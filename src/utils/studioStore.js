import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { artworks as initialArtworks } from '../data/artworks';
import { journals as initialJournals } from '../data/journals';

const MASTER_ARTWORKS_KEY = 'shalona_master_artworks';
const MASTER_JOURNALS_KEY = 'shalona_master_journals';
const CATEGORIES_STORAGE_KEY = 'shalona_custom_categories';
const JOURNAL_CATEGORIES_STORAGE_KEY = 'shalona_custom_journal_categories';

export const DEFAULT_CATEGORIES = [
  'Abstract',
  'Figurative Abstracts',
  'Expressions',
  'Unfinished Works'
];

export const DEFAULT_JOURNAL_CATEGORIES = [
  'Studio Reflections',
  'Philosophy of Stillness',
  'Technique & Pigments',
  'Atelier Notes'
];

/**
 * Zod validation schema for artwork creation and updates
 */
export const ArtworkInputSchema = z.object({
  title: z.string().min(1, 'Artwork title is required'),
  category: z.string().min(1, 'Category is required'),
  dimensions: z.string().optional().default('100 × 80 cm'),
  medium: z.string().optional().default('Mixed media on linen'),
  year: z.string().optional().default(new Date().getFullYear().toString()),
  philosophy: z.string().optional().default(''),
  status: z.string().optional().default('Available'),
  image: z.string().min(1, 'Artwork image is required'),
  featured: z.boolean().optional().default(false),
  isPublished: z.boolean().optional().default(true),
});

/**
 * Maps Supabase DB row to the frontend artwork model
 */
export function mapSupabaseToArtwork(row) {
  const normStatus = (row.status || 'available').toLowerCase();
  let uiStatus = 'Available';
  if (normStatus.includes('sold') || normStatus.includes('not') || normStatus.includes('private')) {
    uiStatus = 'Sold';
  } else if (normStatus.includes('progress') || normStatus.includes('unfinish')) {
    uiStatus = 'In Progress';
  }

  const rawCat = row.category || 'Abstract';
  const catArray = rawCat.split(',').map(s => s.trim()).filter(Boolean);

  return {
    id: row.id,
    accession: row.accession || `SHA-${row.year || '2026'}-${String(row.sort_order || 1).padStart(2, '0')}`,
    title: row.title,
    slug: row.slug,
    category: rawCat,
    categories: catArray.length > 0 ? catArray : ['Abstract'],
    primaryCategory: catArray[0] || 'Abstract',
    secondaryCategory: catArray[1] || '',
    image: row.image_url || '/wp-content/uploads/2026/11/IMG_1085-scaled.jpg',
    thumbnail: row.thumbnail_url || row.image_url || '/wp-content/uploads/2026/11/IMG_1085-654x1024.jpg',
    localImage: row.image_url,
    year: String(row.year || '2026'),
    medium: row.medium || 'Mixed media, acrylic emulsions & earth pigments on linen',
    dimensions: row.dimensions || '100 × 80 cm',
    caption: row.description || row.philosophy || 'Original artwork by Shalona, Richterswil, Switzerland.',
    philosophy: row.philosophy || row.description || '',
    status: uiStatus,
    isSold: uiStatus === 'Sold',
    featured: Boolean(row.featured),
    width: row.width || 1800,
    height: row.height || 2400,
    aspectRatio: Number(row.aspect_ratio || 0.75),
    artist: 'Shalona',
    purchaseStatus: uiStatus,
    sortOrder: row.sort_order || 0,
    isPublished: row.is_published ?? true,
    imagePath: row.image_path || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Asynchronously fetch artworks from Supabase, sync to localStorage, and notify subscribers
 */
export async function loadArtworksFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.warn('Supabase fetch error, fallback to cache:', error.message);
      return getLiveArtworks();
    }

    if (Array.isArray(data) && data.length > 0) {
      const mapped = data.map(mapSupabaseToArtwork);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(MASTER_ARTWORKS_KEY, JSON.stringify(mapped));
        } catch (storageErr) {
          console.warn('localStorage quota warning on cache sync:', storageErr);
        }
        window.dispatchEvent(new CustomEvent('shalona_artworks_updated', { detail: mapped }));
      }
      return mapped;
    }
  } catch (err) {
    console.warn('Network or Supabase load failure:', err.message);
  }
  return getLiveArtworks();
}

/**
 * Get all available categories (base + user created)
 */
export function getCategories() {
  try {
    const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return Array.from(new Set([...DEFAULT_CATEGORIES, ...parsed]));
    }
  } catch (e) {
    console.warn('Error reading categories from localStorage:', e);
  }
  return DEFAULT_CATEGORIES;
}

/**
 * Add a new custom category
 */
export function addCategory(categoryName) {
  const trimmed = categoryName?.trim();
  if (!trimmed) return getCategories();
  
  const current = getCategories();
  if (!current.includes(trimmed)) {
    const updated = [...current, trimmed];
    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('shalona_categories_updated', { detail: updated }));
    } catch (e) {
      console.error('Failed to save category:', e);
    }
    return updated;
  }
  return current;
}

/**
 * Remove a custom category (cannot remove DEFAULT_CATEGORIES)
 */
export function removeCategory(categoryName) {
  if (DEFAULT_CATEGORIES.includes(categoryName)) {
    return getCategories();
  }
  const current = getCategories();
  const updated = current.filter(c => c !== categoryName);
  try {
    const customOnly = updated.filter(c => !DEFAULT_CATEGORIES.includes(c));
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(customOnly));
    window.dispatchEvent(new CustomEvent('shalona_categories_updated', { detail: updated }));
  } catch (e) {
    console.error('Failed to remove category:', e);
  }
  return updated;
}

/**
 * Get all available journal categories
 */
export function getJournalCategories() {
  try {
    const saved = localStorage.getItem(JOURNAL_CATEGORIES_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return Array.from(new Set([...DEFAULT_JOURNAL_CATEGORIES, ...parsed]));
    }
  } catch (e) {
    console.warn('Error reading journal categories from localStorage:', e);
  }
  return DEFAULT_JOURNAL_CATEGORIES;
}

/**
 * Add a new custom journal category
 */
export function addJournalCategory(categoryName) {
  const trimmed = categoryName?.trim();
  if (!trimmed) return getJournalCategories();
  
  const current = getJournalCategories();
  if (!current.includes(trimmed)) {
    const updated = [...current, trimmed];
    try {
      localStorage.setItem(JOURNAL_CATEGORIES_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('shalona_journal_categories_updated', { detail: updated }));
    } catch (e) {
      console.error('Failed to save journal category:', e);
    }
    return updated;
  }
  return current;
}

/**
 * Generate URL safe slug from text
 */
export function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Get all live artworks (Master collection including original + custom additions + edits)
 */
export function getLiveArtworks() {
  try {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(MASTER_ARTWORKS_KEY) : null;
    if (saved) {
      let parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    return initialArtworks;
  } catch (e) {
    console.warn('Error loading master artworks:', e);
    return initialArtworks;
  }
}

/**
 * Upload an artwork image directly to Supabase Storage bucket 'artworks'
 * Supports File, Blob, or { blob, dataUrl } meta objects.
 * Uses direct storage upload with fallback to serverless Service Role upload.
 */
export async function uploadArtworkImageToSupabase(fileOrMeta, slug) {
  try {
    const isMeta = fileOrMeta && typeof fileOrMeta === 'object' && fileOrMeta.blob;
    const blob = isMeta ? fileOrMeta.blob : fileOrMeta;
    const dataUrl = isMeta ? fileOrMeta.dataUrl : null;
    const filename = fileOrMeta?.name || `${slug || 'artwork'}.jpg`;
    const ext = filename.includes('.') ? filename.split('.').pop().toLowerCase() : 'jpg';
    const cleanSlug = generateSlug(slug || 'artwork');
    const storagePath = `images/${cleanSlug}-${Date.now()}.${ext}`;

    // 1. Direct Supabase Storage client upload
    if (blob) {
      try {
        const { data, error } = await supabase.storage
          .from('artworks')
          .upload(storagePath, blob, {
            contentType: blob.type || 'image/jpeg',
            upsert: true,
          });

        if (!error && data) {
          const { data: publicData } = supabase.storage
            .from('artworks')
            .getPublicUrl(storagePath);

          return {
            path: storagePath,
            url: publicData.publicUrl,
          };
        }
      } catch (clientErr) {
        console.warn('Direct client storage upload attempt failed:', clientErr.message);
      }
    }

    // 2. Serverless fallback backed by Service Role Key
    let base64String = dataUrl;
    if (!base64String && blob) {
      base64String = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }

    if (base64String) {
      const res = await fetch('/api/admin-artwork', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'upload',
          fileBase64: base64String,
          filename,
          slug: cleanSlug,
          contentType: blob ? blob.type : 'image/jpeg',
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.url) {
          return {
            path: json.path,
            url: json.url,
          };
        }
      }
    }

    throw new Error('Could not upload image to storage via client or serverless API.');
  } catch (err) {
    console.error('Failed to upload image to Supabase Storage:', err);
    throw err;
  }
}

/**
 * Add a new artwork (Saves directly to Supabase and updates local store)
 */
export async function saveArtwork(artworkData) {
  // Validate input
  ArtworkInputSchema.parse(artworkData);

  const list = getLiveArtworks();
  const slug = generateSlug(artworkData.title || `artwork-${Date.now()}`);
  const sortOrder = list.length + 1;

  const dbStatus = (artworkData.status || 'Available').toLowerCase().includes('sold')
    ? 'sold'
    : (artworkData.status || '').toLowerCase().includes('not')
    ? 'not_for_sale'
    : (artworkData.category === 'Unfinished Works')
    ? 'in_progress'
    : 'available';

  const row = {
    title: artworkData.title.trim(),
    slug,
    description: artworkData.caption || artworkData.philosophy || null,
    philosophy: artworkData.philosophy || artworkData.caption || null,
    year: String(artworkData.year || new Date().getFullYear()),
    medium: artworkData.medium || 'Mixed media, acrylic emulsions & earth pigments on linen',
    dimensions: artworkData.dimensions || '100 × 80 cm',
    price: artworkData.price ? Number(artworkData.price) : null,
    currency: 'CHF',
    status: dbStatus,
    category: artworkData.category || 'Abstract',
    image_path: artworkData.imagePath || null,
    image_url: artworkData.image,
    thumbnail_url: artworkData.thumbnail || artworkData.image,
    sort_order: sortOrder,
    is_published: artworkData.isPublished !== false,
    featured: Boolean(artworkData.featured),
    accession: `SHA-${artworkData.year || new Date().getFullYear()}-${String(sortOrder).padStart(2, '0')}`,
    verification_status: 'verified',
    is_locked: false,
  };

  try {
    let createdRow = null;

    // 1. Try serverless admin endpoint backed by Service Role Key
    try {
      const res = await fetch('/api/admin-artwork', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save', artworkData: row }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) createdRow = json.data;
      }
    } catch (apiErr) {
      console.warn('API save fallback, using client Supabase:', apiErr.message);
    }

    // 2. Direct client fallback if API was unavailable
    if (!createdRow) {
      const { data, error } = await supabase
        .from('artworks')
        .insert(row)
        .select()
        .single();
      if (!error && data) createdRow = data;
      else if (error) console.warn('Client Supabase insert warning:', error.message);
    }

    const catArray = (artworkData.category || 'Abstract').split(',').map(s => s.trim()).filter(Boolean);
    const isSold = dbStatus === 'sold' || dbStatus === 'not_for_sale';
    const displayStatus = isSold ? 'Sold' : (dbStatus === 'in_progress' ? 'In Progress' : 'Available');

    const createdArtwork = createdRow ? mapSupabaseToArtwork(createdRow) : {
      id: Date.now().toString(),
      ...artworkData,
      category: artworkData.category || 'Abstract',
      categories: catArray.length > 0 ? catArray : ['Abstract'],
      primaryCategory: catArray[0] || 'Abstract',
      secondaryCategory: catArray[1] || '',
      status: displayStatus,
      isSold,
      slug,
      sortOrder,
      isPublished: true,
      thumbnail: artworkData.thumbnail || artworkData.image,
    };

    const updated = [createdArtwork, ...list];
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(MASTER_ARTWORKS_KEY, JSON.stringify(updated));
      } catch (storageErr) {
        console.warn('localStorage quota warning on save:', storageErr);
      }
      window.dispatchEvent(new CustomEvent('shalona_artworks_updated', { detail: updated }));
    }
    return createdArtwork;
  } catch (e) {
    console.error('Failed to save artwork:', e);
    throw e;
  }
}

/**
 * Update an existing artwork by ID (Works with Supabase and local store)
 */
export async function updateArtwork(id, updatedFields) {
  try {
    const list = getLiveArtworks();
    const index = list.findIndex(a => a.id === id || String(a.id) === String(id) || (a.slug && a.slug === updatedFields.slug));
    if (index === -1) {
      throw new Error(`Artwork with id ${id} not found`);
    }

    const current = list[index];
    const newTitle = updatedFields.title !== undefined ? updatedFields.title.trim() : current.title;
    const slug = updatedFields.slug || (newTitle !== current.title ? generateSlug(newTitle) : current.slug);
    const category = updatedFields.category || current.category;
    const isUnfinished = category === 'Unfinished Works';
    const status = updatedFields.status || (isUnfinished ? 'In Progress' : current.status);

    const dbStatus = (status || '').toLowerCase().includes('sold')
      ? 'sold'
      : (status || '').toLowerCase().includes('not')
      ? 'not_for_sale'
      : isUnfinished
      ? 'in_progress'
      : 'available';

    // Prepare Supabase update payload
    const updatePayload = {
      title: newTitle,
      slug,
      category,
      status: dbStatus,
      dimensions: updatedFields.dimensions !== undefined ? updatedFields.dimensions : current.dimensions,
      medium: updatedFields.medium !== undefined ? updatedFields.medium : current.medium,
      year: updatedFields.year !== undefined ? String(updatedFields.year) : String(current.year),
      philosophy: updatedFields.philosophy !== undefined ? updatedFields.philosophy : current.philosophy,
      description: updatedFields.caption || updatedFields.philosophy || current.caption,
      image_url: updatedFields.image || current.image,
      thumbnail_url: updatedFields.thumbnail || updatedFields.image || current.thumbnail,
      is_published: updatedFields.isPublished !== undefined ? updatedFields.isPublished : (current.isPublished ?? true),
      featured: updatedFields.featured !== undefined ? Boolean(updatedFields.featured) : current.featured,
    };

    if (updatedFields.imagePath) {
      updatePayload.image_path = updatedFields.imagePath;
    }

    // 1. Try serverless admin endpoint backed by Service Role Key
    try {
      await fetch('/api/admin-artwork', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          id: current.id,
          slug: current.slug,
          updates: updatePayload,
        }),
      });
    } catch (apiErr) {
      console.warn('API update fallback:', apiErr.message);
    }

    // 2. Direct client fallback
    try {
      if (current.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(current.id))) {
        await supabase.from('artworks').update(updatePayload).eq('id', current.id);
      } else if (current.slug) {
        await supabase.from('artworks').update(updatePayload).eq('slug', current.slug);
      }
    } catch (clientErr) {
      console.warn('Supabase client update fallback warning:', clientErr.message);
    }

    const catArray = category.split(',').map(s => s.trim()).filter(Boolean);
    const isSold = (status || '').toLowerCase().includes('sold') || (status || '').toLowerCase().includes('private') || (status || '').toLowerCase().includes('not');
    const displayStatus = isSold ? 'Sold' : (isUnfinished || status === 'In Progress' ? 'In Progress' : 'Available');

    const updated = {
      ...current,
      ...updatedFields,
      title: newTitle,
      slug,
      category,
      categories: catArray.length > 0 ? catArray : ['Abstract'],
      primaryCategory: catArray[0] || 'Abstract',
      secondaryCategory: catArray[1] || '',
      status: displayStatus,
      isSold,
      image: updatedFields.image || current.image,
      thumbnail: updatedFields.thumbnail || updatedFields.image || current.thumbnail,
      localImage: updatedFields.image || current.image,
      updatedAt: new Date().toISOString()
    };

    const nextList = [...list];
    nextList[index] = updated;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(MASTER_ARTWORKS_KEY, JSON.stringify(nextList));
      } catch (storageErr) {
        console.warn('localStorage quota warning on update:', storageErr);
      }
      window.dispatchEvent(new CustomEvent('shalona_artworks_updated', { detail: nextList }));
    }
    return updated;
  } catch (e) {
    console.error('Failed to update artwork:', e);
    throw e;
  }
}

/**
 * Delete an artwork permanently (Works for ALL artworks - persists to Supabase DB & Storage!)
 */
export async function deleteArtwork(id) {
  try {
    const list = getLiveArtworks();
    const target = list.find(a => a.id === id || String(a.id) === String(id));

    const targetId = target?.id || id;
    const targetSlug = target?.slug;
    const targetTitle = target?.title;
    const imagePath = target?.imagePath;

    // 1. Trigger server-side persistent deletion via Service Role API (guarantees DB + Storage removal)
    try {
      await fetch('/api/admin-artwork', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          id: targetId,
          slug: targetSlug,
          title: targetTitle,
          imagePath,
        }),
      });
    } catch (apiErr) {
      console.warn('API deletion fallback, attempting direct Supabase delete:', apiErr.message);
    }

    // 2. Direct client Supabase deletion (handles UUID or slug)
    try {
      if (targetId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(targetId))) {
        await supabase.from('artworks').delete().eq('id', targetId);
      }
      if (targetSlug) {
        await supabase.from('artworks').delete().eq('slug', targetSlug);
      }
      if (imagePath) {
        await supabase.storage.from('artworks').remove([imagePath]).catch(() => {});
      }
    } catch (dbErr) {
      console.warn('Client Supabase delete error:', dbErr.message);
    }

    // 3. Remove from local store and notify UI components
    const filtered = list.filter(a => {
      if (a.id === id || String(a.id) === String(id)) return false;
      if (targetSlug && a.slug === targetSlug) return false;
      if (targetTitle && a.title === targetTitle) return false;
      return true;
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem(MASTER_ARTWORKS_KEY, JSON.stringify(filtered));
      window.dispatchEvent(new CustomEvent('shalona_artworks_updated', { detail: filtered }));
    }
    return true;
  } catch (e) {
    console.error('Failed to delete artwork:', e);
    return false;
  }
}

/**
 * Reorder artworks and update sort_order in Supabase
 */
export async function reorderArtworks(orderedArtworks) {
  try {
    const updatedList = orderedArtworks.map((art, index) => ({
      ...art,
      sortOrder: index + 1,
    }));

    if (typeof window !== 'undefined') {
      localStorage.setItem(MASTER_ARTWORKS_KEY, JSON.stringify(updatedList));
      window.dispatchEvent(new CustomEvent('shalona_artworks_updated', { detail: updatedList }));
    }

    // 1. Persist sort_order updates to Supabase via serverless admin endpoint
    try {
      await fetch('/api/admin-artwork', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reorder',
          items: updatedList.map((art, idx) => ({
            id: art.id,
            slug: art.slug,
            sort_order: idx + 1,
          })),
        }),
      });
    } catch (apiErr) {
      console.warn('API reorder fallback:', apiErr.message);
    }

    return updatedList;
  } catch (e) {
    console.error('Failed to reorder artworks:', e);
    return orderedArtworks;
  }
}

/**
 * Restore original catalogue of 51 artworks from Supabase
 */
export async function resetToDefaultArtworks() {
  return await loadArtworksFromSupabase();
}

/**
 * Get all live journals
 */
export function getLiveJournals() {
  try {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(MASTER_JOURNALS_KEY) : null;
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    const oldCustom = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('shalona_custom_journals') || '[]') : [];
    const initial = [...oldCustom, ...initialJournals];
    if (typeof window !== 'undefined') {
      localStorage.setItem(MASTER_JOURNALS_KEY, JSON.stringify(initial));
    }
    return initial;
  } catch (e) {
    console.warn('Error loading master journals:', e);
    return initialJournals;
  }
}

/**
 * Add a new journal reflection
 */
export function saveJournal(journalData) {
  try {
    const list = getLiveJournals();
    const id = Date.now();
    const slug = generateSlug(journalData.title || `journal-${id}`);
    
    const newJournal = {
      id,
      title: journalData.title || 'Untitled Meditation',
      slug,
      date: journalData.date || new Date().toISOString().split('T')[0],
      readTime: journalData.readTime || '3 min read',
      category: journalData.category || 'Studio Reflections',
      excerpt: journalData.excerpt || '',
      content: journalData.content || '',
      image: journalData.image || null,
      artworkSlug: journalData.artworkSlug || null,
      tags: journalData.tags || ['Richterswil', 'Stillness'],
      featured: Boolean(journalData.featured),
      author: 'Shalona',
      createdAt: new Date().toISOString()
    };

    const updated = [newJournal, ...list];
    if (typeof window !== 'undefined') {
      localStorage.setItem(MASTER_JOURNALS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('shalona_journals_updated', { detail: updated }));
    }
    return newJournal;
  } catch (e) {
    console.error('Failed to save journal:', e);
    throw e;
  }
}

/**
 * Update an existing journal
 */
export function updateJournal(id, updatedFields) {
  try {
    const list = getLiveJournals();
    const index = list.findIndex(j => j.id === id || String(j.id) === String(id));
    if (index === -1) {
      throw new Error(`Journal with id ${id} not found`);
    }

    const current = list[index];
    const newTitle = updatedFields.title !== undefined ? updatedFields.title.trim() : current.title;
    const slug = updatedFields.slug || (newTitle !== current.title ? generateSlug(newTitle) : current.slug);

    const updated = {
      ...current,
      ...updatedFields,
      title: newTitle,
      slug,
      updatedAt: new Date().toISOString()
    };

    const nextList = [...list];
    nextList[index] = updated;
    if (typeof window !== 'undefined') {
      localStorage.setItem(MASTER_JOURNALS_KEY, JSON.stringify(nextList));
      window.dispatchEvent(new CustomEvent('shalona_journals_updated', { detail: nextList }));
    }
    return updated;
  } catch (e) {
    console.error('Failed to update journal:', e);
    throw e;
  }
}

/**
 * Delete a journal
 */
export function deleteJournal(id) {
  try {
    const list = getLiveJournals();
    const filtered = list.filter(j => j.id !== id && String(j.id) !== String(id));
    if (typeof window !== 'undefined') {
      localStorage.setItem(MASTER_JOURNALS_KEY, JSON.stringify(filtered));
      window.dispatchEvent(new CustomEvent('shalona_journals_updated', { detail: filtered }));
    }
    return true;
  } catch (e) {
    console.error('Failed to delete journal:', e);
    return false;
  }
}

/**
 * Reset journals to default
 */
export function resetToDefaultJournals() {
  if (typeof window !== 'undefined') {
    localStorage.setItem(MASTER_JOURNALS_KEY, JSON.stringify(initialJournals));
    window.dispatchEvent(new CustomEvent('shalona_journals_updated', { detail: initialJournals }));
  }
  return initialJournals;
}

/**
 * Client-side high-fidelity image compression before upload
 */
export function compressImageFile(file, maxWidth = 1600, maxHeight = 1600, quality = 0.85) {
  return new Promise((resolve, reject) => {
    if (!file.type.match(/image.*/)) {
      return reject(new Error('File is not an image'));
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const image = new Image();
      image.onload = () => {
        let width = image.width;
        let height = image.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // Also convert to Blob for direct Supabase Storage uploads
        canvas.toBlob((blob) => {
          resolve({
            dataUrl,
            blob,
            width,
            height,
            size: blob ? blob.size : 0
          });
        }, 'image/jpeg', quality);
      };
      image.onerror = (e) => reject(e);
      image.src = readerEvent.target.result;
    };
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

/**
 * Export full studio database archive as JSON backup
 */
export function exportStudioBackup() {
  const backup = {
    exportedAt: new Date().toISOString(),
    artist: "Shalona Fine Art Atelier, Richterswil",
    categories: getCategories(),
    artworks: getLiveArtworks(),
    journals: getLiveJournals()
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `shalona-atelier-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
