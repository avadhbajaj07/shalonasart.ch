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
 * Remove a custom category
 */
export function removeCategory(categoryName) {
  const current = getCategories();
  const updated = current.filter(c => c !== categoryName);
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updated));
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
    console.warn('Error reading journal categories:', e);
  }
  return DEFAULT_JOURNAL_CATEGORIES;
}

/**
 * Add a new journal category
 */
export function addJournalCategory(categoryName) {
  const trimmed = categoryName?.trim();
  if (!trimmed) return getJournalCategories();
  
  const current = getJournalCategories();
  if (!current.includes(trimmed)) {
    const updated = [...current, trimmed];
    try {
      localStorage.setItem(JOURNAL_CATEGORIES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save journal category:', e);
    }
    return updated;
  }
  return current;
}

/**
 * Helper to generate URL slug from text
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
 * Get all live artworks (Master collection including all 57 original + custom additions + edits)
 */
export function getLiveArtworks() {
  try {
    const saved = localStorage.getItem(MASTER_ARTWORKS_KEY);
    if (saved) {
      let parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Hydrate authentic philosophies and normalized data from initialArtworks
        const initialMap = new Map(initialArtworks.map(a => [a.id, a]));
        let hasChanges = false;
        parsed = parsed.map(item => {
          const init = initialMap.get(item.id);
          if (init) {
            let updatedItem = { ...item };
            if (!item.philosophy || item.philosophy.includes('Original artwork by Shalona') || !item.caption || item.caption.includes('Original artwork by Shalona')) {
              updatedItem.philosophy = init.philosophy;
              updatedItem.caption = init.caption;
              updatedItem.dimensions = init.dimensions;
              updatedItem.year = init.year;
              updatedItem.category = init.category;
              hasChanges = true;
            }
            if (item.category === 'Poetic Nature') {
              updatedItem.category = init.category;
              hasChanges = true;
            }
            return updatedItem;
          }
          return item;
        });
        if (hasChanges) {
          localStorage.setItem(MASTER_ARTWORKS_KEY, JSON.stringify(parsed));
        }
        return parsed;
      }
    }
    // Initialize master store from initial artworks + any previously stored custom pieces
    const oldCustom = JSON.parse(localStorage.getItem('shalona_custom_artworks') || '[]');
    const initial = [...oldCustom, ...initialArtworks];
    localStorage.setItem(MASTER_ARTWORKS_KEY, JSON.stringify(initial));
    return initial;
  } catch (e) {
    console.warn('Error loading master artworks:', e);
    return initialArtworks;
  }
}

/**
 * Add a new artwork
 */
export function saveArtwork(artworkData) {
  try {
    const list = getLiveArtworks();
    const id = Date.now();
    const slug = generateSlug(artworkData.title || `artwork-${id}`);
    
    const newArtwork = {
      id,
      accession: `SHA-${new Date().getFullYear()}-${String(list.length + 1).padStart(2, '0')}`,
      title: artworkData.title || 'Untitled Stillness',
      slug,
      category: artworkData.category || 'Abstract',
      image: artworkData.image,
      thumbnail: artworkData.thumbnail || artworkData.image,
      localImage: artworkData.image,
      year: artworkData.year || new Date().getFullYear().toString(),
      medium: artworkData.medium || 'Mixed media, acrylic emulsions & earth pigments on linen',
      dimensions: artworkData.dimensions || '100 × 80 cm',
      caption: artworkData.caption || artworkData.philosophy || 'Original artwork by Shalona, Richterswil, Switzerland.',
      philosophy: artworkData.philosophy || '',
      status: artworkData.status || (artworkData.category === 'Unfinished Works' ? 'In Progress' : 'Available'),
      featured: Boolean(artworkData.featured),
      artist: 'Shalona',
      purchaseStatus: artworkData.status || 'Available',
      createdAt: new Date().toISOString()
    };

    const updated = [newArtwork, ...list];
    localStorage.setItem(MASTER_ARTWORKS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('shalona_artworks_updated', { detail: updated }));
    return newArtwork;
  } catch (e) {
    console.error('Failed to save artwork:', e);
    throw e;
  }
}

/**
 * Update an existing artwork by ID (Works for ALL artworks - old and new!)
 */
export function updateArtwork(id, updatedFields) {
  try {
    const list = getLiveArtworks();
    const index = list.findIndex(a => a.id === id || String(a.id) === String(id));
    if (index === -1) {
      throw new Error(`Artwork with id ${id} not found`);
    }

    const current = list[index];
    const newTitle = updatedFields.title !== undefined ? updatedFields.title.trim() : current.title;
    const slug = updatedFields.slug || (newTitle !== current.title ? generateSlug(newTitle) : current.slug);
    const category = updatedFields.category || current.category;
    const isUnfinished = category === 'Unfinished Works';
    const status = updatedFields.status || (isUnfinished ? 'In Progress' : current.status);

    const updated = {
      ...current,
      ...updatedFields,
      title: newTitle,
      slug,
      category,
      status,
      dimensions: updatedFields.dimensions !== undefined ? updatedFields.dimensions : current.dimensions,
      medium: updatedFields.medium !== undefined ? updatedFields.medium : current.medium,
      year: updatedFields.year !== undefined ? updatedFields.year : current.year,
      philosophy: updatedFields.philosophy !== undefined ? updatedFields.philosophy : current.philosophy,
      caption: updatedFields.caption || updatedFields.philosophy || current.caption,
      image: updatedFields.image || current.image,
      thumbnail: updatedFields.thumbnail || updatedFields.image || current.thumbnail,
      localImage: updatedFields.image || current.localImage,
      updatedAt: new Date().toISOString()
    };

    const nextList = [...list];
    nextList[index] = updated;
    localStorage.setItem(MASTER_ARTWORKS_KEY, JSON.stringify(nextList));
    window.dispatchEvent(new CustomEvent('shalona_artworks_updated', { detail: nextList }));
    return updated;
  } catch (e) {
    console.error('Failed to update artwork:', e);
    throw e;
  }
}

/**
 * Delete an artwork by ID (Works for ALL artworks - old and new!)
 */
export function deleteArtwork(id) {
  try {
    const list = getLiveArtworks();
    const filtered = list.filter(a => a.id !== id && String(a.id) !== String(id));
    localStorage.setItem(MASTER_ARTWORKS_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('shalona_artworks_updated', { detail: filtered }));
    return true;
  } catch (e) {
    console.error('Failed to delete artwork:', e);
    return false;
  }
}

/**
 * Restore original catalogue of 57 artworks
 */
export function resetToDefaultArtworks() {
  localStorage.setItem(MASTER_ARTWORKS_KEY, JSON.stringify(initialArtworks));
  window.dispatchEvent(new CustomEvent('shalona_artworks_updated', { detail: initialArtworks }));
  return initialArtworks;
}

/**
 * Get all live journals (Master collection including original + custom additions + edits)
 */
export function getLiveJournals() {
  try {
    const saved = localStorage.getItem(MASTER_JOURNALS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    const oldCustom = JSON.parse(localStorage.getItem('shalona_custom_journals') || '[]');
    const initial = [...oldCustom, ...initialJournals];
    localStorage.setItem(MASTER_JOURNALS_KEY, JSON.stringify(initial));
    return initial;
  } catch (e) {
    console.warn('Error loading master journals:', e);
    return initialJournals;
  }
}

/**
 * Add a new journal entry
 */
export function saveJournal(journalData) {
  try {
    const list = getLiveJournals();
    const id = Date.now();
    const slug = generateSlug(journalData.title || `journal-${id}`);

    // Split long text into paragraphs
    const paragraphs = typeof journalData.content === 'string'
      ? journalData.content.split('\n\n').map(p => p.trim()).filter(Boolean)
      : Array.isArray(journalData.paragraphs) ? journalData.paragraphs : [journalData.content];

    const newJournal = {
      id,
      entryNumber: list.length + 1,
      title: journalData.title,
      fullTitle: `Journal Entry — ${journalData.title}`,
      subtitle: journalData.subtitle || 'Richterswil Studio',
      category: journalData.category || 'Studio Reflections',
      date: new Date().toISOString(),
      dateFormatted: new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date()),
      location: journalData.location || 'Richterswil, Switzerland',
      paragraphs: paragraphs.length > 0 ? paragraphs : [journalData.excerpt || ''],
      excerpt: journalData.excerpt || (paragraphs[0] ? paragraphs[0].slice(0, 180) + '...' : ''),
      featuredImage: journalData.image || null,
      slug,
      createdAt: new Date().toISOString()
    };

    const updated = [newJournal, ...list];
    localStorage.setItem(MASTER_JOURNALS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('shalona_journals_updated', { detail: updated }));
    return newJournal;
  } catch (e) {
    console.error('Failed to save journal:', e);
    throw e;
  }
}

/**
 * Update an existing journal entry by ID (Works for ALL journals - old and new!)
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

    let paragraphs = current.paragraphs;
    if (typeof updatedFields.content === 'string') {
      paragraphs = updatedFields.content.split('\n\n').map(p => p.trim()).filter(Boolean);
    } else if (Array.isArray(updatedFields.paragraphs)) {
      paragraphs = updatedFields.paragraphs;
    }

    const updated = {
      ...current,
      ...updatedFields,
      title: newTitle,
      slug,
      subtitle: updatedFields.subtitle !== undefined ? updatedFields.subtitle : current.subtitle,
      category: updatedFields.category || current.category,
      paragraphs,
      excerpt: updatedFields.excerpt !== undefined ? updatedFields.excerpt : (paragraphs[0] ? paragraphs[0].slice(0, 180) + '...' : current.excerpt),
      featuredImage: updatedFields.image !== undefined ? updatedFields.image : current.featuredImage,
      updatedAt: new Date().toISOString()
    };

    const nextList = [...list];
    nextList[index] = updated;
    localStorage.setItem(MASTER_JOURNALS_KEY, JSON.stringify(nextList));
    window.dispatchEvent(new CustomEvent('shalona_journals_updated', { detail: nextList }));
    return updated;
  } catch (e) {
    console.error('Failed to update journal:', e);
    throw e;
  }
}

/**
 * Delete a journal entry by ID (Works for ALL journals - old and new!)
 */
export function deleteJournal(id) {
  try {
    const list = getLiveJournals();
    const filtered = list.filter(j => j.id !== id && String(j.id) !== String(id));
    localStorage.setItem(MASTER_JOURNALS_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('shalona_journals_updated', { detail: filtered }));
    return true;
  } catch (e) {
    console.error('Failed to delete journal:', e);
    return false;
  }
}

/**
 * Restore original journals
 */
export function resetToDefaultJournals() {
  localStorage.setItem(MASTER_JOURNALS_KEY, JSON.stringify(initialJournals));
  window.dispatchEvent(new CustomEvent('shalona_journals_updated', { detail: initialJournals }));
  return initialJournals;
}

/**
 * Client-Side Image Compressor for iPhone / Mobile Cameras
 * Compresses 10-15MB raw iPhone photos into smooth, high-fidelity ~250-400KB Web-ready images
 */
export function compressImageFile(file, maxWidth = 1600, maxHeight = 1600, quality = 0.85) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided'));
    }

    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to high-quality compressed JPEG
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve({
          dataUrl,
          width,
          height,
          aspectRatio: Number((width / height).toFixed(3)),
          originalSize: file.size,
          compressedSize: Math.round((dataUrl.length * 3) / 4)
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Export all studio content as a JSON file backup
 */
export function exportStudioBackup() {
  const data = {
    exportDate: new Date().toISOString(),
    artworks: getLiveArtworks(),
    journals: getLiveJournals(),
    categories: getCategories()
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `shalona-art-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
