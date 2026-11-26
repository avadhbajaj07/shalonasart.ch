// Vercel Serverless Function: /api/admin-email
// Server-side privileged operations for Shalona's Art Atelier email management
// Uses SUPABASE_SERVICE_ROLE_KEY to guarantee persistent email reading, deletion, and management

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

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
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle GET: Fetch all emails safely with Service Role Key (bypassing RLS)
  if (req.method === 'GET') {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return res.status(200).json({ success: true, emails: data || [] });
    } catch (err) {
      console.error('Error fetching emails via /api/admin-email:', err);
      return res.status(500).json({ error: err.message, emails: [] });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Only GET and POST are accepted.' });
  }

  try {
    const supabase = getSupabaseClient();
    const { action, id, status } = req.body || {};

    if (action === 'delete') {
      if (!id) {
        return res.status(400).json({ error: 'id is required for deletion.' });
      }

      // Check if valid UUID
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id))) {
        await supabase.from('emails').delete().eq('id', id);
      } else {
        // If non-UUID id (like 'em-seed-1'), attempt delete or ignore
        await supabase.from('emails').delete().eq('id', id).catch(() => {});
      }

      return res.status(200).json({ success: true, action: 'delete', id });
    }

    if (action === 'update_status') {
      if (!id || !status) {
        return res.status(400).json({ error: 'id and status are required.' });
      }
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id))) {
        await supabase.from('emails').update({ status }).eq('id', id);
      }
      return res.status(200).json({ success: true, action: 'update_status', id, status });
    }

    return res.status(400).json({ error: `Unknown action: "${action}"` });
  } catch (error) {
    console.error('Server error in /api/admin-email:', error);
    return res.status(500).json({
      error: error.message || 'An error occurred while managing email.',
    });
  }
}
