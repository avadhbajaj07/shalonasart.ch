// Vercel Serverless Function: /api/admin-artwork
// Server-side privileged operations for Shalona's Art Atelier artworks management
// Uses SUPABASE_SERVICE_ROLE_KEY to guarantee persistent CRUD in Supabase database & storage

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function getServiceKey() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return process.env.SUPABASE_SERVICE_ROLE_KEY;
  }
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(/SUPABASE_SERVICE_ROLE_KEY\s*=\s*([^\r\n]+)/);
      if (match && match[1]) {
        return match[1].trim().replace(/^['"]|['"]$/g, '');
      }
    }
  } catch {
    // Ignore fallback errors
  }
  return null;
}

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mhiyjqcwdbqpmplghewi.supabase.co';
  const serviceKey = getServiceKey();
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured on the server.');
  }
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Only POST is accepted.' });
  }

  try {
    const supabase = getSupabaseClient();
    const { action, id, slug, title, imagePath, updates, artworkData, items } = req.body || {};

    // 1. DELETE ARTWORK
    if (action === 'delete') {
      let deletedRows = [];

      // Try deleting by UUID if valid UUID format
      if (id && UUID_REGEX.test(String(id))) {
        const { data, error } = await supabase
          .from('artworks')
          .delete()
          .eq('id', id)
          .select();
        if (!error && Array.isArray(data) && data.length > 0) {
          deletedRows = data;
        }
      }

      // If not deleted yet, try deleting by slug
      if (deletedRows.length === 0 && slug) {
        const { data, error } = await supabase
          .from('artworks')
          .delete()
          .eq('slug', slug)
          .select();
        if (!error && Array.isArray(data) && data.length > 0) {
          deletedRows = data;
        }
      }

      // If still not deleted, try deleting by exact title
      if (deletedRows.length === 0 && title) {
        const { data, error } = await supabase
          .from('artworks')
          .delete()
          .ilike('title', title.trim())
          .select();
        if (!error && Array.isArray(data) && data.length > 0) {
          deletedRows = data;
        }
      }

      // Clean up Supabase storage image file if present
      if (imagePath) {
        try {
          await supabase.storage.from('artworks').remove([imagePath]);
        } catch (storageErr) {
          console.warn('Storage cleanup non-critical error:', storageErr.message);
        }
      }

      return res.status(200).json({
        success: true,
        action: 'delete',
        deletedCount: deletedRows.length,
        deletedArtwork: deletedRows[0] || null,
      });
    }

    // 2. UPDATE ARTWORK
    if (action === 'update') {
      if (!updates || typeof updates !== 'object') {
        return res.status(400).json({ error: 'updates payload is required.' });
      }

      let updatedRows = [];

      if (id && UUID_REGEX.test(String(id))) {
        const { data, error } = await supabase
          .from('artworks')
          .update(updates)
          .eq('id', id)
          .select();
        if (!error && Array.isArray(data) && data.length > 0) {
          updatedRows = data;
        }
      }

      if (updatedRows.length === 0 && slug) {
        const { data, error } = await supabase
          .from('artworks')
          .update(updates)
          .eq('slug', slug)
          .select();
        if (!error && Array.isArray(data) && data.length > 0) {
          updatedRows = data;
        }
      }

      return res.status(200).json({
        success: true,
        action: 'update',
        data: updatedRows[0] || null,
      });
    }

    // 3. CREATE / SAVE ARTWORK
    if (action === 'save') {
      if (!artworkData || typeof artworkData !== 'object') {
        return res.status(400).json({ error: 'artworkData payload is required.' });
      }

      const { data, error } = await supabase
        .from('artworks')
        .insert(artworkData)
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({
        success: true,
        action: 'save',
        data,
      });
    }

    // 4. REORDER ARTWORKS
    if (action === 'reorder') {
      if (!Array.isArray(items)) {
        return res.status(400).json({ error: 'items array is required.' });
      }

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const newSort = item.sort_order || i + 1;
        if (item.id && UUID_REGEX.test(String(item.id))) {
          await supabase.from('artworks').update({ sort_order: newSort }).eq('id', item.id);
        } else if (item.slug) {
          await supabase.from('artworks').update({ sort_order: newSort }).eq('slug', item.slug);
        }
      }

      return res.status(200).json({
        success: true,
        action: 'reorder',
        count: items.length,
      });
    }

    return res.status(400).json({ error: `Unknown action: "${action}"` });
  } catch (error) {
    console.error('Server error in /api/admin-artwork:', error);
    return res.status(500).json({
      error: error.message || 'An error occurred while managing artwork.',
    });
  }
}
