import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { artworks } from '../src/data/artworks.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Read .env.local if needed
function loadEnv() {
  const envPath = path.join(rootDir, '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = match[2] || '';
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        process.env[key] = val.trim();
      }
    }
  }
}

loadEnv();

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mhiyjqcwdbqpmplghewi.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is required in .env.local');
  process.exit(1);
}

console.log('Connecting to Supabase:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.gif') return 'image/gif';
  return 'application/octet-stream';
}

function normalizeStatus(status) {
  if (!status) return 'available';
  const s = status.toLowerCase().trim();
  if (s.includes('avail')) return 'available';
  if (s.includes('sold')) return 'sold';
  if (s.includes('not') || s.includes('private')) return 'not_for_sale';
  if (s.includes('progress') || s.includes('unfinish')) return 'in_progress';
  return 'available';
}

async function uploadFile(localRelativePath, storagePath) {
  const fullPath = path.join(rootDir, 'public', localRelativePath.replace(/^\//, ''));
  if (!fs.existsSync(fullPath)) {
    console.warn(`[WARN] File not found on disk: ${fullPath}`);
    return null;
  }

  const fileBuffer = fs.readFileSync(fullPath);
  const contentType = getMimeType(fullPath);

  const { data, error } = await supabase.storage
    .from('artworks')
    .upload(storagePath, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    console.error(`[ERROR] Failed to upload ${storagePath}:`, error.message);
    throw error;
  }

  const { data: publicData } = supabase.storage
    .from('artworks')
    .getPublicUrl(storagePath);

  return {
    path: storagePath,
    url: publicData.publicUrl,
  };
}

async function main() {
  console.log(`Starting migration for ${artworks.length} artworks...`);

  let insertedCount = 0;
  let skippedCount = 0;
  let failureCount = 0;

  for (let i = 0; i < artworks.length; i++) {
    const art = artworks[i];
    const sortOrder = i + 1;
    console.log(`\n[${sortOrder}/${artworks.length}] Processing: "${art.title}" (${art.slug})`);

    try {
      // 1. Upload main image
      let uploadedImage = null;
      if (art.image) {
        const ext = path.extname(art.image);
        const fileName = `${art.slug}${ext}`;
        uploadedImage = await uploadFile(art.image, `images/${fileName}`);
      }

      // 2. Upload thumbnail if distinct
      let uploadedThumb = null;
      if (art.thumbnail && art.thumbnail !== art.image) {
        const ext = path.extname(art.thumbnail);
        const fileName = `${art.slug}-thumb${ext}`;
        uploadedThumb = await uploadFile(art.thumbnail, `thumbnails/${fileName}`);
      }

      const imageUrl = uploadedImage?.url || art.image;
      const thumbnailUrl = uploadedThumb?.url || uploadedImage?.url || art.thumbnail || art.image;
      const imagePath = uploadedImage?.path || null;

      // 3. Prepare database payload
      const row = {
        title: art.title.trim(),
        slug: art.slug.trim(),
        description: art.caption || art.philosophy || null,
        philosophy: art.philosophy || art.caption || null,
        year: String(art.year || '2026'),
        medium: art.medium || 'Mixed media',
        dimensions: art.dimensions || null,
        price: null,
        currency: 'CHF',
        status: normalizeStatus(art.status),
        category: art.category || 'Abstract',
        image_path: imagePath,
        image_url: imageUrl,
        thumbnail_url: thumbnailUrl,
        sort_order: sortOrder,
        is_published: true,
        featured: Boolean(art.featured),
        accession: art.accession || null,
        width: art.width || null,
        height: art.height || null,
        aspect_ratio: art.aspectRatio ? Number(art.aspectRatio.toFixed(4)) : null,
        verification_status: 'verified',
        is_locked: false,
      };

      // 4. Upsert row matching on unique slug
      const { data, error } = await supabase
        .from('artworks')
        .upsert(row, { onConflict: 'slug' })
        .select();

      if (error) {
        console.error(`[FAIL] Upsert error for "${art.title}":`, error.message);
        failureCount++;
      } else {
        console.log(`[OK] Successfully synced: "${art.title}" -> ${imageUrl}`);
        insertedCount++;
      }
    } catch (err) {
      console.error(`[EXCEPTION] Error processing "${art.title}":`, err.message);
      failureCount++;
    }
  }

  // Verification check from the database directly
  const { data: countData, error: countError, count } = await supabase
    .from('artworks')
    .select('id, title, slug, image_url', { count: 'exact' });

  const totalInDb = count ?? countData?.length ?? 0;

  console.log('\n====================================================');
  console.log('MIGRATION REPORT:');
  console.log(`Total Artworks Expected: ${artworks.length}`);
  console.log(`Inserted / Upserted:     ${insertedCount}`);
  console.log(`Skipped:                 ${skippedCount}`);
  console.log(`Failures:                ${failureCount}`);
  console.log(`Total Rows in Database:  ${totalInDb}`);
  console.log('====================================================\n');

  if (totalInDb !== artworks.length || failureCount > 0) {
    console.error('Migration finished with discrepancies!');
    process.exit(1);
  } else {
    console.log('All 51 artworks successfully migrated and verified in Supabase!');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal migration error:', err);
  process.exit(1);
});
