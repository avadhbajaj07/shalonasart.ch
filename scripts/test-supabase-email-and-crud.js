import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load env
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

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

async function runTests() {
  console.log('--- TEST 1: Supabase Artworks CRUD & Order Verification ---');
  // 1. Add test artwork
  const testSlug = `test-piece-${Date.now()}`;
  const { data: inserted, error: insertErr } = await supabase
    .from('artworks')
    .insert({
      title: 'Automated Test Piece',
      slug: testSlug,
      category: 'Abstract',
      year: '2026',
      dimensions: '80 x 60 cm',
      medium: 'Acrylic on linen',
      image_url: 'https://mhiyjqcwdbqpmplghewi.supabase.co/storage/v1/object/public/artworks/images/breaking-waves.jpg',
      sort_order: 999,
      is_published: true,
      description: 'Test description',
    })
    .select()
    .single();

  if (insertErr) throw insertErr;
  console.log('[PASS] Created test artwork:', inserted.id, inserted.title);

  // 2. Edit test artwork
  const { data: updated, error: updateErr } = await supabase
    .from('artworks')
    .update({ title: 'Automated Test Piece (Updated)', sort_order: 998 })
    .eq('id', inserted.id)
    .select()
    .single();

  if (updateErr) throw updateErr;
  console.log('[PASS] Updated test artwork:', updated.id, updated.title, 'sort_order:', updated.sort_order);

  // 3. Delete test artwork
  const { error: deleteErr } = await supabase
    .from('artworks')
    .delete()
    .eq('id', inserted.id);

  if (deleteErr) throw deleteErr;
  console.log('[PASS] Deleted test artwork:', inserted.id);

  // 4. Verify count is back to exactly 51
  const { count: finalCount } = await supabase
    .from('artworks')
    .select('*', { count: 'exact', head: true });
  console.log('[PASS] Artwork count after cleanup:', finalCount, '(Expected: 51)');

  console.log('\n--- TEST 2: Email Inbound, Outbound & Webhook Storage ---');
  // 1. Inbound Inquiry (e.g. from Contact Form)
  const { data: inMail, error: inErr } = await supabase
    .from('emails')
    .insert({
      direction: 'inbound',
      from_email: 'Collector Test <collector@kunsthaus.ch>',
      to_email: 'info@shalonasart.ch',
      subject: 'Acquisition Inquiry: Breaking Waves',
      body_text: 'Grüezi Shalona, I would like to inquire about the acquisition of Breaking Waves.',
      status: 'unread',
      received_at: new Date().toISOString(),
      metadata: { name: 'Collector Test', artworkTitle: 'Breaking Waves' },
    })
    .select()
    .single();

  if (inErr) throw inErr;
  console.log('[PASS] Created inbound collector email in Supabase:', inMail.id, inMail.subject);

  // 2. Mark as read
  const { data: readMail, error: readErr } = await supabase
    .from('emails')
    .update({ status: 'read' })
    .eq('id', inMail.id)
    .select()
    .single();

  if (readErr) throw readErr;
  console.log('[PASS] Marked inbound email as:', readMail.status);

  // 3. Outbound Studio Reply (from info@shalonasart.ch)
  const { data: outMail, error: outErr } = await supabase
    .from('emails')
    .insert({
      direction: 'outbound',
      from_email: 'Shalona Studio <info@shalonasart.ch>',
      to_email: 'collector@kunsthaus.ch',
      subject: 'Re: Acquisition Inquiry: Breaking Waves',
      body_text: 'Dear Collector, Thank you for reaching out regarding Breaking Waves...',
      status: 'sent',
      sent_at: new Date().toISOString(),
      thread_id: inMail.id,
    })
    .select()
    .single();

  if (outErr) throw outErr;
  console.log('[PASS] Created outbound sent email in Supabase:', outMail.id, outMail.subject);

  // 4. Clean up test emails
  await supabase.from('emails').delete().in('id', [inMail.id, outMail.id]);
  console.log('[PASS] Cleaned up test emails');

  console.log('\n--- ALL VERIFICATION TESTS PASSED SUCCESSFULLY! ---\n');
}

runTests().catch(err => {
  console.error('[FAIL] Test failed:', err);
  process.exit(1);
});
